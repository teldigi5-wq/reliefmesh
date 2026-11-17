/**
 * Thin server-side client for OpenStreetMap's free Nominatim geocoding
 * service. No API key needed, but their usage policy
 * (https://operations.osmfoundation.org/policies/nominatim/) requires a
 * descriptive User-Agent identifying the app (and a way to reach the
 * maintainer) instead of a browser default, and caps us at ~1 request/sec.
 * Calling it from the server also sidesteps CORS, which Nominatim doesn't
 * reliably grant to arbitrary browser origins.
 */

const BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT =
  "ReliefMesh-Hackathon/1.0 (https://github.com/teldigi5-wq/reliefmesh)";

export interface GeoSuggestion {
  label: string;
  lat: number;
  lng: number;
}

export async function searchLocations(query: string): Promise<GeoSuggestion[]> {
  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "0");

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
    // Nominatim is a shared public service; don't let Next.js cache
    // someone else's query results under this one.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Nominatim search failed: ${res.status}`);
  }

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>;

  return data.map((r) => ({
    label: r.display_name,
    lat: Number(r.lat),
    lng: Number(r.lon),
  }));
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const url = new URL(`${BASE_URL}/reverse`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "jsonv2");

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { display_name?: string };
  return data.display_name ?? null;
}
