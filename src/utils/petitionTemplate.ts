import { jsPDF } from 'jspdf';
import { AUTHORITIES_META } from '../data/mockData';
import { PetitionFormData, StreetSegment } from '../types';

export function generatePetitionText(data: PetitionFormData): string {
  const streetsStr =
    data.selectedStreets.length > 0
      ? data.selectedStreets.map((s) => `${s.name} (${s.district}, ${s.city})`).join('\n   - ')
      : `${data.district}, ${data.city}`;

  const primaryAuthority =
    data.selectedStreets.length > 0
      ? AUTHORITIES_META[data.selectedStreets[0].authorityType]
      : AUTHORITIES_META.BUYUKSEHIR;

  const authorityHeader = data.targetAuthorityName
    ? data.targetAuthorityName.toUpperCase()
    : `${data.city.toUpperCase()} ${primaryAuthority.fullNamePrefix}`;

  const departmentHeader = data.targetDepartment
    ? data.targetDepartment
    : primaryAuthority.departmentName;

  const legalRef = primaryAuthority.legalBasis;

  return `T.C.
${authorityHeader}
${departmentHeader}

TARİH: ${data.dateStr || new Date().toLocaleDateString('tr-TR')}
EVRAK / REFERANS NO: ${data.referenceNo || 'SK-' + Math.floor(100000 + Math.random() * 900000)}

KONU: ${data.subjectTitle || 'Yol Bakım, Asfalt ve Altyapı Sorununun Giderilmesi Talebi'}

İLGİLİ ADRES / GÜZERGAH:
   - ${streetsStr}

AÇIKLAMALAR VE TESPİTLER:
1. Yukarıda belirtilen güzergahta ikamet eden / bu yolu düzenli kullanan bir yurttaş olarak; söz konusu yol ve cadde üzerinde ${data.incidentDetails || 'ciddi fiziki bozulmalar ve güvenlik riskleri tespit edilmiştir.'}

2. Söz konusu durum, araç trafiği ve yaya güvenliği açısından tehlike arz etmekte olup can ve mal emniyetini olumsuz etkilemektedir.

3. İlgili mevzuat uyarınca (${legalRef}) bahse konu güzergahın bakım, onarım, asfalt kaplama, aydınlatma ve trafik güvenliğini sağlama yükümlülüğü kurumunuzun görev ve yetki alanında bulunmaktadır.

TALEP VE SONUÇ:
Yukarıda arz ve izah edilen nedenlerle;
Söz konusu yol ve cadde üzerindeki bahse konu aksaklıkların kurumunuz fen işleri ve yol bakım ekiplerince ivedilikle yerinde incelenerek gerekli onarım ve iyileştirme çalışmalarının yapılmasını; 4982 Sayılı Bilgi Edinme Hakkı Kanunu ve 3071 Sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun gereğince tarafıma yazılı olarak bilgi verilmesini saygılarımla arz ve talep ederim.


BAŞVURU SAHİBİ:
Adı Soyadı : ${data.applicantName || 'İsimsiz Yurttaş'}
T.C. Kimlik: ${data.applicantTckn ? data.applicantTckn : '***********'}
Telefon    : ${data.applicantPhone || '05XX XXX XX XX'}
E-Posta    : ${data.applicantEmail || 'ornek@eposta.com'}
İkametgâh  : ${data.applicantAddress || `${data.district} / ${data.city}`}

İmza: ___________________________
`;
}

export function downloadPetitionPDF(data: PetitionFormData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const text = generatePetitionText(data);

  // Clean layout styling
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);

  // Top header rule
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(20, 15, 190, 15);

  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, 25);

  const fileName = `Dilekce_${(data.applicantName || 'Basvuru').replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
}
