export function translateTeacherStatus(status: "ACTIVE" | "INACTIVE"): string {
  switch (status) {
    case "ACTIVE":
      return "Ativo";
    case "INACTIVE":
      return "Inativo";
    default:
      return status;
  }
}
