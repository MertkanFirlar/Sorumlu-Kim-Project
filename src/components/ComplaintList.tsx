import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2,
  Calendar,
  Layers,
  Camera,
  Send,
  X,
  ShieldCheck
} from 'lucide-react';
import { AuthorityType, Complaint, ComplaintCategory, ComplaintStatus, StreetSegment } from '../types';
import { AUTHORITIES_META, CATEGORY_DETAILS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface ComplaintListProps {
  complaints: Complaint[];
  streets: StreetSegment[];
  onAddComplaint: (newComplaint: Complaint) => void;
  onVoteComplaint: (complaintId: string, type: 'up' | 'down') => void;
  onSelectStreetAndOpenMap: (streetId: string) => void;
  initialSelectedStreet?: StreetSegment | null;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  streets,
  onAddComplaint,
  onVoteComplaint,
  onSelectStreetAndOpenMap,
  initialSelectedStreet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Complaint Form State
  const [formStreetId, setFormStreetId] = useState<string>(
    initialSelectedStreet ? initialSelectedStreet.id : streets[0]?.id || ''
  );
  const [formCategory, setFormCategory] = useState<ComplaintCategory>('asfalt_cukur');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAuthor, setFormAuthor] = useState('');

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.streetName.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) return;

    const matchedStreet = streets.find((s) => s.id === formStreetId) || streets[0];

    const newComp: Complaint = {
      id: `comp-${Date.now()}`,
      streetId: matchedStreet.id,
      streetName: matchedStreet.name,
      city: matchedStreet.city,
      district: matchedStreet.district,
      authorityType: matchedStreet.authorityType,
      category: formCategory,
      title: formTitle.trim(),
      description: formDesc.trim(),
      author: formAuthor.trim() || 'Duyarlı Yurttaş',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'beklemede',
      upvotes: 1,
      downvotes: 0,
    };

    onAddComplaint(newComp);
    setShowAddModal(false);
    setFormTitle('');
    setFormDesc('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5">
      {/* Top Banner and Controls */}
      <div className="bg-white border border-neutral-300 p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#121212] tracking-tight uppercase flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1D4ED8]" />
            <span>Şikayet, Bildirim ve Yurttaş Yorumları</span>
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Türkiye genelindeki yollar ve caddeler için yapılan fiziki durum bildirimlerini inceleyin, destekleyin veya yeni kayıt oluşturun.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#121212] hover:bg-neutral-800 text-white font-bold py-2 px-4 text-xs flex items-center justify-center gap-2 shadow-xs transition self-start md:self-auto uppercase tracking-tight"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Yeni Şikayet / Bildirim Ekle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-300 p-3 mb-4 space-y-2.5 text-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şikayetler içinde ara (cadde adı, çukur, aydınlatma, ilçe)..."
              className="w-full bg-[#F8F9FA] border border-neutral-300 pl-8 pr-3 py-1.5 text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:bg-white font-medium"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 font-mono">
            <span className="text-neutral-500 text-[11px] mr-1">Durum:</span>
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2 py-1 text-[11px] font-bold transition ${
                selectedStatus === 'ALL'
                  ? 'bg-[#121212] text-white'
                  : 'bg-[#F8F9FA] text-neutral-600 hover:text-black border border-neutral-300'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedStatus('beklemede')}
              className={`px-2 py-1 text-[11px] font-bold transition ${
                selectedStatus === 'beklemede'
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#F8F9FA] text-amber-800 hover:text-black border border-amber-300'
              }`}
            >
              Beklemede
            </button>
            <button
              onClick={() => setSelectedStatus('iletildi')}
              className={`px-2 py-1 text-[11px] font-bold transition ${
                selectedStatus === 'iletildi'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#F8F9FA] text-[#1D4ED8] hover:text-black border border-blue-300'
              }`}
            >
              İletildi
            </button>
            <button
              onClick={() => setSelectedStatus('cozuldu')}
              className={`px-2 py-1 text-[11px] font-bold transition ${
                selectedStatus === 'cozuldu'
                  ? 'bg-[#047857] text-white'
                  : 'bg-[#F8F9FA] text-[#047857] hover:text-black border border-emerald-300'
              }`}
            >
              Çözüldü
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-neutral-200">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition ${
              selectedCategory === 'ALL'
                ? 'bg-[#121212] text-white font-bold'
                : 'bg-[#F8F9FA] text-neutral-600 hover:text-black border border-neutral-300'
            }`}
          >
            Tüm Kategoriler ({complaints.length})
          </button>
          {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((catKey) => {
            const cat = CATEGORY_DETAILS[catKey];
            const count = complaints.filter((c) => c.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-2.5 py-1 text-[11px] font-medium whitespace-nowrap border transition ${
                  isSelected
                    ? 'bg-[#121212] text-white border-[#121212] font-bold'
                    : 'bg-[#F8F9FA] text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-neutral-300 p-12 text-center text-neutral-500 shadow-xs">
            <AlertTriangle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#121212]">Seçilen filtrelere uygun şikayet kaydı bulunamadı.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#1D4ED8] hover:underline font-semibold"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          filteredComplaints.map((comp) => {
            const meta = AUTHORITIES_META[comp.authorityType];
            const cat = CATEGORY_DETAILS[comp.category] || CATEGORY_DETAILS.diger;

            return (
              <div
                key={comp.id}
                className="bg-white border border-neutral-300 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-neutral-400 transition text-[#121212]"
              >
                {/* Top Card Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      ></span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white shadow-xs"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.shortName}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {comp.district}, {comp.city}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                        comp.status === 'cozuldu'
                          ? 'bg-emerald-50 text-[#047857] border-emerald-300'
                          : comp.status === 'iletildi'
                          ? 'bg-blue-50 text-[#1D4ED8] border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {comp.status === 'cozuldu' ? '✓ Çözüldü' : comp.status === 'iletildi' ? '→ İletildi' : '⏱ Beklemede'}
                    </span>
                  </div>

                  {/* Street Name with Direct Map Jump Link */}
                  <div
                    onClick={() => onSelectStreetAndOpenMap(comp.streetId)}
                    className="text-xs font-mono font-bold text-[#1D4ED8] hover:underline cursor-pointer flex items-center gap-1 mb-1"
                  >
                    <span>📍 {comp.streetName}</span>
                    <span className="text-neutral-400 text-[10px]">(Haritada Gör)</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#121212] mb-1.5 leading-snug">
                    {comp.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                {/* Official Municipality Response (If exists) */}
                {comp.officialResponse && (
                  <div className="bg-[#F8F9FA] border border-neutral-300 p-2.5 text-xs text-[#121212]">
                    <div className="flex items-center gap-1.5 text-[#1D4ED8] font-bold text-[11px] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>Resmi Yanıt ({comp.officialResponse.responder}):</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-relaxed font-sans">
                      "{comp.officialResponse.text}"
                    </p>
                    <div className="text-[10px] text-neutral-500 font-mono mt-1 text-right">
                      {comp.officialResponse.date}
                    </div>
                  </div>
                )}

                {/* Footer Meta and Upvote/Downvote Buttons */}
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-neutral-500 font-mono">
                    <span>{comp.author}</span> • <span>{comp.date}</span>
                  </div>

                  {/* Upvote & Downvote */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVoteComplaint(comp.id, 'up')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold border transition ${
                        comp.userVoted === 'up'
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                      }`}
                      title="Bu şikayeti destekle"
                    >
                      <ThumbsUp className="w-3 h-3 text-[#1D4ED8]" />
                      <span>{comp.upvotes}</span>
                    </button>

                    <button
                      onClick={() => onVoteComplaint(comp.id, 'down')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold border transition ${
                        comp.userVoted === 'down'
                          ? 'bg-neutral-800 text-white border-neutral-800'
                          : 'bg-white text-neutral-500 border-neutral-300 hover:bg-neutral-100'
                      }`}
                      title="Desteklemiyorum"
                    >
                      <ThumbsDown className="w-3 h-3 text-neutral-500" />
                      <span>{comp.downvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Complaint Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 max-w-lg w-full p-5 shadow-2xl text-[#121212] text-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <h2 className="font-black text-sm text-[#121212] uppercase tracking-tight flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1D4ED8]" />
                <span>Yeni Yol & Cadde Şikayeti Bildir</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3">
              {/* Street Selector */}
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">İlgili Cadde / Sokak</label>
                <select
                  value={formStreetId}
                  onChange={(e) => setFormStreetId(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white font-mono text-xs"
                >
                  {streets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.district} / {s.city}) - {AUTHORITIES_META[s.authorityType].shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Şikayet Kategorisi</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ComplaintCategory)}
                  className="w-full bg-[#F8F9FA] border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs font-medium"
                >
                  {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {CATEGORY_DETAILS[catKey].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Başlık</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Örn: Sağ şerit çukur oluşumu ve aydınlatma yetersizliği"
                  className="w-full bg-[#F8F9FA] border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Açıklama ve Konum Tarifi</label>
                <textarea
                  rows={3}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Sorunun tam olarak hangi noktada olduğunu, trafiği veya yayaları nasıl etkilediğini detaylandırın..."
                  className="w-full bg-[#F8F9FA] border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs leading-relaxed"
                />
              </div>

              {/* Author */}
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Adınız veya Takma İsim (Opsiyonel)</label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="Örn: Caner D."
                  className="w-full bg-[#F8F9FA] border border-neutral-300 p-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white text-xs font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold border border-neutral-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white font-bold flex items-center gap-1.5 shadow-xs uppercase tracking-tight"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Şikayeti Yayınla</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
