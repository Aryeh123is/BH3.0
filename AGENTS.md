# Project Rules and Instructions

- **Versioning:** Each update to the app must increase the version number by `n.n.n+1` (patch version increment, e.g., 1.5.0 -> 1.5.1) unless stated otherwise. This version number is tracked in `src/App.tsx` as `CURRENT_VERSION`. Always update the changelog (`LATEST_CHANGES`) when bumping the version.
- **AI Operational Boundary:** AI (Gemini) is STRICTLY FORBIDDEN from generating or creating new exam content (questions, prompts, reading passages, listening scripts). AI is used EXCLUSIVELY as an EVALUATOR for marking, feedback, and grade estimation (AI as Evaluator Only).
- **Content Source of Truth:** All exam material must be sourced from static JSON datasets in `src/data/`. Content must meet official GCSE (Edexcel/AQA) standards for authenticity and structure.
