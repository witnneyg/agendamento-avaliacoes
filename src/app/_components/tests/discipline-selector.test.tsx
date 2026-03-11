import { fireEvent, render, screen } from "@testing-library/react";
import { DisciplineSelector } from "../discipline-selector";
import { getOrderedPeriods } from "@/app/_helpers/periodUtils";
import { getDisciplinesByClass } from "@/app/_actions/discipline/get-disciplines-by-class";

jest.mock("../../_actions/discipline/get-disciplines-by-class", () => ({
  getDisciplinesByClass: jest.fn(),
}));

jest.mock("../../_helpers/periodUtils", () => ({
  getOrderedPeriods: jest.fn(),
}));

describe("DisciplineSelector", () => {
  it("should show loading initially", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    expect(screen.getByText(/carregando disciplinas/i)).toBeInTheDocument();

    await screen.findByRole("button", {
      name: /voltar para turmas/i,
    });
  });

  it("should hide loading after data is loaded", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "Matemática",
        dayPeriods: [],
      },
    ]);

    (getOrderedPeriods as jest.Mock).mockReturnValue([]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    expect(screen.getByText(/carregando disciplinas/i)).toBeInTheDocument();

    expect(await screen.findByText(/matemática/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/carregando disciplinas/i),
    ).not.toBeInTheDocument();
  });

  it("should call getDisciplinesByClass with correct params", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    await screen.findByRole("button", {
      name: /voltar para turmas/i,
    });

    expect(getDisciplinesByClass).toHaveBeenCalledWith("class-id", undefined);
  });

  it("should call onBack when back button is clicked", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([]);

    const onBack = jest.fn();

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={onBack}
        onSelectDiscipline={jest.fn()}
      />,
    );

    const backButton = await screen.findByRole("button", {
      name: /voltar para turmas/i,
    });

    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("should call onSelectDiscipline when a discipline is selected", async () => {
    const mockDiscipline = {
      id: "1",
      name: "Matemática",
      dayPeriods: [],
    };

    (getDisciplinesByClass as jest.Mock).mockResolvedValue([mockDiscipline]);

    (getOrderedPeriods as jest.Mock).mockReturnValue([]);

    const onSelectDiscipline = jest.fn();

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={onSelectDiscipline}
      />,
    );

    const disciplineCard = await screen.findByText(/matemática/i);

    fireEvent.click(disciplineCard);

    expect(onSelectDiscipline).toHaveBeenCalledTimes(1);
    expect(onSelectDiscipline).toHaveBeenCalledWith(mockDiscipline);
  });

  it("should render empty message when no disciplines exist", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    expect(
      await screen.findByText(/nenhuma disciplina disponível/i),
    ).toBeInTheDocument();
  });

  it("should render teacher message when teacherId exists and no disciplines", async () => {
    (getDisciplinesByClass as jest.Mock).mockResolvedValue([]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        teacherId="teacher-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    expect(
      await screen.findByText(/nenhuma disciplina vinculada a você/i),
    ).toBeInTheDocument();
  });

  it("should render ordered periods", async () => {
    const mockDiscipline = {
      id: "1",
      name: "Matemática",
      dayPeriods: ["MORNING"],
    };

    (getDisciplinesByClass as jest.Mock).mockResolvedValue([mockDiscipline]);

    (getOrderedPeriods as jest.Mock).mockReturnValue([
      { value: "MORNING", label: "Manhã" },
    ]);

    render(
      <DisciplineSelector
        classId="class-id"
        semesterId="semester-id"
        onBack={jest.fn()}
        onSelectDiscipline={jest.fn()}
      />,
    );

    expect(await screen.findByText("Manhã")).toBeInTheDocument();
  });
});
