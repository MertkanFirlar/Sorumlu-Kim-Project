import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as L from 'leaflet';
import { AUTHORITIES_META, UTILITY_CATEGORIES_META, SEVERITY_BADGES_META } from '../data/mockData';
import { AuthorityType, PublicUtilityWork, RoadType, StreetSegment, UtilityWorkCategory } from '../types';
import { 
  TURKEY_PROVINCES, 
  fetchLiveRoadsFromOverpass, 
  fetchRoadAtLocation 
} from '../services/roadService';
import { 
  Compass, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Wrench, 
  RefreshCw, 
  Radio, 
  SlidersHorizontal,
  ChevronDown,
  Navigation,
  Info,
  CheckCircle2,
  AlertTriangle,
  Globe
} from 'lucide-react';

// Fix Leaflet default marker icons if loaded in bundler
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
} catch (e) {}

interface InteractiveMapProps {
  streets: StreetSegment[];
  selectedStreet: StreetSegment | null;
  onSelectStreet: (street: StreetSegment | null) => void;
  multiSelectedStreets: StreetSegment[];
  onToggleMultiSelectStreet: (street: StreetSegment) => void;
  isMultiSelectMode: boolean;
  activeAuthorityFilter: AuthorityType | 'ALL';
  showActiveWorkOnly: boolean;
  showHeatmapOnly: boolean;
  onPinLocationChange?: (lat: number, lng: number, nearestStreet: StreetSegment | null) => void;
  customPinPos: [number, number] | null;
  onSetCustomPinPos: (pos: [number, number] | null) => void;
  userGpsPos: [number, number] | null;
  utilityWorks?: PublicUtilityWork[];
  showUtilityWorksLayer?: boolean;
  onToggleUtilityWorksLayer?: (show: boolean) => void;
  onSelectUtilityWork?: (work: PublicUtilityWork) => void;
  onAddStreets?: (newStreets: StreetSegment[]) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  theme?: 'light' | 'dark';
  focusLocation?: [number, number] | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  streets,
  selectedStreet,
  onSelectStreet,
  multiSelectedStreets,
  onToggleMultiSelectStreet,
  isMultiSelectMode,
  activeAuthorityFilter,
  showActiveWorkOnly,
  showHeatmapOnly,
  onPinLocationChange,
  customPinPos,
  onSetCustomPinPos,
  userGpsPos,
  utilityWorks = [],
  showUtilityWorksLayer = true,
  onToggleUtilityWorksLayer,
  onSelectUtilityWork,
  onAddStreets,
  selectedCity = 'ALL',
  onSelectCity,
  theme = 'light',
  focusLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Layer Groups
  const polylineCasingsGroupRef = useRef<L.FeatureGroup | null>(null);
  const polylinesGroupRef = useRef<L.FeatureGroup | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const heatmapGroupRef = useRef<L.FeatureGroup | null>(null);
  const utilityWorksGroupRef = useRef<L.FeatureGroup | null>(null);
  const customPinMarkerRef = useRef<L.Marker | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // States
  const [mapStyle, setMapStyle] = useState<'light' | 'osm' | 'dark'>(theme === 'dark' ? 'dark' : 'light');
  // Keep the basemap in sync with the app day/night theme
  useEffect(() => {
    setMapStyle(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);
  const [selectedUtilityCategory, setSelectedUtilityCategory] = useState<UtilityWorkCategory | 'ALL'>('ALL');
  const [roadTypeFilter, setRoadTypeFilter] = useState<RoadType | 'ALL'>('ALL');
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [nearestStreetNotification, setNearestStreetNotification] = useState<{
    street: StreetSegment;
    distanceMeters: number;
  } | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<string>('41.0082° K, 28.9784° D');
  const [activeProvinceName, setActiveProvinceName] = useState<string>('İstanbul');
  
  // Live Overpass scanner state
  const [isScanningRoads, setIsScanningRoads] = useState<boolean>(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);
  const [liveScanMessage, setLiveScanMessage] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const scanTimeoutRef = useRef<any>(null);

  // Tile layer configs — all keyless / no API token required
  const tileUrls = {
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  };

  // Helper to find nearest street segment
  const findNearestStreet = useCallback((lat: number, lng: number): { street: StreetSegment; distance: number } | null => {
    if (streets.length === 0) return null;
    let closest: StreetSegment | null = null;
    let minDistance = Infinity;

    for (const street of streets) {
      for (const pt of street.coordinates) {
        const d = Math.sqrt(Math.pow(pt[0] - lat, 2) + Math.pow(pt[1] - lng, 2));
        if (d < minDistance) {
          minDistance = d;
          closest = street;
        }
      }
    }

    if (!closest) return null;
    const distanceMeters = Math.round(minDistance * 111000);
    return { street: closest, distance: distanceMeters };
  }, [streets]);

  // Scan and fetch live roads for the current map view
  const scanCurrentBounds = useCallback(async (forced: boolean = false) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const zoom = map.getZoom();
    setCurrentZoom(zoom);

    // Only scan if zoom is sufficiently close (>= 13) or forced
    if (zoom < 13 && !forced) {
      setLiveScanMessage('Tüm yolları net boyamak için haritayı biraz daha yakınlaştırın (Zoom ≥ 13).');
      return;
    }

    const bounds = map.getBounds();
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const north = bounds.getNorth();
    const east = bounds.getEast();

    // Check roughly which province the center belongs to
    const center = map.getCenter();
    let closestProvince = TURKEY_PROVINCES[0];
    let minD = Infinity;
    for (const p of TURKEY_PROVINCES) {
      const d = Math.pow(p.center[0] - center.lat, 2) + Math.pow(p.center[1] - center.lng, 2);
      if (d < minD) {
        minD = d;
        closestProvince = p;
      }
    }
    setActiveProvinceName(closestProvince.name);

    setIsScanningRoads(true);
    setLiveScanMessage(`${closestProvince.name} bölgesindeki tüm cadde ve sokaklar taranıp boyanıyor...`);

    try {
      const fetched = await fetchLiveRoadsFromOverpass(
        south,
        west,
        north,
        east,
        closestProvince.name
      );

      if (fetched.length > 0 && onAddStreets) {
        onAddStreets(fetched);
        setLiveScanMessage(`✓ Bu alanda ${fetched.length} adet yeni yol canlı olarak boyandı ve idareleri sınıflandırıldı.`);
      } else {
        setLiveScanMessage(`✓ Mevcut bölgedeki yollar güncel ve boyalı.`);
      }
    } catch (e) {
      console.warn('Scan error:', e);
      setLiveScanMessage('Canlı yol tarama servisi meşgul, yerel yol veritabanı aktif.');
    } finally {
      setIsScanningRoads(false);
      setTimeout(() => {
        setLiveScanMessage(null);
      }, 5000);
    }
  }, [onAddStreets]);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const container = mapContainerRef.current;
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const initialCenter: [number, number] = [41.0250, 28.9850]; // Istanbul / Turkey view
    const map = L.map(container, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    const tileLayer = L.tileLayer(tileUrls[mapStyle], {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Feature groups in correct z-index layering
    heatmapGroupRef.current = L.featureGroup().addTo(map);
    polylineCasingsGroupRef.current = L.featureGroup().addTo(map);
    polylinesGroupRef.current = L.featureGroup().addTo(map);
    utilityWorksGroupRef.current = L.featureGroup().addTo(map);
    markersGroupRef.current = L.featureGroup().addTo(map);

    // Map move listener for coordinates & auto-scan
    map.on('move', () => {
      const center = map.getCenter();
      setMapCenterCoords(`${center.lat.toFixed(4)}° K, ${center.lng.toFixed(4)}° D`);
    });

    map.on('moveend', () => {
      if (autoScanEnabled) {
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = setTimeout(() => {
          scanCurrentBounds(false);
        }, 1200);
      }
    });

    // Map click: smart road snapper and draggable query pin
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onSetCustomPinPos([lat, lng]);

      // Check if clicked near an existing street
      const match = findNearestStreet(lat, lng);
      if (match && match.distance <= 120) {
        setNearestStreetNotification({
          street: match.street,
          distanceMeters: match.distance,
        });
        onSelectStreet(match.street);
        if (onPinLocationChange) {
          onPinLocationChange(lat, lng, match.street);
        }
      } else {
        // Road Snapper: Clicked on a point without existing street, fetch dynamically!
        setIsScanningRoads(true);
        setLiveScanMessage('Tıklanan yolun geometrisi ve idari sorumluluğu hesaplanıyor...');
        
        try {
          const snappedRoad = await fetchRoadAtLocation(lat, lng);
          if (snappedRoad) {
            if (onAddStreets) {
              onAddStreets([snappedRoad]);
            }
            onSelectStreet(snappedRoad);
            setNearestStreetNotification({
              street: snappedRoad,
              distanceMeters: 0,
            });
            if (onPinLocationChange) {
              onPinLocationChange(lat, lng, snappedRoad);
            }
            setLiveScanMessage(`✓ "${snappedRoad.name}" tespit edildi ve haritaya boyandı.`);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsScanningRoads(false);
          setTimeout(() => setLiveScanMessage(null), 4000);
        }
      }
    });

    mapInstanceRef.current = map;

    // Trigger size invalidation to ensure tiles and canvas render smoothly
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // Attach ResizeObserver to container
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          console.warn('Map cleanup error:', err);
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update tile style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileUrls[mapStyle]);
  }, [mapStyle]);

