// Simple currency helpers tied to user country
export type CountryCode = 'US' | 'IN' | 'GB' | 'EU' | 'CA' | 'AU' | 'JP' | 'SG' | 'AE' | 'ZA';

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  IN: 'INR',
  GB: 'GBP',
  EU: 'EUR',
  CA: 'CAD',
  AU: 'AUD',
  JP: 'JPY',
  SG: 'SGD',
  AE: 'AED',
  ZA: 'ZAR',
};

const COUNTRY_TO_LOCALE: Record<string, string> = {
  US: 'en-US',
  IN: 'en-IN',
  GB: 'en-GB',
  EU: 'en-IE',
  CA: 'en-CA',
  AU: 'en-AU',
  JP: 'ja-JP',
  SG: 'en-SG',
  AE: 'en-AE',
  ZA: 'en-ZA',
};

export function currencyFromCountry(country?: string): string {
  if (!country) return 'USD';
  const c = country.trim().toUpperCase();
  // Accept both codes and names
  if (COUNTRY_TO_CURRENCY[c]) return COUNTRY_TO_CURRENCY[c];
  // Try a few common names
  const nameToCode: Record<string, string> = {
    INDIA: 'IN',
    UNITEDSTATES: 'US',
    USA: 'US',
    UNITEDKINGDOM: 'GB',
    UK: 'GB',
    EUROPE: 'EU',
    CANADA: 'CA',
    AUSTRALIA: 'AU',
    JAPAN: 'JP',
    SINGAPORE: 'SG',
    UAE: 'AE',
    UNITEDARABEMIRATES: 'AE',
    SOUTHAFRICA: 'ZA',
  };
  const normalized = c.replace(/\s+/g, '');
  const code = nameToCode[normalized];
  return COUNTRY_TO_CURRENCY[code || 'US'] || 'USD';
}

function localeFromCountry(country?: string): string {
  if (!country) return 'en-US';
  const c = country.trim().toUpperCase();
  if (COUNTRY_TO_LOCALE[c]) return COUNTRY_TO_LOCALE[c];
  return 'en-US';
}

export function getUserCurrency(): { currency: string; locale: string } {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : {};
    const country: string | undefined = user?.country || user?.location?.country;
    const currency: string = user?.currency || currencyFromCountry(country);
    const locale: string = user?.locale || localeFromCountry(country);
    return { currency, locale };
  } catch {
    return { currency: 'USD', locale: 'en-US' };
  }
}

export function formatAmount(amount: number): string {
  const { currency, locale } = getUserCurrency();
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(amount) || 0);
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}
