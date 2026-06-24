import hashlib
import time
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.config import get_settings
from app.models.schemas import (
    AirpayCreateRequest,
    AirpayCreateResponse,
    PaymentVerifyResponse,
)


def _clean(val: str) -> str:
    return val.strip().strip("'\"")


def create_airpay_order(req: AirpayCreateRequest) -> AirpayCreateResponse:
    s = get_settings()

    merchant_id = _clean(s.airpay_merchant_id)
    username = _clean(s.airpay_username)
    password = _clean(s.airpay_password)
    api_key = _clean(s.airpay_api_key)

    txn_id = f"KFP{int(time.time())}"
    amount = str(s.documentary_price_inr)
    currency = "356"  # INR

    private_key = hashlib.sha256(
        f"{api_key}@{username}:|:{password}".encode()
    ).hexdigest()

    s_key = hashlib.sha256(
        f"{username}~:~{password}".encode()
    ).hexdigest()

    buyer_data = "~:~".join([
        req.email, req.name, req.name, "",
        req.address, req.city, req.state, req.country, amount,
        txn_id, currency, "0", "INR", "0",
        req.phone, req.pin_code,
    ])
    checksum = hashlib.sha256(
        f"{s_key}@{buyer_data}".encode()
    ).hexdigest()

    form_fields = {
        "mercid": merchant_id,
        "orderid": txn_id,
        "amount": amount,
        "currency": currency,
        "isocurrency": "INR",
        "chmod": "0",
        "buyerEmail": req.email,
        "buyerPhone": req.phone,
        "buyerFirstName": req.name,
        "buyerLastName": "",
        "buyerAddress": req.address,
        "buyerCity": req.city,
        "buyerState": req.state,
        "buyerCountry": req.country,
        "buyerPinCode": req.pin_code,
        "privatekey": private_key,
        "checksum": checksum,
        "txnsubtype": "",
    }

    return AirpayCreateResponse(
        transaction_id=txn_id,
        post_url=s.airpay_base_url,
        form_fields=form_fields,
    )


def verify_airpay_callback(form_data: dict) -> PaymentVerifyResponse:
    s = get_settings()
    secret = _clean(s.airpay_secret_key)

    txn_id = form_data.get("TRANSACTIONID", "")
    ap_txn_id = form_data.get("APTRANSACTIONID", "")
    amount = form_data.get("AMOUNT", "")
    status = form_data.get("TRANSACTIONSTATUS", "")
    message = form_data.get("MESSAGE", "")
    ap_hash = form_data.get("ap_SecureHash", "")

    verify_str = f"{txn_id}:{ap_txn_id}:{amount}:{status}:{message}:{secret}"
    expected = hashlib.sha256(verify_str.encode()).hexdigest()

    if expected != ap_hash:
        return PaymentVerifyResponse(verified=False, message="Invalid checksum")

    if str(status) != "200":
        return PaymentVerifyResponse(verified=False, message=f"Payment failed: {message}")

    expire = datetime.now(timezone.utc) + timedelta(minutes=s.access_token_expire_minutes)
    token = jwt.encode(
        {"sub": ap_txn_id or txn_id, "exp": expire},
        s.jwt_secret,
        algorithm=s.jwt_algorithm,
    )
    return PaymentVerifyResponse(verified=True, access_token=token, message="Payment verified")


def verify_access_token(token: str) -> dict | None:
    s = get_settings()
    try:
        return jwt.decode(token, s.jwt_secret, algorithms=[s.jwt_algorithm])
    except JWTError:
        return None
