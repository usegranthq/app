export function number(value: unknown, defaultValue: number): number {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
