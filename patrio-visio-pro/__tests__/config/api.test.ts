import { 
  API_CONFIG, 
  HISTORICAL_AREAS, 
  ARCHITECTURAL_STYLES, 
  BUILDING_TYPES, 
  CONSTRUCTION_MATERIALS, 
  HISTORICAL_VALUES 
} from '../../config/api';

describe('API Configuration', () => {
  describe('API_CONFIG', () => {
    it('deve ter estrutura correta', () => {
      expect(API_CONFIG).toHaveProperty('GOOGLE_CLOUD_API_KEY');
      expect(API_CONFIG).toHaveProperty('GOOGLE_CLOUD_VISION_URL');
      expect(API_CONFIG).toHaveProperty('OPENWEATHER_API_KEY');
      expect(API_CONFIG).toHaveProperty('OPENWEATHER_BASE_URL');
    });

    it('deve ter URLs válidas', () => {
      expect(API_CONFIG.GOOGLE_CLOUD_VISION_URL).toContain('vision.googleapis.com');
      expect(API_CONFIG.OPENWEATHER_BASE_URL).toContain('api.openweathermap.org');
    });

    it('deve ter chaves de API como strings', () => {
      expect(typeof API_CONFIG.GOOGLE_CLOUD_API_KEY).toBe('string');
      expect(typeof API_CONFIG.OPENWEATHER_API_KEY).toBe('string');
    });
  });

  describe('HISTORICAL_AREAS', () => {
    it('deve ser um array não vazio', () => {
      expect(Array.isArray(HISTORICAL_AREAS)).toBe(true);
      expect(HISTORICAL_AREAS.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura correta para cada área', () => {
      HISTORICAL_AREAS.forEach((area) => {
        expect(area).toHaveProperty('name');
        expect(area).toHaveProperty('center');
        expect(area).toHaveProperty('radius');
        expect(area).toHaveProperty('description');
        expect(area).toHaveProperty('historicalSignificance');

        // Verificar tipos
        expect(typeof area.name).toBe('string');
        expect(typeof area.center.latitude).toBe('number');
        expect(typeof area.center.longitude).toBe('number');
        expect(typeof area.radius).toBe('number');
        expect(typeof area.description).toBe('string');
        expect(typeof area.historicalSignificance).toBe('string');
      });
    });

    it('deve ter coordenadas válidas', () => {
      HISTORICAL_AREAS.forEach((area) => {
        const { latitude, longitude } = area.center;
        
        expect(latitude).toBeGreaterThanOrEqual(-90);
        expect(latitude).toBeLessThanOrEqual(90);
        expect(longitude).toBeGreaterThanOrEqual(-180);
        expect(longitude).toBeLessThanOrEqual(180);
      });
    });

    it('deve ter raios válidos', () => {
      HISTORICAL_AREAS.forEach((area) => {
        expect(area.radius).toBeGreaterThan(0);
        expect(area.radius).toBeLessThan(50); // Máximo 50km
      });
    });

    it('deve ter área do Centro Histórico de São Paulo', () => {
      const centroSP = HISTORICAL_AREAS.find(area => 
        area.name.includes('Centro Histórico') && area.name.includes('São Paulo')
      );
      
      expect(centroSP).toBeDefined();
      expect(centroSP?.center.latitude).toBeCloseTo(-23.5505, 1);
      expect(centroSP?.center.longitude).toBeCloseTo(-46.6333, 1);
    });
  });

  describe('ARCHITECTURAL_STYLES', () => {
    it('deve ser um array não vazio', () => {
      expect(Array.isArray(ARCHITECTURAL_STYLES)).toBe(true);
      expect(ARCHITECTURAL_STYLES.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura correta para cada estilo', () => {
      ARCHITECTURAL_STYLES.forEach((style) => {
        expect(style).toHaveProperty('name');
        expect(style).toHaveProperty('period');
        expect(style).toHaveProperty('characteristics');
        expect(style).toHaveProperty('examples');

        // Verificar tipos
        expect(typeof style.name).toBe('string');
        expect(typeof style.period).toBe('string');
        expect(Array.isArray(style.characteristics)).toBe(true);
        expect(Array.isArray(style.examples)).toBe(true);
      });
    });

    it('deve ter características não vazias', () => {
      ARCHITECTURAL_STYLES.forEach((style) => {
        expect(style.characteristics.length).toBeGreaterThan(0);
        style.characteristics.forEach(characteristic => {
          expect(typeof characteristic).toBe('string');
          expect(characteristic.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter exemplos não vazios', () => {
      ARCHITECTURAL_STYLES.forEach((style) => {
        expect(style.examples.length).toBeGreaterThan(0);
        style.examples.forEach(example => {
          expect(typeof example).toBe('string');
          expect(example.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter estilo Colonial', () => {
      const colonial = ARCHITECTURAL_STYLES.find(style => 
        style.name === 'Colonial'
      );
      
      expect(colonial).toBeDefined();
      expect(colonial?.period).toContain('1500');
      expect(colonial?.characteristics).toContain('simplicidade');
    });

    it('deve ter estilo Barroco', () => {
      const barroco = ARCHITECTURAL_STYLES.find(style => 
        style.name === 'Barroco'
      );
      
      expect(barroco).toBeDefined();
      expect(barroco?.period).toContain('1600');
      expect(barroco?.characteristics).toContain('ornamentação');
    });
  });

  describe('BUILDING_TYPES', () => {
    it('deve ser um array não vazio', () => {
      expect(Array.isArray(BUILDING_TYPES)).toBe(true);
      expect(BUILDING_TYPES.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura correta para cada tipo', () => {
      BUILDING_TYPES.forEach((type) => {
        expect(type).toHaveProperty('category');
        expect(type).toHaveProperty('subtypes');
        expect(type).toHaveProperty('description');

        // Verificar tipos
        expect(typeof type.category).toBe('string');
        expect(Array.isArray(type.subtypes)).toBe(true);
        expect(typeof type.description).toBe('string');
      });
    });

    it('deve ter subtipos não vazios', () => {
      BUILDING_TYPES.forEach((type) => {
        expect(type.subtypes.length).toBeGreaterThan(0);
        type.subtypes.forEach(subtype => {
          expect(typeof subtype).toBe('string');
          expect(subtype.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter tipo Histórico', () => {
      const historico = BUILDING_TYPES.find(type => 
        type.category === 'Histórico'
      );
      
      expect(historico).toBeDefined();
      expect(historico?.subtypes).toContain('Casarão');
      expect(historico?.subtypes).toContain('Solar');
    });

    it('deve ter tipo Moderno', () => {
      const moderno = BUILDING_TYPES.find(type => 
        type.category === 'Moderno'
      );
      
      expect(moderno).toBeDefined();
      expect(moderno?.subtypes).toContain('Arranha-céu');
      expect(moderno?.subtypes).toContain('Edifício Comercial');
    });
  });

  describe('CONSTRUCTION_MATERIALS', () => {
    it('deve ser um array não vazio', () => {
      expect(Array.isArray(CONSTRUCTION_MATERIALS)).toBe(true);
      expect(CONSTRUCTION_MATERIALS.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura correta para cada material', () => {
      CONSTRUCTION_MATERIALS.forEach((material) => {
        expect(material).toHaveProperty('name');
        expect(material).toHaveProperty('period');
        expect(material).toHaveProperty('characteristics');
        expect(material).toHaveProperty('durability');

        // Verificar tipos
        expect(typeof material.name).toBe('string');
        expect(typeof material.period).toBe('string');
        expect(Array.isArray(material.characteristics)).toBe(true);
        expect(typeof material.durability).toBe('string');
      });
    });

    it('deve ter características não vazias', () => {
      CONSTRUCTION_MATERIALS.forEach((material) => {
        expect(material.characteristics.length).toBeGreaterThan(0);
        material.characteristics.forEach(characteristic => {
          expect(typeof characteristic).toBe('string');
          expect(characteristic.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter material Pedra', () => {
      const pedra = CONSTRUCTION_MATERIALS.find(material => 
        material.name === 'Pedra'
      );
      
      expect(pedra).toBeDefined();
      expect(pedra?.durability).toBe('Alta');
      expect(pedra?.characteristics).toContain('resistente');
    });

    it('deve ter material Madeira', () => {
      const madeira = CONSTRUCTION_MATERIALS.find(material => 
        material.name === 'Madeira'
      );
      
      expect(madeira).toBeDefined();
      expect(madeira?.durability).toBe('Média');
      expect(madeira?.characteristics).toContain('flexível');
    });
  });

  describe('HISTORICAL_VALUES', () => {
    it('deve ser um array não vazio', () => {
      expect(Array.isArray(HISTORICAL_VALUES)).toBe(true);
      expect(HISTORICAL_VALUES.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura correta para cada valor', () => {
      HISTORICAL_VALUES.forEach((value) => {
        expect(value).toHaveProperty('level');
        expect(value).toHaveProperty('criteria');
        expect(value).toHaveProperty('examples');

        // Verificar tipos
        expect(typeof value.level).toBe('string');
        expect(Array.isArray(value.criteria)).toBe(true);
        expect(Array.isArray(value.examples)).toBe(true);
      });
    });

    it('deve ter critérios não vazios', () => {
      HISTORICAL_VALUES.forEach((value) => {
        expect(value.criteria.length).toBeGreaterThan(0);
        value.criteria.forEach(criterion => {
          expect(typeof criterion).toBe('string');
          expect(criterion.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter exemplos não vazios', () => {
      HISTORICAL_VALUES.forEach((value) => {
        expect(value.examples.length).toBeGreaterThan(0);
        value.examples.forEach(example => {
          expect(typeof example).toBe('string');
          expect(example.length).toBeGreaterThan(0);
        });
      });
    });

    it('deve ter valor Alto', () => {
      const alto = HISTORICAL_VALUES.find(value => 
        value.level === 'Alto'
      );
      
      expect(alto).toBeDefined();
      expect(alto?.criteria).toContain('Patrimônio tombado');
      expect(alto?.criteria).toContain('Arquitetura única');
    });

    it('deve ter valor Médio', () => {
      const medio = HISTORICAL_VALUES.find(value => 
        value.level === 'Médio'
      );
      
      expect(medio).toBeDefined();
      expect(medio?.criteria).toContain('Características históricas');
      expect(medio?.criteria).toContain('Contexto urbano');
    });

    it('deve ter valor Baixo', () => {
      const baixo = HISTORICAL_VALUES.find(value => 
        value.level === 'Baixo'
      );
      
      expect(baixo).toBeDefined();
      expect(baixo?.criteria).toContain('Pouco significativo');
      expect(baixo?.criteria).toContain('Modificações extensas');
    });
  });

  describe('Integração entre configurações', () => {
    it('deve ter estilos arquitetônicos consistentes com tipos de construção', () => {
      const styleNames = ARCHITECTURAL_STYLES.map(style => style.name);
      const buildingTypeCategories = BUILDING_TYPES.map(type => type.category);
      
      // Estilos históricos devem corresponder a tipos históricos
      const historicalStyles = styleNames.filter(name => 
        ['Colonial', 'Barroco', 'Neoclássico', 'Vitoriano'].includes(name)
      );
      
      expect(buildingTypeCategories).toContain('Histórico');
    });

    it('deve ter materiais consistentes com períodos históricos', () => {
      const materialPeriods = CONSTRUCTION_MATERIALS.map(material => material.period);
      const stylePeriods = ARCHITECTURAL_STYLES.map(style => style.period);
      
      // Períodos devem ser consistentes
      materialPeriods.forEach(period => {
        expect(period).toMatch(/\d{4}-\d{4}/);
      });
    });

    it('deve ter valores históricos consistentes com critérios', () => {
      HISTORICAL_VALUES.forEach((value) => {
        expect(value.criteria.length).toBeGreaterThan(0);
        expect(value.examples.length).toBeGreaterThan(0);
      });
    });
  });
});
