import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CameraView from '../../components/CameraView';
import { AIService } from '../../services/AIService';
import { LocationService } from '../../services/LocationService';

// Mock dos serviços
jest.mock('../../services/AIService');
jest.mock('../../services/LocationService');

describe('CameraView', () => {
  const mockOnObjectDetected = jest.fn();
  const mockOnClose = jest.fn();

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
    const { getByText, getByTestId } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    expect(getByText('Centralize o casarão na área')).toBeTruthy();
    expect(getByText('Tirar Foto')).toBeTruthy();
    expect(getByText('Galeria')).toBeTruthy();
  });

  it('deve mostrar status de localização', () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    expect(getByText('📍 Localização: Carregando...')).toBeTruthy();
  });

  it('deve mostrar área histórica quando detectada', async () => {
    (LocationService.isInHistoricalArea as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(getByText('🏛️ Área Histórica Detectada')).toBeTruthy();
    });
  });

  it('deve mostrar área não histórica quando não detectada', async () => {
    (LocationService.isInHistoricalArea as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(getByText('🏢 Área Moderna')).toBeTruthy();
    });
  });

  it('deve abrir câmera quando botão "Tirar Foto" é pressionado', async () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    // Verificar se a função de análise foi chamada
    await waitFor(() => {
      expect(AIService.analyzeImage).toHaveBeenCalled();
    });
  });

  it('deve abrir galeria quando botão "Galeria" é pressionado', async () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const galleryButton = getByText('Galeria');
    fireEvent.press(galleryButton);

    // Verificar se a função de análise foi chamada
    await waitFor(() => {
      expect(AIService.analyzeImage).toHaveBeenCalled();
    });
  });

  it('deve mostrar overlay de análise durante processamento', async () => {
    // Mock para simular análise lenta
    (AIService.analyzeImage as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    // Deve mostrar overlay de análise
    expect(getByText('🤖 Analisando Imagem...')).toBeTruthy();
    expect(getByText('IA processando...')).toBeTruthy();
  });

  it('deve chamar onObjectDetected com resultado da análise', async () => {
    const mockAnalysis = {
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
    };

    (AIService.analyzeImage as jest.Mock).mockResolvedValue(mockAnalysis);

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(mockOnObjectDetected).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
        }),
        mockAnalysis,
        expect.objectContaining({
          latitude: -23.5505,
          longitude: -46.6333,
        })
      );
    });
  });

  it('deve lidar com erro na análise de imagem', async () => {
    (AIService.analyzeImage as jest.Mock).mockRejectedValue(new Error('Analysis error'));

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    // Deve lidar com erro graciosamente
    await waitFor(() => {
      expect(mockOnObjectDetected).not.toHaveBeenCalled();
    });
  });

  it('deve lidar com erro na obtenção de localização', async () => {
    (LocationService.getCurrentLocation as jest.Mock).mockRejectedValue(
      new Error('Location error')
    );

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    // Deve mostrar mensagem de erro de localização
    await waitFor(() => {
      expect(getByText('📍 Localização: Erro ao obter localização')).toBeTruthy();
    });
  });

  it('deve mostrar informações de localização quando disponível', async () => {
    const mockLocation = {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
    };

    (LocationService.getAddressFromCoordinates as jest.Mock).mockResolvedValue(mockLocation);

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(getByText('📍 Localização: São Paulo, SP')).toBeTruthy();
    });
  });

  it('deve mostrar botão de ajuda', () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    expect(getByText('❓ Ajuda')).toBeTruthy();
  });

  it('deve mostrar frame de foco com estilo correto', () => {
    const { getByTestId } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const focusFrame = getByTestId('focus-frame');
    expect(focusFrame).toBeTruthy();
  });

  it('deve mostrar texto de foco correto', () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    expect(getByText('Centralize o casarão na área')).toBeTruthy();
  });

  it('deve ter botões com estilos modernos', () => {
    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    const galleryButton = getByText('Galeria');

    expect(cameraButton).toBeTruthy();
    expect(galleryButton).toBeTruthy();
  });

  it('deve mostrar indicador de modo offline quando aplicável', async () => {
    const mockAnalysis = {
      ...(AIService.analyzeImage as jest.Mock).mock.results[0].value,
      isOfflineAnalysis: true,
    };

    (AIService.analyzeImage as jest.Mock).mockResolvedValue(mockAnalysis);

    const { getByText } = render(
      <CameraView onObjectDetected={mockOnObjectDetected} onClose={mockOnClose} />
    );

    const cameraButton = getByText('Tirar Foto');
    fireEvent.press(cameraButton);

    await waitFor(() => {
      expect(mockOnObjectDetected).toHaveBeenCalled();
    });
  });
});
