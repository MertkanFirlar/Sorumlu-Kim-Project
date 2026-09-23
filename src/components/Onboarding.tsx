import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, X, Loader2 } from 'lucide-react';
import { geocodeSearch, GeoPlace } from '../services/roadService';

interface OnboardingProps {
  isGpsLoading: boolean;
  onUseGps: () => void;
  onSearchLocation: (place: GeoPlace) => void;
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  isGpsLoading,
  onUseGps,
  onSearchLocation,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<any>(null);

  // Debounced geocoding as the user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const places = await geocodeSearch(query);
      setResults(places);
      setSearching(false);
    }, 400);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs sk-fade-in z-[60] flex items-center justify-center p-4">
      <div className="sk-pop-in bg-white rounded-2xl border border-neutral-200 w-full max-w-md shadow-2xl overflow-hidden text-[#121212]">
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-black transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#121212] rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Sorumlu Kim?</h2>
              <p className="text-xs text-neutral-500">Bir yol seç, sorumlu kurumu öğren.</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
            Başlamak için konumunu kullan ya da bir cadde / mahalle / il ara.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* GPS */}
          <button
            onClick={onUseGps}
            disabled={isGpsLoading}
            className="w-full flex items-center gap-3 bg-[#1D4ED8] hover:bg-[#1a44bd] text-white rounded-xl px-4 py-3 transition disabled:opacity-70"
          >
            <Navigation className={`w-5 h-5 shrink-0 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span className="text-left">
              <span className="block text-sm font-bold">
                {isGpsLoading ? 'Konum alınıyor…' : 'Konumumu Kullan'}
              </span>
              <span className="block text-[11px] text-blue-100">En yakın yolu otomatik bul</span>
            </span>
          </button>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex-1 h-px bg-neutral-200" />
            veya
            <span className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Address search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              {searching && <Loader2 className="w-4 h-4 text-neutral-400 absolute right-3 animate-spin" />}
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cadde, mahalle veya il ara…"
                className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-200 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>

            {results.length > 0 && (
              <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-neutral-200 divide-y divide-neutral-100">
                {results.map((place, i) => (
                  <button
                    key={`${place.lat}-${place.lng}-${i}`}
                    onClick={() => onSearchLocation(place)}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-neutral-100 transition"
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${place.isRoad ? 'text-[#1D4ED8]' : 'text-neutral-400'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold truncate">
                        {place.title}
                        {place.isRoad && (
                          <span className="ml-1.5 text-[9px] font-bold text-[#1D4ED8] bg-blue-50 px-1 py-0.5 rounded">YOL</span>
                        )}
                      </span>
                      <span className="block text-[11px] text-neutral-500 truncate">{place.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!searching && query.trim().length >= 3 && results.length === 0 && (
              <p className="mt-2 text-[11px] text-neutral-400 px-1">Sonuç bulunamadı. Farklı bir arama dene.</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-neutral-500 hover:text-black py-1.5 transition"
          >
            Şimdilik geç, haritayı keşfet
          </button>
        </div>
      </div>
    </div>
  );
};
