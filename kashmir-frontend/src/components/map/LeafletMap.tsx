'use client';

import { useEffect, useRef, useState } from 'react';
import type { TimelineEvent } from '@/types/api';

import 'leaflet/dist/leaflet.css';

interface Props {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  onSelectEvent: (event: TimelineEvent | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  political:    '#C97B2B',
  conflict:     '#8B2F3F',
  cultural:     '#4A7B8C',
  humanitarian: '#5A7B5A',
};

/* ─── Line of Control — 14-point accurate polyline ─── */
const LOC_COORDS: [number, number][] = [
  [32.55, 74.35],
  [32.80, 74.05],
  [33.12, 73.88],
  [33.38, 73.68],
  [33.62, 73.66],
  [33.80, 73.82],
  [34.00, 73.88],
  [34.12, 73.97],
  [34.28, 74.15],
  [34.52, 74.68],
  [34.60, 75.42],
  [34.62, 75.92],
  [34.70, 76.32],
  [34.88, 76.82],
];

/* AGPL — Siachen glacier, extends north from NJ9842 */
const AGPL_COORDS: [number, number][] = [
  [34.88, 76.82],
  [35.12, 77.00],
  [35.38, 77.15],
  [35.52, 77.22],
];

/* ─── Territory polygons ─────────────────────────────────────────────────────
   Boundaries follow the LoC on the west side for India-administered territories.
   Approximate but geographically reasonable for documentary use at this zoom.
────────────────────────────────────────────────────────────────────────────── */
const TERRITORIES = [
  {
    id:     'kashmir',
    name:   'Kashmir Valley',
    sub:    'Kashmir Division · J&K UT · India',
    admin:  'India',
    fill:   'rgba(201,123,43,0.20)',
    border: 'rgba(201,123,43,0.55)',
    label:  'rgba(220,140,55,0.95)',
    dash:   undefined as string | undefined,
    coords: [
      /* West/North: LoC from Kashmir-valley entry up to NJ9842 */
      [33.62,73.66],[33.80,73.82],[34.00,73.88],[34.12,73.97],
      [34.28,74.15],[34.52,74.68],[34.60,75.42],[34.62,75.92],
      [34.70,76.32],[34.88,76.82],
      /* East: J&K / Ladakh divide going south */
      [34.55,76.90],[34.20,76.85],[33.80,76.70],[33.40,76.50],
      /* South: Pir Panjal range — the Kashmir/Jammu geographic divide */
      [33.52,75.80],[33.62,75.20],[33.65,74.70],[33.65,74.20],
      /* Close back to LoC entry point */
      [33.65,73.90],[33.62,73.66],
    ] as [number,number][],
  },
  {
    id:     'jammu',
    name:   'Jammu Division',
    sub:    'Jammu Division · J&K UT · India',
    admin:  'India',
    fill:   'rgba(175,105,35,0.13)',
    border: 'rgba(190,120,45,0.40)',
    label:  'rgba(190,130,60,0.85)',
    dash:   undefined as string | undefined,
    coords: [
      /* West: LoC south section up to Kashmir entry */
      [32.55,74.35],[32.80,74.05],[33.12,73.88],[33.38,73.68],[33.62,73.66],
      /* North: Pir Panjal line (Kashmir/Jammu divide) going east */
      [33.65,73.90],[33.65,74.20],[33.65,74.70],[33.62,75.20],[33.52,75.80],
      [33.40,76.50],
      /* East: J&K / Ladakh boundary going south */
      [33.00,76.35],[32.70,76.20],[32.40,76.00],
      /* South: J&K / Himachal / Punjab */
      [32.20,75.50],[32.00,75.10],[31.90,74.90],
      /* International border back to LoC start */
      [32.00,74.60],[32.20,74.40],[32.40,74.35],
    ] as [number,number][],
  },
  {
    id:     'ladakh',
    name:   'Ladakh',
    sub:    'Union Territory · India',
    admin:  'India',
    fill:   'rgba(201,123,43,0.07)',
    border: 'rgba(201,123,43,0.28)',
    label:  'rgba(201,123,43,0.65)',
    dash:   undefined as string | undefined,
    coords: [
      /* West: J&K / Ladakh divide */
      [34.88,76.82],[34.55,76.90],[34.20,76.85],[33.80,76.70],
      [33.40,76.50],[33.00,76.35],[32.70,76.20],[32.40,76.00],[32.20,75.50],
      /* South: Ladakh / HP */
      [32.20,77.50],[32.30,77.00],
      /* South-east: Ladakh deep south */
      [32.50,79.00],[32.80,79.50],
      /* East: Line of Actual Control (India–China) */
      [33.00,79.80],[33.50,80.20],[34.00,80.50],[34.50,80.50],
      [35.00,80.20],[35.30,79.50],
      /* North: Siachen / Karakoram */
      [35.80,78.20],[35.52,77.22],
      /* AGPL back to NJ9842 */
      [35.38,77.15],[35.12,77.00],[34.88,76.82],
    ] as [number,number][],
  },
  {
    id:     'ajk',
    name:   'Azad Kashmir',
    sub:    'Administered by Pakistan',
    admin:  'Pakistan',
    fill:   'rgba(74,123,140,0.16)',
    border: 'rgba(74,123,140,0.50)',
    label:  'rgba(74,123,140,0.9)',
    dash:   '5 4',
    coords: [
      /* LoC — east boundary (north→south) */
      [34.28,74.15],[34.12,73.97],[34.00,73.88],[33.80,73.82],
      [33.62,73.66],[33.38,73.68],[33.12,73.88],[32.80,74.05],
      [32.55,74.35],
      /* South / International border */
      [32.30,74.20],[32.10,73.95],[32.00,73.60],
      /* West: AJK / KPK / Punjab */
      [32.20,73.20],[32.70,73.00],[33.20,72.95],[33.70,73.05],
      [34.00,73.20],[34.30,73.45],
      /* North: AJK / GB */
      [34.50,73.65],[34.28,74.15],
    ] as [number,number][],
  },
  {
    id:     'gb',
    name:   'Gilgit-Baltistan',
    sub:    'Administered by Pakistan',
    admin:  'Pakistan',
    fill:   'rgba(74,123,140,0.10)',
    border: 'rgba(74,123,140,0.30)',
    label:  'rgba(74,123,140,0.70)',
    dash:   '5 4',
    coords: [
      /* South: AJK/GB + LoC north section */
      [34.28,74.15],[34.52,74.68],[34.60,75.42],[34.62,75.92],
      [34.70,76.32],[34.88,76.82],
      /* AGPL going north */
      [35.12,77.00],[35.38,77.15],[35.52,77.22],
      /* East: GB / China / Ladakh */
      [35.80,77.60],[36.00,77.20],
      /* North: toward Wakhan / Xinjiang */
      [36.50,75.50],[37.00,74.50],[37.10,73.50],
      /* West: GB / KPK */
      [36.70,72.70],[36.20,72.10],[35.80,72.00],
      [35.30,72.20],[35.00,73.00],
      /* Back to AJK boundary */
      [34.50,73.65],[34.30,73.45],[34.28,74.15],
    ] as [number,number][],
  },
  {
    id:     'aksai',
    name:   'Aksai Chin',
    sub:    'Administered by China · Claimed by India',
    admin:  'China',
    fill:   'rgba(139,47,63,0.13)',
    border: 'rgba(139,47,63,0.40)',
    label:  'rgba(139,47,63,0.80)',
    dash:   '5 4',
    coords: [
      /* West: India's claimed LAC */
      [32.80,79.50],[33.00,79.80],[33.50,80.20],[34.00,80.50],
      [34.50,80.50],[35.00,80.20],[35.30,79.50],[35.80,78.20],
      /* North */
      [35.80,80.00],[36.00,82.00],
      /* East */
      [35.00,82.00],[34.00,81.50],[33.00,81.00],
      [32.50,80.00],[32.80,79.50],
    ] as [number,number][],
  },
];

/* ─── Territory label centroid positions ─── */
const TERRITORY_LABEL_POS: Record<string, [number, number]> = {
  kashmir: [34.20, 74.90],
  jammu:   [32.90, 75.00],
  ladakh:  [34.10, 78.20],
  ajk:     [33.80, 73.52],
  gb:      [35.55, 74.20],
  aksai:   [34.40, 80.80],
};

/* ─── Cities ─── */
const CITIES = [
  { name:'Srinagar',     note:'Summer Capital',   lat:34.09, lng:74.80, admin:'india'    as const },
  { name:'Jammu',        note:'Winter Capital',    lat:32.73, lng:74.86, admin:'india'    as const },
  { name:'Leh',          note:'Capital · Ladakh',  lat:34.15, lng:77.58, admin:'india'    as const },
  { name:'Kargil',       note:'Kargil District',   lat:34.55, lng:76.13, admin:'india'    as const },
  { name:'Baramulla',    note:'North Kashmir',     lat:34.21, lng:74.34, admin:'india'    as const },
  { name:'Poonch',       note:'Near LoC',          lat:33.77, lng:74.09, admin:'india'    as const },
  { name:'Anantnag',     note:'South Kashmir',     lat:33.73, lng:75.15, admin:'india'    as const },
  { name:'Muzaffarabad', note:'Capital · AJK',     lat:34.37, lng:73.47, admin:'pakistan' as const },
  { name:'Mirpur',       note:'South AJK',         lat:33.14, lng:73.75, admin:'pakistan' as const },
  { name:'Gilgit',       note:'Capital · GB',      lat:35.92, lng:74.31, admin:'pakistan' as const },
] as const;

/* ─── Deterministic jitter for collocated events ─── */
function buildJitterMap(events: TimelineEvent[]): Map<string, [number, number]> {
  const mappable = events.filter(e => e.lat != null && e.lng != null);
  const groups = new Map<string, TimelineEvent[]>();
  mappable.forEach(e => {
    const key = `${(e.lat! * 10).toFixed(0)},${(e.lng! * 10).toFixed(0)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  });
  const out = new Map<string, [number, number]>();
  groups.forEach(group => {
    if (group.length === 1) {
      const e = group[0];
      out.set(`${e.year}|${e.title}`, [e.lat!, e.lng!]);
    } else {
      group.forEach((e, i) => {
        const angle = (Math.PI * 2 * i) / group.length - Math.PI / 2;
        out.set(`${e.year}|${e.title}`, [
          e.lat! + Math.sin(angle) * 0.07,
          e.lng! + Math.cos(angle) * 0.07,
        ]);
      });
    }
  });
  return out;
}

/* ─── DivIcon factory ─── */
function makeIcon(
  L: typeof import('leaflet'),
  color: string,
  isConflict: boolean,
  isSelected: boolean,
): ReturnType<typeof L.divIcon> {
  const sz   = isSelected ? 14 : 8;
  const ring = isConflict && !isSelected
    ? `<div class="loc-ring" style="border-color:${color}"></div>`
    : '';
  return L.divIcon({
    html: `<div class="loc-pin ${isSelected ? 'loc-pin--sel' : ''}">
        ${ring}
        <div class="loc-dot" style="
          width:${sz}px;height:${sz}px;background:${color};
          box-shadow:${isSelected
            ? `0 0 0 3px ${color}55,0 0 16px ${color}60,0 2px 8px rgba(0,0,0,0.9)`
            : `0 0 4px rgba(0,0,0,0.7)`};
          border:${isSelected ? '2px solid rgba(255,255,255,0.85)' : '1px solid rgba(255,255,255,0.22)'};
        "></div>
      </div>`,
    className: '',
    iconSize:   [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  });
}

type LMarker    = ReturnType<typeof import('leaflet')['marker']>;
type LLayerGroup = ReturnType<typeof import('leaflet')['layerGroup']>;

export default function LeafletMap({ events, selectedEvent, onSelectEvent }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);
  const markerGroupRef  = useRef<LLayerGroup | null>(null);
  const pinsRef         = useRef<{ marker: LMarker; event: TimelineEvent }[]>([]);
  /* Always-current callback ref so marker clicks don't close over stale props */
  const onSelectRef     = useRef(onSelectEvent);
  onSelectRef.current   = onSelectEvent;
  /* Gates the markers effect until the async map init has finished */
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      /* Guard against React StrictMode's double-invoke: the map is created inside
         this async callback, so two queued callbacks could otherwise initialize the
         same container twice ("Map container is already initialized"). */
      if (mapRef.current || !containerRef.current) return;

      /* ── Shared CSS ── */
      if (!document.getElementById('kashmir-map-styles')) {
        const s = document.createElement('style');
        s.id = 'kashmir-map-styles';
        s.textContent = `
          .leaflet-tile-pane { filter:brightness(0.80) contrast(1.10) saturate(0.65); }

          .loc-pin  { position:relative;display:flex;align-items:center;justify-content:center; }
          .loc-dot  { border-radius:50%;transition:transform 120ms,box-shadow 120ms;cursor:pointer; }
          .loc-pin:hover .loc-dot { transform:scale(1.4); }

          .loc-ring {
            position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:8px;height:8px;border-radius:50%;
            border:1.5px solid transparent;
            animation:loc-pulse 2.4s ease-out infinite;
            pointer-events:none;
          }
          @keyframes loc-pulse {
            0%   { transform:translate(-50%,-50%) scale(1);   opacity:0.75; }
            100% { transform:translate(-50%,-50%) scale(3.2); opacity:0; }
          }
          .loc-pin--sel .loc-dot { animation:loc-sel-beat 1.8s ease-in-out infinite; }
          @keyframes loc-sel-beat {
            0%,100% { transform:scale(1); }
            50%      { transform:scale(1.12); }
          }

          .leaflet-kashmir-tooltip {
            background:none!important;border:none!important;
            box-shadow:none!important;padding:0!important;
          }
          .leaflet-tooltip-top::before { display:none!important; }

          .leaflet-control-attribution {
            background:rgba(10,12,15,0.82)!important;color:#3A3F47!important;
            font-size:8px!important;padding:2px 6px!important;border-radius:3px!important;
          }
          .leaflet-control-zoom a {
            background:rgba(22,26,31,0.95)!important;color:#C97B2B!important;
            border-color:#2A2E34!important;font-size:16px!important;line-height:26px!important;
          }
          .leaflet-control-zoom a:hover { background:rgba(201,123,43,0.12)!important; }
        `;
        document.head.appendChild(s);
      }

      const map = L.map(containerRef.current!, {
        center: [33.8, 76.0],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
        minZoom: 5,
        maxZoom: 14,
        maxBounds: [[26.0, 65.0], [40.0, 88.0]],
        maxBoundsViscosity: 0.7,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB', subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);

      /* ── Territory polygons with hover tooltips ── */
      /* Territory fills — non-interactive so they never block event marker clicks */
      TERRITORIES.forEach(t => {
        L.polygon(t.coords, {
          fillColor:   t.fill,
          fillOpacity: 1,
          color:       t.border,
          weight:      1,
          opacity:     0.7,
          dashArray:   t.dash,
          interactive: false,
        }).addTo(map);
      });

      /* ── Internal administrative boundaries ── */

      /* International border: India/Pakistan south of LoC */
      L.polyline([
        [32.55,74.35],[32.30,74.30],[32.10,74.00],[32.00,73.70],
      ], { color:'rgba(200,200,200,0.50)', weight:1.5, dashArray:'2 5', interactive: false }).addTo(map);

      /* J&K / Ladakh internal divide */
      L.polyline([
        [34.88,76.82],[34.55,76.90],[34.20,76.85],[33.80,76.70],
        [33.40,76.50],[33.00,76.35],[32.70,76.20],[32.40,76.00],[32.20,75.50],
      ], { color:'rgba(201,123,43,0.28)', weight:1, dashArray:'4 6', interactive: false }).addTo(map);

      /* Pir Panjal — Kashmir / Jammu divide within J&K */
      L.polyline([
        [33.62,73.66],[33.65,73.90],[33.65,74.20],[33.65,74.70],
        [33.62,75.20],[33.52,75.80],[33.40,76.50],
      ], { color:'rgba(201,123,43,0.50)', weight:1.2, dashArray:'3 5', interactive: false }).addTo(map);

      /* AJK / GB internal divide */
      L.polyline([
        [34.28,74.15],[34.50,73.65],[34.30,73.45],
        [34.00,73.20],[33.70,73.05],[33.20,72.95],
      ], { color:'rgba(74,123,140,0.30)', weight:1, dashArray:'4 6', interactive: false }).addTo(map);

      /* ── LoC — the most prominent geographic feature ── */
      L.polyline(LOC_COORDS, {
        color: 'rgba(192,56,74,0.20)', weight: 10, opacity: 1, interactive: false,
      }).addTo(map);
      L.polyline(LOC_COORDS, {
        color: '#C0384A', weight: 2.5, opacity: 0.92, dashArray: '8 5', interactive: false,
      }).addTo(map);

      /* NJ9842 terminal */
      L.circleMarker([34.88, 76.82], {
        radius: 3, fillColor: '#C0384A',
        color: 'rgba(255,255,255,0.5)', weight: 1, fillOpacity: 1, interactive: false,
      }).addTo(map);

      /* AGPL */
      L.polyline(AGPL_COORDS, {
        color: '#C0384A', weight: 1.5, opacity: 0.5, dashArray: '3 7', interactive: false,
      }).addTo(map);

      /* LoC rotated label */
      L.marker([33.80, 73.86], {
        icon: L.divIcon({
          html: `<div style="font-family:'Space Mono','Courier New',monospace;font-size:8px;letter-spacing:0.20em;color:rgba(192,56,74,0.85);text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 4px rgba(0,0,0,0.95);transform:rotate(-58deg)">LINE OF CONTROL</div>`,
          className: '', iconAnchor: [52, 4],
        }), interactive: false,
      }).addTo(map);

      /* AGPL label */
      L.marker([35.24, 77.10], {
        icon: L.divIcon({
          html: `<div style="font-family:'Space Mono','Courier New',monospace;font-size:8px;letter-spacing:0.20em;color:rgba(192,56,74,0.6);text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.95)">AGPL · SIACHEN</div>`,
          className: '', iconAnchor: [44, 6],
        }), interactive: false,
      }).addTo(map);

      /* ── Territory name labels — pure text, no background box ── */
      TERRITORIES.forEach(t => {
        const pos = TERRITORY_LABEL_POS[t.id];
        if (!pos) return;
        L.marker(pos, {
          icon: L.divIcon({
            html: `<div style="
              font-family:'Space Mono','Courier New',monospace;font-size:8px;letter-spacing:0.20em;
              color:${t.label};text-transform:uppercase;white-space:nowrap;
              text-shadow:0 0 10px rgba(0,0,0,1),0 0 5px rgba(0,0,0,0.95),0 1px 3px rgba(0,0,0,0.9);
              pointer-events:none;
            ">${t.name}</div>`,
            className: '', iconAnchor: [50, 6],
          }), interactive: false,
        }).addTo(map);
      });

      /* ── City markers ── */
      CITIES.forEach(city => {
        const isIndia = city.admin === 'india';
        const dotC    = isIndia ? 'rgba(201,123,43,0.8)' : 'rgba(74,123,140,0.8)';
        const txtC    = isIndia ? 'rgba(245,240,232,0.60)' : 'rgba(74,123,140,0.75)';

        L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            html: `<div style="pointer-events:none;font-family:'Space Mono','Courier New',monospace;font-size:8px;letter-spacing:0.12em;color:${txtC};text-shadow:0 0 8px rgba(0,0,0,1),0 1px 3px rgba(0,0,0,0.98);white-space:nowrap;text-transform:uppercase">${city.name}</div>`,
            className: '', iconAnchor: [20, 10],
          }), interactive: false,
        }).addTo(map);
      });

      /* Siachen */
      L.marker([35.42, 77.10], {
        icon: L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none">
            <div style="font-size:13px;line-height:1;text-shadow:0 0 6px rgba(0,0,0,0.9)">❄</div>
            <div style="font-family:'Space Mono','Courier New',monospace;font-size:8px;letter-spacing:0.12em;color:rgba(139,47,63,0.65);text-shadow:0 1px 3px rgba(0,0,0,0.9);white-space:nowrap;text-transform:uppercase">SIACHEN</div>
          </div>`,
          className: '', iconAnchor: [14, 8],
        }), interactive: false,
      }).addTo(map);

      /* ── Event marker layer (populated reactively by the events useEffect) ── */
      markerGroupRef.current = L.layerGroup().addTo(map);
      setMapReady(true);

      /* ── Legend — compact (territories labeled on map directly) ── */
      const legend = new L.Control({ position: 'bottomleft' });
      legend.onAdd = () => {
        const d = document.createElement('div');
        d.innerHTML = `
          <div style="background:rgba(10,12,15,0.86);border:1px solid rgba(255,255,255,0.07);border-radius:4px;padding:8px 10px;font-family:'Space Mono','Courier New',monospace;font-size:7.5px;letter-spacing:0.12em;color:#6B7280">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="width:16px;border-top:1.5px dashed rgba(192,56,74,0.75)"></div>
              <span style="color:rgba(192,56,74,0.70);text-transform:uppercase;letter-spacing:0.16em">Line of Control</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px">
              <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#8B2F3F;flex-shrink:0"></div><span>Conflict</span></div>
              <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#C97B2B;flex-shrink:0"></div><span>Political</span></div>
              <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#4A7B8C;flex-shrink:0"></div><span>Cultural</span></div>
              <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#5A7B5A;flex-shrink:0"></div><span>Humanitarian</span></div>
            </div>
          </div>
        `;
        return d;
      };
      legend.addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('© CartoDB · Boundaries approximate')
        .addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current       = null;
        markerGroupRef.current = null;
        pinsRef.current      = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Reactive markers: re-runs whenever filter changes or map becomes ready ── */
  useEffect(() => {
    if (!mapReady || !markerGroupRef.current) return;
    import('leaflet').then(L => {
      const group = markerGroupRef.current!;
      group.clearLayers();
      pinsRef.current = [];

      const jitterMap = buildJitterMap(events);
      events.forEach(event => {
        if (event.lat == null || event.lng == null) return; /* skip events with no coordinates */
        const color      = CATEGORY_COLORS[event.category] ?? '#C97B2B';
        const isConflict = event.category === 'conflict';
        const isSelected = selectedEvent?.year === event.year && selectedEvent?.title === event.title;
        const pos        = jitterMap.get(`${event.year}|${event.title}`) ?? [event.lat, event.lng];

        const marker = L.marker(pos as [number, number], {
          icon:        makeIcon(L, color, isConflict, isSelected),
          zIndexOffset: isSelected ? 1000 : 0,
        });

        marker.bindTooltip(`
          <div style="background:rgba(10,12,15,0.97);border:1px solid ${color}55;padding:9px 13px;border-radius:5px;font-family:'Space Mono','Courier New',monospace;min-width:200px;max-width:260px">
            <div style="font-size:10px;letter-spacing:0.20em;text-transform:uppercase;color:${color};margin-bottom:4px">${event.category}</div>
            <div style="font-size:13px;color:#F5F0E8;margin-bottom:3px;font-family:'Playfair Display',Georgia,serif;font-style:italic;line-height:1.35">${event.year} — ${event.title}</div>
            <div style="font-size:10px;color:#6B7280;letter-spacing:0.20em;margin-bottom:6px">◎ ${event.place}</div>
            <div style="font-size:10px;color:#C5BFB3;line-height:1.55;font-family:'DM Sans',system-ui,sans-serif">${event.description.slice(0, 120)}…</div>
          </div>
        `, { direction: 'top', offset: [0, -8], opacity: 1, className: 'leaflet-kashmir-tooltip' });

        marker.on('click', () => onSelectRef.current(event));
        marker.addTo(group);
        pinsRef.current.push({ marker, event });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, mapReady]);

  /* ── Selection highlight + flyTo: runs only when selected event changes ── */
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      pinsRef.current.forEach(({ marker, event }) => {
        const color      = CATEGORY_COLORS[event.category] ?? '#C97B2B';
        const isConflict = event.category === 'conflict';
        const isSelected = selectedEvent?.year === event.year && selectedEvent?.title === event.title;
        marker.setIcon(makeIcon(L, color, isConflict, isSelected));
        marker.setZIndexOffset(isSelected ? 1000 : 0);
        if (isSelected && mapRef.current && event.lat != null && event.lng != null) {
          mapRef.current.flyTo([event.lat, event.lng], 10, { animate: true, duration: 1.5 });
        }
      });
    });
  }, [selectedEvent]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', backgroundColor: '#0A0C0F' }}
    />
  );
}
