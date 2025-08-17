import { AIService, AIAnalysisResult } from '../../services/AIService';

describe('AIService', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('analyzeImage', () => {
    it('deve usar análise offline quando não há internet', async () => {
      // Mock fetch para simular sem internet
      global.fetch = jest.fn().mockRejectedValue(new Error('No internet'));

      const result = await AIService.analyzeImage('test-image-uri');

      expect(result.isOfflineAnalysis).toBe(true);
      expect(result).toHaveProperty('architecturalStyle');
      expect(result).toHaveProperty('buildingType');
      expect(result).toHaveProperty('confidence');
    });

    it('deve usar análise offline quando API key não está configurada', async () => {
      // Mock fetch para simular com internet
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ responses: [{ labelAnnotations: [] }] }),
      });

      const result = await AIService.analyzeImage('test-image-uri');

      expect(result.isOfflineAnalysis).toBe(true);
    });

    it('deve usar API online quando há internet e API key válida', async () => {
      // Mock fetch para simular resposta válida da API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          responses: [{
            labelAnnotations: [
              { description: 'building' },
              { description: 'historic' },
              { description: 'colonial' }
            ],
            localizedObjectAnnotations: [
              { name: 'house' },
              { name: 'architecture' }
            ]
          }]
        }),
      });

      const result = await AIService.analyzeImage('test-image-uri');

      expect(result.isOfflineAnalysis).toBe(false);
      expect(result.labels).toContain('building');
      expect(result.objects).toContain('house');
    });
  });

  describe('simulateIntelligentAnalysis', () => {
    it('deve retornar análise válida com todas as propriedades', () => {
      const result = AIService.simulateIntelligentAnalysis();

      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('objects');
      expect(result).toHaveProperty('architecturalStyle');
      expect(result).toHaveProperty('buildingType');
      expect(result).toHaveProperty('estimatedYear');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('isHistoricalBuilding');
      expect(result).toHaveProperty('buildingCategory');
      expect(result).toHaveProperty('historicalValue');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('isOfflineAnalysis');
    });

    it('deve retornar isOfflineAnalysis como true', () => {
      const result = AIService.simulateIntelligentAnalysis();
      expect(result.isOfflineAnalysis).toBe(true);
    });

    it('deve ter confidence entre 0 e 100', () => {
      const result = AIService.simulateIntelligentAnalysis();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('deve ter recommendations como array não vazio', () => {
      const result = AIService.simulateIntelligentAnalysis();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('getKnownBuildingInfo', () => {
    it('deve retornar informações do Casarão de Procópio Gomes', () => {
      const building = AIService.getKnownBuildingInfo('procopio_gomes');

      expect(building).toBeDefined();
      expect(building.name).toBe('Casarão de Procópio Gomes');
      expect(building.style).toBe('Colonial Português');
      expect(building.historicalValue).toBe('Alto');
    });

    it('deve retornar informações do Solar do Barão', () => {
      const building = AIService.getKnownBuildingInfo('solar_do_baron');

      expect(building).toBeDefined();
      expect(building.name).toBe('Solar do Barão');
      expect(building.style).toBe('Neoclássico');
      expect(building.historicalValue).toBe('Alto');
    });

    it('deve retornar null para building inexistente', () => {
      const building = AIService.getKnownBuildingInfo('inexistente');
      expect(building).toBeNull();
    });
  });

  describe('getAllKnownBuildings', () => {
    it('deve retornar array com todos os casarões conhecidos', () => {
      const buildings = AIService.getAllKnownBuildings();

      expect(Array.isArray(buildings)).toBe(true);
      expect(buildings.length).toBeGreaterThan(0);
      expect(buildings[0]).toHaveProperty('name');
      expect(buildings[0]).toHaveProperty('style');
      expect(buildings[0]).toHaveProperty('historicalValue');
    });
  });

  describe('saveAnalysis e getAnalysisHistory', () => {
    it('deve salvar e recuperar análise do histórico', async () => {
      const mockAnalysis: AIAnalysisResult = {
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

      const mockLocation = {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'São Paulo, SP',
      };

      await AIService.saveAnalysis('test-image-uri', mockAnalysis, mockLocation);
      const history = await AIService.getAnalysisHistory();

      expect(history.length).toBeGreaterThan(0);
      expect(history[0].analysis).toEqual(mockAnalysis);
      expect(history[0].location).toEqual(mockLocation);
      expect(history[0].isOffline).toBe(true);
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve lidar com erro na simulação de análise', () => {
      // Mock para forçar erro
      jest.spyOn(Math, 'random').mockImplementation(() => {
        throw new Error('Erro forçado');
      });

      const result = AIService.simulateIntelligentAnalysis();

      expect(result).toBeDefined();
      expect(result.architecturalStyle).toBe('Erro na análise');
      expect(result.confidence).toBe(0);
      expect(result.isOfflineAnalysis).toBe(true);

      // Restaurar implementação original
      jest.restoreAllMocks();
    });

    it('deve lidar com erro na análise de imagem', async () => {
      // Mock fetch para simular erro
      global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await AIService.analyzeImage('test-image-uri');

      expect(result.isOfflineAnalysis).toBe(true);
      expect(result).toBeDefined();
    });
  });

  describe('Validação de Dados', () => {
    it('deve validar parâmetros inválidos na análise de objetos', () => {
      // Teste com parâmetros inválidos
      const result = AIService['analyzeDetectedObjects'](null as any, undefined as any);

      expect(result.architecturalStyle).toBe('Não detectado');
      expect(result.buildingType).toBe('Não detectado');
      expect(result.confidence).toBe(0);
      expect(result.buildingCategory).toBe('other');
    });

    it('deve lidar com resposta inválida da API Vision', () => {
      const result = AIService['processVisionAPIResponse'](null);

      expect(result.isOfflineAnalysis).toBe(true);
      expect(result.architecturalStyle).toBeDefined();
    });
  });

  describe('Categorização de Objetos', () => {
    it('deve categorizar corretamente casarões históricos', () => {
      const labels = ['colonial', 'historic', 'building', 'mansion'];
      const objects = ['house', 'architecture'];

      const result = AIService['analyzeDetectedObjects'](labels, objects);

      expect(result.buildingCategory).toBe('historical');
      expect(result.isHistoricalBuilding).toBe(true);
      expect(result.historicalValue).toBe('Alto');
    });

    it('deve categorizar corretamente edifícios modernos', () => {
      const labels = ['modern', 'glass', 'steel', 'building'];
      const objects = ['skyscraper', 'office'];

      const result = AIService['analyzeDetectedObjects'](labels, objects);

      expect(result.buildingCategory).toBe('modern');
      expect(result.isHistoricalBuilding).toBe(false);
      expect(result.historicalValue).toBe('Baixo');
    });

    it('deve categorizar corretamente outros objetos', () => {
      const labels = ['toy', 'stuffed', 'plush'];
      const objects = ['doll'];

      const result = AIService['analyzeDetectedObjects'](labels, objects);

      expect(result.buildingCategory).toBe('other');
      expect(result.isHistoricalBuilding).toBe(false);
      expect(result.historicalValue).toBe('Não aplicável');
    });
  });

  describe('Determinação de Estilos Arquitetônicos', () => {
    it('deve determinar estilo colonial corretamente', () => {
      const detections = ['colonial', 'portuguese', 'traditional'];
      const style = AIService['determineArchitecturalStyle'](detections);
      expect(style).toBe('Colonial');
    });

    it('deve determinar estilo barroco corretamente', () => {
      const detections = ['baroque', 'ornate', 'decorative'];
      const style = AIService['determineArchitecturalStyle'](detections);
      expect(style).toBe('Barroco');
    });

    it('deve retornar estilo padrão quando não há correspondência', () => {
      const detections = ['unknown', 'style'];
      const style = AIService['determineArchitecturalStyle'](detections);
      expect(style).toBe('Histórico Tradicional');
    });
  });

  describe('Estimativa de Ano', () => {
    it('deve estimar ano para estilo colonial', () => {
      const year = AIService['estimateHistoricalYear']('Colonial');
      expect(year).toBeGreaterThanOrEqual(1500);
      expect(year).toBeLessThanOrEqual(1800);
    });

    it('deve estimar ano para estilo vitoriano', () => {
      const year = AIService['estimateHistoricalYear']('Vitoriano');
      expect(year).toBeGreaterThanOrEqual(1837);
      expect(year).toBeLessThanOrEqual(1901);
    });

    it('deve usar range padrão para estilos desconhecidos', () => {
      const year = AIService['estimateHistoricalYear']('Desconhecido');
      expect(year).toBeGreaterThanOrEqual(1800);
      expect(year).toBeLessThanOrEqual(1950);
    });
  });
});
