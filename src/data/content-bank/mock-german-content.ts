export const GERMAN_THEMES = [
  { id: 'theme-1-my-personal-world', title: 'Meine persönliche Welt' },
  { id: 'theme-2-lifestyle', title: 'Lebensstil & Wohlbefinden' },
  { id: 'theme-3-neighbourhood', title: 'Meine Nachbarschaft' },
  { id: 'theme-4-media-tech', title: 'Medien & Technologie' },
  { id: 'theme-5-studying-future', title: 'Studium & meine Zukunft' },
  { id: 'theme-6-travel', title: 'Reisen & Tourismus' },
];

export const MOCK_GERMAN_READ_ALOUDS = [
  {
    id: 'ra-ge-1',
    themeId: 'theme-1-my-personal-world',
    language: 'German',
    passageText: 'Meine Familie und ich wohnen in einem kleinen Dorf, obwohl ich sagen muss, dass es manchmal ein bisschen langweilig für junge Leute ist. Gestern bin ich mit meinen Freunden zum Sportzentrum gegangen und danach haben wir in meinem Lieblingsrestaurant gegessen. In der Zukunft möchte ich in einer großen Stadt wohnen, weil es dort mehr zu tun gibt.',
    followUpQuestionIds: ['conv-ge-1', 'conv-ge-2']
  }
];

export const MOCK_GERMAN_ROLEPLAYS = [
  {
    id: 'rp-ge-1',
    themeId: 'theme-1-my-personal-world',
    language: 'German',
    scenarioPrompt: 'Du sprichst mit deinem deutschen Austauschpartner über deine Familie und Freunde.',
    studentRole: 'Du selbst',
    examinerRole: 'Deutscher Austauschpartner',
    prompts: [
      { id: 'p1', text: 'Beschreibe deinen besten Freund / deine beste Freundin.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p2', text: 'Erkläre, was du und deine Freunde am letzten Wochenende gemacht habt.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p3', text: '!', isUnpredictable: true, isQuestionToExaminer: false },
      { id: 'p4', text: 'Erwähne ein kleines Problem, das du mit deiner Familie hattest.', isUnpredictable: false, isQuestionToExaminer: false },
      { id: 'p5', text: 'Stelle eine Frage zu den Plänen deines Partners.', isUnpredictable: false, isQuestionToExaminer: true }
    ]
  }
];

export const MOCK_GERMAN_PHOTO_CARDS = [
  {
    id: 'pc-ge-1a',
    themeId: 'theme-1-my-personal-world',
    language: 'German',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    studentPrompts: ['Beschreibe das Foto.'],
    examinerPrompts: [
      'Beschreibe das Foto.', 
      'Glaubst du, dass Heiraten heutzutage eine wichtige Tradition ist?',
      'Was wirst du nächstes Jahr mit deiner Familie feiern?'
    ],
    followUpQuestionIds: []
  }
];

export const MOCK_GERMAN_CONVERSATION = [
  { id: 'conv-ge-1', themeId: 'theme-1-my-personal-world', language: 'German', questionText: 'Verstehst du dich gut mit deiner Familie?' },
  { id: 'conv-ge-2', themeId: 'theme-1-my-personal-world', language: 'German', questionText: 'Was hast du am letzten Wochenende mit deiner Familie gemacht?' }
];
