import type { SellerListItem } from '@/types/api';

export type SellersByState = {
  state: string;
  sellers: SellerListItem[];
};

export type SellersByCountry = {
  country: string;
  states: SellersByState[];
};

/** Agrupa lista plana del API por country → state (pantalla 3 PDF). */
export function groupSellersByCountryAndState(sellers: SellerListItem[]): SellersByCountry[] {
  const countryMap = new Map<string, Map<string, SellerListItem[]>>();

  for (const seller of sellers) {
    const country = seller.country?.trim() || 'Otros';
    const state = seller.state?.trim() || 'General';

    if (!countryMap.has(country)) {
      countryMap.set(country, new Map());
    }
    const stateMap = countryMap.get(country)!;
    if (!stateMap.has(state)) {
      stateMap.set(state, []);
    }
    stateMap.get(state)!.push(seller);
  }

  return Array.from(countryMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([country, stateMap]) => ({
      country,
      states: Array.from(stateMap.entries())
        .sort(([a], [b]) => a.localeCompare(b, 'es'))
        .map(([state, items]) => ({ state, sellers: items })),
    }));
}
