export type DailyVerse = {
  id: number;
  reference: string;
  text: string;
  reflection: string;
};

export const DAILY_VERSES: DailyVerse[] = [
  {
    id: 1,
    reference: '1 Thessalonians 5:18',
    text: 'Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',
    reflection: 'Pause, notice one simple gift from today, and thank God for it.',
  },
  {
    id: 2,
    reference: 'Psalm 118:24',
    text: 'This is the day that the Lord has made; let us rejoice and be glad in it.',
    reflection: 'Today is not an accident—receive it as a personal gift from God.',
  },
  {
    id: 3,
    reference: 'James 1:17',
    text: 'Every good gift and every perfect gift is from above, coming down from the Father of lights.',
    reflection: 'Trace one good thing in your life back to the Giver and say “thank You.”',
  },
];

export function getVerseForToday(date = new Date()): DailyVerse {
  const index = date.getDate() % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}


