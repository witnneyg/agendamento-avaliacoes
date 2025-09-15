export type UserRole = "admin" | "direcao" | "professor" | "secretaria";

export type Permission =
  | "users.create"
  | "users.read"
  | "users.update"
  | "users.delete"
  | "courses.create"
  | "courses.read"
  | "courses.update"
  | "courses.delete"
  | "subjects.create"
  | "subjects.read"
  | "subjects.update"
  | "subjects.delete"
  | "evaluations.create"
  | "evaluations.read"
  | "evaluations.update"
  | "evaluations.delete"
  | "reports.read"
  | "reports.export"
  | "system.settings";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId?: string;
  subjectIds?: string[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  isActive: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  courseId?: string;
  subjectIds?: string[];
}
