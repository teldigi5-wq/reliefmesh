"use client";

import { useEffect, useRef, useState } from "react";
import { inputClass, labelClass } from "@/components/ui/field-styles";

interface GeoSuggestion {
  label: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string) => void;
  coords: { lat: number; lng: number } | null;
  onCoordsChange: (coords: { lat: number; lng: number } | null) => void;
}

// Debounce delay for the address-search autocomplete. Nominatim (the free
// geocoding service backing this) asks callers to stay around 1 request/sec,
// so this also has to be long enough that fast typing doesn't blow through
// that budget — not just "feels responsive".
const SEARCH_DEBOUNCE_MS = 450;

export function LocationPicker({
  address,
  onAddressChange,
  coords,
  onCoordsChange,
}: LocationPickerProps) {
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  // Debounced address-search: fires SEARCH_DEBOUNCE_MS after the user
  // stops typing, and ignores any response that isn't for the latest
  // request (guards against an earlier, slower request landing after a
  // newer one and clobbering its results).
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (address.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;
      setSearching(true);
      try {
        const res = await fetch(
          `/api/geo/search?q=${encodeURIComponent(address.trim())}`
        );
        if (!res.ok) return;
        const data: GeoSuggestion[] = await res.json();
        if (requestIdRef.current === thisRequestId) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch {
        // Silent — autocomplete suggestions are a convenience, not
        // required; the manual lat/lng fields below still work.
      } finally {
        if (requestIdRef.current === thisRequestId) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  function selectSuggestion(s: GeoSuggestion) {
    onAddressChange(s.label);
    onCoordsChange({ lat: s.lat, lng: s.lng });
    setShowSuggestions(false);
    setSuggestions([]);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setNotice("Geolocation isn't available in this browser — enter a location manually.");
      return;
    }
    setLocating(true);
    setNotice(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onCoordsChange({ lat, lng });

        try {
          const res = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const data: { label: string | null } = await res.json();
            if (data.label) onAddressChange(data.label);
          }
        } catch {
          // Coordinates are already set either way; a missing address
          // label just means the operator sees numbers instead of a name.
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setNotice(
          err.code === err.PERMISSION_DENIED
            ? "Location access was denied — search for a location or enter coordinates manually."
            : "Couldn't get your location — search for a location or enter coordinates manually."
        );
        setLocating(false);
      }
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Location</span>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline disabled:opacity-50"
        >
          {locating ? "Locating..." : "Use my current location"}
        </button>
      </div>

      <div className="relative mt-3">
        <label className="block text-sm">
          <span className={labelClass}>Search for a location, or type an address</span>
          <input
            name="address"
            className={inputClass}
            placeholder="e.g. Galle Face Green, Colombo"
            value={address}
            autoComplete="off"
            onChange={(e) => onAddressChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay so a click on a suggestion registers before the list
              // disappears (blur fires before click on most browsers).
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />
        </label>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {searching && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Searching…</p>
        )}
      </div>

      {notice && <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{notice}</p>}

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className={labelClass}>Latitude</span>
          <input
            name="latitude"
            type="number"
            step="any"
            required
            className={inputClass}
            value={coords?.lat ?? ""}
            onChange={(e) =>
              onCoordsChange({
                lat: Number(e.target.value),
                lng: coords?.lng ?? 0,
              })
            }
          />
        </label>
        <label className="block text-sm">
          <span className={labelClass}>Longitude</span>
          <input
            name="longitude"
            type="number"
            step="any"
            required
            className={inputClass}
            value={coords?.lng ?? ""}
            onChange={(e) =>
              onCoordsChange({
                lat: coords?.lat ?? 0,
                lng: Number(e.target.value),
              })
            }
          />
        </label>
      </div>
    </div>
  );
}
