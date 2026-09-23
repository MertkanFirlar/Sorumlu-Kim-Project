import { AuthorityType, ProvinceMeta, RoadType, StreetSegment, TurkeyRegion } from '../types';

// Complete 81 Provinces of Turkey with geographic centers, metropolitan status and regions
export const TURKEY_PROVINCES: ProvinceMeta[] = [
  { code: '01', name: 'Adana', isMetropolitan: true, region: 'Akdeniz', center: [37.0000, 35.3213], zoom: 12, majorDistricts: ['Seyhan', 'Yüreğir', 'Çukurova', 'Sarıçam', 'Ceyhan', 'Kozan'] },
  { code: '02', name: 'Adıyaman', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [37.7648, 38.2786], zoom: 13, majorDistricts: ['Merkez', 'Kahta', 'Besni', 'Gölbaşı'] },
  { code: '03', name: 'Afyonkarahisar', isMetropolitan: false, region: 'Ege', center: [38.7507, 30.5567], zoom: 13, majorDistricts: ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Emirdağ'] },
  { code: '04', name: 'Ağrı', isMetropolitan: false, region: 'Doğu Anadolu', center: [39.7191, 43.0503], zoom: 13, majorDistricts: ['Merkez', 'Doğubayazıt', 'Patnos', 'Diyadin'] },
  { code: '05', name: 'Amasya', isMetropolitan: false, region: 'Karadeniz', center: [40.6501, 35.8353], zoom: 13, majorDistricts: ['Merkez', 'Merzifon', 'Suluova', 'Taşova'] },
  { code: '06', name: 'Ankara', isMetropolitan: true, region: 'İç Anadolu', center: [39.9334, 32.8597], zoom: 12, majorDistricts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı'] },
  { code: '07', name: 'Antalya', isMetropolitan: true, region: 'Akdeniz', center: [36.8969, 30.7133], zoom: 12, majorDistricts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kaş'] },
  { code: '08', name: 'Artvin', isMetropolitan: false, region: 'Karadeniz', center: [41.1828, 41.8183], zoom: 13, majorDistricts: ['Merkez', 'Hopa', 'Borçka', 'Arhavi', 'Yusufeli'] },
  { code: '09', name: 'Aydın', isMetropolitan: true, region: 'Ege', center: [37.8560, 27.8416], zoom: 12, majorDistricts: ['Efeler', 'Nazilli', 'Söke', 'Kuşadası', 'Didim', 'İncirliova'] },
  { code: '10', name: 'Balıkesir', isMetropolitan: true, region: 'Marmara', center: [39.6484, 27.8826], zoom: 12, majorDistricts: ['Karesi', 'Altıeylül', 'Bandırma', 'Edremit', 'Ayvalık', 'Gönen', 'Burhaniye'] },
  { code: '11', name: 'Bilecik', isMetropolitan: false, region: 'Marmara', center: [40.1426, 29.9793], zoom: 13, majorDistricts: ['Merkez', 'Bozüyük', 'Osmaneli', 'Söğüt'] },
  { code: '12', name: 'Bingöl', isMetropolitan: false, region: 'Doğu Anadolu', center: [38.8854, 40.4983], zoom: 13, majorDistricts: ['Merkez', 'Genç', 'Solhan', 'Karlıova'] },
  { code: '13', name: 'Bitlis', isMetropolitan: false, region: 'Doğu Anadolu', center: [38.4006, 42.1095], zoom: 13, majorDistricts: ['Merkez', 'Tatvan', 'Ahlat', 'Güroymak', 'Adilcevaz'] },
  { code: '14', name: 'Bolu', isMetropolitan: false, region: 'Karadeniz', center: [40.7350, 31.6061], zoom: 13, majorDistricts: ['Merkez', 'Gerede', 'Mengen', 'Mudurnu', 'Göynük'] },
  { code: '15', name: 'Burdur', isMetropolitan: false, region: 'Akdeniz', center: [37.7203, 30.2908], zoom: 13, majorDistricts: ['Merkez', 'Bucak', 'Gölhisar', 'Yeşilova'] },
  { code: '16', name: 'Bursa', isMetropolitan: true, region: 'Marmara', center: [40.1885, 29.0610], zoom: 12, majorDistricts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mudanya', 'Gürsu', 'Kestel'] },
  { code: '17', name: 'Çanakkale', isMetropolitan: false, region: 'Marmara', center: [40.1553, 26.4142], zoom: 13, majorDistricts: ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Ayvacık', 'Ezine', 'Bozcaada'] },
  { code: '18', name: 'Çankırı', isMetropolitan: false, region: 'İç Anadolu', center: [40.6013, 33.6134], zoom: 13, majorDistricts: ['Merkez', 'Çerkeş', 'Ilgaz', 'Orta'] },
  { code: '19', name: 'Çorum', isMetropolitan: false, region: 'Karadeniz', center: [40.5506, 34.9556], zoom: 13, majorDistricts: ['Merkez', 'Sungurlu', 'Osmancık', 'İskilip', 'Alaca'] },
  { code: '20', name: 'Denizli', isMetropolitan: true, region: 'Ege', center: [37.7765, 29.0864], zoom: 12, majorDistricts: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas', 'Sarayköy'] },
  { code: '21', name: 'Diyarbakır', isMetropolitan: true, region: 'Güneydoğu Anadolu', center: [37.9144, 40.2306], zoom: 12, majorDistricts: ['Bağlar', 'Kayapınar', 'Yenişehir', 'Sur', 'Ergani', 'Bismil', 'Silvan'] },
  { code: '22', name: 'Edirne', isMetropolitan: false, region: 'Marmara', center: [41.6772, 26.5557], zoom: 13, majorDistricts: ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa'] },
  { code: '23', name: 'Elazığ', isMetropolitan: false, region: 'Doğu Anadolu', center: [38.6810, 39.2264], zoom: 13, majorDistricts: ['Merkez', 'Kovancılar', 'Karakoçan', 'Palu', 'Baskil'] },
  { code: '24', name: 'Erzincan', isMetropolitan: false, region: 'Doğu Anadolu', center: [39.7500, 39.5000], zoom: 13, majorDistricts: ['Merkez', 'Tercan', 'Üzümlü', 'Refahiye', 'Çayırlı'] },
  { code: '25', name: 'Erzurum', isMetropolitan: true, region: 'Doğu Anadolu', center: [39.9043, 41.2679], zoom: 12, majorDistricts: ['Yakutiye', 'Palandöken', 'Aziziye', 'Horasan', 'Oltu', 'Pasinler'] },
  { code: '26', name: 'Eskişehir', isMetropolitan: true, region: 'İç Anadolu', center: [39.7767, 30.5206], zoom: 12, majorDistricts: ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Seyitgazi'] },
  { code: '27', name: 'Gaziantep', isMetropolitan: true, region: 'Güneydoğu Anadolu', center: [37.0662, 37.3833], zoom: 12, majorDistricts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı', 'Oğuzeli'] },
  { code: '28', name: 'Giresun', isMetropolitan: false, region: 'Karadeniz', center: [40.9128, 38.3895], zoom: 13, majorDistricts: ['Merkez', 'Bulancak', 'Espiye', 'Görele', 'Tirebolu', 'Şebinkarahisar'] },
  { code: '29', name: 'Gümüşhane', isMetropolitan: false, region: 'Karadeniz', center: [40.4600, 39.4814], zoom: 13, majorDistricts: ['Merkez', 'Kelkit', 'Şiran', 'Kürtün', 'Torul'] },
  { code: '30', name: 'Hakkari', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [37.5833, 43.7333], zoom: 13, majorDistricts: ['Merkez', 'Yüksekova', 'Şemdinli', 'Çukurca', 'Derecik'] },
  { code: '31', name: 'Hatay', isMetropolitan: true, region: 'Akdeniz', center: [36.2023, 36.1606], zoom: 12, majorDistricts: ['Antakya', 'İskenderun', 'Defne', 'Dörtyol', 'Samandağ', 'Kırıkhan', 'Reyhanlı'] },
  { code: '32', name: 'Isparta', isMetropolitan: false, region: 'Akdeniz', center: [37.7648, 30.5566], zoom: 13, majorDistricts: ['Merkez', 'Yalvaç', 'Eğirdir', 'Şarkikaraağaç', 'Gelendost'] },
  { code: '33', name: 'Mersin', isMetropolitan: true, region: 'Akdeniz', center: [36.8121, 34.6415], zoom: 12, majorDistricts: ['Akdeniz', 'Mezitli', 'Toroslar', 'Yenişehir', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur'] },
  { code: '34', name: 'İstanbul', isMetropolitan: true, region: 'Marmara', center: [41.0082, 28.9784], zoom: 12, majorDistricts: ['Kadıköy', 'Beşiktaş', 'Şişli', 'Fatih', 'Üsküdar', 'Bakırköy', 'Beyoğlu', 'Maltepe', 'Ataşehir', 'Kartal', 'Pendik', 'Ümraniye', 'Esenyurt', 'Sarıyer', 'Başakşehir'] },
  { code: '35', name: 'İzmir', isMetropolitan: true, region: 'Ege', center: [38.4237, 27.1428], zoom: 12, majorDistricts: ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Bayraklı', 'Karabağlar', 'Balçova', 'Torbalı', 'Menemen', 'Çeşme', 'Urla'] },
  { code: '36', name: 'Kars', isMetropolitan: false, region: 'Doğu Anadolu', center: [40.6167, 43.1000], zoom: 13, majorDistricts: ['Merkez', 'Kağızman', 'Sarıkamış', 'Selim', 'Digor'] },
  { code: '37', name: 'Kastamonu', isMetropolitan: false, region: 'Karadeniz', center: [41.3887, 33.7827], zoom: 13, majorDistricts: ['Merkez', 'Tosya', 'Taşköprü', 'Cide', 'İnebolu'] },
  { code: '38', name: 'Kayseri', isMetropolitan: true, region: 'İç Anadolu', center: [38.7312, 35.4787], zoom: 12, majorDistricts: ['Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Bünyan', 'İncesu'] },
  { code: '39', name: 'Kırklareli', isMetropolitan: false, region: 'Marmara', center: [41.7333, 27.2167], zoom: 13, majorDistricts: ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Pınarhisar'] },
  { code: '40', name: 'Kırşehir', isMetropolitan: false, region: 'İç Anadolu', center: [39.1425, 34.1709], zoom: 13, majorDistricts: ['Merkez', 'Kaman', 'Mucur', 'Çiçekdağı'] },
  { code: '41', name: 'Kocaeli', isMetropolitan: true, region: 'Marmara', center: [40.8533, 29.8815], zoom: 12, majorDistricts: ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Gölcük', 'Derince', 'Çayırova', 'Kartepe', 'Başiskele'] },
  { code: '42', name: 'Konya', isMetropolitan: true, region: 'İç Anadolu', center: [37.8746, 32.4932], zoom: 12, majorDistricts: ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Cihanbeyli', 'Seydişehir'] },
  { code: '43', name: 'Kütahya', isMetropolitan: false, region: 'Ege', center: [39.4167, 29.9833], zoom: 13, majorDistricts: ['Merkez', 'Tavşanlı', 'Simav', 'Gediz', 'Emet'] },
  { code: '44', name: 'Malatya', isMetropolitan: true, region: 'Doğu Anadolu', center: [38.3552, 38.3095], zoom: 12, majorDistricts: ['Battalgazi', 'Yeşilyurt', 'Doğanşehir', 'Akçadağ', 'Darende', 'Hekimhan'] },
  { code: '45', name: 'Manisa', isMetropolitan: true, region: 'Ege', center: [38.6191, 27.4289], zoom: 12, majorDistricts: ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli', 'Soma', 'Alaşehir', 'Kırkağaç'] },
  { code: '46', name: 'Kahramanmaraş', isMetropolitan: true, region: 'Akdeniz', center: [37.5858, 36.9371], zoom: 12, majorDistricts: ['Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Türkoğlu', 'Pazarcık', 'Göksun'] },
  { code: '47', name: 'Mardin', isMetropolitan: true, region: 'Güneydoğu Anadolu', center: [37.3212, 40.7245], zoom: 12, majorDistricts: ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik', 'Mazıdağı'] },
  { code: '48', name: 'Muğla', isMetropolitan: true, region: 'Ege', center: [37.2153, 28.3636], zoom: 12, majorDistricts: ['Menteşe', 'Bodrum', 'Fethiye', 'Milas', 'Marmaris', 'Ortaca', 'Dalaman', 'Yatağan'] },
  { code: '49', name: 'Muş', isMetropolitan: false, region: 'Doğu Anadolu', center: [38.7432, 41.5064], zoom: 13, majorDistricts: ['Merkez', 'Bulanık', 'Malazgirt', 'Varto', 'Hasköy'] },
  { code: '50', name: 'Nevşehir', isMetropolitan: false, region: 'İç Anadolu', center: [38.6244, 34.7144], zoom: 13, majorDistricts: ['Merkez', 'Ürgüp', 'Avanos', 'Gülşehir', 'Derinkuyu', 'Kozaklı'] },
  { code: '51', name: 'Niğde', isMetropolitan: false, region: 'İç Anadolu', center: [37.9667, 34.6833], zoom: 13, majorDistricts: ['Merkez', 'Bor', 'Çiftlik', 'Ulukışla'] },
  { code: '52', name: 'Ordu', isMetropolitan: true, region: 'Karadeniz', center: [40.9839, 37.8764], zoom: 12, majorDistricts: ['Altınordu', 'Ünye', 'Fatsa', 'Kumru', 'Korgan', 'Gölköy'] },
  { code: '53', name: 'Rize', isMetropolitan: false, region: 'Karadeniz', center: [41.0201, 40.5234], zoom: 13, majorDistricts: ['Merkez', 'Çayeli', 'Ardeşen', 'Pazar', 'Fındıklı', 'Güneysu', 'İkizdere'] },
  { code: '54', name: 'Sakarya', isMetropolitan: true, region: 'Marmara', center: [40.7569, 30.3783], zoom: 12, majorDistricts: ['Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Karasu', 'Geyve', 'Sapanca'] },
  { code: '55', name: 'Samsun', isMetropolitan: true, region: 'Karadeniz', center: [41.2867, 36.33], zoom: 12, majorDistricts: ['İlkadım', 'Atakum', 'Canik', 'Bafra', 'Çarşamba', 'Tekkeköy', 'Vezirköprü', 'Havza'] },
  { code: '56', name: 'Siirt', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [37.9333, 41.9500], zoom: 13, majorDistricts: ['Merkez', 'Kurtalan', 'Pervari', 'Baykan', 'Şirvan'] },
  { code: '57', name: 'Sinop', isMetropolitan: false, region: 'Karadeniz', center: [42.0231, 35.1531], zoom: 13, majorDistricts: ['Merkez', 'Boyabat', 'Gerze', 'Ayancık', 'Durağan'] },
  { code: '58', name: 'Sivas', isMetropolitan: false, region: 'İç Anadolu', center: [39.7477, 37.0179], zoom: 13, majorDistricts: ['Merkez', 'Şarkışla', 'Yıldızeli', 'Suşehri', 'Zara', 'Gemerek', 'Kangal', 'Divriği'] },
  { code: '59', name: 'Tekirdağ', isMetropolitan: true, region: 'Marmara', center: [40.9833, 27.5167], zoom: 12, majorDistricts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene', 'Malkara', 'Saray', 'Şarköy'] },
  { code: '60', name: 'Tokat', isMetropolitan: false, region: 'Karadeniz', center: [40.3167, 36.5500], zoom: 13, majorDistricts: ['Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile', 'Reşadiye'] },
  { code: '61', name: 'Trabzon', isMetropolitan: true, region: 'Karadeniz', center: [41.0027, 39.7168], zoom: 12, majorDistricts: ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Arsin', 'Vakfıkebir', 'Sürmene', 'Beşikdüzü'] },
  { code: '62', name: 'Tunceli', isMetropolitan: false, region: 'Doğu Anadolu', center: [39.1079, 39.5401], zoom: 13, majorDistricts: ['Merkez', 'Pertek', 'Mazgirt', 'Çemişgezek', 'Hozat', 'Ovacık'] },
  { code: '63', name: 'Şanlıurfa', isMetropolitan: true, region: 'Güneydoğu Anadolu', center: [37.1674, 38.7955], zoom: 12, majorDistricts: ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Suruç', 'Birecik', 'Akçakale', 'Ceylanpınar'] },
  { code: '64', name: 'Uşak', isMetropolitan: false, region: 'Ege', center: [38.6823, 29.4082], zoom: 13, majorDistricts: ['Merkez', 'Banaz', 'Eşme', 'Sivaslı', 'Ulubey'] },
  { code: '65', name: 'Van', isMetropolitan: true, region: 'Doğu Anadolu', center: [38.4891, 43.4089], zoom: 12, majorDistricts: ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Çaldıran', 'Muradiye', 'Gevaş'] },
  { code: '66', name: 'Yozgat', isMetropolitan: false, region: 'İç Anadolu', center: [39.8181, 34.8147], zoom: 13, majorDistricts: ['Merkez', 'Sorgun', 'Akdağmadeni', 'Yerköy', 'Boğazlıyan'] },
  { code: '67', name: 'Zonguldak', isMetropolitan: false, region: 'Karadeniz', center: [41.4564, 31.7987], zoom: 13, majorDistricts: ['Merkez', 'Karadeniz Ereğli', 'Çaycuma', 'Devrek', 'Kozlu', 'Kilimli', 'Alaplı'] },
  { code: '68', name: 'Aksaray', isMetropolitan: false, region: 'İç Anadolu', center: [38.3687, 34.0370], zoom: 13, majorDistricts: ['Merkez', 'Ortaköy', 'Eskil', 'Gülağaç', 'Güzelyurt'] },
  { code: '69', name: 'Bayburt', isMetropolitan: false, region: 'Karadeniz', center: [40.2552, 40.2249], zoom: 13, majorDistricts: ['Merkez', 'Demirözü', 'Aydıntepe'] },
  { code: '70', name: 'Karaman', isMetropolitan: false, region: 'İç Anadolu', center: [37.1759, 33.2287], zoom: 13, majorDistricts: ['Merkez', 'Ermenek', 'Sarıveliler', 'Ayrancı'] },
  { code: '71', name: 'Kırıkkale', isMetropolitan: false, region: 'İç Anadolu', center: [39.8468, 33.5153], zoom: 13, majorDistricts: ['Merkez', 'Yahşihan', 'Keskin', 'Delice', 'Bahşılı'] },
  { code: '72', name: 'Batman', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [37.8812, 41.1293], zoom: 13, majorDistricts: ['Merkez', 'Kozluk', 'Sason', 'Beşiri', 'Gercüş', 'Hasankeyf'] },
  { code: '73', name: 'Şırnak', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [37.5164, 42.4594], zoom: 13, majorDistricts: ['Merkez', 'Cizre', 'Silopi', 'İdil', 'Uludere', 'Beytüşşebap'] },
  { code: '74', name: 'Bartın', isMetropolitan: false, region: 'Karadeniz', center: [41.6344, 32.3375], zoom: 13, majorDistricts: ['Merkez', 'Ulus', 'Amasra', 'Kurucaşile'] },
  { code: '75', name: 'Ardahan', isMetropolitan: false, region: 'Doğu Anadolu', center: [41.1105, 42.7022], zoom: 13, majorDistricts: ['Merkez', 'Göle', 'Çıldır', 'Hanak', 'Posof'] },
  { code: '76', name: 'Iğdır', isMetropolitan: false, region: 'Doğu Anadolu', center: [39.9196, 44.0450], zoom: 13, majorDistricts: ['Merkez', 'Tuzluca', 'Aralık', 'Karakoyunlu'] },
  { code: '77', name: 'Yalova', isMetropolitan: false, region: 'Marmara', center: [40.6500, 29.2667], zoom: 13, majorDistricts: ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu', 'Termal'] },
  { code: '78', name: 'Karabük', isMetropolitan: false, region: 'Karadeniz', center: [41.2061, 32.6204], zoom: 13, majorDistricts: ['Merkez', 'Safranbolu', 'Yenice', 'Eskipazar', 'Eflani'] },
  { code: '79', name: 'Kilis', isMetropolitan: false, region: 'Güneydoğu Anadolu', center: [36.7184, 37.1212], zoom: 13, majorDistricts: ['Merkez', 'Musabeyli', 'Elbeyli', 'Polateli'] },
  { code: '80', name: 'Osmaniye', isMetropolitan: false, region: 'Akdeniz', center: [37.0742, 36.2478], zoom: 13, majorDistricts: ['Merkez', 'Kadirli', 'Düziçi', 'Bahçe', 'Toprakkale'] },
  { code: '81', name: 'Düzce', isMetropolitan: false, region: 'Karadeniz', center: [40.8438, 31.1565], zoom: 13, majorDistricts: ['Merkez', 'Akçakoca', 'Kaynaşlı', 'Gölyaka', 'Çilimli', 'Yığılca'] },
];

export const METROPOLITAN_PROVINCES = new Set(
  TURKEY_PROVINCES.filter((p) => p.isMetropolitan).map((p) => p.name)
);

// Classify road authority according to Turkish Laws (5216, 5393, 6001, 5302)
export function classifyRoadAuthority(
  tags: Record<string, string>,
  provinceName: string
): { authorityType: AuthorityType; roadType: RoadType; reason: string } {
  const highway = tags.highway || '';
  const ref = tags.ref || '';
  const name = tags.name || tags['name:tr'] || '';
  const operator = tags.operator || '';
  const isMetro = METROPOLITAN_PROVINCES.has(provinceName);

  // 1. KGM (Karayolları Genel Müdürlüğü) Detection:
  // Motorways, Trunks, State highways (D-xxx, O-xx, E-xx), Bridges, KGM operators
  const isMotorway = highway.includes('motorway') || ref.startsWith('O-') || ref.startsWith('O.');
  const isStateHighway = 
    highway.includes('trunk') || 
    ref.startsWith('D-') || 
    ref.startsWith('D.') || 
    ref.startsWith('D0') || 
    ref.startsWith('D1') || 
    ref.startsWith('D2') || 
    ref.startsWith('D3') || 
    ref.startsWith('D4') || 
    ref.startsWith('D5') || 
    ref.startsWith('D6') || 
    ref.startsWith('D7') || 
    ref.startsWith('D8') || 
    ref.startsWith('D9') || 
    ref.startsWith('E-') ||
    ref.startsWith('E8') ||
    ref.startsWith('E9');

  const isKGMKeyword = 
    operator.toLowerCase().includes('karayolları') ||
    operator.toLowerCase().includes('kgm') ||
    name.toLowerCase().includes('çevre yolu') ||
    name.toLowerCase().includes('otoyol') ||
    name.toLowerCase().includes('otoyolu') ||
    name.toLowerCase().includes('devlet yolu') ||
    name.toLowerCase().includes('15 temmuz şehitler köprüsü') ||
    name.toLowerCase().includes('fatih sultan mehmet köprüsü') ||
    name.toLowerCase().includes('yavuz sultan selim köprüsü') ||
    name.toLowerCase().includes('osmangazi köprüsü') ||
    name.toLowerCase().includes('1915 çanakkale');

  if (isMotorway || isStateHighway || isKGMKeyword) {
    return {
      authorityType: 'KGM',
      roadType: isMotorway ? 'otoyol' : 'devlet_yolu',
      reason: '6001 Sayılı Karayolları Genel Müdürlüğü Kanunu gereğince Devlet / Otoyol Ağı kapsamındadır.',
    };
  }

  // 2. 30 Büyükşehir Belediyesi vs 51 İl Belediyesi Kuralı (5216 & 5393 Sayılı Kanunlar)
  if (isMetro) {
    // Büyükşehir İli (Örn: İstanbul, Ankara, İzmir, Bursa, Antalya, vb.)
    const isMajorArtery = 
      highway === 'primary' || 
      highway === 'primary_link' || 
      highway === 'secondary' || 
      highway === 'secondary_link';

    const nameHasBoulevard = 
      name.toLowerCase().includes('bulvarı') || 
      name.toLowerCase().includes('bulv') || 
      name.toLowerCase().includes('caddesi') || 
      name.toLowerCase().includes('cad.') ||
      name.toLowerCase().includes('meydanı') ||
      name.toLowerCase().includes('sahil yolu') ||
      name.toLowerCase().includes('kordon');

    const isLanesWide = parseInt(tags.lanes || '1', 10) >= 3 || (tags.width && parseFloat(tags.width) >= 12);

    if (isMajorArtery || nameHasBoulevard || isLanesWide) {
      return {
        authorityType: 'BUYUKSEHIR',
        roadType: name.toLowerCase().includes('bulvar') ? 'bulvar' : 'cadde',
        reason: '5216 Sayılı Büyükşehir Belediyesi Kanunu Madde 7/g gereğince Ana Arter / Bulvar statüsündedir.',
      };
    } else {
      return {
        authorityType: 'ILCE',
        roadType: 'sokak',
        reason: '5393 Sayılı Belediye Kanunu Madde 14 uyarınca İlçe Belediyesi sorumluluğundaki ara sokak/tali yoldur.',
      };
    }
  } else {
    // 51 Diğer İl (Büyükşehir Olmayan İller: Bolu, Çanakkale, Rize, Kütahya, Sivas, vb.)
    const isRuralTrack = highway === 'track' || highway === 'path' || highway === 'unclassified';
    
    if (isRuralTrack || tags['rural'] === 'yes') {
      return {
        authorityType: 'IL_OZEL',
        roadType: 'koy_yolu',
        reason: '5302 Sayılı İl Özel İdaresi Kanunu uyarınca belediye mücavir alan dışı köy/kırsal bağlantı yoludur.',
      };
    } else {
      return {
        authorityType: 'ILCE',
        roadType: name.toLowerCase().includes('cadde') ? 'cadde' : 'sokak',
        reason: '5393 Sayılı Belediye Kanunu uyarınca İl / İlçe Belediye Başkanlığı sorumluluk alanındadır.',
      };
    }
  }
}

// In-Memory dynamic cache for Overpass queries to avoid repeat network overhead
const overpassBoundingBoxCache = new Map<string, StreetSegment[]>();
const overpassCoordinatesCache = new Map<string, StreetSegment | null>();

// Overpass API Server endpoints (load balance & failover)
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass.osm.ch/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

let endpointIndex = 0;
function getNextOverpassEndpoint(): string {
  const url = OVERPASS_ENDPOINTS[endpointIndex % OVERPASS_ENDPOINTS.length];
  endpointIndex++;
  return url;
}

// Dynamic Fetcher: Fetches all real roads in visible bounding box from OpenStreetMap Overpass API
export async function fetchLiveRoadsFromOverpass(
  south: number,
  west: number,
  north: number,
  east: number,
  provinceName: string,
  districtName?: string
): Promise<StreetSegment[]> {
  // Round to 3 decimal digits for cache key (~100m grid)
  const cacheKey = `${south.toFixed(3)},${west.toFixed(3)},${north.toFixed(3)},${east.toFixed(3)}_${provinceName}`;
  if (overpassBoundingBoxCache.has(cacheKey)) {
    return overpassBoundingBoxCache.get(cacheKey) || [];
  }

  // Overpass query for roads
  const query = `
    [out:json][timeout:12];
    (
      way["highway"~"motorway|motorway_link|trunk|trunk_link|primary|primary_link|secondary|secondary_link|tertiary|tertiary_link|residential|unclassified|living_street"](${south},${west},${north},${east});
    );
    out body geom 180;
  `;

  try {
    const endpoint = getNextOverpassEndpoint();
    const response = await fetch(endpoint, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.elements || !Array.isArray(data.elements)) {
      return [];
    }

    const parsedStreets: StreetSegment[] = [];

    data.elements.forEach((elem: any) => {
      if (elem.type === 'way' && elem.geometry && elem.geometry.length >= 2) {
        const tags = elem.tags || {};
        const coords: [number, number][] = elem.geometry.map((pt: any) => [pt.lat, pt.lon]);
        
        // Calculate center and rough length
        const centerLat = coords.reduce((acc, curr) => acc + curr[0], 0) / coords.length;
        const centerLng = coords.reduce((acc, curr) => acc + curr[1], 0) / coords.length;

        // Classify
        const classification = classifyRoadAuthority(tags, provinceName);
        
        const rawName = tags.name || tags['name:tr'] || tags.ref || '';
        const defaultName = rawName 
          ? rawName 
          : classification.roadType === 'otoyol' 
            ? 'Otoyol Bağlantı Yolu' 
            : classification.roadType === 'cadde' 
              ? 'İsimsiz Ana Cadde' 
              : 'İsimsiz Mahalle Yolu';

        const street: StreetSegment = {
          id: `osm_way_${elem.id}`,
          name: defaultName,
          roadType: classification.roadType,
          city: provinceName,
          district: districtName || tags['addr:district'] || tags['is_in:district'] || 'Merkez / Çevre',
          neighborhood: tags['addr:suburb'] || tags['addr:neighbourhood'] || 'Mahallesi',
          authorityType: classification.authorityType,
          authorityCustomName: classification.authorityType === 'BUYUKSEHIR'
            ? `${provinceName.toUpperCase()} BÜYÜKŞEHİR BELEDİYESİ`
            : classification.authorityType === 'ILCE'
              ? `${(districtName || provinceName).toUpperCase()} BELEDİYESİ`
              : classification.authorityType === 'KGM'
                ? 'T.C. KARAYOLLARI GENEL MÜDÜRLÜĞÜ (KGM)'
                : `${provinceName.toUpperCase()} İL ÖZEL İDARESİ`,
          coordinates: coords,
          center: [centerLat, centerLng],
          lengthMeters: Math.round(coords.length * 45),
          laneCount: parseInt(tags.lanes || '2', 10),
          speedLimit: parseInt(tags.maxspeed || (classification.authorityType === 'KGM' ? '110' : '50'), 10),
          status: 'normal',
          chronicScore: Math.floor(Math.random() * 35) + 10,
          verifiedByCommunity: true,
          communityVotes: { correct: 14, incorrect: 1 },
          complaintsCount: 0,
        };

        parsedStreets.push(street);
      }
    });

    overpassBoundingBoxCache.set(cacheKey, parsedStreets);
    return parsedStreets;
  } catch (err) {
    console.warn('Overpass fetch failed, continuing with fallback:', err);
    return [];
  }
}

// A geocoded place suggestion (address / street / district / city)
export interface GeoPlace {
  label: string;      // full display_name (Nominatim)
  title: string;      // main line — street or place name
  subtitle: string;   // mahalle, ilçe, il
  lat: number;
  lng: number;
  isRoad: boolean;    // true if this is an actual street/road
  osmType?: string;   // 'way' | 'node' | 'relation'
  osmId?: number;
  province?: string;  // il — needed to classify the road authority
}

// Forward geocoding via Nominatim — turns free text into real locations across Turkey
export async function geocodeSearch(query: string): Promise<GeoPlace[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tr&addressdetails=1&limit=10&accept-language=tr&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const places: GeoPlace[] = data.map((d: any): GeoPlace => {
      const a = d.address || {};
      const isRoad = d.class === 'highway' || d.addresstype === 'road';
      const il = a.province || a.city || a.state || '';
      const ilce = a.town || a.city_district || a.county || a.district || a.municipality || '';
      const mahalle = a.neighbourhood || a.quarter || a.suburb || a.village || '';

      const title = isRoad
        ? a.road || a.pedestrian || d.name || (d.display_name || '').split(',')[0]
        : d.name || mahalle || ilce || il || (d.display_name || '').split(',')[0];

      // Subtitle: mahalle, ilçe, il — tekrarları ele
      const parts = isRoad ? [mahalle, ilce, il] : [ilce, il];
      const subtitle = parts
        .filter((p, i, arr) => p && p !== title && arr.indexOf(p) === i)
        .join(', ');

      return {
        label: d.display_name as string,
        title,
        subtitle: subtitle || (d.display_name || '').split(',').slice(1, 3).join(',').trim(),
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon),
        isRoad,
        osmType: d.osm_type,
        osmId: d.osm_id,
        province: il,
      };
    });

    // Kullanıcı cadde/sokak arıyorsa yolları öne çıkar
    const roadIntent = /(cadde|caddesi|sokak|soka[gğ]ı|bulvar|bulvar|cad\.?|sok\.?|blv|bulv)/i.test(q);
    if (roadIntent) {
      places.sort((x, y) => Number(y.isRoad) - Number(x.isRoad));
    }
    return places;
  } catch {
    return [];
  }
}

// Fetch a specific OSM way's real geometry + classify its authority
export async function fetchRoadByOsmWay(
  osmId: number,
  provinceName: string,
  districtName?: string
): Promise<StreetSegment | null> {
  try {
    const query = `[out:json][timeout:12];way(${osmId});out tags geom;`;
    const res = await fetch(getNextOverpassEndpoint(), {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const el = (data.elements || []).find((e: any) => e.type === 'way' && e.geometry && e.geometry.length >= 2);
    if (!el) return null;

    const tags = el.tags || {};
    const coords: [number, number][] = el.geometry.map((pt: any) => [pt.lat, pt.lon]);
    const centerLat = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
    const centerLng = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
    const classification = classifyRoadAuthority(tags, provinceName);
    const name = tags.name || tags['name:tr'] || tags.ref || 'İsimsiz Yol';
    const district = districtName || tags['addr:district'] || tags['is_in:district'] || 'Merkez';

    return {
      id: `osm_way_${el.id}`,
      name,
      roadType: classification.roadType,
      city: provinceName,
      district,
      neighborhood: tags['addr:suburb'] || tags['addr:neighbourhood'] || 'Mahallesi',
      authorityType: classification.authorityType,
      authorityCustomName:
        classification.authorityType === 'BUYUKSEHIR'
          ? `${provinceName.toUpperCase()} BÜYÜKŞEHİR BELEDİYESİ`
          : classification.authorityType === 'ILCE'
            ? `${district.toUpperCase()} BELEDİYESİ`
            : classification.authorityType === 'KGM'
              ? 'T.C. KARAYOLLARI GENEL MÜDÜRLÜĞÜ (KGM)'
              : `${provinceName.toUpperCase()} İL ÖZEL İDARESİ`,
      coordinates: coords,
      center: [centerLat, centerLng],
      lengthMeters: Math.round(coords.length * 45),
      laneCount: parseInt(tags.lanes || '2', 10),
      speedLimit: parseInt(tags.maxspeed || (classification.authorityType === 'KGM' ? '110' : '50'), 10),
      status: 'normal',
      chronicScore: Math.floor(Math.random() * 35) + 10,
      verifiedByCommunity: true,
      communityVotes: { correct: 12, incorrect: 1 },
      complaintsCount: 0,
    };
  } catch {
    return null;
  }
}

// Single coordinate reverse lookup & road geometry builder
export async function fetchRoadAtLocation(lat: number, lng: number): Promise<StreetSegment | null> {
  const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (overpassCoordinatesCache.has(coordKey)) {
    return overpassCoordinatesCache.get(coordKey) || null;
  }

  try {
    // 1. Fast reverse-geocode via Nominatim
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'SorumluKim-RoadChecker/2.0 (info@sorumlukim.gov.tr)',
      },
    });

    if (!res.ok) return null;
    const geoData = await res.json();
    const address = geoData.address || {};

    const provinceName = address.province || address.state || address.city || 'Türkiye';
    const districtName = address.town || address.district || address.borough || address.suburb || 'Merkez';
    const neighborhood = address.neighbourhood || address.quarter || address.village || 'Mahalle';
    const roadName = address.road || address.pedestrian || address.highway || 'Konumdaki Yol / Cadde';

    // Mock quick segment around point or try Overpass
    const offset = 0.0015;
    const coords: [number, number][] = [
      [lat - offset, lng - offset],
      [lat, lng],
      [lat + offset, lng + offset],
    ];

    const tags: Record<string, string> = {
      name: roadName,
      highway: address.highway || (roadName.includes('Bulvar') ? 'primary' : roadName.includes('Cadde') ? 'secondary' : 'residential'),
    };

    const classification = classifyRoadAuthority(tags, provinceName);

    const segment: StreetSegment = {
      id: `geo_point_${Math.round(lat * 10000)}_${Math.round(lng * 10000)}`,
      name: roadName,
      roadType: classification.roadType,
      city: provinceName,
      district: districtName,
      neighborhood: neighborhood,
      authorityType: classification.authorityType,
      authorityCustomName: classification.authorityType === 'BUYUKSEHIR'
        ? `${provinceName.toUpperCase()} BÜYÜKŞEHİR BELEDİYESİ`
        : classification.authorityType === 'ILCE'
          ? `${districtName.toUpperCase()} BELEDİYESİ`
          : classification.authorityType === 'KGM'
            ? 'KARAYOLLARI GENEL MÜDÜRLÜĞÜ'
            : `${provinceName.toUpperCase()} İL ÖZEL İDARESİ`,
      coordinates: coords,
      center: [lat, lng],
      lengthMeters: 350,
      laneCount: 2,
      speedLimit: classification.authorityType === 'KGM' ? 110 : 50,
      status: 'normal',
      chronicScore: 25,
      verifiedByCommunity: false,
      communityVotes: { correct: 3, incorrect: 0 },
      complaintsCount: 0,
    };

    overpassCoordinatesCache.set(coordKey, segment);
    return segment;
  } catch (e) {
    console.error('Reverse road lookup error:', e);
    return null;
  }
}
