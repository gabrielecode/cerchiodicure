export const formatDateToLocale = (date: Date): string => {
  return date.toLocaleDateString('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('.').reverse().join('-');
};

export const formatTimestampKey = (date: Date, timeSlot: string): string => {
  const dateStr = formatDateToLocale(date);
  return `${dateStr}_${timeSlot}`;
};
