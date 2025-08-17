import { LocationService, LocationData } from '../../services/LocationService';
import * as Location from 'expo-location';

// Mock do expo-location
jest.mock('expo-location');

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('deve retornar true quando permissão é concedida', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await LocationService.requestLocationPermission();
      expect(result).toBe(true);
    });

    it('deve retornar false quando permissão é negada', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await LocationService.requestLocationPermission();
      expect(result).toBe(false);
    });

    it('deve lidar com erro na requisição de permissão', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await LocationService.requestLocationPermission();
      expect(result).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('deve retornar localização válida', async () => {
      const mockLocation = {
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 10,
          altitude: 760,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      };

      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

      const result = await LocationService.getCurrentLocation();

      expect(result).toBeDefined();
      expect(result.latitude).toBe(-23.5505);
      expect(result.longitude).toBe(-46.6333);
      expect(result.accuracy).toBe(10);
    });

    it('deve lidar com erro na obtenção de localização', async () => {
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
        new Error('Location error')
      );

      const result = await LocationService.getCurrentLocation();
      expect(result).toBeNull();
    });
  });

  describe('getAddressFromCoordinates', () => {
    it('deve retornar endereço válido', async () => {
      const mockAddress = [
        {
          street: 'Rua das Flores',
          city: 'São Paulo',
          region: 'SP',
          country: 'Brasil',
          postalCode: '01234-567',
        },
      ];

      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockAddress);

      const result = await LocationService.getAddressFromCoordinates(-23.5505, -46.6333);

      expect(result).toBeDefined();
      expect(result.street).toBe('Rua das Flores');
      expect(result.city).toBe('São Paulo');
      expect(result.state).toBe('SP');
      expect(result.country).toBe('Brasil');
      expect(result.postalCode).toBe('01234-567');
    });

    it('deve lidar com erro na obtenção de endereço', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockRejectedValue(
        new Error('Geocoding error')
      );

      const result = await LocationService.getAddressFromCoordinates(-23.5505, -46.6333);
      expect(result).toBeNull();
    });

    it('deve lidar com array vazio de endereços', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

      const result = await LocationService.getAddressFromCoordinates(-23.5505, -46.6333);
      expect(result).toBeNull();
    });
  });

  describe('formatAddress', () => {
    it('deve formatar endereço completo corretamente', () => {
      const address: LocationData = {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        postalCode: '01234-567',
      };

      const result = LocationService.formatAddress(address);

      expect(result).toBe('Rua das Flores, 123, São Paulo, SP, Brasil, 01234-567');
    });

    it('deve formatar endereço sem CEP corretamente', () => {
      const address: LocationData = {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
      };

      const result = LocationService.formatAddress(address);

      expect(result).toBe('Rua das Flores, 123, São Paulo, SP, Brasil');
    });
  });

  describe('calculateDistance', () => {
    it('deve calcular distância entre duas coordenadas corretamente', () => {
      const lat1 = -23.5505;
      const lon1 = -46.6333;
      const lat2 = -23.5489;
      const lon2 = -46.6388;

      const result = LocationService.calculateDistance(lat1, lon1, lat2, lon2);

      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('deve retornar 0 para coordenadas idênticas', () => {
      const lat = -23.5505;
      const lon = -46.6333;

      const result = LocationService.calculateDistance(lat, lon, lat, lon);

      expect(result).toBe(0);
    });

    it('deve calcular distância com precisão razoável', () => {
      // Coordenadas de São Paulo para Campinas (aproximadamente 100km)
      const lat1 = -23.5505;
      const lon1 = -46.6333;
      const lat2 = -22.9064;
      const lon2 = -47.0616;

      const result = LocationService.calculateDistance(lat1, lon1, lat2, lon2);

      // Distância deve estar entre 90km e 110km
      expect(result).toBeGreaterThan(90);
      expect(result).toBeLessThan(110);
    });
  });

  describe('deg2rad', () => {
    it('deve converter graus para radianos corretamente', () => {
      const result = LocationService.deg2rad(180);
      expect(result).toBe(Math.PI);

      const result2 = LocationService.deg2rad(90);
      expect(result2).toBe(Math.PI / 2);

      const result3 = LocationService.deg2rad(0);
      expect(result3).toBe(0);
    });
  });

  describe('findNearbyBuildings', () => {
    it('deve encontrar casarões próximos', () => {
      const userLat = -23.5505;
      const userLon = -46.6333;
      const maxDistance = 5; // 5km

      const result = LocationService.findNearbyBuildings(userLat, userLon, maxDistance);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('building');
      expect(result[0]).toHaveProperty('distance');
    });

    it('deve retornar array vazio para distância muito pequena', () => {
      const userLat = -23.5505;
      const userLon = -46.6333;
      const maxDistance = 0.001; // 1 metro

      const result = LocationService.findNearbyBuildings(userLat, userLon, maxDistance);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getDirectionsToBuilding', () => {
    it('deve retornar direções válidas', () => {
      const userLat = -23.5505;
      const userLon = -46.6333;
      const buildingLat = -23.5489;
      const buildingLon = -46.6388;

      const result = LocationService.getDirectionsToBuilding(
        userLat,
        userLon,
        buildingLat,
        buildingLon
      );

      expect(result).toHaveProperty('distance');
      expect(result).toHaveProperty('direction');
      expect(result).toHaveProperty('estimatedTime');
      expect(typeof result.distance).toBe('number');
      expect(typeof result.direction).toBe('string');
    });
  });

  describe('getDirection', () => {
    it('deve retornar direção norte corretamente', () => {
      const result = LocationService.getDirection(0);
      expect(result).toBe('Norte');
    });

    it('deve retornar direção sul corretamente', () => {
      const result = LocationService.getDirection(180);
      expect(result).toBe('Sul');
    });

    it('deve retornar direção leste corretamente', () => {
      const result = LocationService.getDirection(90);
      expect(result).toBe('Leste');
    });

    it('deve retornar direção oeste corretamente', () => {
      const result = LocationService.getDirection(270);
      expect(result).toBe('Oeste');
    });

    it('deve retornar direção intermediária corretamente', () => {
      const result = LocationService.getDirection(45);
      expect(result).toBe('Nordeste');
    });
  });

  describe('getDemoLocation', () => {
    it('deve retornar localização de demonstração válida', () => {
      const result = LocationService.getDemoLocation();

      expect(result).toBeDefined();
      expect(result.latitude).toBe(-23.5505);
      expect(result.longitude).toBe(-46.6333);
      expect(result.city).toBe('São Paulo');
      expect(result.state).toBe('SP');
      expect(result.country).toBe('Brasil');
    });
  });

  describe('isInHistoricalArea', () => {
    it('deve identificar área histórica corretamente', () => {
      // Centro histórico de São Paulo
      const result = LocationService.isInHistoricalArea(-23.5505, -46.6333);

      expect(result).toBe(true);
    });

    it('deve identificar área não histórica corretamente', () => {
      // Zona sul de São Paulo (área mais moderna)
      const result = LocationService.isInHistoricalArea(-23.6505, -46.7333);

      expect(result).toBe(false);
    });
  });

  describe('getWeatherInfo', () => {
    it('deve retornar informações climáticas válidas', async () => {
      const mockWeatherData = {
        main: {
          temp: 25,
          humidity: 60,
          pressure: 1013,
        },
        weather: [
          {
            description: 'céu limpo',
            icon: '01d',
          },
        ],
        wind: {
          speed: 5,
          deg: 180,
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      });

      const result = await LocationService.getWeatherInfo(-23.5505, -46.6333);

      expect(result).toBeDefined();
      expect(result.temperature).toBe(25);
      expect(result.description).toBe('céu limpo');
      expect(result.humidity).toBe(60);
    });

    it('deve lidar com erro na obtenção de clima', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Weather API error'));

      const result = await LocationService.getWeatherInfo(-23.5505, -46.6333);

      expect(result).toBeNull();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve lidar com coordenadas inválidas', () => {
      const result = LocationService.calculateDistance(
        NaN,
        -46.6333,
        -23.5489,
        -46.6388
      );

      expect(result).toBe(0);
    });

    it('deve lidar com valores extremos de coordenadas', () => {
      const result = LocationService.calculateDistance(
        1000, // latitude inválida
        -46.6333,
        -23.5489,
        -46.6388
      );

      expect(result).toBe(0);
    });
  });
});
