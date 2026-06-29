export function calculateSRS(choice: 'instant' | 'quick' | 'partial' | 'forgot', now = Date.now()) {
  const INTERVALS = {
    instant: 14,
    quick: 11,
    partial: 5,
    forgot: 1 / 1440
  };

  const intervalDays = INTERVALS[choice];

  return {
    intervalDays,
    nextReview: now + intervalDays * 86400000,
    mastery:
      choice === 'forgot'
        ? 'new'
        : choice === 'partial'
        ? 'learning'
        : ('mastered' as 'new' | 'learning' | 'mastered'),
    lastStudied: now
  };
}
