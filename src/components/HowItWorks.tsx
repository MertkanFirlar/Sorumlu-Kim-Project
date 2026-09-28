import React from 'react';
import { X, Search, Building2, FileText, Lightbulb, MapPin, Share2 } from 'lucide-react';

interface HowItWorksProps {
  onClose: () => void;
}

const steps = [
  {
    icon: Search,
    color: '#1D4ED8',
    title: 'Yolu bul',
    desc: 'Arama kutusuna cadde / sokak / mahalle yaz (örn. “Bağdat Caddesi”) ya da doğrudan haritaya dokun. Konumunu da kullanabilirsin.',
  },
  {
    icon: Building2,
    color: '#047857',
    title: 'Kim sorumlu, öğren',
    desc: 'O yolun bakım-onarımından hangi kurumun sorumlu olduğunu gör: Büyükşehir, İlçe Belediyesi, KGM ya da İl Özel İdare — iletişim ve yasal dayanağıyla.',
  },
  {
    icon: FileText,
    color: '#C2410C',
    title: 'Dilekçe oluştur',
    desc: '3 adımda resmi dilekçeni hazırla, PDF olarak indir veya tek tuşla CİMER’e gönder. İstersen bilgiyi paylaş.',
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs sk-fade-in z-[70] flex items-center justify-center p-4">
      <div className="sk-pop-in bg-white rounded-2xl border border-neutral-200 w-full max-w-lg shadow-2xl overflow-hidden text-[#121212] flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="relative p-5 pb-3 border-b border-neutral-100 shrink-0">
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
              <h2 className="text-base font-black tracking-tight">Nasıl Çalışır?</h2>
              <p className="text-xs text-neutral-500">Sorumlu Kim? ile 3 adımda çözüm.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Steps */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: s.color }}
                  >
                    <s.icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-neutral-200 my-1" />}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-neutral-400">ADIM {i + 1}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#121212] leading-tight">{s.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Example scenario */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs leading-relaxed text-amber-900">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
              <Lightbulb className="w-4 h-4" /> Örnek
            </div>
            “Sokağımdaki çukur aylardır kapatılmıyor.” → Sokağını <strong>ara</strong> →
            sorumlunun <strong>İlçe Belediyesi</strong> olduğunu gör → <strong>dilekçeni oluştur</strong>,
            CİMER’e gönder. İstersen komşularınla <Share2 className="w-3 h-3 inline -mt-0.5" /> <strong>paylaş</strong>.
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Not: Kurum bilgisi çoğu yerde yasal kurallara göre <strong>tahminidir</strong>; kesin teyit için
            ilgili belediyeye danışabilir, yanlışsa “Sorumlu kurum yanlış mı?” ile bildirebilirsin.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            Anladım, başlayalım
          </button>
        </div>
      </div>
    </div>
  );
};
