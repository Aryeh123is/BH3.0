import { SpeakingPaper } from '../types/speaking-engine';

export const SPEAKING_PAPERS: Record<string, SpeakingPaper[]> = {
  spanish: [
    {
      id: "es-paper-1",
      language: "Spanish",
      title: "Spanish Speaking Paper 1",
      tier: "Higher",
      schemaId: "edexcel-spanish-higher",
      items: {
        readAloudId: "ra-es-1",
        roleplayId: "rp-es-1",
        photoCardOptionIds: [
          "pc-es-1",
          "pc-es-2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "es-paper-1-v2",
      language: "Spanish",
      title: "Spanish Speaking Paper 1 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-spanish-higher",
      items: {
        readAloudId: "ra-es-1-v2",
        roleplayId: "rp-es-1-v2",
        photoCardOptionIds: [
          "pc-es-1-v2",
          "pc-es-2-v2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "es-paper-2",
      language: "Spanish",
      title: "Spanish Speaking Paper 2",
      tier: "Higher",
      schemaId: "edexcel-spanish-higher",
      items: {
        readAloudId: "ra-es-3",
        roleplayId: "rp-es-2",
        photoCardOptionIds: [
          "pc-es-3",
          "pc-es-4"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    },
    {
      id: "es-paper-2-v2",
      language: "Spanish",
      title: "Spanish Speaking Paper 2 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-spanish-higher",
      items: {
        readAloudId: "ra-es-3-v2",
        roleplayId: "rp-es-2-v2",
        photoCardOptionIds: [
          "pc-es-3-v2",
          "pc-es-4-v2"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    }
  ],
  french: [
    {
      id: "fr-paper-1",
      language: "French",
      title: "French Speaking Paper 1",
      tier: "Higher",
      schemaId: "edexcel-french-higher",
      items: {
        readAloudId: "ra-fr-1",
        roleplayId: "rp-fr-1",
        photoCardOptionIds: [
          "pc-fr-1",
          "pc-fr-2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-3-school"
        ]
      }
    },
    {
      id: "fr-paper-1-v2",
      language: "French",
      title: "French Speaking Paper 1 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-french-higher",
      items: {
        readAloudId: "ra-fr-1-v2",
        roleplayId: "rp-fr-1-v2",
        photoCardOptionIds: [
          "pc-fr-1-v2",
          "pc-fr-2-v2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-3-school"
        ]
      }
    },
    {
      id: "fr-paper-2",
      language: "French",
      title: "French Speaking Paper 2",
      tier: "Higher",
      schemaId: "edexcel-french-higher",
      items: {
        readAloudId: "ra-fr-7",
        roleplayId: "rp-fr-8",
        photoCardOptionIds: [
          "pc-fr-8",
          "pc-fr-2"
        ],
        conversationThemes: [
          "theme-2-leisure",
          "theme-4-future-plans"
        ]
      }
    },
    {
      id: "fr-paper-2-v2",
      language: "French",
      title: "French Speaking Paper 2 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-french-higher",
      items: {
        readAloudId: "ra-fr-7-v2",
        roleplayId: "rp-fr-8-v2",
        photoCardOptionIds: [
          "pc-fr-8-v2",
          "pc-fr-2-v2"
        ],
        conversationThemes: [
          "theme-2-leisure",
          "theme-4-future-plans"
        ]
      }
    }
  ],
  german: [
    {
      id: "de-paper-1",
      language: "German",
      title: "German Speaking Paper 1",
      tier: "Higher",
      schemaId: "edexcel-german-higher",
      items: {
        readAloudId: "ra-de-1",
        roleplayId: "rp-de-1",
        photoCardOptionIds: [
          "pc-de-8",
          "pc-de-1"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "de-paper-1-v2",
      language: "German",
      title: "German Speaking Paper 1 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-german-higher",
      items: {
        readAloudId: "ra-de-1-v2",
        roleplayId: "rp-de-1-v2",
        photoCardOptionIds: [
          "pc-de-8-v2",
          "pc-de-1-v2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "de-paper-2",
      language: "German",
      title: "German Speaking Paper 2",
      tier: "Higher",
      schemaId: "edexcel-german-higher",
      items: {
        readAloudId: "ra-de-5",
        roleplayId: "rp-de-8",
        photoCardOptionIds: [
          "pc-de-3",
          "pc-de-4"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    },
    {
      id: "de-paper-2-v2",
      language: "German",
      title: "German Speaking Paper 2 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-german-higher",
      items: {
        readAloudId: "ra-de-5-v2",
        roleplayId: "rp-de-8-v2",
        photoCardOptionIds: [
          "pc-de-3-v2",
          "pc-de-4-v2"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    }
  ],
  arabic: [
    {
      id: "ar-paper-1",
      language: "Arabic",
      title: "Arabic Speaking Paper 1",
      tier: "Higher",
      schemaId: "edexcel-arabic-higher",
      items: {
        readAloudId: "ra-ar-1",
        roleplayId: "rp-ar-1",
        photoCardOptionIds: [
          "pc-ar-8",
          "pc-ar-1"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "ar-paper-1-v2",
      language: "Arabic",
      title: "Arabic Speaking Paper 1 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-arabic-higher",
      items: {
        readAloudId: "ra-ar-1-v2",
        roleplayId: "rp-ar-1-v2",
        photoCardOptionIds: [
          "pc-ar-8-v2",
          "pc-ar-1-v2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "ar-paper-2",
      language: "Arabic",
      title: "Arabic Speaking Paper 2",
      tier: "Higher",
      schemaId: "edexcel-arabic-higher",
      items: {
        readAloudId: "ra-ar-5",
        roleplayId: "rp-ar-8",
        photoCardOptionIds: [
          "pc-ar-3",
          "pc-ar-4"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    },
    {
      id: "ar-paper-2-v2",
      language: "Arabic",
      title: "Arabic Speaking Paper 2 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-arabic-higher",
      items: {
        readAloudId: "ra-ar-5-v2",
        roleplayId: "rp-ar-8-v2",
        photoCardOptionIds: [
          "pc-ar-3-v2",
          "pc-ar-4-v2"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    }
  ],
  hebrew: [
    {
      id: "he-paper-1",
      language: "Hebrew",
      title: "Modern Hebrew Speaking Paper 1",
      tier: "Higher",
      schemaId: "edexcel-hebrew-higher",
      items: {
        readAloudId: "ra-he-1",
        roleplayId: "rp-he-1",
        photoCardOptionIds: [
          "pc-he-8",
          "pc-he-1"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "he-paper-1-v2",
      language: "Hebrew",
      title: "Modern Hebrew Speaking Paper 1 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-hebrew-higher",
      items: {
        readAloudId: "ra-he-1-v2",
        roleplayId: "rp-he-1-v2",
        photoCardOptionIds: [
          "pc-he-8-v2",
          "pc-he-1-v2"
        ],
        conversationThemes: [
          "theme-1-my-personal-world",
          "theme-2-leisure"
        ]
      }
    },
    {
      id: "he-paper-2",
      language: "Hebrew",
      title: "Modern Hebrew Speaking Paper 2",
      tier: "Higher",
      schemaId: "edexcel-hebrew-higher",
      items: {
        readAloudId: "ra-he-5",
        roleplayId: "rp-he-8",
        photoCardOptionIds: [
          "pc-he-3",
          "pc-he-4"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    },
    {
      id: "he-paper-2-v2",
      language: "Hebrew",
      title: "Modern Hebrew Speaking Paper 2 (Set B)",
      tier: "Higher",
      schemaId: "edexcel-hebrew-higher",
      items: {
        readAloudId: "ra-he-5-v2",
        roleplayId: "rp-he-8-v2",
        photoCardOptionIds: [
          "pc-he-3-v2",
          "pc-he-4-v2"
        ],
        conversationThemes: [
          "theme-3-school",
          "theme-4-future-plans"
        ]
      }
    }
  ]
};
