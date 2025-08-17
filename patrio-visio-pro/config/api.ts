// Configurações das APIs
export const API_CONFIG = {
  // Google Cloud Vision API
  GOOGLE_CLOUD: {
    API_KEY: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY || 'YOUR_GOOGLE_CLOUD_API_KEY',
    VISION_URL: 'https://vision.googleapis.com/v1/images:annotate',
    MAX_RESULTS: 10,
  },

  // OpenWeatherMap API (para informações de clima)
  OPENWEATHER: {
    API_KEY: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY',
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
  },

  // Google Maps API (para geocoding e direções)
  GOOGLE_MAPS: {
    API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
    GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    DIRECTIONS_URL: 'https://maps.googleapis.com/maps/api/directions/json',
  },

  // Configurações de análise de IA
  AI_ANALYSIS: {
    CONFIDENCE_THRESHOLD: 70, // % mínimo para considerar análise válida
    MAX_ANALYSIS_TIME: 30000, // 30 segundos máximo
    CACHE_DURATION: 3600000, // 1 hora em cache
  },

  // Configurações de localização
  LOCATION: {
    ACCURACY: 'high',
    TIMEOUT: 10000, // 10 segundos
    MAX_AGE: 60000, // 1 minuto
    DISTANCE_FILTER: 10, // metros
  },

  // Configurações de armazenamento
  STORAGE: {
    MAX_HISTORY_ITEMS: 50,
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    COMPRESSION_QUALITY: 0.8,
  },
};

// Configurações de áreas históricas conhecidas
export const HISTORICAL_AREAS = [
  {
    name: 'Centro Histórico de São Paulo',
    center: { latitude: -23.5505, longitude: -46.6333 },
    radius: 2, // km
    description: 'Região central com arquitetura colonial e eclética',
    buildings: ['Palacete dos Andradas', 'Solar dos Barões', 'Palacete das Artes'],
  },
  {
    name: 'Sé e Liberdade',
    center: { latitude: -23.5489, longitude: -46.6388 },
    radius: 1.5,
    description: 'Área com influência japonesa e arquitetura tradicional',
    buildings: ['Catedral da Sé', 'Edifícios da Liberdade'],
  },
  {
    name: 'Bela Vista',
    center: { latitude: -23.5631, longitude: -46.6544 },
    radius: 1,
    description: 'Bairro com casarões modernistas e art déco',
    buildings: ['Vila Modernista', 'Palacete Art Déco'],
  },
  {
    name: 'Vila Madalena',
    center: { latitude: -23.5587, longitude: -46.6924 },
    radius: 1.5,
    description: 'Região com chácaras históricas e arquitetura eclética',
    buildings: ['Chácara das Acácias', 'Vila dos Artistas'],
  },
];

// Configurações de estilos arquitetônicos
export const ARCHITECTURAL_STYLES = {
  GOTHIC: {
    name: 'Gótico',
    period: '1200-1500',
    characteristics: ['arcos pontiagudos', 'vitrais coloridos', 'elementos verticais'],
    examples: ['Catedrais medievais', 'Castelos'],
  },
  RENAISSANCE: {
    name: 'Renascença',
    period: '1400-1600',
    characteristics: ['proporções harmoniosas', 'simetria clássica', 'elementos decorativos'],
    examples: ['Palácios renascentistas', 'Igrejas clássicas'],
  },
  BAROQUE: {
    name: 'Barroco',
    period: '1600-1750',
    characteristics: ['ornamentação exuberante', 'curvas dinâmicas', 'efeitos dramáticos'],
    examples: ['Igrejas barrocas', 'Palácios reais'],
  },
  NEOCLASSICAL: {
    name: 'Neoclássico',
    period: '1750-1850',
    characteristics: ['inspiração greco-romana', 'colunas', 'frontões'],
    examples: ['Teatros', 'Museus', 'Edifícios governamentais'],
  },
  VICTORIAN: {
    name: 'Vitoriano',
    period: '1830-1900',
    characteristics: ['detalhes ornamentais', 'torres', 'varandas'],
    examples: ['Casas vitorianas', 'Mansões'],
  },
  ART_NOUVEAU: {
    name: 'Art Nouveau',
    period: '1890-1910',
    characteristics: ['linhas orgânicas', 'motivos florais', 'integração com natureza'],
    examples: ['Edifícios residenciais', 'Estações de trem'],
  },
  ART_DECO: {
    name: 'Art Déco',
    period: '1920-1940',
    characteristics: ['formas geométricas', 'decoração luxuosa', 'linhas aerodinâmicas'],
    examples: ['Cinemas', 'Hotéis', 'Edifícios comerciais'],
  },
  COLONIAL: {
    name: 'Colonial',
    period: '1600-1800',
    characteristics: ['simplicidade elegante', 'proporções equilibradas', 'materiais tradicionais'],
    examples: ['Casas coloniais', 'Igrejas', 'Fazendas'],
  },
  MODERN: {
    name: 'Moderno',
    period: '1950-presente',
    characteristics: ['linhas limpas', 'funcionalidade', 'materiais industriais'],
    examples: ['Edifícios corporativos', 'Residências', 'Centros culturais'],
  },
};

