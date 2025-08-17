import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BuildingInfo from '../../components/BuildingInfo';

describe('BuildingInfo', () => {
  const mockBuilding = {
    id: '1',
    name: 'Casarão de Procópio Gomes',
    description: 'Casarão histórico do século XVIII',
    architecturalStyle: 'Colonial',
    constructionYear: '1750',
    historicalValue: 'Alto',
    currentUse: 'Patrimônio histórico',
    architect: 'Arquitetura colonial tradicional',
    constructionMaterials: ['Pedra', 'Madeira', 'Tijolo'],
    historicalEvents: [
      'Construído no século XVIII',
      'Residência de Procópio Gomes',
      'Tombado como patrimônio histórico',
    ],
    location: 'Centro Histórico',
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
  };

  const mockAIAnalysis = {
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
  };

  const mockLocation = {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    postalCode: '01234-567',
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente com todas as informações', () => {
    const { getByText, getByTestId } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Casarão de Procópio Gomes')).toBeTruthy();
    expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
    expect(getByText('🤖 Análise de IA')).toBeTruthy();
    expect(getByText('📱 Análise Offline')).toBeTruthy();
  });

  it('deve mostrar análise de IA quando disponível', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🤖 Análise de IA')).toBeTruthy();
    expect(getByText('📱 Análise Offline')).toBeTruthy();
    expect(getByText('Funcionando sem internet - IA local inteligente')).toBeTruthy();
    expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
    expect(getByText('95%')).toBeTruthy();
  });

  it('deve mostrar análise online quando aplicável', () => {
    const onlineAnalysis = {
      ...mockAIAnalysis,
      isOfflineAnalysis: false,
    };

    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={onlineAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🌐 Análise Online')).toBeTruthy();
  });

  it('deve mostrar categoria correta para casarão histórico', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
  });

  it('deve mostrar categoria correta para edifício moderno', () => {
    const modernAnalysis = {
      ...mockAIAnalysis,
      buildingCategory: 'modern',
      isHistoricalBuilding: false,
      architecturalStyle: 'Moderno/Contemporâneo',
      buildingType: 'Edifício Moderno',
      historicalValue: 'Baixo',
    };

    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={modernAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🏢 Edifício Moderno')).toBeTruthy();
  });

  it('deve mostrar categoria correta para outros objetos', () => {
    const otherAnalysis = {
      ...mockAIAnalysis,
      buildingCategory: 'other',
      isHistoricalBuilding: false,
      architecturalStyle: 'Não aplicável',
      buildingType: 'Não é um edifício',
      historicalValue: 'Não aplicável',
    };

    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={otherAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('📦 Outro Objeto')).toBeTruthy();
  });

  it('deve mostrar barra de confiança corretamente', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Confiança da Análise:')).toBeTruthy();
    expect(getByText('95%')).toBeTruthy();
  });

  it('deve mostrar detalhes da análise de IA', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🏗️ Estilo:')).toBeTruthy();
    expect(getByText('Colonial')).toBeTruthy();
    expect(getByText('🏛️ Tipo:')).toBeTruthy();
    expect(getByText('Casarão Histórico')).toBeTruthy();
    expect(getByText('📅 Ano Estimado:')).toBeTruthy();
    expect(getByText('1750')).toBeTruthy();
    expect(getByText('⭐ Valor Histórico:')).toBeTruthy();
    expect(getByText('Alto')).toBeTruthy();
  });

  it('deve mostrar recomendações da IA', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('💡 Recomendações:')).toBeTruthy();
    expect(getByText('• Documente a fachada e detalhes arquitetônicos')).toBeTruthy();
    expect(getByText('• Verifique se está listado como patrimônio histórico')).toBeTruthy();
    expect(getByText('• Considere restauração preservando características originais')).toBeTruthy();
  });

  it('deve mostrar informações do casarão', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Informações do Casarão')).toBeTruthy();
    expect(getByText('Casarão histórico do século XVIII')).toBeTruthy();
    expect(getByText('Colonial')).toBeTruthy();
    expect(getByText('1750')).toBeTruthy();
    expect(getByText('Alto')).toBeTruthy();
    expect(getByText('Patrimônio histórico')).toBeTruthy();
    expect(getByText('Arquitetura colonial tradicional')).toBeTruthy();
  });

  it('deve mostrar materiais de construção quando disponíveis', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Materiais de Construção')).toBeTruthy();
    expect(getByText('• Pedra')).toBeTruthy();
    expect(getByText('• Madeira')).toBeTruthy();
    expect(getByText('• Tijolo')).toBeTruthy();
  });

  it('deve mostrar eventos históricos quando disponíveis', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Eventos Históricos')).toBeTruthy();
    expect(getByText('• Construído no século XVIII')).toBeTruthy();
    expect(getByText('• Residência de Procópio Gomes')).toBeTruthy();
    expect(getByText('• Tombado como patrimônio histórico')).toBeTruthy();
  });

  it('deve mostrar informações de localização quando disponíveis', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('Localização')).toBeTruthy();
    expect(getByText('Centro Histórico')).toBeTruthy();
    expect(getByText('São Paulo, SP')).toBeTruthy();
    expect(getByText('01234-567')).toBeTruthy();
  });

  it('deve não mostrar seções vazias', () => {
    const buildingWithoutOptional = {
      ...mockBuilding,
      constructionMaterials: undefined,
      historicalEvents: undefined,
    };

    const { queryByText } = render(
      <BuildingInfo
        building={buildingWithoutOptional}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(queryByText('Materiais de Construção')).toBeNull();
    expect(queryByText('Eventos Históricos')).toBeNull();
  });

  it('deve chamar onClose quando botão de fechar é pressionado', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar badge de casarão reconhecido para edifícios conhecidos', () => {
    const recognizedBuilding = {
      ...mockBuilding,
      name: 'Casarão de Procópio Gomes',
    };

    const { getByText } = render(
      <BuildingInfo
        building={recognizedBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    expect(getByText('🤖 CASARÃO RECONHECIDO!')).toBeTruthy();
    expect(getByText('Casarão de Procópio Gomes')).toBeTruthy();
  });

  it('deve lidar com análise de IA sem recomendações', () => {
    const analysisWithoutRecommendations = {
      ...mockAIAnalysis,
      recommendations: [],
    };

    const { queryByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={analysisWithoutRecommendations}
        location={mockLocation}
      />
    );

    expect(queryByText('💡 Recomendações:')).toBeNull();
  });

  it('deve mostrar cores corretas para diferentes categorias', () => {
    const { getByText } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    // Verificar se as categorias são exibidas com cores corretas
    expect(getByText('🏛️ Casarão Histórico')).toBeTruthy();
  });

  it('deve ser scrollável para conteúdo longo', () => {
    const { getByTestId } = render(
      <BuildingInfo
        building={mockBuilding}
        onClose={mockOnClose}
        aiAnalysis={mockAIAnalysis}
        location={mockLocation}
      />
    );

    const scrollView = getByTestId('building-info-scroll');
    expect(scrollView).toBeTruthy();
  });
});
