import { getTeacherCourses } from "@/app/_actions/teacher/get-teacher-courses";
import { CourseSelector } from "../course-selector";
import {
  render,
  screen,
  fireEvent,
  getByText,
  findByText,
} from "@testing-library/react";

jest.mock("../../_actions/teacher/get-teacher-courses", () => ({
  getTeacherCourses: jest.fn(),
}));

describe("CourseSelector", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("should display loading state while fetching courses", async () => {
    (getTeacherCourses as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<CourseSelector teacherId="teacher-1" onSelectCourse={jest.fn()} />);

    expect(screen.getByText("Carregando cursos...")).toBeInTheDocument();
  });

  it("should display empty state when no courses are returned", async () => {
    (getTeacherCourses as jest.Mock).mockResolvedValue([]);

    render(<CourseSelector onSelectCourse={jest.fn()} teacherId="teacher-1" />);

    expect(await screen.findByText("Cursos indisponíveis")).toBeInTheDocument();
  });

  it("should render courses when data is returned", async () => {
    (getTeacherCourses as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "GTI",
      },
    ]);

    render(<CourseSelector onSelectCourse={jest.fn()} teacherId="teacher-1" />);

    expect(await screen.findByText("GTI")).toBeInTheDocument();
    expect(screen.getByText("Selecionar curso")).toBeInTheDocument();
  });

  it("should call onSelectCourse when a course is clicked", async () => {
    const onSelectCourse = jest.fn();

    (getTeacherCourses as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "GTI",
      },
    ]);

    render(
      <CourseSelector onSelectCourse={onSelectCourse} teacherId="teacher-1" />,
    );

    const courseTitle = await screen.findByText("GTI");

    fireEvent.click(courseTitle);

    expect(onSelectCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        name: "GTI",
      }),
    );
  });
});
