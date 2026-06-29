import { ReadingPaper } from '../../types/reading';

export const READING_PAPERS: ReadingPaper[] = [
  {
    id: "es-read-h-v385",
    paperCode: "1SP0/3H",
    language: "Spanish",
    tier: "higher",
    theme: "GLOBAL",
    title: "Paper 3: Reading (Higher Tier) - Social Issues & Environment",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-es",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English. Answer the questions in the spaces provided.",
        questions: [
          {
            id: "q1",
            type: "word_bank",
            prompt: "Q1: Complete the sentences about the school festival by choosing words from the bank.",
            marks: 3,
            options: [
              "history",
              "food",
              "weather",
              "music",
              "people"
            ],
            context: "El festival de música de mi instituto es muy famoso. Cada año vienen miles de personas para disfrutar de los conciertos al aire libre. Es un evento muy alegre.",
            subQuestions: [
              {
                id: "q1-1",
                type: "gap_fill",
                prompt: "The festival is well known for its...",
                marks: 1,
                acceptedAnswers: [
                  "music"
                ]
              },
              {
                id: "q1-2",
                type: "gap_fill",
                prompt: "The events take place...",
                marks: 1,
                acceptedAnswers: [
                  "outdoors",
                  "outside",
                  "in the open air"
                ]
              },
              {
                id: "q1-3",
                type: "gap_fill",
                prompt: "Large numbers of ... attend annually.",
                marks: 1,
                acceptedAnswers: [
                  "people"
                ]
              }
            ]
          },
          {
            id: "q2",
            type: "multiple_choice",
            prompt: "Q2: Choose the correct answer for each question based on Elena's experience.",
            marks: 5,
            context: "Elena trabaja como guía turística en Madrid. Le encanta explicar la historia antigua de los monumentos. *Glaseado: coating / icing.* Sin embargo, a veces el tráfico en el centro es horrible y llega tarde a casa, lo cual le molesta mucho.",
            subQuestions: [
              {
                id: "q2-1",
                type: "multiple_choice",
                prompt: "Where does Elena work?",
                marks: 1,
                options: [
                  "Barcelona",
                  "Madrid",
                  "Seville",
                  "Valencia"
                ],
                acceptedAnswers: [
                  "Madrid"
                ]
              },
              {
                id: "q2-2",
                type: "multiple_choice",
                prompt: "What specific aspect does she enjoy explaining?",
                marks: 1,
                options: [
                  "Nightlife",
                  "The history",
                  "Modern architecture",
                  "Restaurants"
                ],
                acceptedAnswers: [
                  "The history"
                ]
              },
              {
                id: "q2-3",
                type: "multiple_choice",
                prompt: "What is the main obstacle in her day?",
                marks: 1,
                options: [
                  "The weather",
                  "Language barrier",
                  "Traffic",
                  "Rude tourists"
                ],
                acceptedAnswers: [
                  "Traffic"
                ]
              },
              {
                id: "q2-4",
                type: "multiple_choice",
                prompt: "How does she react when she is delayed?",
                marks: 2,
                options: [
                  "She is happy",
                  "She is indifferent",
                  "She finds it annoying",
                  "She finds it restful"
                ],
                acceptedAnswers: [
                  "She finds it annoying"
                ]
              }
            ]
          },
          {
            id: "q3",
            type: "short_answer",
            prompt: "Q3: Mixed Comprehension - Modern Technology and Youth Habits.",
            marks: 7,
            context: "En la actualidad, muchos institutos españoles están intentando limitar el acceso a los teléfonos móviles. Los directores afirman que los estudiantes se distraen constantemente con las notificaciones. No obstante, algunos profesores argumentan que las tabletas táctiles son herramientas vitales para enseñar asignaturas como la geografía moderna y la economía, ya que permiten un acceso instantáneo a datos globales.",
            subQuestions: [
              {
                id: "q3-1",
                type: "short_answer",
                prompt: "What are many Spanish schools attempting to do?",
                marks: 2,
                acceptedAnswers: [
                  "Limit mobile phone access",
                  "Ban phones"
                ]
              },
              {
                id: "q3-2",
                type: "multiple_choice",
                prompt: "Why is this action being taken?",
                marks: 1,
                options: [
                  "Lack of budget",
                  "Cybersecurity",
                  "Constant distractions",
                  "Cheating"
                ],
                acceptedAnswers: [
                  "Constant distractions"
                ]
              },
              {
                id: "q3-3",
                type: "short_answer",
                prompt: "Which two specific subjects benefit from tablet use?",
                marks: 2,
                acceptedAnswers: [
                  "Modern Geography and Economics"
                ]
              },
              {
                id: "q3-4",
                type: "gap_fill",
                prompt: "Tablets are considered vital because they provide instant access to...",
                marks: 2,
                acceptedAnswers: [
                  "global data"
                ]
              }
            ]
          },
          {
            id: "q4",
            type: "short_answer",
            prompt: "Q4: Inference Task - Urban Transformation.",
            marks: 3,
            context: "Antes, nuestro barrio era insoportablemente ruidoso debido a la antigua fábrica de papel que dominaba el paisaje. Ahora, tras su cierre definitivo, el ayuntamiento ha construido un parque natural extenso. El aire es notablemente más puro y el silencio es ahora la norma.",
            subQuestions: [
              {
                id: "q4-1",
                type: "short_answer",
                prompt: "What was the primary cause of noise in the past?",
                marks: 1,
                acceptedAnswers: [
                  "The paper factory",
                  "A factory"
                ]
              },
              {
                id: "q4-2",
                type: "short_answer",
                prompt: "Give two details about the current state of the neighborhood.",
                marks: 2,
                acceptedAnswers: [
                  "It has a natural park and the air is purer",
                  "Purer air and more silence"
                ]
              }
            ]
          },
          {
            id: "q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about local recycling.",
            marks: 3,
            context: "En mi comunidad, reciclamos con rigor todo el plástico y el vidrio. Afortunadamente, disponemos de contenedores diferenciados por colores en cada esquina. La conciencia ecológica ha aumentado drásticamente entre los jóvenes este año, resultando en calles mucho más limpias.",
            options: [
              "Plastic is recycled strictly",
              "Glass is not recycled",
              "Colored bins are easily available",
              "Young people care more than before",
              "The streets are dirtier",
              "Bins are only in the city center",
              "Recycling is optional in this town",
              "Older people started the project"
            ],
            acceptedAnswers: [
              "Plastic is recycled strictly",
              "Colored bins are easily available",
              "Young people care more than before"
            ]
          },
          {
            id: "q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Begoña’s group.",
            marks: 4,
            context: "Begoña inició su labor de limpieza costera hace ya dos inviernos. Lo que empezó como un esfuerzo individual se ha transformado en una brigada de sesenta entusiastas. El trimestre que viene, su objetivo principal será la restauración de los senderos fluviales locales que han sufrido erosión.",
            subQuestions: [
              {
                id: "q5b-1",
                type: "short_answer",
                prompt: "When did she start her work (exact detail)?",
                marks: 1,
                acceptedAnswers: [
                  "Two winters ago"
                ]
              },
              {
                id: "q5b-2",
                type: "short_answer",
                prompt: "How many people are now in her brigade?",
                marks: 1,
                acceptedAnswers: [
                  "60",
                  "Sixty"
                ]
              },
              {
                id: "q5b-3",
                type: "short_answer",
                prompt: "What is the focus of their next project?",
                marks: 2,
                acceptedAnswers: [
                  "Restoration of local river paths",
                  "River trails"
                ]
              }
            ]
          },
          {
            id: "q6",
            type: "short_answer",
            prompt: "Q6: Condensed Reasoning - Public Transport Challenges.",
            marks: 5,
            context: "La red ferroviaria de alta velocidad en España goza de una reputación excelente por su puntualidad y velocidad extrema. No obstante, para los ciudadanos más jóvenes, el coste de los billetes sigue siendo un obstáculo prohibitivo. El gobierno propone ahora un subsidio para fomentar los viajes sostenibles durante el verano.",
            subQuestions: [
              {
                id: "q6-1",
                type: "short_answer",
                prompt: "What is the objective of the new government proposal?",
                marks: 2,
                acceptedAnswers: [
                  "Encourage sustainable travel during summer"
                ]
              },
              {
                id: "q6-2",
                type: "short_answer",
                prompt: "What are the two positive reputations of the train network?",
                marks: 2,
                acceptedAnswers: [
                  "Punctuality and extreme speed"
                ]
              },
              {
                id: "q6-3",
                type: "short_answer",
                prompt: "Why do young people struggle with these trains?",
                marks: 1,
                acceptedAnswers: [
                  "The cost is prohibitive",
                  "Expensive tickets"
                ]
              }
            ]
          },
          {
            id: "q7",
            type: "multiple_choice",
            prompt: "Q7: Visual Stimulus & Detail - Mountaineering Incident.",
            marks: 5,
            context: "Anoche sufrimos una tormenta gélida que cubrió el valle de blanco. Aunque el riesgo de avalanchas era elevado, algunos excursionistas inexpertos intentaron subir al pico sin el equipo necesario. Los servicios de rescate tuvieron que intervenir de madrugada, lo cual subraya la importancia de respetar las advertencias meteorológicas.",
            subQuestions: [
              {
                id: "q7-1",
                type: "multiple_choice",
                prompt: "What was the specific danger mentioned in the text?",
                marks: 2,
                options: [
                  "High winds",
                  "Avalanches",
                  "Flooding",
                  "Fog"
                ],
                acceptedAnswers: [
                  "Avalanches"
                ]
              },
              {
                id: "q7-2",
                type: "multiple_choice",
                prompt: "Who caused the rescue mission?",
                marks: 2,
                options: [
                  "Local children",
                  "Experienced guides",
                  "Inexperienced hikers",
                  "Skiers"
                ],
                acceptedAnswers: [
                  "Inexperienced hikers"
                ]
              },
              {
                id: "q7-3",
                type: "short_answer",
                prompt: "When exactly did the rescue services intervene?",
                marks: 1,
                acceptedAnswers: [
                  "At dawn",
                  "In the early morning"
                ]
              }
            ]
          },
          {
            id: "q8",
            type: "short_answer",
            prompt: "Q8: High-Load Inference - Social Responsibility and Volunteers.",
            marks: 5,
            context: "La fundación \"Voz del Pueblo\" se dedica incansablemente al apoyo de las personas que carecen de hogar estable. Durante los meses más crudos del invierno, no solo ofrecen raciones de comida caliente, sino que también gestionan refugios temporales en edificios estatales rehabilitados. Sorprendentemente, el noventa por ciento de sus fondos proviene de pequeñas donaciones privadas, lo que demuestra la solidaridad de los ciudadanos locales frente a la indiferencia oficial que algunos críticos denuncian.",
            subQuestions: [
              {
                id: "q8-1",
                type: "short_answer",
                prompt: "What contrast does the author draw regarding the source of funding?",
                marks: 2,
                acceptedAnswers: [
                  "Solidarity of citizens vs official indifference"
                ]
              },
              {
                id: "q8-2",
                type: "short_answer",
                prompt: "Identify two services provided specifically in winter.",
                marks: 1,
                acceptedAnswers: [
                  "Hot food rations and temporary shelters"
                ]
              },
              {
                id: "q8-3",
                type: "short_answer",
                prompt: "Where are the shelters located?",
                marks: 2,
                acceptedAnswers: [
                  "In rehabilitated state buildings"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-es",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "El fin de semana pasado decidí ir a la costa con mis compañeros de clase. Hacía un calor sofocante, por lo tanto nadamos en el mar durante horas. Opino que es fundamental desconectar tras una semana agotadora en el instituto, dado que los exámenes finales son sumamente estresantes y requieren mucha concentración.",
        questions: [
          {
            id: "q9",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "es-read-h-v385-v2",
    paperCode: "1SP0/3H",
    language: "Spanish",
    tier: "higher",
    theme: "GLOBAL",
    title: "Paper 3: Reading (Higher Tier) - Social Issues & Environment (Set B)",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-es-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English. Answer the questions in the spaces provided.",
        questions: [
          {
            id: "q1-v2",
            type: "word_bank",
            prompt: "Q1: Complete the sentences about the school festival by choosing words from the bank.",
            marks: 3,
            options: [
              "history",
              "food",
              "weather",
              "music",
              "people"
            ],
            context: "El festival de música de mi instituto es muy famoso. Cada año vienen miles de personas para disfrutar de los conciertos al aire libre. Es un evento muy alegre.",
            subQuestions: [
              {
                id: "q1-1-v2",
                type: "gap_fill",
                prompt: "The festival is well known for its...",
                marks: 1,
                acceptedAnswers: [
                  "music"
                ]
              },
              {
                id: "q1-2-v2",
                type: "gap_fill",
                prompt: "The events take place...",
                marks: 1,
                acceptedAnswers: [
                  "outdoors",
                  "outside",
                  "in the open air"
                ]
              },
              {
                id: "q1-3-v2",
                type: "gap_fill",
                prompt: "Large numbers of ... attend annually.",
                marks: 1,
                acceptedAnswers: [
                  "people"
                ]
              }
            ]
          },
          {
            id: "q2-v2",
            type: "multiple_choice",
            prompt: "Q2: Choose the correct answer for each question based on Elena's experience.",
            marks: 5,
            context: "Elena trabaja como guía turística en Madrid. Le encanta explicar la historia antigua de los monumentos. *Glaseado: coating / icing.* Sin embargo, a veces el tráfico en el centro es horrible y llega tarde a casa, lo cual le molesta mucho.",
            subQuestions: [
              {
                id: "q2-1-v2",
                type: "multiple_choice",
                prompt: "Where does Elena work?",
                marks: 1,
                options: [
                  "Barcelona",
                  "Madrid",
                  "Seville",
                  "Valencia"
                ],
                acceptedAnswers: [
                  "Madrid"
                ]
              },
              {
                id: "q2-2-v2",
                type: "multiple_choice",
                prompt: "What specific aspect does she enjoy explaining?",
                marks: 1,
                options: [
                  "Nightlife",
                  "The history",
                  "Modern architecture",
                  "Restaurants"
                ],
                acceptedAnswers: [
                  "The history"
                ]
              },
              {
                id: "q2-3-v2",
                type: "multiple_choice",
                prompt: "What is the main obstacle in her day?",
                marks: 1,
                options: [
                  "The weather",
                  "Language barrier",
                  "Traffic",
                  "Rude tourists"
                ],
                acceptedAnswers: [
                  "Traffic"
                ]
              },
              {
                id: "q2-4-v2",
                type: "multiple_choice",
                prompt: "How does she react when she is delayed?",
                marks: 2,
                options: [
                  "She is happy",
                  "She is indifferent",
                  "She finds it annoying",
                  "She finds it restful"
                ],
                acceptedAnswers: [
                  "She finds it annoying"
                ]
              }
            ]
          },
          {
            id: "q3-v2",
            type: "short_answer",
            prompt: "Q3: Mixed Comprehension - Modern Technology and Youth Habits.",
            marks: 7,
            context: "En la actualidad, muchos institutos españoles están intentando limitar el acceso a los teléfonos móviles. Los directores afirman que los estudiantes se distraen constantemente con las notificaciones. No obstante, algunos profesores argumentan que las tabletas táctiles son herramientas vitales para enseñar asignaturas como la geografía moderna y la economía, ya que permiten un acceso instantáneo a datos globales.",
            subQuestions: [
              {
                id: "q3-1-v2",
                type: "short_answer",
                prompt: "What are many Spanish schools attempting to do?",
                marks: 2,
                acceptedAnswers: [
                  "Limit mobile phone access",
                  "Ban phones"
                ]
              },
              {
                id: "q3-2-v2",
                type: "multiple_choice",
                prompt: "Why is this action being taken?",
                marks: 1,
                options: [
                  "Lack of budget",
                  "Cybersecurity",
                  "Constant distractions",
                  "Cheating"
                ],
                acceptedAnswers: [
                  "Constant distractions"
                ]
              },
              {
                id: "q3-3-v2",
                type: "short_answer",
                prompt: "Which two specific subjects benefit from tablet use?",
                marks: 2,
                acceptedAnswers: [
                  "Modern Geography and Economics"
                ]
              },
              {
                id: "q3-4-v2",
                type: "gap_fill",
                prompt: "Tablets are considered vital because they provide instant access to...",
                marks: 2,
                acceptedAnswers: [
                  "global data"
                ]
              }
            ]
          },
          {
            id: "q4-v2",
            type: "short_answer",
            prompt: "Q4: Inference Task - Urban Transformation.",
            marks: 3,
            context: "Antes, nuestro barrio era insoportablemente ruidoso debido a la antigua fábrica de papel que dominaba el paisaje. Ahora, tras su cierre definitivo, el ayuntamiento ha construido un parque natural extenso. El aire es notablemente más puro y el silencio es ahora la norma.",
            subQuestions: [
              {
                id: "q4-1-v2",
                type: "short_answer",
                prompt: "What was the primary cause of noise in the past?",
                marks: 1,
                acceptedAnswers: [
                  "The paper factory",
                  "A factory"
                ]
              },
              {
                id: "q4-2-v2",
                type: "short_answer",
                prompt: "Give two details about the current state of the neighborhood.",
                marks: 2,
                acceptedAnswers: [
                  "It has a natural park and the air is purer",
                  "Purer air and more silence"
                ]
              }
            ]
          },
          {
            id: "q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about local recycling.",
            marks: 3,
            context: "En mi comunidad, reciclamos con rigor todo el plástico y el vidrio. Afortunadamente, disponemos de contenedores diferenciados por colores en cada esquina. La conciencia ecológica ha aumentado drásticamente entre los jóvenes este año, resultando en calles mucho más limpias.",
            options: [
              "Plastic is recycled strictly",
              "Glass is not recycled",
              "Colored bins are easily available",
              "Young people care more than before",
              "The streets are dirtier",
              "Bins are only in the city center",
              "Recycling is optional in this town",
              "Older people started the project"
            ],
            acceptedAnswers: [
              "Plastic is recycled strictly",
              "Colored bins are easily available",
              "Young people care more than before"
            ]
          },
          {
            id: "q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Begoña’s group.",
            marks: 4,
            context: "Begoña inició su labor de limpieza costera hace ya dos inviernos. Lo que empezó como un esfuerzo individual se ha transformado en una brigada de sesenta entusiastas. El trimestre que viene, su objetivo principal será la restauración de los senderos fluviales locales que han sufrido erosión.",
            subQuestions: [
              {
                id: "q5b-1-v2",
                type: "short_answer",
                prompt: "When did she start her work (exact detail)?",
                marks: 1,
                acceptedAnswers: [
                  "Two winters ago"
                ]
              },
              {
                id: "q5b-2-v2",
                type: "short_answer",
                prompt: "How many people are now in her brigade?",
                marks: 1,
                acceptedAnswers: [
                  "60",
                  "Sixty"
                ]
              },
              {
                id: "q5b-3-v2",
                type: "short_answer",
                prompt: "What is the focus of their next project?",
                marks: 2,
                acceptedAnswers: [
                  "Restoration of local river paths",
                  "River trails"
                ]
              }
            ]
          },
          {
            id: "q6-v2",
            type: "short_answer",
            prompt: "Q6: Condensed Reasoning - Public Transport Challenges.",
            marks: 5,
            context: "La red ferroviaria de alta velocidad en España goza de una reputación excelente por su puntualidad y velocidad extrema. No obstante, para los ciudadanos más jóvenes, el coste de los billetes sigue siendo un obstáculo prohibitivo. El gobierno propone ahora un subsidio para fomentar los viajes sostenibles durante el verano.",
            subQuestions: [
              {
                id: "q6-1-v2",
                type: "short_answer",
                prompt: "What is the objective of the new government proposal?",
                marks: 2,
                acceptedAnswers: [
                  "Encourage sustainable travel during summer"
                ]
              },
              {
                id: "q6-2-v2",
                type: "short_answer",
                prompt: "What are the two positive reputations of the train network?",
                marks: 2,
                acceptedAnswers: [
                  "Punctuality and extreme speed"
                ]
              },
              {
                id: "q6-3-v2",
                type: "short_answer",
                prompt: "Why do young people struggle with these trains?",
                marks: 1,
                acceptedAnswers: [
                  "The cost is prohibitive",
                  "Expensive tickets"
                ]
              }
            ]
          },
          {
            id: "q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Visual Stimulus & Detail - Mountaineering Incident.",
            marks: 5,
            context: "Anoche sufrimos una tormenta gélida que cubrió el valle de blanco. Aunque el riesgo de avalanchas era elevado, algunos excursionistas inexpertos intentaron subir al pico sin el equipo necesario. Los servicios de rescate tuvieron que intervenir de madrugada, lo cual subraya la importancia de respetar las advertencias meteorológicas.",
            subQuestions: [
              {
                id: "q7-1-v2",
                type: "multiple_choice",
                prompt: "What was the specific danger mentioned in the text?",
                marks: 2,
                options: [
                  "High winds",
                  "Avalanches",
                  "Flooding",
                  "Fog"
                ],
                acceptedAnswers: [
                  "Avalanches"
                ]
              },
              {
                id: "q7-2-v2",
                type: "multiple_choice",
                prompt: "Who caused the rescue mission?",
                marks: 2,
                options: [
                  "Local children",
                  "Experienced guides",
                  "Inexperienced hikers",
                  "Skiers"
                ],
                acceptedAnswers: [
                  "Inexperienced hikers"
                ]
              },
              {
                id: "q7-3-v2",
                type: "short_answer",
                prompt: "When exactly did the rescue services intervene?",
                marks: 1,
                acceptedAnswers: [
                  "At dawn",
                  "In the early morning"
                ]
              }
            ]
          },
          {
            id: "q8-v2",
            type: "short_answer",
            prompt: "Q8: High-Load Inference - Social Responsibility and Volunteers.",
            marks: 5,
            context: "La fundación \"Voz del Pueblo\" se dedica incansablemente al apoyo de las personas que carecen de hogar estable. Durante los meses más crudos del invierno, no solo ofrecen raciones de comida caliente, sino que también gestionan refugios temporales en edificios estatales rehabilitados. Sorprendentemente, el noventa por ciento de sus fondos proviene de pequeñas donaciones privadas, lo que demuestra la solidaridad de los ciudadanos locales frente a la indiferencia oficial que algunos críticos denuncian.",
            subQuestions: [
              {
                id: "q8-1-v2",
                type: "short_answer",
                prompt: "What contrast does the author draw regarding the source of funding?",
                marks: 2,
                acceptedAnswers: [
                  "Solidarity of citizens vs official indifference"
                ]
              },
              {
                id: "q8-2-v2",
                type: "short_answer",
                prompt: "Identify two services provided specifically in winter.",
                marks: 1,
                acceptedAnswers: [
                  "Hot food rations and temporary shelters"
                ]
              },
              {
                id: "q8-3-v2",
                type: "short_answer",
                prompt: "Where are the shelters located?",
                marks: 2,
                acceptedAnswers: [
                  "In rehabilitated state buildings"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-es-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "El fin de semana pasado decidí ir a la costa con mis compañeros de clase. Hacía un calor sofocante, por lo tanto nadamos en el mar durante horas. Opino que es fundamental desconectar tras una semana agotadora en el instituto, dado que los exámenes finales son sumamente estresantes y requieren mucha concentración.",
        questions: [
          {
            id: "q9-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "fr-read-h-101",
    paperCode: "1FR0/3H",
    language: "French",
    tier: "higher",
    theme: "IDENTITY",
    title: "Paper 3: Reading (Higher Tier) - Identité et Culture",
    totalMarks: 53,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-fr",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "fr-h-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Luc's weekend.",
            marks: 3,
            context: "Samedi dernier, Luc est allé au cinéma avec son frère pour voir un film d'action. Après le film, ils ont mangé une pizza dans un restaurant italien.",
            subQuestions: [
              {
                id: "fr-h-q1-1",
                type: "multiple_choice",
                prompt: "Who did Luc go to the cinema with?",
                marks: 1,
                options: [
                  "His father",
                  "His brother",
                  "His friend",
                  "His cousin"
                ],
                acceptedAnswers: [
                  "His brother"
                ]
              },
              {
                id: "fr-h-q1-2",
                type: "multiple_choice",
                prompt: "What genre of film did they watch?",
                marks: 1,
                options: [
                  "Comedy",
                  "Action",
                  "Romance",
                  "Horror"
                ],
                acceptedAnswers: [
                  "Action"
                ]
              },
              {
                id: "fr-h-q1-3",
                type: "multiple_choice",
                prompt: "What did they eat after the film?",
                marks: 1,
                options: [
                  "Burger",
                  "Pizza",
                  "Pasta",
                  "Salad"
                ],
                acceptedAnswers: [
                  "Pizza"
                ]
              }
            ]
          },
          {
            id: "fr-h-q2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Marie's new job.",
            marks: 3,
            options: [
              "history",
              "animals",
              "children",
              "languages",
              "science"
            ],
            context: "Marie adore travailler avec les animaux. Elle a commencé un stage dans un zoo local pour soigner les lions et les girafes.",
            subQuestions: [
              {
                id: "fr-h-q2-1",
                type: "gap_fill",
                prompt: "Marie has a strong passion for...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "fr-h-q2-2",
                type: "gap_fill",
                prompt: "She recently began her placement at a local...",
                marks: 1,
                acceptedAnswers: [
                  "zoo"
                ]
              },
              {
                id: "fr-h-q2-3",
                type: "gap_fill",
                prompt: "Her role is to care for lions and...",
                marks: 1,
                acceptedAnswers: [
                  "giraffes"
                ]
              }
            ]
          },
          {
            id: "fr-h-q3",
            type: "short_answer",
            prompt: "Q3: Healthy Living and Youth Diets.",
            marks: 4,
            context: "De nos jours, de nombreux jeunes Français essaient de manger plus sainement. Ils évitent le sucre et préfèrent consommer des produits biologiques et locaux.",
            subQuestions: [
              {
                id: "fr-h-q3-1",
                type: "short_answer",
                prompt: "What are young French people trying to do regarding their diet?",
                marks: 1,
                acceptedAnswers: [
                  "Eat more healthily",
                  "Eat healthier"
                ]
              },
              {
                id: "fr-h-q3-2",
                type: "short_answer",
                prompt: "What ingredient are they actively avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Sugar"
                ]
              },
              {
                id: "fr-h-q3-3",
                type: "short_answer",
                prompt: "Name two types of food products they prefer to consume.",
                marks: 2,
                acceptedAnswers: [
                  "Organic",
                  "Local",
                  "Organic and local"
                ]
              }
            ]
          },
          {
            id: "fr-h-q4",
            type: "short_answer",
            prompt: "Q4: Local Environmental Campaign.",
            marks: 3,
            context: "Notre école a organisé un nettoyage de la plage le week-end dernier. Vingt élèves ont ramassé cinquante kilos de plastique en trois heures.",
            subQuestions: [
              {
                id: "fr-h-q4-1",
                type: "short_answer",
                prompt: "What activity did the school organize last weekend?",
                marks: 1,
                acceptedAnswers: [
                  "A beach clean-up",
                  "Cleaning the beach"
                ]
              },
              {
                id: "fr-h-q4-2",
                type: "short_answer",
                prompt: "How many students took part in the cleanup?",
                marks: 1,
                acceptedAnswers: [
                  "20",
                  "Twenty"
                ]
              },
              {
                id: "fr-h-q4-3",
                type: "short_answer",
                prompt: "What weight of plastic was collected during the event?",
                marks: 1,
                acceptedAnswers: [
                  "50 kg",
                  "Fifty kilos",
                  "50 kilos"
                ]
              }
            ]
          },
          {
            id: "fr-h-q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about French public transport.",
            marks: 3,
            context: "À Paris, le métro est très rapide et écologique. Le gouvernement encourage son utilisation en offrant des réductions pour les étudiants.",
            options: [
              "The metro is slow",
              "The metro is fast",
              "The metro is environmentally friendly",
              "It is very expensive for everyone",
              "The government offers discounts for students",
              "Students are banned from the metro",
              "The train network is private",
              "Buses are completely free"
            ],
            acceptedAnswers: [
              "The metro is fast",
              "The metro is environmentally friendly",
              "The government offers discounts for students"
            ]
          },
          {
            id: "fr-h-q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Sophie's reading habits.",
            marks: 3,
            context: "Sophie lit des romans policiers depuis l'âge de dix ans. Elle préfère lire sur sa liseuse car c'est plus léger dans son sac à dos.",
            subQuestions: [
              {
                id: "fr-h-q5b-1",
                type: "short_answer",
                prompt: "What genre of books does Sophie read?",
                marks: 1,
                acceptedAnswers: [
                  "Detective novels",
                  "Crime novels",
                  "Mystery novels"
                ]
              },
              {
                id: "fr-h-q5b-2",
                type: "short_answer",
                prompt: "At what age did she start reading this genre?",
                marks: 1,
                acceptedAnswers: [
                  "10",
                  "Ten"
                ]
              },
              {
                id: "fr-h-q5b-3",
                type: "short_answer",
                prompt: "Why does she prefer her e-reader over printed books?",
                marks: 1,
                acceptedAnswers: [
                  "Lighter in her backpack",
                  "Lighter"
                ]
              }
            ]
          },
          {
            id: "fr-h-q6",
            type: "short_answer",
            prompt: "Q6: Public Library Services.",
            marks: 3,
            context: "La bibliothèque municipale a été rénovée le mois dernier. Elle offre désormais un accès gratuit à internet et des salles de travail silencieuses.",
            subQuestions: [
              {
                id: "fr-h-q6-1",
                type: "short_answer",
                prompt: "When was the municipal library renovated?",
                marks: 1,
                acceptedAnswers: [
                  "Last month"
                ]
              },
              {
                id: "fr-h-q6-2",
                type: "short_answer",
                prompt: "What digital service is now offered for free?",
                marks: 1,
                acceptedAnswers: [
                  "Internet access",
                  "Free internet"
                ]
              },
              {
                id: "fr-h-q6-3",
                type: "short_answer",
                prompt: "What type of rooms are provided for visitors?",
                marks: 1,
                acceptedAnswers: [
                  "Quiet work rooms",
                  "Study rooms"
                ]
              }
            ]
          },
          {
            id: "fr-h-q7",
            type: "multiple_choice",
            prompt: "Q7: Youth and Screen Time.",
            marks: 3,
            context: "Selon une étude récente, les adolescents passent en moyenne quatre heures par jour devant un écran. Les parents s'inquiètent du manque de sommeil.",
            subQuestions: [
              {
                id: "fr-h-q7-1",
                type: "multiple_choice",
                prompt: "How many hours do teenagers spend on screens daily on average?",
                marks: 1,
                options: [
                  "Two hours",
                  "Three hours",
                  "Four hours",
                  "Five hours"
                ],
                acceptedAnswers: [
                  "Four hours"
                ]
              },
              {
                id: "fr-h-q7-2",
                type: "multiple_choice",
                prompt: "What specific health concern do parents have?",
                marks: 1,
                options: [
                  "Lack of sleep",
                  "Eye strain",
                  "Obesity",
                  "Poor grades"
                ],
                acceptedAnswers: [
                  "Lack of sleep"
                ]
              },
              {
                id: "fr-h-q7-3",
                type: "multiple_choice",
                prompt: "Who is the subject of this study?",
                marks: 1,
                options: [
                  "Toddlers",
                  "Teenagers",
                  "Adults",
                  "Teachers"
                ],
                acceptedAnswers: [
                  "Teenagers"
                ]
              }
            ]
          },
          {
            id: "fr-h-q8",
            type: "short_answer",
            prompt: "Q8: Volunteer Work in the Community.",
            marks: 3,
            context: "L'association \"Aide et Partage\" soutient les personnes âgées du quartier. Chaque samedi, des bénévoles leur rendent visite pour discuter et faire leurs courses au supermarché.",
            subQuestions: [
              {
                id: "fr-h-q8-1",
                type: "short_answer",
                prompt: "Which group of people does the association support?",
                marks: 1,
                acceptedAnswers: [
                  "Elderly people",
                  "The elderly",
                  "Older people"
                ]
              },
              {
                id: "fr-h-q8-2",
                type: "short_answer",
                prompt: "On which day do volunteers visit them?",
                marks: 1,
                acceptedAnswers: [
                  "Saturday",
                  "Saturdays",
                  "Every Saturday"
                ]
              },
              {
                id: "fr-h-q8-3",
                type: "short_answer",
                prompt: "Name two activities volunteers do during visits.",
                marks: 1,
                acceptedAnswers: [
                  "Chatting and grocery shopping",
                  "Discussing and shopping",
                  "Talking and shopping"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-fr",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Le week-end dernier, j'ai décidé d'aller à la côte avec mes camarades de classe. Il faisait une chaleur étouffante, c'est pourquoi nous avons nagé dans la mer pendant des heures. Je pense qu'il est essentiel de se déconnecter après une semaine fatigante au lycée, étant donné que les examens finaux sont extrêmement stressants et exigent beaucoup de concentration.",
        questions: [
          {
            id: "fr-h-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "fr-read-h-101-v2",
    paperCode: "1FR0/3H",
    language: "French",
    tier: "higher",
    theme: "IDENTITY",
    title: "Paper 3: Reading (Higher Tier) - Identité et Culture (Set B)",
    totalMarks: 53,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-fr-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "fr-h-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Luc's weekend.",
            marks: 3,
            context: "Samedi dernier, Luc est allé au cinéma avec son frère pour voir un film d'action. Après le film, ils ont mangé une pizza dans un restaurant italien.",
            subQuestions: [
              {
                id: "fr-h-q1-1-v2",
                type: "multiple_choice",
                prompt: "Who did Luc go to the cinema with?",
                marks: 1,
                options: [
                  "His father",
                  "His brother",
                  "His friend",
                  "His cousin"
                ],
                acceptedAnswers: [
                  "His brother"
                ]
              },
              {
                id: "fr-h-q1-2-v2",
                type: "multiple_choice",
                prompt: "What genre of film did they watch?",
                marks: 1,
                options: [
                  "Comedy",
                  "Action",
                  "Romance",
                  "Horror"
                ],
                acceptedAnswers: [
                  "Action"
                ]
              },
              {
                id: "fr-h-q1-3-v2",
                type: "multiple_choice",
                prompt: "What did they eat after the film?",
                marks: 1,
                options: [
                  "Burger",
                  "Pizza",
                  "Pasta",
                  "Salad"
                ],
                acceptedAnswers: [
                  "Pizza"
                ]
              }
            ]
          },
          {
            id: "fr-h-q2-v2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Marie's new job.",
            marks: 3,
            options: [
              "history",
              "animals",
              "children",
              "languages",
              "science"
            ],
            context: "Marie adore travailler avec les animaux. Elle a commencé un stage dans un zoo local pour soigner les lions et les girafes.",
            subQuestions: [
              {
                id: "fr-h-q2-1-v2",
                type: "gap_fill",
                prompt: "Marie has a strong passion for...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "fr-h-q2-2-v2",
                type: "gap_fill",
                prompt: "She recently began her placement at a local...",
                marks: 1,
                acceptedAnswers: [
                  "zoo"
                ]
              },
              {
                id: "fr-h-q2-3-v2",
                type: "gap_fill",
                prompt: "Her role is to care for lions and...",
                marks: 1,
                acceptedAnswers: [
                  "giraffes"
                ]
              }
            ]
          },
          {
            id: "fr-h-q3-v2",
            type: "short_answer",
            prompt: "Q3: Healthy Living and Youth Diets.",
            marks: 4,
            context: "De nos jours, de nombreux jeunes Français essaient de manger plus sainement. Ils évitent le sucre et préfèrent consommer des produits biologiques et locaux.",
            subQuestions: [
              {
                id: "fr-h-q3-1-v2",
                type: "short_answer",
                prompt: "What are young French people trying to do regarding their diet?",
                marks: 1,
                acceptedAnswers: [
                  "Eat more healthily",
                  "Eat healthier"
                ]
              },
              {
                id: "fr-h-q3-2-v2",
                type: "short_answer",
                prompt: "What ingredient are they actively avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Sugar"
                ]
              },
              {
                id: "fr-h-q3-3-v2",
                type: "short_answer",
                prompt: "Name two types of food products they prefer to consume.",
                marks: 2,
                acceptedAnswers: [
                  "Organic",
                  "Local",
                  "Organic and local"
                ]
              }
            ]
          },
          {
            id: "fr-h-q4-v2",
            type: "short_answer",
            prompt: "Q4: Local Environmental Campaign.",
            marks: 3,
            context: "Notre école a organisé un nettoyage de la plage le week-end dernier. Vingt élèves ont ramassé cinquante kilos de plastique en trois heures.",
            subQuestions: [
              {
                id: "fr-h-q4-1-v2",
                type: "short_answer",
                prompt: "What activity did the school organize last weekend?",
                marks: 1,
                acceptedAnswers: [
                  "A beach clean-up",
                  "Cleaning the beach"
                ]
              },
              {
                id: "fr-h-q4-2-v2",
                type: "short_answer",
                prompt: "How many students took part in the cleanup?",
                marks: 1,
                acceptedAnswers: [
                  "20",
                  "Twenty"
                ]
              },
              {
                id: "fr-h-q4-3-v2",
                type: "short_answer",
                prompt: "What weight of plastic was collected during the event?",
                marks: 1,
                acceptedAnswers: [
                  "50 kg",
                  "Fifty kilos",
                  "50 kilos"
                ]
              }
            ]
          },
          {
            id: "fr-h-q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about French public transport.",
            marks: 3,
            context: "À Paris, le métro est très rapide et écologique. Le gouvernement encourage son utilisation en offrant des réductions pour les étudiants.",
            options: [
              "The metro is slow",
              "The metro is fast",
              "The metro is environmentally friendly",
              "It is very expensive for everyone",
              "The government offers discounts for students",
              "Students are banned from the metro",
              "The train network is private",
              "Buses are completely free"
            ],
            acceptedAnswers: [
              "The metro is fast",
              "The metro is environmentally friendly",
              "The government offers discounts for students"
            ]
          },
          {
            id: "fr-h-q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Sophie's reading habits.",
            marks: 3,
            context: "Sophie lit des romans policiers depuis l'âge de dix ans. Elle préfère lire sur sa liseuse car c'est plus léger dans son sac à dos.",
            subQuestions: [
              {
                id: "fr-h-q5b-1-v2",
                type: "short_answer",
                prompt: "What genre of books does Sophie read?",
                marks: 1,
                acceptedAnswers: [
                  "Detective novels",
                  "Crime novels",
                  "Mystery novels"
                ]
              },
              {
                id: "fr-h-q5b-2-v2",
                type: "short_answer",
                prompt: "At what age did she start reading this genre?",
                marks: 1,
                acceptedAnswers: [
                  "10",
                  "Ten"
                ]
              },
              {
                id: "fr-h-q5b-3-v2",
                type: "short_answer",
                prompt: "Why does she prefer her e-reader over printed books?",
                marks: 1,
                acceptedAnswers: [
                  "Lighter in her backpack",
                  "Lighter"
                ]
              }
            ]
          },
          {
            id: "fr-h-q6-v2",
            type: "short_answer",
            prompt: "Q6: Public Library Services.",
            marks: 3,
            context: "La bibliothèque municipale a été rénovée le mois dernier. Elle offre désormais un accès gratuit à internet et des salles de travail silencieuses.",
            subQuestions: [
              {
                id: "fr-h-q6-1-v2",
                type: "short_answer",
                prompt: "When was the municipal library renovated?",
                marks: 1,
                acceptedAnswers: [
                  "Last month"
                ]
              },
              {
                id: "fr-h-q6-2-v2",
                type: "short_answer",
                prompt: "What digital service is now offered for free?",
                marks: 1,
                acceptedAnswers: [
                  "Internet access",
                  "Free internet"
                ]
              },
              {
                id: "fr-h-q6-3-v2",
                type: "short_answer",
                prompt: "What type of rooms are provided for visitors?",
                marks: 1,
                acceptedAnswers: [
                  "Quiet work rooms",
                  "Study rooms"
                ]
              }
            ]
          },
          {
            id: "fr-h-q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Youth and Screen Time.",
            marks: 3,
            context: "Selon une étude récente, les adolescents passent en moyenne quatre heures par jour devant un écran. Les parents s'inquiètent du manque de sommeil.",
            subQuestions: [
              {
                id: "fr-h-q7-1-v2",
                type: "multiple_choice",
                prompt: "How many hours do teenagers spend on screens daily on average?",
                marks: 1,
                options: [
                  "Two hours",
                  "Three hours",
                  "Four hours",
                  "Five hours"
                ],
                acceptedAnswers: [
                  "Four hours"
                ]
              },
              {
                id: "fr-h-q7-2-v2",
                type: "multiple_choice",
                prompt: "What specific health concern do parents have?",
                marks: 1,
                options: [
                  "Lack of sleep",
                  "Eye strain",
                  "Obesity",
                  "Poor grades"
                ],
                acceptedAnswers: [
                  "Lack of sleep"
                ]
              },
              {
                id: "fr-h-q7-3-v2",
                type: "multiple_choice",
                prompt: "Who is the subject of this study?",
                marks: 1,
                options: [
                  "Toddlers",
                  "Teenagers",
                  "Adults",
                  "Teachers"
                ],
                acceptedAnswers: [
                  "Teenagers"
                ]
              }
            ]
          },
          {
            id: "fr-h-q8-v2",
            type: "short_answer",
            prompt: "Q8: Volunteer Work in the Community.",
            marks: 3,
            context: "L'association \"Aide et Partage\" soutient les personnes âgées du quartier. Chaque samedi, des bénévoles leur rendent visite pour discuter et faire leurs courses au supermarché.",
            subQuestions: [
              {
                id: "fr-h-q8-1-v2",
                type: "short_answer",
                prompt: "Which group of people does the association support?",
                marks: 1,
                acceptedAnswers: [
                  "Elderly people",
                  "The elderly",
                  "Older people"
                ]
              },
              {
                id: "fr-h-q8-2-v2",
                type: "short_answer",
                prompt: "On which day do volunteers visit them?",
                marks: 1,
                acceptedAnswers: [
                  "Saturday",
                  "Saturdays",
                  "Every Saturday"
                ]
              },
              {
                id: "fr-h-q8-3-v2",
                type: "short_answer",
                prompt: "Name two activities volunteers do during visits.",
                marks: 1,
                acceptedAnswers: [
                  "Chatting and grocery shopping",
                  "Discussing and shopping",
                  "Talking and shopping"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-fr-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Le week-end dernier, j'ai décidé d'aller à la côte avec mes camarades de classe. Il faisait une chaleur étouffante, c'est pourquoi nous avons nagé dans la mer pendant des heures. Je pense qu'il est essentiel de se déconnecter après une semaine fatigante au lycée, étant donné que les examens finaux sont extrêmement stressants et exigent beaucoup de concentration.",
        questions: [
          {
            id: "fr-h-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "de-read-h-101",
    paperCode: "1GN0/3H",
    language: "German",
    tier: "higher",
    theme: "TRAVEL",
    title: "Paper 3: Reading (Higher Tier) - Reisen und Urlaub",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-de",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "de-h-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Anna's holiday.",
            marks: 3,
            context: "Anna verbringt ihren Urlaub am liebsten in den Bergen. Letzten Sommer ist sie nach Österreich gewandert und hat in einer Hütte übernachtet.",
            subQuestions: [
              {
                id: "de-h-q1-1",
                type: "multiple_choice",
                prompt: "Where does Anna prefer to spend her holiday?",
                marks: 1,
                options: [
                  "At the beach",
                  "In the mountains",
                  "In the city",
                  "At home"
                ],
                acceptedAnswers: [
                  "In the mountains"
                ]
              },
              {
                id: "de-h-q1-2",
                type: "multiple_choice",
                prompt: "Which country did she travel to last summer?",
                marks: 1,
                options: [
                  "Germany",
                  "Switzerland",
                  "Austria",
                  "Italy"
                ],
                acceptedAnswers: [
                  "Austria"
                ]
              },
              {
                id: "de-h-q1-3",
                type: "multiple_choice",
                prompt: "Where did she stay overnight?",
                marks: 1,
                options: [
                  "Hotel",
                  "Tent",
                  "Hut",
                  "Youth hostel"
                ],
                acceptedAnswers: [
                  "Hut"
                ]
              }
            ]
          },
          {
            id: "de-h-q2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Thomas's school placement.",
            marks: 3,
            options: [
              "technology",
              "animals",
              "books",
              "sports",
              "cooking"
            ],
            context: "Thomas macht ein Praktikum in einer Tierarztpraxis. Er liebt Tiere und möchte später Tiermedizin studieren.",
            subQuestions: [
              {
                id: "de-h-q2-1",
                type: "gap_fill",
                prompt: "Thomas is doing a placement at a...",
                marks: 1,
                acceptedAnswers: [
                  "veterinary clinic",
                  "vet clinic",
                  "vet"
                ]
              },
              {
                id: "de-h-q2-2",
                type: "gap_fill",
                prompt: "He chose this because he loves...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "de-h-q2-3",
                type: "gap_fill",
                prompt: "In the future, he wants to study veterinary...",
                marks: 1,
                acceptedAnswers: [
                  "medicine"
                ]
              }
            ]
          },
          {
            id: "de-h-q3",
            type: "short_answer",
            prompt: "Q3: Environment and Local Recycling.",
            marks: 4,
            context: "In Deutschland ist Mülltrennung sehr wichtig. Die meisten Bürger trennen Papier, Plastik und Biomüll sehr sorgfältig, um die Umwelt zu schonen.",
            subQuestions: [
              {
                id: "de-h-q3-1",
                type: "short_answer",
                prompt: "How do citizens approach waste separation in Germany?",
                marks: 1,
                acceptedAnswers: [
                  "Very carefully",
                  "With care"
                ]
              },
              {
                id: "de-h-q3-2",
                type: "short_answer",
                prompt: "Name two materials separated by citizens.",
                marks: 2,
                acceptedAnswers: [
                  "Paper and plastic",
                  "Biowaste and paper",
                  "Plastic and biowaste"
                ]
              },
              {
                id: "de-h-q3-3",
                type: "short_answer",
                prompt: "What is the ultimate goal of separating waste?",
                marks: 1,
                acceptedAnswers: [
                  "Protect the environment",
                  "Save the environment"
                ]
              }
            ]
          },
          {
            id: "de-h-q4",
            type: "short_answer",
            prompt: "Q4: Healthy Eating and Youth Lifestyles.",
            marks: 3,
            context: "Viele junge Deutsche trinken weniger Limonade und essen stattdessen frisches Obst und Gemüse, um fit zu bleiben.",
            subQuestions: [
              {
                id: "de-h-q4-1",
                type: "short_answer",
                prompt: "What sweet drink is being consumed less by young Germans?",
                marks: 1,
                acceptedAnswers: [
                  "Lemonade",
                  "Fizzy drinks",
                  "Soda"
                ]
              },
              {
                id: "de-h-q4-2",
                type: "short_answer",
                prompt: "What do they eat instead?",
                marks: 1,
                acceptedAnswers: [
                  "Fresh fruit and vegetables",
                  "Fruit and vegetables"
                ]
              },
              {
                id: "de-h-q4-3",
                type: "short_answer",
                prompt: "Why are they changing their eating habits?",
                marks: 1,
                acceptedAnswers: [
                  "To stay fit",
                  "To remain healthy"
                ]
              }
            ]
          },
          {
            id: "de-h-q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about transport in Berlin.",
            marks: 3,
            context: "Die U-Bahn in Berlin ist extrem pünktlich und sauber. Ein Ticket für Studenten ist sehr günstig, weshalb many young people do not buy cars.",
            options: [
              "The U-Bahn is dirty",
              "The U-Bahn is extremely punctual",
              "The U-Bahn is clean",
              "Tickets are very expensive for students",
              "Student tickets are cheap",
              "Many young people buy cars",
              "The metro is slow",
              "Trains are always cancelled"
            ],
            acceptedAnswers: [
              "The U-Bahn is extremely punctual",
              "The U-Bahn is clean",
              "Student tickets are cheap"
            ]
          },
          {
            id: "de-h-q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Sarah's hobby.",
            marks: 3,
            context: "Sarah spielt seit fünf Jahren Querflöte. Sie übt jeden Abend eine Stunde in ihrem Zimmer, weil sie im Schulorchester spielen möchte.",
            subQuestions: [
              {
                id: "de-h-q5b-1",
                type: "short_answer",
                prompt: "What instrument does Sarah play?",
                marks: 1,
                acceptedAnswers: [
                  "Flute",
                  "Concert flute"
                ]
              },
              {
                id: "de-h-q5b-2",
                type: "short_answer",
                prompt: "How long has she been playing this instrument?",
                marks: 1,
                acceptedAnswers: [
                  "5 years",
                  "Five years"
                ]
              },
              {
                id: "de-h-q5b-3",
                type: "short_answer",
                prompt: "What is her ambition at school?",
                marks: 1,
                acceptedAnswers: [
                  "To play in the school orchestra",
                  "Play in school band"
                ]
              }
            ]
          },
          {
            id: "de-h-q6",
            type: "short_answer",
            prompt: "Q6: Modern Workspace and Technology.",
            marks: 3,
            context: "Heutzutage arbeiten viele Deutsche von zu Hause aus. Sie sparen viel Zeit, weil sie nicht jeden Tag pendeln müssen.",
            subQuestions: [
              {
                id: "de-h-q6-1",
                type: "short_answer",
                prompt: "Where do many Germans work nowadays?",
                marks: 1,
                acceptedAnswers: [
                  "From home",
                  "At home"
                ]
              },
              {
                id: "de-h-q6-2",
                type: "short_answer",
                prompt: "What benefit do they gain from this arrangement?",
                marks: 1,
                acceptedAnswers: [
                  "They save a lot of time"
                ]
              },
              {
                id: "de-h-q6-3",
                type: "short_answer",
                prompt: "What daily activity is bypassed under this setup?",
                marks: 1,
                acceptedAnswers: [
                  "Commuting",
                  "Traveling to work"
                ]
              }
            ]
          },
          {
            id: "de-h-q7",
            type: "multiple_choice",
            prompt: "Q7: Sports Event in Munich.",
            marks: 3,
            context: "Letztes Wochenende gab es einen großen Marathon in München. Über zehntausend Läufer nahmen trotz des kalten Regens teil.",
            subQuestions: [
              {
                id: "de-h-q7-1",
                type: "multiple_choice",
                prompt: "What sports event took place last weekend?",
                marks: 1,
                options: [
                  "Football match",
                  "Cycling race",
                  "Marathon",
                  "Tennis tournament"
                ],
                acceptedAnswers: [
                  "Marathon"
                ]
              },
              {
                id: "de-h-q7-2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "Over 1,000",
                  "Over 5,000",
                  "Over 10,000",
                  "Over 20,000"
                ],
                acceptedAnswers: [
                  "Over 10,000"
                ]
              },
              {
                id: "de-h-q7-3",
                type: "multiple_choice",
                prompt: "What was the weather condition?",
                marks: 1,
                options: [
                  "Sunny and hot",
                  "Cold rain",
                  "Snowing",
                  "Foggy"
                ],
                acceptedAnswers: [
                  "Cold rain"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-de",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Letztes Wochenende habe ich mich entschieden, mit meinen Klassenkameraden an die Küste zu fahren. Es war eine unerträgliche Hitze, deshalb sind wir stundenlang im Meer geschwommen. Ich finde, dass es wichtig ist, sich nach einer anstrengenden Woche in der Schule zu entspannen, da die Abschlussprüfungen extrem stressig sind und viel Konzentration erfordern.",
        questions: [
          {
            id: "de-h-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "de-read-h-101-v2",
    paperCode: "1GN0/3H",
    language: "German",
    tier: "higher",
    theme: "TRAVEL",
    title: "Paper 3: Reading (Higher Tier) - Reisen und Urlaub (Set B)",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-de-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "de-h-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Anna's holiday.",
            marks: 3,
            context: "Anna verbringt ihren Urlaub am liebsten in den Bergen. Letzten Sommer ist sie nach Österreich gewandert und hat in einer Hütte übernachtet.",
            subQuestions: [
              {
                id: "de-h-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Anna prefer to spend her holiday?",
                marks: 1,
                options: [
                  "At the beach",
                  "In the mountains",
                  "In the city",
                  "At home"
                ],
                acceptedAnswers: [
                  "In the mountains"
                ]
              },
              {
                id: "de-h-q1-2-v2",
                type: "multiple_choice",
                prompt: "Which country did she travel to last summer?",
                marks: 1,
                options: [
                  "Germany",
                  "Switzerland",
                  "Austria",
                  "Italy"
                ],
                acceptedAnswers: [
                  "Austria"
                ]
              },
              {
                id: "de-h-q1-3-v2",
                type: "multiple_choice",
                prompt: "Where did she stay overnight?",
                marks: 1,
                options: [
                  "Hotel",
                  "Tent",
                  "Hut",
                  "Youth hostel"
                ],
                acceptedAnswers: [
                  "Hut"
                ]
              }
            ]
          },
          {
            id: "de-h-q2-v2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Thomas's school placement.",
            marks: 3,
            options: [
              "technology",
              "animals",
              "books",
              "sports",
              "cooking"
            ],
            context: "Thomas macht ein Praktikum in einer Tierarztpraxis. Er liebt Tiere und möchte später Tiermedizin studieren.",
            subQuestions: [
              {
                id: "de-h-q2-1-v2",
                type: "gap_fill",
                prompt: "Thomas is doing a placement at a...",
                marks: 1,
                acceptedAnswers: [
                  "veterinary clinic",
                  "vet clinic",
                  "vet"
                ]
              },
              {
                id: "de-h-q2-2-v2",
                type: "gap_fill",
                prompt: "He chose this because he loves...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "de-h-q2-3-v2",
                type: "gap_fill",
                prompt: "In the future, he wants to study veterinary...",
                marks: 1,
                acceptedAnswers: [
                  "medicine"
                ]
              }
            ]
          },
          {
            id: "de-h-q3-v2",
            type: "short_answer",
            prompt: "Q3: Environment and Local Recycling.",
            marks: 4,
            context: "In Deutschland ist Mülltrennung sehr wichtig. Die meisten Bürger trennen Papier, Plastik und Biomüll sehr sorgfältig, um die Umwelt zu schonen.",
            subQuestions: [
              {
                id: "de-h-q3-1-v2",
                type: "short_answer",
                prompt: "How do citizens approach waste separation in Germany?",
                marks: 1,
                acceptedAnswers: [
                  "Very carefully",
                  "With care"
                ]
              },
              {
                id: "de-h-q3-2-v2",
                type: "short_answer",
                prompt: "Name two materials separated by citizens.",
                marks: 2,
                acceptedAnswers: [
                  "Paper and plastic",
                  "Biowaste and paper",
                  "Plastic and biowaste"
                ]
              },
              {
                id: "de-h-q3-3-v2",
                type: "short_answer",
                prompt: "What is the ultimate goal of separating waste?",
                marks: 1,
                acceptedAnswers: [
                  "Protect the environment",
                  "Save the environment"
                ]
              }
            ]
          },
          {
            id: "de-h-q4-v2",
            type: "short_answer",
            prompt: "Q4: Healthy Eating and Youth Lifestyles.",
            marks: 3,
            context: "Viele junge Deutsche trinken weniger Limonade und essen stattdessen frisches Obst und Gemüse, um fit zu bleiben.",
            subQuestions: [
              {
                id: "de-h-q4-1-v2",
                type: "short_answer",
                prompt: "What sweet drink is being consumed less by young Germans?",
                marks: 1,
                acceptedAnswers: [
                  "Lemonade",
                  "Fizzy drinks",
                  "Soda"
                ]
              },
              {
                id: "de-h-q4-2-v2",
                type: "short_answer",
                prompt: "What do they eat instead?",
                marks: 1,
                acceptedAnswers: [
                  "Fresh fruit and vegetables",
                  "Fruit and vegetables"
                ]
              },
              {
                id: "de-h-q4-3-v2",
                type: "short_answer",
                prompt: "Why are they changing their eating habits?",
                marks: 1,
                acceptedAnswers: [
                  "To stay fit",
                  "To remain healthy"
                ]
              }
            ]
          },
          {
            id: "de-h-q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about transport in Berlin.",
            marks: 3,
            context: "Die U-Bahn in Berlin ist extrem pünktlich und sauber. Ein Ticket für Studenten ist sehr günstig, weshalb many young people do not buy cars.",
            options: [
              "The U-Bahn is dirty",
              "The U-Bahn is extremely punctual",
              "The U-Bahn is clean",
              "Tickets are very expensive for students",
              "Student tickets are cheap",
              "Many young people buy cars",
              "The metro is slow",
              "Trains are always cancelled"
            ],
            acceptedAnswers: [
              "The U-Bahn is extremely punctual",
              "The U-Bahn is clean",
              "Student tickets are cheap"
            ]
          },
          {
            id: "de-h-q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Sarah's hobby.",
            marks: 3,
            context: "Sarah spielt seit fünf Jahren Querflöte. Sie übt jeden Abend eine Stunde in ihrem Zimmer, weil sie im Schulorchester spielen möchte.",
            subQuestions: [
              {
                id: "de-h-q5b-1-v2",
                type: "short_answer",
                prompt: "What instrument does Sarah play?",
                marks: 1,
                acceptedAnswers: [
                  "Flute",
                  "Concert flute"
                ]
              },
              {
                id: "de-h-q5b-2-v2",
                type: "short_answer",
                prompt: "How long has she been playing this instrument?",
                marks: 1,
                acceptedAnswers: [
                  "5 years",
                  "Five years"
                ]
              },
              {
                id: "de-h-q5b-3-v2",
                type: "short_answer",
                prompt: "What is her ambition at school?",
                marks: 1,
                acceptedAnswers: [
                  "To play in the school orchestra",
                  "Play in school band"
                ]
              }
            ]
          },
          {
            id: "de-h-q6-v2",
            type: "short_answer",
            prompt: "Q6: Modern Workspace and Technology.",
            marks: 3,
            context: "Heutzutage arbeiten viele Deutsche von zu Hause aus. Sie sparen viel Zeit, weil sie nicht jeden Tag pendeln müssen.",
            subQuestions: [
              {
                id: "de-h-q6-1-v2",
                type: "short_answer",
                prompt: "Where do many Germans work nowadays?",
                marks: 1,
                acceptedAnswers: [
                  "From home",
                  "At home"
                ]
              },
              {
                id: "de-h-q6-2-v2",
                type: "short_answer",
                prompt: "What benefit do they gain from this arrangement?",
                marks: 1,
                acceptedAnswers: [
                  "They save a lot of time"
                ]
              },
              {
                id: "de-h-q6-3-v2",
                type: "short_answer",
                prompt: "What daily activity is bypassed under this setup?",
                marks: 1,
                acceptedAnswers: [
                  "Commuting",
                  "Traveling to work"
                ]
              }
            ]
          },
          {
            id: "de-h-q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Sports Event in Munich.",
            marks: 3,
            context: "Letztes Wochenende gab es einen großen Marathon in München. Über zehntausend Läufer nahmen trotz des kalten Regens teil.",
            subQuestions: [
              {
                id: "de-h-q7-1-v2",
                type: "multiple_choice",
                prompt: "What sports event took place last weekend?",
                marks: 1,
                options: [
                  "Football match",
                  "Cycling race",
                  "Marathon",
                  "Tennis tournament"
                ],
                acceptedAnswers: [
                  "Marathon"
                ]
              },
              {
                id: "de-h-q7-2-v2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "Over 1,000",
                  "Over 5,000",
                  "Over 10,000",
                  "Over 20,000"
                ],
                acceptedAnswers: [
                  "Over 10,000"
                ]
              },
              {
                id: "de-h-q7-3-v2",
                type: "multiple_choice",
                prompt: "What was the weather condition?",
                marks: 1,
                options: [
                  "Sunny and hot",
                  "Cold rain",
                  "Snowing",
                  "Foggy"
                ],
                acceptedAnswers: [
                  "Cold rain"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-de-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Letztes Wochenende habe ich mich entschieden, mit meinen Klassenkameraden an die Küste zu fahren. Es war eine unerträgliche Hitze, deshalb sind wir stundenlang im Meer geschwommen. Ich finde, dass es wichtig ist, sich nach einer anstrengenden Woche in der Schule zu entspannen, da die Abschlussprüfungen extrem stressig sind und viel Konzentration erfordern.",
        questions: [
          {
            id: "de-h-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "ar-read-h-101",
    paperCode: "1AA0/3H",
    language: "Arabic",
    tier: "higher",
    theme: "IDENTITY",
    title: "Paper 3: Reading (Higher Tier) - الهوية والثقافة",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-ar",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "ar-h-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Sami's family.",
            marks: 3,
            context: "يسكن سامي في بيت كبير مع والديه وثلاثة أخوة. في المساء، تحب العائلة الجلوس معاً ومشاهدة التلفاز.",
            subQuestions: [
              {
                id: "ar-h-q1-1",
                type: "multiple_choice",
                prompt: "How many brothers does Sami have?",
                marks: 1,
                options: [
                  "One",
                  "Two",
                  "Three",
                  "Four"
                ],
                acceptedAnswers: [
                  "Three"
                ]
              },
              {
                id: "ar-h-q1-2",
                type: "multiple_choice",
                prompt: "Where does Sami live?",
                marks: 1,
                options: [
                  "In a small flat",
                  "In a big house",
                  "In a farm",
                  "In a hostel"
                ],
                acceptedAnswers: [
                  "In a big house"
                ]
              },
              {
                id: "ar-h-q1-3",
                type: "multiple_choice",
                prompt: "What does the family like to do in the evening?",
                marks: 1,
                options: [
                  "Read books",
                  "Watch TV",
                  "Cook dinner",
                  "Go out"
                ],
                acceptedAnswers: [
                  "Watch TV"
                ]
              }
            ]
          },
          {
            id: "ar-h-q2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Fatma's work.",
            marks: 3,
            options: [
              "teaching",
              "cooking",
              "gardening",
              "medicine",
              "painting"
            ],
            context: "تعمل فاطمة ممرضة في مستشفى الأطفال. هي تحب رعاية المرضى ومساعدتهم على الشفاء.",
            subQuestions: [
              {
                id: "ar-h-q2-1",
                type: "gap_fill",
                prompt: "Fatma works as a...",
                marks: 1,
                acceptedAnswers: [
                  "nurse"
                ]
              },
              {
                id: "ar-h-q2-2",
                type: "gap_fill",
                prompt: "Her workplace is a children's...",
                marks: 1,
                acceptedAnswers: [
                  "hospital"
                ]
              },
              {
                id: "ar-h-q2-3",
                type: "gap_fill",
                prompt: "She enjoys helping patients...",
                marks: 1,
                acceptedAnswers: [
                  "heal",
                  "recover"
                ]
              }
            ]
          },
          {
            id: "ar-h-q3",
            type: "short_answer",
            prompt: "Q3: Environment and Recycling in Arab Cities.",
            marks: 4,
            context: "تهتم مدن عربية كثيرة بإعادة التدوير وحماية البيئة. يقوم المواطنون بفصل الورق والبلاستيك لتقليل النفايات.",
            subQuestions: [
              {
                id: "ar-h-q3-1",
                type: "short_answer",
                prompt: "What are many Arab cities focusing on?",
                marks: 1,
                acceptedAnswers: [
                  "Recycling and environmental protection",
                  "Recycling"
                ]
              },
              {
                id: "ar-h-q3-2",
                type: "short_answer",
                prompt: "Identify two materials separated by citizens.",
                marks: 2,
                acceptedAnswers: [
                  "Paper and plastic"
                ]
              },
              {
                id: "ar-h-q3-3",
                type: "short_answer",
                prompt: "What is the purpose of waste separation according to the text?",
                marks: 1,
                acceptedAnswers: [
                  "To reduce waste"
                ]
              }
            ]
          },
          {
            id: "ar-h-q4",
            type: "short_answer",
            prompt: "Q4: Healthy Eating and Lifestyles.",
            marks: 3,
            context: "يتجنب العديد من الشباب تناول الأطعمة السريعة ويفضلون الطبخ في المنزل لضمان وجبات صحية.",
            subQuestions: [
              {
                id: "ar-h-q4-1",
                type: "short_answer",
                prompt: "What kind of food are many young people avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Fast food",
                  "Junk food"
                ]
              },
              {
                id: "ar-h-q4-2",
                type: "short_answer",
                prompt: "Where do they prefer to cook?",
                marks: 1,
                acceptedAnswers: [
                  "At home",
                  "Home"
                ]
              },
              {
                id: "ar-h-q4-3",
                type: "short_answer",
                prompt: "Why do they prefer this cooking method?",
                marks: 1,
                acceptedAnswers: [
                  "To guarantee healthy meals",
                  "For healthy meals"
                ]
              }
            ]
          },
          {
            id: "ar-h-q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about Cairo metro.",
            marks: 3,
            context: "مترو القاهرة سريع ومزدحم ولكنه رخيص جداً. تستخدمه آلاف الطالبات والطلاب يومياً للوصول إلى الجامعات.",
            options: [
              "The metro is slow",
              "The metro is fast",
              "The metro is crowded",
              "Tickets are very expensive",
              "The metro is very cheap",
              "Only tourists use it",
              "It is closed on weekends",
              "It has no safety measures"
            ],
            acceptedAnswers: [
              "The metro is fast",
              "The metro is crowded",
              "The metro is very cheap"
            ]
          },
          {
            id: "ar-h-q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Layla's hobby.",
            marks: 3,
            context: "تتدرب ليلى على العزف على البيانو منذ خمس سنوات. هي تحب الموسيقى الكلاسيكية وتتمنى المشاركة في حفلة موسيقية كبرى.",
            subQuestions: [
              {
                id: "ar-h-q5b-1",
                type: "short_answer",
                prompt: "What instrument does Layla play?",
                marks: 1,
                acceptedAnswers: [
                  "Piano"
                ]
              },
              {
                id: "ar-h-q5b-2",
                type: "short_answer",
                prompt: "How long has she been practicing?",
                marks: 1,
                acceptedAnswers: [
                  "5 years",
                  "Five years"
                ]
              },
              {
                id: "ar-h-q5b-3",
                type: "short_answer",
                prompt: "What style of music does she love?",
                marks: 1,
                acceptedAnswers: [
                  "Classical music",
                  "Classical"
                ]
              }
            ]
          },
          {
            id: "ar-h-q6",
            type: "short_answer",
            prompt: "Q6: Modern Remote Working.",
            marks: 3,
            context: "الآن، يعمل الكثير من الموظفين عن بعد من منازلهم. يوفر هذا الأسلوب الوقت والجهد ويزيد من الإنتاجية.",
            subQuestions: [
              {
                id: "ar-h-q6-1",
                type: "short_answer",
                prompt: "How do many employees work now?",
                marks: 1,
                acceptedAnswers: [
                  "Remotely",
                  "From home",
                  "From their homes"
                ]
              },
              {
                id: "ar-h-q6-2",
                type: "short_answer",
                prompt: "Name two things saved by this working style.",
                marks: 1,
                acceptedAnswers: [
                  "Time and effort",
                  "Effort and time"
                ]
              },
              {
                id: "ar-h-q6-3",
                type: "short_answer",
                prompt: "What positive business outcome is increased?",
                marks: 1,
                acceptedAnswers: [
                  "Productivity"
                ]
              }
            ]
          },
          {
            id: "ar-h-q7",
            type: "multiple_choice",
            prompt: "Q7: Sports Championship in Dubai.",
            marks: 3,
            context: "أقيمت بطولة جري كبيرة في دبي الأسبوع الماضي. شارك فيها أكثر من ألف عداء رغم درجات الحرارة المرتفعة.",
            subQuestions: [
              {
                id: "ar-h-q7-1",
                type: "multiple_choice",
                prompt: "What event was organized in Dubai last week?",
                marks: 1,
                options: [
                  "Swimming gala",
                  "Running championship",
                  "Tennis match",
                  "Football cup"
                ],
                acceptedAnswers: [
                  "Running championship"
                ]
              },
              {
                id: "ar-h-q7-2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "More than 100",
                  "More than 500",
                  "More than 1,000",
                  "More than 10,000"
                ],
                acceptedAnswers: [
                  "More than 1,000"
                ]
              },
              {
                id: "ar-h-q7-3",
                type: "multiple_choice",
                prompt: "What was the environmental challenge?",
                marks: 1,
                options: [
                  "Cold rain",
                  "High temperatures",
                  "Heavy snow",
                  "Fog"
                ],
                acceptedAnswers: [
                  "High temperatures"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-ar",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "في عطلة نهاية الأسبوع الماضي، قررت الذهاب إلى الساحل مع زملائي في الدراسة. كان الجو حاراً جداً، ولذلك سبحنا في البحر لعدة ساعات. أعتقد أنه من الضروري الاسترخاء بعد أسبوع متعب في المدرسة، لأن الامتحانات النهائية تسبب الكثير من التوتر وتتطلب تركيزاً كبيراً.",
        questions: [
          {
            id: "ar-h-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "ar-read-h-101-v2",
    paperCode: "1AA0/3H",
    language: "Arabic",
    tier: "higher",
    theme: "IDENTITY",
    title: "Paper 3: Reading (Higher Tier) - الهوية والثقافة (Set B)",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-ar-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "ar-h-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Sami's family.",
            marks: 3,
            context: "يسكن سامي في بيت كبير مع والديه وثلاثة أخوة. في المساء، تحب العائلة الجلوس معاً ومشاهدة التلفاز.",
            subQuestions: [
              {
                id: "ar-h-q1-1-v2",
                type: "multiple_choice",
                prompt: "How many brothers does Sami have?",
                marks: 1,
                options: [
                  "One",
                  "Two",
                  "Three",
                  "Four"
                ],
                acceptedAnswers: [
                  "Three"
                ]
              },
              {
                id: "ar-h-q1-2-v2",
                type: "multiple_choice",
                prompt: "Where does Sami live?",
                marks: 1,
                options: [
                  "In a small flat",
                  "In a big house",
                  "In a farm",
                  "In a hostel"
                ],
                acceptedAnswers: [
                  "In a big house"
                ]
              },
              {
                id: "ar-h-q1-3-v2",
                type: "multiple_choice",
                prompt: "What does the family like to do in the evening?",
                marks: 1,
                options: [
                  "Read books",
                  "Watch TV",
                  "Cook dinner",
                  "Go out"
                ],
                acceptedAnswers: [
                  "Watch TV"
                ]
              }
            ]
          },
          {
            id: "ar-h-q2-v2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Fatma's work.",
            marks: 3,
            options: [
              "teaching",
              "cooking",
              "gardening",
              "medicine",
              "painting"
            ],
            context: "تعمل فاطمة ممرضة في مستشفى الأطفال. هي تحب رعاية المرضى ومساعدتهم على الشفاء.",
            subQuestions: [
              {
                id: "ar-h-q2-1-v2",
                type: "gap_fill",
                prompt: "Fatma works as a...",
                marks: 1,
                acceptedAnswers: [
                  "nurse"
                ]
              },
              {
                id: "ar-h-q2-2-v2",
                type: "gap_fill",
                prompt: "Her workplace is a children's...",
                marks: 1,
                acceptedAnswers: [
                  "hospital"
                ]
              },
              {
                id: "ar-h-q2-3-v2",
                type: "gap_fill",
                prompt: "She enjoys helping patients...",
                marks: 1,
                acceptedAnswers: [
                  "heal",
                  "recover"
                ]
              }
            ]
          },
          {
            id: "ar-h-q3-v2",
            type: "short_answer",
            prompt: "Q3: Environment and Recycling in Arab Cities.",
            marks: 4,
            context: "تهتم مدن عربية كثيرة بإعادة التدوير وحماية البيئة. يقوم المواطنون بفصل الورق والبلاستيك لتقليل النفايات.",
            subQuestions: [
              {
                id: "ar-h-q3-1-v2",
                type: "short_answer",
                prompt: "What are many Arab cities focusing on?",
                marks: 1,
                acceptedAnswers: [
                  "Recycling and environmental protection",
                  "Recycling"
                ]
              },
              {
                id: "ar-h-q3-2-v2",
                type: "short_answer",
                prompt: "Identify two materials separated by citizens.",
                marks: 2,
                acceptedAnswers: [
                  "Paper and plastic"
                ]
              },
              {
                id: "ar-h-q3-3-v2",
                type: "short_answer",
                prompt: "What is the purpose of waste separation according to the text?",
                marks: 1,
                acceptedAnswers: [
                  "To reduce waste"
                ]
              }
            ]
          },
          {
            id: "ar-h-q4-v2",
            type: "short_answer",
            prompt: "Q4: Healthy Eating and Lifestyles.",
            marks: 3,
            context: "يتجنب العديد من الشباب تناول الأطعمة السريعة ويفضلون الطبخ في المنزل لضمان وجبات صحية.",
            subQuestions: [
              {
                id: "ar-h-q4-1-v2",
                type: "short_answer",
                prompt: "What kind of food are many young people avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Fast food",
                  "Junk food"
                ]
              },
              {
                id: "ar-h-q4-2-v2",
                type: "short_answer",
                prompt: "Where do they prefer to cook?",
                marks: 1,
                acceptedAnswers: [
                  "At home",
                  "Home"
                ]
              },
              {
                id: "ar-h-q4-3-v2",
                type: "short_answer",
                prompt: "Why do they prefer this cooking method?",
                marks: 1,
                acceptedAnswers: [
                  "To guarantee healthy meals",
                  "For healthy meals"
                ]
              }
            ]
          },
          {
            id: "ar-h-q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about Cairo metro.",
            marks: 3,
            context: "مترو القاهرة سريع ومزدحم ولكنه رخيص جداً. تستخدمه آلاف الطالبات والطلاب يومياً للوصول إلى الجامعات.",
            options: [
              "The metro is slow",
              "The metro is fast",
              "The metro is crowded",
              "Tickets are very expensive",
              "The metro is very cheap",
              "Only tourists use it",
              "It is closed on weekends",
              "It has no safety measures"
            ],
            acceptedAnswers: [
              "The metro is fast",
              "The metro is crowded",
              "The metro is very cheap"
            ]
          },
          {
            id: "ar-h-q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Layla's hobby.",
            marks: 3,
            context: "تتدرب ليلى على العزف على البيانو منذ خمس سنوات. هي تحب الموسيقى الكلاسيكية وتتمنى المشاركة في حفلة موسيقية كبرى.",
            subQuestions: [
              {
                id: "ar-h-q5b-1-v2",
                type: "short_answer",
                prompt: "What instrument does Layla play?",
                marks: 1,
                acceptedAnswers: [
                  "Piano"
                ]
              },
              {
                id: "ar-h-q5b-2-v2",
                type: "short_answer",
                prompt: "How long has she been practicing?",
                marks: 1,
                acceptedAnswers: [
                  "5 years",
                  "Five years"
                ]
              },
              {
                id: "ar-h-q5b-3-v2",
                type: "short_answer",
                prompt: "What style of music does she love?",
                marks: 1,
                acceptedAnswers: [
                  "Classical music",
                  "Classical"
                ]
              }
            ]
          },
          {
            id: "ar-h-q6-v2",
            type: "short_answer",
            prompt: "Q6: Modern Remote Working.",
            marks: 3,
            context: "الآن، يعمل الكثير من الموظفين عن بعد من منازلهم. يوفر هذا الأسلوب الوقت والجهد ويزيد من الإنتاجية.",
            subQuestions: [
              {
                id: "ar-h-q6-1-v2",
                type: "short_answer",
                prompt: "How do many employees work now?",
                marks: 1,
                acceptedAnswers: [
                  "Remotely",
                  "From home",
                  "From their homes"
                ]
              },
              {
                id: "ar-h-q6-2-v2",
                type: "short_answer",
                prompt: "Name two things saved by this working style.",
                marks: 1,
                acceptedAnswers: [
                  "Time and effort",
                  "Effort and time"
                ]
              },
              {
                id: "ar-h-q6-3-v2",
                type: "short_answer",
                prompt: "What positive business outcome is increased?",
                marks: 1,
                acceptedAnswers: [
                  "Productivity"
                ]
              }
            ]
          },
          {
            id: "ar-h-q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Sports Championship in Dubai.",
            marks: 3,
            context: "أقيمت بطولة جري كبيرة في دبي الأسبوع الماضي. شارك فيها أكثر من ألف عداء رغم درجات الحرارة المرتفعة.",
            subQuestions: [
              {
                id: "ar-h-q7-1-v2",
                type: "multiple_choice",
                prompt: "What event was organized in Dubai last week?",
                marks: 1,
                options: [
                  "Swimming gala",
                  "Running championship",
                  "Tennis match",
                  "Football cup"
                ],
                acceptedAnswers: [
                  "Running championship"
                ]
              },
              {
                id: "ar-h-q7-2-v2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "More than 100",
                  "More than 500",
                  "More than 1,000",
                  "More than 10,000"
                ],
                acceptedAnswers: [
                  "More than 1,000"
                ]
              },
              {
                id: "ar-h-q7-3-v2",
                type: "multiple_choice",
                prompt: "What was the environmental challenge?",
                marks: 1,
                options: [
                  "Cold rain",
                  "High temperatures",
                  "Heavy snow",
                  "Fog"
                ],
                acceptedAnswers: [
                  "High temperatures"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-ar-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "في عطلة نهاية الأسبوع الماضي، قررت الذهاب إلى الساحل مع زملائي في الدراسة. كان الجو حاراً جداً، ولذلك سبحنا في البحر لعدة ساعات. أعتقد أنه من الضروري الاسترخاء بعد أسبوع متعب في المدرسة، لأن الامتحانات النهائية تسبب الكثير من التوتر وتتطلب تركيزاً كبيراً.",
        questions: [
          {
            id: "ar-h-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "he-read-h-101",
    paperCode: "1HE0/3H",
    language: "Modern Hebrew",
    tier: "higher",
    theme: "LOCAL_AREA",
    title: "Paper 3: Reading (Higher Tier) - מגורים וסביבה",
    totalMarks: 104,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-he",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "he-h-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Dana's house.",
            marks: 3,
            context: "דנה גרה בדירה קטנה בתל אביב. הדירה שלה קרובה מאוד לעבודה שלה, אז היא הולכת ברגל בכל יום.",
            subQuestions: [
              {
                id: "he-h-q1-1",
                type: "multiple_choice",
                prompt: "Where does Dana live?",
                marks: 1,
                options: [
                  "Jerusalem",
                  "Tel Aviv",
                  "Haifa",
                  "Eilat"
                ],
                acceptedAnswers: [
                  "Tel Aviv"
                ]
              },
              {
                id: "he-h-q1-2",
                type: "multiple_choice",
                prompt: "What size is her apartment?",
                marks: 1,
                options: [
                  "Very big",
                  "Small",
                  "Huge",
                  "Luxury"
                ],
                acceptedAnswers: [
                  "Small"
                ]
              },
              {
                id: "he-h-q1-3",
                type: "multiple_choice",
                prompt: "How does she get to work?",
                marks: 1,
                options: [
                  "By bus",
                  "By car",
                  "On foot",
                  "By train"
                ],
                acceptedAnswers: [
                  "On foot"
                ]
              }
            ]
          },
          {
            id: "he-h-q2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Michael's volunteering.",
            marks: 3,
            options: [
              "teaching",
              "cooking",
              "animals",
              "technology",
              "painting"
            ],
            context: "מיכאל מתנדב במקלט לבעלי חיים בכל יום שישי. הוא אוהב לטפל בכלבים ובחתולים שמחפשים בית חם.",
            subQuestions: [
              {
                id: "he-h-q2-1",
                type: "gap_fill",
                prompt: "Michael volunteers at a shelter for...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "he-h-q2-2",
                type: "gap_fill",
                prompt: "He volunteers on which day?",
                marks: 1,
                acceptedAnswers: [
                  "Friday"
                ]
              },
              {
                id: "he-h-q2-3",
                type: "gap_fill",
                prompt: "He primarily cares for dogs and...",
                marks: 1,
                acceptedAnswers: [
                  "cats"
                ]
              }
            ]
          },
          {
            id: "he-h-q3",
            type: "short_answer",
            prompt: "Q3: Environmental Awareness in Cities.",
            marks: 4,
            context: "בערים רבות בישראל יש כיום מודעות גדולה לאיכות הסביבה. התושבים ממחזרים פלסטיק ונייר כדי להפחית את הזיהום.",
            subQuestions: [
              {
                id: "he-h-q3-1",
                type: "short_answer",
                prompt: "What is there high awareness of in Israeli cities?",
                marks: 1,
                acceptedAnswers: [
                  "The environment",
                  "Environmental quality"
                ]
              },
              {
                id: "he-h-q3-2",
                type: "short_answer",
                prompt: "Which two materials do residents recycle?",
                marks: 2,
                acceptedAnswers: [
                  "Plastic and paper"
                ]
              },
              {
                id: "he-h-q3-3",
                type: "short_answer",
                prompt: "What is the goal of this recycling?",
                marks: 1,
                acceptedAnswers: [
                  "To reduce pollution",
                  "Reduce pollution"
                ]
              }
            ]
          },
          {
            id: "he-h-q4",
            type: "short_answer",
            prompt: "Q4: Healthy Eating Trends.",
            marks: 3,
            context: "ישראלים רבים נמנעים מאוכל מהיר ומעדיפים לאכול פירות וירקות טריים כדי לשמור على בריאותם.",
            subQuestions: [
              {
                id: "he-h-q4-1",
                type: "short_answer",
                prompt: "What type of food are many Israelis avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Fast food",
                  "Junk food"
                ]
              },
              {
                id: "he-h-q4-2",
                type: "short_answer",
                prompt: "What healthy items do they prefer instead?",
                marks: 1,
                acceptedAnswers: [
                  "Fresh fruit and vegetables",
                  "Fruits and vegetables"
                ]
              },
              {
                id: "he-h-q4-3",
                type: "short_answer",
                prompt: "What is their goal in changing their diet?",
                marks: 1,
                acceptedAnswers: [
                  "Keep healthy",
                  "Protect their health"
                ]
              }
            ]
          },
          {
            id: "he-h-q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about Jerusalem rail.",
            marks: 3,
            context: "הרכבת הקלה בירושלים היא מהירה ונקייה מאוד. אלפי סטודנטים משתמשים בה בכל יום כדי להגיע לאוניברסיטה בזול.",
            options: [
              "The light rail is slow",
              "The light rail is fast",
              "The light rail is very clean",
              "Tickets are extremely expensive",
              "Students use it to travel cheaply",
              "It is only used by tourists",
              "The rail is closed during summer",
              "It is very dirty and noisy"
            ],
            acceptedAnswers: [
              "The light rail is fast",
              "The light rail is very clean",
              "Students use it to travel cheaply"
            ]
          },
          {
            id: "he-h-q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Noam's musical hobby.",
            marks: 3,
            context: "נועם מנגן בכינור כבר שש שנים. הוא מתאמן כל יום ומקווה להצטרף לתזמורת המקומית בקרוב.",
            subQuestions: [
              {
                id: "he-h-q5b-1",
                type: "short_answer",
                prompt: "What instrument does Noam play?",
                marks: 1,
                acceptedAnswers: [
                  "Violin"
                ]
              },
              {
                id: "he-h-q5b-2",
                type: "short_answer",
                prompt: "How long has he been playing?",
                marks: 1,
                acceptedAnswers: [
                  "6 years",
                  "Six years"
                ]
              },
              {
                id: "he-h-q5b-3",
                type: "short_answer",
                prompt: "What is his near-future ambition?",
                marks: 1,
                acceptedAnswers: [
                  "Join the local orchestra",
                  "To join local orchestra"
                ]
              }
            ]
          },
          {
            id: "he-h-q6",
            type: "short_answer",
            prompt: "Q6: Work and Telecommuting.",
            marks: 3,
            context: "כיום, עובדים רבים עוברים לעבודה מהבית. צעד זה חוסך זמן נסיעה יקר ומאפשר איזון טוב יותר בין עבודה למשפחה.",
            subQuestions: [
              {
                id: "he-h-q6-1",
                type: "short_answer",
                prompt: "Where are many employees working from nowadays?",
                marks: 1,
                acceptedAnswers: [
                  "From home",
                  "Home"
                ]
              },
              {
                id: "he-h-q6-2",
                type: "short_answer",
                prompt: "What valuable resource does this save?",
                marks: 1,
                acceptedAnswers: [
                  "Travel time",
                  "Commuting time"
                ]
              },
              {
                id: "he-h-q6-3",
                type: "short_answer",
                prompt: "What lifestyle balance is improved?",
                marks: 1,
                acceptedAnswers: [
                  "Between work and family",
                  "Work and family"
                ]
              }
            ]
          },
          {
            id: "he-h-q7",
            type: "multiple_choice",
            prompt: "Q7: Sports Event in Tel Aviv.",
            marks: 3,
            context: "מרוץ הלילה של תל אביב התקיים בשבוע שעבר. מעל עשרת אלפים רצים השתתפו למרות מזג האוויר החם.",
            subQuestions: [
              {
                id: "he-h-q7-1",
                type: "multiple_choice",
                prompt: "What event took place last week?",
                marks: 1,
                options: [
                  "A cycling race",
                  "A night race",
                  "A tennis tournament",
                  "A swimming match"
                ],
                acceptedAnswers: [
                  "A night race"
                ]
              },
              {
                id: "he-h-q7-2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "Over 1,000",
                  "Over 5,000",
                  "Over 10,000",
                  "Over 20,000"
                ],
                acceptedAnswers: [
                  "Over 10,000"
                ]
              },
              {
                id: "he-h-q7-3",
                type: "multiple_choice",
                prompt: "What was the major climate challenge?",
                marks: 1,
                options: [
                  "Cold rain",
                  "Heavy snow",
                  "Hot weather",
                  "Fog"
                ],
                acceptedAnswers: [
                  "Hot weather"
                ]
              }
            ]
          },
          {
            id: "he-h-q8",
            type: "short_answer",
            prompt: "Q8: Music Festivals in Israel.",
            marks: 3,
            context: "פסטיבל הג׳אז באילת מושך אליו מוזיקאים מכל העולם. הוא מתקיים בנמל אילת תחת כיפת השמיים בכל קיץ.",
            subQuestions: [
              {
                id: "he-h-q8-1",
                type: "short_answer",
                prompt: "Where is the Jazz Festival held?",
                marks: 1,
                acceptedAnswers: [
                  "Eilat",
                  "Port of Eilat"
                ]
              },
              {
                id: "he-h-q8-2",
                type: "short_answer",
                prompt: "When does the festival take place?",
                marks: 1,
                acceptedAnswers: [
                  "Summer",
                  "Every summer",
                  "In summer"
                ]
              },
              {
                id: "he-h-q8-3",
                type: "short_answer",
                prompt: "Who does the festival attract?",
                marks: 1,
                acceptedAnswers: [
                  "Musicians from all over the world",
                  "International musicians",
                  "Musicians"
                ]
              }
            ]
          },
          {
            id: "he-h-q9",
            type: "multiple_choice",
            prompt: "Q9: Museum Exhibits.",
            marks: 3,
            context: "מוזיאון ישראל בירושלים מציג תערוכה חדשה של אמנות מודרנית. התערוכה פתוחה לקהל הרחב עד סוף השנה והכניסה לילדים היא בחינם.",
            subQuestions: [
              {
                id: "he-h-q9-1",
                type: "multiple_choice",
                prompt: "What type of exhibition is being shown?",
                marks: 1,
                options: [
                  "Ancient history",
                  "Modern art",
                  "Photography",
                  "Sculpture"
                ],
                acceptedAnswers: [
                  "Modern art"
                ]
              },
              {
                id: "he-h-q9-2",
                type: "multiple_choice",
                prompt: "Who can enter for free?",
                marks: 1,
                options: [
                  "Everyone",
                  "Students",
                  "Children",
                  "Elderly"
                ],
                acceptedAnswers: [
                  "Children"
                ]
              },
              {
                id: "he-h-q9-3",
                type: "multiple_choice",
                prompt: "How long is the exhibition open?",
                marks: 1,
                options: [
                  "Until next week",
                  "Until the end of the year",
                  "For one month",
                  "Indefinitely"
                ],
                acceptedAnswers: [
                  "Until the end of the year"
                ]
              }
            ]
          },
          {
            id: "he-h-q10",
            type: "short_answer",
            prompt: "Q10: Water Conservation in Israel.",
            marks: 3,
            context: "בגלל מחסור במים, ישראל פיתחה טכנולוגיות מתקדמות להתפלת מי ים. כיום, רוב מי השתייה בבתים מגיעים ממפעלי התפלה לאורך החוף.",
            subQuestions: [
              {
                id: "he-h-q10-1",
                type: "short_answer",
                prompt: "Why did Israel develop desalination technologies?",
                marks: 1,
                acceptedAnswers: [
                  "Water shortage",
                  "Lack of water",
                  "Water scarcity"
                ]
              },
              {
                id: "he-h-q10-2",
                type: "short_answer",
                prompt: "From where do most household drinking waters originate now?",
                marks: 1,
                acceptedAnswers: [
                  "Desalination plants",
                  "Sea water desalination"
                ]
              },
              {
                id: "he-h-q10-3",
                type: "short_answer",
                prompt: "Where are these desalination plants located?",
                marks: 1,
                acceptedAnswers: [
                  "Along the coast",
                  "On the beach",
                  "On the shore"
                ]
              }
            ]
          },
          {
            id: "he-h-q11",
            type: "word_bank",
            prompt: "Q11: High-Tech Industry in Tel Aviv.",
            marks: 3,
            options: [
              "technology",
              "Wadi",
              "applications",
              "money",
              "cities"
            ],
            context: "תעשיית ההייטק בתל אביב נקראת לעיתים קרובות 'סיליקון ואדי'. חברות סטארט-אפ רבות מפתחות כאן אפליקציות חכמות המייעלות את החיים.",
            subQuestions: [
              {
                id: "he-h-q11-1",
                type: "gap_fill",
                prompt: "Tel Aviv is famous for its high-tech...",
                marks: 1,
                acceptedAnswers: [
                  "technology"
                ]
              },
              {
                id: "he-h-q11-2",
                type: "gap_fill",
                prompt: "The industry is nicknamed Silicon...",
                marks: 1,
                acceptedAnswers: [
                  "Wadi"
                ]
              },
              {
                id: "he-h-q11-3",
                type: "gap_fill",
                prompt: "Start-up firms create smart...",
                marks: 1,
                acceptedAnswers: [
                  "applications"
                ]
              }
            ]
          },
          {
            id: "he-h-q12",
            type: "short_answer",
            prompt: "Q12: Volunteering in MDA.",
            marks: 3,
            context: "בני נוער רבים בישראל מתנדבים במד״א כחובשים ועוזרי הצלה. הם עוברים קורס אינטנסיבי של עזרה ראשונה לפני שהם מתחילים לעבוד באמבולנסים.",
            subQuestions: [
              {
                id: "he-h-q12-1",
                type: "short_answer",
                prompt: "In which organization do many Israeli teenagers volunteer?",
                marks: 1,
                acceptedAnswers: [
                  "MDA",
                  "Magen David Adom"
                ]
              },
              {
                id: "he-h-q12-2",
                type: "short_answer",
                prompt: "What roles do they perform?",
                marks: 1,
                acceptedAnswers: [
                  "Medics and rescue assistants",
                  "First-aiders",
                  "Rescue assistants"
                ]
              },
              {
                id: "he-h-q12-3",
                type: "short_answer",
                prompt: "What must they complete before working on ambulances?",
                marks: 1,
                acceptedAnswers: [
                  "First aid course",
                  "An intensive first aid course"
                ]
              }
            ]
          },
          {
            id: "he-h-q13",
            type: "multiple_choice",
            prompt: "Q13: Ramon Crater.",
            marks: 3,
            context: "מכתש רמון בנגב הוא המכתש השחיקתי הגדול בעולם. תיירים רבים מגיעים לשם כדי ליהנות מהנוף המדברי המרהיב ומצפייה בכוכבים בלילה.",
            subQuestions: [
              {
                id: "he-h-q13-1",
                type: "multiple_choice",
                prompt: "Where is Makhtesh Ramon located?",
                marks: 1,
                options: [
                  "Galilee",
                  "Golan Heights",
                  "Negev desert",
                  "Coastal plain"
                ],
                acceptedAnswers: [
                  "Negev desert"
                ]
              },
              {
                id: "he-h-q13-2",
                type: "multiple_choice",
                prompt: "What type of landscape attracts tourists there?",
                marks: 1,
                options: [
                  "Forest",
                  "Desert",
                  "Snowy mountains",
                  "Lakes"
                ],
                acceptedAnswers: [
                  "Desert"
                ]
              },
              {
                id: "he-h-q13-3",
                type: "multiple_choice",
                prompt: "What popular night activity is mentioned?",
                marks: 1,
                options: [
                  "Night clubs",
                  "Stargazing",
                  "Night swimming",
                  "Campfires"
                ],
                acceptedAnswers: [
                  "Stargazing"
                ]
              }
            ]
          },
          {
            id: "he-h-q14",
            type: "short_answer",
            prompt: "Q14: The Hebrew Language Academy.",
            marks: 3,
            context: "האקדמיה ללשון העברית בירושלים ממציאה מילים חדשות בכל שנה כדי להתאים את השפה העתיקה לעולם המודרני המשתנה במהירות.",
            subQuestions: [
              {
                id: "he-h-q14-1",
                type: "short_answer",
                prompt: "What is the role of the Hebrew Language Academy?",
                marks: 1,
                acceptedAnswers: [
                  "Invent new words",
                  "Create new words"
                ]
              },
              {
                id: "he-h-q14-2",
                type: "short_answer",
                prompt: "Where is this academy located?",
                marks: 1,
                acceptedAnswers: [
                  "Jerusalem"
                ]
              },
              {
                id: "he-h-q14-3",
                type: "short_answer",
                prompt: "Why does it invent new words?",
                marks: 1,
                acceptedAnswers: [
                  "Adapt to the rapidly changing modern world",
                  "Modernize the language"
                ]
              }
            ]
          },
          {
            id: "he-h-q15",
            type: "table_completion",
            prompt: "Q15: Agricultural Innovation - Kibbutz Arava.",
            marks: 3,
            context: "קיבוץ בערבה מגדל ירקות איכותיים בלב המדבר בעזרת מערכות השקיה ממוחשבות המונעות בזבוז מים.",
            subQuestions: [
              {
                id: "he-h-q15-1",
                type: "short_answer",
                prompt: "Where is the kibbutz located?",
                marks: 1,
                acceptedAnswers: [
                  "Arava",
                  "In the Arava desert"
                ]
              },
              {
                id: "he-h-q15-2",
                type: "short_answer",
                prompt: "What do they grow there?",
                marks: 1,
                acceptedAnswers: [
                  "High-quality vegetables",
                  "Vegetables"
                ]
              },
              {
                id: "he-h-q15-3",
                type: "short_answer",
                prompt: "How do their computer-controlled irrigation systems help the environment?",
                marks: 1,
                acceptedAnswers: [
                  "Prevent water waste",
                  "Save water"
                ]
              }
            ]
          },
          {
            id: "he-h-q16",
            type: "short_answer",
            prompt: "Q16: Eilat Coral Reef Preservation.",
            marks: 3,
            context: "שמורת חוף האלמוגים באילת מוגנת בקפידה על ידי פקחים. חל איסור מוחלט לגעת באלמוגים או להאכיל את דגי השונית הצבעוניים.",
            subQuestions: [
              {
                id: "he-h-q16-1",
                type: "short_answer",
                prompt: "Who protects the Eilat Coral Reef?",
                marks: 1,
                acceptedAnswers: [
                  "Rangers",
                  "Inspectors",
                  "Coral reef inspectors"
                ]
              },
              {
                id: "he-h-q16-2",
                type: "short_answer",
                prompt: "What is strictly forbidden regarding corals?",
                marks: 1,
                acceptedAnswers: [
                  "Touching them",
                  "To touch corals",
                  "Touching"
                ]
              },
              {
                id: "he-h-q16-3",
                type: "short_answer",
                prompt: "What is prohibited regarding reef fish?",
                marks: 1,
                acceptedAnswers: [
                  "Feeding them",
                  "To feed reef fish",
                  "Feeding"
                ]
              }
            ]
          },
          {
            id: "he-h-q17",
            type: "multiple_choice",
            prompt: "Q17: Bicycle Sharing in Tel Aviv.",
            marks: 3,
            context: "מערכת השכרת האופניים 'תל-אופן' פופולרית מאוד בקרב תושבים ומבקרים כאחד. היא מסייעת בהפחתת עומסי התנועה ובמניעת זיהום אוויר.",
            subQuestions: [
              {
                id: "he-h-q17-1",
                type: "multiple_choice",
                prompt: "What is the name of the bicycle sharing system?",
                marks: 1,
                options: [
                  "Metro-Bike",
                  "Tel-O-Fun",
                  "Tel-Aviv Wheel",
                  "Eco-Ride"
                ],
                acceptedAnswers: [
                  "Tel-O-Fun"
                ]
              },
              {
                id: "he-h-q17-2",
                type: "multiple_choice",
                prompt: "Who uses this system?",
                marks: 1,
                options: [
                  "Only tourists",
                  "Only children",
                  "Residents and visitors",
                  "Only students"
                ],
                acceptedAnswers: [
                  "Residents and visitors"
                ]
              },
              {
                id: "he-h-q17-3",
                type: "multiple_choice",
                prompt: "Name one benefit of this system.",
                marks: 1,
                options: [
                  "Reducing traffic congestion",
                  "Cheap food",
                  "Faster trains",
                  "Free parking"
                ],
                acceptedAnswers: [
                  "Reducing traffic congestion"
                ]
              }
            ]
          },
          {
            id: "he-h-q18",
            type: "short_answer",
            prompt: "Q18: The National Library of Israel.",
            marks: 3,
            context: "הספרייה הלאומית החדשה בירושלים נפתחה לציבור ומכילה מיליוני ספרים וכתבי יד עתיקים של העם היהודי.",
            subQuestions: [
              {
                id: "he-h-q18-1",
                type: "short_answer",
                prompt: "What is the name of the new institution opened in Jerusalem?",
                marks: 1,
                acceptedAnswers: [
                  "The National Library of Israel",
                  "National Library"
                ]
              },
              {
                id: "he-h-q18-2",
                type: "short_answer",
                prompt: "What does it contain?",
                marks: 1,
                acceptedAnswers: [
                  "Millions of books and ancient manuscripts",
                  "Books and manuscripts"
                ]
              },
              {
                id: "he-h-q18-3",
                type: "short_answer",
                prompt: "To which group of people do the manuscripts belong?",
                marks: 1,
                acceptedAnswers: [
                  "The Jewish people",
                  "Jewish people"
                ]
              }
            ]
          },
          {
            id: "he-h-q19",
            type: "word_bank",
            prompt: "Q19: Technion Space Program.",
            marks: 3,
            options: [
              "space",
              "satellites",
              "radiation",
              "oceans",
              "stars"
            ],
            context: "סטודנטים בטכניון בחיפה מתכננים ומשגרים לוויינים זעירים לחלל החיצון כדי לחקור את השפעות הקרינה הקוסמית.",
            subQuestions: [
              {
                id: "he-h-q19-1",
                type: "gap_fill",
                prompt: "The students at the Technion are launching miniature...",
                marks: 1,
                acceptedAnswers: [
                  "satellites"
                ]
              },
              {
                id: "he-h-q19-2",
                type: "gap_fill",
                prompt: "These satellites are launched into outer...",
                marks: 1,
                acceptedAnswers: [
                  "space"
                ]
              },
              {
                id: "he-h-q19-3",
                type: "gap_fill",
                prompt: "Their mission is to research the effects of cosmic...",
                marks: 1,
                acceptedAnswers: [
                  "radiation"
                ]
              }
            ]
          },
          {
            id: "he-h-q20",
            type: "short_answer",
            prompt: "Q20: Sea Turtles Rescue Center.",
            marks: 3,
            context: "המרכז להצלת צבי ים במכמורת מטפל בצבים פצועים שנפגעו מרשתות דייגים או פלסטיק בים, ומחזיר אותם לטבע לאחר החלמה מלאה.",
            subQuestions: [
              {
                id: "he-h-q20-1",
                type: "short_answer",
                prompt: "Where is the Sea Turtle Rescue Center located?",
                marks: 1,
                acceptedAnswers: [
                  "Michmoret"
                ]
              },
              {
                id: "he-h-q20-2",
                type: "short_answer",
                prompt: "What are the two causes of injury to the turtles?",
                marks: 1,
                acceptedAnswers: [
                  "Fishing nets or plastic in the sea",
                  "Fishing nets and plastic"
                ]
              },
              {
                id: "he-h-q20-3",
                type: "short_answer",
                prompt: "What is done with the turtles after they recover?",
                marks: 1,
                acceptedAnswers: [
                  "Returned to the wild",
                  "Released into nature",
                  "Returned to nature"
                ]
              }
            ]
          },
          {
            id: "he-h-q21",
            type: "multiple_choice",
            prompt: "Q21: Mount Hermon Ski Resort.",
            marks: 3,
            context: "אתר החרמון הוא אתר הסקי היחיד בישראל. בחורף מגיעים אלפי מבקרים לגלוש בשלג, ובקיץ הם נהנים מסיורים מודרכים ומנוף הררי ירוק.",
            subQuestions: [
              {
                id: "he-h-q21-1",
                type: "multiple_choice",
                prompt: "What makes Mount Hermon unique in Israel?",
                marks: 1,
                options: [
                  "It is the tallest building",
                  "It is the only ski resort",
                  "It is an active volcano",
                  "It has no water"
                ],
                acceptedAnswers: [
                  "It is the only ski resort"
                ]
              },
              {
                id: "he-h-q21-2",
                type: "multiple_choice",
                prompt: "What do visitors do there in winter?",
                marks: 1,
                options: [
                  "Swim",
                  "Ski/surf in snow",
                  "Camp",
                  "Sail"
                ],
                acceptedAnswers: [
                  "Ski/surf in snow"
                ]
              },
              {
                id: "he-h-q21-3",
                type: "multiple_choice",
                prompt: "What is a popular activity there during summer?",
                marks: 1,
                options: [
                  "Snowboarding",
                  "Guided tours",
                  "Ice skating",
                  "Sunbathing"
                ],
                acceptedAnswers: [
                  "Guided tours"
                ]
              }
            ]
          },
          {
            id: "he-h-q22",
            type: "short_answer",
            prompt: "Q22: Solar Energy in the Negev.",
            marks: 3,
            context: "תחנת הכוח הסולארית באשלים משתמשת באלפי מראות כדי לרכז את קרני השמש ולייצר חשמל נקי עבור עשרות אלפי בתים בישראל.",
            subQuestions: [
              {
                id: "he-h-q22-1",
                type: "short_answer",
                prompt: "Where is the solar power station located?",
                marks: 1,
                acceptedAnswers: [
                  "Ashalim",
                  "In Ashalim"
                ]
              },
              {
                id: "he-h-q22-2",
                type: "short_answer",
                prompt: "What technology does it use to concentrate solar rays?",
                marks: 1,
                acceptedAnswers: [
                  "Thousands of mirrors",
                  "Mirrors",
                  "Thousands of mirrors / mirrors"
                ]
              },
              {
                id: "he-h-q22-3",
                type: "short_answer",
                prompt: "What is produced by this station?",
                marks: 1,
                acceptedAnswers: [
                  "Clean electricity",
                  "Power",
                  "Clean power"
                ]
              }
            ]
          },
          {
            id: "he-h-q23",
            type: "short_answer",
            prompt: "Q23: Preservation of Bauhaus Architecture in Tel Aviv.",
            marks: 3,
            context: "העיר הלבנה בתל אביב הוכרזה כאתר מורשת עולמית של אונסק״ו בשל אלפי בנייני באוהאוס שנבנו בשנות השלושים ומשומרים כיום בקפידה.",
            subQuestions: [
              {
                id: "he-h-q23-1",
                type: "short_answer",
                prompt: "What nickname is given to Tel Aviv's UNESCO heritage area?",
                marks: 1,
                acceptedAnswers: [
                  "The White City",
                  "White City"
                ]
              },
              {
                id: "he-h-q23-2",
                type: "short_answer",
                prompt: "What architectural style is preserved there?",
                marks: 1,
                acceptedAnswers: [
                  "Bauhaus",
                  "Bauhaus style"
                ]
              },
              {
                id: "he-h-q23-3",
                type: "short_answer",
                prompt: "When were these buildings originally constructed?",
                marks: 1,
                acceptedAnswers: [
                  "The 1930s",
                  "In the 1930s",
                  "1930s"
                ]
              }
            ]
          },
          {
            id: "he-h-q24",
            type: "table_completion",
            prompt: "Q24: Traditional Crafts - Druze Villages.",
            marks: 3,
            context: "בכפרים דרוזים בגליל, נשים רבות עוסקות באריגה מסורתית של שטיחים צבעוניים ובמכירת מאכלים אותנטיים לתיירים המבקרים באזור.",
            subQuestions: [
              {
                id: "he-h-q24-1",
                type: "short_answer",
                prompt: "In which region are these Druze villages located?",
                marks: 1,
                acceptedAnswers: [
                  "Galilee",
                  "The Galilee"
                ]
              },
              {
                id: "he-h-q24-2",
                type: "short_answer",
                prompt: "What traditional craft do the women practice?",
                marks: 1,
                acceptedAnswers: [
                  "Traditional weaving of colorful rugs/carpets",
                  "Weaving carpets",
                  "Weaving colorful rugs"
                ]
              },
              {
                id: "he-h-q24-3",
                type: "short_answer",
                prompt: "What do they sell to visiting tourists?",
                marks: 1,
                acceptedAnswers: [
                  "Authentic foods",
                  "Traditional foods",
                  "Authentic food"
                ]
              }
            ]
          },
          {
            id: "he-h-q25",
            type: "short_answer",
            prompt: "Q25: The Dead Sea Scroll Conservation.",
            marks: 3,
            context: "מומחים במוזיאון ישראל משתמשים בצילום מולטי-ספקטרלי מיוחד כדי לקרוא קטעים דהויים במגילות מדבר יהודה העתיקות מבלי לפגוע בהן.",
            subQuestions: [
              {
                id: "he-h-q25-1",
                type: "short_answer",
                prompt: "Where are the Dead Sea Scrolls conserved and researched?",
                marks: 1,
                acceptedAnswers: [
                  "The Israel Museum",
                  "Israel Museum"
                ]
              },
              {
                id: "he-h-q25-2",
                type: "short_answer",
                prompt: "What modern technology is used to read the faded scroll fragments?",
                marks: 1,
                acceptedAnswers: [
                  "Multi-spectral photography",
                  "Special photography"
                ]
              },
              {
                id: "he-h-q25-3",
                type: "short_answer",
                prompt: "What is the benefit of this technology?",
                marks: 1,
                acceptedAnswers: [
                  "Reads faded text without damaging the scrolls",
                  "Prevents damage to the scrolls",
                  "No damage"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-he",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "בסוף השבוע שעבר החלטתי ללכת לחוף הים עם חבריי לכיתה. היה חום כבד, ולכן שחינו בים במשך שעות. אני חושב שזה חיוני להירגע אחרי שבוע מעייף בבית הספר, מכיוון שבחינות הגמר הן מלחיצות ביותר ודורשות ריכוז רב.",
        questions: [
          {
            id: "he-h-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "he-read-h-101-v2",
    paperCode: "1HE0/3H",
    language: "Modern Hebrew",
    tier: "higher",
    theme: "LOCAL_AREA",
    title: "Paper 3: Reading (Higher Tier) - מגורים וסביבה (Set B)",
    totalMarks: 104,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-he-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "he-h-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer about Dana's house.",
            marks: 3,
            context: "דנה גרה בדירה קטנה בתל אביב. הדירה שלה קרובה מאוד לעבודה שלה, אז היא הולכת ברגל בכל יום.",
            subQuestions: [
              {
                id: "he-h-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Dana live?",
                marks: 1,
                options: [
                  "Jerusalem",
                  "Tel Aviv",
                  "Haifa",
                  "Eilat"
                ],
                acceptedAnswers: [
                  "Tel Aviv"
                ]
              },
              {
                id: "he-h-q1-2-v2",
                type: "multiple_choice",
                prompt: "What size is her apartment?",
                marks: 1,
                options: [
                  "Very big",
                  "Small",
                  "Huge",
                  "Luxury"
                ],
                acceptedAnswers: [
                  "Small"
                ]
              },
              {
                id: "he-h-q1-3-v2",
                type: "multiple_choice",
                prompt: "How does she get to work?",
                marks: 1,
                options: [
                  "By bus",
                  "By car",
                  "On foot",
                  "By train"
                ],
                acceptedAnswers: [
                  "On foot"
                ]
              }
            ]
          },
          {
            id: "he-h-q2-v2",
            type: "word_bank",
            prompt: "Q2: Complete the sentences about Michael's volunteering.",
            marks: 3,
            options: [
              "teaching",
              "cooking",
              "animals",
              "technology",
              "painting"
            ],
            context: "מיכאל מתנדב במקלט לבעלי חיים בכל יום שישי. הוא אוהב לטפל בכלבים ובחתולים שמחפשים בית חם.",
            subQuestions: [
              {
                id: "he-h-q2-1-v2",
                type: "gap_fill",
                prompt: "Michael volunteers at a shelter for...",
                marks: 1,
                acceptedAnswers: [
                  "animals"
                ]
              },
              {
                id: "he-h-q2-2-v2",
                type: "gap_fill",
                prompt: "He volunteers on which day?",
                marks: 1,
                acceptedAnswers: [
                  "Friday"
                ]
              },
              {
                id: "he-h-q2-3-v2",
                type: "gap_fill",
                prompt: "He primarily cares for dogs and...",
                marks: 1,
                acceptedAnswers: [
                  "cats"
                ]
              }
            ]
          },
          {
            id: "he-h-q3-v2",
            type: "short_answer",
            prompt: "Q3: Environmental Awareness in Cities.",
            marks: 4,
            context: "בערים רבות בישראל יש כיום מודעות גדולה לאיכות הסביבה. התושבים ממחזרים פלסטיק ונייר כדי להפחית את הזיהום.",
            subQuestions: [
              {
                id: "he-h-q3-1-v2",
                type: "short_answer",
                prompt: "What is there high awareness of in Israeli cities?",
                marks: 1,
                acceptedAnswers: [
                  "The environment",
                  "Environmental quality"
                ]
              },
              {
                id: "he-h-q3-2-v2",
                type: "short_answer",
                prompt: "Which two materials do residents recycle?",
                marks: 2,
                acceptedAnswers: [
                  "Plastic and paper"
                ]
              },
              {
                id: "he-h-q3-3-v2",
                type: "short_answer",
                prompt: "What is the goal of this recycling?",
                marks: 1,
                acceptedAnswers: [
                  "To reduce pollution",
                  "Reduce pollution"
                ]
              }
            ]
          },
          {
            id: "he-h-q4-v2",
            type: "short_answer",
            prompt: "Q4: Healthy Eating Trends.",
            marks: 3,
            context: "ישראלים רבים נמנעים מאוכל מהיר ומעדיפים לאכול פירות וירקות טריים כדי לשמור على בריאותם.",
            subQuestions: [
              {
                id: "he-h-q4-1-v2",
                type: "short_answer",
                prompt: "What type of food are many Israelis avoiding?",
                marks: 1,
                acceptedAnswers: [
                  "Fast food",
                  "Junk food"
                ]
              },
              {
                id: "he-h-q4-2-v2",
                type: "short_answer",
                prompt: "What healthy items do they prefer instead?",
                marks: 1,
                acceptedAnswers: [
                  "Fresh fruit and vegetables",
                  "Fruits and vegetables"
                ]
              },
              {
                id: "he-h-q4-3-v2",
                type: "short_answer",
                prompt: "What is their goal in changing their diet?",
                marks: 1,
                acceptedAnswers: [
                  "Keep healthy",
                  "Protect their health"
                ]
              }
            ]
          },
          {
            id: "he-h-q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE correct statements about Jerusalem rail.",
            marks: 3,
            context: "הרכבת הקלה בירושלים היא מהירה ונקייה מאוד. אלפי סטודנטים משתמשים בה בכל יום כדי להגיע לאוניברסיטה בזול.",
            options: [
              "The light rail is slow",
              "The light rail is fast",
              "The light rail is very clean",
              "Tickets are extremely expensive",
              "Students use it to travel cheaply",
              "It is only used by tourists",
              "The rail is closed during summer",
              "It is very dirty and noisy"
            ],
            acceptedAnswers: [
              "The light rail is fast",
              "The light rail is very clean",
              "Students use it to travel cheaply"
            ]
          },
          {
            id: "he-h-q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English about Noam's musical hobby.",
            marks: 3,
            context: "נועם מנגן בכינור כבר שש שנים. הוא מתאמן כל יום ומקווה להצטרף לתזמורת המקומית בקרוב.",
            subQuestions: [
              {
                id: "he-h-q5b-1-v2",
                type: "short_answer",
                prompt: "What instrument does Noam play?",
                marks: 1,
                acceptedAnswers: [
                  "Violin"
                ]
              },
              {
                id: "he-h-q5b-2-v2",
                type: "short_answer",
                prompt: "How long has he been playing?",
                marks: 1,
                acceptedAnswers: [
                  "6 years",
                  "Six years"
                ]
              },
              {
                id: "he-h-q5b-3-v2",
                type: "short_answer",
                prompt: "What is his near-future ambition?",
                marks: 1,
                acceptedAnswers: [
                  "Join the local orchestra",
                  "To join local orchestra"
                ]
              }
            ]
          },
          {
            id: "he-h-q6-v2",
            type: "short_answer",
            prompt: "Q6: Work and Telecommuting.",
            marks: 3,
            context: "כיום, עובדים רבים עוברים לעבודה מהבית. צעד זה חוסך זמן נסיעה יקר ומאפשר איזון טוב יותר בין עבודה למשפחה.",
            subQuestions: [
              {
                id: "he-h-q6-1-v2",
                type: "short_answer",
                prompt: "Where are many employees working from nowadays?",
                marks: 1,
                acceptedAnswers: [
                  "From home",
                  "Home"
                ]
              },
              {
                id: "he-h-q6-2-v2",
                type: "short_answer",
                prompt: "What valuable resource does this save?",
                marks: 1,
                acceptedAnswers: [
                  "Travel time",
                  "Commuting time"
                ]
              },
              {
                id: "he-h-q6-3-v2",
                type: "short_answer",
                prompt: "What lifestyle balance is improved?",
                marks: 1,
                acceptedAnswers: [
                  "Between work and family",
                  "Work and family"
                ]
              }
            ]
          },
          {
            id: "he-h-q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Sports Event in Tel Aviv.",
            marks: 3,
            context: "מרוץ הלילה של תל אביב התקיים בשבוע שעבר. מעל עשרת אלפים רצים השתתפו למרות מזג האוויר החם.",
            subQuestions: [
              {
                id: "he-h-q7-1-v2",
                type: "multiple_choice",
                prompt: "What event took place last week?",
                marks: 1,
                options: [
                  "A cycling race",
                  "A night race",
                  "A tennis tournament",
                  "A swimming match"
                ],
                acceptedAnswers: [
                  "A night race"
                ]
              },
              {
                id: "he-h-q7-2-v2",
                type: "multiple_choice",
                prompt: "How many runners participated?",
                marks: 1,
                options: [
                  "Over 1,000",
                  "Over 5,000",
                  "Over 10,000",
                  "Over 20,000"
                ],
                acceptedAnswers: [
                  "Over 10,000"
                ]
              },
              {
                id: "he-h-q7-3-v2",
                type: "multiple_choice",
                prompt: "What was the major climate challenge?",
                marks: 1,
                options: [
                  "Cold rain",
                  "Heavy snow",
                  "Hot weather",
                  "Fog"
                ],
                acceptedAnswers: [
                  "Hot weather"
                ]
              }
            ]
          },
          {
            id: "he-h-q8-v2",
            type: "short_answer",
            prompt: "Q8: Music Festivals in Israel.",
            marks: 3,
            context: "פסטיבל הג׳אז באילת מושך אליו מוזיקאים מכל העולם. הוא מתקיים בנמל אילת תחת כיפת השמיים בכל קיץ.",
            subQuestions: [
              {
                id: "he-h-q8-1-v2",
                type: "short_answer",
                prompt: "Where is the Jazz Festival held?",
                marks: 1,
                acceptedAnswers: [
                  "Eilat",
                  "Port of Eilat"
                ]
              },
              {
                id: "he-h-q8-2-v2",
                type: "short_answer",
                prompt: "When does the festival take place?",
                marks: 1,
                acceptedAnswers: [
                  "Summer",
                  "Every summer",
                  "In summer"
                ]
              },
              {
                id: "he-h-q8-3-v2",
                type: "short_answer",
                prompt: "Who does the festival attract?",
                marks: 1,
                acceptedAnswers: [
                  "Musicians from all over the world",
                  "International musicians",
                  "Musicians"
                ]
              }
            ]
          },
          {
            id: "he-h-q9-v2",
            type: "multiple_choice",
            prompt: "Q9: Museum Exhibits.",
            marks: 3,
            context: "מוזיאון ישראל בירושלים מציג תערוכה חדשה של אמנות מודרנית. התערוכה פתוחה לקהל הרחב עד סוף השנה והכניסה לילדים היא בחינם.",
            subQuestions: [
              {
                id: "he-h-q9-1-v2",
                type: "multiple_choice",
                prompt: "What type of exhibition is being shown?",
                marks: 1,
                options: [
                  "Ancient history",
                  "Modern art",
                  "Photography",
                  "Sculpture"
                ],
                acceptedAnswers: [
                  "Modern art"
                ]
              },
              {
                id: "he-h-q9-2-v2",
                type: "multiple_choice",
                prompt: "Who can enter for free?",
                marks: 1,
                options: [
                  "Everyone",
                  "Students",
                  "Children",
                  "Elderly"
                ],
                acceptedAnswers: [
                  "Children"
                ]
              },
              {
                id: "he-h-q9-3-v2",
                type: "multiple_choice",
                prompt: "How long is the exhibition open?",
                marks: 1,
                options: [
                  "Until next week",
                  "Until the end of the year",
                  "For one month",
                  "Indefinitely"
                ],
                acceptedAnswers: [
                  "Until the end of the year"
                ]
              }
            ]
          },
          {
            id: "he-h-q10-v2",
            type: "short_answer",
            prompt: "Q10: Water Conservation in Israel.",
            marks: 3,
            context: "בגלל מחסור במים, ישראל פיתחה טכנולוגיות מתקדמות להתפלת מי ים. כיום, רוב מי השתייה בבתים מגיעים ממפעלי התפלה לאורך החוף.",
            subQuestions: [
              {
                id: "he-h-q10-1-v2",
                type: "short_answer",
                prompt: "Why did Israel develop desalination technologies?",
                marks: 1,
                acceptedAnswers: [
                  "Water shortage",
                  "Lack of water",
                  "Water scarcity"
                ]
              },
              {
                id: "he-h-q10-2-v2",
                type: "short_answer",
                prompt: "From where do most household drinking waters originate now?",
                marks: 1,
                acceptedAnswers: [
                  "Desalination plants",
                  "Sea water desalination"
                ]
              },
              {
                id: "he-h-q10-3-v2",
                type: "short_answer",
                prompt: "Where are these desalination plants located?",
                marks: 1,
                acceptedAnswers: [
                  "Along the coast",
                  "On the beach",
                  "On the shore"
                ]
              }
            ]
          },
          {
            id: "he-h-q11-v2",
            type: "word_bank",
            prompt: "Q11: High-Tech Industry in Tel Aviv.",
            marks: 3,
            options: [
              "technology",
              "Wadi",
              "applications",
              "money",
              "cities"
            ],
            context: "תעשיית ההייטק בתל אביב נקראת לעיתים קרובות 'סיליקון ואדי'. חברות סטארט-אפ רבות מפתחות כאן אפליקציות חכמות המייעלות את החיים.",
            subQuestions: [
              {
                id: "he-h-q11-1-v2",
                type: "gap_fill",
                prompt: "Tel Aviv is famous for its high-tech...",
                marks: 1,
                acceptedAnswers: [
                  "technology"
                ]
              },
              {
                id: "he-h-q11-2-v2",
                type: "gap_fill",
                prompt: "The industry is nicknamed Silicon...",
                marks: 1,
                acceptedAnswers: [
                  "Wadi"
                ]
              },
              {
                id: "he-h-q11-3-v2",
                type: "gap_fill",
                prompt: "Start-up firms create smart...",
                marks: 1,
                acceptedAnswers: [
                  "applications"
                ]
              }
            ]
          },
          {
            id: "he-h-q12-v2",
            type: "short_answer",
            prompt: "Q12: Volunteering in MDA.",
            marks: 3,
            context: "בני נוער רבים בישראל מתנדבים במד״א כחובשים ועוזרי הצלה. הם עוברים קורס אינטנסיבי של עזרה ראשונה לפני שהם מתחילים לעבוד באמבולנסים.",
            subQuestions: [
              {
                id: "he-h-q12-1-v2",
                type: "short_answer",
                prompt: "In which organization do many Israeli teenagers volunteer?",
                marks: 1,
                acceptedAnswers: [
                  "MDA",
                  "Magen David Adom"
                ]
              },
              {
                id: "he-h-q12-2-v2",
                type: "short_answer",
                prompt: "What roles do they perform?",
                marks: 1,
                acceptedAnswers: [
                  "Medics and rescue assistants",
                  "First-aiders",
                  "Rescue assistants"
                ]
              },
              {
                id: "he-h-q12-3-v2",
                type: "short_answer",
                prompt: "What must they complete before working on ambulances?",
                marks: 1,
                acceptedAnswers: [
                  "First aid course",
                  "An intensive first aid course"
                ]
              }
            ]
          },
          {
            id: "he-h-q13-v2",
            type: "multiple_choice",
            prompt: "Q13: Ramon Crater.",
            marks: 3,
            context: "מכתש רמון בנגב הוא המכתש השחיקתי הגדול בעולם. תיירים רבים מגיעים לשם כדי ליהנות מהנוף המדברי המרהיב ומצפייה בכוכבים בלילה.",
            subQuestions: [
              {
                id: "he-h-q13-1-v2",
                type: "multiple_choice",
                prompt: "Where is Makhtesh Ramon located?",
                marks: 1,
                options: [
                  "Galilee",
                  "Golan Heights",
                  "Negev desert",
                  "Coastal plain"
                ],
                acceptedAnswers: [
                  "Negev desert"
                ]
              },
              {
                id: "he-h-q13-2-v2",
                type: "multiple_choice",
                prompt: "What type of landscape attracts tourists there?",
                marks: 1,
                options: [
                  "Forest",
                  "Desert",
                  "Snowy mountains",
                  "Lakes"
                ],
                acceptedAnswers: [
                  "Desert"
                ]
              },
              {
                id: "he-h-q13-3-v2",
                type: "multiple_choice",
                prompt: "What popular night activity is mentioned?",
                marks: 1,
                options: [
                  "Night clubs",
                  "Stargazing",
                  "Night swimming",
                  "Campfires"
                ],
                acceptedAnswers: [
                  "Stargazing"
                ]
              }
            ]
          },
          {
            id: "he-h-q14-v2",
            type: "short_answer",
            prompt: "Q14: The Hebrew Language Academy.",
            marks: 3,
            context: "האקדמיה ללשון העברית בירושלים ממציאה מילים חדשות בכל שנה כדי להתאים את השפה העתיקה לעולם המודרני המשתנה במהירות.",
            subQuestions: [
              {
                id: "he-h-q14-1-v2",
                type: "short_answer",
                prompt: "What is the role of the Hebrew Language Academy?",
                marks: 1,
                acceptedAnswers: [
                  "Invent new words",
                  "Create new words"
                ]
              },
              {
                id: "he-h-q14-2-v2",
                type: "short_answer",
                prompt: "Where is this academy located?",
                marks: 1,
                acceptedAnswers: [
                  "Jerusalem"
                ]
              },
              {
                id: "he-h-q14-3-v2",
                type: "short_answer",
                prompt: "Why does it invent new words?",
                marks: 1,
                acceptedAnswers: [
                  "Adapt to the rapidly changing modern world",
                  "Modernize the language"
                ]
              }
            ]
          },
          {
            id: "he-h-q15-v2",
            type: "table_completion",
            prompt: "Q15: Agricultural Innovation - Kibbutz Arava.",
            marks: 3,
            context: "קיבוץ בערבה מגדל ירקות איכותיים בלב המדבר בעזרת מערכות השקיה ממוחשבות המונעות בזבוז מים.",
            subQuestions: [
              {
                id: "he-h-q15-1-v2",
                type: "short_answer",
                prompt: "Where is the kibbutz located?",
                marks: 1,
                acceptedAnswers: [
                  "Arava",
                  "In the Arava desert"
                ]
              },
              {
                id: "he-h-q15-2-v2",
                type: "short_answer",
                prompt: "What do they grow there?",
                marks: 1,
                acceptedAnswers: [
                  "High-quality vegetables",
                  "Vegetables"
                ]
              },
              {
                id: "he-h-q15-3-v2",
                type: "short_answer",
                prompt: "How do their computer-controlled irrigation systems help the environment?",
                marks: 1,
                acceptedAnswers: [
                  "Prevent water waste",
                  "Save water"
                ]
              }
            ]
          },
          {
            id: "he-h-q16-v2",
            type: "short_answer",
            prompt: "Q16: Eilat Coral Reef Preservation.",
            marks: 3,
            context: "שמורת חוף האלמוגים באילת מוגנת בקפידה על ידי פקחים. חל איסור מוחלט לגעת באלמוגים או להאכיל את דגי השונית הצבעוניים.",
            subQuestions: [
              {
                id: "he-h-q16-1-v2",
                type: "short_answer",
                prompt: "Who protects the Eilat Coral Reef?",
                marks: 1,
                acceptedAnswers: [
                  "Rangers",
                  "Inspectors",
                  "Coral reef inspectors"
                ]
              },
              {
                id: "he-h-q16-2-v2",
                type: "short_answer",
                prompt: "What is strictly forbidden regarding corals?",
                marks: 1,
                acceptedAnswers: [
                  "Touching them",
                  "To touch corals",
                  "Touching"
                ]
              },
              {
                id: "he-h-q16-3-v2",
                type: "short_answer",
                prompt: "What is prohibited regarding reef fish?",
                marks: 1,
                acceptedAnswers: [
                  "Feeding them",
                  "To feed reef fish",
                  "Feeding"
                ]
              }
            ]
          },
          {
            id: "he-h-q17-v2",
            type: "multiple_choice",
            prompt: "Q17: Bicycle Sharing in Tel Aviv.",
            marks: 3,
            context: "מערכת השכרת האופניים 'תל-אופן' פופולרית מאוד בקרב תושבים ומבקרים כאחד. היא מסייעת בהפחתת עומסי התנועה ובמניעת זיהום אוויר.",
            subQuestions: [
              {
                id: "he-h-q17-1-v2",
                type: "multiple_choice",
                prompt: "What is the name of the bicycle sharing system?",
                marks: 1,
                options: [
                  "Metro-Bike",
                  "Tel-O-Fun",
                  "Tel-Aviv Wheel",
                  "Eco-Ride"
                ],
                acceptedAnswers: [
                  "Tel-O-Fun"
                ]
              },
              {
                id: "he-h-q17-2-v2",
                type: "multiple_choice",
                prompt: "Who uses this system?",
                marks: 1,
                options: [
                  "Only tourists",
                  "Only children",
                  "Residents and visitors",
                  "Only students"
                ],
                acceptedAnswers: [
                  "Residents and visitors"
                ]
              },
              {
                id: "he-h-q17-3-v2",
                type: "multiple_choice",
                prompt: "Name one benefit of this system.",
                marks: 1,
                options: [
                  "Reducing traffic congestion",
                  "Cheap food",
                  "Faster trains",
                  "Free parking"
                ],
                acceptedAnswers: [
                  "Reducing traffic congestion"
                ]
              }
            ]
          },
          {
            id: "he-h-q18-v2",
            type: "short_answer",
            prompt: "Q18: The National Library of Israel.",
            marks: 3,
            context: "הספרייה הלאומית החדשה בירושלים נפתחה לציבור ומכילה מיליוני ספרים וכתבי יד עתיקים של העם היהודי.",
            subQuestions: [
              {
                id: "he-h-q18-1-v2",
                type: "short_answer",
                prompt: "What is the name of the new institution opened in Jerusalem?",
                marks: 1,
                acceptedAnswers: [
                  "The National Library of Israel",
                  "National Library"
                ]
              },
              {
                id: "he-h-q18-2-v2",
                type: "short_answer",
                prompt: "What does it contain?",
                marks: 1,
                acceptedAnswers: [
                  "Millions of books and ancient manuscripts",
                  "Books and manuscripts"
                ]
              },
              {
                id: "he-h-q18-3-v2",
                type: "short_answer",
                prompt: "To which group of people do the manuscripts belong?",
                marks: 1,
                acceptedAnswers: [
                  "The Jewish people",
                  "Jewish people"
                ]
              }
            ]
          },
          {
            id: "he-h-q19-v2",
            type: "word_bank",
            prompt: "Q19: Technion Space Program.",
            marks: 3,
            options: [
              "space",
              "satellites",
              "radiation",
              "oceans",
              "stars"
            ],
            context: "סטודנטים בטכניון בחיפה מתכננים ומשגרים לוויינים זעירים לחלל החיצון כדי לחקור את השפעות הקרינה הקוסמית.",
            subQuestions: [
              {
                id: "he-h-q19-1-v2",
                type: "gap_fill",
                prompt: "The students at the Technion are launching miniature...",
                marks: 1,
                acceptedAnswers: [
                  "satellites"
                ]
              },
              {
                id: "he-h-q19-2-v2",
                type: "gap_fill",
                prompt: "These satellites are launched into outer...",
                marks: 1,
                acceptedAnswers: [
                  "space"
                ]
              },
              {
                id: "he-h-q19-3-v2",
                type: "gap_fill",
                prompt: "Their mission is to research the effects of cosmic...",
                marks: 1,
                acceptedAnswers: [
                  "radiation"
                ]
              }
            ]
          },
          {
            id: "he-h-q20-v2",
            type: "short_answer",
            prompt: "Q20: Sea Turtles Rescue Center.",
            marks: 3,
            context: "המרכז להצלת צבי ים במכמורת מטפל בצבים פצועים שנפגעו מרשתות דייגים או פלסטיק בים, ומחזיר אותם לטבע לאחר החלמה מלאה.",
            subQuestions: [
              {
                id: "he-h-q20-1-v2",
                type: "short_answer",
                prompt: "Where is the Sea Turtle Rescue Center located?",
                marks: 1,
                acceptedAnswers: [
                  "Michmoret"
                ]
              },
              {
                id: "he-h-q20-2-v2",
                type: "short_answer",
                prompt: "What are the two causes of injury to the turtles?",
                marks: 1,
                acceptedAnswers: [
                  "Fishing nets or plastic in the sea",
                  "Fishing nets and plastic"
                ]
              },
              {
                id: "he-h-q20-3-v2",
                type: "short_answer",
                prompt: "What is done with the turtles after they recover?",
                marks: 1,
                acceptedAnswers: [
                  "Returned to the wild",
                  "Released into nature",
                  "Returned to nature"
                ]
              }
            ]
          },
          {
            id: "he-h-q21-v2",
            type: "multiple_choice",
            prompt: "Q21: Mount Hermon Ski Resort.",
            marks: 3,
            context: "אתר החרמון הוא אתר הסקי היחיד בישראל. בחורף מגיעים אלפי מבקרים לגלוש בשלג, ובקיץ הם נהנים מסיורים מודרכים ומנוף הררי ירוק.",
            subQuestions: [
              {
                id: "he-h-q21-1-v2",
                type: "multiple_choice",
                prompt: "What makes Mount Hermon unique in Israel?",
                marks: 1,
                options: [
                  "It is the tallest building",
                  "It is the only ski resort",
                  "It is an active volcano",
                  "It has no water"
                ],
                acceptedAnswers: [
                  "It is the only ski resort"
                ]
              },
              {
                id: "he-h-q21-2-v2",
                type: "multiple_choice",
                prompt: "What do visitors do there in winter?",
                marks: 1,
                options: [
                  "Swim",
                  "Ski/surf in snow",
                  "Camp",
                  "Sail"
                ],
                acceptedAnswers: [
                  "Ski/surf in snow"
                ]
              },
              {
                id: "he-h-q21-3-v2",
                type: "multiple_choice",
                prompt: "What is a popular activity there during summer?",
                marks: 1,
                options: [
                  "Snowboarding",
                  "Guided tours",
                  "Ice skating",
                  "Sunbathing"
                ],
                acceptedAnswers: [
                  "Guided tours"
                ]
              }
            ]
          },
          {
            id: "he-h-q22-v2",
            type: "short_answer",
            prompt: "Q22: Solar Energy in the Negev.",
            marks: 3,
            context: "תחנת הכוח הסולארית באשלים משתמשת באלפי מראות כדי לרכז את קרני השמש ולייצר חשמל נקי עבור עשרות אלפי בתים בישראל.",
            subQuestions: [
              {
                id: "he-h-q22-1-v2",
                type: "short_answer",
                prompt: "Where is the solar power station located?",
                marks: 1,
                acceptedAnswers: [
                  "Ashalim",
                  "In Ashalim"
                ]
              },
              {
                id: "he-h-q22-2-v2",
                type: "short_answer",
                prompt: "What technology does it use to concentrate solar rays?",
                marks: 1,
                acceptedAnswers: [
                  "Thousands of mirrors",
                  "Mirrors",
                  "Thousands of mirrors / mirrors"
                ]
              },
              {
                id: "he-h-q22-3-v2",
                type: "short_answer",
                prompt: "What is produced by this station?",
                marks: 1,
                acceptedAnswers: [
                  "Clean electricity",
                  "Power",
                  "Clean power"
                ]
              }
            ]
          },
          {
            id: "he-h-q23-v2",
            type: "short_answer",
            prompt: "Q23: Preservation of Bauhaus Architecture in Tel Aviv.",
            marks: 3,
            context: "העיר הלבנה בתל אביב הוכרזה כאתר מורשת עולמית של אונסק״ו בשל אלפי בנייני באוהאוס שנבנו בשנות השלושים ומשומרים כיום בקפידה.",
            subQuestions: [
              {
                id: "he-h-q23-1-v2",
                type: "short_answer",
                prompt: "What nickname is given to Tel Aviv's UNESCO heritage area?",
                marks: 1,
                acceptedAnswers: [
                  "The White City",
                  "White City"
                ]
              },
              {
                id: "he-h-q23-2-v2",
                type: "short_answer",
                prompt: "What architectural style is preserved there?",
                marks: 1,
                acceptedAnswers: [
                  "Bauhaus",
                  "Bauhaus style"
                ]
              },
              {
                id: "he-h-q23-3-v2",
                type: "short_answer",
                prompt: "When were these buildings originally constructed?",
                marks: 1,
                acceptedAnswers: [
                  "The 1930s",
                  "In the 1930s",
                  "1930s"
                ]
              }
            ]
          },
          {
            id: "he-h-q24-v2",
            type: "table_completion",
            prompt: "Q24: Traditional Crafts - Druze Villages.",
            marks: 3,
            context: "בכפרים דרוזים בגליל, נשים רבות עוסקות באריגה מסורתית של שטיחים צבעוניים ובמכירת מאכלים אותנטיים לתיירים המבקרים באזור.",
            subQuestions: [
              {
                id: "he-h-q24-1-v2",
                type: "short_answer",
                prompt: "In which region are these Druze villages located?",
                marks: 1,
                acceptedAnswers: [
                  "Galilee",
                  "The Galilee"
                ]
              },
              {
                id: "he-h-q24-2-v2",
                type: "short_answer",
                prompt: "What traditional craft do the women practice?",
                marks: 1,
                acceptedAnswers: [
                  "Traditional weaving of colorful rugs/carpets",
                  "Weaving carpets",
                  "Weaving colorful rugs"
                ]
              },
              {
                id: "he-h-q24-3-v2",
                type: "short_answer",
                prompt: "What do they sell to visiting tourists?",
                marks: 1,
                acceptedAnswers: [
                  "Authentic foods",
                  "Traditional foods",
                  "Authentic food"
                ]
              }
            ]
          },
          {
            id: "he-h-q25-v2",
            type: "short_answer",
            prompt: "Q25: The Dead Sea Scroll Conservation.",
            marks: 3,
            context: "מומחים במוזיאון ישראל משתמשים בצילום מולטי-ספקטרלי מיוחד כדי לקרוא קטעים דהויים במגילות מדבר יהודה העתיקות מבלי לפגוע בהן.",
            subQuestions: [
              {
                id: "he-h-q25-1-v2",
                type: "short_answer",
                prompt: "Where are the Dead Sea Scrolls conserved and researched?",
                marks: 1,
                acceptedAnswers: [
                  "The Israel Museum",
                  "Israel Museum"
                ]
              },
              {
                id: "he-h-q25-2-v2",
                type: "short_answer",
                prompt: "What modern technology is used to read the faded scroll fragments?",
                marks: 1,
                acceptedAnswers: [
                  "Multi-spectral photography",
                  "Special photography"
                ]
              },
              {
                id: "he-h-q25-3-v2",
                type: "short_answer",
                prompt: "What is the benefit of this technology?",
                marks: 1,
                acceptedAnswers: [
                  "Reads faded text without damaging the scrolls",
                  "Prevents damage to the scrolls",
                  "No damage"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-he-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "בסוף השבוע שעבר החלטתי ללכת לחוף הים עם חבריי לכיתה. היה חום כבד, ולכן שחינו בים במשך שעות. אני חושב שזה חיוני להירגע אחרי שבוע מעייף בבית הספר, מכיוון שבחינות הגמר הן מלחיצות ביותר ודורשות ריכוז רב.",
        questions: [
          {
            id: "he-h-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Last weekend I decided to go to the coast with my classmates. It was stiflingly hot, therefore we swam in the sea for hours. I think that it is fundamental to disconnect after an exhausting week at school, given that the final exams are extremely stressful and require a lot of concentration."
          }
        ]
      }
    ]
  },
  {
    id: "bh-read-f-101",
    paperCode: "1BH0/01F",
    language: "Biblical Hebrew",
    tier: "foundation",
    theme: "TANAKH",
    title: "Paper 3: Unseen Reading (Foundation Tier) - The Creation (Genesis 1)",
    totalMarks: 13,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-bh",
        type: "reading",
        title: "SECTION A: Biblical Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "bh-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Genesis 1:1-3.",
            marks: 3,
            context: "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרץ׃ וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם׃ וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר׃",
            subQuestions: [
              {
                id: "bh-q1-1",
                type: "multiple_choice",
                prompt: "What did God create in the beginning according to verse 1?",
                marks: 1,
                options: [
                  "Only the earth",
                  "The heavens and the earth",
                  "Only the heavens",
                  "Light and darkness"
                ],
                acceptedAnswers: [
                  "The heavens and the earth"
                ]
              },
              {
                id: "bh-q1-2",
                type: "multiple_choice",
                prompt: "What was hovering over the surface of the waters?",
                marks: 1,
                options: [
                  "Darkness",
                  "The spirit of God",
                  "The dry land",
                  "The light"
                ],
                acceptedAnswers: [
                  "The spirit of God"
                ]
              },
              {
                id: "bh-q1-3",
                type: "multiple_choice",
                prompt: "What does the word vabohu (וָבֹהוּ) coupled with tohu refer to in verse 2?",
                marks: 1,
                options: [
                  "Light",
                  "Order",
                  "Chaos and emptiness",
                  "Water"
                ],
                acceptedAnswers: [
                  "Chaos and emptiness"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-bh",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following verse into English.",
        passage: "וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב׃",
        questions: [
          {
            id: "bh-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: And God said, \"Let there be light,\" and there was light. And God saw the light, that it was good."
          }
        ]
      }
    ]
  },
  {
    id: "bh-read-f-101-v2",
    paperCode: "1BH0/01F",
    language: "Biblical Hebrew",
    tier: "foundation",
    theme: "TANAKH",
    title: "Paper 3: Unseen Reading (Foundation Tier) - The Creation (Genesis 1) (Set B)",
    totalMarks: 13,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-bh-v2",
        type: "reading",
        title: "SECTION A: Biblical Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "bh-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Genesis 1:1-3.",
            marks: 3,
            context: "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרץ׃ וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם׃ וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר׃",
            subQuestions: [
              {
                id: "bh-q1-1-v2",
                type: "multiple_choice",
                prompt: "What did God create in the beginning according to verse 1?",
                marks: 1,
                options: [
                  "Only the earth",
                  "The heavens and the earth",
                  "Only the heavens",
                  "Light and darkness"
                ],
                acceptedAnswers: [
                  "The heavens and the earth"
                ]
              },
              {
                id: "bh-q1-2-v2",
                type: "multiple_choice",
                prompt: "What was hovering over the surface of the waters?",
                marks: 1,
                options: [
                  "Darkness",
                  "The spirit of God",
                  "The dry land",
                  "The light"
                ],
                acceptedAnswers: [
                  "The spirit of God"
                ]
              },
              {
                id: "bh-q1-3-v2",
                type: "multiple_choice",
                prompt: "What does the word vabohu (וָבֹהוּ) coupled with tohu refer to in verse 2?",
                marks: 1,
                options: [
                  "Light",
                  "Order",
                  "Chaos and emptiness",
                  "Water"
                ],
                acceptedAnswers: [
                  "Chaos and emptiness"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-bh-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following verse into English.",
        passage: "וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב׃",
        questions: [
          {
            id: "bh-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: And God said, \"Let there be light,\" and there was light. And God saw the light, that it was good."
          }
        ]
      }
    ]
  },
  {
    id: "bh-read-h-102",
    paperCode: "1BH0/3H",
    language: "Biblical Hebrew",
    tier: "higher",
    theme: "TANAKH",
    title: "Paper 3: Unseen Reading (Higher Tier) - Psalm 23",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-bh",
        type: "reading",
        title: "SECTION A: Psalm Comprehension & Grammar",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "bhh-q1",
            type: "short_answer",
            prompt: "Q1: Comprehension questions on Psalm 23:1-3.",
            marks: 4,
            context: "מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃ בִּנְא֥וֹת דֶּ֝שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֥וֹת יְנַהֲלֵֽנִי׃ נַפְשִׁ֥י יְשׁוֹבֵ֑ב יַֽנְחֵ֥נִי בְמַעְגְּלֵי־צֶ֝דֶק לְמַ֥עַן שְׁמֽוֹ׃",
            subQuestions: [
              {
                id: "bhh-q1-1",
                type: "short_answer",
                prompt: "By what metaphor does the psalmist describe God in verse 1?",
                marks: 1,
                acceptedAnswers: [
                  "Shepherd",
                  "A shepherd"
                ]
              },
              {
                id: "bhh-q1-2",
                type: "short_answer",
                prompt: "Translate into English the phrase: lo echsar (לֹא אֶחְסָר).",
                marks: 1,
                acceptedAnswers: [
                  "I shall not want",
                  "I shall not lack",
                  "I do not lack"
                ]
              },
              {
                id: "bhh-q1-3",
                type: "short_answer",
                prompt: "Where does the shepherd make the psalmist lie down?",
                marks: 1,
                acceptedAnswers: [
                  "In green pastures",
                  "Green pastures",
                  "Grassy pastures"
                ]
              },
              {
                id: "bhh-q1-4",
                type: "short_answer",
                prompt: "Where does the shepherd guide the psalmist according to verse 2?",
                marks: 1,
                acceptedAnswers: [
                  "Beside quiet waters",
                  "Beside still waters",
                  "Water of rest",
                  "Quiet waters"
                ]
              }
            ]
          },
          {
            id: "bhh-q2",
            type: "multiple_choice",
            prompt: "Q2: Grammar Analysis on Verbs and Nouns.",
            marks: 3,
            context: "בִּנְא֥וֹת דֶּ֝שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֥וֹת יְנַהֲלֵֽנִי׃",
            subQuestions: [
              {
                id: "bhh-q2-1",
                type: "multiple_choice",
                prompt: "What is the root of the verb yarbitzeni (יַרְבִּיצֵנִי)?",
                marks: 1,
                options: [
                  "R-B-Ts (רבץ)",
                  "B-Ts-H (בצה)",
                  "R-Ts-H (רצה)",
                  "Y-R-B (ירב)"
                ],
                acceptedAnswers: [
                  "R-B-Ts (רבץ)"
                ]
              },
              {
                id: "bhh-q2-2",
                type: "multiple_choice",
                prompt: "What binyan (verb conjugation) is yarbitzeni (יַרְבִּיצֵנִי)?",
                marks: 1,
                options: [
                  "Qal",
                  "Hifil",
                  "Piel",
                  "Nifal"
                ],
                acceptedAnswers: [
                  "Hifil"
                ]
              },
              {
                id: "bhh-q2-3",
                type: "multiple_choice",
                prompt: "What form is the noun neot (נְאוֹת)?",
                marks: 1,
                options: [
                  "Construct plural",
                  "Absolute plural",
                  "Construct singular",
                  "Absolute singular"
                ],
                acceptedAnswers: [
                  "Construct plural"
                ]
              }
            ]
          },
          {
            id: "bhh-q3",
            type: "short_answer",
            prompt: "Q3: Textual Context & Word Meaning.",
            marks: 4,
            context: "נַפְשִׁ֥י יְשׁוֹבֵ֑ב יַֽנְחֵ֥נִי בְמַעְגְּלֵי־צֶ֝דֶק לְמַ֥עַן שְׁמֽוֹ׃",
            subQuestions: [
              {
                id: "bhh-q3-1",
                type: "short_answer",
                prompt: "Translate the word nafshi (נַפְשִׁי) literally.",
                marks: 1,
                acceptedAnswers: [
                  "My soul",
                  "My life",
                  "My breath"
                ]
              },
              {
                id: "bhh-q3-2",
                type: "short_answer",
                prompt: "What is the root of the verb yeshovev (יְשׁוֹבֵב)?",
                marks: 1,
                acceptedAnswers: [
                  "Sh-U-V",
                  "Sh-V-V",
                  "Shuv",
                  "שוב"
                ]
              },
              {
                id: "bhh-q3-3",
                type: "short_answer",
                prompt: "What does the term ma'aglei-tsedek (מַעְגְּלֵי־צֶדֶק) mean?",
                marks: 1,
                acceptedAnswers: [
                  "Paths of righteousness",
                  "Righteous paths",
                  "Right tracks"
                ]
              },
              {
                id: "bhh-q3-4",
                type: "short_answer",
                prompt: "According to verse 3, for what sake does the shepherd guide the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "For His name's sake",
                  "For the sake of His name",
                  "His name"
                ]
              }
            ]
          },
          {
            id: "bhh-q4",
            type: "short_answer",
            prompt: "Q4: Syntax and Theological Metaphor.",
            marks: 3,
            context: "גַּ֤ם כִּֽי־אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא־אִירָ֧א רָ֑ע כִּי־אַתָּ֥ה עִמָּדִ֑י׃",
            subQuestions: [
              {
                id: "bhh-q4-1",
                type: "short_answer",
                prompt: "What does the compound word tsalmavet (צַלְמָוֶת) literally translate to?",
                marks: 1,
                acceptedAnswers: [
                  "Shadow of death",
                  "Deep darkness"
                ]
              },
              {
                id: "bhh-q4-2",
                type: "short_answer",
                prompt: "Why is the psalmist confident that he will \"fear no evil\"?",
                marks: 1,
                acceptedAnswers: [
                  "For you are with me",
                  "Because God is with him"
                ]
              },
              {
                id: "bhh-q4-3",
                type: "short_answer",
                prompt: "Identify the pronominal suffix in the word immadi (עִמָּדִי).",
                marks: 1,
                acceptedAnswers: [
                  "First person singular",
                  "Me",
                  "My",
                  "I"
                ]
              }
            ]
          },
          {
            id: "bhh-q5",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE items associated with the shepherd in verse 4.",
            marks: 3,
            context: "שִׁבְטְךָ֥ וּמִשְׁעַנְתֶּ֖ךָ הֵ֥מָּה יְנַחֲמֻֽנִי׃",
            options: [
              "Your sword (חַרְבְּךָ)",
              "Your rod (שִׁבְטְךָ)",
              "Your shield (מָגִנְּךָ)",
              "Your staff (מִשְׁעַנְתֶּךָ)",
              "They comfort me (יְנַחֲמֻנִי)",
              "Your bow (קַשְׁתְּךָ)",
              "They frighten me",
              "They feed me"
            ],
            acceptedAnswers: [
              "Your rod (שִׁבְטְךָ)",
              "Your staff (מִשְׁעַנְתֶּךָ)",
              "They comfort me (יְנַחֲמֻנִי)"
            ]
          },
          {
            id: "bhh-q5b",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English regarding verse 5.",
            marks: 3,
            context: "תַּעֲרֹ֬ךְ לְפָנַ֨י ׀ שֻׁלְחָ֗ן נֶ֥גֶד צֹרְרָ֑י דִּשַּׁ֥נְתָּ בַשֶּׁ֥מֶן רֹ֝אשִׁ֗י כּוֹסִ֥י רְוָיָֽה׃",
            subQuestions: [
              {
                id: "bhh-q5b-1",
                type: "short_answer",
                prompt: "What does God prepare before the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "A table"
                ]
              },
              {
                id: "bhh-q5b-2",
                type: "short_answer",
                prompt: "In whose presence is this table prepared?",
                marks: 1,
                acceptedAnswers: [
                  "My enemies",
                  "In the presence of my enemies",
                  "My adversaries"
                ]
              },
              {
                id: "bhh-q5b-3",
                type: "short_answer",
                prompt: "What does God anoint the psalmist's head with?",
                marks: 1,
                acceptedAnswers: [
                  "Oil"
                ]
              }
            ]
          },
          {
            id: "bhh-q6",
            type: "short_answer",
            prompt: "Q6: Translation and Interpretation of verse 5.",
            marks: 3,
            context: "כּוֹסִ֥י רְוָיָֽה׃ אַ֤ךְ ׀ ט֤וֹב וָחֶ֙סֶד יִרְדְּפ֥וּנִי כָּל-יְמֵ֣י חַיָּ֑י",
            subQuestions: [
              {
                id: "bhh-q6-1",
                type: "short_answer",
                prompt: "What does the phrase kosi revayah (כּוֹסִ֥י רְוָיָֽה) mean?",
                marks: 1,
                acceptedAnswers: [
                  "My cup overflows",
                  "My cup is saturated",
                  "My cup is full"
                ]
              },
              {
                id: "bhh-q6-2",
                type: "short_answer",
                prompt: "Which two nouns follow the psalmist in verse 6?",
                marks: 1,
                acceptedAnswers: [
                  "Goodness and mercy",
                  "Goodness and love",
                  "Goodness and kindness"
                ]
              },
              {
                id: "bhh-q6-3",
                type: "short_answer",
                prompt: "How long will these pursue the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "All the days of my life",
                  "Forever"
                ]
              }
            ]
          },
          {
            id: "bhh-q7",
            type: "multiple_choice",
            prompt: "Q7: Final Verse Analysis and Sanctuary.",
            marks: 3,
            context: "וְשַׁבְתִּ֥י בְּבֵית-יְהוָ֖ה לְאֹ֥רֶךְ יָמִֽים׃",
            subQuestions: [
              {
                id: "bhh-q7-1",
                type: "multiple_choice",
                prompt: "Where does the psalmist declare he will dwell?",
                marks: 1,
                options: [
                  "In the house of the Lord",
                  "In the palace of David",
                  "In the green pastures",
                  "In the quiet city"
                ],
                acceptedAnswers: [
                  "In the house of the Lord"
                ]
              },
              {
                id: "bhh-q7-2",
                type: "multiple_choice",
                prompt: "What does the phrase le'orech yamim (לְאֹ֥רֶךְ יָמִֽים) literally mean?",
                marks: 1,
                options: [
                  "For length of days",
                  "For a short time",
                  "At noon",
                  "On weekdays"
                ],
                acceptedAnswers: [
                  "For length of days"
                ]
              },
              {
                id: "bhh-q7-3",
                type: "multiple_choice",
                prompt: "What is the root of the verb veshavti (וְשַׁבְתִּי)?",
                marks: 1,
                options: [
                  "Y-Sh-B (ישב - to dwell)",
                  "Sh-U-V (שוב - to return)",
                  "Sh-B-Ch (שבח)",
                  "Sh-B-T (שבת)"
                ],
                acceptedAnswers: [
                  "Y-Sh-B (ישב - to dwell)"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-bh",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following verse into English.",
        passage: "גַּ֤ם כִּֽי־אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא־אִירָ֧א רָ֑ע כִּי־אַתָּ֥ה עִמָּדִ֑י׃",
        questions: [
          {
            id: "bhh-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me."
          }
        ]
      }
    ]
  },
  {
    id: "bh-read-h-102-v2",
    paperCode: "1BH0/3H",
    language: "Biblical Hebrew",
    tier: "higher",
    theme: "TANAKH",
    title: "Paper 3: Unseen Reading (Higher Tier) - Psalm 23 (Set B)",
    totalMarks: 50,
    estimatedTime: 60,
    sections: [
      {
        id: "sec-a-h-bh-v2",
        type: "reading",
        title: "SECTION A: Psalm Comprehension & Grammar",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "bhh-q1-v2",
            type: "short_answer",
            prompt: "Q1: Comprehension questions on Psalm 23:1-3.",
            marks: 4,
            context: "מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃ בִּנְא֥וֹת דֶּ֝שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֥וֹת יְנַהֲלֵֽנִי׃ נַפְשִׁ֥י יְשׁוֹבֵ֑ב יַֽנְחֵ֥נִי בְמַעְגְּלֵי־צֶ֝דֶק לְמַ֥עַן שְׁמֽוֹ׃",
            subQuestions: [
              {
                id: "bhh-q1-1-v2",
                type: "short_answer",
                prompt: "By what metaphor does the psalmist describe God in verse 1?",
                marks: 1,
                acceptedAnswers: [
                  "Shepherd",
                  "A shepherd"
                ]
              },
              {
                id: "bhh-q1-2-v2",
                type: "short_answer",
                prompt: "Translate into English the phrase: lo echsar (לֹא אֶחְסָר).",
                marks: 1,
                acceptedAnswers: [
                  "I shall not want",
                  "I shall not lack",
                  "I do not lack"
                ]
              },
              {
                id: "bhh-q1-3-v2",
                type: "short_answer",
                prompt: "Where does the shepherd make the psalmist lie down?",
                marks: 1,
                acceptedAnswers: [
                  "In green pastures",
                  "Green pastures",
                  "Grassy pastures"
                ]
              },
              {
                id: "bhh-q1-4-v2",
                type: "short_answer",
                prompt: "Where does the shepherd guide the psalmist according to verse 2?",
                marks: 1,
                acceptedAnswers: [
                  "Beside quiet waters",
                  "Beside still waters",
                  "Water of rest",
                  "Quiet waters"
                ]
              }
            ]
          },
          {
            id: "bhh-q2-v2",
            type: "multiple_choice",
            prompt: "Q2: Grammar Analysis on Verbs and Nouns.",
            marks: 3,
            context: "בִּנְא֥וֹת דֶּ֝שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֥וֹת יְנַהֲלֵֽנִי׃",
            subQuestions: [
              {
                id: "bhh-q2-1-v2",
                type: "multiple_choice",
                prompt: "What is the root of the verb yarbitzeni (יַרְבִּיצֵנִי)?",
                marks: 1,
                options: [
                  "R-B-Ts (רבץ)",
                  "B-Ts-H (בצה)",
                  "R-Ts-H (רצה)",
                  "Y-R-B (ירב)"
                ],
                acceptedAnswers: [
                  "R-B-Ts (רבץ)"
                ]
              },
              {
                id: "bhh-q2-2-v2",
                type: "multiple_choice",
                prompt: "What binyan (verb conjugation) is yarbitzeni (יַרְבִּיצֵנִי)?",
                marks: 1,
                options: [
                  "Qal",
                  "Hifil",
                  "Piel",
                  "Nifal"
                ],
                acceptedAnswers: [
                  "Hifil"
                ]
              },
              {
                id: "bhh-q2-3-v2",
                type: "multiple_choice",
                prompt: "What form is the noun neot (נְאוֹת)?",
                marks: 1,
                options: [
                  "Construct plural",
                  "Absolute plural",
                  "Construct singular",
                  "Absolute singular"
                ],
                acceptedAnswers: [
                  "Construct plural"
                ]
              }
            ]
          },
          {
            id: "bhh-q3-v2",
            type: "short_answer",
            prompt: "Q3: Textual Context & Word Meaning.",
            marks: 4,
            context: "נַפְשִׁ֥י יְשׁוֹבֵ֑ב יַֽנְחֵ֥נִי בְמַעְגְּלֵי־צֶ֝דֶק לְמַ֥עַן שְׁמֽוֹ׃",
            subQuestions: [
              {
                id: "bhh-q3-1-v2",
                type: "short_answer",
                prompt: "Translate the word nafshi (נַפְשִׁי) literally.",
                marks: 1,
                acceptedAnswers: [
                  "My soul",
                  "My life",
                  "My breath"
                ]
              },
              {
                id: "bhh-q3-2-v2",
                type: "short_answer",
                prompt: "What is the root of the verb yeshovev (יְשׁוֹבֵב)?",
                marks: 1,
                acceptedAnswers: [
                  "Sh-U-V",
                  "Sh-V-V",
                  "Shuv",
                  "שוב"
                ]
              },
              {
                id: "bhh-q3-3-v2",
                type: "short_answer",
                prompt: "What does the term ma'aglei-tsedek (מַעְגְּלֵי־צֶדֶק) mean?",
                marks: 1,
                acceptedAnswers: [
                  "Paths of righteousness",
                  "Righteous paths",
                  "Right tracks"
                ]
              },
              {
                id: "bhh-q3-4-v2",
                type: "short_answer",
                prompt: "According to verse 3, for what sake does the shepherd guide the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "For His name's sake",
                  "For the sake of His name",
                  "His name"
                ]
              }
            ]
          },
          {
            id: "bhh-q4-v2",
            type: "short_answer",
            prompt: "Q4: Syntax and Theological Metaphor.",
            marks: 3,
            context: "גַּ֤ם כִּֽי־אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא־אִירָ֧א רָ֑ע כִּי־אַתָּ֥ה עִמָּדִ֑י׃",
            subQuestions: [
              {
                id: "bhh-q4-1-v2",
                type: "short_answer",
                prompt: "What does the compound word tsalmavet (צַלְמָוֶת) literally translate to?",
                marks: 1,
                acceptedAnswers: [
                  "Shadow of death",
                  "Deep darkness"
                ]
              },
              {
                id: "bhh-q4-2-v2",
                type: "short_answer",
                prompt: "Why is the psalmist confident that he will \"fear no evil\"?",
                marks: 1,
                acceptedAnswers: [
                  "For you are with me",
                  "Because God is with him"
                ]
              },
              {
                id: "bhh-q4-3-v2",
                type: "short_answer",
                prompt: "Identify the pronominal suffix in the word immadi (עִמָּדִי).",
                marks: 1,
                acceptedAnswers: [
                  "First person singular",
                  "Me",
                  "My",
                  "I"
                ]
              }
            ]
          },
          {
            id: "bhh-q5-v2",
            type: "multi_select",
            prompt: "Q5 Part A: Tick the THREE items associated with the shepherd in verse 4.",
            marks: 3,
            context: "שִׁבְטְךָ֥ וּמִשְׁעַנְתֶּ֖ךָ הֵ֥מָּה יְנַחֲמֻֽנִי׃",
            options: [
              "Your sword (חַרְבְּךָ)",
              "Your rod (שִׁבְטְךָ)",
              "Your shield (מָגִנְּךָ)",
              "Your staff (מִשְׁעַנְתֶּךָ)",
              "They comfort me (יְנַחֲמֻנִי)",
              "Your bow (קַשְׁתְּךָ)",
              "They frighten me",
              "They feed me"
            ],
            acceptedAnswers: [
              "Your rod (שִׁבְטְךָ)",
              "Your staff (מִשְׁעַנְתֶּךָ)",
              "They comfort me (יְנַחֲמֻנִי)"
            ]
          },
          {
            id: "bhh-q5b-v2",
            type: "table_completion",
            prompt: "Q5 Part B: Complete the table in English regarding verse 5.",
            marks: 3,
            context: "תַּעֲרֹ֬ךְ לְפָנַ֨י ׀ שֻׁלְחָ֗ן נֶ֥גֶד צֹרְרָ֑י דִּשַּׁ֥נְתָּ בַשֶּׁ֥מֶן רֹ֝אשִׁ֗י כּוֹסִ֥י רְוָיָֽה׃",
            subQuestions: [
              {
                id: "bhh-q5b-1-v2",
                type: "short_answer",
                prompt: "What does God prepare before the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "A table"
                ]
              },
              {
                id: "bhh-q5b-2-v2",
                type: "short_answer",
                prompt: "In whose presence is this table prepared?",
                marks: 1,
                acceptedAnswers: [
                  "My enemies",
                  "In the presence of my enemies",
                  "My adversaries"
                ]
              },
              {
                id: "bhh-q5b-3-v2",
                type: "short_answer",
                prompt: "What does God anoint the psalmist's head with?",
                marks: 1,
                acceptedAnswers: [
                  "Oil"
                ]
              }
            ]
          },
          {
            id: "bhh-q6-v2",
            type: "short_answer",
            prompt: "Q6: Translation and Interpretation of verse 5.",
            marks: 3,
            context: "כּוֹסִ֥י רְוָיָֽה׃ אַ֤ךְ ׀ ט֤וֹב וָחֶ֙סֶד יִרְדְּפ֥וּנִי כָּל-יְמֵ֣י חַיָּ֑י",
            subQuestions: [
              {
                id: "bhh-q6-1-v2",
                type: "short_answer",
                prompt: "What does the phrase kosi revayah (כּוֹסִ֥י רְוָיָֽה) mean?",
                marks: 1,
                acceptedAnswers: [
                  "My cup overflows",
                  "My cup is saturated",
                  "My cup is full"
                ]
              },
              {
                id: "bhh-q6-2-v2",
                type: "short_answer",
                prompt: "Which two nouns follow the psalmist in verse 6?",
                marks: 1,
                acceptedAnswers: [
                  "Goodness and mercy",
                  "Goodness and love",
                  "Goodness and kindness"
                ]
              },
              {
                id: "bhh-q6-3-v2",
                type: "short_answer",
                prompt: "How long will these pursue the psalmist?",
                marks: 1,
                acceptedAnswers: [
                  "All the days of my life",
                  "Forever"
                ]
              }
            ]
          },
          {
            id: "bhh-q7-v2",
            type: "multiple_choice",
            prompt: "Q7: Final Verse Analysis and Sanctuary.",
            marks: 3,
            context: "וְשַׁבְתִּ֥י בְּבֵית-יְהוָ֖ה לְאֹ֥רֶךְ יָמִֽים׃",
            subQuestions: [
              {
                id: "bhh-q7-1-v2",
                type: "multiple_choice",
                prompt: "Where does the psalmist declare he will dwell?",
                marks: 1,
                options: [
                  "In the house of the Lord",
                  "In the palace of David",
                  "In the green pastures",
                  "In the quiet city"
                ],
                acceptedAnswers: [
                  "In the house of the Lord"
                ]
              },
              {
                id: "bhh-q7-2-v2",
                type: "multiple_choice",
                prompt: "What does the phrase le'orech yamim (לְאֹ֥רֶךְ יָמִֽים) literally mean?",
                marks: 1,
                options: [
                  "For length of days",
                  "For a short time",
                  "At noon",
                  "On weekdays"
                ],
                acceptedAnswers: [
                  "For length of days"
                ]
              },
              {
                id: "bhh-q7-3-v2",
                type: "multiple_choice",
                prompt: "What is the root of the verb veshavti (וְשַׁבְתִּי)?",
                marks: 1,
                options: [
                  "Y-Sh-B (ישב - to dwell)",
                  "Sh-U-V (שוב - to return)",
                  "Sh-B-Ch (שבח)",
                  "Sh-B-T (שבת)"
                ],
                acceptedAnswers: [
                  "Y-Sh-B (ישב - to dwell)"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-h-bh-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following verse into English.",
        passage: "גַּ֤ם כִּֽי־אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא־אִירָ֧א רָ֑ע כִּי־אַתָּ֥ה עִמָּדִ֑י׃",
        questions: [
          {
            id: "bhh-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me."
          }
        ]
      }
    ]
  },
  {
    id: "es-read-f-101",
    paperCode: "1SP0/3F",
    language: "Spanish",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Mi Familia y Mis Pasatiempos",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-es",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "es-f-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Carlos.",
            marks: 3,
            context: "Hola, me llamo Carlos. Vivo en un pueblo tranquilo cerca de Valencia. Mi pasatiempo favorito es jugar al fútbol con mis amigos los sábados por la tarde. También me gusta comer paella con mi familia los domingos.",
            subQuestions: [
              {
                id: "es-f-q1-1",
                type: "multiple_choice",
                prompt: "Where does Carlos live?",
                marks: 1,
                options: [
                  "Madrid",
                  "Valencia",
                  "Barcelona",
                  "Seville"
                ],
                acceptedAnswers: [
                  "Valencia"
                ]
              },
              {
                id: "es-f-q1-2",
                type: "multiple_choice",
                prompt: "When does he play football?",
                marks: 1,
                options: [
                  "Saturdays",
                  "Sundays",
                  "Mondays",
                  "Fridays"
                ],
                acceptedAnswers: [
                  "Saturdays"
                ]
              },
              {
                id: "es-f-q1-3",
                type: "multiple_choice",
                prompt: "Who does he eat paella with on Sundays?",
                marks: 1,
                options: [
                  "Friends",
                  "Family",
                  "Teachers",
                  "Neighbors"
                ],
                acceptedAnswers: [
                  "Family"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-es",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Me gusta mucho mi pueblo porque tiene un parque muy grande. Mañana voy a ir en bicicleta con mi hermano.",
        questions: [
          {
            id: "es-f-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I really like my town because it has a very big park. Tomorrow I am going to go cycling with my brother."
          }
        ]
      }
    ]
  },
  {
    id: "es-read-f-101-v2",
    paperCode: "1SP0/3F",
    language: "Spanish",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Mi Familia y Mis Pasatiempos (Set B)",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-es-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "es-f-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Carlos.",
            marks: 3,
            context: "Hola, me llamo Carlos. Vivo en un pueblo tranquilo cerca de Valencia. Mi pasatiempo favorito es jugar al fútbol con mis amigos los sábados por la tarde. También me gusta comer paella con mi familia los domingos.",
            subQuestions: [
              {
                id: "es-f-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Carlos live?",
                marks: 1,
                options: [
                  "Madrid",
                  "Valencia",
                  "Barcelona",
                  "Seville"
                ],
                acceptedAnswers: [
                  "Valencia"
                ]
              },
              {
                id: "es-f-q1-2-v2",
                type: "multiple_choice",
                prompt: "When does he play football?",
                marks: 1,
                options: [
                  "Saturdays",
                  "Sundays",
                  "Mondays",
                  "Fridays"
                ],
                acceptedAnswers: [
                  "Saturdays"
                ]
              },
              {
                id: "es-f-q1-3-v2",
                type: "multiple_choice",
                prompt: "Who does he eat paella with on Sundays?",
                marks: 1,
                options: [
                  "Friends",
                  "Family",
                  "Teachers",
                  "Neighbors"
                ],
                acceptedAnswers: [
                  "Family"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-es-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Me gusta mucho mi pueblo porque tiene un parque muy grande. Mañana voy a ir en bicicleta con mi hermano.",
        questions: [
          {
            id: "es-f-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I really like my town because it has a very big park. Tomorrow I am going to go cycling with my brother."
          }
        ]
      }
    ]
  },
  {
    id: "fr-read-f-101",
    paperCode: "1FR0/3F",
    language: "French",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Ma Famille et Mes Loisirs",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-fr",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "fr-f-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Thomas.",
            marks: 3,
            context: "Bonjour, je m’appelle Thomas. J’habite dans un petit appartement à Lyon. J’adore jouer au tennis de table et écouter de la musique française le soir. Le weekend, j’aime préparer des gâteaux pour ma famille.",
            subQuestions: [
              {
                id: "fr-f-q1-1",
                type: "multiple_choice",
                prompt: "Where does Thomas live?",
                marks: 1,
                options: [
                  "Paris",
                  "Lyon",
                  "Marseille",
                  "Nice"
                ],
                acceptedAnswers: [
                  "Lyon"
                ]
              },
              {
                id: "fr-f-q1-2",
                type: "multiple_choice",
                prompt: "What sport does he love playing?",
                marks: 1,
                options: [
                  "Tennis",
                  "Table tennis",
                  "Football",
                  "Rugby"
                ],
                acceptedAnswers: [
                  "Table tennis"
                ]
              },
              {
                id: "fr-f-q1-3",
                type: "multiple_choice",
                prompt: "What does he prepare for his family?",
                marks: 1,
                options: [
                  "Cakes",
                  "Pizza",
                  "Bread",
                  "Soup"
                ],
                acceptedAnswers: [
                  "Cakes"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-fr",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "J’adore ma ville parce qu’il y a beaucoup de magasins. Le weekend prochain, je vais faire du shopping avec ma mère.",
        questions: [
          {
            id: "fr-f-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my city because there are many shops. Next weekend, I am going to go shopping with my mother."
          }
        ]
      }
    ]
  },
  {
    id: "fr-read-f-101-v2",
    paperCode: "1FR0/3F",
    language: "French",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Ma Famille et Mes Loisirs (Set B)",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-fr-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "fr-f-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Thomas.",
            marks: 3,
            context: "Bonjour, je m’appelle Thomas. J’habite dans un petit appartement à Lyon. J’adore jouer au tennis de table et écouter de la musique française le soir. Le weekend, j’aime préparer des gâteaux pour ma famille.",
            subQuestions: [
              {
                id: "fr-f-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Thomas live?",
                marks: 1,
                options: [
                  "Paris",
                  "Lyon",
                  "Marseille",
                  "Nice"
                ],
                acceptedAnswers: [
                  "Lyon"
                ]
              },
              {
                id: "fr-f-q1-2-v2",
                type: "multiple_choice",
                prompt: "What sport does he love playing?",
                marks: 1,
                options: [
                  "Tennis",
                  "Table tennis",
                  "Football",
                  "Rugby"
                ],
                acceptedAnswers: [
                  "Table tennis"
                ]
              },
              {
                id: "fr-f-q1-3-v2",
                type: "multiple_choice",
                prompt: "What does he prepare for his family?",
                marks: 1,
                options: [
                  "Cakes",
                  "Pizza",
                  "Bread",
                  "Soup"
                ],
                acceptedAnswers: [
                  "Cakes"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-fr-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "J’adore ma ville parce qu’il y a beaucoup de magasins. Le weekend prochain, je vais faire du shopping avec ma mère.",
        questions: [
          {
            id: "fr-f-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my city because there are many shops. Next weekend, I am going to go shopping with my mother."
          }
        ]
      }
    ]
  },
  {
    id: "de-read-f-101",
    paperCode: "1GN0/3F",
    language: "German",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Meine Familie und Hobbys",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-de",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "de-f-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Lukas.",
            marks: 3,
            context: "Hallo, ich heiße Lukas. Ich wohne in einem Haus in München. Mein Lieblingshobby ist Schwimmen im See. Am Samstag gehe ich mit meinen Freunden ins Kino.",
            subQuestions: [
              {
                id: "de-f-q1-1",
                type: "multiple_choice",
                prompt: "Where does Lukas live?",
                marks: 1,
                options: [
                  "Berlin",
                  "München",
                  "Hamburg",
                  "Köln"
                ],
                acceptedAnswers: [
                  "München"
                ]
              },
              {
                id: "de-f-q1-2",
                type: "multiple_choice",
                prompt: "What is his favorite hobby?",
                marks: 1,
                options: [
                  "Running",
                  "Swimming",
                  "Cycling",
                  "Hiking"
                ],
                acceptedAnswers: [
                  "Swimming"
                ]
              },
              {
                id: "de-f-q1-3",
                type: "multiple_choice",
                prompt: "Where is he going on Saturday with his friends?",
                marks: 1,
                options: [
                  "Park",
                  "Cinema",
                  "School",
                  "Beach"
                ],
                acceptedAnswers: [
                  "Cinema"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-de",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Ich liebe mein Haus, weil es einen schönen Garten hat. Morgen werde ich mit meinem Vater Fußball spielen.",
        questions: [
          {
            id: "de-f-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my house because it has a beautiful garden. Tomorrow I will play football with my father."
          }
        ]
      }
    ]
  },
  {
    id: "de-read-f-101-v2",
    paperCode: "1GN0/3F",
    language: "German",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - Meine Familie und Hobbys (Set B)",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-de-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "de-f-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Lukas.",
            marks: 3,
            context: "Hallo, ich heiße Lukas. Ich wohne in einem Haus in München. Mein Lieblingshobby ist Schwimmen im See. Am Samstag gehe ich mit meinen Freunden ins Kino.",
            subQuestions: [
              {
                id: "de-f-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Lukas live?",
                marks: 1,
                options: [
                  "Berlin",
                  "München",
                  "Hamburg",
                  "Köln"
                ],
                acceptedAnswers: [
                  "München"
                ]
              },
              {
                id: "de-f-q1-2-v2",
                type: "multiple_choice",
                prompt: "What is his favorite hobby?",
                marks: 1,
                options: [
                  "Running",
                  "Swimming",
                  "Cycling",
                  "Hiking"
                ],
                acceptedAnswers: [
                  "Swimming"
                ]
              },
              {
                id: "de-f-q1-3-v2",
                type: "multiple_choice",
                prompt: "Where is he going on Saturday with his friends?",
                marks: 1,
                options: [
                  "Park",
                  "Cinema",
                  "School",
                  "Beach"
                ],
                acceptedAnswers: [
                  "Cinema"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-de-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "Ich liebe mein Haus, weil es einen schönen Garten hat. Morgen werde ich mit meinem Vater Fußball spielen.",
        questions: [
          {
            id: "de-f-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my house because it has a beautiful garden. Tomorrow I will play football with my father."
          }
        ]
      }
    ]
  },
  {
    id: "ar-read-f-101",
    paperCode: "1AA0/3F",
    language: "Arabic",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - عائلتي وهواياتي",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-ar",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "ar-f-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Amin.",
            marks: 3,
            context: "مرحباً، اسمي أمين. أعيش في شقة جميلة في القاهرة. هوايتي المفضلة هي القراءة والرسم في المساء. يوم السبت، أذهب إلى المنتزه مع أصدقائي للعب كرة القدم.",
            subQuestions: [
              {
                id: "ar-f-q1-1",
                type: "multiple_choice",
                prompt: "Where does Amin live?",
                marks: 1,
                options: [
                  "Cairo",
                  "Alexandria",
                  "Giza",
                  "Luxor"
                ],
                acceptedAnswers: [
                  "Cairo"
                ]
              },
              {
                id: "ar-f-q1-2",
                type: "multiple_choice",
                prompt: "What are his favorite hobbies?",
                marks: 1,
                options: [
                  "Reading and drawing",
                  "Singing and dancing",
                  "Running and swimming",
                  "Cooking and eating"
                ],
                acceptedAnswers: [
                  "Reading and drawing"
                ]
              },
              {
                id: "ar-f-q1-3",
                type: "multiple_choice",
                prompt: "Where does he go on Saturday with his friends?",
                marks: 1,
                options: [
                  "School",
                  "Museum",
                  "Park",
                  "Library"
                ],
                acceptedAnswers: [
                  "Park"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-ar",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "أحب عائلتي كثيراً لأنهم يساعدونني دائماً. غداً سأذهب لزيارة جدي وجدتي في الريف.",
        questions: [
          {
            id: "ar-f-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my family very much because they always help me. Tomorrow I will go to visit my grandfather and grandmother in the countryside."
          }
        ]
      }
    ]
  },
  {
    id: "ar-read-f-101-v2",
    paperCode: "1AA0/3F",
    language: "Arabic",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - عائلتي وهواياتي (Set B)",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-ar-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "ar-f-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Amin.",
            marks: 3,
            context: "مرحباً، اسمي أمين. أعيش في شقة جميلة في القاهرة. هوايتي المفضلة هي القراءة والرسم في المساء. يوم السبت، أذهب إلى المنتزه مع أصدقائي للعب كرة القدم.",
            subQuestions: [
              {
                id: "ar-f-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Amin live?",
                marks: 1,
                options: [
                  "Cairo",
                  "Alexandria",
                  "Giza",
                  "Luxor"
                ],
                acceptedAnswers: [
                  "Cairo"
                ]
              },
              {
                id: "ar-f-q1-2-v2",
                type: "multiple_choice",
                prompt: "What are his favorite hobbies?",
                marks: 1,
                options: [
                  "Reading and drawing",
                  "Singing and dancing",
                  "Running and swimming",
                  "Cooking and eating"
                ],
                acceptedAnswers: [
                  "Reading and drawing"
                ]
              },
              {
                id: "ar-f-q1-3-v2",
                type: "multiple_choice",
                prompt: "Where does he go on Saturday with his friends?",
                marks: 1,
                options: [
                  "School",
                  "Museum",
                  "Park",
                  "Library"
                ],
                acceptedAnswers: [
                  "Park"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-ar-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "أحب عائلتي كثيراً لأنهم يساعدونني دائماً. غداً سأذهب لزيارة جدي وجدتي في الريف.",
        questions: [
          {
            id: "ar-f-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my family very much because they always help me. Tomorrow I will go to visit my grandfather and grandmother in the countryside."
          }
        ]
      }
    ]
  },
  {
    id: "he-read-f-101",
    paperCode: "1HE0/3F",
    language: "Modern Hebrew",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - המשפחה והתחביבים שלי",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-mhe",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "he-f-q1",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Yonatan.",
            marks: 3,
            context: "שלום, קוראים לי יונתן. אני גר בבית קטן בירושלים. התחביב הכי גדול שלי הוא לנגן בגיטרה ולשיר. ביום שישי בערב, אני אוכל ארוחת ערב טעימה עם המשפחה שלי.",
            subQuestions: [
              {
                id: "he-f-q1-1",
                type: "multiple_choice",
                prompt: "Where does Yonatan live?",
                marks: 1,
                options: [
                  "Tel Aviv",
                  "Jerusalem",
                  "Haifa",
                  "Eilat"
                ],
                acceptedAnswers: [
                  "Jerusalem"
                ]
              },
              {
                id: "he-f-q1-2",
                type: "multiple_choice",
                prompt: "What is his biggest hobby?",
                marks: 1,
                options: [
                  "Playing guitar and singing",
                  "Running",
                  "Cooking",
                  "Drawing"
                ],
                acceptedAnswers: [
                  "Playing guitar and singing"
                ]
              },
              {
                id: "he-f-q1-3",
                type: "multiple_choice",
                prompt: "When does he eat a delicious dinner with his family?",
                marks: 1,
                options: [
                  "Sunday night",
                  "Friday evening",
                  "Monday morning",
                  "Wednesday noon"
                ],
                acceptedAnswers: [
                  "Friday evening"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-mhe",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "אני אוהב את החדר שלי כי הוא מאוד נעים. מחר אני אלך לפגוש את החברים שלי במרכז העיר.",
        questions: [
          {
            id: "he-f-t1",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my room because it is very cozy. Tomorrow I will go to meet my friends in the city center."
          }
        ]
      }
    ]
  },
  {
    id: "he-read-f-101-v2",
    paperCode: "1HE0/3F",
    language: "Modern Hebrew",
    tier: "foundation",
    theme: "FAMILY_HOBBIES",
    title: "Paper 3: Reading (Foundation Tier) - המשפחה והתחביבים שלי (Set B)",
    totalMarks: 12,
    estimatedTime: 45,
    sections: [
      {
        id: "sec-a-f-mhe-v2",
        type: "reading",
        title: "SECTION A: Reading Comprehension",
        instructions: "Answer all questions in English.",
        questions: [
          {
            id: "he-f-q1-v2",
            type: "multiple_choice",
            prompt: "Q1: Choose the correct answer regarding Yonatan.",
            marks: 3,
            context: "שלום, קוראים לי יונתן. אני גר בבית קטן בירושלים. התחביב הכי גדול שלי הוא לנגן בגיטרה ולשיר. ביום שישי בערב, אני אוכל ארוחת ערב טעימה עם המשפחה שלי.",
            subQuestions: [
              {
                id: "he-f-q1-1-v2",
                type: "multiple_choice",
                prompt: "Where does Yonatan live?",
                marks: 1,
                options: [
                  "Tel Aviv",
                  "Jerusalem",
                  "Haifa",
                  "Eilat"
                ],
                acceptedAnswers: [
                  "Jerusalem"
                ]
              },
              {
                id: "he-f-q1-2-v2",
                type: "multiple_choice",
                prompt: "What is his biggest hobby?",
                marks: 1,
                options: [
                  "Playing guitar and singing",
                  "Running",
                  "Cooking",
                  "Drawing"
                ],
                acceptedAnswers: [
                  "Playing guitar and singing"
                ]
              },
              {
                id: "he-f-q1-3-v2",
                type: "multiple_choice",
                prompt: "When does he eat a delicious dinner with his family?",
                marks: 1,
                options: [
                  "Sunday night",
                  "Friday evening",
                  "Monday morning",
                  "Wednesday noon"
                ],
                acceptedAnswers: [
                  "Friday evening"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "sec-b-f-mhe-v2",
        type: "translation_passage",
        title: "SECTION B: Translation into English",
        instructions: "Translate the following passage into English.",
        passage: "אני אוהב את החדר שלי כי הוא מאוד נעים. מחר אני אלך לפגוש את החברים שלי במרכז העיר.",
        questions: [
          {
            id: "he-f-t1-v2",
            type: "translation_passage",
            prompt: "Translate the entire passage.",
            marks: 10,
            explanation: "Expected: I love my room because it is very cozy. Tomorrow I will go to meet my friends in the city center."
          }
        ]
      }
    ]
  }
];
