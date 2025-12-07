import { Period } from "@prisma/client";

export const periodOrder = {
  [Period.MORNING]: 1,
  [Period.AFTERNOON]: 2,
  [Period.EVENING]: 3,
};

export const periodTranslations = {
  [Period.MORNING]: "Matutino",
  [Period.AFTERNOON]: "Vespertino",
  [Period.EVENING]: "Noturno",
};

export function sortPeriods(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => periodOrder[a] - periodOrder[b]);
}

export function getTranslatedPeriods(periods: Period[]): string {
  const sortedPeriods = sortPeriods(periods);
  return sortedPeriods.map((period) => periodTranslations[period]).join(", ");
}

export function getOrderedPeriods(
  periods: Period[]
): { value: Period; label: string }[] {
  const sortedPeriods = sortPeriods(periods);
  return sortedPeriods.map((period) => ({
    value: period,
    label: periodTranslations[period],
  }));
}
