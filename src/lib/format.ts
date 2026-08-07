/** Formatea un monto en bolivianos como "Bs 45" o "Bs 45.50". */
export function formatBs(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const hasCents = !Number.isInteger(rounded);
  return `Bs ${hasCents ? rounded.toFixed(2) : rounded.toString()}`;
}
