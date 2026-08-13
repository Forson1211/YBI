export function calculateProgress(currentValue: number, targetValue: number | null) {
  if (!targetValue || targetValue <= 0) return null;
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

export function toLocalDateTimeInput(value: Date | string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function formatSessionDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
