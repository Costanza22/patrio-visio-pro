import * as Location from 'expo-location';

// Interface para dados de localização
export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

// Interface para dados de casarão com localização
export interface BuildingWithLocation {
  id: string;
  name: string;
  type: string;
  year: string;
  style: string;
  description: string;
  address: string;
  historicalValue: string;
  currentUse: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  architect?: string;
  constructionMaterials?: string[];
  historicalEvents?: string[];
  distance?: number; // Distância do usuário
}

export class LocationService {
  // Solicitar permissões de localização
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }

  // Obter localização atual do usuário
  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        console.log('Permissão de localização negada');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      // Obter endereço reverso
      const address = await this.getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...address,
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return null;
    }
  }

  // Obter endereço a partir de coordenadas
  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Partial<LocationData>> {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return {
          address: this.formatAddress(address),
          city: address.city || 'Desconhecido',
          state: address.region || 'Desconhecido',
          country: address.country || 'Desconhecido',
          postalCode: address.postalCode,
        };
      }

      return {
        address: 'Endereço não encontrado',
        city: 'Desconhecido',
        state: 'Desconhecido',
        country: 'Desconhecido',
      };
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return {
        address: 'Erro ao obter endereço',
        city: 'Desconhecido',
        state: 'Desconhecido',
        country: 'Desconhecido',
      };
    }
  }

  // Formatar endereço
  private static formatAddress(address: any): string {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Endereço não disponível';
  }

  // Calcular distância entre duas coordenadas (fórmula de Haversine)
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    
    return Math.round(distance * 100) / 100; // Arredondar para 2 casas decimais
  }

  // Converter graus para radianos
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Encontrar casarões próximos
  static findNearbyBuildings(
    userLat: number,
    userLon: number,
    buildings: BuildingWithLocation[],
    maxDistance: number = 10 // km
  ): BuildingWithLocation[] {
    return buildings
      .map(building => ({
        ...building,
        distance: this.calculateDistance(
          userLat,
          userLon,
          building.coordinates.latitude,
          building.coordinates.longitude
        ),
      }))
      .filter(building => building.distance <= maxDistance)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  // Obter direções para um casarão
  static async getDirectionsToBuilding(
    buildingLat: number,
    buildingLon: number
  ): Promise<string> {
    try {
      const currentLocation = await this.getCurrentLocation();
      if (!currentLocation) {
        return 'Não foi possível obter sua localização atual';
      }

      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        buildingLat,
        buildingLon
      );

      const direction = this.getDirection(
        currentLocation.latitude,
        currentLocation.longitude,
        buildingLat,
        buildingLon
      );

      return `${direction} a ${distance} km de distância`;
    } catch (error) {
      console.error('Erro ao obter direções:', error);
      return 'Erro ao calcular direções';
    }
  }

  // Obter direção aproximada
  private static getDirection(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
  ): string {
    const dLat = toLat - fromLat;
    const dLon = toLon - fromLon;
    
    if (Math.abs(dLat) > Math.abs(dLon)) {
      return dLat > 0 ? 'ao norte' : 'ao sul';
    } else {
      return dLon > 0 ? 'ao leste' : 'ao oeste';
    }
  }

  // Simular localização para demonstração (quando GPS não estiver disponível)
  static getDemoLocation(): LocationData {
    return {
      latitude: -23.5505, // São Paulo
      longitude: -46.6333,
      address: 'Rua das Flores, 123 - Centro Histórico',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '01234-567',
    };
  }

  // Verificar se a localização está em área histórica
  static isInHistoricalArea(latitude: number, longitude: number): boolean {
    // Coordenadas aproximadas de áreas históricas conhecidas
    const historicalAreas = [
      { lat: -23.5505, lon: -46.6333, radius: 2 }, // Centro Histórico SP
      { lat: -23.5489, lon: -46.6388, radius: 1.5 }, // Sé
      { lat: -23.5631, lon: -46.6544, radius: 1 }, // Bela Vista
      { lat: -23.5587, lon: -46.6924, radius: 1.5 }, // Vila Madalena
    ];

    return historicalAreas.some(area => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        area.lat,
        area.lon
      );
      return distance <= area.radius;
    });
  }

  // Obter informações de clima da região (opcional)
  static async getWeatherInfo(latitude: number, longitude: number): Promise<any> {
    try {
      // Aqui você pode integrar com uma API de clima como OpenWeatherMap
      // Por enquanto, retornamos dados simulados
      return {
        temperature: '22°C',
        condition: 'Ensolarado',
        humidity: '65%',
        windSpeed: '12 km/h',
      };
    } catch (error) {
      console.error('Erro ao obter informações de clima:', error);
      return null;
    }
  }
}
