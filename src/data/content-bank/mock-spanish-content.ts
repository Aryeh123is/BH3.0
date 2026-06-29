export const EDEXCEL_THEMES = [
  { id: 'theme-1-my-personal-world', title: 'My Personal World' },
  { id: 'theme-2-lifestyle', title: 'Lifestyle & Wellbeing' },
  { id: 'theme-3-neighbourhood', title: 'My Neighbourhood' },
  { id: 'theme-4-media-tech', title: 'Media & Technology' },
  { id: 'theme-5-studying-future', title: 'Studying & My Future' },
  { id: 'theme-6-travel', title: 'Travel & Tourism' },
];

export const MOCK_SPANISH_READ_ALOUDS = [
  {
    id: 'ra-sp-1',
    themeId: 'theme-1-my-personal-world',
    language: 'Spanish',
    passageText: 'Mi familia y yo vivimos en un pueblo pequeño, aunque debo decir que a veces es un poco aburrido para los jóvenes. Ayer fui al polideportivo con mis amigos y después cenamos en mi restaurante favorito. En el futuro, me gustaría vivir en una ciudad grande porque hay más cosas que hacer.',
    followUpQuestionIds: ['conv-sp-1', 'conv-sp-2']
  },
  {
    id: 'ra-sp-6',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    passageText: 'El verano pasado viajé a Valencia con mi familia y lo pasamos muy bien allí. Visitamos muchos monumentos históricos en el centro de la ciudad y también comimos comida típica de la región. En el futuro, quiero volver con mis amigos porque la ciudad era muy divertida.',
    followUpQuestionIds: ['conv-sp-7', 'conv-sp-8']
  }
];

export const MOCK_SPANISH_ROLEPLAYS = [
  {
    id: 'rp-sp-1',
    themeId: 'theme-1-my-personal-world',
    language: 'Spanish',
    scenarioPrompt: 'You are talking to your Spanish exchange partner about your family and friends.',
    studentRole: 'Yourself',
    examinerRole: 'Spanish exchange partner',
    prompts: [
      { id: 'p1', text: 'Describe cómo es tu mejor amigo/a físicamente.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p2', text: 'Explica qué hicisteis tú y tus amigos el fin de semana.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p3', text: '!', isUnpredictable: true, isQuestionToExaminer: false },
      { id: 'p4', text: 'Menciona un pequeño problema que tuviste con tu familia.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p5', text: 'Haz una pregunta sobre los planes de tu amigo.', isUnpredictable: false, isQuestionToExaminer: true }
    ]
  },
  {
    id: 'rp-sp-6',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    scenarioPrompt: 'You are at an airport check-in desk in Spain trying to resolve a flight issue.',
    studentRole: 'Passenger',
    examinerRole: 'Airport Staff',
    prompts: [
      { id: 'p1', text: 'Explica adónde viajas hoy y con quién.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p2', text: 'Di qué hiciste en España durante las vacaciones.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p3', text: '!', isUnpredictable: true, isQuestionToExaminer: false },
      { id: 'p4', text: 'Explica el problema que tienes con tu pasaporte o billete.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p5', text: 'Pregunte a qué hora sale el próximo avión.', isUnpredictable: false, isQuestionToExaminer: true }
    ]
  }
];

