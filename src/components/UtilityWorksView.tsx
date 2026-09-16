import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Droplets, 
  Zap, 
  Flame, 
  Radio, 
  Waves, 
  Train, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  Navigation, 
  Building2, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Info,
  MapPin
} from 'lucide-react';
import { PublicUtilityWork, StreetSegment, UtilityWorkCategory, WorkSeverity } from '../types';
import { UTILITY_CATEGORIES_META, SEVERITY_BADGES_META, AUTHORITIES_META, MOCK_STREETS } from '../data/mockData';

interface UtilityWorksViewProps {
  utilityWorks?: PublicUtilityWork[];
  works?: PublicUtilityWork[];
  streets?: StreetSegment[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onSelectWork: (work: PublicUtilityWork) => void;
  onFocusOnMap?: (work: PublicUtilityWork) => void;
  onGoToStreetOnMap?: (street: StreetSegment) => void;
}

export const UtilityWorksView: React.FC<UtilityWorksViewProps> = ({
  utilityWorks,
  works,
  streets = MOCK_STREETS,
  selectedCity: propCity,
  onSelectCity: propOnSelectCity,
  onSelectWork,
  onFocusOnMap,
  onGoToStreetOnMap,
}) => {
  const allWorks = utilityWorks || works || [];
  const [localCity, setLocalCity] = useState<string>(propCity || 'ALL');
  const activeCity = propCity || localCity;
  const handleCityChange = propOnSelectCity || setLocalCity;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<UtilityWorkCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<WorkSeverity | 'ALL'>('ALL');
  const [activeNowOnly, setActiveNowOnly] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState('22.08.2026 02:15:44');

  const handleSyncRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTimestamp(
        `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR')}`
      );
    }, 800);
  };

  // Filtered Works
  const filteredWorks = useMemo(() => {
    return allWorks.filter((w) => {
      if (activeCity !== 'ALL' && w.city !== activeCity) return false;
      if (selectedCategory !== 'ALL' && w.workCategory !== selectedCategory) return false;
      if (selectedSeverity !== 'ALL' && w.severity !== selectedSeverity) return false;
      if (activeNowOnly && !w.standardWorkingHours.activeNow) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          w.title.toLowerCase().includes(q) ||
          w.streetName.toLowerCase().includes(q) ||
          w.responsibleAgency.toLowerCase().includes(q) ||
          w.district.toLowerCase().includes(q) ||
          w.permitNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allWorks, activeCity, selectedCategory, selectedSeverity, activeNowOnly, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = allWorks.length;
    const activeNow = allWorks.filter((w) => w.standardWorkingHours.activeNow).length;
    const critical = allWorks.filter((w) => w.severity === 'kritik').length;
    const nightShift = allWorks.filter((w) => w.standardWorkingHours.shiftType === 'gece').length;
    return { total, activeNow, critical, nightShift };
  }, [allWorks]);

  const renderCategoryIcon = (category: UtilityWorkCategory) => {
    switch (category) {
      case 'su_kanalizasyon':
        return <Droplets className="w-4 h-4 text-[#0284C7]" />;
      case 'elektrik_kablo':
        return <Zap className="w-4 h-4 text-[#D97706]" />;
      case 'dogalgaz':
        return <Flame className="w-4 h-4 text-[#EA580C]" />;
      case 'telekom_fiber':
        return <Radio className="w-4 h-4 text-[#7C3AED]" />;
      case 'yagmur_drenaj':
        return <Waves className="w-4 h-4 text-[#0D9488]" />;
      case 'rayli_sistem':
        return <Train className="w-4 h-4 text-[#BE123C]" />;
      default:
        return <Wrench className="w-4 h-4 text-[#C2410C]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 space-y-4 text-[#121212]">
      {/* Top Banner & AYKOME Live Sync Bar */}
      <div className="bg-white rounded-xl border border-neutral-300 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#121212] flex items-center justify-center text-white">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight uppercase text-[#121212]">
                  Devam Eden Belediye & Kamu Altyapı Çalışmaları
                </h1>
                <span className="bg-blue-50 text-[#1D4ED8] border border-blue-200 text-[10px] font-mono font-bold px-1.5 py-0.5">
                  AYKOME / SCADA ENTEGRASYONU
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Seçili sokak ve ana arterlerdeki su, yol, elektrik, doğalgaz, fiber ve raylı sistem kazı izinleri ve çalışma saatleri
              </p>
            </div>
          </div>
        </div>

        {/* Live Sync Status & Trigger */}
        <div className="flex items-center gap-2 font-mono text-xs self-start md:self-auto bg-[#F8F9FA] p-2 rounded-xl border border-neutral-300">
          <div className="flex items-center gap-1.5 text-neutral-600 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Canlı Veri Senkronizasyonu:</span>
            <span className="font-bold text-[#121212]">{lastSyncTimestamp}</span>
          </div>

          <button
            onClick={handleSyncRefresh}
            disabled={isSyncing}
            className="flex items-center gap-1 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 px-2 py-1 text-[11px] font-bold text-[#121212] shadow-xs"
            title="AYKOME ve Su/Gaz İdareleri API Verisini Yenile"
          >
            <RefreshCw className={`w-3 h-3 text-[#1D4ED8] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Güncelleniyor...' : 'Yenile'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
        <div className="bg-white rounded-xl border border-neutral-300 p-3">
          <div className="text-[10px] text-neutral-500 uppercase font-bold">KAYITLI KAMU ÇALIŞMASI</div>
          <div className="text-xl font-black text-[#121212] mt-0.5">{metrics.total}</div>
          <div className="text-[10px] text-neutral-500 mt-1">AYKOME Onaylı Ruhsatlı Alan</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-300 p-3">
          <div className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            ŞU AN AKTİF MESAİ
          </div>
          <div className="text-xl font-black text-red-600 mt-0.5">{metrics.activeNow}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Saha Ekipleri Çalışıyor</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-300 p-3">
          <div className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
            KRİTİK / ŞERİT KAPAMA
          </div>
          <div className="text-xl font-black text-[#DC2626] mt-0.5">{metrics.critical}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Ağır Trafik & Alternatif Rota</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-300 p-3">
          <div className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C2410C]" />
            GECE MESAİSİ REJİMİ
          </div>
          <div className="text-xl font-black text-[#121212] mt-0.5">{metrics.nightShift}</div>
          <div className="text-[10px] text-neutral-500 mt-1">23:00 - 05:30 Saatleri Arası</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl border border-neutral-300 p-3 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cadde, ilçe, kurum (İSKİ, BEDAŞ vb.) veya ruhsat no ara..."
              className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 pl-9 pr-3 py-1.5 text-xs text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:bg-white font-medium"
            />
          </div>

          {/* City Selection Buttons */}
          <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto">
            {['ALL', 'İstanbul', 'Ankara', 'İzmir'].map((c) => (
              <button
                key={c}
                onClick={() => handleCityChange(c)}
                className={`px-3 py-1 text-xs font-bold transition ${
                  activeCity === c
                    ? 'bg-[#121212] text-white shadow-xs'
                    : 'bg-[#F8F9FA] rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {c === 'ALL' ? 'Tüm Şehirler' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Categories and Shift filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200 text-xs">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 text-xs font-mono font-bold transition ${
                selectedCategory === 'ALL'
                  ? 'bg-[#121212] text-white'
                  : 'bg-[#F8F9FA] rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Tüm Kategoriler
            </button>

            {(Object.keys(UTILITY_CATEGORIES_META) as UtilityWorkCategory[]).map((cat) => {
              const meta = UTILITY_CATEGORIES_META[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-xs font-mono flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-[#121212] text-white font-bold'
                      : 'bg-[#F8F9FA] rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }}></span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Severity & Active Now Toggle */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as WorkSeverity | 'ALL')}
              className="bg-[#F8F9FA] rounded-xl border border-neutral-300 px-2 py-1 text-xs text-[#121212] font-mono focus:outline-none focus:border-[#121212]"
            >
              <option value="ALL">Tüm Uyarı Seviyeleri</option>
              <option value="kritik">🔴 Kritik / Tam Şerit Kapatma</option>
              <option value="orta">🟠 Orta / Kısmi Daraltma</option>
              <option value="dusuk">🟡 Düşük / Kaldırım & Tali</option>
              <option value="planlanan">🔵 Planlanan / Gelecek Ruhsat</option>
              <option value="tamamlaniyor">🟢 Tamamlanıyor / Asfalt Yama</option>
            </select>

            <button
              onClick={() => setActiveNowOnly(!activeNowOnly)}
              className={`px-2.5 py-1 text-xs font-mono font-bold border transition flex items-center gap-1.5 ${
                activeNowOnly
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-[#F8F9FA] text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeNowOnly ? 'bg-white' : 'bg-red-600'}`}></span>
              <span>Şu An Aktif Mesai</span>
            </button>
          </div>
        </div>
      </div>

      {/* Work Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-neutral-500 px-1">
          <span>GÖSTERİLEN ÇALIŞMA KAYDI: {filteredWorks.length}</span>
          <span>Sıralama: Güncellik ve Trafik Etkisi</span>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-300 p-8 text-center text-neutral-500 space-y-2">
            <Info className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="font-semibold text-sm">Seçili filtrelere uygun kamu çalışması bulunamadı.</p>
            <p className="text-xs">Filtreleri sıfırlayarak veya arama terimini değiştirerek tekrar deneyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredWorks.map((work) => {
              const catMeta = UTILITY_CATEGORIES_META[work.workCategory] || {
                label: 'Altyapı',
                color: '#0284C7',
                shortCode: 'ALTYAPI',
              };
              const sevMeta = SEVERITY_BADGES_META[work.severity];
              const streetObj = streets.find((s) => s.id === work.streetId);

              return (
                <div
                  key={work.id}
                  className="bg-white rounded-xl border border-neutral-300 hover:border-neutral-400 p-4 shadow-xs transition flex flex-col justify-between space-y-3"
                  style={{ borderLeft: `4px solid ${sevMeta.hex}` }}
                >
                  {/* Top Header */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white"
                          style={{ backgroundColor: catMeta.color }}
                        >
                          {catMeta.shortCode}
                        </span>

                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${sevMeta.bgClass} ${sevMeta.textClass} ${sevMeta.borderClass}`}>
                          {sevMeta.label}
                        </span>
                      </div>

                      {work.standardWorkingHours.activeNow && (
                        <span className="bg-red-50 text-red-700 border border-red-300 px-1.5 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          Şu An Aktif
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-[#121212] leading-snug">
                      {work.title}
                    </h3>

                    <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{work.streetName} • {work.district} / {work.city}</span>
                    </div>
                  </div>

                  {/* Shift & Traffic Impact Box */}
                  <div className="bg-[#F8F9FA] rounded-xl border border-neutral-300 p-2.5 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C2410C]" /> Çalışma Saatleri:
                      </span>
                      <span className="font-bold text-[#121212]">{work.standardWorkingHours.scheduleText}</span>
                    </div>

                    <div className="text-[11px] text-neutral-800 font-sans border-t border-neutral-200 pt-1">
                      <span className="font-semibold text-neutral-600">Trafik Durumu:</span> {work.trafficImpact}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-0.5">
                      <span>Ruhsat: {work.permitNumber}</span>
                      <span>Bitiş: {work.endDate}</span>
                    </div>
                  </div>

                  {/* Responsible Agency & Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-600 font-medium truncate max-w-[200px]" title={work.responsibleAgency}>
                        {work.responsibleAgency}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-neutral-700">
                        %{work.progressPercentage} İlerleme
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 h-1.5 overflow-hidden rounded-xl border border-neutral-300">
                      <div 
                        className="h-full"
                        style={{ 
                          width: `${work.progressPercentage}%`,
                          backgroundColor: work.progressPercentage > 80 ? '#047857' : work.progressPercentage > 40 ? '#1D4ED8' : '#C2410C' 
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-200">
                    <button
                      onClick={() => onSelectWork(work)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-300 flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Detay & İzin İncele</span>
                    </button>

                    {(onFocusOnMap || (streetObj && onGoToStreetOnMap)) && (
                      <button
                        onClick={() => {
                          if (onFocusOnMap) {
                            onFocusOnMap(work);
                          } else if (streetObj && onGoToStreetOnMap) {
                            onGoToStreetOnMap(streetObj);
                          }
                        }}
                        className="bg-[#121212] hover:bg-neutral-800 text-white px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-tight flex items-center gap-1 shadow-xs"
                      >
                        <Navigation className="w-3 h-3 text-white" />
                        <span>Haritada Göster</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
