import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  Building2,
  FileText,
  MapPin
} from 'lucide-react';
import { AuthorityType, Complaint, StreetSegment } from '../types';
import { AUTHORITIES_META, CATEGORY_DETAILS } from '../data/mockData';

interface StatisticsDashboardProps {
  streets: StreetSegment[];
  complaints: Complaint[];
  onSelectStreetAndOpenMap: (streetId: string) => void;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  streets,
  complaints,
  onSelectStreetAndOpenMap,
}) => {
  // Aggregate Metrics
  const totalStreets = streets.length;
  const totalLengthKm = Math.round(streets.reduce((acc, s) => acc + s.lengthMeters, 0) / 1000);
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'cozuldu').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'beklemede').length;
  const resolutionRate = Math.round((resolvedComplaints / (totalComplaints || 1)) * 100);

  // Authority stats
  const authorityStats: Record<
    AuthorityType,
    {
      count: number;
      lengthKm: number;
      complaintCount: number;
      resolvedCount: number;
      avgResolutionDays: number;
    }
  > = {
    BUYUKSEHIR: {
      count: streets.filter((s) => s.authorityType === 'BUYUKSEHIR').length,
      lengthKm: Math.round(
        streets.filter((s) => s.authorityType === 'BUYUKSEHIR').reduce((a, b) => a + b.lengthMeters, 0) / 1000
      ),
      complaintCount: complaints.filter((c) => c.authorityType === 'BUYUKSEHIR').length,
      resolvedCount: complaints.filter((c) => c.authorityType === 'BUYUKSEHIR' && c.status === 'cozuldu').length,
      avgResolutionDays: 4.2,
    },
    ILCE: {
      count: streets.filter((s) => s.authorityType === 'ILCE').length,
      lengthKm: Math.round(
        streets.filter((s) => s.authorityType === 'ILCE').reduce((a, b) => a + b.lengthMeters, 0) / 1000
      ),
      complaintCount: complaints.filter((c) => c.authorityType === 'ILCE').length,
      resolvedCount: complaints.filter((c) => c.authorityType === 'ILCE' && c.status === 'cozuldu').length,
      avgResolutionDays: 2.8,
    },
    KGM: {
      count: streets.filter((s) => s.authorityType === 'KGM').length,
      lengthKm: Math.round(
        streets.filter((s) => s.authorityType === 'KGM').reduce((a, b) => a + b.lengthMeters, 0) / 1000
      ),
      complaintCount: complaints.filter((c) => c.authorityType === 'KGM').length,
      resolvedCount: complaints.filter((c) => c.authorityType === 'KGM' && c.status === 'cozuldu').length,
      avgResolutionDays: 7.5,
    },
    IL_OZEL: {
      count: streets.filter((s) => s.authorityType === 'IL_OZEL').length,
      lengthKm: Math.round(
        streets.filter((s) => s.authorityType === 'IL_OZEL').reduce((a, b) => a + b.lengthMeters, 0) / 1000
      ),
      complaintCount: complaints.filter((c) => c.authorityType === 'IL_OZEL').length,
      resolvedCount: complaints.filter((c) => c.authorityType === 'IL_OZEL' && c.status === 'cozuldu').length,
      avgResolutionDays: 9.1,
    },
  };

  // Top districts
  const districtCounts: Record<string, number> = {};
  streets.forEach((s) => {
    districtCounts[s.district] = (districtCounts[s.district] || 0) + 1;
  });

  const sortedDistricts: [string, number][] = Object.entries(districtCounts).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-300 p-4 mb-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[#121212]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-[#1D4ED8] text-[10px] font-mono font-bold px-2 py-0.5 border border-blue-200 uppercase">
              ULUSAL VERİ ANALİTİĞİ VE PERFORMANS RAPORU
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#121212] tracking-tight uppercase mt-1">
            Yol Rejimi & Kurum Çözüm Performans İstatistikleri
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Büyükşehir, İlçe, Karayolları ve İl Özel İdarelerinin yol ağı payları, şikayet çözme hızları ve bölge yoğunlukları.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 font-mono">
        <div className="bg-white border border-neutral-300 p-3.5 shadow-xs">
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">KAYITLI YOL AĞI</div>
          <div className="text-xl sm:text-2xl font-black text-[#121212] mt-1">{totalLengthKm} km</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">{totalStreets} Segment / Arter</div>
        </div>

        <div className="bg-white border border-neutral-300 p-3.5 shadow-xs">
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">TOPLAM BİLDİRİM</div>
          <div className="text-xl sm:text-2xl font-black text-[#1D4ED8] mt-1">{totalComplaints} Şikayet</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">{pendingComplaints} İşlemde / Beklemede</div>
        </div>

        <div className="bg-white border border-neutral-300 p-3.5 shadow-xs">
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">ÇÖZÜM ORANI</div>
          <div className="text-xl sm:text-2xl font-black text-[#047857] mt-1">%{resolutionRate}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">{resolvedComplaints} Çözüme Ulaşan</div>
        </div>

        <div className="bg-white border border-neutral-300 p-3.5 shadow-xs">
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">AKTİF ŞANTİYE / KAZI</div>
          <div className="text-xl sm:text-2xl font-black text-[#C2410C] mt-1">
            {streets.filter((s) => s.status === 'construction').length} Nokta
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">AYKOME Ruhsatlı Çalışma</div>
        </div>
      </div>

      {/* Main Grid: Authority Performance Comparison & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Authority Performance Table & Scorecard */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-neutral-300 p-4 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] border-b border-neutral-200 pb-2 mb-3 flex items-center justify-between">
              <span>KURUM BAZINDA YOL YETKİSİ VE ÇÖZÜM HIZI PERFORMANSI</span>
              <span className="text-[11px] text-neutral-500 font-normal">Son 90 Gün</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 text-[10px] text-neutral-500 uppercase">
                    <th className="py-2 px-3">İdare / Kurum</th>
                    <th className="py-2 px-3">Yol Ağı (km)</th>
                    <th className="py-2 px-3">Şikayet</th>
                    <th className="py-2 px-3">Ortalama Çözüm</th>
                    <th className="py-2 px-3">Başarı Oranı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {(['BUYUKSEHIR', 'ILCE', 'KGM', 'IL_OZEL'] as AuthorityType[]).map((authKey) => {
                    const meta = AUTHORITIES_META[authKey];
                    const stat = authorityStats[authKey];
                    const rate = Math.round((stat.resolvedCount / (stat.complaintCount || 1)) * 100);

                    return (
                      <tr key={authKey} className="hover:bg-neutral-50 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: meta.color }}
                            ></span>
                            <span className="font-bold text-[#121212] text-xs">{meta.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-700">{stat.lengthKm} km</td>
                        <td className="py-3 px-3 text-neutral-700">{stat.complaintCount}</td>
                        <td className="py-3 px-3 text-neutral-900 font-bold">{stat.avgResolutionDays} Gün</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-neutral-200 h-1.5 overflow-hidden">
                              <div
                                className="h-full"
                                style={{ width: `${rate}%`, backgroundColor: meta.color }}
                              ></div>
                            </div>
                            <span className="font-bold text-[#121212] text-[11px]">%{rate}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Reported Districts Table */}
          <div className="bg-white border border-neutral-300 p-4 shadow-xs text-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] border-b border-neutral-200 pb-2 mb-3">
              EN ÇOK SORUMLULUK TALEBİ ALAN İLÇELER
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {sortedDistricts.slice(0, 6).map(([distName, count]) => (
                <div key={distName} className="bg-[#F8F9FA] p-2.5 border border-neutral-300">
                  <div className="font-bold text-[#121212] text-xs truncate">{distName}</div>
                  <div className="text-neutral-500 text-[10px] font-mono mt-0.5">
                    {count} Tescilli Yol Arter
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Category Share & Legal Insights */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          {/* Categories Chart */}
          <div className="bg-white border border-neutral-300 p-4 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] border-b border-neutral-200 pb-2">
              KATEGORİ DAĞILIMI
            </div>

            <div className="space-y-2.5">
              {(Object.keys(CATEGORY_DETAILS) as Array<keyof typeof CATEGORY_DETAILS>).map((catKey) => {
                const cat = CATEGORY_DETAILS[catKey];
                const count = complaints.filter((c) => c.category === catKey).length;
                const pct = Math.round((count / (complaints.length || 1)) * 100);

                return (
                  <div key={catKey} className="space-y-1 font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-700 font-medium">{cat.label}</span>
                      <span className="text-[#121212] font-bold">%{pct} ({count})</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal Reference Memo */}
          <div className="bg-[#F8F9FA] border border-neutral-300 p-4 shadow-xs space-y-2 text-neutral-700 text-[11px] leading-relaxed">
            <div className="font-bold text-[#121212] flex items-center gap-1.5 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
              <span>YOL REJİMİ YASAL ÇERÇEVESİ</span>
            </div>
            <p>
              • <strong>5216 Sayılı Kanun (Md. 7/g):</strong> Meydan, bulvar, cadde ve ana yolları yapmak, yaptırmak, bakım ve onarımını sağlamak Büyükşehir Belediyelerinin yetkisindedir.
            </p>
            <p>
              • <strong>5393 Sayılı Kanun (Md. 14):</strong> Mahalle içi sokaklar, merdivenli yollar ve tali yaya bağlantıları İlçe Belediyeleri görevindedir.
            </p>
            <p>
              • <strong>6001 Sayılı Kanun:</strong> Otoyol (O-1, O-2, O-20 vb.) ve Devlet Karayolları (D-100 vb.) Karayolları Genel Müdürlüğü (KGM) mülkiyetindedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
