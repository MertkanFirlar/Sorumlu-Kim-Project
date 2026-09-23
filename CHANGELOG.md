# Değişiklik Günlüğü (Changelog)

Sorumlu Kim? projesinde **gün gün** ne yaptığımızın kaydı. En yeni en üstte.

---

## 24.09.2026

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
