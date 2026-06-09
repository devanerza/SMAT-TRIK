"use client";
import { useState } from "react";
import { useLocationSearch } from "@/hooks/useLocationSearch";

export default function LocationSearch({ value, onChange, error }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading } = useLocationSearch(query);

  function handleSelect(place) {
    const location = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      address_label: place.display_name,
      address_detail: value?.address_detail ?? "",
      maps_link: `https://www.google.com/maps?q=${place.lat},${place.lon}`,
    };
    setQuery("");
    setOpen(false);
    onChange(location);
  }

  function handleReset() {
    setQuery("");
    setOpen(false);
    onChange(null);
  }

  function handleDetail(e) {
    const updated = { ...value, address_detail: e.target.value };
    onChange(updated);
  }

  if (value) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 p-3 bg-base-200 rounded-box text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-base-content leading-snug break-words">{value.address_label}</p>
            <a href={value.maps_link} target="_blank" rel="noopener noreferrer"
              className="link link-primary text-xs mt-1 inline-block">
              Buka di Google Maps ↗
            </a>
          </div>
          <button type="button" onClick={handleReset} className="btn btn-ghost btn-xs text-error shrink-0">
            Ubah
          </button>
        </div>

        <input
          type="text"
          className="input input-bordered input-sm w-full"
          placeholder="Detail: No. rumah, RT/RW, patokan..."
          value={value.address_detail}
          onChange={handleDetail}
        />
        <label className="label pt-0">
          <span className="label-text-alt text-base-content/40">Tambahkan detail agar teknisi mudah menemukan lokasi</span>
        </label>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
        placeholder="Cari alamat, jalan, atau kelurahan..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="loading loading-spinner loading-xs text-base-content/30" />
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-base-100 border border-base-300 rounded-box shadow-lg">
          {results.map((place) => (
            <li
              key={place.place_id}
              onMouseDown={() => handleSelect(place)}
              className="flex items-start gap-2 px-4 py-3 cursor-pointer text-sm hover:bg-base-200 border-b border-base-200 last:border-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="leading-snug">{place.display_name}</span>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
