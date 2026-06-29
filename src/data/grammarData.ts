
export interface GrammarContent {
  id: string;
  title: string;
  desc: string;
  content?: string;
  details?: {
    meaning?: string;
    example?: string;
    recognize?: string;
    description?: string;
  };
  type?: string;
  name?: string; // for compatibility with old BH data structure
}

export interface GrammarSection {
  id: string;
  label: string;
  icon: string; // lucide icon name
  items: GrammarContent[];
}

export const GRAMMAR_CURRICULUM: Record<string, GrammarSection[]> = {
  'Spanish': [
    {
      id: 'verbs',
      label: 'Verbs & Tenses',
      icon: 'Zap',
      items: [
        { id: 'present', title: 'Present Tense (El Presente)', desc: 'Regular and irregular present tense conjugations.', content: 'Spanish verbs end in -ar, -er, or -ir. Patterns: -ar (-o, -as, -a, -amos, -áis, -an), -er (-o, -es, -e, -emos, -éis, -en), -ir (-o, -es, -e, -imos, -ís, -en). Common irregulars: SER, ESTAR, TENER, IR, HACER.' },
        { id: 'preterite', title: 'Preterite (El Pretérito)', desc: 'Completed actions in the past.', content: 'Specific events. -ar (-é, -aste, -ó, -amos, -asteis, -aron), -er/ir (-í, -iste, -ió, -imos, -isteis, -ieron). Note: IR and SER have the same irregular preterite (fui, fuiste...). Many irregulars like TENER (tuve), HACER (hice).' },
        { id: 'imperfect', title: 'Imperfect (El Imperfecto)', desc: 'Ongoing or habitual past actions.', content: 'Used for scenery, time, age, and repeated actions. -ar (aba, abas, aba...), -er/ir (ía, ías, ía...). Only three irregulars: Ir (iba), Ser (era), Ver (veía).' },
        { id: 'perfect', title: 'Present Perfect (Próximo)', desc: 'Recent past or experiences.', content: 'Formed with "Haber" (he, has, ha, hemos, habéis, han) + Past Participle (-ado/-ido). E.g., "He comido" (I have eaten). Irregulars: dicho, hecho, visto, puesto.' },
        { id: 'future', title: 'Future (El Futuro Simple)', desc: 'Actions that will happen.', content: 'Add endings to the infinitive for ALL verbs (-é, -ás, -á, -emos, -éis, -án). Common stem changes: Tendr-, Har-, Podr-, Querr-.' },
        { id: 'conditional', title: 'Conditional (El Condicional)', desc: 'Hypothetical actions.', content: 'Infinitive + endings (-ía, -ías, -ía, -íamos, -íais, -ían). Same irregular stems as the future tense.' },
        { id: 'subjunctive', title: 'Present Subjunctive', desc: 'Desires, emotions, and uncertainty.', content: 'Take the "yo" present form, drop the -o, add "opposite" endings. -ar (-e, -es, -e, -emos, -éis, -en), -er/ir (-a, -as, -a, -amos, -áis, -an). Mandatory after verbs of influence (Querer que...) or emotion (Sentir que...).' }
      ]
    },
    {
      id: 'nouns',
      label: 'Nouns & Adjectives',
      icon: 'Layers',
      items: [
        { id: 'gender', title: 'Gender & Number', desc: 'Comprehensive agreement rules.', content: 'Masc: usually -o, -or, -ma. Fem: -a, -ción, -dad. Plurals: -s (vowel), -es (consonant). Adjectives always agree. Position: usually AFTER the noun (El coche rojo).' },
        { id: 'determiners', title: 'Articles & Determiners', desc: 'Definite vs Indefinite.', content: 'Definite: El, La, Los, Las. Indefinite: Un, Una, Unos, Unas. Used differently than English, e.g., with titles (El General) and abstract concepts (La libertad).' },
        { id: 'demonstratives', title: 'Demonstrative Adjectives', desc: 'Este, ese, aquel.', content: 'Este/esta (this), Ese/esa (that), Aquel/aquella (that one over there). Must agree with the noun.' }
      ]
    },
    {
      id: 'pronouns',
      label: 'Pronouns & Objects',
      icon: 'SpellCheck',
      items: [
        { id: 'direct-indirect', title: 'Direct & Indirect Objects', desc: 'Me, te, lo/la, le...', content: 'Direct (Lo/La/Los/Las) vs Indirect (Le/Les). Indirect precedes Direct. Common "se lo" rule: "Le lo" becomes "Se lo". Position: Before conjugated verb or attached to infinitive/participle/command.' },
        { id: 'relative', title: 'Relative Pronouns', desc: 'Que, quien, cuyo.', content: 'QUE is universal. QUIEN is for people after prepositions. CUYO means "whose" and agrees with the following object.' }
      ]
    },
    {
      id: 'essential-distinctions',
      label: 'Critical Distinctions',
      icon: 'ShieldCheck',
      items: [
        { id: 'ser-estar', title: 'Ser vs. Estar', desc: 'The two verbs for "to be".', content: 'SER (Permanent/Identity): Occupation, Origin, Characteristics, Time. ESTAR (Temporary/Location): Mood, Health, Physical Location, Present Continuous (estoy comiendo).' },
        { id: 'por-para', title: 'Por vs. Para', desc: 'Understanding "for".', content: 'PARA (Goal/Recipient): Destination, Purpose (In order to), Deadlines, Recipient. POR (Reason/Exchange): Cause, Duration, Mode of Transport, Exchange/Price.' },
        { id: 'reflexives', title: 'Reflexive Verbs', desc: 'Doing actions to oneself.', content: 'Pronouns: me, te, se, nos, os, se. Usually used for daily routines (lavarse, levantarse) or change of state (aburrirse). Position matches object pronouns.' }
      ]
    }
  ],
  'French': [
    {
      id: 'verbs',
      label: 'Verbs & Tenses',
      icon: 'Zap',
      items: [
        { id: 'present', title: 'Le Présent', desc: 'Present tense for -er, -ir, -re verbs.', content: '-ER (e, es, e, ons, ez, ent), -IR (is, is, it, issons, issez, issent), -RE (s, s, -, ons, ez, ent). Key irregulars to memorize: Être, Avoir, Aller, Faire, Venir, Prendre.' },
        { id: 'passe-compose', title: 'Le Passé Composé', desc: 'The main past tense.', content: 'Avoir/Être (present) + Past Participle. Most use Avoir. Motion verbs (DR & MRS VANDERTRAMP) and reflexives use Être. Agreement is mandatory with Être.' },
        { id: 'imparfait', title: 'L\'Imparfait', desc: 'Descriptive and habitual past.', content: 'Take "nous" form of present, remove -ons, add: -ais, -ais, -ait, -ions, -iez, -aient. Exception: être stem is "ét-".' },
        { id: 'futur-simple', title: 'Le Futur Simple', desc: 'Predicted actions.', content: 'Infinitive (remove -e for -re) + endings (ai, as, a, ons, ez, ont). Irregular stems: Ser-, Aur-, Ir-, Fer-.' },
        { id: 'conditionnel', title: 'Le Conditionnel', desc: 'Politeness and hypotheses.', content: 'Future stem + Imperfect endings. Used for "would".' },
        { id: 'subjontif', title: 'Le Subjonctif', desc: 'Necessity and subjectivity.', content: 'Take "ils" form, drop -ent, add: e, es, e, ions, iez, ent. Mandatory after "Il faut que..." or emotive expressions.' }
      ]
    },
    {
      id: 'grammar',
      label: 'Syntax & Structure',
      icon: 'FileText',
      items: [
        { id: 'negation', title: 'Negation', desc: 'Beyond ne...pas.', content: 'Ne...pas (not), Ne...jamais (never), Ne...plus (no more), Ne...rien (nothing), Ne...personne (no one). Personne/Rien can be subjects.' },
        { id: 'adverbs', title: 'Adverb Formation', desc: '-ment endings.', content: 'Take feminine adjective + -ment. E.g., heureuse -> heureusement. If adjective ends in vowel, add to masculine: vrai -> vraiment.' },
        { id: 'questions', title: 'Questions', desc: 'Forming interrogatives.', content: 'Three ways: 1. Intonation. 2. Est-ce que... 3. Inversion (e.g., Parles-tu?).' }
      ]
    },
    {
      id: 'advanced-syntax',
      label: 'Advanced Syntax',
      icon: 'Shield',
      items: [
        { id: 'pronouns-y-en', title: 'Pronouns Y & EN', desc: 'Replacing places and quantities.', content: 'Y replaces "à + place/thing" (J\'y vais - I\'m going there). EN replaces "de + thing/quantity" (J\'en veux - I want some).' },
        { id: 'object-pronouns', title: 'Object Pronouns', desc: 'Me, te, le, la, lui...', content: 'Direct (le, la, les) vs Indirect (lui, leur). Order: Me/Te/Se/Nos/Vos > Le/La/Les > Lui/Leur > Y > En.' }
      ]
    }
  ],
  'German': [
    {
      id: 'cases',
      label: 'The Case System',
      icon: 'Layers',
      items: [
        { id: 'nominative', title: 'Nominative', desc: 'Subject focus.', content: 'Der/Die/Das/Die. The default case for the person or thing doing the action.' },
        { id: 'accusative', title: 'Accusative', desc: 'Direct objects.', content: 'Masc changes (Der -> Den, Ein -> Einen). Used for direct objects and after prepositions like durch, für, gegen, ohne, um.' },
        { id: 'dative', title: 'Dative', desc: 'Indirect objects.', content: 'Changes: Der/Das -> Dem, Die -> Der, Plur -> Den+n. Used for indirect objects and after mit, nach, von, zu, bei.' },
        { id: 'genitive', title: 'Genitive Mastery', desc: 'Possession & Formal Syntax.', content: 'Der/Das -> Des (+s on noun), Die/Plur -> Der. Essential for formal writing. Also used after specific prepositions: während (during), wegen (because of), trotz (despite), anstatt (instead of). E.g., "Während des Unterrichts".' },
        { id: 'case-interactions', title: 'Advanced Case Interaction', desc: 'Two-Way Prepositions.', content: 'Nine prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen) change case. Accusative denotes movement/action (Wohin?). Dative denotes location/static position (Wo?). Examples: "In das Haus" (Into the house) vs "In dem Haus" (Inside the house).' }
      ]
    },
    {
      id: 'verbs',
      label: 'Verbs & Tenses',
      icon: 'Zap',
      items: [
        { id: 'present', title: 'Präsens', desc: 'Regular and irregular present.', content: 'Endings: -e, -st, -t, -en, -t, -en. Stem-vowel changes: a -> ä (fahren), e -> i/ie (geben, lesen) in du/er/sie/es forms.' },
        { id: 'perfect', title: 'Perfekt', desc: 'Conversational past.', content: 'Haben/Sein + Ge-participle. Sein is for movement or change of state (gehen, laufen, sterben).' },
        { id: 'future', title: 'Futur I', desc: 'Future intent.', content: 'Werden (conjugated) + Infinitive at the end. E.g., "Ich werde morgen kommen".' },
        { id: 'modals', title: 'Modal Verbs', desc: 'Können, müssen, dürfen...', content: 'Conjugated modal in position 2, main infinitive at the END. E.g., "Ich kann Deutsch sprechen".' }
      ]
    },
    {
      id: 'syntax',
      label: 'Sentence Structure',
      icon: 'Book',
      items: [
        { id: 'word-order', title: 'V2 Rule & TMP', desc: 'Mastering the order.', content: 'Main verb in position 2. Time-Manner-Place order for expressions. "Morgen gehe ich (T V S)" instead of "Morgen ich gehe".' },
        { id: 'conjunctions', title: 'Coordinating vs Subordinating', desc: 'Und vs Weil.', content: 'Und/Aber/Oder (ADUSO): No effect on order. Weil/Dass/Wenn: Sends verb to the very END.' }
      ]
    }
  ],
  'Arabic': [
    {
      id: 'script',
      label: 'Fundamental Patterns',
      icon: 'SpellCheck',
      items: [
        { id: 'roots', title: 'The Root & Pattern System', desc: 'The backbone of Arabic morphology.', content: 'Words are built from a 3-letter semantic root (e.g., K-T-B). Vowel patterns and prefixes/suffixes determine the exact meaning (Kataba = he wrote, Kaatib = writer).' },
        { id: 'gender', title: 'Gender & Agreement', desc: 'Masc/Fem in nouns/adj.', content: 'Fem: usually ends in Ta Marbuta (ة). Plurals: Sound Masculine (-uun/-iin), Sound Feminine (-aat). Broken Plurals: Internal changes (Kitaab -> Kutub).' },
        { id: 'definite', title: 'The Definite Article (Al)', desc: 'Moon vs Sun letters.', content: 'AL attaches to the noun. Sun letters (shamsiya) cause the "L" of "Al" to assimilate into the first letter (e.g., Ash-Shams). Moon letters (qamariya) keep the "L" sound (e.g., Al-Qamar).' }
      ]
    },
    {
      id: 'verbs',
      label: 'Verbal System',
      icon: 'Zap',
      items: [
        { id: 'past', title: 'Past Tense (Al-Maadi)', desc: 'Completed actions.', content: 'Stem + Suffixes. Kataba (he), Katabat (she), Katabtu (I). Roots usually represent 3rd person masc singular past.' },
        { id: 'present', title: 'Present Tense (Al-Mudaari)', desc: 'Ongoing/Future actions.', content: 'Prefixes + Stem + Suffixes. Yaktubu (he), Taktubu (she), Aktubu (I). Add "sa-" prefix for future (Sayaktubu).' },
        { id: 'derived-forms', title: 'The 10 Derived Forms', desc: 'Complex semantic shades.', content: 'Form II (Intensive/Causative, e.g., Allama - he taught), Form III (Interaction, e.g., Kaataba - he corresponded), Form V (Reflexive, e.g., Ta\'allama - he learned).' }
      ]
    },
    {
      id: 'syntax',
      label: 'Sentence Types',
      icon: 'FileText',
      items: [
        { id: 'nominal', title: 'Nominal Sentences (Jumla Ismiya)', desc: 'Starting with a noun.', content: 'Standard: Subject + Predicate. "The boy [is] big" = Al-walad kabiir. There is no verb "to be" in the present tense.' },
        { id: 'verbal', title: 'Verbal Sentences (Jumla Fi\'liya)', desc: 'Starting with a verb.', content: 'VSO (Verb-Subject-Object). The verb stays singular if the subject follows. "Dhahaba al-awlaad" (The boys went).' },
        { id: 'idafa', title: 'The Idafa Construction', desc: 'Deep Structure Possessive Chains.', content: 'The fundamental possessive structure (e.g., Kitaab al-mudarris - The teacher\'s book). The first noun (Muḍāf) is NEVER definite (no "Al-") or tanween, while the second (Muḍāf ilayh) is usually definite and in the genitive case. Multiple nouns can be chained: Sayyārat zawjat al-mudarris (The car of the teacher\'s wife).' }
      ]
    }
  ],
  'Biblical Hebrew': [
    {
      id: 'binyanim',
      label: 'Verbs',
      icon: 'Zap',
      items: [
        { 
          id: 'paal', 
          title: 'Pa\'al (Qal)', 
          name: 'Pa\'al (Qal)', 
          desc: 'Simple Active', 
          details: {
            meaning: 'Simple Active', 
            example: 'כָּתַב (He wrote), שָׁמַר (He guarded)', 
            description: 'The most basic verb pattern. Denotes a simple action with no added intensive or causative nuance. It is the "default" state of a verb root.',
            recognize: 'Perfect: Vowels are typically qamets-pathach (כָּתַב). Imperfect: Prefixes with hireq, usually o-vowel in the stem (יִכְתֹּב). Active participle: Cholam-vav after the 1st root letter (כּוֹתֵב). Passive participle: Base vowels are qamets-shureq (כָּתוּב).'
          }
        },
        { 
          id: 'nifal', 
          title: 'Nif\'al', 
          name: 'Nif\'al', 
          desc: 'Simple Passive / Reflexive', 
          details: {
            meaning: 'Simple Passive / Reflexive', 
            example: 'נִכְתַּב (It was written), נִשְׁמַר (He was guarded / he guarded himself)', 
            description: 'The passive counterpart to Pa\'al. Expresses reflexive or reciprocal actions (e.g., "to fight each other"). Often denotes actions happening to the subject or entering a state.',
            recognize: 'Perfect: Nun (נִ) prefix with hireq (נִכְתַּב). Imperfect: Nun assimilates into the 1st root letter as a dagesh, causing a prefix vowel change to hireq (יִכָּתֵב). Look for the dagesh in the first root letter after an imperfect prefix.'
          }
        },
        { 
          id: 'piel', 
          title: 'Pi\'el', 
          name: 'Pi\'el', 
          desc: 'Intensive Active', 
          details: {
            meaning: 'Intensive Active', 
            example: 'שִׁבֵּר (He smashed/shattered), דִּבֶּר (He spoke)', 
            description: 'Expresses an intensive or repetitive action. Often used to make intransitive verbs transitive (e.g., קדשׁ "to be holy" -> קדּשׁ "to sanctify/make holy"). Unlike Pa\'al, it often focuses on the duration or result of an action.',
            recognize: 'Perfect: Hireq under 1st letter, dagesh in 2nd letter, tsere under 2nd letter (שִׁבֵּר). Imperfect: Pathach under prefix, hireq under 1st root letter, dagesh in 2nd letter (יְדַבֵּר). Look for the characteristic dagesh forte in the second root letter across nearly all forms.'
          }
        },
        { 
          id: 'pual', 
          title: 'Pu\'al', 
          name: 'Pu\'al', 
          desc: 'Intensive Passive', 
          details: {
            meaning: 'Intensive Passive', 
            example: 'שֻׁבַּר (It was shattered), לֻמַּד (He was taught)', 
            description: 'The passive counterpart to Pi\'el. Denotes intensive action being done to the subject. Rarely used compared to Pi\'el.',
            recognize: 'Perfect: Qams-hatuph (o) or Qibbuts under 1st letter, dagesh in 2nd letter (שֻׁבַּר). Imperfect: Sheva under prefix, qibbuts under 1st root letter, dagesh in 2nd letter (יְשֻׁבַּר). The "u" vowel in the first root letter is the key diagnostic.'
          }
        },
        { 
          id: 'hifil', 
          title: 'Hif\'il', 
          name: 'Hif\'il', 
          desc: 'Causative Active', 
          details: {
            meaning: 'Causative Active', 
            example: 'הִשְׁמִיעַ (He caused to hear / he announced), הִמְלִיךְ (He caused to reign / he made king)', 
            description: 'Expresses causing someone or something else to perform the action or enter a state. Can also turn a noun into a verb (e.g., "to listen" vs "to cause to hear").',
            recognize: 'Perfect: He (הִ) prefix with hireq, hireq-yod after the 2nd root letter (הִשְׁמִיעַ). Imperfect: Pathach under prefix, hireq-yod after 2nd root letter (יַשְׁמִיעַ). The hireq-yod (i) after the 2nd root letter is very common but can shorten (to tsere) in certain forms.'
          }
        },
        { 
          id: 'hofal', 
          title: 'Hof\'al', 
          name: 'Hof\'al', 
          desc: 'Causative Passive', 
          details: {
            meaning: 'Causative Passive', 
            example: 'הָשְׁמַע (It was announced), הָמְלַךְ (He was made king)', 
            description: 'The passive counterpart to Hif\'il. Denotes that the subject was caused to perform the action or be in the state.',
            recognize: 'Perfect: He (הָ) prefix with qamets-hatuph or qibbuts (הָקְטַל). Imperfect: Qamets-hatuph (o-vowel) or pathach under prefix (יָקְטַל). Look for the "o" or "u" sound in the diagnostic prefix (Ha/Ho).'
          }
        },
        { 
          id: 'hitpael', 
          title: 'Hitpa\'el', 
          name: 'Hitpa\'el', 
          desc: 'Intensive Reflexive', 
          details: {
            meaning: 'Intensive Reflexive', 
            example: 'הִתְהַלֵּךְ (He walked himself / he strolled), הִתְפַּלֵּל (He prayed)', 
            description: 'Expresses reflexive or intensive actions, often showing the subject acting upon themselves, for themselves, or repeatedly. Can also indicate pretending to be something (e.g., "to make oneself great").',
            recognize: 'Perfect/Participle: הִתְ- (Hit-) prefix and a dagesh in the middle root letter. Imperfect: יִתְ- (Yit-) prefix. Note: if the 1st root letter is a sibilant (ס, ש, ז), the prefix "t" (ת) and the sibilant often swap places (metathesis), e.g., הִשְׁתַּמֵּר.'
          }
        }
      ]
    },
    {
       id: 'nouns',
       label: 'Nouns & Adj',
       icon: 'Layers',
       items: [
        { id: 'formation', title: 'Noun Formation', desc: 'Mishqalim patterns.', content: 'Nouns follow patterns like מ (location) or ת (abstracts). Gender ø/וֹת (masc) vs הָ/ת (fem). Number sing/plur/dual.' },
        { id: 'construct', title: 'The Construct State', desc: 'Genitive chains.', content: 'Masculine plural ים- becomes י-. Feminine singular הָ- becomes ת-. Definiteness is only on the final noun.' }
       ]
    },
    {
      id: 'morphemes',
      label: 'Prefixes',
      icon: 'SpellCheck',
      items: [
        { id: 'article', title: 'Definite Article', desc: 'The prefix הַ with dagesh.', content: 'Gutturals cause compensatory lengthening (הָ-) or virtual doubling.' },
        { id: 'prepositions', title: 'Inseparable Prepositions', desc: 'B-K-L prefixes.', content: 'Normally have sheva. Merge with the article if present.' }
      ]
    }
  ]
};
