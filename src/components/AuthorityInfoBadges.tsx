import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Phone, 
  Building2, 
  Gauge, 
  ShieldCheck, 
  Copy, 
  Check, 
  PhoneCall, 
  X,
  Info,
  ExternalLink
} from 'lucide-react';
import { StreetSegment, AuthorityType } from '../types';
import { AUTHORITIES_META } from '../data/mockData';

interface AuthorityInfoBadgesProps {
  street: StreetSegment;
  variant?: 'compact' | 'detailed';
}

type InfoType = 'legal' | 'contact' | 'department' | 'specs' | 'verification' | null;

export const AuthorityInfoBadges: React.FC<AuthorityInfoBadgesProps> = ({
  street,
  variant = 'detailed'
}) => {
  const meta = AUTHORITIES_META[street.authorityType];
  const [hoveredInfo, setHoveredInfo] = useState<InfoType>(null);
  const [clickedInfo, setClickedInfo] = useState<InfoType>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which info to show: clicked has priority, otherwise hovered
  const activeInfo = clickedInfo || hoveredInfo;

  // Handle clicking outside to close active pinned popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setClickedInfo(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleClick = (type: InfoType) => {
    setClickedInfo((prev) => (prev === type ? null : type));
  };

  // Clean phone number for tel: link (extract first digits sequence e.g., 153, 159, 112)
  const extractPhoneDigits = (phoneStr: string) => {
    const match = phoneStr.match(/\d+/g);
    return match ? match.join('') : '153';
  };

  const infoItems = [
    {
      id: 'legal' as const,
      icon: Scale,
      label: 'Yasal Dayanak',
      shortHint: 'Yasal & İdari Kanun Maddesi',
      color: '#1D4ED8',
      bgHover: 'hover:border-[#1D4ED8] hover:text-[#1D4ED8]',
      activeBg: 'bg-[#1D4ED8] text-white border-[#1D4ED8]',
      inactiveBg: 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
    },
    {
      id: 'contact' as const,
      icon: Phone,
      label: 'İhbar Hattı',
      shortHint: 'Resmi İletişim / Çağrı Merkezi',
      color: '#047857',
      bgHover: 'hover:border-[#047857] hover:text-[#047857]',
      activeBg: 'bg-[#047857] text-white border-[#047857]',
      inactiveBg: 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
    },
    {
      id: 'department' as const,
      icon: Building2,
      label: 'Yetkili Birim',
      shortHint: 'Sorumlu Daire Başkanlığı',
      color: '#6B21A8',
      bgHover: 'hover:border-[#6B21A8] hover:text-[#6B21A8]',
      activeBg: 'bg-[#6B21A8] text-white border-[#6B21A8]',
      inactiveBg: 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
    },
    {
      id: 'specs' as const,
      icon: Gauge,
      label: 'Yol Standardı',
      shortHint: 'Hız Limiti ve Yol Tipi',
      color: '#C2410C',
      bgHover: 'hover:border-[#C2410C] hover:text-[#C2410C]',
      activeBg: 'bg-[#C2410C] text-white border-[#C2410C]',
      inactiveBg: 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
    },
    {
      id: 'verification' as const,
      icon: ShieldCheck,
      label: 'Topluluk Teyidi',
      shortHint: 'Vatandaş ve Sicil Teyidi',
      color: '#0284C7',
      bgHover: 'hover:border-[#0284C7] hover:text-[#0284C7]',
      activeBg: 'bg-[#0284C7] text-white border-[#0284C7]',
      inactiveBg: 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      {/* Icon Toolbar Row */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 shrink-0 flex items-center gap-1">
          <Info className="w-3 h-3 text-neutral-400" />
          <span>Hızlı Bilgi:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {infoItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeInfo === item.id;
            const isClicked = clickedInfo === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  id={`badge-btn-${item.id}-${street.id}`}
                  onClick={() => handleToggleClick(item.id)}
                  onMouseEnter={() => setHoveredInfo(item.id)}
                  onMouseLeave={() => setHoveredInfo(null)}
                  className={`relative p-1.5 border transition-all flex items-center gap-1 text-xs font-mono font-semibold shadow-2xs group ${
                    isClicked
                      ? item.activeBg
                      : isActive
                      ? `${item.inactiveBg} ring-2 ring-neutral-400`
                      : item.inactiveBg
                  } ${item.bgHover}`}
                  title={`${item.label} (${item.shortHint}) - İncelemek için tıklayın`}
                  aria-label={item.label}
                >
                  <Icon className={`w-3.5 h-3.5 ${isClicked ? 'text-white' : ''}`} />
                  {variant === 'detailed' && (
                    <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-tight">
                      {item.label}
                    </span>
                  )}
                </button>

                {/* Floating Micro-Tooltip on hover (when not clicked open) */}
                {hoveredInfo === item.id && !clickedInfo && (
                  <div className="absolute bottom-full right-0 mb-1.5 z-40 bg-[#121212] text-white text-[10px] font-mono py-1 px-2 shadow-lg whitespace-nowrap border border-neutral-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold flex items-center gap-1">
                      <Icon className="w-3 h-3 text-amber-400" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-neutral-400 text-[9px]">{item.shortHint} (Tıkla)</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Interactive Info Card (Shown on Hover OR Click) */}
      {activeInfo && (
        <div 
          className="bg-white border-2 p-3 shadow-md text-xs relative transition-all animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ borderColor: infoItems.find((i) => i.id === activeInfo)?.color || '#121212' }}
        >
          {/* Close button if clicked/pinned */}
          <button
            type="button"
            onClick={() => {
              setClickedInfo(null);
              setHoveredInfo(null);
            }}
            className="absolute top-2 right-2 text-neutral-400 hover:text-black p-0.5 hover:bg-neutral-100 transition"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 1. Legal Basis Info */}
          {activeInfo === 'legal' && (
            <div className="space-y-2 pr-5">
              <div className="flex items-center gap-1.5 text-[#1D4ED8] font-bold font-mono text-[11px] uppercase">
                <Scale className="w-4 h-4 text-[#1D4ED8]" />
                <span>YASAL VE İDARİ DAYANAK</span>
              </div>
              
              <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200 text-[#121212] leading-relaxed font-sans text-xs">
                <div className="font-semibold text-neutral-800 mb-1">
                  Resmi Kanun Hükmü:
                </div>
                {meta.legalBasis}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-100">
                <span>Yetki Kapsamı: {meta.name}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(meta.legalBasis, 'legal')}
                  className="flex items-center gap-1 text-[#1D4ED8] hover:underline font-bold"
                >
                  {copiedKey === 'legal' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Maddeyi Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 2. Contact Hotline Info */}
          {activeInfo === 'contact' && (
            <div className="space-y-2 pr-5">
              <div className="flex items-center gap-1.5 text-[#047857] font-bold font-mono text-[11px] uppercase">
                <Phone className="w-4 h-4 text-[#047857]" />
                <span>İLETİŞİM VE İHBAR HATTI</span>
              </div>

              <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="text-[11px] text-neutral-500 font-mono">Doğrudan Bildirim Hattı:</div>
                <div className="text-sm font-black text-[#121212] font-mono">
                  {meta.contactPhone}
                </div>
                <p className="text-[11px] text-neutral-600">
                  Bu cadde üzerindeki çukur, asfalt bozulması, kaldırım hasarı veya aydınlatma arızalarını bu hat üzerinden bildirebilirsiniz.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-100 font-mono text-[10px]">
                <a
                  href={`tel:${extractPhoneDigits(meta.contactPhone)}`}
                  className="bg-[#047857] hover:bg-emerald-800 text-white px-2.5 py-1 font-bold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span>Hattı Ara ({extractPhoneDigits(meta.contactPhone)})</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(meta.contactPhone, 'contact')}
                  className="flex items-center gap-1 text-neutral-600 hover:text-black font-bold"
                >
                  {copiedKey === 'contact' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Numarayı Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 3. Department & Unit Info */}
          {activeInfo === 'department' && (
            <div className="space-y-2 pr-5">
              <div className="flex items-center gap-1.5 text-[#6B21A8] font-bold font-mono text-[11px] uppercase">
                <Building2 className="w-4 h-4 text-[#6B21A8]" />
                <span>SORUMLU DAİRE BAŞKANLIĞI & BİRİM</span>
              </div>

              <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200 space-y-1">
                <div className="font-bold text-xs text-[#121212]">
                  {street.authorityCustomName || meta.fullNamePrefix}
                </div>
                <div className="text-[11px] text-neutral-700 font-medium">
                  {meta.departmentName}
                </div>
                <p className="text-[10px] text-neutral-500 pt-1 leading-relaxed border-t border-neutral-200 font-sans">
                  Sorumluluk Alanı: Asfalt serimi, yol çizgi ve sinyalizasyon, kış şartlarında kar/buzla mücadele, bordür-tretuvar tamiri ve altyapı kazı izinleri koordinasyonu.
                </p>
              </div>
            </div>
          )}

          {/* 4. Specs & Speed Limit Info */}
          {activeInfo === 'specs' && (
            <div className="space-y-2 pr-5">
              <div className="flex items-center gap-1.5 text-[#C2410C] font-bold font-mono text-[11px] uppercase">
                <Gauge className="w-4 h-4 text-[#C2410C]" />
                <span>TEKNİK YOL STANDARTLARI</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                <div className="bg-[#F8F9FA] p-1.5 rounded-xl border border-neutral-200">
                  <div className="text-[9px] text-neutral-500">HIZ LİMİTİ</div>
                  <div className="font-bold text-xs text-[#121212]">{street.speedLimit} km/s</div>
                </div>
                <div className="bg-[#F8F9FA] p-1.5 rounded-xl border border-neutral-200">
                  <div className="text-[9px] text-neutral-500">ŞERİT</div>
                  <div className="font-bold text-xs text-[#121212]">
                    {street.laneCount === 0 ? 'Yaya Alanı' : `${street.laneCount} Şerit`}
                  </div>
                </div>
                <div className="bg-[#F8F9FA] p-1.5 rounded-xl border border-neutral-200">
                  <div className="text-[9px] text-neutral-500">STATÜ</div>
                  <div className="font-bold text-xs text-[#121212]">{street.roadType.toUpperCase()}</div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-600 font-sans leading-normal">
                Bu güzergahın hız ve şerit düzenlemeleri İl Ulaşım Koordinasyon Merkezi (UKOME / Trafik Komisyonu) kararlarına tabidir.
              </div>
            </div>
          )}

          {/* 5. Verification & Community Score Info */}
          {activeInfo === 'verification' && (
            <div className="space-y-2 pr-5">
              <div className="flex items-center gap-1.5 text-[#0284C7] font-bold font-mono text-[11px] uppercase">
                <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                <span>TOPLULUK VE SİCİL TEYİDİ</span>
              </div>

              <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-600">Doğruluk Bildirimi:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓ {street.communityVotes.correct} Doğru</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-red-600 font-bold">✗ {street.communityVotes.incorrect} İtiraz</span>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-600 font-sans leading-relaxed">
                  {street.verifiedByCommunity
                    ? 'Bu güzergahın yetkili idaresi ve yol sınırları resmi belediye/karayolları envanteriyle karşılaştırılarak teyit edilmiştir.'
                    : 'Bu güzergah topluluk bildirimleri ve açık harita verisi üzerinden incelenmektedir.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
