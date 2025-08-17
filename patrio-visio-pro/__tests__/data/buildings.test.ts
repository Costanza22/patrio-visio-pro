import { buildings } from '../../data/buildings';

describe('Buildings Data', () => {
  it('deve ter array de casarões válido', () => {
    expect(Array.isArray(buildings)).toBe(true);
    expect(buildings.length).toBeGreaterThan(0);
  });

  it('deve ter estrutura correta para cada casarão', () => {
    buildings.forEach((building, index) => {
      expect(building).toHaveProperty('id');
      expect(building).toHaveProperty('name');
      expect(building).toHaveProperty('description');
      expect(building).toHaveProperty('architecturalStyle');
      expect(building).toHaveProperty('constructionYear');
      expect(building).toHaveProperty('historicalValue');
      expect(building).toHaveProperty('currentUse');
      expect(building).toHaveProperty('architect');
      expect(building).toHaveProperty('location');
      expect(building).toHaveProperty('coordinates');

      // Verificar tipos
      expect(typeof building.id).toBe('string');
      expect(typeof building.name).toBe('string');
      expect(typeof building.description).toBe('string');
      expect(typeof building.architecturalStyle).toBe('string');
      expect(typeof building.constructionYear).toBe('string');
      expect(typeof building.historicalValue).toBe('string');
      expect(typeof building.currentUse).toBe('string');
      expect(typeof building.architect).toBe('string');
      expect(typeof building.location).toBe('string');
      expect(typeof building.coordinates.latitude).toBe('number');
      expect(typeof building.coordinates.longitude).toBe('number');

      // Verificar se não está vazio
      expect(building.id.length).toBeGreaterThan(0);
      expect(building.name.length).toBeGreaterThan(0);
      expect(building.description.length).toBeGreaterThan(0);
    });
  });

  it('deve ter IDs únicos', () => {
    const ids = buildings.map(building => building.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('deve ter coordenadas válidas', () => {
    buildings.forEach((building) => {
      const { latitude, longitude } = building.coordinates;
      
      // Latitude deve estar entre -90 e 90
      expect(latitude).toBeGreaterThanOrEqual(-90);
      expect(latitude).toBeLessThanOrEqual(90);
      
      // Longitude deve estar entre -180 e 180
      expect(longitude).toBeGreaterThanOrEqual(-180);
      expect(longitude).toBeLessThanOrEqual(180);
      
      // Coordenadas não devem ser 0,0 (mar)
      expect(latitude).not.toBe(0);
      expect(longitude).not.toBe(0);
    });
  });

  it('deve ter anos de construção válidos', () => {
    buildings.forEach((building) => {
      const year = parseInt(building.constructionYear);
      
      // Ano deve ser um número válido
      expect(isNaN(year)).toBe(false);
      
      // Ano deve estar em um range histórico razoável
      expect(year).toBeGreaterThanOrEqual(1500);
      expect(year).toBeLessThanOrEqual(1950);
    });
  });

  it('deve ter valores históricos válidos', () => {
    const validValues = ['Alto', 'Médio', 'Baixo'];
    
    buildings.forEach((building) => {
      expect(validValues).toContain(building.historicalValue);
    });
  });

  it('deve ter estilos arquitetônicos válidos', () => {
    const validStyles = [
      'Colonial',
      'Colonial Português',
      'Neoclássico',
      'Barroco',
      'Vitoriano',
      'Art Déco',
      'Art Nouveau',
      'Gótico',
      'Românico',
      'Renascença',
      'Medieval',
    ];
    
    buildings.forEach((building) => {
      expect(validStyles).toContain(building.architecturalStyle);
    });
  });

  it('deve ter Casarão de Procópio Gomes', () => {
    const procopioGomes = buildings.find(building => 
      building.name.includes('Procópio Gomes')
    );
    
    expect(procopioGomes).toBeDefined();
    expect(procopioGomes?.architecturalStyle).toBe('Colonial Português');
    expect(procopioGomes?.historicalValue).toBe('Alto');
    expect(procopioGomes?.constructionYear).toBe('1750');
  });

  it('deve ter Solar do Barão', () => {
    const solarDoBaron = buildings.find(building => 
      building.name.includes('Solar do Barão')
    );
    
    expect(solarDoBaron).toBeDefined();
    expect(solarDoBaron?.architecturalStyle).toBe('Neoclássico');
    expect(solarDoBaron?.historicalValue).toBe('Alto');
  });

  it('deve ter localizações válidas', () => {
    buildings.forEach((building) => {
      expect(building.location.length).toBeGreaterThan(0);
      expect(typeof building.location).toBe('string');
    });
  });

  it('deve ter descrições informativas', () => {
    buildings.forEach((building) => {
      expect(building.description.length).toBeGreaterThan(10);
      expect(building.description).toContain('século');
    });
  });

  it('deve ter usos atuais válidos', () => {
    buildings.forEach((building) => {
      expect(building.currentUse.length).toBeGreaterThan(0);
      expect(typeof building.currentUse).toBe('string');
    });
  });

  it('deve ter arquitetos válidos', () => {
    buildings.forEach((building) => {
      expect(building.architect.length).toBeGreaterThan(0);
      expect(typeof building.architect).toBe('string');
    });
  });

  it('deve ter pelo menos 3 casarões', () => {
    expect(buildings.length).toBeGreaterThanOrEqual(3);
  });

  it('deve ter casarões em diferentes estilos', () => {
    const styles = buildings.map(building => building.architecturalStyle);
    const uniqueStyles = new Set(styles);
    
    expect(uniqueStyles.size).toBeGreaterThan(1);
  });

  it('deve ter casarões em diferentes períodos históricos', () => {
    const years = buildings.map(building => parseInt(building.constructionYear));
    const uniqueYears = new Set(years);
    
    expect(uniqueYears.size).toBeGreaterThan(1);
  });

  it('deve ter casarões com diferentes valores históricos', () => {
    const values = buildings.map(building => building.historicalValue);
    const uniqueValues = new Set(values);
    
    expect(uniqueValues.size).toBeGreaterThan(1);
  });

  it('deve ter coordenadas em áreas urbanas brasileiras', () => {
    buildings.forEach((building) => {
      const { latitude, longitude } = building.coordinates;
      
      // Coordenadas devem estar no Brasil
      expect(latitude).toBeLessThan(5); // Norte do Brasil
      expect(latitude).toBeGreaterThan(-34); // Sul do Brasil
      expect(longitude).toBeGreaterThan(-74); // Oeste do Brasil
      expect(longitude).toBeLessThan(-34); // Leste do Brasil
    });
  });

  it('deve ter estrutura consistente para materiais opcionais', () => {
    buildings.forEach((building) => {
      if (building.constructionMaterials) {
        expect(Array.isArray(building.constructionMaterials)).toBe(true);
        building.constructionMaterials.forEach(material => {
          expect(typeof material).toBe('string');
          expect(material.length).toBeGreaterThan(0);
        });
      }
    });
  });

  it('deve ter estrutura consistente para eventos históricos opcionais', () => {
    buildings.forEach((building) => {
      if (building.historicalEvents) {
        expect(Array.isArray(building.historicalEvents)).toBe(true);
        building.historicalEvents.forEach(event => {
          expect(typeof event).toBe('string');
          expect(event.length).toBeGreaterThan(0);
        });
      }
    });
  });
});
