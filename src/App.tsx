/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MOCK_STREETS, 
  INITIAL_COMPLAINTS, 
  INITIAL_PROPOSALS, 
  AUTHORITIES_META,
  MOCK_UTILITY_WORKS
} from './data/mockData';
import { 
  AuthorityCorrectionProposal, 
  AuthorityType, 
  Complaint, 
  StreetSegment, 
  ViewTab,
  PublicUtilityWork
} from './types';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { StreetDetailPanel } from './components/StreetDetailPanel';
import { ComplaintList } from './components/ComplaintList';
import { HeatmapView } from './components/HeatmapView';
import { PetitionGenerator } from './components/PetitionGenerator';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { CorrectionModal } from './components/CorrectionModal';
import { UtilityWorksView } from './components/UtilityWorksView';
import { UtilityWorkDetailModal } from './components/UtilityWorkDetailModal';
import { 
  Building2, 
  Layers, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  CheckSquare, 
  X, 
  FileText,
  AlertTriangle,
  Wrench
} from 'lucide-react';

export default function App() {
  // Navigation & View Tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('harita');

  // Streets & Filter States
  const [streets, setStreets] = useState<StreetSegment[]>(MOCK_STREETS);
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [activeAuthorityFilter, setActiveAuthorityFilter] = useState<AuthorityType | 'ALL'>('ALL');
  const [selectedStreet, setSelectedStreet] = useState<StreetSegment | null>(null);
  const [multiSelectedStreets, setMultiSelectedStreets] = useState<StreetSegment[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

  // Complaints State with LocalStorage cache
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('sorumlu_kim_complaints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPLAINTS;
  });

  // Proposals State with LocalStorage cache
  const [proposals, setProposals] = useState<AuthorityCorrectionProposal[]>(() => {
    try {
      const saved = localStorage.getItem('sorumlu_kim_proposals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROPOSALS;
  });

  // Public Utility Works State with LocalStorage cache
  const [utilityWorks, setUtilityWorks] = useState<PublicUtilityWork[]>(() => {
    try {
      const saved = localStorage.getItem('sorumlu_kim_utility_works');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_UTILITY_WORKS;
  });

  // GPS Location & Pin States
  const [userGpsPos, setUserGpsPos] = useState<[number, number] | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [customPinPos, setCustomPinPos] = useState<[number, number] | null>(null);

  // Modals
  const [correctionModalStreet, setCorrectionModalStreet] = useState<StreetSegment | null>(null);
  const [selectedUtilityWorkModal, setSelectedUtilityWorkModal] = useState<PublicUtilityWork | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('sorumlu_kim_complaints', JSON.stringify(complaints));
    } catch (e) {}
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('sorumlu_kim_proposals', JSON.stringify(proposals));
    } catch (e) {}
  }, [proposals]);

  useEffect(() => {
    try {
      localStorage.setItem('sorumlu_kim_utility_works', JSON.stringify(utilityWorks));
    } catch (e) {}
  }, [utilityWorks]);

  // Filtered Streets according to city
  const filteredStreets = streets.filter((s) => {
    if (selectedCity !== 'ALL') {
      const matchCity = s.city.toLowerCase() === selectedCity.toLowerCase();
      // Also allow national highway corridors if looking across regions
      const isNationalHighway = s.authorityType === 'KGM' && s.roadType === 'otoyol';
      if (!matchCity && !isNationalHighway) return false;
    }
    return true;
  });

  // Dynamically add newly discovered / scanned roads from Overpass to the global list
  const handleAddStreets = (newStreets: StreetSegment[]) => {
    setStreets((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const toAdd = newStreets.filter((s) => !existingIds.has(s.id));
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd];
    });
  };

  // GPS Handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        setUserGpsPos([latitude, longitude]);
        setCustomPinPos([latitude, longitude]);
        setCurrentTab('harita');

        // Find nearest street
        let closest: StreetSegment | null = null;
        let minDist = Infinity;
        streets.forEach((st) => {
          st.coordinates.forEach((pt) => {
            const d = Math.hypot(pt[0] - latitude, pt[1] - longitude);
            if (d < minDist) {
              minDist = d;
              closest = st;
            }
          });
        });

        if (closest) {
          setSelectedStreet(closest);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        // Fallback simulation to Istanbul center if user denies permission in sandboxed preview
        const fallbackPos: [number, number] = [41.0664, 28.9951]; // Mecidiyeköy / Büyükdere
        setUserGpsPos(fallbackPos);
        setCustomPinPos(fallbackPos);
        setSelectedStreet(streets[0]);
        setCurrentTab('harita');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Toggle multi-selection for a street
  const handleToggleMultiSelect = (street: StreetSegment) => {
    setMultiSelectedStreets((prev) => {
      const exists = prev.some((s) => s.id === street.id);
      if (exists) {
        return prev.filter((s) => s.id !== street.id);
      } else {
        return [...prev, street];
      }
    });
  };

  // Add new complaint
  const handleAddComplaint = (newComp: Complaint) => {
    setComplaints((prev) => [newComp, ...prev]);
  };

  // Vote complaint
  const handleVoteComplaint = (complaintId: string, type: 'up' | 'down') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const currentVote = c.userVoted;
        if (currentVote === type) {
          // Revert vote
          return {
            ...c,
            userVoted: undefined,
            upvotes: type === 'up' ? c.upvotes - 1 : c.upvotes,
            downvotes: type === 'down' ? c.downvotes - 1 : c.downvotes,
          };
        } else {
          return {
            ...c,
            userVoted: type,
            upvotes: type === 'up' ? c.upvotes + 1 : currentVote === 'up' ? c.upvotes - 1 : c.upvotes,
            downvotes: type === 'down' ? c.downvotes + 1 : currentVote === 'down' ? c.downvotes - 1 : c.downvotes,
          };
        }
      })
    );
  };

  // Add correction proposal
  const handleAddProposal = (newProp: AuthorityCorrectionProposal) => {
    setProposals((prev) => [newProp, ...prev]);
  };

  // Vote on proposal
  const handleVoteProposal = (proposalId: string, isFor: boolean) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        return {
          ...p,
          votesFor: isFor ? p.votesFor + 1 : p.votesFor,
          votesAgainst: !isFor ? p.votesAgainst + 1 : p.votesAgainst,
        };
      })
    );
  };

  // Jump from complaint or list to map
  const handleSelectStreetAndOpenMap = (streetId: string) => {
    const target = streets.find((s) => s.id === streetId);
    if (target) {
      setSelectedStreet(target);
      setCurrentTab('harita');
    }
  };

  // Open Petition generator with a specific street
  const handleOpenPetition = (street: StreetSegment) => {
    if (!multiSelectedStreets.some((s) => s.id === street.id)) {
      setMultiSelectedStreets([street]);
    }
    setCurrentTab('dilekce');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#121212] selection:bg-[#1D4ED8] selection:text-white font-sans">
      {/* Top Main Responsive Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streets={streets}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        activeAuthorityFilter={activeAuthorityFilter}
        onSelectAuthorityFilter={setActiveAuthorityFilter}
        onSelectStreet={(street) => {
          setSelectedStreet(street);
          setCurrentTab('harita');
        }}
        onUseGps={handleUseGps}
        isGpsLoading={isGpsLoading}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelectMode={() => setIsMultiSelectMode(!isMultiSelectMode)}
        multiSelectedCount={multiSelectedStreets.length}
        utilityWorksCount={utilityWorks.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentTab === 'harita' && (
          <div className="flex-1 relative w-full h-[calc(100vh-105px)] min-h-[500px] bg-[#E9ECEF] overflow-hidden">
            {/* Full Space Map */}
            <div className="w-full h-full min-h-[500px]">
              <InteractiveMap
                streets={filteredStreets}
                selectedStreet={selectedStreet}
                onSelectStreet={setSelectedStreet}
                multiSelectedStreets={multiSelectedStreets}
                onToggleMultiSelectStreet={handleToggleMultiSelect}
                isMultiSelectMode={isMultiSelectMode}
                activeAuthorityFilter={activeAuthorityFilter}
                showActiveWorkOnly={false}
                showHeatmapOnly={false}
                customPinPos={customPinPos}
                onSetCustomPinPos={setCustomPinPos}
                userGpsPos={userGpsPos}
                utilityWorks={utilityWorks}
                onSelectUtilityWork={(work) => setSelectedUtilityWorkModal(work)}
                onAddStreets={handleAddStreets}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />
            </div>

            {/* On-Demand Desktop Sliding/Overlay Side Panel (Opens when a street is clicked) */}
            {selectedStreet && (
              <div className="hidden lg:block absolute top-3 left-3 z-30 w-96 max-h-[calc(100%-24px)] shadow-2xl rounded-2xl border border-neutral-300 overflow-hidden bg-white animate-in slide-in-from-left fade-in duration-300">
                <StreetDetailPanel
                  street={selectedStreet}
                  onClose={() => setSelectedStreet(null)}
                  onOpenPetition={handleOpenPetition}
                  onOpenComplaintModal={() => setCurrentTab('sikayetler')}
                  onOpenCorrectionModal={(st) => setCorrectionModalStreet(st)}
                  isMultiSelected={multiSelectedStreets.some((s) => s.id === selectedStreet.id)}
                  onToggleMultiSelect={handleToggleMultiSelect}
                  complaints={complaints}
                  utilityWorks={utilityWorks}
                  onSelectUtilityWork={(work) => setSelectedUtilityWorkModal(work)}
                />
              </div>
            )}

            {/* On-Demand Mobile/Tablet Bottom Sheet Drawer (Opens when a street is clicked) */}
            {selectedStreet && (
              <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto bg-white border-t border-neutral-300 shadow-2xl rounded-t-3xl animate-in slide-in-from-bottom duration-300">
                {/* iOS-style grab handle */}
                <div className="sticky top-0 z-10 flex justify-center pt-2.5 pb-1 bg-white/95 backdrop-blur">
                  <span className="w-10 h-1.5 rounded-full bg-neutral-300"></span>
                </div>
                <StreetDetailPanel
                  street={selectedStreet}
                  onClose={() => setSelectedStreet(null)}
                  onOpenPetition={handleOpenPetition}
                  onOpenComplaintModal={() => setCurrentTab('sikayetler')}
                  onOpenCorrectionModal={(st) => setCorrectionModalStreet(st)}
                  isMultiSelected={multiSelectedStreets.some((s) => s.id === selectedStreet.id)}
                  onToggleMultiSelect={handleToggleMultiSelect}
                  complaints={complaints}
                  utilityWorks={utilityWorks}
                  onSelectUtilityWork={(work) => setSelectedUtilityWorkModal(work)}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Public Utility & Municipal Works Live Layer & List */}
        {currentTab === 'kamu_calismalari' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <UtilityWorksView
              utilityWorks={utilityWorks}
              onSelectWork={(work) => setSelectedUtilityWorkModal(work)}
              onFocusOnMap={(work) => {
                const targetStreet = streets.find((s) => s.id === work.streetId);
                if (targetStreet) {
                  setSelectedStreet(targetStreet);
                }
                setCustomPinPos(work.coordinates);
                setCurrentTab('harita');
              }}
            />
          </div>
        )}

        {/* Tab 3: Complaints & Reviews */}
        {currentTab === 'sikayetler' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <ComplaintList
              complaints={complaints}
              streets={streets}
              onAddComplaint={handleAddComplaint}
              onVoteComplaint={handleVoteComplaint}
              onSelectStreetAndOpenMap={handleSelectStreetAndOpenMap}
              initialSelectedStreet={selectedStreet}
            />
          </div>
        )}

        {/* Tab 4: Chronic Problem Heatmap */}
        {currentTab === 'isi_haritasi' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <HeatmapView
              streets={streets}
              onSelectStreetAndOpenMap={handleSelectStreetAndOpenMap}
              onSelectAuthorityFilter={(auth) => {
                setActiveAuthorityFilter(auth);
                setCurrentTab('harita');
              }}
            />
          </div>
        )}

        {/* Tab 5: Official Petition Generator */}
        {currentTab === 'dilekce' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <PetitionGenerator
              selectedStreets={
                multiSelectedStreets.length > 0
                  ? multiSelectedStreets
                  : selectedStreet
                  ? [selectedStreet]
                  : [streets[0]]
              }
              onRemoveStreet={(id) =>
                setMultiSelectedStreets((prev) => prev.filter((s) => s.id !== id))
              }
              onClearStreets={() => setMultiSelectedStreets([])}
            />
          </div>
        )}

        {/* Tab 6: Analytics & Performance Statistics */}
        {currentTab === 'istatistikler' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <StatisticsDashboard
              streets={filteredStreets}
              complaints={complaints}
              selectedCity={selectedCity}
              onSelectStreetAndOpenMap={handleSelectStreetAndOpenMap}
            />
          </div>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="h-8 bg-[#121212] text-neutral-400 flex items-center px-4 sm:px-6 justify-between text-[10px] font-mono uppercase tracking-widest shrink-0">
        <span className="hidden sm:inline">Sistem Durumu: Çevrimiçi • AYKOME & SCADA Canlı Entegrasyonu</span>
        <span className="text-center sm:text-left">Veri: T.C. Belediyeler & KGM Envanteri</span>
        <span>2026 © Sorumlu Kim?</span>
      </footer>

      {/* Authority Correction Community Modal */}
      {correctionModalStreet && (
        <CorrectionModal
          street={correctionModalStreet}
          onClose={() => setCorrectionModalStreet(null)}
          proposals={proposals}
          onAddProposal={handleAddProposal}
          onVoteProposal={handleVoteProposal}
        />
      )}

      {/* Public Utility Work Detailed Permit & Safety Modal */}
      {selectedUtilityWorkModal && (
        <UtilityWorkDetailModal
          work={selectedUtilityWorkModal}
          onClose={() => setSelectedUtilityWorkModal(null)}
          streets={streets}
          onSelectStreet={(streetId) => {
            handleSelectStreetAndOpenMap(streetId);
            setSelectedUtilityWorkModal(null);
          }}
        />
      )}
    </div>
  );
}
