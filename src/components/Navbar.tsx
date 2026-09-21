import React, { useState } from 'react';
import { 
  Search, 
  Navigation, 
  Map, 
  MessageSquare, 
  Flame, 
  FileText, 
  BarChart3, 
  Layers, 
  CheckSquare, 
  X,
  Building2,
  ShieldAlert,
  Wrench,
  Globe,
  ChevronDown,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { AuthorityType, StreetSegment, ViewTab } from '../types';
import { AUTHORITIES_META } from '../data/mockData';
import { TURKEY_PROVINCES } from '../services/roadService';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  streets: StreetSegment[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  activeAuthorityFilter: AuthorityType | 'ALL';
  onSelectAuthorityFilter: (auth: AuthorityType | 'ALL') => void;
  onSelectStreet: (street: StreetSegment) => void;
  onUseGps: () => void;
  isGpsLoading: boolean;
  isMultiSelectMode: boolean;
  onToggleMultiSelectMode: () => void;
  multiSelectedCount: number;
  utilityWorksCount?: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  streets,
  selectedCity,
  onSelectCity,
  activeAuthorityFilter,
  onSelectAuthorityFilter,
  onSelectStreet,
  onUseGps,
  isGpsLoading,
  isMultiSelectMode,
  onToggleMultiSelectMode,
  multiSelectedCount,
  utilityWorksCount = 0,
  theme,
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Custom city dropdown state
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const filteredProvinces = TURKEY_PROVINCES.filter(
    (p) => p.name.toLowerCase().includes(citySearch.toLowerCase()) || p.code.includes(citySearch)
  );
  const showAllOption =
    citySearch === '' || 'tüm türkiye'.includes(citySearch.toLowerCase());
  const selectCity = (city: string) => {
    onSelectCity(city);
    setIsCityOpen(false);
    setCitySearch('');
  };
  const cityItemClass = (val: string) =>
    `w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition ${
      selectedCity === val ? 'bg-blue-50 text-[#1D4ED8] font-semibold' : 'text-[#121212] hover:bg-neutral-100'
    }`;

  // Search filter
  const searchResults = searchQuery.trim()
    ? streets.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.neighborhood.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <header className="bg-white border-b border-neutral-300 shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Top Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand and Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('harita')}>
            <div className="w-9 h-9 bg-[#121212] rounded-xl flex items-center justify-center font-bold text-white shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight uppercase text-[#121212]">
                  Sorumlu Kim?
                </span>
                <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xl border border-neutral-300">
                  T.C. YOL REJİMİ
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
                Cadde, Sokak ve Otoyol Belediye / İdare Sorumluluk Haritası
              </p>
            </div>
          </div>

          {/* Mobile quick actions */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              title="Gece / Gündüz modu"
              aria-label="Gece / Gündüz modu"
              className="flex items-center justify-center w-9 h-9 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1D4ED8]" />}
            </button>
            <button
              onClick={onUseGps}
              disabled={isGpsLoading}
              className="flex items-center gap-1 bg-white hover:bg-neutral-100 text-[#121212] px-2.5 py-1.5 text-xs rounded-xl border border-neutral-300"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#1D4ED8] ${isGpsLoading ? 'animate-spin' : ''}`} />
              <span>GPS</span>
            </button>
          </div>
        </div>

        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="Cadde, sokak, mahalle veya ilçe ara..."
              className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 pl-9 pr-8 py-1.5 text-xs text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:bg-white font-medium transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-300 shadow-xl z-50 max-h-72 overflow-y-auto">
              <div className="p-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 px-3 bg-[#F8F9FA]">
                Bulunan Güzergahlar ({searchResults.length})
              </div>
              {searchResults.map((street) => {
                const meta = AUTHORITIES_META[street.authorityType];
                return (
                  <div
                    key={street.id}
                    onMouseDown={() => {
                      onSelectStreet(street);
                      onSelectTab('harita');
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 hover:bg-neutral-100 cursor-pointer border-b border-neutral-200 last:border-0 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#121212]">{street.name}</div>
                      <div className="text-[11px] text-neutral-500">
                        {street.neighborhood} • {street.district}, {street.city}
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap text-white"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.shortName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GPS Button + Multi-Street Mode Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            title="Gece / Gündüz modu"
            aria-label="Gece / Gündüz modu"
            className="flex items-center justify-center w-9 h-9 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition shadow-xs shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1D4ED8]" />}
          </button>
          <button
            onClick={onUseGps}
            disabled={isGpsLoading}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-[#121212] px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border border-neutral-300 transition shadow-xs"
            title="Mevcut konumunuzu tespit ederek en yakın cadde sorumluluğunu gösterir"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#1D4ED8] ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Konum Alınıyor...' : 'Konumumu Bul (GPS)'}</span>
          </button>

          <button
            onClick={onToggleMultiSelectMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold border transition ${
              isMultiSelectMode
                ? 'bg-[#121212] text-white border-[#121212] shadow-xs font-bold'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
            }`}
            title="Birden fazla cadde ve sokağı tek bir toplu dilekçe veya şikayette birleştirmek için rota seçimi yapın"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Çoklu Hat / Rota {multiSelectedCount > 0 ? `(${multiSelectedCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Secondary Row: Tabs & Authority Filter Filters */}
      <div className="w-full px-4 sm:px-6 py-1.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border-t border-neutral-200 bg-[#FAFAFA]">
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectTab('harita')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'harita'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Harita</span>
          </button>

          <button
            onClick={() => onSelectTab('kamu_calismalari')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'kamu_calismalari'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Çalışmalar</span>
            {utilityWorksCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-mono px-1 py-0.2 rounded-xs font-bold animate-pulse">
                {utilityWorksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('sikayetler')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'sikayetler'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Şikayetler</span>
          </button>

          <button
            onClick={() => onSelectTab('isi_haritasi')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'isi_haritasi'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Isı Haritası</span>
          </button>

          <button
            onClick={() => onSelectTab('dilekce')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'dilekce'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#047857]" />
            <span>Dilekçe</span>
          </button>

          <button
            onClick={() => onSelectTab('istatistikler')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'istatistikler'
                ? 'bg-[#121212] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>İstatistikler</span>
          </button>
        </nav>

        {/* City and Authority Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City Selector — custom compact searchable dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityOpen((v) => !v)}
              aria-label="Şehir Seçimi"
              className="flex items-center gap-1.5 bg-white rounded-xl border border-neutral-300 text-[#121212] text-xs px-3 py-1 font-semibold hover:border-[#121212] transition max-w-[190px]"
            >
              <Globe className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
              <span className="truncate">
                {selectedCity === 'ALL' ? 'Tüm Türkiye' : selectedCity}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${isCityOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCityOpen && (
              <>
                {/* click-away layer */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setIsCityOpen(false);
                    setCitySearch('');
                  }}
                />
                <div className="absolute z-50 mt-1.5 left-0 w-64 bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden sk-pop-in">
                  {/* Search box */}
                  <div className="p-2 border-b border-neutral-100">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
                      <input
                        autoFocus
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder="İl ara..."
                        className="w-full bg-[#F8F9FA] rounded-lg border border-neutral-200 pl-8 pr-2 py-1.5 text-xs text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div className="max-h-60 overflow-y-auto py-1">
                    {showAllOption && (
                      <button onClick={() => selectCity('ALL')} className={cityItemClass('ALL')}>
                        <span className="flex items-center gap-2">
                          <span>🇹🇷</span>
                          <span>Tüm Türkiye</span>
                          <span className="text-neutral-400 text-[10px]">81 İl</span>
                        </span>
                        {selectedCity === 'ALL' && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                      </button>
                    )}
                    {filteredProvinces.map((prov) => (
                      <button
                        key={prov.code}
                        onClick={() => selectCity(prov.name)}
                        className={cityItemClass(prov.name)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-neutral-400 text-[10px] w-5 shrink-0">{prov.code}</span>
                          <span>{prov.name}</span>
                          {prov.isMetropolitan && <span className="text-amber-500 text-[10px]">★</span>}
                        </span>
                        {selectedCity === prov.name && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                      </button>
                    ))}
                    {!showAllOption && filteredProvinces.length === 0 && (
                      <div className="px-3 py-3 text-xs text-neutral-400 text-center">Sonuç bulunamadı</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Authority Type Filter Badges */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => onSelectAuthorityFilter('ALL')}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                activeAuthorityFilter === 'ALL'
                  ? 'bg-[#121212] text-white font-bold'
                  : 'bg-white text-neutral-600 hover:text-black rounded-xl border border-neutral-300'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => onSelectAuthorityFilter('BUYUKSEHIR')}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                activeAuthorityFilter === 'BUYUKSEHIR'
                  ? 'bg-[#1D4ED8] text-white font-bold'
                  : 'bg-white text-[#1D4ED8] hover:bg-blue-50 border border-blue-300'
              }`}
            >
              Büyükşehir
            </button>
            <button
              onClick={() => onSelectAuthorityFilter('ILCE')}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                activeAuthorityFilter === 'ILCE'
                  ? 'bg-[#047857] text-white font-bold'
                  : 'bg-white text-[#047857] hover:bg-emerald-50 border border-emerald-300'
              }`}
            >
              İlçe Bel.
            </button>
            <button
              onClick={() => onSelectAuthorityFilter('KGM')}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                activeAuthorityFilter === 'KGM'
                  ? 'bg-[#C2410C] text-white font-bold'
                  : 'bg-white text-[#C2410C] hover:bg-orange-50 border border-orange-300'
              }`}
            >
              KGM
            </button>
            <button
              onClick={() => onSelectAuthorityFilter('IL_OZEL')}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                activeAuthorityFilter === 'IL_OZEL'
                  ? 'bg-[#6B21A8] text-white font-bold'
                  : 'bg-white text-[#6B21A8] hover:bg-purple-50 border border-purple-300'
              }`}
            >
              İl Özel
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
