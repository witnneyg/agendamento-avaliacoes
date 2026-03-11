import { getSemestersByCourseForTeacher } from "@/app/_actions/semesters/get-semesters-by-course-for-teacher";
import { fireEvent, render, screen } from "@testing-library/react";
import { SemesterSelector } from "../semester-selector";

jest.mock(
  "../../_actions/semesters/get-semesters-by-course-for-teacher",
  () => ({
    getSemestersByCourseForTeacher: jest.fn(),
  }),
);

describe("SemesterSelector", () => {
  it("should hide loading after data is loaded", async () => {
    (getSemestersByCourseForTeacher as jest.Mock).mockResolvedValue([]);

    render(
      <SemesterSelector
        courseId="course-1"
        teacherId="teacher-1"
        onBack={jest.fn()}
        onSelectSemester={jest.fn()}
      />,
    );

    expect(screen.getByText("Carregando períodos...")).toBeInTheDocument();

    await screen.findByRole("button", { name: /voltar para cursos/i });

    expect(screen.queryByText(/carregando períodos/i)).not.toBeInTheDocument();
  });

  it("should go back when onback was clicked", async () => {
    (getSemestersByCourseForTeacher as jest.Mock).mockResolvedValue([]);

    const onBack = jest.fn();

    render(
      <SemesterSelector
        courseId="course-1"
        teacherId="teacher-1"
        onBack={onBack}
        onSelectSemester={jest.fn()}
      />,
    );

    await screen.findByRole("button", { name: /voltar para cursos/i });

    const backButton = screen.getByRole("button", {
      name: /voltar para cursos/i,
    });

    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("should render semesters and select one", async () => {
    const mockSemester = {
      id: "1",
      name: "2024/1",
      description: "Primeiro semestre",
    };

    (getSemestersByCourseForTeacher as jest.Mock).mockResolvedValue([
      mockSemester,
    ]);

    const onSelectSemester = jest.fn();

    render(
      <SemesterSelector
        courseId="course-1"
        teacherId="teacher-1"
        onBack={jest.fn()}
        onSelectSemester={onSelectSemester}
      />,
    );

    const semesterTitle = await screen.findByText("2024/1");

    fireEvent.click(semesterTitle);

    expect(onSelectSemester).toHaveBeenCalledWith(mockSemester);
  });

  it("should stop loading if API fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    (getSemestersByCourseForTeacher as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    render(
      <SemesterSelector
        courseId="course-1"
        teacherId="teacher-1"
        onBack={jest.fn()}
        onSelectSemester={jest.fn()}
      />,
    );

    await screen.findByRole("button", { name: /voltar para cursos/i });

    expect(screen.queryByText(/carregando períodos/i)).not.toBeInTheDocument();
  });

  it("should render empty state when no semesters", async () => {
    (getSemestersByCourseForTeacher as jest.Mock).mockResolvedValue([]);

    render(
      <SemesterSelector
        courseId="course-1"
        teacherId="teacher-1"
        onBack={jest.fn()}
        onSelectSemester={jest.fn()}
      />,
    );

    await screen.findByRole("button", { name: /voltar para cursos/i });

    expect(screen.queryByText("2024/1")).not.toBeInTheDocument();
  });
});
