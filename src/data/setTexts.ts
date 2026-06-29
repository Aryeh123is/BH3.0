import { SetText } from '../types';

export const BIBLICAL_HEBREW_SET_TEXTS: SetText[] = [
  {
    id: 'joseph-set',
    title: 'Joseph (Genesis 41-43)',
    language: 'biblical',
    chapters: [
      {
        id: 'gen-41',
        title: 'Genesis 41: Pharaoh\'s Dreams',
        verses: [
          {
            id: 'gen-41-1',
            verseNumber: 1,
            hebrewText: 'וַיְהִי מִקֵּץ שְׁנָתַיִם יָמִים וּפַרְעֹה חֹלֵם וְהִנֵּה עֹמֵד עַל־הַיְאֹר׃',
            englishTranslation: 'And it came to pass at the end of two full years, that Pharaoh dreamed; and, behold, he stood by the river.',
            words: [
              { text: 'וַיְהִי', translation: 'and it came to pass', notes: 'Waw Consecutive + Qal Imperfect 3ms of היה.' },
              { text: 'מִקֵּץ', translation: 'at the end of', notes: 'Preposition מ (from) + קץ (end).' },
              { text: 'שְׁנָתַיִם', translation: 'two years', notes: 'Dual form of שׁנה (year).' },
              { text: 'יָמִים', translation: 'days', notes: 'Plural of יום. "Two years of days" means two full years.' },
              { text: 'וּפַרְעֹה', translation: 'and Pharaoh', notes: 'Proper name (title).' },
              { text: 'חֹלֵם', translation: 'was dreaming', notes: 'Qal Participle ms of חלם.' },
              { text: 'וְהִנֵּה', translation: 'and behold', notes: 'Behold!' },
              { text: 'עֹמֵד', translation: 'standing', notes: 'Qal Participle ms of עמד.' },
              { text: 'עַל־הַיְאֹר', translation: 'by the Nile (river)', notes: 'Preposition עַל (on/by) + Article + יאר (Nile).' }
            ]
          }
        ]
      },
      { id: 'gen-42', title: 'Genesis 42: Joseph\'s Brothers in Egypt', verses: [] },
      { id: 'gen-43', title: 'Genesis 43: The Second Journey', verses: [] }
    ]
  },
  {
    id: 'elisha-set',
    title: 'Elisha (2 Kings 4-7)',
    language: 'biblical',
    chapters: [
      {
        id: '2kings-4',
        title: '2 Kings 4: The Widow\'s Oil',
        verses: [
          {
            id: '2k-4-1',
            verseNumber: 1,
            hebrewText: 'וְאִשָּׁה אַחַת מִנְּשֵׁי בְנֵי־הַנְּבִיאִים צָעֲקָה אֶל־אֱלִישָׁע לֵאמֹר עַבְדְּךָ אִישִׁי מֵת וְאַתָּה יָדַעְתָּ כִּי עַבְדְּךָ הָיָה יָרֵא אֶת־יְהוָה וְהַנֹּשֶׁה בָּא לָקַחַת אֶת־שְׁנֵי יְלָדַי לוֹ לַעֲבָדִים׃',
            englishTranslation: 'Now there cried a certain woman of the wives of the sons of the prophets unto Elisha, saying, Thy servant my husband is dead; and thou knowest that thy servant did fear the LORD: and the creditor is come to take unto him my two sons to be bondmen.',
            words: [
              { text: 'וְאִשָּׁה', translation: 'and a woman', notes: 'Waw + אשה (woman).' },
              { text: 'אַחַת', translation: 'one (certain)', notes: 'Numeral (feminine).' },
              { text: 'מִנְּשֵׁי', translation: 'from the wives of', notes: 'Construct plural of אשה.' },
              { text: 'בְנֵי־הַנְּבִיאִים', translation: 'the sons of the prophets', notes: 'Construct plural of בן + Article + Plural of נביא.' },
              { text: 'צָעֲקָה', translation: 'cried out', notes: 'Qal Perfect 3fs of צעק.' },
              { text: 'אֶל־אֱלִישָׁע', translation: 'to Elisha', notes: 'Proper name Elisha.' }
            ]
          }
        ]
      },
      { id: '2kings-5', title: '2 Kings 5: Naaman is Healed', verses: [] },
      { id: '2kings-6', title: '2 Kings 6: The Floating Ax Head', verses: [] },
      { id: '2kings-7', title: '2 Kings 7: The Arameans Flee', verses: [] }
    ]
  }
];
