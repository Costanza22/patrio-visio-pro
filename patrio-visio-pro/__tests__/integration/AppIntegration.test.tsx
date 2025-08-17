import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';
import { AIService } from '../../services/AIService';
import { LocationService } from '../../services/LocationService';

// Mock dos serviços
jest.mock('../../services/AIService');
jest.mock('../../services/LocationService');

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock padrão para AIService
    (AIService.analyzeImage as jest.Mock).mockResolvedValue({
      labels: ['building', 'historic', 'colonial'],
      objects: ['house', 'mansion'],
      architecturalStyle: 'Colonial',
      buildingType: 'Casarão Histórico',
      estimatedYear: 1750,
      confidence: 95,
      description: '🏛️ Casarão histórico detectado! Estilo arquitetônico: Colonial.',
      isHistoricalBuilding: true,
      buildingCategory: 'historical',
      historicalValue: 'Alto',
      recommendations: [
        'Documente a fachada e detalhes arquitetônicos',
        'Verifique se está listado como patrimônio histórico',
        'Considere restauração preservando características originais',
      ],
      isOfflineAnalysis: true,
    });

    // Mock padrão para LocationService
    (LocationService.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
    });

    (LocationService.isInHistoricalArea as jest.Mock).mockReturnValue(true);
  });

  describe('Fluxo Completo de Análise', () => {
    it('deve executar fluxo completo de detecção e análise', async () => {
      const { getByText, queryByText } = render(<App />);

      // 1. Verificar estado inicial
      expect(getByText('🏛️ Patrio Visio Pro')).toBeTruthy();
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
      expect(queryByText('Informações do Casarão')).toBeNull();

      // 2. Simular captura de foto
      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      // 3. Verificar overlay de análise
      expect(getByText('🤖 Analisando Imagem...')).toBeTruthy();
      expect(getByText('IA processando...')).toBeTruthy();

      // 4. Aguardar análise completa
      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // 5. Verificar informações da análise de IA
      expect(getByText('🤖 Análise de IA')).toBeTruthy();
      expect(getByText('📱 Análise Offline')).toBeTruthy();
      expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();

      // 6. Verificar detalhes da análise
      expect(getByText('🏗️ Estilo:')).toBeTruthy();
      expect(getByText('Colonial')).toBeTruthy();
      expect(getByText('🏛️ Tipo:')).toBeTruthy();
      expect(getByText('Casarão Histórico')).toBeTruthy();
      expect(getByText('📅 Ano Estimado:')).toBeTruthy();
      expect(getByText('1750')).toBeTruthy();

      // 7. Verificar recomendações
      expect(getByText('💡 Recomendações:')).toBeTruthy();
      expect(getByText('• Documente a fachada e detalhes arquitetônicos')).toBeTruthy();

      // 8. Fechar BuildingInfo
      const closeButton = getByText('✕');
      fireEvent.press(closeButton);

      // 9. Verificar retorno ao estado inicial
      expect(queryByText('Informações do Casarão')).toBeNull();
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });

    it('deve executar fluxo com galeria', async () => {
      const { getByText, queryByText } = render(<App />);

      // 1. Verificar estado inicial
      expect(queryByText('Informações do Casarão')).toBeNull();

      // 2. Simular seleção da galeria
      const galleryButton = getByText('Galeria');
      fireEvent.press(galleryButton);

      // 3. Aguardar análise
      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // 4. Verificar BuildingInfo aberto
      expect(getByText('🤖 Análise de IA')).toBeTruthy();
      expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
    });

    it('deve executar múltiplas análises sequenciais', async () => {
      const { getByText, queryByText } = render(<App />);

      // Primeira análise
      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // Fechar primeira análise
      const closeButton = getByText('✕');
      fireEvent.press(closeButton);

      expect(queryByText('Informações do Casarão')).toBeNull();

      // Segunda análise
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // Verificar se segunda análise funcionou
      expect(getByText('🤖 Análise de IA')).toBeTruthy();
      expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
    });
  });

  describe('Integração com Serviços', () => {
    it('deve integrar corretamente com AIService', async () => {
      const { getByText } = render(<App />);

      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(AIService.analyzeImage).toHaveBeenCalledTimes(1);
      });

      expect(getByText('Informações do Casarão')).toBeTruthy();
    });

    it('deve integrar corretamente com LocationService', async () => {
      const { getByText } = render(<App />);

      // Verificar se LocationService foi chamado
      await waitFor(() => {
        expect(LocationService.getCurrentLocation).toHaveBeenCalled();
      });

      // Verificar se área histórica foi detectada
      expect(getByText('🏛️ Área Histórica Detectada')).toBeTruthy();
    });

    it('deve lidar com erro no AIService graciosamente', async () => {
      (AIService.analyzeImage as jest.Mock).mockRejectedValue(new Error('AI Service Error'));

      const { getByText, queryByText } = render(<App />);

      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      // Deve lidar com erro sem quebrar
      await waitFor(() => {
        expect(queryByText('Informações do Casarão')).toBeNull();
      });

      // Deve manter interface funcional
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });

    it('deve lidar com erro no LocationService graciosamente', async () => {
      (LocationService.getCurrentLocation as jest.Mock).mockRejectedValue(
        new Error('Location Service Error')
      );

      const { getByText } = render(<App />);

      // Deve lidar com erro de localização
      await waitFor(() => {
        expect(getByText('📍 Localização: Erro ao obter localização')).toBeTruthy();
      });

      // Deve manter funcionalidade da câmera
      expect(getByText('Tirar Foto')).toBeTruthy();
      expect(getByText('Galeria')).toBeTruthy();
    });
  });

  describe('Estados da Interface', () => {
    it('deve mostrar estado de carregamento durante análise', async () => {
      // Mock para simular análise lenta
      (AIService.analyzeImage as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { getByText } = render(<App />);

      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      // Deve mostrar overlay de análise
      expect(getByText('🤖 Analisando Imagem...')).toBeTruthy();
      expect(getByText('IA processando...')).toBeTruthy();
    });

    it('deve alternar entre estados de câmera e BuildingInfo', async () => {
      const { getByText, queryByText } = render(<App />);

      // Estado inicial: câmera
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
      expect(queryByText('Informações do Casarão')).toBeNull();

      // Abrir BuildingInfo
      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // Fechar BuildingInfo
      const closeButton = getByText('✕');
      fireEvent.press(closeButton);

      // Voltar ao estado da câmera
      expect(queryByText('Informações do Casarão')).toBeNull();
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });
  });

  describe('Funcionalidades Offline', () => {
    it('deve funcionar completamente offline', async () => {
      const { getByText } = render(<App />);

      // Verificar se funciona sem internet
      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      // Verificar análise offline
      expect(getByText('📱 Análise Offline')).toBeTruthy();
      expect(getByText('Funcionando sem internet - IA local inteligente')).toBeTruthy();
    });

    it('deve mostrar status offline corretamente', async () => {
      const { getByText } = render(<App />);

      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('📱 Análise Offline')).toBeTruthy();
      });
    });
  });

  describe('Responsividade e Performance', () => {
    it('deve responder rapidamente a interações do usuário', async () => {
      const startTime = Date.now();
      
      const { getByText } = render(<App />);
      
      const cameraButton = getByText('Tirar Foto');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(getByText('Informações do Casarão')).toBeTruthy();
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Deve responder em menos de 1 segundo
      expect(responseTime).toBeLessThan(1000);
    });

    it('deve manter estado consistente durante interações', async () => {
      const { getByText, queryByText } = render(<App />);

      // Múltiplas interações
      for (let i = 0; i < 3; i++) {
        const cameraButton = getByText('Tirar Foto');
        fireEvent.press(cameraButton);

        await waitFor(() => {
          expect(getByText('Informações do Casarão')).toBeTruthy();
        });

        const closeButton = getByText('✕');
        fireEvent.press(closeButton);

        expect(queryByText('Informações do Casarão')).toBeNull();
      }

      // Estado final deve ser consistente
      expect(getByText('Centralize o casarão na área')).toBeTruthy();
    });
  });
});
