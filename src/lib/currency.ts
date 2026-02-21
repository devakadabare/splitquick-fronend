export const currencySymbol: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', LKR: 'Rs', INR: '₹',
  AUD: 'A$', CAD: 'C$', JPY: '¥', CNY: '¥', CHF: 'Fr',
  SGD: 'S$', AED: 'د.إ', MYR: 'RM', THB: '฿', KRW: '₩',
  BRL: 'R$', ZAR: 'R', SEK: 'kr', NZD: 'NZ$', PKR: '₨',
};

export function formatCurrency(amount: number, currency: string): string {
  const sym = currencySymbol[currency] || currency + ' ';
  return `${sym}${Math.abs(amount).toFixed(2)}`;
}
