export function toPersianDigits(num: string | number | undefined | null): string {
  if (num === undefined || num === null) return '';
  return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
}
