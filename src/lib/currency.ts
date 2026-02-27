export const currencySymbol: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', LKR: 'Rs', INR: '₹',
  AUD: 'A$', CAD: 'C$', JPY: '¥', CNY: '¥', CHF: 'Fr',
  SGD: 'S$', AED: 'د.إ', MYR: 'RM', THB: '฿', KRW: '₩',
  BRL: 'R$', ZAR: 'R', SEK: 'kr', NZD: 'NZ$', PKR: '₨',
};

export const countryToCurrency: Record<string, string> = {
  // USD
  US: 'USD',
  // EUR (Eurozone)
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
  GR: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR',
  LT: 'EUR', CY: 'EUR', MT: 'EUR', LU: 'EUR',
  // Others
  GB: 'GBP',
  LK: 'LKR',
  IN: 'INR',
  AU: 'AUD',
  CA: 'CAD',
  JP: 'JPY',
  CN: 'CNY',
  CH: 'CHF', LI: 'CHF',
  SG: 'SGD',
  AE: 'AED',
  MY: 'MYR',
  TH: 'THB',
  KR: 'KRW',
  BR: 'BRL',
  ZA: 'ZAR',
  SE: 'SEK',
  NZ: 'NZD',
  PK: 'PKR',
};

const timezoneToCurrency: Record<string, string> = {
  'Asia/Colombo': 'LKR',
  'Asia/Kolkata': 'INR', 'Asia/Calcutta': 'INR',
  'Europe/London': 'GBP',
  'America/New_York': 'USD', 'America/Chicago': 'USD', 'America/Denver': 'USD',
  'America/Los_Angeles': 'USD', 'America/Anchorage': 'USD', 'Pacific/Honolulu': 'USD',
  'Europe/Berlin': 'EUR', 'Europe/Paris': 'EUR', 'Europe/Rome': 'EUR',
  'Europe/Madrid': 'EUR', 'Europe/Amsterdam': 'EUR', 'Europe/Brussels': 'EUR',
  'Europe/Vienna': 'EUR', 'Europe/Lisbon': 'EUR', 'Europe/Dublin': 'EUR',
  'Europe/Helsinki': 'EUR', 'Europe/Athens': 'EUR', 'Europe/Luxembourg': 'EUR',
  'Australia/Sydney': 'AUD', 'Australia/Melbourne': 'AUD', 'Australia/Brisbane': 'AUD',
  'Australia/Perth': 'AUD', 'Australia/Adelaide': 'AUD',
  'America/Toronto': 'CAD', 'America/Vancouver': 'CAD',
  'Asia/Tokyo': 'JPY',
  'Asia/Shanghai': 'CNY', 'Asia/Hong_Kong': 'CNY',
  'Europe/Zurich': 'CHF',
  'Asia/Singapore': 'SGD',
  'Asia/Dubai': 'AED',
  'Asia/Kuala_Lumpur': 'MYR',
  'Asia/Bangkok': 'THB',
  'Asia/Seoul': 'KRW',
  'America/Sao_Paulo': 'BRL',
  'Africa/Johannesburg': 'ZAR',
  'Europe/Stockholm': 'SEK',
  'Pacific/Auckland': 'NZD',
  'Asia/Karachi': 'PKR',
};

export function getDefaultCurrency(): string {
  try {
    // Primary: timezone-based detection (most reliable, not affected by language settings)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && timezoneToCurrency[tz]) {
      return timezoneToCurrency[tz];
    }

    // Secondary: extract country code from browser locale (e.g., "en-LK" -> "LK")
    const locale = navigator.language || navigator.languages?.[0] || '';
    const parts = locale.split('-');
    if (parts.length >= 2) {
      const countryCode = parts[parts.length - 1].toUpperCase();
      const mapped = countryToCurrency[countryCode];
      if (mapped && currencySymbol[mapped]) {
        return mapped;
      }
    }
  } catch {
    // Fallback for environments where navigator is unavailable
  }
  return 'USD';
}

export function formatCurrency(amount: number, currency: string): string {
  const sym = currencySymbol[currency] || currency + ' ';
  return `${sym}${Math.abs(amount).toFixed(2)}`;
}
