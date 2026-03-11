import { Period } from "@prisma/client";
import {
  getOrderedPeriods,
  getTranslatedPeriods,
  periodOrder,
  periodTranslations,
  sortPeriods,
} from "../periodUtils";

describe("period utils", () => {
  describe("periodOrder", () => {
    it("should have correct order values", () => {
      expect(periodOrder[Period.MORNING]).toBe(1);
      expect(periodOrder[Period.AFTERNOON]).toBe(2);
      expect(periodOrder[Period.EVENING]).toBe(3);
    });
  });

  describe("periodTranslations", () => {
    it("should translate periods correctly", () => {
      expect(periodTranslations[Period.MORNING]).toBe("Matutino");
      expect(periodTranslations[Period.AFTERNOON]).toBe("Vespertino");
      expect(periodTranslations[Period.EVENING]).toBe("Noturno");
    });
  });

  describe("sortPeriods", () => {
    it("should sort periods correctly", () => {
      const periods = [Period.EVENING, Period.MORNING, Period.AFTERNOON];

      const result = sortPeriods(periods);

      expect(result).toEqual([
        Period.MORNING,
        Period.AFTERNOON,
        Period.EVENING,
      ]);
    });

    it("should not mutate original array", () => {
      const periods = [Period.EVENING, Period.MORNING];
      const copy = [...periods];

      sortPeriods(periods);

      expect(periods).toEqual(copy);
    });
  });

  describe("getTranslatedPeriods", () => {
    it("should return translated periods in correct order", () => {
      const periods = [Period.EVENING, Period.MORNING];

      const result = getTranslatedPeriods(periods);

      expect(result).toBe("Matutino, Noturno");
    });
  });

  describe("getOrderedPeriods", () => {
    it("should return ordered objects with label and value", () => {
      const periods = [Period.EVENING, Period.MORNING];

      const result = getOrderedPeriods(periods);

      expect(result).toEqual([
        {
          value: Period.MORNING,
          label: "Matutino",
        },
        {
          value: Period.EVENING,
          label: "Noturno",
        },
      ]);
    });
  });
});
