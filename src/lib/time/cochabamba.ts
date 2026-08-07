const COCHABAMBA_TIMEZONE = 'America/La_Paz';

export interface CochabambaNow {
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  minutesSinceMidnight: number;
}

function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((part) => part.type === type)?.value ?? '00';
}

/** Descompone un instante en fecha/hora locales de Cochabamba (America/La_Paz). */
export function getCochabambaNow(reference: Date = new Date()): CochabambaNow {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: COCHABAMBA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(reference);
  const year = getPart(parts, 'year');
  const month = getPart(parts, 'month');
  const day = getPart(parts, 'day');
  let hour = getPart(parts, 'hour');
  const minute = getPart(parts, 'minute');
  if (hour === '24') hour = '00';

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hour}:${minute}`;
  const minutesSinceMidnight = Number(hour) * 60 + Number(minute);

  return { dateStr, timeStr, minutesSinceMidnight };
}

export function timeStrToMinutes(timeStr: string): number {
  const [hourStr, minuteStr] = timeStr.split(':');
  return Number(hourStr) * 60 + Number(minuteStr);
}

export function minutesToTimeStr(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Indica si el instante dado cae dentro del horario de apertura (17:00–22:00 hora Cochabamba). */
export function isWithinBusinessHours(
  reference: Date,
  openTime: string,
  closeTime: string,
): boolean {
  const now = getCochabambaNow(reference);
  const openMinutes = timeStrToMinutes(openTime);
  const closeMinutes = timeStrToMinutes(closeTime);
  return now.minutesSinceMidnight >= openMinutes && now.minutesSinceMidnight < closeMinutes;
}

export { COCHABAMBA_TIMEZONE };
