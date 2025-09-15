import { Permission } from "./types";
import { UserRole } from "./types";

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "courses.create",
    "courses.read",
    "courses.update",
    "courses.delete",
    "subjects.create",
    "subjects.read",
    "subjects.update",
    "subjects.delete",
    "evaluations.create",
    "evaluations.read",
    "evaluations.update",
    "evaluations.delete",
    "reports.read",
    "reports.export",
    "system.settings",
  ],
  direcao: [
    "users.read",
    "users.update",
    "courses.read",
    "courses.update",
    "subjects.read",
    "subjects.update",
    "evaluations.read",
    "evaluations.update",
    "reports.read",
    "reports.export",
  ],
  professor: [
    "users.read",
    "subjects.read",
    "evaluations.create",
    "evaluations.read",
    "evaluations.update",
    "reports.read",
  ],
  secretaria: [
    "users.read",
    "courses.read",
    "subjects.read",
    "evaluations.read",
    "reports.read",
  ],
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  "users.create": "Criar usuários",
  "users.read": "Visualizar usuários",
  "users.update": "Editar usuários",
  "users.delete": "Excluir usuários",
  "courses.create": "Criar cursos",
  "courses.read": "Visualizar cursos",
  "courses.update": "Editar cursos",
  "courses.delete": "Excluir cursos",
  "subjects.create": "Criar disciplinas",
  "subjects.read": "Visualizar disciplinas",
  "subjects.update": "Editar disciplinas",
  "subjects.delete": "Excluir disciplinas",
  "evaluations.create": "Criar avaliações",
  "evaluations.read": "Visualizar avaliações",
  "evaluations.update": "Editar avaliações",
  "evaluations.delete": "Excluir avaliações",
  "reports.read": "Visualizar relatórios",
  "reports.export": "Exportar relatórios",
  "system.settings": "Configurações do sistema",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  direcao: "Direção",
  professor: "Professor",
  secretaria: "Secretaria",
};

export function hasPermission(
  userRole: UserRole,
  permission: Permission,
  customPermissions?: Record<UserRole, Permission[]>
): boolean {
  const permissions = customPermissions || DEFAULT_ROLE_PERMISSIONS;
  return permissions[userRole]?.includes(permission) || false;
}

export function getRolePermissions(
  role: UserRole,
  customPermissions?: Record<UserRole, Permission[]>
): Permission[] {
  const permissions = customPermissions || DEFAULT_ROLE_PERMISSIONS;
  return permissions[role] || [];
}
