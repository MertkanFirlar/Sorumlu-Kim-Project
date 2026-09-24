import React from 'react';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

// İletişim e-postanızı buraya yazın (KVKK aydınlatma için önerilir)
const CONTACT_EMAIL = '';

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs sk-fade-in z-[60] flex items-center justify-center p-4">
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
            <div className="w-10 h-10 bg-[#047857] rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Gizlilik & KVKK Aydınlatma Metni</h2>
              <p className="text-xs text-neutral-500">Verileriniz cihazınızda kalır.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-neutral-700">
          {/* Güven özeti */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1.5">
            <div className="font-bold text-[#047857] flex items-center gap-1.5 text-sm">
              <Lock className="w-4 h-4" /> Kısaca: Sizi takip etmiyoruz
            </div>
            <ul className="space-y-1 text-[#065f46]">
              <li className="flex gap-1.5"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Sunucumuz veya veritabanımız <strong>yok</strong> — hiçbir bilginiz bize gelmez.</li>
              <li className="flex gap-1.5"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Üyelik/hesap <strong>yok</strong>; kimliğinizi istemiyoruz.</li>
              <li className="flex gap-1.5"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Dilekçe bilgileriniz (ad, T.C., telefon) <strong>yalnızca sizin tarayıcınızda</strong> işlenir, PDF cihazınızda üretilir; hiçbir yere gönderilmez.</li>
              <li className="flex gap-1.5"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Reklam takip çerezi ve analitik <strong>kullanmıyoruz</strong>.</li>
            </ul>
          </div>

          <Section title="1. Veri Sorumlusu">
            Bu uygulama (“Sorumlu Kim?”) kâr amacı gütmeyen bir kamu hizmeti aracıdır ve gönüllü geliştiriciler tarafından yürütülür.
            {CONTACT_EMAIL ? <> İletişim: <a className="text-[#1D4ED8] underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : ' İletişim kanalı yakında eklenecektir.'}
          </Section>

          <Section title="2. Hangi verileri işliyoruz?">
            Uygulamanın <strong>sunucusu yoktur</strong>; tamamen tarayıcınızda çalışır. Kişisel verilerinizi toplayan, saklayan veya bize aktaran bir arka uç bulunmaz. Dilekçe oluştururken girdiğiniz ad, T.C. kimlik no, telefon ve adres bilgileri yalnızca o anda, cihazınızda PDF üretmek için kullanılır ve tarafımıza iletilmez.
          </Section>

          <Section title="3. Tarayıcınızda saklananlar (localStorage)">
            Deneyiminizi hatırlamak için bazı tercihler <strong>yalnızca kendi cihazınızda</strong> saklanır: tema (gece/gündüz), karşılama ekranını gördüğünüz bilgisi ve uygulama içinde yazdığınız şikayet/öneri taslakları. Bunlar bize gönderilmez; tarayıcı ayarlarınızdan istediğiniz an silebilirsiniz.
          </Section>

          <Section title="4. Harita ve arama için üçüncü taraflar">
            Haritayı ve adres aramasını sağlayabilmek için aşağıdaki bağımsız servislere teknik istek gönderilir. Bu servisler isteği karşılamak için IP adresinizi ve (arama yaparken) yazdığınız metni görebilir; bu, kendi gizlilik politikalarına tabidir:
            <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-neutral-600">
              <li>OpenStreetMap — Nominatim &amp; Overpass (yol verisi ve arama)</li>
              <li>Esri / ArcGIS (harita görüntüsü)</li>
              <li>Google Fonts (yazı tipleri)</li>
            </ul>
          </Section>

          <Section title="5. Konum bilgisi">
            “Konumumu Kullan” dediğinizde tarayıcınız konum izni ister. Konumunuz yalnızca haritayı ortalamak ve yakınınızdaki yolu göstermek için o an kullanılır; tarafımızca <strong>saklanmaz</strong>.
          </Section>

          <Section title="6. Çerezler">
            Uygulamamız reklam/takip çerezi yerleştirmez. (İleride reklam eklenirse bu metin güncellenir ve gerekli onay alınır.)
          </Section>

          <Section title="7. KVKK kapsamındaki haklarınız">
            6698 sayılı KVKK m.11 uyarınca kişisel verilerinize dair haklarınız saklıdır. Bize aktarılan bir veriniz olmadığından silme/düzeltme talepleriniz cihazınızdaki verilerle sınırlıdır; bunları tarayıcınızdan doğrudan yönetebilirsiniz.
          </Section>

          <p className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-100">
            Son güncelleme: 24.09.2026 · Bu metin bilgilendirme amaçlıdır ve uygulama geliştikçe güncellenebilir.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#121212] hover:bg-neutral-800 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="font-bold text-[#121212] text-[13px] mb-1">{title}</h3>
    <p>{children}</p>
  </div>
);
