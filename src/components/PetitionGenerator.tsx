import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Printer, 
  ExternalLink, 
  Check, 
  Send, 
  Building2, 
  Sparkles, 
  Layers, 
  AlertCircle,
  ShieldAlert,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { ComplaintCategory, PetitionFormData, StreetSegment } from '../types';
import { AUTHORITIES_META, CATEGORY_DETAILS } from '../data/mockData';
import { generatePetitionText, downloadPetitionPDF } from '../utils/petitionTemplate';
import confetti from 'canvas-confetti';

interface PetitionGeneratorProps {
  selectedStreets: StreetSegment[];
  onRemoveStreet: (streetId: string) => void;
  onClearStreets: () => void;
}

export const PetitionGenerator: React.FC<PetitionGeneratorProps> = ({
  selectedStreets,
  onRemoveStreet,
  onClearStreets,
}) => {
  const primaryStreet = selectedStreets[0] || null;
  const primaryAuthority = primaryStreet
    ? AUTHORITIES_META[primaryStreet.authorityType]
    : AUTHORITIES_META.BUYUKSEHIR;

  const [formData, setFormData] = useState<PetitionFormData>({
    applicantName: 'Ahmet Yılmaz',
    applicantTckn: '12345678901',
    applicantPhone: '0532 555 44 33',
    applicantEmail: 'ahmet.yilmaz@ornek.com',
    applicantAddress: primaryStreet ? `${primaryStreet.neighborhood}, ${primaryStreet.district}` : 'Kadıköy, İstanbul',
    targetAuthorityName: primaryStreet ? `${primaryStreet.city.toUpperCase()} ${primaryAuthority.fullNamePrefix}` : 'İSTANBUL BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
    targetDepartment: primaryAuthority.departmentName,
    selectedStreets: selectedStreets,
    city: primaryStreet ? primaryStreet.city : 'İstanbul',
    district: primaryStreet ? primaryStreet.district : 'Kadıköy',
    subjectCategory: 'asfalt_cukur',
    subjectTitle: 'Yol Bakım, Sıcak Asfalt Kaplama ve Çukur Onarımı Talebi',
    incidentDetails: primaryStreet
      ? `${primaryStreet.name} üzerinde araç ve yaya güvenliğini tehlikeye atan derin çukurlar, asfalt aşınmaları ve deformasyonlar bulunmaktadır. Gece saatlerinde kaza riski katlanmaktadır.`
      : 'Güzergah üzerinde yer alan derin çukurlar ve asfalt tahribatı sebebiyle can ve mal güvenliği tehlikeye girmektedir.',
    demandRequest: 'Bahse konu yol güzergahının ivedilikle yerinde incelenerek sıcak asfalt serimi ve altyapı onarımının yapılmasını, 3071 Sayılı Dilekçe Kanunu uyarınca yasal süresi içerisinde tarafıma yazılı dönüş sağlanmasını arz ve talep ederim.',
    dateStr: new Date().toLocaleDateString('tr-TR'),
    referenceNo: `SK-DIL-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const [copied, setCopied] = useState(false);
  const [showCimerModal, setShowCimerModal] = useState(false);

  // Sync when selectedStreets change
  useEffect(() => {
    if (selectedStreets.length > 0) {
      const pStreet = selectedStreets[0];
      const pAuth = AUTHORITIES_META[pStreet.authorityType];
      setFormData((prev) => ({
        ...prev,
        selectedStreets: selectedStreets,
        city: pStreet.city,
        district: pStreet.district,
        targetAuthorityName: `${pStreet.city.toUpperCase()} ${pAuth.fullNamePrefix}`,
        targetDepartment: pAuth.departmentName,
        incidentDetails: `${selectedStreets.map((s) => s.name).join(', ')} güzergahı boyunca tespit edilen yol ve altyapı bozulmaları can ve mal güvenliğini tehdit etmektedir.`,
      }));
    }
  }, [selectedStreets]);

  // Pre-set templates on category change
  const handleCategoryChange = (category: ComplaintCategory) => {
    let title = '';
    let details = '';
    let request = '';

    const streetNames = selectedStreets.length > 0 ? selectedStreets.map((s) => s.name).join(' ve ') : 'belirtilen cadde';

    switch (category) {
      case 'asfalt_cukur':
        title = 'Yol Bakım, Sıcak Asfalt Kaplama ve Çukur Onarımı Talebi';
        details = `${streetNames} üzerinde yer yer 15-20 santimetreye varan derin çukurlar, kot farkları ve asfalt yıpranmaları mevcuttur. Araçların alt takımları zarar görmekte, ani şerit değiştirmeler sebebiyle trafik güvenliği tehlikeye girmektedir.`;
        request = 'Güzergahın acilen fen işleri asfalt ekiplerince incelenerek yama ve komple finişerli sıcak asfalt serimi yapılmasını arz ederim.';
        break;
      case 'aydinlatma':
        title = 'Cadde / Sokak Aydınlatması ve Direk Arızası Giderilmesi Talebi';
        details = `${streetNames} boyunca bulunan aydınlatma armatürlerinin önemli bir kısmı yanmamaktadır. Güzergah gece saatlerinde tamamen karanlığa gömülmekte olup asayiş ve yaya güvenliği zafiyeti doğurmaktadır.`;
        request = 'Aydınlatma hattının ve direklerin acilen kontrol edilerek arızalı armatürlerin yenilenmesini ve aydınlatma seviyesinin standarda kavuşturulmasını talep ederim.';
        break;
      case 'kaldirim_yaya':
        title = 'Kaldırım Onarımı, Engelli Rampası Düzenlemesi ve Yaya Güvenliği Talebi';
        details = `${streetNames} üzerindeki yaya kaldırımlarında kırık, çökmüş ve yerinden oynamış parke taşları bulunmaktadır. Ayrıca engelli rampaları mevzuata uygun olmayıp bebek arabası ve tekerlekli sandalye geçişini engellemektedir.`;
        request = 'Kaldırım döşemelerinin yenilenmesi ve TS 12576 standartlarına uygun hissedilebilir yüzeyli engelli rampalarının inşa edilmesini arz ederim.';
        break;
      case 'altyapi_kazi':
        title = 'Kapatılmayan Altyapı Kazı Hendeği ve Asfalt Yaması Talebi';
        details = `${streetNames} üzerinde yürütülen altyapı kazı çalışması (su/elektrik/doğalgaz) tamamlanmış olmasına rağmen açılan hendekler yalnızca toprak ve mucurla doldurulmuş, asfalt tabakası serilmemiştir. Yağışla birlikte çökmeler meydana gelmiştir.`;
        request = 'AYKOME standartları uyarınca kazı alanının ivedilikle usulüne uygun olarak bitümlü sıcak karışımla kaplanmasını arz ve talep ederim.';
        break;
      case 'tabela_sinyalizasyon':
        title = 'Trafik İkaz Levhası ve Sinyalizasyon Düzenlemesi Talebi';
        details = `${streetNames} kavşağında bulunan trafik lambası sinyalizasyon süreleri dengesiz olup yön ve hız sınırı levhaları yıpranmış ve görünmez hale gelmiştir.`;
        request = 'Ulaşım Koordinasyon Merkezi (UKOME) teknik ekiplerince sinyalizasyon fazlarının yeniden ayarlanmasını ve reflektif levha montajını arz ederim.';
        break;
      default:
        title = 'Yol ve Çevre Düzenlemesi Talebi';
        details = `${streetNames} üzerindeki genel fiziki ve altyapısal eksikliklerin giderilmesi gerekmektedir.`;
        request = 'Gereğinin ilgili mevzuat hükümleri çerçevesinde yapılmasını arz ve talep ederim.';
    }

    setFormData((prev) => ({
      ...prev,
      subjectCategory: category,
      subjectTitle: title,
      incidentDetails: details,
      demandRequest: request,
    }));
  };

  const petitionText = generatePetitionText(formData);

  const handleCopyText = () => {
    navigator.clipboard.writeText(petitionText);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    downloadPetitionPDF(formData);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5">
      {/* Editorial Header */}
      <div className="bg-white border border-neutral-300 rounded-none p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-[#047857] text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-300">
              RESMİ MEVZUAT UYUMLU (3071 & 4982 SAYILI KANUN)
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#121212] tracking-tight uppercase mt-1">
            Resmi İdari Dilekçe ve Başvuru Oluşturucu
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Haritada seçtiğiniz cadde ve yolların yasal sorumlusu olan kuruma (Büyükşehir, İlçe, KGM veya İl Özel İdare) doğrudan hitaben hazırlanmış resmi A4 dilekçe üretin.
          </p>
        </div>

        {/* Selected Streets Badge List */}
        <div className="bg-[#F8F9FA] p-2.5 border border-neutral-300 text-xs">
          <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase flex items-center justify-between mb-1.5">
            <span>Seçili Güzergah ({selectedStreets.length})</span>
            {selectedStreets.length > 0 && (
              <button
                onClick={onClearStreets}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[10px] font-bold"
              >
                <Trash2 className="w-3 h-3" /> Temizle
              </button>
            )}
          </div>
          {selectedStreets.length === 0 ? (
            <div className="text-neutral-400 italic text-[11px]">
              Haritadan henüz bir yol seçilmedi (Varsayılan şablon aktif).
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {selectedStreets.map((s) => (
                <span
                  key={s.id}
                  className="bg-white text-[#121212] border border-neutral-300 px-2 py-0.5 text-[11px] font-mono flex items-center gap-1 shadow-xs"
                >
                  <span>{s.name}</span>
                  <button
                    onClick={() => onRemoveStreet(s.id)}
                    className="text-neutral-400 hover:text-black font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Form on left, Live A4 Paper on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Inputs (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5 bg-white border border-neutral-300 p-4 text-xs shadow-xs">
          <div className="text-xs font-black font-mono text-[#121212] uppercase tracking-wider border-b border-neutral-200 pb-2">
            1. BAŞVURU SAHİBİ VE MUHATAP BİLGİLERİ
          </div>

          {/* Applicant Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Adı Soyadı</label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">T.C. Kimlik No</label>
              <input
                type="text"
                maxLength={11}
                value={formData.applicantTckn}
                onChange={(e) => setFormData({ ...formData, applicantTckn: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] font-mono focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Telefon</label>
              <input
                type="text"
                value={formData.applicantPhone}
                onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] font-mono focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">E-Posta</label>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">İkametgah / Mahalle Adresi</label>
            <input
              type="text"
              value={formData.applicantAddress}
              onChange={(e) => setFormData({ ...formData, applicantAddress: e.target.value })}
              className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white"
            />
          </div>

          {/* Target Authority Info (Auto filled from map) */}
          <div className="pt-2 border-t border-neutral-200 space-y-2">
            <div className="text-xs font-black font-mono text-[#121212] uppercase tracking-wider">
              2. HEDEF KURUM VE SORUN KATEGORİSİ
            </div>

            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Muhatap Kurum Başlığı</label>
              <input
                type="text"
                value={formData.targetAuthorityName}
                onChange={(e) => setFormData({ ...formData, targetAuthorityName: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] font-mono text-[11px] focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>

            {/* Quick Category Buttons */}
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Şikayet / Talep Türü (Hızlı Şablon)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((catKey) => {
                  const cat = CATEGORY_DETAILS[catKey];
                  const isSelected = formData.subjectCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => handleCategoryChange(catKey)}
                      className={`p-2 text-[11px] text-left font-medium border transition ${
                        isSelected
                          ? 'bg-[#121212] border-[#121212] text-white font-bold'
                          : 'bg-[#F8F9FA] border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Dilekçe Konu Başlığı</label>
              <input
                type="text"
                value={formData.subjectTitle}
                onChange={(e) => setFormData({ ...formData, subjectTitle: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 px-2.5 py-1.5 text-[#121212] font-bold focus:outline-none focus:border-[#121212] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Olay, Tespit ve Şikayet Detayları</label>
              <textarea
                rows={3}
                value={formData.incidentDetails}
                onChange={(e) => setFormData({ ...formData, incidentDetails: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 p-2.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Somut Talep ve Netice</label>
              <textarea
                rows={2}
                value={formData.demandRequest}
                onChange={(e) => setFormData({ ...formData, demandRequest: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-neutral-300 p-2.5 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Live A4 Paper Sheet Preview (Right 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Dispatch Action Bar */}
          <div className="bg-white border border-neutral-300 p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="bg-[#121212] hover:bg-neutral-800 text-white font-bold py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-xs transition uppercase tracking-tight"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>PDF İndir (A4)</span>
              </button>

              <button
                onClick={handleCopyText}
                className="bg-white hover:bg-neutral-100 text-[#121212] font-semibold py-1.5 px-3 text-xs border border-neutral-300 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#047857]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-[#121212] py-1.5 px-2.5 text-xs border border-neutral-300"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır</span>
              </button>
            </div>

            {/* Direct Dispatch Portal Bridges */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCimerModal(true)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>CİMER'e Gönder</span>
              </button>

              <a
                href="https://acikkapi.gov.tr"
                target="_blank"
                rel="noreferrer"
                className="bg-[#1D4ED8] hover:bg-blue-800 text-white font-semibold py-1.5 px-2.5 text-xs flex items-center gap-1 transition"
              >
                <span>Açık Kapı</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Formal Turkish A4 Paper Layout Container */}
          <div className="bg-[#E9ECEF] p-4 border border-neutral-300 flex justify-center overflow-x-auto">
            <div
              id="printable-petition"
              className="w-full max-w-[650px] min-h-[750px] bg-white text-[#121212] p-8 sm:p-12 shadow-sm font-serif relative select-text border border-neutral-300"
              style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
            >
              {/* T.C. Formal Letterhead */}
              <div className="text-center font-bold text-sm tracking-wider uppercase mb-6 leading-relaxed">
                <div>T.C.</div>
                <div className="text-base text-black font-black">{formData.targetAuthorityName}</div>
                <div className="text-xs text-neutral-600 font-sans tracking-normal">{formData.targetDepartment}</div>
              </div>

              {/* Date & Reference Meta Block */}
              <div className="flex justify-between items-start text-xs font-sans mb-5 pb-2 border-b border-neutral-200">
                <div>
                  <span className="font-semibold text-neutral-500">EVRAK / REF NO:</span>{' '}
                  <span className="font-mono text-black font-bold">{formData.referenceNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-500">TARİH:</span>{' '}
                  <span className="font-bold">{formData.dateStr}</span>
                </div>
              </div>

              {/* Subject Line */}
              <div className="text-xs sm:text-sm font-bold uppercase mb-5 leading-normal">
                <span className="underline">KONU:</span> {formData.subjectTitle}
              </div>

              {/* Relevant Street Details */}
              <div className="text-xs mb-4 bg-neutral-50 p-2.5 border border-neutral-300 font-sans">
                <span className="font-bold text-neutral-800">İLGİLİ CADDE / GÜZERGAH: </span>
                <span className="text-neutral-700">
                  {formData.selectedStreets.length > 0
                    ? formData.selectedStreets.map((s) => `${s.name} (${s.district}, ${s.city})`).join('; ')
                    : `${formData.district}, ${formData.city}`}
                </span>
              </div>

              {/* Body Paragraphs */}
              <div className="text-xs sm:text-sm leading-relaxed space-y-3.5 text-justify">
                <p>
                  <strong>1.</strong> Yukarıda açık adresi ve güzergahı belirtilen mevkide ikamet eden / bahse konu güzergahı düzenli olarak kullanan bir Türkiye Cumhuriyeti yurttaşı olarak; söz konusu yol ve çevre altyapısı üzerinde <em>{formData.incidentDetails}</em>
                </p>

                <p>
                  <strong>2.</strong> Söz konusu durum araç trafiği, kamu düzeni ve özellikle yaya/engelli yurttaşlarımızın can ve mal güvenliği açısından ivedilikle giderilmesi gereken ciddi bir risk teşkil etmektedir.
                </p>

                <p>
                  <strong>3.</strong> İlgili yasal mevzuat hükümleri çerçevesinde (5216 ve 5393 Sayılı Belediye Kanunları ile Karayolları mevzuatı uyarınca) anılan güzergahın bakım, onarım, asfalt kaplama ve trafik güvenliğini tesis etme yükümlülüğü kurumunuzun asli görev sahasındadır.
                </p>

                <p className="font-semibold pt-2">
                  <strong>TALEP VE NETİCE:</strong> Yukarıda arz ve izah edilen nedenlerle; bahse konu cadde ve sokaktaki aksaklıkların kurumunuz teknik ve fen işleri ekiplerince yerinde incelenmesini, gerekli onarım çalışmalarının başlatılmasını ve 3071 Sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun ile 4982 Sayılı Bilgi Edinme Hakkı Kanunu gereğince başvuru sonucunun tarafıma yazılı olarak bildirilmesini saygılarımla arz ve talep ederim.
                </p>
              </div>

              {/* Applicant Signature Box */}
              <div className="mt-10 flex justify-end font-sans">
                <div className="text-xs w-64 space-y-1">
                  <div className="font-black text-sm text-black">{formData.applicantName}</div>
                  <div className="text-neutral-600">T.C. Kimlik: <span className="font-mono">{formData.applicantTckn}</span></div>
                  <div className="text-neutral-600">Telefon: <span className="font-mono">{formData.applicantPhone}</span></div>
                  <div className="text-neutral-600">E-Posta: {formData.applicantEmail}</div>
                  <div className="text-neutral-600">Adres: {formData.applicantAddress}</div>
                  <div className="pt-6 font-serif italic text-neutral-400">İmza: ____________________</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CIMER Integration Bridge Modal */}
      {showCimerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 max-w-lg w-full p-5 shadow-2xl text-[#121212] text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-700 flex items-center justify-center font-bold text-white">
                  C
                </div>
                <h3 className="font-black text-sm text-[#121212] uppercase tracking-tight">CİMER Başvuru Entegrasyonu</h3>
              </div>
              <button
                onClick={() => setShowCimerModal(false)}
                className="text-neutral-400 hover:text-black text-base font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-600 leading-relaxed">
              Cumhurbaşkanlığı İletişim Merkezi (CİMER) üzerinden doğrudan işlem başlatabilmeniz için hazırlanan resmi dilekçe metni panonuza kopyalandı.
            </p>

            <div className="bg-[#F8F9FA] p-3 border border-neutral-300 space-y-2">
              <div className="font-bold text-[#121212] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#047857]" />
                <span>3 Adımda Hızlı Gönderim:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-600 text-[11px] leading-relaxed">
                <li>Aşağıdaki butona tıklayarak resmi CİMER başvuru ekranını açın.</li>
                <li>e-Devlet ile giriş yapın ve <strong>"Şikayet / İstek"</strong> seçeneğini seçin.</li>
                <li>Başvuru metni kutusuna <strong>(Ctrl+V / Yapıştır)</strong> yaparak hazır dilekçenizi gönderin.</li>
              </ol>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCimerModal(false)}
                className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold border border-neutral-300"
              >
                Kapat
              </button>
              <a
                href="https://www.cimer.gov.tr"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  handleCopyText();
                  setShowCimerModal(false);
                }}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>CİMER Sayfasına Git</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
