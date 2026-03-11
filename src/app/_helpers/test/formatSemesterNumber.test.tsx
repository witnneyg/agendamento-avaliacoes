import { formatSemesterNumber } from "../formatSemesterNumber";

describe("formatSemesterNumber", () => {
  it.each([
    ["1 Semestre", "1° período"],
    ["Primeiro semestre", "1° período"],
    ["Segundo semestre", "2° período"],
    ["Terceiro semestre", "3° período"],
    ["quarto semestre", "4° período"],
    ["5", "5° período"],
  ])("should format %s correctly", (input, expected) => {
    expect(formatSemesterNumber(input)).toBe(expected);
  });

  it("should return original when no match", () => {
    expect(formatSemesterNumber("Semestre livre")).toBe("Semestre livre");
  });
});
