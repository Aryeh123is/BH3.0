export const FRENCH_THEMES = [
  { id: 'theme-1-my-personal-world', title: 'Mon Monde Personnel' },
  { id: 'theme-2-lifestyle', title: 'Mode de Vie & Bien-être' },
  { id: 'theme-3-neighbourhood', title: 'Mon Quartier' },
  { id: 'theme-4-media-tech', title: 'Médias & Technologie' },
  { id: 'theme-5-studying-future', title: 'Études & Mon Avenir' },
  { id: 'theme-6-travel', title: 'Voyages & Tourisme' },
];

export const MOCK_FRENCH_READ_ALOUDS = [
  {
    id: 'ra-fr-1',
    themeId: 'theme-1-my-personal-world',
    language: 'French',
    passageText: 'Ma famille et moi habitons dans un petit village, bien que je doive dire que c\'est parfois un peu ennuyeux pour les jeunes. Hier, je suis allé au centre sportif avec mes amis et après nous avons dîné dans mon restaurant préféré. À l\'avenir, j\'aimerais habiter dans une grande ville parce qu\'il y a plus de choses à faire.',
    followUpQuestionIds: ['conv-fr-1', 'conv-fr-2']
  },
  {
    id: 'ra-fr-6',
    themeId: 'theme-6-travel',
    language: 'French',
    passageText: 'L\'été dernier, j\'ai voyagé à Paris avec ma famille et nous avons passé un excellent moment là-bas. Nous avons visité beaucoup de monuments historiques au centre de la ville et nous avons aussi mangé de la nourriture typique de la région. À l\'avenir, je veux y retourner avec mes amis parce que la ville était très amusante.',
    followUpQuestionIds: ['conv-fr-7', 'conv-fr-8']
  }
];

export const MOCK_FRENCH_ROLEPLAYS = [
  {
    id: 'rp-fr-1',
    themeId: 'theme-1-my-personal-world',
    language: 'French',
    scenarioPrompt: 'Vous parlez à votre correspondant français de votre famille et de vos amis.',
    studentRole: 'Vous-même',
    examinerRole: 'Correspondant français',
    prompts: [
      { id: 'p1', text: 'Décrivez votre meilleur(e) ami(e).', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p2', text: 'Expliquez ce que vous avez fait avec vos amis le week-end dernier.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p3', text: '!', isUnpredictable: true, isQuestionToExaminer: false },
      { id: 'p4', text: 'Mentionnez un petit problème que vous avez eu avec votre famille.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p5', text: 'Posez une question sur les projets de votre ami(e).', isUnpredictable: false, isQuestionToExaminer: true }
    ]
  }
];

export const MOCK_FRENCH_PHOTO_CARDS = [
  {
    id: 'pc-fr-1a',
    themeId: 'theme-1-my-personal-world',
    language: 'French',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    studentPrompts: ['Décrivez la photo.'],
    examinerPrompts: [
      'Décrivez la photo.', 
      'Pensez-vous que se marier est une tradition importante aujourd\'hui ?',
      'Que fêterez-vous avec votre famille l\'année prochaine ?'
    ],
    followUpQuestionIds: []
  }
];

export const MOCK_FRENCH_CONVERSATION = [
  { id: 'conv-fr-1', themeId: 'theme-1-my-personal-world', language: 'French', questionText: 'Est-ce que tu t\'entends bien avec ta famille ?' },
  { id: 'conv-fr-2', themeId: 'theme-1-my-personal-world', language: 'French', questionText: 'Qu\'est-ce que tu as fait le week-end dernier avec ta famille ?' },
  { id: 'conv-fr-7', themeId: 'theme-6-travel', language: 'French', questionText: 'Où es-tu allé en vacances l\'année dernière ?' },
  { id: 'conv-fr-8', themeId: 'theme-6-travel', language: 'French', questionText: 'Préfères-tu les vacances à la plage ou en ville ?' }
];
