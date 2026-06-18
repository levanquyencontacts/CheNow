export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export function formatChartLabel(date: Date) {
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return `${weekdays[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
}

export function formatMonthLabel(month: number) {
  return `T${month + 1}`;
}

export function getChangePercent(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getDateWindow(range: string, date?: string) {
  const anchor = date ? startOfDay(new Date(date)) : startOfDay(new Date());
  const todayStart = startOfDay(new Date());
  const tomorrowStart = addDays(todayStart, 1);

  if (range === 'today') {
    return {
      days: 1,
      endDate: tomorrowStart,
      startDate: todayStart,
    };
  }

  if (range === 'week') {
    const startDate = startOfWeek(anchor);
    const endDate = addDays(startDate, 7);
    // clamp endDate to tomorrow so future days don't appear
    return {
      days: 7,
      endDate: endDate > tomorrowStart ? tomorrowStart : endDate,
      startDate,
    };
  }

  if (range === 'month') {
    const startDate = startOfMonth(anchor);
    const endOfMonth = addMonths(startDate, 1);
    // clamp endDate to tomorrow
    const endDate = endOfMonth > tomorrowStart ? tomorrowStart : endOfMonth;
    return {
      days: getDaysBetween(startDate, endOfMonth),
      endDate,
      startDate,
    };
  }

  if (range === 'year') {
    const startDate = startOfYear(anchor);
    const endOfYear = new Date(startDate.getFullYear() + 1, 0, 1);
    return {
      days: getDaysBetween(startDate, endOfYear),
      endDate: endOfYear > tomorrowStart ? tomorrowStart : endOfYear,
      startDate,
    };
  }

  const days = Number(range.replace('d', '')) || 7;
  const safeDays = Math.min(Math.max(days, 1), 31);

  return {
    days: safeDays,
    endDate: tomorrowStart,
    startDate: addDays(todayStart, -(safeDays - 1)),
  };
}

export function parseLimit(value: string | undefined, fallback: number) {
  const limit = Number(value);

  if (!Number.isFinite(limit)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), 20);
}

export function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getDaysBetween(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.max(
    Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerDay),
    1,
  );
}

function startOfWeek(date: Date) {
  const nextDate = startOfDay(date);
  const day = nextDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  return addDays(nextDate, mondayOffset);
}
