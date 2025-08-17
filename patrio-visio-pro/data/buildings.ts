export interface Building {
  id: string;
  type: string;
  name: string;
  year: string;
  style: string;
  description: string;
  address: string;
  historicalValue: string;
  currentUse: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  architect?: string;
  constructionMaterials?: string[];
  historicalEvents?: string[];
}

export const buildingsData: Building[] = [
  {
    id: '1',
    type: 'casarão',
    name: 'Palacete dos Andradas',
    year: '1920',
    style: 'Art Nouveau',
    description: 'Majestoso palacete construído pela família Andradas, representando o auge da arquitetura Art Nouveau no Brasil. Suas fachadas ornamentadas e vitrais coloridos são testemunhas de uma época de grande opulência e sofisticação arquitetônica.',
    address: 'Rua das Flores, 123 - Centro Histórico',
    historicalValue: 'Alto',
    currentUse: 'Museu Municipal',
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    architect: 'Francisco de Paula Ramos de Azevedo',
    constructionMaterials: ['Pedra', 'Mármore', 'Madeira nobre', 'Ferro fundido'],
    historicalEvents: [
      '1920: Inauguração do palacete',
      '1930: Residência da família Andradas',
      '1980: Tombamento pelo patrimônio histórico',
      '2000: Conversão para museu'
    ]
  },
  {
    id: '2',
    type: 'casarão',
    name: 'Vila Modernista',
    year: '1935',
    style: 'Modernismo',
    description: 'Exemplo único da arquitetura modernista brasileira, esta vila representa a transição entre o estilo eclético e o moderno. Suas linhas limpas e integração com a natureza marcaram uma nova era na arquitetura residencial.',
    address: 'Avenida Paulista, 456 - Bela Vista',
    historicalValue: 'Médio-Alto',
    currentUse: 'Residencial',
    coordinates: {
      latitude: -23.5631,
      longitude: -46.6544
    },
    architect: 'Gregori Warchavchik',
    constructionMaterials: ['Concreto armado', 'Vidro', 'Aço', 'Madeira'],
    historicalEvents: [
      '1935: Construção da vila',
      '1950: Primeira exposição de arte moderna',
      '1970: Restauração e modernização',
      '1990: Inclusão no roteiro arquitetônico'
    ]
  },
  {
    id: '3',
    type: 'casarão',
    name: 'Solar dos Barões',
    year: '1890',
    style: 'Neoclássico',
    description: 'Imponente solar que serviu como residência de importantes barões do café. Sua arquitetura neoclássica com elementos barrocos reflete a influência europeia na arquitetura brasileira do século XIX.',
    address: 'Rua do Comércio, 789 - Sé',
    historicalValue: 'Alto',
    currentUse: 'Centro Cultural',
    coordinates: {
      latitude: -23.5489,
      longitude: -46.6388
    },
    architect: 'Desconhecido',
    constructionMaterials: ['Pedra de cantaria', 'Mármore italiano', 'Madeira de lei', 'Ouro'],
    historicalEvents: [
      '1890: Construção do solar',
      '1900: Residência dos barões do café',
      '1920: Abandono após crise do café',
      '1980: Restauração e abertura ao público'
    ]
  },
  {
    id: '4',
    type: 'casarão',
    name: 'Chácara das Acácias',
    year: '1915',
    style: 'Eclético',
    description: 'Chácara urbana que combina elementos de diferentes estilos arquitetônicos, criando uma composição única e harmoniosa. Seus jardins e pomares eram famosos na região.',
    address: 'Rua das Acácias, 321 - Vila Madalena',
    historicalValue: 'Médio',
    currentUse: 'Restaurante e Eventos',
    coordinates: {
      latitude: -23.5587,
      longitude: -46.6924
    },
    architect: 'Ramos de Azevedo',
    constructionMaterials: ['Tijolo aparente', 'Telha francesa', 'Madeira', 'Ferro'],
    historicalEvents: [
      '1915: Construção da chácara',
      '1940: Conversão em escola',
      '1970: Abandono e degradação',
      '2005: Restauração e nova função'
    ]
  },
  {
    id: '5',
    type: 'casarão',
    name: 'Palacete das Artes',
    year: '1925',
    style: 'Art Déco',
    description: 'Elegante palacete em estilo Art Déco, com suas formas geométricas e decoração luxuosa. Representa a influência francesa na arquitetura brasileira dos anos 1920.',
    address: 'Rua Augusta, 654 - Consolação',
    historicalValue: 'Alto',
    currentUse: 'Galeria de Arte',
    coordinates: {
      latitude: -23.5517,
      longitude: -46.6614
    },
    architect: 'Victor Dubugras',
    constructionMaterials: ['Concreto', 'Mármore', 'Bronze', 'Vidro colorido'],
    historicalEvents: [
      '1925: Inauguração do palacete',
      '1930: Residência de artistas',
      '1960: Funcionamento como ateliê',
      '1990: Conversão em galeria'
    ]
  }
];

export const getBuildingById = (id: string): Building | undefined => {
  return buildingsData.find(building => building.id === id);
};

export const searchBuildings = (query: string): Building[] => {
  const lowercaseQuery = query.toLowerCase();
  return buildingsData.filter(building => 
    building.name.toLowerCase().includes(lowercaseQuery) ||
    building.address.toLowerCase().includes(lowercaseQuery) ||
    building.style.toLowerCase().includes(lowercaseQuery)
  );
};
