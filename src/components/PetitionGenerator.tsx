import React, { useState, useEffect } from 'react';
import {
  Download,
  Copy,
  Printer,
  ExternalLink,
  Check,
  Send,
  Trash2,
  ArrowRight,
  ArrowLeft,
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

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<PetitionFormData>({
    applicantName: '',
    applicantTckn: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: primaryStreet ? `${primaryStreet.neighborhood}, ${primaryStreet.district}` : '',
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

    setFormData((prev) => ({ ...prev, subjectCategory: category, subjectTitle: title, incidentDetails: details, demandRequest: request }));
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

  const handlePrint = () => window.print();

  // Validation & step config
  const tcknDigits = formData.applicantTckn.replace(/\D/g, '');
  const step1Valid = formData.applicantName.trim().length > 1 && tcknDigits.length === 11;
  const steps: { n: 1 | 2 | 3; label: string }[] = [
    { n: 1, label: 'Bilgileriniz' },
    { n: 2, label: 'Şikayet' },
    { n: 3, label: 'Önizle & İndir' },
  ];

  const inputClass =
    'w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 px-3 py-2 text-[#121212] focus:outline-none focus:border-[#121212] focus:bg-white';

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-300 p-4 mb-4 shadow-xs">
        <span className="bg-emerald-50 text-[#047857] text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 uppercase">
          Resmi · 3071 & 4982 Sayılı Kanun
        </span>
        <h1 className="text-lg sm:text-xl font-black text-[#121212] tracking-tight mt-1.5">Resmi Dilekçe Oluştur</h1>
        <p className="text-xs text-neutral-600 mt-0.5">
          3 adımda, seçtiğiniz yolun sorumlusu kuruma hitaben resmi A4 dilekçe hazırlayın.
        </p>

        {selectedStreets.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-neutral-500 uppercase mr-1">Güzergah:</span>
            {selectedStreets.map((s) => (
              <span
                key={s.id}
                className="bg-[#F8F9FA] rounded-lg border border-neutral-300 px-2 py-0.5 text-[11px] flex items-center gap-1"
              >
                {s.name}
                <button onClick={() => onRemoveStreet(s.id)} className="text-neutral-400 hover:text-black font-bold">×</button>
              </span>
            ))}
            <button onClick={onClearStreets} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[10px] font-bold ml-1">
              <Trash2 className="w-3 h-3" /> Temizle
            </button>
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step >= s.n ? 'bg-[#1D4ED8] text-white' : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step >= s.n ? 'text-[#121212]' : 'text-neutral-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={`w-6 sm:w-10 h-0.5 rounded ${step > s.n ? 'bg-[#1D4ED8]' : 'bg-neutral-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-neutral-300 p-4 sm:p-5 shadow-xs">
        {/* STEP 1 — Applicant info */}
        {step === 1 && (
          <div className="space-y-3.5 text-xs">
            <h2 className="text-sm font-black text-[#121212]">Kişisel Bilgileriniz</h2>
            <p className="text-[11px] text-neutral-500 -mt-2">Dilekçede yer alacak resmi başvuru sahibi bilgileri.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Adı Soyadı *</label>
                <input type="text" placeholder="Örn: Ayşe Yıldız" value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">T.C. Kimlik No *</label>
                <input type="text" inputMode="numeric" maxLength={11} placeholder="11 haneli" value={formData.applicantTckn}
                  onChange={(e) => setFormData({ ...formData, applicantTckn: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Telefon</label>
                <input type="tel" placeholder="05xx xxx xx xx" value={formData.applicantPhone}
                  onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">E-Posta</label>
                <input type="email" placeholder="ornek@eposta.com" value={formData.applicantEmail}
                  onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">İkametgah / Mahalle Adresi</label>
              <input type="text" placeholder="Mahalle, İlçe" value={formData.applicantAddress}
                onChange={(e) => setFormData({ ...formData, applicantAddress: e.target.value })} className={inputClass} />
            </div>
            {!step1Valid && (formData.applicantName || formData.applicantTckn) && (
              <p className="text-[11px] text-amber-600">Devam etmek için ad soyad ve 11 haneli T.C. kimlik no gerekli.</p>
            )}
          </div>
        )}

        {/* STEP 2 — Complaint */}
        {step === 2 && (
          <div className="space-y-3.5 text-xs">
            <h2 className="text-sm font-black text-[#121212]">Şikayet / Talep</h2>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Muhatap Kurum</label>
              <input type="text" value={formData.targetAuthorityName}
                onChange={(e) => setFormData({ ...formData, targetAuthorityName: e.target.value })}
                className={`${inputClass} text-[11px]`} />
              <p className="text-[10px] text-neutral-400 mt-1">Seçtiğiniz yola göre otomatik dolduruldu — düzenleyebilirsiniz.</p>
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Konu Türü (hazır şablon seç)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((catKey) => {
                  const cat = CATEGORY_DETAILS[catKey];
                  const isSelected = formData.subjectCategory === catKey;
                  return (
                    <button key={catKey} type="button" onClick={() => handleCategoryChange(catKey)}
                      className={`p-2 text-[11px] text-left font-medium rounded-lg border transition ${
                        isSelected ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white font-bold' : 'bg-[#F8F9FA] border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Dilekçe Konu Başlığı</label>
              <input type="text" value={formData.subjectTitle}
                onChange={(e) => setFormData({ ...formData, subjectTitle: e.target.value })} className={`${inputClass} font-semibold`} />
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Olay / Şikayet Detayları</label>
              <textarea rows={4} value={formData.incidentDetails}
                onChange={(e) => setFormData({ ...formData, incidentDetails: e.target.value })} className={`${inputClass} leading-relaxed`} />
            </div>
            <div>
              <label className="text-neutral-600 text-[11px] block mb-1 font-semibold">Talep ve Netice</label>
              <textarea rows={3} value={formData.demandRequest}
                onChange={(e) => setFormData({ ...formData, demandRequest: e.target.value })} className={`${inputClass} leading-relaxed`} />
            </div>
          </div>
        )}

        {/* STEP 3 — Preview + actions */}
        {step === 3 && (
          <div className="space-y-3">
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleDownloadPDF}
                className="bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition">
                <Download className="w-4 h-4" /> PDF İndir (A4)
              </button>
              <button onClick={handleCopyText}
                className="bg-white hover:bg-neutral-100 text-[#121212] font-semibold py-2 px-3 rounded-xl border border-neutral-300 flex items-center gap-1.5 text-xs transition">
                {copied ? <Check className="w-4 h-4 text-[#047857]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
              </button>
              <button onClick={handlePrint}
                className="hidden sm:flex bg-white hover:bg-neutral-100 text-[#121212] py-2 px-3 rounded-xl border border-neutral-300 items-center gap-1.5 text-xs">
                <Printer className="w-4 h-4" /> Yazdır
              </button>
              <button onClick={() => setShowCimerModal(true)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition ml-auto">
                <Send className="w-4 h-4" /> CİMER'e Gönder
              </button>
            </div>

            {/* A4 preview */}
            <div className="bg-[#E9ECEF] p-3 sm:p-4 rounded-xl border border-neutral-300 flex justify-center overflow-x-auto">
              <div id="printable-petition"
                className="w-full max-w-[650px] min-h-[750px] bg-white text-[#121212] p-8 sm:p-12 shadow-sm relative select-text rounded-xl border border-neutral-300"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                <div className="text-center font-bold text-sm tracking-wider uppercase mb-6 leading-relaxed">
                  <div>T.C.</div>
                  <div className="text-base text-black font-black">{formData.targetAuthorityName}</div>
                  <div className="text-xs text-neutral-600 font-sans tracking-normal">{formData.targetDepartment}</div>
                </div>
                <div className="flex justify-between items-start text-xs font-sans mb-5 pb-2 border-b border-neutral-200">
                  <div><span className="font-semibold text-neutral-500">EVRAK / REF NO:</span> <span className="text-black font-bold">{formData.referenceNo}</span></div>
                  <div><span className="font-semibold text-neutral-500">TARİH:</span> <span className="font-bold">{formData.dateStr}</span></div>
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase mb-5 leading-normal">
                  <span className="underline">KONU:</span> {formData.subjectTitle}
                </div>
                <div className="text-xs mb-4 bg-neutral-50 p-2.5 rounded-xl border border-neutral-300 font-sans">
                  <span className="font-bold text-neutral-800">İLGİLİ CADDE / GÜZERGAH: </span>
                  <span className="text-neutral-700">
                    {formData.selectedStreets.length > 0
                      ? formData.selectedStreets.map((s) => `${s.name} (${s.district}, ${s.city})`).join('; ')
                      : `${formData.district}, ${formData.city}`}
                  </span>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed space-y-3.5 text-justify">
                  <p><strong>1.</strong> Yukarıda açık adresi ve güzergahı belirtilen mevkide ikamet eden / bahse konu güzergahı düzenli olarak kullanan bir Türkiye Cumhuriyeti yurttaşı olarak; söz konusu yol ve çevre altyapısı üzerinde <em>{formData.incidentDetails}</em></p>
                  <p><strong>2.</strong> Söz konusu durum araç trafiği, kamu düzeni ve özellikle yaya/engelli yurttaşlarımızın can ve mal güvenliği açısından ivedilikle giderilmesi gereken ciddi bir risk teşkil etmektedir.</p>
                  <p><strong>3.</strong> İlgili yasal mevzuat hükümleri çerçevesinde (5216 ve 5393 Sayılı Belediye Kanunları ile Karayolları mevzuatı uyarınca) anılan güzergahın bakım, onarım, asfalt kaplama ve trafik güvenliğini tesis etme yükümlülüğü kurumunuzun asli görev sahasındadır.</p>
                  <p className="font-semibold pt-2"><strong>TALEP VE NETİCE:</strong> {formData.demandRequest}</p>
                </div>
                <div className="mt-10 flex justify-end font-sans">
                  <div className="text-xs w-64 space-y-1">
                    <div className="font-black text-sm text-black">{formData.applicantName || '—'}</div>
                    <div className="text-neutral-600">T.C. Kimlik: {formData.applicantTckn}</div>
                    <div className="text-neutral-600">Telefon: {formData.applicantPhone}</div>
                    <div className="text-neutral-600">E-Posta: {formData.applicantEmail}</div>
                    <div className="text-neutral-600">Adres: {formData.applicantAddress}</div>
                    <div className="pt-6 italic text-neutral-400">İmza: ____________________</div>
                  </div>
                </div>
              </div>
            </div>

            <a href="https://acikkapi.gov.tr" target="_blank" rel="noreferrer"
              className="text-[11px] text-[#1D4ED8] hover:underline flex items-center gap-1 justify-center">
              Alternatif: e-Devlet Açık Kapı üzerinden gönder <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Wizard navigation */}
      <div className="flex items-center justify-between mt-4 gap-2">
        {step > 1 ? (
          <button onClick={() => setStep((step - 1) as 1 | 2 | 3)}
            className="bg-white hover:bg-neutral-100 text-[#121212] font-semibold py-2 px-4 rounded-xl border border-neutral-300 flex items-center gap-1.5 text-xs transition">
            <ArrowLeft className="w-4 h-4" /> Geri
          </button>
        ) : <span />}

        {step < 3 && (
          <button
            disabled={step === 1 && !step1Valid}
            onClick={() => setStep((step + 1) as 1 | 2 | 3)}
            className="bg-[#121212] hover:bg-neutral-800 text-white font-bold py-2 px-5 rounded-xl flex items-center gap-1.5 text-xs transition disabled:opacity-40 disabled:cursor-not-allowed">
            {step === 1 ? 'Devam Et' : 'Önizle'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CİMER Integration Bridge Modal */}
      {showCimerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs sk-fade-in z-50 flex items-center justify-center p-4">
          <div className="bg-white sk-pop-in rounded-2xl border border-neutral-300 max-w-lg w-full p-5 shadow-2xl text-[#121212] text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-700 rounded-lg flex items-center justify-center font-bold text-white">C</div>
                <h3 className="font-black text-sm text-[#121212]">CİMER Başvuru Entegrasyonu</h3>
              </div>
              <button onClick={() => setShowCimerModal(false)} className="text-neutral-400 hover:text-black text-base font-bold">✕</button>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              CİMER üzerinden doğrudan işlem başlatabilmeniz için hazır dilekçe metni panonuza kopyalanacak.
            </p>
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-300 space-y-2">
              <div className="font-bold text-[#121212] flex items-center gap-1.5"><Check className="w-4 h-4 text-[#047857]" /> 3 Adımda Gönderim:</div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-600 text-[11px] leading-relaxed">
                <li>Butona tıklayarak resmi CİMER ekranını açın.</li>
                <li>e-Devlet ile giriş yapın, <strong>"Şikayet / İstek"</strong> seçin.</li>
                <li>Metin kutusuna <strong>(Ctrl+V)</strong> yapıştırıp gönderin.</li>
              </ol>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowCimerModal(false)}
                className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold rounded-xl border border-neutral-300">Kapat</button>
              <a href="https://www.cimer.gov.tr" target="_blank" rel="noreferrer"
                onClick={() => { handleCopyText(); setShowCimerModal(false); }}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs">
                CİMER'e Git <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
