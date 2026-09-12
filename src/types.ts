export type AuthorityType = 'BUYUKSEHIR' | 'ILCE' | 'KGM' | 'IL_OZEL';

export type RoadType = 'bulvar' | 'cadde' | 'sokak' | 'otoyol' | 'devlet_yolu' | 'koy_yolu';

export type RoadStatus = 'normal' | 'construction' | 'maintenance' | 'event';

export type ComplaintCategory =
  | 'asfalt_cukur'
  | 'aydinlatma'
  | 'kaldirim_yaya'
  | 'altyapi_kazi'
  | 'tabela_sinyalizasyon'
  | 'diger';

export type ComplaintStatus = 'beklemede' | 'iletildi' | 'cozuldu' | 'reddedildi';

export type UtilityWorkCategory = 
  | 'su_kanalizasyon' // İSKİ, ASKİ, İZSU vb.
  | 'yol_asfalt'       // İBB Yol Bakım, Fen İşleri, KGM
  | 'elektrik_kablo'   // BEDAŞ, AYEDAŞ, Başkent EDAŞ, GDZ
  | 'dogalgaz'         // İGDAŞ, Başkentgaz, İzmir Doğalgaz
  | 'telekom_fiber'    // Türk Telekom, Turkcell Superonline
  | 'yagmur_drenaj'    // Yağmur Suyu & Menfez
  | 'rayli_sistem';    // Raylı Sistem & Metro Geçişi

export type WorkSeverity = 'kritik' | 'orta' | 'dusuk' | 'planlanan' | 'tamamlaniyor';

export type WorkShiftType = 'gece' | 'gunduz' | 'kesintisiz_24_7' | 'haftasonu';

export type TurkeyRegion = 
  | 'Marmara'
  | 'İç Anadolu'
  | 'Ege'
  | 'Akdeniz'
  | 'Karadeniz'
  | 'Güneydoğu Anadolu'
  | 'Doğu Anadolu';

export interface ProvinceMeta {
  code: string;
  name: string;
  isMetropolitan: boolean;
  region: TurkeyRegion;
  center: [number, number];
  zoom: number;
  majorDistricts: string[];
}

export interface PublicUtilityWork {
  id: string;
  streetId: string;
  streetName: string;
  district: string;
  neighborhood: string;
  city: string;
  title: string;
  workCategory: UtilityWorkCategory;
  severity: WorkSeverity; // 'kritik' | 'orta' | 'dusuk' | 'planlanan' | 'tamamlaniyor'
  responsibleAgency: string; // e.g. "İSKİ Genel Müdürlüğü (Su Kanalizasyon)"
  authorityType: AuthorityType;
  permitNumber: string; // e.g. "AYKOME-2026/0921"
  contractor: string;
  description: string;
  trafficImpact: string; // e.g. "Sağ 2 şerit kapalı, trafik tek şeritten akıyor"
  standardWorkingHours: {
    shiftType: WorkShiftType;
    scheduleText: string; // e.g. "23:00 - 05:30 (Gece Mesaisi)"
    activeNow: boolean;
    hoursDetail: string; // e.g. "Trafiğin az olduğu gece saatlerinde çalışma yapılmaktadır"
  };
  coordinates: [number, number]; // [lat, lng]
  affectedSegmentCoordinates?: [number, number][];
  startDate: string;
  endDate: string;
  progressPercentage: number; // 0 - 100
  lastSyncTime: string; // e.g. "22.08.2026 02:15 (AYKOME Canlı API)"
  officialContactPhone: string; // e.g. "Alo 185 (İSKİ Arıza)"
  dataSource: string; // e.g. "İBB AYKOME & İSKİ SCADA Entegrasyonu"
  safetyMeasures: string[];
  citizenReportsCount: number;
}

export interface AuthorityMeta {
  type: AuthorityType;
  name: string;
  shortName: string;
  fullNamePrefix: string; // e.g. "T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI"
  departmentName: string; // e.g. "Yol Bakım ve Altyapı Koordinasyon Dairesi Başkanlığı"
  color: string;
  badgeBg: string;
  badgeText: string;
  borderHex: string;
  legalBasis: string;
  contactPhone: string;
  email: string;
  cimerUnitName: string;
  openDoorUrl: string;
  description: string;
}

export interface StreetSegment {
  id: string;
  name: string;
  roadType: RoadType;
  city: string;
  district: string;
  neighborhood: string;
  authorityType: AuthorityType;
  authorityCustomName?: string;
  coordinates: [number, number][]; // [lat, lng] points for Leaflet polyline
  center: [number, number]; // [lat, lng] for quick panning
  lengthMeters: number;
  laneCount: number;
  speedLimit: number;
  status: RoadStatus;
  statusDetail?: string;
  statusEndDate?: string;
  contractorInfo?: string;
  ukomeDecisionNo?: string;
  lastAsphaltDate?: string;
  chronicScore: number; // 0 to 100
  verifiedByCommunity: boolean;
  communityVotes: {
    correct: number;
    incorrect: number;
  };
  complaintsCount: number;
}

export interface Complaint {
  id: string;
  streetId: string;
  streetName: string;
  city: string;
  district: string;
  neighborhood?: string;
  authorityType: AuthorityType;
  category: ComplaintCategory;
  title: string;
  description: string;
  author: string;
  date: string;
  coordinates?: [number, number];
  status: ComplaintStatus;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down';
  officialResponse?: {
    responder: string;
    date: string;
    text: string;
  };
  images?: string[];
}

export interface AuthorityCorrectionProposal {
  id: string;
  streetId: string;
  streetName: string;
  currentAuthority: AuthorityType;
  proposedAuthority: AuthorityType;
  officialDocUrl?: string;
  reason: string;
  submittedBy: string;
  submittedAt: string;
  votesFor: number;
  votesAgainst: number;
  status: 'inceleniyor' | 'onaylandi' | 'reddedildi';
}

export interface PetitionFormData {
  applicantName: string;
  applicantTckn: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  targetAuthorityName: string;
  targetDepartment: string;
  selectedStreets: StreetSegment[];
  city: string;
  district: string;
  subjectCategory: ComplaintCategory;
  subjectTitle: string;
  incidentDetails: string;
  demandRequest: string;
  dateStr: string;
  referenceNo: string;
}

export type ViewTab = 'harita' | 'sikayetler' | 'isi_haritasi' | 'dilekce' | 'istatistikler' | 'kamu_calismalari';
