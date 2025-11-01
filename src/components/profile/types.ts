export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string; // url
  description?: string;
  progress?: number; // 0-100 (for current reads)
  daysReading?: number; // for completed reads badge
  tokensReceived?: number; // for completed reads badge
  completed?: boolean;
};
