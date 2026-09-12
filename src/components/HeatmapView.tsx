import React from 'react';
import { 
  Flame, 
  AlertOctagon, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Layers,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { AuthorityType, StreetSegment } from '../types';
import { AUTHORITIES_META } from '../data/mockData';

interface HeatmapViewProps {
  streets: StreetSegment[];
  onSelectStreetAndOpenMap: (streetId: string) => void;
  onSelectAuthorityFilter: (auth: AuthorityType | 'ALL') => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  streets,
  onSelectStreetAndOpenMap,
  onSelectAuthorityFilter,
}) => {
  // Sort streets by chronic problem score
  const rankedStreets = [...streets].sort((a, b) => b.chronicScore - a.chronicScore);
  const criticalStreets = rankedStreets.filter((s) => s.chronicScore >= 60);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5">
      {/* Banner */}
      <div className="bg-white border border-neutral-300 p-4 mb-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[#121212]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 border border-red-200 flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-600" />
              <span>KRONİK ALTYAPI VE SORUMLULUK YOĞUNLUK MATRİSİ</span>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#121212] tracking-tight uppercase mt-1">
            Yol Sorumluluğu & Kronik Sorun Isı Haritası
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Süregelen altyapı kazıları, çözülmeyen çukur bildirimleri ve yetki çakışması yaşanan en problemli arterleri analiz edin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#F8F9FA] p-2.5 border border-neutral-300 text-center font-mono">
            <div className="text-[10px] text-neutral-500">KRİTİK ARTER</div>
            <div className="text-sm font-bold text-red-600">{criticalStreets.length} Yol</div>
          </div>
          <div className="bg-[#F8F9FA] p-2.5 border border-neutral-300 text-center font-mono">
            <div className="text-[10px] text-neutral-500">ORTALAMA SKOR</div>
            <div className="text-sm font-bold text-[#C2410C]">
              %{Math.round(streets.reduce((acc, s) => acc + s.chronicScore, 0) / (streets.length || 1))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Top Ranked Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Critical Streets List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] flex items-center justify-between">
            <span>EN YÜKSEK ŞİKAYET VE SORUN SKORUNA SAHİP ARTERLER</span>
            <span className="text-neutral-500 text-[11px] font-normal">Kritiklik Sıralı</span>
          </div>

          <div className="space-y-2.5">
            {rankedStreets.map((street, idx) => {
              const meta = AUTHORITIES_META[street.authorityType];
              const isCritical = street.chronicScore >= 70;
              const isModerate = street.chronicScore >= 50 && street.chronicScore < 70;

              return (
                <div
                  key={street.id}
                  className="bg-white border border-neutral-300 hover:border-neutral-400 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition text-[#121212]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#F8F9FA] border border-neutral-300 flex items-center justify-center font-mono font-bold text-xs text-neutral-700 shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className="px-2 py-0.2 text-[10px] font-mono font-bold uppercase text-white shadow-xs"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.shortName}
                        </span>
                        <span className="text-neutral-500 text-xs font-mono">
                          {street.district}, {street.city}
                        </span>
                        {street.status === 'construction' && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.2 text-[10px] font-mono flex items-center gap-1">
                            <Wrench className="w-2.5 h-2.5 text-amber-700" /> Kazı/Çalışma
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-[#121212]">{street.name}</h3>

                      {street.statusDetail && (
                        <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1">
                          {street.statusDetail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Score Bar & Jump Button */}
                  <div className="flex items-center gap-4 shrink-0 sm:self-center">
                    {/* Visual Score Gauge */}
                    <div className="text-right font-mono min-w-[80px]">
                      <div className="text-[10px] text-neutral-500">SORUN SKORU</div>
                      <div
                        className={`text-base font-extrabold ${
                          isCritical
                            ? 'text-red-600'
                            : isModerate
                            ? 'text-[#C2410C]'
                            : 'text-[#047857]'
                        }`}
                      >
                        %{street.chronicScore}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStreetAndOpenMap(street.id)}
                      className="bg-white hover:bg-neutral-100 text-[#121212] border border-neutral-300 px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1 transition shadow-xs"
                      title="Haritada göster"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>Haritada Gör</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Root-Cause Insights & Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Authority Problem Share */}
          <div className="bg-white border border-neutral-300 p-4 text-xs space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] border-b border-neutral-200 pb-2">
              KURUM BAZLI SORUN DAĞILIMI
            </div>

            <div className="space-y-2.5">
              {(['BUYUKSEHIR', 'ILCE', 'KGM', 'IL_OZEL'] as AuthorityType[]).map((authType) => {
                const meta = AUTHORITIES_META[authType];
                const count = streets.filter((s) => s.authorityType === authType).length;
                const avgScore = Math.round(
                  streets
                    .filter((s) => s.authorityType === authType)
                    .reduce((acc, s) => acc + s.chronicScore, 0) / (count || 1)
                );

                return (
                  <div key={authType} className="bg-[#F8F9FA] p-2.5 border border-neutral-300">
                    <div className="flex items-center justify-between mb-1.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        ></span>
                        <span className="font-bold text-[#121212] text-xs">{meta.shortName}</span>
                      </div>
                      <span className="text-neutral-500 font-bold">{count} Yol Kaydı</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${avgScore}%`,
                          backgroundColor: meta.color,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-500 font-mono">
                      <span>Ortalama Kronik Yoğunluk</span>
                      <span className="text-[#121212] font-bold">%{avgScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Root-Cause Breakdown */}
          <div className="bg-white border border-neutral-300 p-4 text-xs space-y-2.5 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] border-b border-neutral-200 pb-2">
              KRONİK SORUNLARIN KÖK NEDENLERİ
            </div>

            <div className="space-y-2 text-neutral-700 text-[11px] leading-relaxed">
              <div className="p-2 bg-[#F8F9FA] border border-neutral-300">
                <div className="font-bold text-[#121212] mb-0.5">1. Altyapı Kazıları Sonrası Asfalt Gecikmesi (%42)</div>
                <p className="text-neutral-500 text-[10px]">
                  İSKİ, ASKİ, BEDAŞ, İGDAŞ kazıları sonrası finişerli sıcak asfalt seriminin gecikmesi çukurlara yol açmaktadır.
                </p>
              </div>

              <div className="p-2 bg-[#F8F9FA] border border-neutral-300">
                <div className="font-bold text-[#121212] mb-0.5">2. Ağır Tonaj & Kamyon Güzergahı Aşınması (%28)</div>
                <p className="text-neutral-500 text-[10px]">
                  Hafriyat kamyonlarının kullandığı D-100 ve bağlantı yollarında tekerlek izi oturması (rutting) görülmektedir.
                </p>
              </div>

              <div className="p-2 bg-[#F8F9FA] border border-neutral-300">
                <div className="font-bold text-[#121212] mb-0.5">3. Yetki Sınırı Belirsizliği (%18)</div>
                <p className="text-neutral-500 text-[10px]">
                  İlçe ile Büyükşehir sınırındaki 12-14 metre genişlikteki geçiş arterlerinde kurumların topu birbirine atması.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
