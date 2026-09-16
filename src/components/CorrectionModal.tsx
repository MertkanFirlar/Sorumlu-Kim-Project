import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  Send, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  X,
  Scale,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { AuthorityCorrectionProposal, AuthorityType, StreetSegment } from '../types';
import { AUTHORITIES_META } from '../data/mockData';
import confetti from 'canvas-confetti';

interface CorrectionModalProps {
  street: StreetSegment;
  onClose: () => void;
  proposals: AuthorityCorrectionProposal[];
  onAddProposal: (proposal: AuthorityCorrectionProposal) => void;
  onVoteProposal: (proposalId: string, isFor: boolean) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  street,
  onClose,
  proposals,
  onAddProposal,
  onVoteProposal,
}) => {
  const currentMeta = AUTHORITIES_META[street.authorityType];
  const [proposedAuth, setProposedAuth] = useState<AuthorityType>(
    street.authorityType === 'ILCE' ? 'BUYUKSEHIR' : 'ILCE'
  );
  const [reason, setReason] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');

  const streetProposals = proposals.filter((p) => p.streetId === street.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newProp: AuthorityCorrectionProposal = {
      id: `prop-${Date.now()}`,
      streetId: street.id,
      streetName: street.name,
      currentAuthority: street.authorityType,
      proposedAuthority: proposedAuth,
      officialDocUrl: docUrl.trim() || undefined,
      reason: reason.trim(),
      submittedBy: submittedBy.trim() || 'Duyarlı Yurttaş',
      submittedAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      votesFor: 1,
      votesAgainst: 0,
      status: 'inceleniyor',
    };

    onAddProposal(newProp);
    setReason('');
    setDocUrl('');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs sk-fade-in z-50 flex items-center justify-center p-4">
      <div className="bg-white sk-pop-in rounded-2xl border border-neutral-300 max-w-xl w-full p-5 shadow-2xl text-[#121212] text-xs space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#121212] flex items-center justify-center font-bold text-white">
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#121212] uppercase tracking-tight">Sorumlu Kurum Teyidi & Düzeltme Önerisi</h3>
              <p className="text-[11px] text-neutral-500 font-mono">{street.name} ({street.district})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black text-base font-bold">
            ✕
          </button>
        </div>

        {/* Current Authority vs Proposed */}
        <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-neutral-300">
          <div>
            <div className="text-[10px] text-neutral-500 font-mono uppercase mb-1">Mevcut Kayıtlı Kurum:</div>
            <div className="font-bold text-[#121212] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentMeta.color }}></span>
              <span>{currentMeta.name}</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">{currentMeta.legalBasis.substring(0, 45)}...</div>
          </div>

          <div>
            <div className="text-[10px] text-neutral-500 font-mono uppercase mb-1">Önerilen Doğru Kurum:</div>
            <select
              value={proposedAuth}
              onChange={(e) => setProposedAuth(e.target.value as AuthorityType)}
              className="w-full bg-white rounded-xl border border-neutral-300 px-2 py-1 text-[#121212] font-bold focus:outline-none focus:border-[#121212] font-mono text-xs"
            >
              {(['BUYUKSEHIR', 'ILCE', 'KGM', 'IL_OZEL'] as AuthorityType[]).map((t) => (
                <option key={t} value={t}>
                  {AUTHORITIES_META[t].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">
              Düzeltme Gerekçesi (UKOME kararı, cadde genişliği, otobüs güzergahı vb.)
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Örn: Bu cadde 2024 yılında UKOME kararıyla genişletilmiş ve toplu taşıma ana arteri olarak Büyükşehir yetkisine devredilmiştir..."
              className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 p-2.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">
                Resmi Karar / Belge Linki (Opsiyonel)
              </label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://belediye.gov.tr/kararlar/..."
                className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">
                Adınız / Mesleğiniz (Opsiyonel)
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder="Örn: Av. Selim K. / Şehir Plancısı"
                className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold rounded-xl border border-neutral-300"
            >
              Kapat
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white font-bold flex items-center gap-1.5 shadow-xs uppercase tracking-tight"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Düzeltme Önerisi Gönder</span>
            </button>
          </div>
        </form>

        {/* Existing Proposals List */}
        {streetProposals.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 space-y-2">
            <div className="font-mono text-[10px] font-bold uppercase text-neutral-500">
              MEVCUT TOPLULUK TEYİT VE DÜZELTME BAŞVURULARI ({streetProposals.length})
            </div>

            {streetProposals.map((prop) => (
              <div key={prop.id} className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-300 text-xs space-y-1.5 text-[#121212]">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#121212] flex items-center gap-1.5">
                    <span className="text-neutral-500">Öneri:</span>
                    <span className="text-[#C2410C] font-mono">{AUTHORITIES_META[prop.proposedAuthority].name}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-[#1D4ED8] border border-blue-200 px-1.5 py-0.5 uppercase font-bold">
                    {prop.status}
                  </span>
                </div>

                <p className="text-neutral-700 text-[11px] leading-relaxed">{prop.reason}</p>

                {prop.officialDocUrl && (
                  <a
                    href={prop.officialDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1D4ED8] hover:underline flex items-center gap-1 text-[10px] font-mono"
                  >
                    <span>Resmi Karar Belgesini Görüntüle</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500 font-mono">
                  <span>{prop.submittedBy} • {prop.submittedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVoteProposal(prop.id, true)}
                      className="text-[#047857] hover:underline flex items-center gap-1 font-bold"
                    >
                      <ThumbsUp className="w-3 h-3" /> {prop.votesFor}
                    </button>
                    <button
                      onClick={() => onVoteProposal(prop.id, false)}
                      className="text-red-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <ThumbsDown className="w-3 h-3" /> {prop.votesAgainst}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
