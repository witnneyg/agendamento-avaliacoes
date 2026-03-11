import "@testing-library/jest-dom";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "witnney.sousa@alunos.unicerrado.edu.br",
      },
    },
    status: "authenticated",
  }),
}));
