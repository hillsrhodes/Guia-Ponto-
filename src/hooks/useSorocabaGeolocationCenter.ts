/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  SOROCABA_REGIONAL_HUBS,
  SorocabaHubPoint,
  findNearestSorocabaHub,
  detectSorocabaUserLocation,
  BrowserGeolocationResult
} from '../utils/sorocabaGeolocation';

export const SOROCABA_DEFAULT_COORDINATES = {
  lat: -23.5329,
  lng: -47.4658,
  zoom: 13,
  label: 'Campolim, Sorocaba - SP',
  city: 'Sorocaba',
  neighborhood: 'Campolim'
};

export const SOROCABA_REGION_BOUNDS = {
  minLat: -23.68,
  maxLat: -23.18,
  minLng: -47.72,
  maxLng: -47.20
};

const STORAGE_KEY = 'guiaponto_sorocaba_hub_v1';
const SYNC_EVENT_NAME = 'guiaponto-sorocaba-geo-sync';

export function isCoordinateWithinSorocabaBounds(lat: number, lng: number): boolean {
  return (
    lat >= SOROCABA_REGION_BOUNDS.minLat &&
    lat <= SOROCABA_REGION_BOUNDS.maxLat &&
    lng >= SOROCABA_REGION_BOUNDS.minLng &&
    lng <= SOROCABA_REGION_BOUNDS.maxLng
  );
}

export function enforceSorocabaCoordinates(
  lat: number,
  lng: number,
  forceLock = true
): {
  lat: number;
  lng: number;
  hub: SorocabaHubPoint;
  wasClampedToSorocaba: boolean;
} {
  const { nearestHub, isWithinSorocabaRegion } = findNearestSorocabaHub(lat, lng);
  const inBounds = isCoordinateWithinSorocabaBounds(lat, lng) && isWithinSorocabaRegion;

  if (inBounds) {
    return {
      lat,
      lng,
      hub: nearestHub,
      wasClampedToSorocaba: false
    };
  }

  if (forceLock) {
    const defaultHub = SOROCABA_REGIONAL_HUBS[0]; // Parque Campolim, Sorocaba
    return {
      lat: defaultHub.lat,
      lng: defaultHub.lng,
      hub: defaultHub,
      wasClampedToSorocaba: true
    };
  }

  return {
    lat,
    lng,
    hub: nearestHub,
    wasClampedToSorocaba: false
  };
}

export interface SorocabaGeoCenterState {
  lat: number;
  lng: number;
  label: string;
  neighborhood: string;
  city: string;
  zoom: number;
  activeHubId: string;
  activeHub: SorocabaHubPoint;
  isGpsActive: boolean;
  isForcedSorocabaCenter: boolean;
  forceLockRegion: boolean;
  source: 'default-sorocaba' | 'gps-local' | 'gps-anchored-sorocaba' | 'manual-hub';
  statusMessage: string;
}

export interface UseSorocabaGeolocationCenterOptions {
  autoDetectOnMount?: boolean;
  defaultHubId?: string;
  enforceRegionLock?: boolean;
}

/**
 * Custom React Hook that forces geolocation centering on the map and directory
 * to geographic coordinates of Sorocaba and region (-23.5329, -47.4658),
 * ensuring users in the area (or accessing remotely) see local Sorocaba results by default.
 */
