export type ExamTheme =  'Identity and culture' | 'Local, national, international and global areas of interest' | 'Current and future study and employment';

export const EXAM_THEMES = [
  'Identity and culture',
  'Local, national, international and global areas of interest',
  'Current and future study and employment'
];

export interface ReadAloudTask {
  id: string;
  title: string;
  text: string;
}

export const READ_ALOUD_TASKS: ReadAloudTask[] = [
  {
    id: 'ra1',
    title: 'Mi Escuela',
    text: 'Normalmente, voy al instituto en autobús. Las clases empiezan a las nueve y terminan a las tres. Me gustan las matemáticas porque son útiles, pero odio la historia porque es muy aburrida. Ayer, jugué al fútbol con mis amigos durante el recreo.'
  },
  {
    id: 'ra2',
    title: 'Mis Vacaciones',
    text: 'El año pasado, fui a España con mi familia durante dos semanas. Nos alojamos en un hotel cerca de la playa. El primer día, nadé en el mar y comí paella. ¡Fue una experiencia inolvidable! Sin embargo, el último día llovió mucho.'
  },
  {
    id: 'ra3',
    title: 'Mi Ciudad',
    text: 'Vivo en una ciudad bastante grande en el sur de Inglaterra. Hay muchos parques y un gran centro comercial. Lo bueno es que hay muchas cosas que hacer para los jóvenes. Lo malo es que hay demasiado tráfico y a veces hay contaminación.'
  }
];

export interface RolePlayCard {
  id: string;
  scenario: string;
  bulletPoints: string[];
}

export const ROLE_PLAY_CARDS: RolePlayCard[] = [
  {
    id: 'rp1',
    scenario: "Estás hablando con tu amigo/a español/a sobre la tecnología.",
    bulletPoints: [
      "Qué haces con tu móvil (un detalle).",
      "Tu opinión sobre las redes sociales.",
      "Qué hiciste ayer en internet (! - unpredicted).",
      "Preguntar sobre el portátil de tu amigo/a (?)."
    ]
  },
  {
    id: 'rp2',
    scenario: "Estás en el restaurante en España hablado con el camarero.",
    bulletPoints: [
      "Qué quieres comer y beber.",
      "Un problema con la comida (! - unpredicted).",
      "La cuenta y cómo vas a pagar.",
      "Preguntar por los postres (?)."
    ]
  }
];

export interface PictureCard {
  id: string;
  theme: string;
  imageUrl: string; // Placeholder or emoji for now
  description: string;
  questions: string[];
}

export const PICTURE_CARDS: PictureCard[] = [
  {
    id: 'pc1',
    theme: 'Identity and culture',
    imageUrl: '📸 [Imagen de una familia comiendo junta]',
    description: "La foto muestra a una familia comiendo junta en un restaurante. Hay cuatro personas: los padres y dos hijos. Parecen estar celebrando un cumpleaños porque hay un pastel en la mesa. Todos están sonriendo y felices.",
    questions: [
      "¿Qué se puede ver en la foto?",
      "¿Qué están comiendo?",
      "¿Qué te gusta hacer con tu familia los fines de semana?"
    ]
  },
  {
    id: 'pc2',
    theme: 'Local, national, international and global areas of interest',
    imageUrl: '📸 [Imagen de jóvenes reciclando]',
    description: "En la imagen, se ven varios adolescentes en un parque. Están recogiendo basura y poniéndola en diferentes bolsas de reciclaje. El día está soleado y llevan ropa de verano.",
    questions: [
      "Describe la foto.",
      "¿Qué están haciendo los jóvenes?",
      "¿Qué hiciste tú la semana pasada para ayudar al medio ambiente?"
    ]
  },
  {
    id: 'pc3',
    theme: 'Current and future study and employment',
    imageUrl: '📸 [Imagen de un salón de clases moderno]',
    description: "Es una clase con estudiantes usando tabletas. El profesor está ayudando a un estudiante. La clase parece moderna, con pantallas grandes en la pared.",
    questions: [
      "¿Qué hay en esta foto?",
      "¿Qué están haciendo los estudiantes?",
      "¿Te gustaría trabajar como profesor en el futuro? ¿Por qué?"
    ]
  }
];
