import dayjs from 'dayjs';
const USE_MOCK = true;

const simulateNetwork = (min=400, max=1600, failRate=0.08) => new Promise((resolve, reject) => {
  const ms = Math.floor(Math.random()*(max-min)+min);
  setTimeout(() => { (Math.random() < failRate) ? reject(new Error('Network error')) : resolve(); }, ms);
});

export const METALS = [
  { key: 'gold',       symbol: 'XAU', name: 'Gold',      carat: '24K' },
  { key: 'silver',     symbol: 'XAG', name: 'Silver',    carat: 'Fine' },
  { key: 'platinum',   symbol: 'XPT', name: 'Platinum',  carat: 'Pure' },
  { key: 'palladium',  symbol: 'XPD', name: 'Palladium', carat: 'Pure' },
];

const base = { gold: 1178, silver: 12.50, platinum: 436.65, palladium: 357.91 };
function jitter(n, pct=0.01){ const j=n*pct; return +(n + (Math.random()*2-1)*j).toFixed(2); }

function buildPricePayload(metal) {
  const now = dayjs();
  const open = jitter(base[metal] * (1 + (Math.random()*0.02-0.01)));
  const close = jitter(open * (1 + (Math.random()*0.01-0.005)));
  const price = jitter(close * (1 + (Math.random()*0.006-0.003)));

  return {
    metal,
    symbol: METALS.find(m => m.key === metal)?.symbol ?? metal.toUpperCase(),
    unit: "USD/oz",
    price,
    previous_open: open,
    previous_close: close,
    timestamp_iso: now.toISOString(),
    date: now.format('YYYY-MM-DD'),
    time: now.format('HH:mm:ss'),
  };
}

export async function fetchMetalPrice(metal){
  if (USE_MOCK) { await simulateNetwork(); return buildPricePayload(metal); }
  const key = process.env.EXPO_PUBLIC_GOLDAPI_KEY;
  const baseUrl = process.env.EXPO_PUBLIC_GOLDAPI_HOST || 'https://www.goldapi.io/api';
  if (!key) throw new Error('Missing EXPO_PUBLIC_GOLDAPI_KEY');
  const sym = METALS.find(m => m.key === metal)?.symbol ?? 'XAU';
  const url = `${baseUrl}/${sym}/USD`;
  const res = await fetch(url, { headers: { 'x-access-token': key, 'Content-Type': 'application/json' } });
  if (!res.ok) { const text = await res.text(); throw new Error(`API ${res.status}: ${text}`); }
  const json = await res.json();
  const now = dayjs();
  return {
    metal, symbol: sym, unit: "INR/oz",
    price: json.price ?? json.ask ?? json.last,
    previous_open: json.open_price ?? json.open,
    previous_close: json.prev_close_price ?? json.prev_close,
    timestamp_iso: now.toISOString(),
    date: now.format('YYYY-MM-DD'), time: now.format('HH:mm:ss'),
  };
}
