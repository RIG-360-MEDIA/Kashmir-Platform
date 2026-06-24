from fastapi import APIRouter, HTTPException, Header, Request
from fastapi.responses import RedirectResponse
from app.models.schemas import AirpayCreateRequest, AirpayCreateResponse
from app.services.payments import create_airpay_order, verify_airpay_callback, verify_access_token
from app.config import get_settings

router = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/create-order", response_model=AirpayCreateResponse)
async def create_payment_order(req: AirpayCreateRequest):
    try:
        return create_airpay_order(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@router.post("/callback")
async def airpay_callback(request: Request):
    s = get_settings()
    form = await request.form()
    form_data = dict(form)

    result = verify_airpay_callback(form_data)

    if result.verified and result.access_token:
        return RedirectResponse(
            url=f"{s.frontend_url}/?payment=success&token={result.access_token}#watch",
            status_code=303,
        )

    return RedirectResponse(
        url=f"{s.frontend_url}/?payment=failed#watch",
        status_code=303,
    )


@router.get("/verify-access")
async def check_access(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    claims = verify_access_token(token)
    if not claims:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    return {"valid": True, "expires": claims.get("exp")}
