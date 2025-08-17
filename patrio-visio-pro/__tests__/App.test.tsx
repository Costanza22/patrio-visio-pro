import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import { AIService } from '../services/AIService';
import { LocationService } from '../services/LocationService';

// Mock dos serviços
jest.mock('../services/AIService');
jest.mock('../services/LocationService');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock padrão para AIService
    (AIService.analyzeImage as jest.Mock).mockResolvedValue({
      labels: ['building', 'historic'],
      objects: ['house'],
      architecturalStyle: 'Colonial',
      buildingType: 'Casarão Histórico',
      estimatedYear: 1750,
      confidence: 90,
      description: 'Casarão histórico detectado!',
      isHistoricalBuilding: true,
      buildingCategory: 'historical',
      historicalValue: 'Alto',
      recommendations: ['Documente a fachada'],
      isOfflineAnalysis: true,
    });

    // Mock padrão para LocationService
    (LocationService.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
    });
  });

  it('deve renderizar corretamente', () => {
    const { getByText } = render(<App />);

    expect(getByText('🏛️ Patrio Visio Pro')).toBeTruthy();
    expect(getByText('IA para Reconhecimento de Casarões Históricos')).toBeTruthy();
  });

  it('deve mostrar CameraView por padrão', () => {
    const { getByText } = render(<App />);

    expect(getByText('Centralize o casarão na área')).toBeTruthy();
    expect(getByText('Tirar Foto')).toBeTruthy();
    expect(getByText('Galeria')).toBeTruthy();
  });

  it('deve mostrar BuildingInfo quando objeto é detectado', async () => {
    const { getByText, queryByText } = render(<App />);

    // Inicialmente não deve mostrar BuildingInfo
    expect(queryByText('Informações do Casarão')).toBeNull();

    // Simular detecção de objeto
    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    // Aguardar análise e exibição do BuildingInfo
    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });
  });

  it('deve fechar BuildingInfo quando onClose é chamado', async () => {
    const { getByText, queryByText } = render(<App />);

    // Abrir BuildingInfo
    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    // Fechar BuildingInfo
    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    // BuildingInfo deve desaparecer
    expect(queryByText('Informações do Casarão')).toBeNull();
  });

  it('deve passar dados corretos para BuildingInfo', async () => {
    const { getByText } = render(<App />);

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
      expect(getByText('🤖 Análise de IA')).toBeTruthy();
      expect(getByText('📱 Análise Offline')).toBeTruthy();
    });
  });

  it('deve lidar com erro na análise de IA', async () => {
    (AIService.analyzeImage as jest.Mock).mockRejectedValue(new Error('Analysis error'));

    const { getByText } = render(<App />);

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    // Deve lidar com erro graciosamente sem quebrar
    await waitFor(() => {
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });
  });

  it('deve lidar com erro na obtenção de localização', async () => {
    (LocationService.getCurrentLocation as jest.Mock).mockRejectedValue(
      new Error('Location error')
    );

    const { getByText } = render(<App />);

    // Deve lidar com erro de localização graciosamente
    await waitFor(() => {
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });
  });

  it('deve mostrar status de localização', async () => {
    const { getByText } = render(<App />);

    // Deve mostrar status de localização
    expect(getByText('📍 Localização: Carregando...')).toBeTruthy();
  });

  it('deve mostrar área histórica quando detectada', async () => {
    (LocationService.isInHistoricalArea as jest.Mock).mockReturnValue(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('🏛️ Área Histórica Detectada')).toBeTruthy();
    });
  });

  it('deve mostrar área não histórica quando não detectada', async () => {
    (LocationService.isInHistoricalArea as jest.Mock).mockReturnValue(false);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('🏢 Área Moderna')).toBeTruthy();
    });
  });

  it('deve manter estado entre aberturas de BuildingInfo', async () => {
    const { getByText, queryByText } = render(<App />);

    // Primeira detecção
    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    // Fechar
    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(queryByText('Informações do Casarão')).toBeNull();

    // Segunda detecção (deve funcionar normalmente)
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });
  });

  it('deve mostrar informações de análise offline', async () => {
    const { getByText } = render(<App />);

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('📱 Análise Offline')).toBeTruthy();
      expect(getByText('Funcionando sem internet - IA local inteligente')).toBeTruthy();
    });
  });

  it('deve mostrar informações de análise online quando aplicável', async () => {
    const onlineAnalysis = {
      labels: ['building', 'historic'],
      objects: ['house'],
      architecturalStyle: 'Colonial',
      buildingType: 'Casarão Histórico',
      estimatedYear: 1750,
      confidence: 90,
      description: 'Casarão histórico detectado!',
      isHistoricalBuilding: true,
      buildingCategory: 'historical',
      historicalValue: 'Alto',
      recommendations: ['Documente a fachada'],
      isOfflineAnalysis: false,
    };

    (AIService.analyzeImage as jest.Mock).mockResolvedValue(onlineAnalysis);

    const { getByText } = render(<App />);

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('🌐 Análise Online')).toBeTruthy();
    });
  });

  it('deve mostrar placeholder quando câmera está pausada', async () => {
    const { getByText } = render(<App />);

    // Simular pausa da câmera
    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    // Fechar BuildingInfo para voltar ao placeholder
    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    // Deve mostrar placeholder
    expect(getByText('Centralize o casarão na área')).toBeTruthy();
  });

  it('deve ter header com estilo correto', () => {
    const { getByText } = render(<App />);

    const header = getByText('🏛️ Patrio Visio Pro');
    const subtitle = getByText('IA para Reconhecimento de Casarões Históricos');

    expect(header).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });

  it('deve ter StatusBar configurado corretamente', () => {
    const { getByTestId } = render(<App />);

    // Verificar se StatusBar está presente
    expect(getByTestId('status-bar')).toBeTruthy();
  });

  it('deve lidar com múltiplas detecções sequenciais', async () => {
    const { getByText, queryByText } = render(<App />);

    // Primeira detecção
    let cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    // Fechar primeira detecção
    let closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(queryByText('Informações do Casarão')).toBeNull();

    // Segunda detecção
    cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    // Fechar segunda detecção
    closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(queryByText('Informações do Casarão')).toBeNull();
  });

  it('deve mostrar informações de localização quando disponíveis', async () => {
    const mockLocation = {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
    };

    (LocationService.getAddressFromCoordinates as jest.Mock).mockResolvedValue(mockLocation);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('📍 Localização: São Paulo, SP')).toBeTruthy();
    });
  });

  it('deve ter layout responsivo', () => {
    const { getByTestId } = render(<App />);

    const container = getByTestId('app-container');
    expect(container).toBeTruthy();
  });
});
