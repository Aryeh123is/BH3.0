
import { TaskType } from '../types/speaking-engine';

export interface SpeakingTemplate {
  id: string;
  themeId: string;
  type: TaskType;
  // English versions that will be translated or looked up
  en: {
    title: string;
    description?: string;
    studentPrompts?: string[];
    examinerPrompts?: string[];
    passageText?: string;
    scenarioPrompt?: string;
    studentRole?: string;
    examinerRole?: string;
    roleplayPrompts?: { text: string; isUnpredictable: boolean; isQuestionToExaminer: boolean }[];
    conversationQuestions?: string[];
    imageUrl?: string;
  };
  // Translations for specific languages if we have them pre-calculated
  translations?: Record<string, any>;
}

export const SPEAKING_TEMPLATES: SpeakingTemplate[] = [
  // --- THEME 1: My Personal World ---
  {
    id: 'tpl-1-pc-1',
    themeId: 'theme-1-my-personal-world',
    type: 'photo_card',
    en: {
      title: 'Family Celebration',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'Do you think getting married is an important tradition nowadays?',
        'What will you celebrate with your family next year?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.',
          '¿Crees que casarse es una tradición importante hoy en día?',
          '¿Qué celebrarás con tu familia el año que viene?'
        ]
      },
      'French': {
        examinerPrompts: [
          'Décris la photo.',
          'Penses-tu que se marier est une tradition importante de nos jours ?',
          'Que fêteras-tu avec ta famille l\'année prochaine ?'
        ]
      }
    }
  },
  {
    id: 'tpl-1-pc-2',
    themeId: 'theme-1-my-personal-world',
    type: 'photo_card',
    en: {
      title: 'Friends Together',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'In your opinion, what are the advantages of travelling with friends?',
        'What are your plans for going out with friends this weekend?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.', 
          'En tu opinión, ¿cuáles son las ventajas de viajar con amigos?',
          '¿Cuáles son tus planes para salir con amigos este fin de semana?'
        ]
      }
    }
  },
  {
    id: 'tpl-1-rp-1',
    themeId: 'theme-1-my-personal-world',
    type: 'roleplay',
    en: {
      title: 'Talking to a Friend',
      scenarioPrompt: 'You are talking to your exchange partner about your family and friends.',
      studentRole: 'Yourself',
      examinerRole: 'Exchange partner',
      roleplayPrompts: [
        { text: 'Describe what your best friend is like physically.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: 'Explain what you and your friends did at the weekend.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: '!', isUnpredictable: true, isQuestionToExaminer: false },
        { text: 'Mention a small problem you had with your family.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: 'Ask a question about your friend\'s plans.', isUnpredictable: false, isQuestionToExaminer: true }
      ]
    },
    translations: {
      'Spanish': {
        scenarioPrompt: 'Estás hablando con tu compañero de intercambio sobre tu familia y amigos.',
        roleplayPrompts: [
          { text: 'Describe cómo es tu mejor amigo/a físicamente.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: 'Explica qué hicisteis tú y tus amigos el fin de semana.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: '!', isUnpredictable: true, isQuestionToExaminer: false },
          { text: 'Menciona un pequeño problema que tuviste con tu familia.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: 'Haz una pregunta sobre los planes de tu amigo.', isUnpredictable: false, isQuestionToExaminer: true }
        ]
      }
    }
  },

  // --- THEME 6: Travel & Tourism ---
  {
    id: 'tpl-6-pc-1',
    themeId: 'theme-6-travel',
    type: 'photo_card',
    en: {
      title: 'Airport Travel',
      imageUrl: 'https://images.unsplash.com/photo-1493134630718-281b217c16a0',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'Why do many people like to travel by plane?',
        'What are you going to do during your future holidays abroad?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.', 
          '¿Por qué a muchas personas les gusta viajar en avión?',
          '¿Qué vas a hacer durante tus futuras vacaciones en el extranjero?'
        ]
      }
    }
  },
  {
    id: 'tpl-6-rp-1',
    themeId: 'theme-6-travel',
    type: 'roleplay',
    en: {
      title: 'Airport Check-in',
      scenarioPrompt: 'You are at an airport check-in desk resolving a flight issue.',
      studentRole: 'Passenger',
      examinerRole: 'Airport Staff',
      roleplayPrompts: [
        { text: 'Explain where you are travelling today and with whom.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: 'Say what you did in the country during the holidays.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: '!', isUnpredictable: true, isQuestionToExaminer: false },
        { text: 'Explain the problem you have with your passport or ticket.', isUnpredictable: false, isQuestionToExaminer: false },
        { text: 'Ask what time the next plane leaves.', isUnpredictable: false, isQuestionToExaminer: true }
      ]
    },
    translations: {
      'Spanish': {
        scenarioPrompt: 'Estás en un mostrador de facturación del aeropuerto resolviendo un problema con un vuelo.',
        roleplayPrompts: [
          { text: 'Explica adónde viajas hoy y con quién.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: 'Di qué hiciste en España durante las vacaciones.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: '!', isUnpredictable: true, isQuestionToExaminer: false },
          { text: 'Explica el problema que tienes con tu pasaporte o billete.', isUnpredictable: false, isQuestionToExaminer: false },
          { text: 'Pregunte a qué hora sale el próximo avión.', isUnpredictable: false, isQuestionToExaminer: true }
        ]
      }
    }
  },
  {
    id: 'tpl-1-pc-3',
    themeId: 'theme-1-my-personal-world',
    type: 'photo_card',
    en: {
      title: 'Family Dinner',
      imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'Why is it important to spend time eating with your family?',
        'What are you going to do to celebrate your birthday next month?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.',
          '¿Por qué es importante pasar tiempo comiendo con tu familia?',
          '¿Qué vas a hacer para celebrar tu cumpleaños el mes que viene?'
        ]
      }
    }
  },
  {
    id: 'tpl-6-pc-2',
    themeId: 'theme-6-travel',
    type: 'photo_card',
    en: {
      title: 'City Sightseeing',
      imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'What are the advantages of visiting historic cities?',
        'Where would you like to travel for your next holiday?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.',
          '¿Cuáles son las ventajas de visitar ciudades históricas?',
          '¿Adónde te gustaría viajar para tus próximas vacaciones?'
        ]
      }
    }
  },
  {
    id: 'tpl-6-pc-3',
    themeId: 'theme-6-travel',
    type: 'photo_card',
    en: {
      title: 'Beach Holiday',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'Do you prefer beach holidays or adventuring in the mountains?',
        'What will you do if it rains during your next holiday?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.',
          '¿Prefieres las vacaciones de playa o la aventura en la montaña?',
          '¿Qué harás si llueve durante tus próximas vacaciones?'
        ]
      }
    }
  },
  {
    id: 'tpl-6-pc-4',
    themeId: 'theme-6-travel',
    type: 'photo_card',
    en: {
      title: 'Staying in a Hotel',
      imageUrl: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84',
      studentPrompts: ['Describe the photo.'],
      examinerPrompts: [
        'Describe the photo.',
        'Do you like staying in big hotels when you go on a trip?',
        'How will you organize your next trip to another country?'
      ]
    },
    translations: {
      'Spanish': {
        examinerPrompts: [
          'Describe la foto.',
          '¿Te gusta alojarte en hoteles grandes cuando vas de viaje?',
          '¿Cómo organizarás tu próximo viaje a otro país?'
        ]
      }
    }
  }
];

