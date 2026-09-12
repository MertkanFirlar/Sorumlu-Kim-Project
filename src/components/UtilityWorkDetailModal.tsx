import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Phone, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Wrench, 
  Droplets, 
  Zap, 
  Flame, 
  Radio, 
  Waves, 
  Train, 
  ExternalLink, 
  Activity, 
  Building2, 
  AlertCircle,
  MessageSquare,
  Send,
  Navigation
} from 'lucide-react';
import { PublicUtilityWork, StreetSegment } from '../types';
import { UTILITY_CATEGORIES_META, SEVERITY_BADGES_META, AUTHORITIES_META } from '../data/mockData';

interface UtilityWorkDetailModalProps {
  work: PublicUtilityWork | null;
  onClose: () => void;
  onSelectStreet?: (streetId: string) => void;
  streets: StreetSegment[];
}

export const UtilityWorkDetailModal: React.FC<UtilityWorkDetailModalProps> = ({
  work,
  onClose,
  onSelectStreet,
  streets,
}) => {
  if (!work) return null;

  const categoryMeta = UTILITY_CATEGORIES_META[work.workCategory] || {
    label: 'Altyapı Çalışması',
    color: '#0284C7',
    iconName: 'Wrench',
    shortCode: 'ALTYAPI',
  };
  const severityMeta = SEVERITY_BADGES_META[work.severity];
  const authorityMeta = AUTHORITIES_META[work.authorityType];

  const matchedStreet = streets.find((s) => s.id === work.streetId);

  const [citizenReportText, setCitizenReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportType, setReportType] = useState('guvenlik_barikati');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenReportText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setCitizenReportText('');
    }, 2000);
  };

  const renderCategoryIcon = (category: string) => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="utility-work-detail-modal"
        className="bg-white border border-neutral-300 max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-[#121212] text-xs space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-3 gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span 
                className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white shadow-xs"
                style={{ backgroundColor: categoryMeta.color }}
              >
                {categoryMeta.shortCode} • {categoryMeta.label}
              </span>

              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${severityMeta.bgClass} ${severityMeta.textClass} ${severityMeta.borderClass}`}>
                {severityMeta.label}
              </span>

              {work.standardWorkingHours.activeNow ? (
                <span className="bg-red-50 text-red-700 border border-red-300 px-1.5 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  Şu An Aktif Mesai
                </span>
              ) : (
                <span className="bg-neutral-100 text-neutral-600 border border-neutral-300 px-1.5 py-0.5 text-[10px] font-mono">
                  Mesai Dışı / Şerit Açık
                </span>
              )}
            </div>

            <h3 className="font-black text-sm sm:text-base text-[#121212] tracking-tight uppercase mt-1">
              {work.title}
            </h3>

            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{work.streetName} ({work.neighborhood} • {work.district} / {work.city})</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 transition"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time sync & Permit bar */}
        <div className="bg-[#F8F9FA] border border-neutral-300 p-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-700">
            <Activity className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Ruhsat / İzin No:</span>
            <span className="font-bold text-[#121212] bg-white px-1.5 py-0.5 border border-neutral-300">{work.permitNumber}</span>
          </div>

          <div className="text-neutral-500 text-[10px] flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{work.lastSyncTime}</span>
          </div>
        </div>

        {/* Standard Working Hours & Schedule */}
        <div className="bg-[#F8F9FA] border border-neutral-300 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-neutral-500">
            <span className="flex items-center gap-1.5 text-[#121212]">
              <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
              STANDART ÇALIŞMA SAATLERİ & VARDİYA REJİMİ
            </span>
            <span className="text-neutral-500">Vardiya Tipi: {work.standardWorkingHours.shiftType.toUpperCase()}</span>
          </div>

          <div className="bg-white border border-neutral-300 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black text-[#121212] flex items-center gap-2">
                <span>{work.standardWorkingHours.scheduleText}</span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                {work.standardWorkingHours.hoursDetail}
              </p>
            </div>
            
            <div className="shrink-0 font-mono text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-200 text-neutral-700">
              Başlangıç: {work.startDate} <br />
              Tahmini Bitiş: {work.endDate}
            </div>
          </div>
        </div>

        {/* Description & Traffic Impact */}
        <div className="space-y-3">
          <div className="bg-white border border-neutral-300 p-3 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-neutral-500">
              Çalışma Kapsamı ve Detayı
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed">
              {work.description}
            </p>
          </div>

          {/* Traffic Impact Alert */}
          <div className={`p-3 border flex items-start gap-2.5 ${severityMeta.bgClass} ${severityMeta.borderClass}`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${severityMeta.textClass}`} />
            <div>
              <div className={`font-bold text-xs ${severityMeta.textClass} uppercase font-mono`}>
                Trafik ve Ulaşım Etkisi ({severityMeta.impactLevel})
              </div>
              <p className="text-xs text-neutral-900 mt-1 font-medium leading-relaxed">
                {work.trafficImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Responsible Agency & Contractor Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#F8F9FA] border border-neutral-300 p-3 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-neutral-500" /> Sorumlu Kamu / Altyapı İdaresi
            </div>
            <div className="font-bold text-xs text-[#121212]">{work.responsibleAgency}</div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Koordinasyon: {authorityMeta.name} (AYKOME)
            </div>
          </div>

          <div className="bg-[#F8F9FA] border border-neutral-300 p-3 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 flex items-center gap-1">
              <Wrench className="w-3 h-3 text-neutral-500" /> Yüklenici / Uygulayıcı Birim
            </div>
            <div className="font-bold text-xs text-[#121212]">{work.contractor}</div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Veri Kaynağı: {work.dataSource}
            </div>
          </div>
        </div>

        {/* Progress Bar & Safety Measures */}
        <div className="bg-[#F8F9FA] border border-neutral-300 p-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-neutral-500">
            <span>ÇALIŞMA İLERLEME SEVİYESİ</span>
            <span className="font-bold text-[#121212] font-mono">%{work.progressPercentage} Tamamlandı</span>
          </div>

          <div className="w-full bg-neutral-200 h-2 overflow-hidden border border-neutral-300">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${work.progressPercentage}%`,
                backgroundColor: work.progressPercentage > 80 ? '#047857' : work.progressPercentage > 40 ? '#1D4ED8' : '#C2410C' 
              }}
            />
          </div>

          {/* Safety Measures Chips */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="text-[10px] font-mono uppercase text-neutral-500 mb-1.5">Saha Güvenlik Tedbirleri:</div>
            <div className="flex flex-wrap gap-1.5">
              {work.safetyMeasures.map((measure, idx) => (
                <span key={idx} className="bg-white border border-neutral-300 px-2 py-0.5 text-[10px] font-mono text-neutral-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {measure}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Citizen Reporting / Complaint for Work Non-compliance */}
        <div className="bg-white border border-neutral-300 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#121212]">
              <MessageSquare className="w-3.5 h-3.5 text-[#1D4ED8]" />
              ÇALIŞMA GÜVENLİĞİ VEYA SAHA KUSURU BİLDİR
            </span>
            <span className="text-neutral-400 font-mono text-[10px]">{work.citizenReportsCount} Mevcut Bildirim</span>
          </div>

          {reportSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-2.5 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bildiriminiz ilgili AYKOME denetim birimine ve belediyeye başarıyla iletildi.</span>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="bg-[#F8F9FA] border border-neutral-300 px-2 py-1 text-xs text-[#121212] font-mono font-medium focus:outline-none focus:border-[#121212]"
                >
                  <option value="guvenlik_barikati">Emniyet Barikatı / Aydınlatma Eksik</option>
                  <option value="mesai_disi_gurultu">İzinsiz Mesai Dışı Gece Gürültüsü</option>
                  <option value="asfalt_yamasi_yapilmadi">Kazı Bitti, Asfalt Kapatılmadı (Çukur Oluştu)</option>
                  <option value="trafik_isaretleme_yetersiz">Trafik Yönlendirme Levhası Yetersiz</option>
                  <option value="toz_ve_moloz">Toz ve Moloz Temizliği Yapılmadı</option>
                </select>

                <input
                  type="text"
                  value={citizenReportText}
                  onChange={(e) => setCitizenReportText(e.target.value)}
                  placeholder="Ek açıklama veya detay giriniz..."
                  className="flex-1 bg-[#F8F9FA] border border-neutral-300 px-2 py-1 text-xs text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:bg-white"
                />

                <button
                  type="submit"
                  className="bg-[#121212] hover:bg-neutral-800 text-white px-3 py-1 text-xs font-bold font-mono uppercase tracking-tight flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3 text-white" />
                  <span>Bildir</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-neutral-600 font-mono text-[11px]">
            <Phone className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Resmi İhbar / Arıza:</span>
            <span className="font-bold text-[#121212]">{work.officialContactPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            {matchedStreet && onSelectStreet && (
              <button
                onClick={() => {
                  onSelectStreet(matchedStreet.id);
                  onClose();
                }}
                className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-tight flex items-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>Haritada Caddeyi İncele</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 text-xs font-semibold border border-neutral-300"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
