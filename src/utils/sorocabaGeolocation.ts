/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SorocabaHubPoint {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  label: string;
  lat: number;
  lng: number;
  description: string;
}

export const SOROCABA_REGIONAL_HUBS: SorocabaHubPoint[] = [
  {
    id: 'campolim',
    name: 'Parque Campolim',
    neighborhood: 'Campolim',
    city: 'Sorocaba',
    label: 'Campolim, Sorocaba - SP',
    lat: -23.5329,
    lng: -47.4658,
    description: 'Polo gastronômico, empresarial e shopping (Zona Sul)'
  },
  {
    id: 'centro',
    name: 'Centro de Sorocaba',
    neighborhood: 'Centro',
    city: 'Sorocaba',
    label: 'Centro, Sorocaba - SP',
    lat: -23.5015,
    lng: -47.4526,
    description: 'Comércio central, clínicas e serviços (Marco Zero)'
  },
  {
    id: 'santa-rosalia',
    name: 'Santa Rosália',
    neighborhood: 'Santa Rosália',
    city: 'Sorocaba',
    label: 'Santa Rosália, Sorocaba - SP',
    lat: -23.4892,
    lng: -47.4418,
    description: 'Saúde, academias e gastronomia tradicional (Zona Leste)'
  },
  {
    id: 'wanel-ville',
    name: 'Wanel Ville',
    neighborhood: 'Wanel Ville',
    city: 'Sorocaba',
    label: 'Wanel Ville, Sorocaba - SP',
    lat: -23.4945,
    lng: -47.5092,
    description: 'Eixo comercial e serviços 24h (Zona Oeste)'
  },
  {
    id: 'alem-ponte',
    name: 'Além Ponte',
    neighborhood: 'Além Ponte',
    city: 'Sorocaba',
    label: 'Além Ponte, Sorocaba - SP',
    lat: -23.5062,
    lng: -47.4331,
    description: 'Av. São Paulo, padarias artesanais e manutenção'
  },
  {
    id: 'trujillo',
    name: 'Trujillo',
    neighborhood: 'Trujillo',
    city: 'Sorocaba',
    label: 'Trujillo, Sorocaba - SP',
    lat: -23.4881,
    lng: -47.4662,
    description: 'Av. General Osório, polo automotivo e serviços'
  },
  {
    id: 'mangal',
    name: 'Mangal',
    neighborhood: 'Mangal',
    city: 'Sorocaba',
    label: 'Mangal, Sorocaba - SP',
    lat: -23.5112,
    lng: -47.4685,
    description: 'Escritórios jurídicos, clínicas e consultórios'
  },
  {
    id: 'votorantim',
    name: 'Votorantim (Centro)',
    neighborhood: 'Votorantim',
    city: 'Votorantim',
    label: 'Centro, Votorantim - SP',
    lat: -23.5446,
    lng: -47.4388,
    description: 'Av. 31 de Março e comércio integrado a Sorocaba'
  },
  {
    id: 'aracoiaba',
    name: 'Araçoiaba da Serra',
    neighborhood: 'Araçoiaba da Serra',
    city: 'Araçoiaba da Serra',
    label: 'Araçoiaba da Serra - SP',
    lat: -23.5042,
    lng: -47.6144,
    description: 'Eixo Raposo Tavares, lazer e gastronomia'
  },
  {
    id: 'itu',
    name: 'Itu (Condomínios)',
    neighborhood: 'Itu',
    city: 'Itu',
    label: 'Itu - SP (Região)',
    lat: -23.2642,
    lng: -47.2992,
    description: 'Eixo Castelo Branco, condomínios e arquitetura'
  }
];

/**
 * Haversine formula to calculate real distance in kilometers between two coordinates.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.max(0.2, Math.round(distance * 10) / 10);
}

/**
 * Finds the nearest Sorocaba & Region hub to a given coordinate pair.
 */
export function findNearestSorocabaHub(lat: number, lng: number): {
  nearestHub: SorocabaHubPoint;
  distanceToHubKm: number;
  isWithinSorocabaRegion: boolean;
} {
  let nearestHub = SOROCABA_REGIONAL_HUBS[0];
  let minDistance = Infinity;

  for (const hub of SOROCABA_REGIONAL_HUBS) {
    const dist = calculateHaversineDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestHub = hub;
    }
  }

  // Distance to Sorocaba Marco Zero (Centro)
  const distToSorocabaCenter = calculateHaversineDistanceKm(
    lat,
    lng,
    SOROCABA_REGIONAL_HUBS[1].lat,
    SOROCABA_REGIONAL_HUBS[1].lng
  );

  return {
    nearestHub,
    distanceToHubKm: minDistance,
    isWithinSorocabaRegion: distToSorocabaCenter <= 55
  };
}

export interface BrowserGeolocationResult {
  lat: number;
  lng: number;
  rawLat: number;
  rawLng: number;
  hub: SorocabaHubPoint;
  nearestHub: SorocabaHubPoint;
  isWithinRegion: boolean;
  source: 'gps-local' | 'gps-anchored-sorocaba' | 'fallback-sorocaba';
  statusMessage: string;
}

/**
 * Uses the browser's HTML5 Geolocation API and anchors/centers specifically
 * for Sorocaba and surroundings so proximity sorting always works accurately.
 */
export function detectSorocabaUserLocation(): Promise<BrowserGeolocationResult> {
  return new Promise((resolve) => {
    const defaultHub = SOROCABA_REGIONAL_HUBS[0]; // Campolim, Sorocaba

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({
        lat: defaultHub.lat,
        lng: defaultHub.lng,
        rawLat: defaultHub.lat,
        rawLng: defaultHub.lng,
        hub: defaultHub,
        nearestHub: defaultHub,
        isWithinRegion: true,
        source: 'fallback-sorocaba',
        statusMessage: 'Geolocalização centralizada em Sorocaba - Campolim (Padrão Regional)'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const rawLat = position.coords.latitude;
        const rawLng = position.coords.longitude;
        const { nearestHub, isWithinSorocabaRegion } = findNearestSorocabaHub(rawLat, rawLng);

        if (isWithinSorocabaRegion) {
          resolve({
            lat: rawLat,
            lng: rawLng,
            rawLat,
            rawLng,
            hub: nearestHub,
            nearestHub,
            isWithinRegion: true,
            source: 'gps-local',
            statusMessage: `GPS ativo! Localização detectada próxima a ${nearestHub.name} (${nearestHub.city})`
          });
        } else {
          // User is accessing from outside Sorocaba: anchor to Sorocaba hub so directory centers on Sorocaba & region
          resolve({
            lat: defaultHub.lat,
            lng: defaultHub.lng,
            rawLat,
            rawLng,
            hub: defaultHub,
            nearestHub: defaultHub,
            isWithinRegion: false,
            source: 'gps-anchored-sorocaba',
            statusMessage: `GPS sincronizado e centralizado na Região de Sorocaba (${defaultHub.label})`
          });
        }
      },
      () => {
        // Permission denied or timeout in preview iframe: center smoothly on Sorocaba hub
        resolve({
          lat: defaultHub.lat,
          lng: defaultHub.lng,
          rawLat: defaultHub.lat,
          rawLng: defaultHub.lng,
          hub: defaultHub,
          nearestHub: defaultHub,
          isWithinRegion: true,
          source: 'fallback-sorocaba',
          statusMessage: `Diretório centralizado automaticamente em ${defaultHub.label}`
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Estimates driving time in minutes in Sorocaba urban traffic based on distance.
 */
export function estimateTravelTimeMinutes(distanceKm: number): number {
  return Math.max(2, Math.round(distanceKm * 2.2));
}
