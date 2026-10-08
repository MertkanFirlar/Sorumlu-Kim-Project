# Değişiklik Günlüğü (Changelog)

Sorumlu Kim? projesinde **gün gün** ne yaptığımızın kaydı. En yeni en üstte.

---

## 08.10.2026

- 🛰️ **"Map data yok" hatası düzeltildi**: çok yakınlaşınca harita zemini (ArcGIS) kayboluyordu; artık en yakın kare büyütülerek gösteriliyor, boş gri tile gelmiyor
- 📍 **Konum tam oturuyor**: GPS / arama ile bir yere uçarken ilk tıklamada hedefi biraz kaçırıp ikinci tıkta düzeliyordu; artık ilk seferde tam konuma gidiyor (uçmadan önce harita boyutu tazeleniyor)

## 07.10.2026

- 🧹 **Harita ilk açılışta tertemiz**: sorumluluk çizgileri artık açılışta görünmüyor; kullanıcı bir **kuruma / şehre / yola** dokununca (ya da çalışma / ısı haritası modunu açınca) ilgili çizgiler beliriyor. Boş haritada yönlendiren ince bir ipucu balonu eklendi
- 📳 **Dokunsal geri bildirim (haptik) eklendi**: telefonda sekme değiştirince, haritada yol seçince hafif titreşim; dilekçe indir/kopyala, şikayet ekleme ve kurum düzeltmesinde "başarı" titreşimi (konfeti ile birlikte). Android Chrome destekler, iOS/masaüstü sessizce yok sayar
- ♿ **Erişilebilirlik**: sistemde "hareketi azalt" açık olan kullanıcılarda tüm animasyon/geçiş/press efektleri ve haptik otomatik kapanıyor

## 30.09.2026

- 🗺️ **Uzak (ülke geneli) zoom görünümü temizlendi**: yol çizgileri artık zoom'a göre inceliyor (uzakta şişik turuncu lekeler yok); çalışma etiketleri (ELEKTRİK/SU-KANAL) ve ⚠️ inşaat işaretleri yalnızca yakınlaşınca (zoom ≥ 10) görünüyor

## 28.09.2026

- ❓ **"Nasıl Çalışır?" rehberi eklendi**: navbar'daki buton + karşılama ekranındaki linkten açılıyor; 3 adım (Yolu bul → Kim sorumlu öğren → Dilekçe oluştur) + örnek senaryo + "tahmini bilgi" dürüstlük notu

## 24.09.2026

- 🔒 **Gizlilik & KVKK Aydınlatma Metni eklendi** (footer'dan açılan modal): "sunucumuz yok, veri toplamıyoruz, dilekçe bilgileri sadece cihazınızda" — kullanılan üçüncü taraf servisler (OSM/Esri/Google Fonts) ve localStorage dürüstçe açıklandı; footer'daki uydurma "AYKOME/SCADA" ibaresi kaldırıldı
- 📝 **Dilekçe akışı adım-adım sihirbaza çevrildi**: 1) Bilgileriniz → 2) Şikayet → 3) Önizle & İndir; adım göstergeli, alanlar netleştirildi, örnek/sahte veri kaldırıldı (placeholder + doğrulama)
- 🔗 **Paylaş / kopyala eklendi**: yol panelinden "kim sorumlu" bilgisini tek tuşla paylaş (mobilde native paylaşım, masaüstünde panoya kopyalar)
- Cadde/sokak araması iyileştirildi: aramada **yollar öne çıkarılıyor** (cadde/sokak yazınca alakasız mahalleler değil yollar önce)
- Sonuçlar daha net: **cadde adı + mahalle, ilçe, il** ayrı satırda; yol olanlar "YOL" etiketiyle işaretli
- Bir yol seçilince artık **gerçek yol geometrisi** OpenStreetMap'ten çekiliyor (sahte parça yerine), sorumlu kurum daha doğru sınıflandırılıyor
- Arama başarısız olursa konuma göre yedek çözüm devrede

## 21.09.2026

- Harita tam sayfa yapıldı (footer üstündeki boş gri alan kaldırıldı)
- Üst menü taşma sorunu çözüldü: sekmeler ve filtreler yana kaymak yerine alt satıra sarıyor; uzun sekme isimleri kısaltıldı
- Kurum filtre çipleri eşitlendi (hepsi tek satır, aynı boyda düzgün pill)
- 81 il seçici yenilendi: aramalı, kompakt özel açılır liste (artık ekranı doldurmuyor)
- 🌙 Gece / Gündüz modu eklendi (tercih tarayıcıda hatırlanıyor); koyu modda harita da koyu tabana geçiyor
- Üst bar tam genişliğe alındı (sağ-sol kenar boşlukları kaldırıldı)
- 🔍 Gerçek adres araması eklendi: tüm Türkiye'de cadde / mahalle / il bulunuyor (Nominatim); seçince harita oraya uçup yolu seçiyor
- 👋 İlk açılış karşılama ekranı: "Konumumu Kullan" (GPS) veya adres yaz seçenekleri

## 16.09.2026

- Harita "API KEY REQUIRED" hatası düzeltildi (anahtarsız Esri/OSM harita tabanına geçildi)
- Modern-sakin tasarım geçişi: yuvarlak köşeler, yumuşak açılış animasyonları, temiz sans-serif font, ince çizgiler, katmanlı gölgeler
- Bölgesel istatistik raporu (seçilen ile göre süzülüyor, başlık dinamik)
- GitHub Pages otomatik yayın hattı kuruldu (GitHub Actions + Vite base ayarı)

## 12.09.2026

- Proje temeli kuruldu (harita, sekmeler, dilekçe yapısı, mock veri)
- Kurum sorumluluk rozetleri (Büyükşehir / İlçe / KGM / İl Özel)

---

**Canlı önizleme:** https://mertkanfirlar.github.io/Sorumlu-Kim-Project/
