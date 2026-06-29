import { PastPaper, GradeBoundaries } from '../types/pastPapers';

export const INITIAL_PAST_PAPERS: PastPaper[] = [
  // --- BIBLICAL HEBREW (EDEXCEL) ---
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2022_P1',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2022,
    paperNumber: 1,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-que-20220526.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-rms-20220825.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2022_P2',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2022,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-que-20220617.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-rms-20220825.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2024_P1',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2024,
    paperNumber: 1,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-que-20240522.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-rms-20240822.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2024_P2',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2024,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-que-20240604.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-rms-20240822.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2023_P1',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2023,
    paperNumber: 1,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-que-20230606.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-01-rms-20230824.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2023_P2',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2023,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-que-20230614.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1bh0-02-rms-20230824.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2020_P1',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2020,
    paperNumber: 1,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1BH0_01_que_20201112.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1BH0_01_msc_20210211.pdf'
  },
  {
    paperId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2020_P2',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2020,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1BH0_02_que_20201118.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/exam-materials/1BH0_02_msc_20210211.pdf'
  },

  // --- FRENCH (EDEXCEL - SAMS ONLY) ---
  // --- HIGHER TIER ---
  {
    paperId: 'EDEXCEL_FRENCH_HIGHER_2024_P2',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Higher',
    year: 2024,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/2-collated-gcse-french-sams-paper-2-higher.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/2-collated-gcse-french-sams-paper-2-higher.pdf',
    boundaries: { '9': 51, '8': 45, '7': 40, '6': 34, '5': 29, '4': 24, '3': 19 }
  },
  {
    paperId: 'EDEXCEL_FRENCH_HIGHER_2024_P3',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Higher',
    year: 2024,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/3-collated-gcse-french-sams-paper-3-higher.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/3-collated-gcse-french-sams-paper-3-higher.pdf',
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 27, '5': 22, '4': 17, '3': 12 }
  },
  {
    paperId: 'EDEXCEL_FRENCH_HIGHER_2024_P4',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Higher',
    year: 2024,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/4-collated-gcse-french-sams-paper-4-higher.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/4-collated-gcse-french-sams-paper-4-higher.pdf',
    boundaries: { '9': 51, '8': 45, '7': 40, '6': 34, '5': 29, '4': 24, '3': 19 }
  },
  // --- FOUNDATION TIER ---
  {
    paperId: 'EDEXCEL_FRENCH_FOUNDATION_2024_P2',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 2,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/2-collated-gcse-french-sams-paper-2-foundation-1.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/2-collated-gcse-french-sams-paper-2-foundation-1.pdf',
    boundaries: { '5': 42, '4': 36, '3': 29, '2': 21, '1': 13 }
  },
  {
    paperId: 'EDEXCEL_FRENCH_FOUNDATION_2024_P3',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/3-collated-gcse-french-sams-paper-3-foundation.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/3-collated-gcse-french-sams-paper-3-foundation.pdf',
    boundaries: { '5': 38, '4': 32, '3': 25, '2': 18, '1': 11 }
  },
  {
    paperId: 'EDEXCEL_FRENCH_FOUNDATION_2024_P4',
    examBoard: 'Edexcel',
    subject: 'French',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/4-collated-gcse-french-sams-paper-4-foundation.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/French/2024/specification-and-sample-assessments/4-collated-gcse-french-sams-paper-4-foundation.pdf',
    boundaries: { '5': 43, '4': 37, '3': 30, '2': 22, '1': 14 }
  },

  // --- SPANISH (EDEXCEL - ALL PAPERS) ---
  // --- HIGHER TIER ---
  // 2024 Higher
  {
    paperId: 'EDEXCEL_SPANISH_HIGHER_2024_P1',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Higher',
    year: 2024,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 21, '4': 16, '3': 11 }
  },
  {
    paperId: 'EDEXCEL_SPANISH_HIGHER_2024_P3',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Higher',
    year: 2024,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 27, '5': 22, '4': 17, '3': 12 }
  },
  {
    paperId: 'EDEXCEL_SPANISH_HIGHER_2024_P4',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Higher',
    year: 2024,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '9': 51, '8': 45, '7': 40, '6': 34, '5': 29, '4': 24, '3': 19 }
  },

  // --- FOUNDATION TIER ---
  // 2024 Foundation
  {
    paperId: 'EDEXCEL_SPANISH_FOUNDATION_2024_P1',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'EDEXCEL_SPANISH_FOUNDATION_2024_P3',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '5': 36, '4': 30, '3': 24, '2': 18, '1': 12 }
  },
  {
    paperId: 'EDEXCEL_SPANISH_FOUNDATION_2024_P4',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2016/Specification%20and%20sample%20assessments/gcse91-spanish-sams.pdf',
    boundaries: { '5': 38, '4': 32, '3': 26, '2': 20, '1': 14 }
  },

  // --- MODERN HEBREW (AQA - ALL PAPERS) ---
  // --- HIGHER TIER ---
  // 2024 Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2024_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2024,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678LH-QP-JUN24_PDF/b46b0cbdb3ac09568d31990c15c3cb332d1dbb9e.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678LH-MS-JUN24_PDF/4db8696c7845c1b41ebd3bdce51a407a41fa31f2.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2024_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2024,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678RH-QP-JUN24_PDF/e9f35759a029ecaa82e5b950afb34c20797b043b.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678RH-MS-JUN24_PDF/d9bc6d1b2fe6b15a77c5d086a6ef52c839cf8aa1.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2024_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2024,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678WH-QP-JUN24_PDF/67035f59fdbc3a4f136effa4887e01ab860fb330.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678WH-MS-JUN24_PDF/743b6624cd251cf36648f6c91c42659fafe01cd5.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // 2023 Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2023_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2023,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678LH-QP-JUN23_PDF/d246b19660101eb53e45a266c90605d17b728acf.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678LH-MS-JUN23_PDF/5381198acd7acabd3741e9301f9d63e989237c47.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2023_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2023,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678RH-QP-JUN23_PDF/1a473293f48b16106b3e16841cffb7ef1efc9dcc.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678RH-MS-JUN23_PDF/f1e526e04b10d9de7381018c120e01ac72889233.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2023_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2023,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678WH-QP-JUN23_PDF/2802c7368c27aa5fa5e2d0d794ba38ee2d61b84f.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678WH-MS-JUN23_PDF/938b7a014280bac11d810844a6d1167885253609.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // 2022 Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2022_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2022,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678LH-QP-JUN22_PDF/0c3265f92f78821c4fbcbd509e38bc71746963d5.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678LH-MS-JUN22_PDF/c50f32fd7db10121f9ef5fa240e8ca56ee827382.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2022_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2022,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678RH-QP-JUN22_PDF/e30165bcacf9e148f9bb1021e9f11c506f3bd10b.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678RH-MS-JUN22_PDF/8476629620579636152e937fb019769f718fbd8a.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2022_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2022,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678WH-QP-JUN22_PDF/b52816991246a7e44add5d790c48ab034816b91a.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678WH-MS-JUN22_PDF/a0badc4e922e8a681ada13994de6ac92a216eb4c.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // 2021 Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2021_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2021,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86781H-QP-NOV21_PDF/ff7ae7fc51baf95ffb218109436d87d8225825bb.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86781H-MS-NOV21_PDF/29c3fa1d6b81a563e77ace8aae811620763d53e9.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2021_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2021,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86783H-QP-NOV21_PDF/36cc35f018c20b84f50a4375d55ba2cace537753.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86783H-MS-NOV21_PDF/32ed0d30aeeeed5cceefa93a0881c78db2bd96f1.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2021_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2021,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86784H-QP-NOV21_PDF/0cb5aa72b3d560a06cfd71bc5053bfb6d560cd39.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86784H-MS-NOV21_PDF/400dc88426aed768f704e1f752ec8e31de630ae3.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // 2020 Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2020_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2020,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86781H-QP-NOV20_PDF/15f0ebc0769b36a235a1e3819fa3a2e79a1eadd5.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86781H-W-MS-NOV20_PDF/04312039c573a83f81e1775dde22bc3e8fd559d8.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2020_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2020,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86783H-QP-NOV20_PDF/65fab405cec0ed6b0ad9ea219d80b8e5f4e78ea8.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86783H-W-MS-NOV20_PDF/d3a1cba2181a781c687447c3aa6a47f21897aa07.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2020_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2020,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86784H-QP-NOV20_PDF/812d9423bb66419e06829e549734186a0e735f7f.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86784H-W-MS-NOV20_PDF/e6757383cd5a05c729e17ded3c4760fb0b181f83.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // Sample Set Higher
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2018_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2018,
    paperNumber: 1,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86781H-SQP-CR_PDF/dc5290e0fc2bdc882007ec64c9851fa8bea93e57.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86781H-SMS_PDF/72fcc52a92581b130cb0d592fec5130c06cd99c1.pdf',
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 22, '4': 18, '3': 14 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2018_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2018,
    paperNumber: 3,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86783H-SQP-CR_PDF/d4b2b638068b075cf567029bf97cf96d7f9205ea.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86783H-SMS_PDF/d75a62cfbe24719706cae418a76ed109f2ba1610.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_HIGHER_2018_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2018,
    paperNumber: 4,
    totalMarks: 60,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86784H-SQP_PDF/db29854e1d3e38b45a159c3d6f13fd247356061a.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86784-SMS_PDF/fe69e50d62c914f12e50c1255e0868ffc2ea7371.pdf',
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },

  // --- FOUNDATION TIER ---
  // 2024 Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2024_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678LF-QP-JUN24_PDF/8eaf654bacd099f73155e2dfb11c9a4de29110b4.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678LF-MS-JUN24_PDF/05736a53b782fe737f35ada5bbf8ff30b5469c98.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2024_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678RF-QP-JUN24_PDF/9e2bca06bcce3f6fb9a187654e02e338faf4901d.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678RF-MS-JUN24_PDF/c7e70025ceb98c382d5ec54600415a3988c9557b.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2024_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2024,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678WF-QP-JUN24_PDF/264404417dbf50e4f8f8fad2441341a22f7b0b57.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2024.June.AQA-8678WF-MS-JUN24_PDF/ca33f228c0010c46b0a3b69a478d29adffc9acc7.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },

  // 2023 Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2023_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2023,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678LH-QP-JUN23_PDF/d246b19660101eb53e45a266c90605d17b728acf.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678LF-MS-JUN23_PDF/223b7ebbc74f023d7eead6a5f7f3e02f27bb92a7.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2023_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2023,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678RF-QP-JUN23_PDF/d099246a0ef2ab8e8dcee7f3a13ab70a17cce673.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678RF-MS-JUN23_PDF/3e91b2383d4fbcc745fbe30ed649637e03340510.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2023_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2023,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678WF-QP-JUN23_PDF/a5c896b45560bcc813809dcdf4450cb6d0505e87.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2023.june.AQA-8678WF-MS-JUN23_PDF/1ea787d547d467705c69350dc0a5297d4758fffc.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },

  // 2022 Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2022_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2022,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678LF-QP-JUN22_PDF/8c388fd09ccae90f767a69684f7021b1a3fe7499.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678LF-MS-JUN22_PDF/bcdc3dd221d41904ccde3130a8a7e9f3182cda98.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2022_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2022,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678RF-QP-JUN22_PDF/111d76e45f14cb12eddc7a80f5d1084e2093e163.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678RF-MS-JUN22_PDF/6508165326815e273f38014b2b60dd5323ad8461.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2022_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2022,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678WF-QP-JUN22_PDF/c0d302b17a56771c287800b35cad71e040d3fef0.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2022.june.AQA-8678WF-MS-JUN22_PDF/8631b5fe3e72ce9047ccf03d56ae402a17e0c829.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },

  // 2021 Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2021_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2021,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86781F-QP-NOV21-BK_PDF/5531235572bb6813fff2baa770c539f489d6560c.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86781F-MS-NOV21-BK_PDF/ca1b915cd0d0225300c0e04f2ac64f4c17abf7d5.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2021_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2021,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86783F-QP-NOV21-BK_PDF/a2ea38f244134aae29f40c4509a4652ded7e09fb.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86783F-MS-NOV21-BK_PDF/586836eda07f67e0fb0e22c581daf77066f56334.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2021_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2021,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86784F-QP-NOV21-BK_PDF/854a47b44c5c6d6d483319c8048b399f1e761e15.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2021.november.AQA-86784F-MS-NOV21-BK_PDF/4587e6e45a518b48776c86dae989ce41fd717674.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },

  // 2020 Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2020_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2020,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86781F-QP-NOV20-BK_PDF/a5e8b00020ea88b9cacebd1a60b04fe5b43483ab.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86781F-MS-NOV20-BK_PDF/49366eec0bc4a692bf8e6745a9072f0db4787a3d.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2020_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2020,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86783F-QP-NOV20-BK_PDF/50a199ff07e31ba5886a33bc08974401ed8bc6ee.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86783F-MS-NOV20-BK_PDF/f814a70c6a254c3d7249e67becdb65f17392874f.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2020_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2020,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86784F-QP-NOV20-BK_PDF/1b8ec4d01b12cb38241330ad2170fca5615c94f2.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86784F-MS-NOV20-BK_PDF/8155b90eafaa7bb43ec2e7357d1af1b9f8c02bba.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },

  // Sample Set Foundation
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2018_P1',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2018,
    paperNumber: 1,
    totalMarks: 40,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86781F-SQP-CR_PDF/4639970f1e87fae50ed75856f3356107ea016e47.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86781F-SMS_PDF/33c302ba5741e9d8bcd597c4e104c9099cb1e7ac.pdf',
    boundaries: { '5': 32, '4': 27, '3': 21, '2': 15, '1': 9 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2018_P3',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2018,
    paperNumber: 3,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86783F-SQP-CR_PDF/b19ab066a226acff8dbfc60835a39f9bad872705.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86783F-SMS_PDF/a336870eebe993b2a0ed9621ad8e55700c5ab7c7.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    paperId: 'AQA_MODERN_HEBREW_FOUNDATION_2018_P4',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2018,
    paperNumber: 4,
    totalMarks: 50,
    paperUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86784F-SQP-CR_PDF/a8a0486bcf3090b9d85c6cc27fa9efd40cf1cb04.pdf',
    markSchemeUrl: 'https://www.aqa.org.uk/files/resources.modern-hebrew.AQA-86784-SMS_PDF/fe69e50d62c914f12e50c1255e0868ffc2ea7371.pdf',
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  }
];