export function useSorocabaGeolocationCenter(
  options: UseSorocabaGeolocationCenterOptions = {}
) {
  const {
    autoDetectOnMount = true,
    defaultHubId = 'campolim',
    enforceRegionLock = true
  } = options;

  const initialHub =
    SOROCABA_REGIONAL_HUBS.find((h) => h.id === defaultHubId) ||
    SOROCABA_REGIONAL_HUBS[0];

  const [geoState, setGeoState] = useState<SorocabaGeoCenterState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          const enforced = enforceSorocabaCoordinates(parsed.lat, parsed.lng, true);
          return {
            lat: enforced.lat,
            lng: enforced.lng,
            label: `${enforced.hub.name}, ${enforced.hub.city} - SP`,
            neighborhood: enforced.hub.neighborhood,
            city: enforced.hub.city,
            zoom: parsed.zoom || 13,
            activeHubId: enforced.hub.id,
            activeHub: enforced.hub,
            isGpsActive: Boolean(parsed.isGpsActive),
            isForcedSorocabaCenter: true,
            forceLockRegion: enforceRegionLock,
            source: parsed.source || 'default-sorocaba',
            statusMessage:
              parsed.statusMessage ||
              `Centralização forçada ativa em ${enforced.hub.label} (${enforced.lat.toFixed(4)}, ${enforced.lng.toFixed(4)})`
          };
        }
      }
    } catch {
      // Ignore storage read errors
    }

    return {
      lat: initialHub.lat,
      lng: initialHub.lng,
      label: `${initialHub.name}, ${initialHub.city} - SP`,
      neighborhood: initialHub.neighborhood,
      city: initialHub.city,
      zoom: 13,
      activeHubId: initialHub.id,
      activeHub: initialHub,
      isGpsActive: false,
      isForcedSorocabaCenter: true,
      forceLockRegion: enforceRegionLock,
      source: 'default-sorocaba',
      statusMessage: `Mapa e diretório centralizados por padrão em ${initialHub.label} (${initialHub.lat.toFixed(4)}, ${initialHub.lng.toFixed(4)})`
    };
  });

  const [isLocating, setIsLocating] = useState<boolean>(false);

  const persistAndBroadcast = useCallback((nextState: SorocabaGeoCenterState) => {
    setGeoState(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: nextState }));
    } catch {
      // Ignore storage write errors
    }
  }, []);

  // Force centering onto Sorocaba & Region coordinates (either a specific hub or Campolim/Centro default)
  const forceCenterSorocaba = useCallback(
    (hubId = 'campolim') => {
      const targetHub =
        SOROCABA_REGIONAL_HUBS.find((h) => h.id === hubId) ||
        SOROCABA_REGIONAL_HUBS[0];

      const nextState: SorocabaGeoCenterState = {
        lat: targetHub.lat,
        lng: targetHub.lng,
        label: `${targetHub.name}, ${targetHub.city} - SP`,
        neighborhood: targetHub.neighborhood,
        city: targetHub.city,
        zoom: 14,
        activeHubId: targetHub.id,
        activeHub: targetHub,
        isGpsActive: false,
        isForcedSorocabaCenter: true,
        forceLockRegion: true,
        source: 'manual-hub',
        statusMessage: `Geolocalização forçada para coordenadas de Sorocaba: ${targetHub.label} (${targetHub.lat.toFixed(4)}, ${targetHub.lng.toFixed(4)})`
      };

      persistAndBroadcast(nextState);
      return nextState;
    },
    [persistAndBroadcast]
  );

  // Select a specific Sorocaba & Region hub
  const selectHub = useCallback(
    (hub: SorocabaHubPoint) => {
      const nextState: SorocabaGeoCenterState = {
        lat: hub.lat,
        lng: hub.lng,
        label: `${hub.name}, ${hub.city} - SP`,
        neighborhood: hub.neighborhood,
        city: hub.city,
        zoom: 14,
        activeHubId: hub.id,
        activeHub: hub,
        isGpsActive: false,
        isForcedSorocabaCenter: true,
        forceLockRegion: geoState.forceLockRegion,
        source: 'manual-hub',
        statusMessage: `Mapa e diretório centralizados em ${hub.label} (${hub.lat.toFixed(4)}, ${hub.lng.toFixed(4)})`
      };
      persistAndBroadcast(nextState);
    },
    [geoState.forceLockRegion, persistAndBroadcast]
  );

  // Detect browser GPS and enforce Sorocaba & Region centering
  const refreshGpsWithSorocabaLock = useCallback(async (): Promise<BrowserGeolocationResult> => {
    setIsLocating(true);
    const result = await detectSorocabaUserLocation();
    const enforced = enforceSorocabaCoordinates(result.lat, result.lng, true);

    const nextState: SorocabaGeoCenterState = {
      lat: enforced.lat,
      lng: enforced.lng,
      label: `${enforced.hub.name}, ${enforced.hub.city} - SP`,
      neighborhood: enforced.hub.neighborhood,
      city: enforced.hub.city,
      zoom: 14,
      activeHubId: enforced.hub.id,
      activeHub: enforced.hub,
      isGpsActive: true,
      isForcedSorocabaCenter: true,
      forceLockRegion: true,
      source: result.source === 'gps-local' ? 'gps-local' : 'gps-anchored-sorocaba',
      statusMessage: result.statusMessage
    };

    persistAndBroadcast(nextState);
    setIsLocating(false);
    return result;
  }, [persistAndBroadcast]);

  // Toggle region lock
  const setForceLockRegion = useCallback(
    (locked: boolean) => {
      const enforced = enforceSorocabaCoordinates(geoState.lat, geoState.lng, locked);
      const nextState: SorocabaGeoCenterState = {
        ...geoState,
        lat: enforced.lat,
        lng: enforced.lng,
        activeHubId: enforced.hub.id,
        activeHub: enforced.hub,
        forceLockRegion: locked,
        isForcedSorocabaCenter: locked,
        statusMessage: locked
          ? `Trava geográfica de Sorocaba ativada em ${enforced.hub.label}`
          : 'Modo de exploração regional flexível ativado'
      };
      persistAndBroadcast(nextState);
    },
    [geoState, persistAndBroadcast]
  );

  // Auto-detect on mount while keeping strict Sorocaba fallback/anchoring
  useEffect(() => {
    if (!autoDetectOnMount) return;

    let mounted = true;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      detectSorocabaUserLocation().then((result) => {
        if (!mounted) return;
        const enforced = enforceSorocabaCoordinates(result.lat, result.lng, true);
        const nextState: SorocabaGeoCenterState = {
          lat: enforced.lat,
          lng: enforced.lng,
          label: `${enforced.hub.name}, ${enforced.hub.city} - SP`,
          neighborhood: enforced.hub.neighborhood,
          city: enforced.hub.city,
          zoom: 13,
          activeHubId: enforced.hub.id,
          activeHub: enforced.hub,
          isGpsActive: result.source === 'gps-local',
          isForcedSorocabaCenter: true,
          forceLockRegion: true,
          source: result.source === 'gps-local' ? 'gps-local' : 'gps-anchored-sorocaba',
          statusMessage: result.statusMessage
        };
        persistAndBroadcast(nextState);
      });
    }

    return () => {
      mounted = false;
    };
  }, [autoDetectOnMount, persistAndBroadcast]);

  // Listen for cross-component sync events
  useEffect(() => {
    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<SorocabaGeoCenterState>;
      if (customEvent.detail) {
        setGeoState(customEvent.detail);
      }
    };
    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    return () => window.removeEventListener(SYNC_EVENT_NAME, handleSync);
  }, []);

  // Compute OpenStreetMap embed bounding box centered around current Sorocaba coordinates
  const delta = 0.025;
  const bbox = `${(geoState.lng - delta).toFixed(4)}%2C${(geoState.lat - delta).toFixed(4)}%2C${(
    geoState.lng + delta
  ).toFixed(4)}%2C${(geoState.lat + delta).toFixed(4)}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${geoState.lat.toFixed(
    4
  )}%2C${geoState.lng.toFixed(4)}`;

  return {
    ...geoState,
    userCoords: {
      lat: geoState.lat,
      lng: geoState.lng,
      label: geoState.label,
      isGpsActive: geoState.isGpsActive
    },
    isLocating,
    mapEmbedUrl,
    regionalHubs: SOROCABA_REGIONAL_HUBS,
    regionBounds: SOROCABA_REGION_BOUNDS,
    forceCenterSorocaba,
    selectHub,
    refreshGpsWithSorocabaLock,
    setForceLockRegion
  };
}
