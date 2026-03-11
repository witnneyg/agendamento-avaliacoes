import { fireEvent, render, screen } from "@testing-library/react";
import { ClassSelector } from "../classes-selector";
import { getClassBySemesterId } from "@/app/_actions/classes/get-class-by-semester-id";

jest.mock("../../_actions/classes/get-class-by-semester-id", () => ({
  getClassBySemesterId: jest.fn(),
}));

describe("ClassesSelector", () => {
  it("should show loading initially", async () => {
    (getClassBySemesterId as jest.Mock).mockResolvedValue([]);

    render(
      <ClassSelector
        onBack={jest.fn()}
        semesterId="semester-id"
        onSelectClass={jest.fn()}
      />,
    );

    expect(screen.getByText(/carregando turmas/i)).toBeInTheDocument();

    await screen.findByRole("button", {
      name: /voltar para períodos/i,
    });
  });

  it("should hide loading after data is loaded", async () => {
    (getClassBySemesterId as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "semester 1",
      },
    ]);

    render(
      <ClassSelector
        onBack={jest.fn()}
        semesterId="semester-id"
        onSelectClass={jest.fn()}
      />,
    );

    expect(screen.getByText(/carregando turmas/i)).toBeInTheDocument();

    expect(await screen.findByText(/semester 1/i)).toBeInTheDocument();

    expect(screen.queryByText(/carregando turmas/i)).not.toBeInTheDocument();
  });

  it("should when onback was called go back to period", async () => {
    (getClassBySemesterId as jest.Mock).mockResolvedValue([]);

    const onBack = jest.fn();

    render(
      <ClassSelector
        onBack={onBack}
        semesterId="semester-id"
        onSelectClass={jest.fn()}
      />,
    );

    await screen.findByRole("button", {
      name: /voltar para períodos/i,
    });

    const backButton = screen.getByRole("button", {
      name: /voltar para períodos/i,
    });
    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("should call onSelectClass when a class is selected", async () => {
    const mockClass = {
      id: "1",
      name: "semester 1",
    };

    (getClassBySemesterId as jest.Mock).mockResolvedValue([mockClass]);

    const onSelectClass = jest.fn();

    render(
      <ClassSelector
        onBack={jest.fn()}
        semesterId="semester-id"
        onSelectClass={onSelectClass}
      />,
    );

    const classCard = await screen.findByText(/semester 1/i);

    fireEvent.click(classCard);

    expect(onSelectClass).toHaveBeenCalledTimes(1);
    expect(onSelectClass).toHaveBeenCalledWith(mockClass);
  });

  it("should render no classes when API returns empty array", async () => {
    (getClassBySemesterId as jest.Mock).mockResolvedValue([]);

    render(
      <ClassSelector
        onBack={jest.fn()}
        semesterId="semester-id"
        onSelectClass={jest.fn()}
      />,
    );

    await screen.findByRole("button", {
      name: /voltar para períodos/i,
    });

    expect(screen.queryByText(/selecionar/i)).not.toBeInTheDocument();
  });
});
