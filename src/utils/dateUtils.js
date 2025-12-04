import { format, parseISO, differenceInDays, addDays } from 'date-fns';

export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'dd MMM yyyy, HH:mm');
};

export const getCurrentDateISO = () => {
  return new Date().toISOString();
};

export const getDateOnly = (date) => {
  return format(date || new Date(), 'yyyy-MM-dd');
};

export const calculateLeaveDays = (startDate, endDate) => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return differenceInDays(end, start) + 1;
  } catch {
    return 0;
  }
};

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};