  // Handle Province / City changes (Pan to Province)
  useEffect(() => {
    if (!mapInstanceRef.current || selectedCity === 'ALL') return;
    const prov = TURKEY_PROVINCES.find((p) => p.name.toLowerCase() === selectedCity.toLowerCase());
    if (prov) {
      mapInstanceRef.current.flyTo(prov.center, prov.zoom, { duration: 1.2 });
      setActiveProvinceName(prov.name);
      // Trigger scan in new province
      setTimeout(() => {
        scanCurrentBounds(true);
      }, 1400);
    }
  }, [selectedCity, scanCurrentBounds]);

  // Handle GPS location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userGpsPos) {
      if (!userGpsMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'custom-gps-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-6 h-6 rounded-full bg-blue-500/40 animate-ping absolute"></div>
              <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg relative z-10"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        userGpsMarkerRef.current = L.marker(userGpsPos, { icon: userIcon }).addTo(map);
      } else {
        userGpsMarkerRef.current.setLatLng(userGpsPos);
      }
      map.flyTo(userGpsPos, 15, { duration: 1.2 });
    }
  }, [userGpsPos]);

  // Handle Custom draggable Pin
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (customPinPos) {
      if (!customPinMarkerRef.current) {
        const pinIcon = L.divIcon({
          className: 'custom-drag-pin',
          html: `
            <div class="relative flex flex-col items-center -translate-y-6">
              <div class="bg-[#121212] text-white px-2 py-0.5 text-[10px] font-mono font-bold shadow-md uppercase tracking-wider mb-0.5 whitespace-nowrap rounded-xl border border-neutral-300">
                Sorgu Pini (Sürükle)
              </div>
              <div class="w-5 h-5 bg-[#121212] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                <div class="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              </div>
              <div class="w-0.5 h-3 bg-neutral-800"></div>
            </div>
          `,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });

        const marker = L.marker(customPinPos, {
          icon: pinIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', async (event) => {
          const newPos = event.target.getLatLng();
          onSetCustomPinPos([newPos.lat, newPos.lng]);
          
          const match = findNearestStreet(newPos.lat, newPos.lng);
          if (match && match.distance <= 150) {
            setNearestStreetNotification({
              street: match.street,
              distanceMeters: match.distance,
            });
            onSelectStreet(match.street);
            if (onPinLocationChange) {
              onPinLocationChange(newPos.lat, newPos.lng, match.street);
            }
          } else {
            // Reverse geocode & snap road
            const snapped = await fetchRoadAtLocation(newPos.lat, newPos.lng);
            if (snapped) {
              if (onAddStreets) onAddStreets([snapped]);
              onSelectStreet(snapped);
              setNearestStreetNotification({ street: snapped, distanceMeters: 0 });
              if (onPinLocationChange) onPinLocationChange(newPos.lat, newPos.lng, snapped);
            }
          }
        });

        customPinMarkerRef.current = marker;
      } else {
        customPinMarkerRef.current.setLatLng(customPinPos);
      }
    } else if (customPinMarkerRef.current) {
      customPinMarkerRef.current.remove();
      customPinMarkerRef.current = null;
    }
  }, [customPinPos, findNearestStreet, onPinLocationChange, onSelectStreet, onSetCustomPinPos, onAddStreets]);

  // Fly to an externally-requested location (search / onboarding / GPS)
  useEffect(() => {
    if (focusLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(focusLocation, 16, { duration: 1.2 });
    }
  }, [focusLocation]);

  // Pan to selected street
  useEffect(() => {
    if (selectedStreet && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedStreet.center, Math.max(mapInstanceRef.current.getZoom(), 14), {
        duration: 0.8,
      });
    }
  }, [selectedStreet]);

  // RENDER ALL ROADS WITH PROPER CASING AND VIBRANT AUTHORITY COLORS
  useEffect(() => {
    if (
      !mapInstanceRef.current || 
      !polylinesGroupRef.current || 
      !polylineCasingsGroupRef.current || 
      !markersGroupRef.current || 
      !heatmapGroupRef.current
    ) return;

    polylinesGroupRef.current.clearLayers();
    polylineCasingsGroupRef.current.clearLayers();
    markersGroupRef.current.clearLayers();
    heatmapGroupRef.current.clearLayers();

    // Filter streets by authority and road type
    const filtered = streets.filter((street) => {
      if (activeAuthorityFilter !== 'ALL' && street.authorityType !== activeAuthorityFilter) {
        return false;
      }
      if (roadTypeFilter !== 'ALL' && street.roadType !== roadTypeFilter) {
        return false;
      }
      if (showActiveWorkOnly && street.status === 'normal') {
        return false;
      }
      if (showHeatmapOnly && street.chronicScore < 50) {
        return false;
      }
      return true;
    });

    filtered.forEach((street) => {
      const isSelected = selectedStreet?.id === street.id;
      const isMultiSelected = multiSelectedStreets.some((s) => s.id === street.id);
      const authorityMeta = AUTHORITIES_META[street.authorityType] || AUTHORITIES_META.BUYUKSEHIR;

      // Draw Heatmap circle if applicable
      if (showHeatmapOnly || street.chronicScore >= 70) {
        const radius = Math.max(250, street.chronicScore * 10);
        const opacity = street.chronicScore / 130;
        const circle = L.circle(street.center, {
          radius: radius,
          color: '#ef4444',
          fillColor: '#dc2626',
          fillOpacity: opacity,
          weight: 1,
          dashArray: '4, 8',
        });
        heatmapGroupRef.current?.addLayer(circle);
      }

      // Determine road line weight based on road type & selection
      let baseWeight = 6;
      if (street.roadType === 'otoyol' || street.roadType === 'devlet_yolu') {
        baseWeight = 8;
      } else if (street.roadType === 'bulvar') {
        baseWeight = 7;
      } else if (street.roadType === 'cadde') {
        baseWeight = 6;
      } else if (street.roadType === 'sokak' || street.roadType === 'koy_yolu') {
        baseWeight = 5;
      }

      const activeWeight = isSelected ? baseWeight + 4 : isMultiSelected ? baseWeight + 3 : baseWeight;
      const lineColor = isMultiSelected ? '#f59e0b' : isSelected ? '#111827' : authorityMeta.color;

      // 1. Draw Outer Casing (Border outline) for crisp visual separation over any tile
      const casingPolyline = L.polyline(street.coordinates, {
        color: isSelected ? '#fbbf24' : '#ffffff',
        weight: activeWeight + 3,
        opacity: isSelected ? 0.95 : 0.75,
        lineCap: 'round',
        lineJoin: 'round',
      });
      polylineCasingsGroupRef.current?.addLayer(casingPolyline);

      // 2. Draw Main Colored Line
      const polyline = L.polyline(street.coordinates, {
        color: lineColor,
        weight: activeWeight,
        opacity: isSelected || isMultiSelected ? 1 : 0.9,
        dashArray: isMultiSelected ? '8, 6' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Hover and Click events
      polyline.on('mouseover', function () {
        if (!isSelected && !isMultiSelected) {
          polyline.setStyle({ weight: baseWeight + 3, opacity: 1 });
          casingPolyline.setStyle({ weight: baseWeight + 6 });
        }
      });

      polyline.on('mouseout', function () {
        if (!isSelected && !isMultiSelected) {
          polyline.setStyle({ weight: baseWeight, opacity: 0.9 });
          casingPolyline.setStyle({ weight: baseWeight + 3 });
        }
      });

      polyline.on('click', () => {
        if (isMultiSelectMode) {
          onToggleMultiSelectStreet(street);
        } else {
          onSelectStreet(street);
        }
      });

      // Interactive Popup on line
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-[#121212] max-w-[290px] bg-white font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="inline-block w-2.5 h-2.5 rounded-full" style="background-color: ${authorityMeta.color}"></span>
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-600 font-mono">${authorityMeta.shortName}</span>
          <span class="ml-auto text-[10px] font-mono text-neutral-400">${street.roadType.toUpperCase()}</span>
        </div>
        <h4 class="font-bold text-sm text-[#121212] mb-0.5">${street.name}</h4>
        <p class="text-xs text-neutral-600 mb-2">${street.district} / ${street.city}</p>
        
        <!-- Micro Info Badges: Legal Basis, Hotline, Department -->
        <div class="flex items-center gap-1.5 py-1.5 border-y border-neutral-200 my-2">
          <span class="text-[10px] font-mono text-neutral-400 font-bold">BİLGİ:</span>
          
          <button 
            type="button" 
            title="⚖️ Yasal Dayanak: ${authorityMeta.legalBasis.replace(/"/g, '&quot;')} (Görmek için tıkla)" 
            onclick="const p = this.closest('.leaflet-popup-content'); const d = p.querySelector('.popup-dynamic-info'); d.style.display = (d.dataset.type === 'legal' && d.style.display === 'block') ? 'none' : 'block'; d.dataset.type = 'legal'; d.innerHTML = '<strong class=\\'text-[#1D4ED8]\\'>⚖️ Yasal Dayanak:</strong><br/>${authorityMeta.legalBasis.replace(/'/g, "\\'")}'"
            class="px-1.5 py-0.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-blue-50 hover:border-[#1D4ED8] text-xs font-mono cursor-pointer flex items-center gap-1 transition"
          >
            <span>⚖️</span>
            <span class="text-[9px] font-bold">Dayanak</span>
          </button>

          <a 
            href="tel:${authorityMeta.contactPhone.replace(/\D/g, '') || '153'}" 
            title="📞 İhbar Hattı: ${authorityMeta.contactPhone.replace(/"/g, '&quot;')} (Aramak için tıkla)" 
            class="px-1.5 py-0.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-emerald-50 hover:border-[#047857] text-xs font-mono cursor-pointer flex items-center gap-1 text-[#047857] transition"
          >
            <span>📞</span>
            <span class="text-[9px] font-bold">${authorityMeta.contactPhone.split(' ')[0]}</span>
          </a>

          <button 
            type="button" 
            title="🏢 Yetkili Birim: ${authorityMeta.departmentName.replace(/"/g, '&quot;')} (Görmek için tıkla)" 
            onclick="const p = this.closest('.leaflet-popup-content'); const d = p.querySelector('.popup-dynamic-info'); d.style.display = (d.dataset.type === 'dept' && d.style.display === 'block') ? 'none' : 'block'; d.dataset.type = 'dept'; d.innerHTML = '<strong class=\\'text-[#6B21A8]\\'>🏢 Birim:</strong><br/>${authorityMeta.departmentName.replace(/'/g, "\\'")}'"
            class="px-1.5 py-0.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-purple-50 hover:border-[#6B21A8] text-xs font-mono cursor-pointer flex items-center gap-1 transition"
          >
            <span>🏢</span>
            <span class="text-[9px] font-bold">Birim</span>
          </button>
        </div>

        <div class="popup-dynamic-info hidden text-[10px] bg-[#F8F9FA] p-2 rounded-xl border border-neutral-300 font-sans mb-2 leading-relaxed"></div>

        <div class="text-[10px] text-neutral-500 font-mono flex items-center justify-between border-t border-neutral-200 pt-1">
          <span>Şerit: ${street.laneCount}</span>
          <span>Hız Limiti: ${street.speedLimit} km/s</span>
        </div>
      `;
      polyline.bindPopup(popupContent);

      polylinesGroupRef.current?.addLayer(polyline);

      // Generic Construction Warning Marker if no detailed utility work attached
      if (street.status === 'construction' || street.status === 'maintenance') {
        const hasDetailedUtilityWork = utilityWorks.some((w) => w.streetId === street.id);
        if (!hasDetailedUtilityWork || !showUtilityWorksLayer) {
          const workIcon = L.divIcon({
            className: 'custom-work-marker',
            html: `
              <div class="relative flex items-center justify-center group cursor-pointer" title="${street.statusDetail || 'Yol Çalışması'}">
                <div class="w-7 h-7 bg-amber-500/30 rounded-full animate-ping absolute"></div>
                <div class="w-6 h-6 bg-white border-2 border-amber-600 text-amber-700 rounded-full flex items-center justify-center shadow-md font-bold text-xs">
                  ⚠️
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const workMarker = L.marker(street.center, { icon: workIcon });
          workMarker.on('click', () => {
            onSelectStreet(street);
          });
          markersGroupRef.current?.addLayer(workMarker);
        }
      }
    });
  }, [
    streets,
    selectedStreet,
    multiSelectedStreets,
    isMultiSelectMode,
    activeAuthorityFilter,
    roadTypeFilter,
    showActiveWorkOnly,
    showHeatmapOnly,
    utilityWorks,
    showUtilityWorksLayer,
    onSelectStreet,
    onToggleMultiSelectStreet,
  ]);

  // RENDER REAL-TIME UTILITY WORKS LAYER
  useEffect(() => {
    if (!mapInstanceRef.current || !utilityWorksGroupRef.current) return;
    utilityWorksGroupRef.current.clearLayers();

    if (!showUtilityWorksLayer) return;

    const filteredWorks = utilityWorks.filter((w) => {
      if (selectedUtilityCategory !== 'ALL' && w.workCategory !== selectedUtilityCategory) {
        return false;
      }
      return true;
    });

    filteredWorks.forEach((work) => {
      const sevMeta = SEVERITY_BADGES_META[work.severity];
      const catMeta = UTILITY_CATEGORIES_META[work.workCategory] || {
        label: 'Altyapı',
        color: '#0284C7',
        shortCode: 'ALTYAPI',
      };

      const isActiveNow = work.standardWorkingHours.activeNow;

      // Excavation Buffer zone
      const excavationCircle = L.circle(work.coordinates, {
        radius: work.severity === 'kritik' ? 140 : work.severity === 'orta' ? 90 : 60,
        color: sevMeta.hex,
        fillColor: sevMeta.hex,
        fillOpacity: isActiveNow ? 0.25 : 0.12,
        weight: 1.5,
        dashArray: isActiveNow ? '4, 4' : '6, 6',
      });
      utilityWorksGroupRef.current?.addLayer(excavationCircle);

      const badgeIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group select-none -translate-x-1/2 -translate-y-1/2">
          ${
            isActiveNow
              ? `<div class="absolute w-10 h-10 rounded-full animate-ping pointer-events-none" style="background-color: ${sevMeta.pulseColor}"></div>`
              : ''
          }
          <div class="relative flex items-center bg-white border-2 shadow-lg transition-transform group-hover:scale-110" style="border-color: ${sevMeta.hex}">
            <div class="px-1.5 py-0.5 text-white font-mono font-bold text-[9px] flex items-center gap-1 uppercase" style="background-color: ${sevMeta.hex}">
              ${isActiveNow ? '<span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>' : ''}
              <span>${catMeta.shortCode}</span>
            </div>
            <div class="px-1.5 py-0.5 text-[#121212] font-mono text-[9px] font-bold bg-[#F8F9FA] whitespace-nowrap">
              ${work.responsibleAgency.split(' ')[0]}
            </div>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b" style="background-color: ${sevMeta.hex}; border-color: ${sevMeta.hex}"></div>
        </div>
      `;

      const workMarkerIcon = L.divIcon({
        className: 'custom-utility-work-badge',
        html: badgeIconHtml,
        iconSize: [80, 26],
        iconAnchor: [40, 13],
      });

      const marker = L.marker(work.coordinates, { icon: workMarkerIcon });

      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3.5 text-[#121212] max-w-[310px] bg-white font-sans';
      popupDiv.innerHTML = `
        <div class="flex items-center justify-between gap-1.5 mb-1">
          <span class="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase" style="background-color: ${sevMeta.hex}">
            ${sevMeta.label}
          </span>
          <span class="text-[9px] font-mono text-neutral-500 font-bold">${work.permitNumber}</span>
        </div>

        <h4 class="font-black text-xs text-[#121212] uppercase leading-snug mt-1 mb-1">
          ${work.title}
        </h4>

        <div class="text-[11px] text-neutral-500 font-mono mb-2">
          ${work.streetName} (${work.district} / ${work.city})
        </div>

        <div class="bg-[#F8F9FA] p-2 rounded-xl border border-neutral-300 text-[11px] font-mono space-y-1 mb-2">
          <div class="text-[#121212] flex items-center justify-between">
            <span class="text-neutral-500">Çalışma Saatleri:</span>
            <span class="font-bold text-[#C2410C]">${work.standardWorkingHours.scheduleText}</span>
          </div>
          <div class="text-neutral-700 font-sans text-[10px] border-t border-neutral-200 pt-1">
            <strong>Trafik Etkisi:</strong> ${work.trafficImpact}
          </div>
          <div class="text-[10px] text-neutral-500">
            Sorumlu Kurum: <strong>${work.responsibleAgency}</strong>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-1 border-t border-neutral-200">
          <span class="text-[10px] font-mono text-emerald-700 font-bold">
            ${isActiveNow ? '🔴 Şu An Aktif Mesai' : '🟡 Mesai Dışı'}
          </span>
          <button 
            id="btn-inspect-work-${work.id}"
            class="px-2.5 py-1 bg-[#121212] text-white hover:bg-neutral-800 text-[10px] font-mono font-bold uppercase tracking-tight"
          >
            Ruhsat & Detay İncele →
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-work-${work.id}`);
        if (btn && onSelectUtilityWork) {
          btn.onclick = () => onSelectUtilityWork(work);
        }
      });

      marker.on('click', () => {
        const matched = streets.find((s) => s.id === work.streetId);
        if (matched) {
          onSelectStreet(matched);
        }
      });

      utilityWorksGroupRef.current?.addLayer(marker);
    });
  }, [utilityWorks, showUtilityWorksLayer, selectedUtilityCategory, streets, onSelectStreet, onSelectUtilityWork]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.setView([39.0, 35.0], 6); // Whole Turkey overview
  };

  const activeWorkCount = utilityWorks.filter((w) => w.standardWorkingHours.activeNow).length;
  const paintedRoadCount = streets.length;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#E9ECEF] overflow-hidden select-none flex-1">
      {/* Map Container */}
      <div 
        id="leaflet-map" 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ minHeight: '500px' }}
      />

      {/* Floating Top Left Controls: Compact, Sleek Bar */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[calc(100%-80px)]">
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-neutral-300 shadow-md">
          {/* 81 Provinces Selector */}
          <div className="flex items-center text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-[#1D4ED8] ml-1.5 mr-1" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity && onSelectCity(e.target.value)}
              className="bg-transparent py-1 pr-2 text-xs font-bold font-mono text-[#121212] focus:outline-none cursor-pointer max-w-[150px] truncate"
              title="Şehir Seçimi"
            >
              <option value="ALL">🇹🇷 Tüm Türkiye</option>
              {TURKEY_PROVINCES.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.code} - {p.name} {p.isMetropolitan ? '★' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-neutral-300" />

          {/* Road Painter & Scanner Trigger */}
          <button
            onClick={() => scanCurrentBounds(true)}
            disabled={isScanningRoads}
            className="bg-[#121212] hover:bg-neutral-800 text-white px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Ekranda görünen alandaki tüm cadde ve sokakları OpenStreetMap'ten indirip kanuna göre boyar"
          >
            <RefreshCw className={`w-3 h-3 text-amber-400 ${isScanningRoads ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isScanningRoads ? 'Boyanıyor...' : 'Yolları Boya'}</span>
            <span className="bg-amber-400 text-black px-1 py-0.2 text-[10px] font-bold">
              {paintedRoadCount}
            </span>
          </button>

          <div className="h-4 w-px bg-neutral-300" />

          {/* Layers Popover Button */}
          <div className="relative">
            <button
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className={`px-2 py-1 text-xs font-mono font-bold flex items-center gap-1 transition ${
                isLayersOpen || showUtilityWorksLayer ? 'bg-neutral-100 text-[#121212]' : 'text-neutral-600 hover:text-black'
              }`}
              title="Katman ve Harita Ayarları"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Katmanlar</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLayersOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* On-Demand Layers Popover Card */}
            {isLayersOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-neutral-300 shadow-2xl p-3 z-50 text-xs font-sans space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                  <span className="font-black uppercase text-[11px] text-[#121212]">Harita & Katmanlar</span>
                  <button onClick={() => setIsLayersOpen(false)} className="text-neutral-400 hover:text-black">
                    ✕
                  </button>
                </div>

                {/* Utility Works Layer Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Wrench className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Altyapı Kazı Katmanı</span>
                  </div>
                  <button
                    onClick={() => onToggleUtilityWorksLayer && onToggleUtilityWorksLayer(!showUtilityWorksLayer)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition ${
                      showUtilityWorksLayer ? 'bg-[#C2410C] text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {showUtilityWorksLayer ? 'AÇIK' : 'KAPALI'}
                  </button>
                </div>

                {/* Map Base Tile Style */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Harita Tabanı</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['light', 'osm', 'dark'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setMapStyle(style)}
                        className={`py-1 text-[11px] font-mono font-bold uppercase border transition ${
                          mapStyle === style ? 'bg-[#121212] text-white border-[#121212]' : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {style === 'light' ? 'Açık' : style === 'osm' ? 'OSM' : 'Koyu'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Road Type Filter */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Yol Türü Filtresi</div>
                  <select
                    value={roadTypeFilter}
                    onChange={(e) => setRoadTypeFilter(e.target.value as any)}
                    className="w-full bg-[#F8F9FA] rounded-xl border border-neutral-300 p-1 text-xs font-mono"
                  >
                    <option value="ALL">Tüm Yol Türleri</option>
                    <option value="bulvar">Bulvarlar</option>
                    <option value="cadde">Ana Caddeler</option>
                    <option value="sokak">Ara Sokaklar</option>
                    <option value="otoyol">Otoyol / Devlet Yolları</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Notification / Scanner Progress Toast (Subtle) */}
        {liveScanMessage && (
          <div className="bg-[#121212]/95 text-white border border-neutral-700 px-3 py-1.5 text-xs font-mono flex items-center gap-2 shadow-lg max-w-sm">
            {isScanningRoads ? (
              <Radio className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{liveScanMessage}</span>
          </div>
        )}

        {/* Selected Road Toast */}
        {nearestStreetNotification && (
          <div className="bg-white rounded-xl border border-neutral-300 text-[#121212] px-3 py-1.5 text-xs shadow-md flex items-center gap-2 max-w-sm animate-in fade-in">
            <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold underline cursor-pointer truncate" onClick={() => onSelectStreet(nearestStreetNotification.street)}>
                {nearestStreetNotification.street.name}
              </span>
              <span 
                className="px-1.5 py-0.2 text-[9px] font-bold font-mono uppercase text-white shrink-0" 
                style={{ backgroundColor: AUTHORITIES_META[nearestStreetNotification.street.authorityType]?.color || '#1D4ED8' }}
              >
                {AUTHORITIES_META[nearestStreetNotification.street.authorityType]?.shortName || 'İdare'}
              </span>
            </div>
            <button 
              onClick={() => setNearestStreetNotification(null)}
              className="text-neutral-400 hover:text-black text-xs ml-auto pl-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 shadow-md">
        <div className="bg-white rounded-xl border border-neutral-300 overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            className="p-2 text-neutral-700 hover:bg-neutral-100 hover:text-black transition border-b border-neutral-200"
            title="Yakınlaştır"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-neutral-700 hover:bg-neutral-100 hover:text-black transition border-b border-neutral-200"
            title="Uzaklaştır"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 text-neutral-700 hover:bg-neutral-100 hover:text-black transition"
            title="Tüm Türkiye Genel Görünümü"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Left: On-Demand Legend Trigger & Expanded Card */}
      <div className="absolute bottom-3 left-3 z-20">
        {!isLegendOpen ? (
          <button
            onClick={() => setIsLegendOpen(true)}
            className="flex items-center gap-2 bg-white/95 hover:bg-white text-[#121212] px-3 py-1.5 rounded-xl border border-neutral-300 shadow-md text-xs font-mono font-bold transition backdrop-blur-xs hover:border-black"
            title="Sorumluluk Renk Rehberini Aç"
          >
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#047857]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B21A8]"></span>
            </div>
            <span>Renk Rehberi / Lejant</span>
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-300 p-3 shadow-2xl text-xs max-w-xs sm:max-w-md space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-200 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                TÜRKİYE YOL SORUMLULUK REJİMİ
              </span>
              <button
                onClick={() => setIsLegendOpen(false)}
                className="text-neutral-400 hover:text-black p-0.5 text-xs font-bold"
                title="Kapat"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 bg-[#1D4ED8] rounded-xs shrink-0 shadow-xs"></span>
                <span className="text-[#121212] font-bold">Büyükşehir (Ana Arter)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 bg-[#047857] rounded-xs shrink-0 shadow-xs"></span>
                <span className="text-[#121212] font-bold">İlçe Bel. (Ara Sokak)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 bg-[#C2410C] rounded-xs shrink-0 shadow-xs"></span>
                <span className="text-[#121212] font-bold">KGM (Otoyol / Devlet)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 bg-[#6B21A8] rounded-xs shrink-0 shadow-xs"></span>
                <span className="text-[#121212] font-bold">İl Özel İd. (Köy Yolu)</span>
              </div>
            </div>

            {showUtilityWorksLayer && (
              <div className="pt-2 border-t border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1 flex items-center justify-between">
                  <span>ALTYAPI KAZI ROZETLERİ</span>
                  <span className="text-red-600 font-bold font-mono text-[10px]">{activeWorkCount} Aktif</span>
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 bg-red-50 text-red-700 border border-red-300 font-bold">🔴 Kritik / Tam Şerit</span>
                  <span className="px-1.5 py-0.2 bg-orange-50 text-orange-800 border border-orange-300 font-bold">🟠 Gece Kazısı</span>
                  <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-300 font-bold">🟡 Kaldırım</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
