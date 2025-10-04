import { Period } from "@prisma/client";

export const periodOrder = {
  [Period.MORNING]: 1,
  [Period.AFTERNOON]: 2,
  [Period.EVENING]: 3,
};

export const periodTranslations = {
  [Period.MORNING]: "Manhã",
  [Period.AFTERNOON]: "Tarde",
  [Period.EVENING]: "Noite",
};

/**
 * Ordena períodos em ordem crescente: Manhã → Tarde → Noite
 */
export function sortPeriods(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => periodOrder[a] - periodOrder[b]);
}

/**
 * Traduz e ordena períodos para exibição
 */
export function getTranslatedPeriods(periods: Period[]): string {
  const sortedPeriods = sortPeriods(periods);
  return sortedPeriods.map((period) => periodTranslations[period]).join(", ");
}

/**
 * Ordena e retorna períodos com tradução para uso em componentes
 */
export function getOrderedPeriods(
  periods: Period[]
): { value: Period; label: string }[] {
  const sortedPeriods = sortPeriods(periods);
  return sortedPeriods.map((period) => ({
    value: period,
    label: periodTranslations[period],
  }));
}