export const MOCK_SPANISH_PHOTO_CARDS = [
  {
    id: 'pc-sp-1a',
    themeId: 'theme-1-my-personal-world',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Crees que casarse es una tradición importante hoy en día?',
      '¿Qué celebrarás con tu familia el año que viene?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-1b',
    themeId: 'theme-1-my-personal-world',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      'En tu opinión, ¿cuáles son las ventajas de viajar con amigos?',
      '¿Cuáles son tus planes para salir con amigos este fin de semana?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-1',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1493134630718-281b217c16a0',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Por qué a muchas personas les gusta viajar en avión?',
      '¿Qué vas a hacer durante tus futuras vacaciones en el extranjero?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-2',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Te gusta alojarte en hoteles grandes cuando vas de viaje?',
      '¿Cómo organizarás tu próximo viaje a España?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-3',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Es una buena idea comprar recuerdos en las tiendas del aeropuerto?',
      '¿Dónde comprarás regalos para tu familia cuando vayas a Valencia?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-4',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1441701391523-7a916327310e',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Qué hiciste durante tu última excursión con tu colegio?',
      '¿Qué medio de transporte vas a utilizar en tu próxima excursión?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-5',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Te gustaría tener un trabajo en el aeropuerto en el futuro?',
      '¿Qué ventajas tiene trabajar en otro país?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-6',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Qué problema puedes tener durante un viaje en invierno?',
      '¿Qué harás si llegas muy tarde a tu próximo vuelo?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-7',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Para qué tipo de viajes prefieres utilizar el tren o el autobús?',
      '¿Qué harás para no aburrirte si tienes que hacer un viaje largo en tren?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-8',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Disfrutas de comer probar platos locales cuando estás de vacaciones?',
      '¿A qué tipo de restaurante irás durante tus vacaciones de verano?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-9',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿Por qué las zonas de playa son tan típicas durante los veranos?',
      '¿Qué vas a hacer si hace mucho frío y llueve durante todo el viaje?'
    ],
    followUpQuestionIds: []
  },
  {
    id: 'pc-sp-air-10',
    themeId: 'theme-6-travel',
    language: 'Spanish',
    imageUrl: 'https://images.unsplash.com/photo-1464014393702-04195ebd75b1',
    studentPrompts: ['Describe la foto.'],
    examinerPrompts: [
      'Describe la foto.', 
      '¿En qué medida crees que ayudar en la naturaleza es importante?',
      '¿Qué vas a reciclar en casa después de estas vacaciones turísticas?'
    ],
    followUpQuestionIds: []
  }
];

export const MOCK_SPANISH_CONVERSATION = [
  { id: 'conv-sp-1', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: '¿Te llevas bien con tu familia?' },
  { id: 'conv-sp-2', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: '¿Qué hiciste el fin de semana pasado con tu familia?' },
  { id: 'conv-sp-3', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: 'En tu opinión, ¿es importante casarse?' },
  { id: 'conv-sp-4', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: '¿Cómo sería tu pareja ideal?' },
  { id: 'conv-sp-5', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: '¿Qué vas a hacer con tus amigos este fin de semana?' },
  { id: 'conv-sp-6', themeId: 'theme-1-my-personal-world', language: 'Spanish', questionText: '¿Prefieres salir con amigos o estar con tu familia? ¿Por qué?' },
  
  // Theme 6
  { id: 'conv-sp-7', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Adónde fuiste de vacaciones el año pasado?' },
  { id: 'conv-sp-8', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Prefieres las vacaciones en la playa o en la ciudad?' },
  { id: 'conv-sp-9', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Qué es lo mejor de viajar?' },
  { id: 'conv-sp-10', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Has visitado España alguna vez?' },
  { id: 'conv-sp-11', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Cómo prefieres viajar?' },
  { id: 'conv-sp-12', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Qué hiciste durante tus últimas vacaciones?' },
  { id: 'conv-sp-13', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Adónde irás el próximo verano?' },
  { id: 'conv-sp-14', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Es importante aprender otros idiomas? ¿Por qué?' },
  { id: 'conv-sp-15', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Qué impacto tiene el turismo en el medio ambiente?' },
  { id: 'conv-sp-16', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Te gustaría ir a Sudamérica en el futuro?' },
  { id: 'conv-sp-17', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Qué es lo más interesante de tu país?' },
  { id: 'conv-sp-18', themeId: 'theme-6-travel', language: 'Spanish', questionText: '¿Prefieres alojarte en un hotel o en un camping?' }
];
