
export interface WritingTask {
  id: string;
  type: '90-word' | '150-word' | 'translation';
  theme: string;
  prompt: string;
  bullets?: string[];
  marks: number;
  englishVersion?: string; // For translation tasks
  targetSample?: string; // For translation tasks (sample answer)
}

export interface WritingPaper {
  id: string;
  language: string;
  title: string;
  difficulty: 'foundation' | 'higher';
  theme?: string;
  tasks: WritingTask[];
}

export const WRITING_PROMPTS: Record<string, WritingPaper[]> = {
  spanish: [
    {
      id: "sp-w-1",
      language: "spanish",
      title: "GCSE Spanish Writing Paper 1",
      difficulty: "higher",
      theme: "SCHOOL_LIFE",
      tasks: [
        {
          id: "sp-t1",
          type: "90-word",
          theme: "School & Studies",
          prompt: "Your school magazine wants an article about your school life.",
          bullets: [
            "describe your typical school day",
            "give your opinion on your school uniform",
            "mention a school trip you went on recently",
            "explain what you would change about your school if you were the headteacher"
          ],
          marks: 16
        },
        {
          id: "sp-t2",
          type: "150-word",
          theme: "Holidays & Travel",
          prompt: "You are writing a blog post about your travel experiences and holiday plans.",
          bullets: [
            "how you prefer to spend holidays with your family and the reasons why",
            "a recent visit to an interesting city and what you did there"
          ],
          marks: 32
        },
        {
          id: "sp-t3",
          type: "translation",
          theme: "Home & Environment",
          marks: 12,
          prompt: "Translate the following passage into Spanish:",
          englishVersion: "I live in a small village in the mountains. It is very quiet and there is a lot of nature. Last year, I visited my grandparents who live in the city. Next summer, we are going to go to the beach together."
        }
      ]
    },
    {
      id: "sp-w-1-v2",
      language: "spanish",
      title: "GCSE Spanish Writing Paper 1 (Set B)",
      difficulty: "higher",
      theme: "SCHOOL_LIFE",
      tasks: [
        {
          id: "sp-t1-v2",
          type: "90-word",
          theme: "School & Studies",
          prompt: "Your school magazine wants an article about your school life.",
          bullets: [
            "describe your typical school day",
            "give your opinion on your school uniform",
            "mention a school trip you went on recently",
            "explain what you would change about your school if you were the headteacher"
          ],
          marks: 16
        },
        {
          id: "sp-t2-v2",
          type: "150-word",
          theme: "Holidays & Travel",
          prompt: "You are writing a blog post about your travel experiences and holiday plans.",
          bullets: [
            "how you prefer to spend holidays with your family and the reasons why",
            "a recent visit to an interesting city and what you did there"
          ],
          marks: 32
        },
        {
          id: "sp-t3-v2",
          type: "translation",
          theme: "Home & Environment",
          marks: 12,
          prompt: "Translate the following passage into Spanish:",
          englishVersion: "I live in a small village in the mountains. It is very quiet and there is a lot of nature. Last year, I visited my grandparents who live in the city. Next summer, we are going to go to the beach together."
        }
      ]
    },
    {
      id: "sp-w-2",
      language: "spanish",
      title: "GCSE Spanish Writing Paper 2",
      difficulty: "higher",
      theme: "HEALTH_TECH",
      tasks: [
        {
          id: "sp-w2-t1",
          type: "90-word",
          theme: "Technology & Media",
          prompt: "You are writing an article for a youth website about the use of technology.",
          bullets: [
            "your favourite social media and why you use it",
            "how you used the internet yesterday",
            "the advantages and disadvantages of video games",
            "how technology will change our lives in the future"
          ],
          marks: 16
        },
        {
          id: "sp-w2-t2",
          type: "150-word",
          theme: "Healthy Living",
          prompt: "You are writing an essay for your Spanish class about health and lifestyle.",
          bullets: [
            "the importance of a balanced diet and regular exercise",
            "what you did recently to stay in shape and your intentions for the future"
          ],
          marks: 32
        },
        {
          id: "sp-w2-t3",
          type: "translation",
          theme: "Future & Career",
          marks: 12,
          prompt: "Translate the following passage into Spanish:",
          englishVersion: "When I am older, I want to be a doctor. I think it is an important job because you can help people. Next week I am going to have a meeting with my teacher to discuss my options."
        }
      ]
    },
    {
      id: "sp-w-2-v2",
      language: "spanish",
      title: "GCSE Spanish Writing Paper 2 (Set B)",
      difficulty: "higher",
      theme: "HEALTH_TECH",
      tasks: [
        {
          id: "sp-w2-t1-v2",
          type: "90-word",
          theme: "Technology & Media",
          prompt: "You are writing an article for a youth website about the use of technology.",
          bullets: [
            "your favourite social media and why you use it",
            "how you used the internet yesterday",
            "the advantages and disadvantages of video games",
            "how technology will change our lives in the future"
          ],
          marks: 16
        },
        {
          id: "sp-w2-t2-v2",
          type: "150-word",
          theme: "Healthy Living",
          prompt: "You are writing an essay for your Spanish class about health and lifestyle.",
          bullets: [
            "the importance of a balanced diet and regular exercise",
            "what you did recently to stay in shape and your intentions for the future"
          ],
          marks: 32
        },
        {
          id: "sp-w2-t3-v2",
          type: "translation",
          theme: "Future & Career",
          marks: 12,
          prompt: "Translate the following passage into Spanish:",
          englishVersion: "When I am older, I want to be a doctor. I think it is an important job because you can help people. Next week I am going to have a meeting with my teacher to discuss my options."
        }
      ]
    }
  ],
  french: [
    {
      id: "fr-w-1",
      language: "french",
      title: "GCSE French Writing Paper 1 (Higher Tier)",
      difficulty: "higher",
      theme: "ENV_FUTURE",
      tasks: [
        {
          id: "fr-t1",
          type: "90-word",
          theme: "Environment",
          prompt: "Your town council is asking for opinions on local environmental issues. Write a report.",
          bullets: [
            "mention the main ecological problems in your region",
            "what you and your family do to recycle and save energy",
            "describe a recent project or event in your town to help the environment",
            "explain why you think young people should do more for the planet"
          ],
          marks: 16
        },
        {
          id: "fr-t2",
          type: "150-word",
          theme: "Future Plans",
          prompt: "You are writing an article for a French magazine about your future education and career plans.",
          bullets: [
            "your ideal career and the reasons for your choice",
            "the importance of learning foreign languages and whether you would like to work in another country"
          ],
          marks: 32
        },
        {
          id: "fr-t3",
          type: "translation",
          theme: "Social & Free Time",
          marks: 12,
          prompt: "Translate the following passage into French:",
          englishVersion: "I love going to the cinema with my friends on Saturdays. Usually, we watch comedies because they are funny. Last weekend, I stayed at home and read a book. It was very relaxing but a bit boring."
        }
      ]
    },
    {
      id: "fr-w-1-v2",
      language: "french",
      title: "GCSE French Writing Paper 1 (Higher Tier) (Set B)",
      difficulty: "higher",
      theme: "ENV_FUTURE",
      tasks: [
        {
          id: "fr-t1-v2",
          type: "90-word",
          theme: "Environment",
          prompt: "Your town council is asking for opinions on local environmental issues. Write a report.",
          bullets: [
            "mention the main ecological problems in your region",
            "what you and your family do to recycle and save energy",
            "describe a recent project or event in your town to help the environment",
            "explain why you think young people should do more for the planet"
          ],
          marks: 16
        },
        {
          id: "fr-t2-v2",
          type: "150-word",
          theme: "Future Plans",
          prompt: "You are writing an article for a French magazine about your future education and career plans.",
          bullets: [
            "your ideal career and the reasons for your choice",
            "the importance of learning foreign languages and whether you would like to work in another country"
          ],
          marks: 32
        },
        {
          id: "fr-t3-v2",
          type: "translation",
          theme: "Social & Free Time",
          marks: 12,
          prompt: "Translate the following passage into French:",
          englishVersion: "I love going to the cinema with my friends on Saturdays. Usually, we watch comedies because they are funny. Last weekend, I stayed at home and read a book. It was very relaxing but a bit boring."
        }
      ]
    }
  ],
  german: [
    {
      id: "de-w-1",
      language: "german",
      title: "GCSE German Writing Paper 1 (Higher Tier)",
      difficulty: "higher",
      theme: "HEALTH_CULTURE",
      tasks: [
        {
          id: "de-t1",
          type: "90-word",
          theme: "Healthy Living",
          prompt: "Sie schreiben einen Artikel für ein deutsches Jugendmagazin über Gesundheit.",
          bullets: [
            "was Sie normalerweise essen und trinken",
            "Ihre Meinung über Fitness und Sport",
            "was Sie letzte Woche gemacht haben, um gesund zu bleiben",
            "warum ein gesundes Leben für Jugendliche wichtig ist"
          ],
          marks: 16
        },
        {
          id: "de-t2",
          type: "150-word",
          theme: "Identity & Culture",
          prompt: "Ein Freund aus Deutschland hat Sie gefragt, wie Sie Ihre Freizeit verbringen. Schreiben Sie eine E-Mail.",
          bullets: [
            "Ihre Hobbys und warum sie Ihnen gefallen",
            "ein kulturelles Ereignis oder Fest, das Sie vor Kurzem besucht haben"
          ],
          marks: 32
        },
        {
          id: "de-t3",
          type: "translation",
          theme: "Global Issues",
          marks: 12,
          prompt: "Übersetzen Sie den folgenden Text ins Deutsche:",
          englishVersion: "Next year, I want to travel to Spain to learn more about the culture. I think it is important to understand other people. In my town, there is a lot of unemployment, and that is a major problem for the future."
        }
      ]
    },
    {
      id: "de-w-1-v2",
      language: "german",
      title: "GCSE German Writing Paper 1 (Higher Tier) (Set B)",
      difficulty: "higher",
      theme: "HEALTH_CULTURE",
      tasks: [
        {
          id: "de-t1-v2",
          type: "90-word",
          theme: "Healthy Living",
          prompt: "Sie schreiben einen Artikel für ein deutsches Jugendmagazin über Gesundheit.",
          bullets: [
            "was Sie normalerweise essen und trinken",
            "Ihre Meinung über Fitness und Sport",
            "was Sie letzte Woche gemacht haben, um gesund zu bleiben",
            "warum ein gesundes Leben für Jugendliche wichtig ist"
          ],
          marks: 16
        },
        {
          id: "de-t2-v2",
          type: "150-word",
          theme: "Identity & Culture",
          prompt: "Ein Freund aus Deutschland hat Sie gefragt, wie Sie Ihre Freizeit verbringen. Schreiben Sie eine E-Mail.",
          bullets: [
            "Ihre Hobbys und warum sie Ihnen gefallen",
            "ein kulturelles Ereignis oder Fest, das Sie vor Kurzem besucht haben"
          ],
          marks: 32
        },
        {
          id: "de-t3-v2",
          type: "translation",
          theme: "Global Issues",
          marks: 12,
          prompt: "Übersetzen Sie den folgenden Text ins Deutsche:",
          englishVersion: "Next year, I want to travel to Spain to learn more about the culture. I think it is important to understand other people. In my town, there is a lot of unemployment, and that is a major problem for the future."
        }
      ]
    }
  ],
  arabic: [
    {
      id: "ar-w-1",
      language: "arabic",
      title: "GCSE Arabic Writing Paper 1 (Higher Tier)",
      difficulty: "higher",
      theme: "PERSONAL_TRAVEL",
      tasks: [
        {
          id: "ar-t1",
          type: "90-word",
          theme: "My Personal World",
          prompt: "Write an article for a youth magazine about your family and friends.",
          bullets: [
            "describe your family members",
            "what you like to do with your friends",
            "a recent event you celebrated with your family",
            "why friendship is important to you"
          ],
          marks: 16
        },
        {
          id: "ar-t2",
          type: "150-word",
          theme: "Travel & Tourism",
          prompt: "You are writing a blog post about your last holiday and your future travel plans.",
          bullets: [
            "a visit to an interesting place and what you saw there",
            "your opinion on travelling to another country and the reasons why"
          ],
          marks: 32
        },
        {
          id: "ar-t3",
          type: "translation",
          theme: "Environment",
          marks: 12,
          prompt: "Translate the following passage into Arabic:",
          englishVersion: "I think that protecting the environment is a global problem. At home, we always recycle paper and glass. Next month, I am going to participate in a beach cleaning event with my friends. It is important to look after our nature."
        }
      ]
    },
    {
      id: "ar-w-1-v2",
      language: "arabic",
      title: "GCSE Arabic Writing Paper 1 (Higher Tier) (Set B)",
      difficulty: "higher",
      theme: "PERSONAL_TRAVEL",
      tasks: [
        {
          id: "ar-t1-v2",
          type: "90-word",
          theme: "My Personal World",
          prompt: "Write an article for a youth magazine about your family and friends.",
          bullets: [
            "describe your family members",
            "what you like to do with your friends",
            "a recent event you celebrated with your family",
            "why friendship is important to you"
          ],
          marks: 16
        },
        {
          id: "ar-t2-v2",
          type: "150-word",
          theme: "Travel & Tourism",
          prompt: "You are writing a blog post about your last holiday and your future travel plans.",
          bullets: [
            "a visit to an interesting place and what you saw there",
            "your opinion on travelling to another country and the reasons why"
          ],
          marks: 32
        },
        {
          id: "ar-t3-v2",
          type: "translation",
          theme: "Environment",
          marks: 12,
          prompt: "Translate the following passage into Arabic:",
          englishVersion: "I think that protecting the environment is a global problem. At home, we always recycle paper and glass. Next month, I am going to participate in a beach cleaning event with my friends. It is important to look after our nature."
        }
      ]
    }
  ],
  hebrew: [
    {
      id: "he-w-1",
      language: "hebrew",
      title: "GCSE Modern Hebrew Writing Paper 1 (Higher Tier)",
      difficulty: "higher",
      theme: "SCHOOL_FUTURE",
      tasks: [
        {
          id: "he-t1",
          type: "90-word",
          theme: "School Life",
          prompt: "Write a report for your school website about your typical school day.",
          bullets: [
            "describe your favorite subject and why you like it",
            "your opinion on school uniform",
            "a school trip you enjoyed recently",
            "what you would like to change in your school"
          ],
          marks: 16
        },
        {
          id: "he-t2",
          type: "150-word",
          theme: "Future Career",
          prompt: "You are writing an article for a Hebrew newspaper about your future education and career goals.",
          bullets: [
            "your ideal job and what you need to study for it",
            "the importance of working in a team and whether you want to work locally or abroad"
          ],
          marks: 32
        },
        {
          id: "he-t3",
          type: "translation",
          theme: "Technology",
          marks: 12,
          prompt: "Translate the following passage into Hebrew:",
          englishVersion: "I use my smartphone every day to talk to my friends and watch videos. Yesterday, I used the internet to help me with my homework. In the future, I believe that technology will change the way we live and work."
        }
      ]
    },
    {
      id: "he-w-1-v2",
      language: "hebrew",
      title: "GCSE Modern Hebrew Writing Paper 1 (Higher Tier) (Set B)",
      difficulty: "higher",
      theme: "SCHOOL_FUTURE",
      tasks: [
        {
          id: "he-t1-v2",
          type: "90-word",
          theme: "School Life",
          prompt: "Write a report for your school website about your typical school day.",
          bullets: [
            "describe your favorite subject and why you like it",
            "your opinion on school uniform",
            "a school trip you enjoyed recently",
            "what you would like to change in your school"
          ],
          marks: 16
        },
        {
          id: "he-t2-v2",
          type: "150-word",
          theme: "Future Career",
          prompt: "You are writing an article for a Hebrew newspaper about your future education and career goals.",
          bullets: [
            "your ideal job and what you need to study for it",
            "the importance of working in a team and whether you want to work locally or abroad"
          ],
          marks: 32
        },
        {
          id: "he-t3-v2",
          type: "translation",
          theme: "Technology",
          marks: 12,
          prompt: "Translate the following passage into Hebrew:",
          englishVersion: "I use my smartphone every day to talk to my friends and watch videos. Yesterday, I used the internet to help me with my homework. In the future, I believe that technology will change the way we live and work."
        }
      ]
    }
  ]
};