export const INITIAL_GRADE_BOUNDARIES: GradeBoundaries[] = [
  {
    boundaryId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2022',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2022,
    boundaries: { '9': 48, '8': 42, '7': 36, '6': 30, '5': 24, '4': 18 }
  },
  {
    boundaryId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2024',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2024,
    boundaries: { '9': 47, '8': 42, '7': 37, '6': 31, '5': 26, '4': 21 }
  },
  {
    boundaryId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2023',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2023,
    boundaries: { '9': 49, '8': 44, '7': 39, '6': 34, '5': 28, '4': 23 }
  },
  {
    boundaryId: 'EDEXCEL_BIBLICAL_HEBREW_HIGHER_2020',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    tier: 'Higher',
    year: 2020,
    boundaries: { '9': 48, '8': 42, '7': 37, '6': 32, '5': 26, '4': 21 }
  },

  // AQA Modern Hebrew Fallbacks
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2024',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2024,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2023',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2023,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2022',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2022,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2021',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2021,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2020',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2020,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_HIGHER_2018',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Higher',
    year: 2018,
    boundaries: { '9': 50, '8': 44, '7': 38, '6': 32, '5': 27, '4': 22, '3': 17 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2024',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2024,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2023',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2023,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2022',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2022,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2021',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2021,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2020',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2020,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  },
  {
    boundaryId: 'AQA_MODERN_HEBREW_FOUNDATION_2018',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    tier: 'Foundation',
    year: 2018,
    boundaries: { '5': 41, '4': 35, '3': 28, '2': 20, '1': 12 }
  }
];