// Configurações de tipos de construção
export const BUILDING_TYPES = {
  RESIDENTIAL: {
    name: 'Residencial',
    description: 'Construções destinadas à moradia',
    examples: ['Casas', 'Mansões', 'Palácios', 'Apartamentos'],
  },
  COMMERCIAL: {
    name: 'Comercial',
    description: 'Construções para atividades comerciais',
    examples: ['Lojas', 'Escritórios', 'Hotéis', 'Restaurantes'],
  },
  RELIGIOUS: {
    name: 'Religioso',
    description: 'Construções para práticas religiosas',
    examples: ['Igrejas', 'Catedrais', 'Templos', 'Mesquitas'],
  },
  GOVERNMENTAL: {
    name: 'Governmental',
    description: 'Construções para funções governamentais',
    examples: ['Prefeituras', 'Tribunais', 'Escolas públicas', 'Hospitais'],
  },
  EDUCATIONAL: {
    name: 'Educacional',
    description: 'Construções para fins educativos',
    examples: ['Escolas', 'Universidades', 'Bibliotecas', 'Museus'],
  },
  INDUSTRIAL: {
    name: 'Industrial',
    description: 'Construções para atividades industriais',
    examples: ['Fábricas', 'Armazéns', 'Usinas', 'Galpões'],
  },
};

// Configurações de materiais de construção
export const CONSTRUCTION_MATERIALS = {
  STONE: {
    name: 'Pedra',
    types: ['granito', 'mármore', 'arenito', 'calcário'],
    characteristics: ['durabilidade', 'resistência', 'beleza natural'],
  },
  WOOD: {
    name: 'Madeira',
    types: ['pinho', 'carvalho', 'mogno', 'cedro'],
    characteristics: ['flexibilidade', 'isolamento térmico', 'trabalhabilidade'],
  },
  BRICK: {
    name: 'Tijolo',
    types: ['tijolo maciço', 'tijolo furado', 'tijolo aparente'],
    characteristics: ['resistência', 'isolamento', 'versatilidade'],
  },
  CONCRETE: {
    name: 'Concreto',
    types: ['concreto armado', 'concreto pré-moldado', 'concreto aparente'],
    characteristics: ['resistência', 'versatilidade', 'durabilidade'],
  },
  METAL: {
    name: 'Metal',
    types: ['ferro', 'aço', 'alumínio', 'cobre'],
    characteristics: ['resistência', 'flexibilidade', 'modernidade'],
  },
  GLASS: {
    name: 'Vidro',
    types: ['vidro comum', 'vitral', 'espelho'],
    characteristics: ['transparência', 'luminosidade', 'beleza'],
  },
};

// Configurações de valor histórico
export const HISTORICAL_VALUES = {
  HIGH: {
    name: 'Alto',
    description: 'Construção de extrema importância histórica',
    criteria: ['tombamento federal', 'arquitetura única', 'eventos históricos'],
  },
  MEDIUM: {
    name: 'Médio',
    description: 'Construção com valor histórico significativo',
    criteria: ['tombamento municipal', 'arquitetura representativa', 'contexto histórico'],
  },
  LOW: {
    name: 'Baixo',
    description: 'Construção com algum valor histórico',
    criteria: ['idade avançada', 'características arquitetônicas', 'memória local'],
  },
};
