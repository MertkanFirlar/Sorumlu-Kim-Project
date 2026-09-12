import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Minus, 
  X, 
  ExternalLink,
  Calendar,
  Phone,
  ShieldCheck,
  Scale,
  Gauge,
  Layers,
  ArrowRight,
  Wrench,
  Clock
} from 'lucide-react';
import { Complaint, PublicUtilityWork, StreetSegment } from '../types';
import { AUTHORITIES_META, CATEGORY_DETAILS, UTILITY_CATEGORIES_META, SEVERITY_BADGES_META } from '../data/mockData';
import { AuthorityInfoBadges } from './AuthorityInfoBadges';

interface StreetDetailPanelProps {
  street: StreetSegment;
  onClose: () => void;
  onOpenPetition: (street: StreetSegment) => void;
  onOpenComplaintModal: (street: StreetSegment) => void;
  onOpenCorrectionModal: (street: StreetSegment) => void;
  isMultiSelected: boolean;
  onToggleMultiSelect: (street: StreetSegment) => void;
  complaints: Complaint[];
  utilityWorks?: PublicUtilityWork[];
  onSelectUtilityWork?: (work: PublicUtilityWork) => void;
}

export const StreetDetailPanel: React.FC<StreetDetailPanelProps> = ({
  street,
  onClose,
  onOpenPetition,
  onOpenComplaintModal,
  onOpenCorrectionModal,
  isMultiSelected,
  onToggleMultiSelect,
  complaints,
  utilityWorks = [],
  onSelectUtilityWork,
}) => {
  const meta = AUTHORITIES_META[street.authorityType];
  const streetComplaints = complaints.filter((c) => c.streetId === street.id);
  const streetUtilityWorks = utilityWorks.filter((w) => w.streetId === street.id);

  return (
    <div className="bg-white border border-neutral-300 shadow-sm flex flex-col max-h-[85vh] lg:max-h-[calc(100vh-140px)] overflow-hidden text-[#121212]">
      {/* Header Banner with Authority Color Indicator */}
      <div 
        className="p-3.5 border-b border-neutral-300 relative flex items-start justify-between gap-3 bg-white"
        style={{ borderTop: `4px solid ${meta.color}` }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span 
              className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: meta.color }}
            >
              {meta.name}
            </span>
            <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 text-[10px] font-mono uppercase border border-neutral-200">
              {street.roadType.toUpperCase()}
            </span>
            {street.verifiedByCommunity && (
              <span className="bg-emerald-50 text-[#047857] border border-emerald-300 px-1.5 py-0.5 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#047857]" />
                <span>Teyitli</span>
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#121212] tracking-tight uppercase leading-snug">
            {street.name}
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            {street.neighborhood} • {street.district} / {street.city}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content - Scrollable */}
      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1 text-xs bg-white">
        {/* Real-time Public Utility Works Section (If Any on this street) */}
        {streetUtilityWorks.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#121212]">
                <Wrench className="w-3.5 h-3.5 text-[#C2410C]" />
                DEVAM EDEN KAMU ALTYAPI ÇALIŞMASI ({streetUtilityWorks.length})
              </span>
              <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                AYKOME SCADA CANLI
              </span>
            </div>

            {streetUtilityWorks.map((work) => {
              const sevMeta = SEVERITY_BADGES_META[work.severity];
              const catMeta = UTILITY_CATEGORIES_META[work.workCategory] || {
                label: 'Altyapı',
                color: '#0284C7',
                shortCode: 'ALTYAPI',
              };

              return (
                <div 
                  key={work.id}
                  className="bg-[#F8F9FA] border p-3 space-y-2"
                  style={{ borderColor: sevMeta.hex }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-white"
                        style={{ backgroundColor: catMeta.color }}
                      >
                        {catMeta.shortCode}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${sevMeta.bgClass} ${sevMeta.textClass} ${sevMeta.borderClass}`}>
                        {sevMeta.label}
                      </span>
                    </div>

                    {work.standardWorkingHours.activeNow && (
                      <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 animate-pulse">
                        Şu An Aktif Mesai
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-xs text-[#121212] leading-tight">
                    {work.title}
                  </div>

                  <div className="bg-white border border-neutral-300 p-2 space-y-1 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C2410C]" /> Saatler:
                      </span>
                      <span className="font-bold text-[#121212]">{work.standardWorkingHours.scheduleText}</span>
                    </div>
                    <div className="text-[10px] text-neutral-600 font-sans border-t border-neutral-200 pt-1">
                      <strong>Trafik:</strong> {work.trafficImpact}
                    </div>
                    <div className="text-[9px] text-neutral-500 pt-0.5 flex justify-between">
                      <span>Ruhsat: {work.permitNumber}</span>
                      <span>İdare: {work.responsibleAgency.split(' ')[0]}</span>
                    </div>
                  </div>

                  {onSelectUtilityWork && (
                    <button
                      onClick={() => onSelectUtilityWork(work)}
                      className="w-full bg-[#121212] hover:bg-neutral-800 text-white py-1.5 px-2 text-[11px] font-mono font-bold uppercase tracking-tight flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3 h-3 text-white" />
                      <span>Ruhsat & Güvenlik Detaylarını Gör</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Active Work / Generic Construction Alert Banner */
          (street.status === 'construction' || street.status === 'maintenance') && (
            <div className="bg-amber-50 border border-amber-300 p-2.5 flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-amber-950 flex items-center gap-2">
                  <span>AKTİF ÇALIŞMA / KAZI ALANI</span>
                  {street.statusEndDate && (
                    <span className="text-[10px] font-mono bg-amber-100 px-1.5 py-0.2 border border-amber-300 text-amber-900">
                      Bitiş: {street.statusEndDate}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                  {street.statusDetail || 'Yol bakım ve altyapı çalışması sürmektedir.'}
                </p>
                {street.contractorInfo && (
                  <div className="text-[10px] text-amber-800 font-mono mt-1">
                    Yüklenici / Birim: {street.contractorInfo}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Responsible Authority Box */}
        <div className="bg-[#F8F9FA] border border-neutral-300 p-3 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
            <span>RESMİ SORUMLU İDARE & YETKİLİ BİRİM</span>
            <span className="text-[#1D4ED8] flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Yetki Alanı
            </span>
          </div>

          <div>
            <div className="font-black text-sm text-[#121212]">
              {street.authorityCustomName || meta.fullNamePrefix}
            </div>
            <div className="text-[11px] text-neutral-600 font-medium mt-0.5">
              {meta.departmentName}
            </div>
          </div>

          {/* Interactive Info Badges: Legal Basis, Contact Hotline, Department, Specs, Verification */}
          <AuthorityInfoBadges street={street} variant="detailed" />
        </div>

        {/* Road Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-[#F8F9FA] p-2 border border-neutral-300">
            <div className="text-[10px] text-neutral-500">UZUNLUK</div>
            <div className="text-xs font-bold text-[#121212]">
              {(street.lengthMeters / 1000).toFixed(1)} km
            </div>
          </div>
          <div className="bg-[#F8F9FA] p-2 border border-neutral-300">
            <div className="text-[10px] text-neutral-500">ŞERİT SAYISI</div>
            <div className="text-xs font-bold text-[#121212]">
              {street.laneCount === 0 ? 'Yaya Alanı' : `${street.laneCount} Şerit`}
            </div>
          </div>
          <div className="bg-[#F8F9FA] p-2 border border-neutral-300">
            <div className="text-[10px] text-neutral-500">KRONİK SKOR</div>
            <div className={`text-xs font-bold ${street.chronicScore > 60 ? 'text-[#C2410C]' : 'text-[#047857]'}`}>
              %{street.chronicScore}
            </div>
          </div>
        </div>

        {/* Action Buttons Matrix */}
        <div className="space-y-2 pt-1">
          {/* Main Direct Action: Official Petition Generator */}
          <button
            onClick={() => onOpenPetition(street)}
            className="w-full bg-[#121212] hover:bg-neutral-800 text-white font-bold py-2 px-3 flex items-center justify-center gap-2 shadow-xs transition uppercase tracking-tight"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Bu Yol İçin Resmi Dilekçe Oluştur</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-white" />
          </button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenComplaintModal(street)}
              className="bg-white hover:bg-neutral-100 text-[#121212] font-semibold py-2 px-2.5 border border-neutral-300 flex items-center justify-center gap-1.5 transition text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Şikayet / Yorum</span>
            </button>

            <button
              onClick={() => onToggleMultiSelect(street)}
              className={`font-semibold py-2 px-2.5 border flex items-center justify-center gap-1.5 transition text-xs ${
                isMultiSelected
                  ? 'bg-[#121212] text-white border-[#121212] font-bold'
                  : 'bg-white hover:bg-neutral-100 text-[#121212] border-neutral-300'
              }`}
            >
              {isMultiSelected ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isMultiSelected ? 'Rotadan Çıkar' : 'Rotaya Ekle'}</span>
            </button>
          </div>

          {/* Authority Correction Community Trigger */}
          <button
            onClick={() => onOpenCorrectionModal(street)}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black py-1.5 px-2 border border-dashed border-neutral-400 text-[11px] font-mono flex items-center justify-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sorumlu Kurum Yanlış mı? (Topluluk Teyidi)</span>
          </button>
        </div>

        {/* Community Verification Status */}
        <div className="bg-[#F8F9FA] p-2 border border-neutral-300 text-[11px] flex items-center justify-between font-mono">
          <span className="text-neutral-500">Topluluk Teyidi:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#047857] font-bold">✓ {street.communityVotes.correct} Doğru</span>
            <span className="text-neutral-300">|</span>
            <span className="text-red-600 font-bold">✗ {street.communityVotes.incorrect} Yanlış</span>
          </div>
        </div>

        {/* Recent Complaints for this street */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              BU YOL İÇİN BİLDİRİMLER ({streetComplaints.length})
            </span>
          </div>

          {streetComplaints.length === 0 ? (
            <div className="p-3 bg-[#F8F9FA] border border-neutral-200 text-center text-neutral-500 text-xs">
              Bu cadde için henüz kayıtlı şikayet bulunmamaktadır.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {streetComplaints.map((c) => {
                const cat = CATEGORY_DETAILS[c.category] || CATEGORY_DETAILS.diger;
                return (
                  <div key={c.id} className="bg-[#F8F9FA] p-2.5 border border-neutral-300 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#121212]">{c.title}</span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 border ${
                          c.status === 'cozuldu'
                            ? 'bg-emerald-50 text-[#047857] border-emerald-300'
                            : c.status === 'iletildi'
                            ? 'bg-blue-50 text-[#1D4ED8] border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-[11px] line-clamp-2">{c.description}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-neutral-400 font-mono">
                      <span>{c.author} • {c.date}</span>
                      <span>▲ {c.upvotes} Destek</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
