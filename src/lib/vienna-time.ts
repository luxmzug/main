export const POSTS_PER_DAY = 7;

export const SLOT_TIMES = [
  { hour: 9, minute: 0 },
  { hour: 11, minute: 30 },
  { hour: 14, minute: 0 },
  { hour: 16, minute: 30 },
  { hour: 18, minute: 30 },
  { hour: 20, minute: 30 },
  { hour: 22, minute: 30 },
] as const;

const VIENNA_TZ = 'Europe/Vienna';

/**
 * Returns YYYY-MM-DD for the given instant in Vienna.
 */
export const viennaYmd = (date: Date) => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: VIENNA_TZ }).format(date);
};

/**
 * Reads Vienna local parts from a UTC timestamp.
 */
const viennaParts = (utcMs: number) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIENNA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(utcMs));

  let hour = Number(parts.find((part) => part.type === 'hour')?.value);
  if (hour === 24) {
    hour = 0;
  }

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
    hour,
    minute: Number(parts.find((part) => part.type === 'minute')?.value),
  };
};

/**
 * Converts a Vienna local date/time to a UTC ISO string.
 */
export const viennaLocalToUtcIso = (ymd: string, hour: number, minute: number) => {
  const dateOnly = ymd.trim().slice(0, 10);
  const segments = dateOnly.split('-').map(Number);
  const year = segments[0] ?? 2026;
  const month = segments[1] ?? 1;
  const day = segments[2] ?? 1;
  const center = Date.UTC(year, month - 1, day, 12, 0, 0);

  for (let offset = -840; offset <= 840; offset += 1) {
    const utc = center + offset * 60_000;
    const local = viennaParts(utc);

    if (
      local.year === year &&
      local.month === month &&
      local.day === day &&
      local.hour === hour &&
      local.minute === minute
    ) {
      return new Date(utc).toISOString();
    }
  }

  return new Date(Date.UTC(year, month - 1, day, Math.max(0, hour - 2), minute, 0)).toISOString();
};

/**
 * Adds calendar days to a Vienna YYYY-MM-DD string.
 */
export const addViennaDays = (ymd: string, days: number) => {
  const parts = ymd.split('-').map(Number);
  const year = parts[0] ?? 2026;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const utc = Date.UTC(year, month - 1, day + days, 12);
  return viennaYmd(new Date(utc));
};

/**
 * Normalizes legacy date-only values to full UTC ISO timestamps.
 */
export const normalizePublishedAt = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return viennaLocalToUtcIso(value, 9, 0);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
};

/**
 * Builds the UTC ISO publish time for a queue slot index on a Vienna calendar day.
 */
export const slotIsoOnDay = (ymd: string, slotIndex: number) => {
  const slot = SLOT_TIMES[slotIndex];
  if (!slot) {
    throw new Error(`Ungültiger Slot-Index: ${slotIndex}`);
  }
  return viennaLocalToUtcIso(ymd, slot.hour, slot.minute);
};

/**
 * Formats a publish timestamp for admin display in Vienna local time.
 */
export const formatPublishAtVienna = (iso: string) => {
  const normalized = normalizePublishedAt(iso);
  return new Intl.DateTimeFormat('de-AT', {
    timeZone: VIENNA_TZ,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(normalized));
};

/**
 * Returns a German relative countdown until publish time.
 */
export const formatPublishCountdown = (iso: string) => {
  const target = new Date(normalizePublishedAt(iso)).getTime();
  const diffMs = target - Date.now();

  if (diffMs <= 0) {
    return 'Jetzt fällig';
  }

  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 60) {
    return `in ${minutes} Min.`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `in ${hours} Std.`;
  }

  const days = Math.round(hours / 24);
  const viennaTime = new Intl.DateTimeFormat('de-AT', {
    timeZone: VIENNA_TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(target));

  if (days === 1) {
    return `morgen um ${viennaTime} Uhr`;
  }

  return `in ${days} Tagen (${formatPublishAtVienna(iso)})`;
};

/**
 * Returns the slot index (0–6) for a Vienna publish timestamp.
 */
export const slotIndexFromIso = (iso: string) => {
  const normalized = normalizePublishedAt(iso);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIENNA_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(normalized));

  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);
  const index = SLOT_TIMES.findIndex((slot) => slot.hour === hour && slot.minute === minute);
  return index >= 0 ? index : 0;
};

/**
 * Finds the first future slot starting from the given instant.
 */
export const firstAvailableSlotFrom = (from: Date) => {
  const now = from.getTime();

  for (let dayOffset = 0; dayOffset < 366; dayOffset += 1) {
    const currentDay = addViennaDays(viennaYmd(from), dayOffset);
    for (let slotIndex = 0; slotIndex < POSTS_PER_DAY; slotIndex += 1) {
      const candidate = slotIsoOnDay(currentDay, slotIndex);
      if (new Date(candidate).getTime() > now) {
        return {
          publishedAt: candidate,
          queuePosition: slotIndex,
        };
      }
    }
  }

  throw new Error('Kein freier Veröffentlichungsslot gefunden.');
};

/**
 * Converts ISO timestamp to datetime-local input value in Vienna.
 */
export const toDateTimeLocalVienna = (iso: string) => {
  const normalized = normalizePublishedAt(iso);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIENNA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(normalized));

  const year = parts.find((part) => part.type === 'year')?.value ?? '2026';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '09';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00';

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

/**
 * Parses datetime-local (Vienna) into UTC ISO.
 */
export const fromDateTimeLocalVienna = (value: string) => {
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) {
    throw new Error('Ungültiges Datum.');
  }
  const timeParts = timePart.split(':').map(Number);
  const hour = typeof timeParts[0] === 'number' && !Number.isNaN(timeParts[0]) ? timeParts[0] : 9;
  const minute = typeof timeParts[1] === 'number' && !Number.isNaN(timeParts[1]) ? timeParts[1] : 0;
  return viennaLocalToUtcIso(datePart, hour, minute);
};
