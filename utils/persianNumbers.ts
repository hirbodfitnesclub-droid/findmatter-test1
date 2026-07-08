export function toPersianDigits(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  return str.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
}

export function toPersianPrice(value: number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return value.toLocaleString('fa-IR');
}
