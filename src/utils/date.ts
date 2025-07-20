import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy');
};

export const daysToSeconds = (days: number) => {
  return days * 24 * 60 * 60;
};
