import { render, screen, fireEvent } from "@testing-library/react";
import { getUser } from "../../_actions/user/getUser";
import { useRouter } from "next/navigation";
import { formatSemesterNumber } from "../../_helpers/formatSemesterNumber";
import { BookingConfirmation } from "../booking-confirmation";
import { Period, Status } from "@prisma/client";

jest.mock("../../_actions/user/getUser", () => ({
  getUser: jest.fn(),
}));

jest.mock("../../_helpers/formatSemesterNumber", () => ({
  formatSemesterNumber: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BookingConfirmation", () => {
  const push = jest.fn();

  const props = {
    course: {
      id: "course-1",
      name: "GTI",
      description: "Curso de Gestão de TI",
      periods: [],
      semesterDuration: 6,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    classes: {
      id: "class-1",
      name: "Turma A",
      courseId: "course-1",
      semesterId: "semester-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    semester: {
      id: "semester-1",
      name: "1",
      description: "Primeiro período",
      courseId: "course-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    discipline: {
      id: "disc-1",
      name: "Matemática",
      semesterId: "semester-1",
      dayPeriods: [],
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    date: new Date("2025-01-01"),
    details: {
      name: "Professor Teste",
      time: "07:30 - 08:20",
    },
    onScheduleAnother: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (getUser as jest.Mock).mockResolvedValue({
      email: "test@test.com",
    });

    (formatSemesterNumber as jest.Mock).mockReturnValue("1º");

    (useRouter as jest.Mock).mockReturnValue({
      push,
    });
  });

  it("should render booking information", async () => {
    render(<BookingConfirmation {...props} />);

    expect(
      await screen.findByText(/seu agendamento está confirmado/i),
    ).toBeInTheDocument();

    expect(screen.getByText("GTI")).toBeInTheDocument();
    expect(screen.getByText("Turma A")).toBeInTheDocument();
    expect(screen.getByText("1º")).toBeInTheDocument();
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("07:30 - 08:20")).toBeInTheDocument();
    expect(screen.getByText("Professor Teste")).toBeInTheDocument();
  });

  it("should display user email after fetch", async () => {
    render(<BookingConfirmation {...props} />);

    expect(await screen.findByText(/test@test.com/i)).toBeInTheDocument();
  });

  it("should call onScheduleAnother when clicking schedule another", async () => {
    render(<BookingConfirmation {...props} />);

    const button = await screen.findByText(/agendar outro/i);

    fireEvent.click(button);

    expect(props.onScheduleAnother).toHaveBeenCalledTimes(1);
  });

  it("should navigate to calendar when clicking view calendar", async () => {
    render(<BookingConfirmation {...props} />);

    const button = await screen.findByText(/ver meu calendário/i);

    fireEvent.click(button);

    expect(push).toHaveBeenCalledWith("calendar");
  });

  it("should call getUser on mount", async () => {
    render(<BookingConfirmation {...props} />);

    await screen.findByText(/test@test.com/i);

    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