export const GENERIC_CONVERSATION_QUESTIONS: Record<string, Record<string, string[]>> = {
  'theme-1-my-personal-world': {
    'en': [
      'Do you get on well with your family?',
      'What did you do last weekend with your family?',
      'In your opinion, is it important to get married?',
      'What would your ideal partner be like?',
      'What are you going to do with your friends this weekend?',
      'Do you prefer going out with friends or being with your family? Why?'
    ],
    'Spanish': [
      '¿Te llevas bien con tu familia?',
      '¿Qué hiciste el fin de semana pasado con tu familia?',
      'En tu opinión, ¿es importante casarse?',
      '¿Cómo sería tu pareja ideal?',
      '¿Qué vas a hacer con tus amigos este fin de semana?',
      '¿Prefieres salir con amigos o estar con tu familia? ¿Por qué?'
    ],
    'French': [
      'Tu t\'entends bien avec ta famille ?',
      'Qu\'est-ce que tu as fait le week-end dernier avec ta famille ?',
      'À ton avis, est-ce important de se marier ?',
      'Comment serait ton partenaire idéal ?',
      'Qu\'est-ce que tu vas faire avec tes amis ce week-end ?',
      'Préfères-tu sortir avec tes amis ou rester avec ta famille ? Pourquoi ?'
    ]
  },
  'theme-6-travel': {
    'en': [
      'Where did you go on holiday last year?',
      'Do you prefer holidays on the beach or in the city?',
      'What is the best thing about travelling?',
      'Have you ever visited another country?',
      'How do you prefer to travel?',
      'What did you do during your last holiday?',
      'Where will you go next summer?',
      'Is it important to learn other languages? Why?',
      'What impact does tourism have on the environment?',
      'Would you like to go to South America in the future?'
    ],
    'Spanish': [
      '¿Adónde fuiste de vacaciones el año pasado?',
      '¿Prefieres las vacaciones en la playa o en la ciudad?',
      '¿Qué es lo mejor de viajar?',
      '¿Has visitado otro país alguna vez?',
      '¿Cómo prefieres viajar?',
      '¿Qué hiciste durante tus últimas vacaciones?',
      '¿Adónde irás el próximo verano?',
      '¿Es importante aprender otros idiomas? ¿Por qué?',
      '¿Qué impacto tiene el turismo en el medio ambiente?',
      '¿Te gustaría ir a Sudamérica en el futuro?'
    ]
  }
};
