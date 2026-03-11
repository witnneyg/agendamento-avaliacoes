jest.mock("../../_actions/user/getUser", () => ({
  getUser: jest.fn().mockResolvedValue({
    id: "user-1",
    email: "test@test.com",
  }),
}));

jest.mock("../../_actions/teacher/get-teacher-by-user-id", () => ({
  getTeacherByUserId: jest.fn().mockResolvedValue({
    id: "teacher-1",
  }),
}));

jest.mock("../../_actions/scheduling/create-schedule", () => ({
  createScheduling: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../course-selector", () => ({
  CourseSelector: ({ onSelectCourse }: any) => (
    <button onClick={() => onSelectCourse({ id: "1", name: "GTI" })}>
      Select Course
    </button>
  ),
}));

jest.mock("../semester-selector", () => ({
  SemesterSelector: ({ onSelectSemester }: any) => (
    <button
      onClick={() =>
        onSelectSemester({
          id: "semester-1",
          name: "Período 1",
          description: "Desc",
        })
      }
    >
      Select Period
    </button>
  ),
}));

jest.mock("../classes-selector", () => ({
  ClassSelector: ({ onSelectClass }: any) => (
    <button
      onClick={() =>
        onSelectClass({
          id: "class-1",
          semesterId: "semester-1",
          teacherId: "teacher-1",
        })
      }
    >
      Select Class
    </button>
  ),
}));

jest.mock("../../../utils/getTimeRange", () => ({
  GetTimeRange: jest.fn().mockReturnValue({
    earliestStartTime: new Date(),
    latestEndTime: new Date(),
    slots: ["10:00 - 11:00"],
  }),
}));

jest.mock("../discipline-selector", () => ({
  DisciplineSelector: ({ onSelectDiscipline }: any) => (
    <button
      onClick={() =>
        onSelectDiscipline({
          id: "discipline-1",
          classId: "class-1",
          semesterId: "semester-1",
          teacherId: "teacher-1",
        })
      }
    >
      Select Discipline
    </button>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("../booking-form", () => ({
  BookingForm: ({ onSubmit }: any) => (
    <button
      onClick={() =>
        onSubmit({
          name: "Professor Teste",
          teacherId: "teacher-1",
          time: "07:30 - 08:20",
          date: new Date("2025-01-01"),
        })
      }
    >
      Confirmed Scheduling
    </button>
  ),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { Scheduling } from "../scheduling";

describe("Scheduling", () => {
  it("should navigate through all steps and display booking confirmation", async () => {
    render(<Scheduling />);

    const courseButton = await screen.findByText("Select Course");

    expect(courseButton).toBeInTheDocument();

    fireEvent.click(courseButton);
    expect(
      await screen.findByText("Selecione seu período"),
    ).toBeInTheDocument();

    const semesterButton = await screen.findByText("Select Period");
    fireEvent.click(semesterButton);
    expect(await screen.findByText("Selecione sua turma")).toBeInTheDocument();

    const classButton = await screen.findByText("Select Class");
    fireEvent.click(classButton);
    expect(
      await screen.findByText("Selecione uma disciplina"),
    ).toBeInTheDocument();

    const disciplineButton = await screen.findByText("Select Discipline");
    fireEvent.click(disciplineButton);
    expect(
      await screen.findByText("Selecione data e horário"),
    ).toBeInTheDocument();

    const bookingFormButton = await screen.findByText("Confirmed Scheduling");
    fireEvent.click(bookingFormButton);
    expect(
      await screen.findByText("Agendamento confirmado"),
    ).toBeInTheDocument();
  });
});
