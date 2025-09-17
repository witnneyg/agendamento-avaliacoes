"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Plus,
  Save,
  RotateCcw,
  Trash2,
  Minus,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Settings,
} from "lucide-react";

// Types
type UserRole = "admin" | "direcao" | "professor" | "secretaria";

type Permission =
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

// Default permissions for each role
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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

// Permission labels
const PERMISSION_LABELS: Record<Permission, string> = {
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

// Role labels
const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  direcao: "Direção",
  professor: "Professor",
  secretaria: "Secretaria",
};

// Permission categories
const PERMISSION_CATEGORIES = {
  users: {
    label: "Usuários",
    icon: Users,
    permissions: [
      "users.create",
      "users.read",
      "users.update",
      "users.delete",
    ] as Permission[],
  },
  courses: {
    label: "Cursos",
    icon: GraduationCap,
    permissions: [
      "courses.create",
      "courses.read",
      "courses.update",
      "courses.delete",
    ] as Permission[],
  },
  subjects: {
    label: "Disciplinas",
    icon: BookOpen,
    permissions: [
      "subjects.create",
      "subjects.read",
      "subjects.update",
      "subjects.delete",
    ] as Permission[],
  },
  evaluations: {
    label: "Avaliações",
    icon: FileText,
    permissions: [
      "evaluations.create",
      "evaluations.read",
      "evaluations.update",
      "evaluations.delete",
    ] as Permission[],
  },
  reports: {
    label: "Relatórios",
    icon: FileText,
    permissions: ["reports.read", "reports.export"] as Permission[],
  },
  system: {
    label: "Sistema",
    icon: Settings,
    permissions: ["system.settings"] as Permission[],
  },
};

export default function PermissionsPage() {
  // States
  const [rolePermissions, setRolePermissions] = useState<
    Record<UserRole, Permission[]>
  >(DEFAULT_ROLE_PERMISSIONS);
  const [customPermissionLabels, setCustomPermissionLabels] = useState<
    Record<string, string>
  >({});
  const [permissionLoading, setPermissionLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>("secretaria");
  const [tempPermissions, setTempPermissions] = useState<Permission[]>(
    rolePermissions["secretaria"] || []
  );
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddPermissionDialog, setShowAddPermissionDialog] = useState(false);
  const [showDeletePermissionDialog, setShowDeletePermissionDialog] =
    useState(false);
  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);
  const [newPermissionKey, setNewPermissionKey] = useState("");
  const [newPermissionLabel, setNewPermissionLabel] = useState("");
  const [selectedRolesForNewPermission, setSelectedRolesForNewPermission] =
    useState<UserRole[]>([]);
  const [applyToAllRoles, setApplyToAllRoles] = useState(false);

  // Helper functions
  const getAllAvailablePermissions = useCallback((): Permission[] => {
    const defaultPermissions = Object.keys(DEFAULT_ROLE_PERMISSIONS).reduce(
      (acc, role) => {
        DEFAULT_ROLE_PERMISSIONS[role as UserRole].forEach((perm) => {
          if (!acc.includes(perm)) acc.push(perm);
        });
        return acc;
      },
      [] as Permission[]
    );

    const allCurrentPermissions = Object.values(rolePermissions).flat();
    allCurrentPermissions.forEach((perm) => {
      if (!defaultPermissions.includes(perm)) {
        defaultPermissions.push(perm);
      }
    });

    return defaultPermissions;
  }, [rolePermissions]);

  const isCustomPermission = useCallback((permission: Permission): boolean => {
    const defaultPermissions = Object.values(DEFAULT_ROLE_PERMISSIONS).flat();
    return !defaultPermissions.includes(permission);
  }, []);

  const getPermissionLabel = useCallback(
    (permission: Permission): string => {
      return (
        PERMISSION_LABELS[permission] ||
        customPermissionLabels[permission] ||
        permission
      );
    },
    [customPermissionLabels]
  );

  const updateRolePermissions = useCallback(
    async (role: UserRole, permissions: Permission[]): Promise<void> => {
      setPermissionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRolePermissions((prev) => ({
        ...prev,
        [role]: permissions,
      }));
      setPermissionLoading(false);
    },
    []
  );

  const resetRolePermissions = useCallback(
    async (role: UserRole): Promise<void> => {
      setPermissionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setRolePermissions((prev) => ({
        ...prev,
        [role]: DEFAULT_ROLE_PERMISSIONS[role],
      }));
      setPermissionLoading(false);
    },
    []
  );

  const addCustomPermission = useCallback(
    async (
      permissionKey: string,
      permissionLabel: string,
      selectedRoles: UserRole[] = [],
      applyToAllRoles = false
    ): Promise<void> => {
      setPermissionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newPermission = permissionKey as Permission;

      setCustomPermissionLabels((prev) => ({
        ...prev,
        [permissionKey]: permissionLabel,
      }));

      setRolePermissions((prev) => {
        const updated = { ...prev };
        if (applyToAllRoles) {
          Object.keys(updated).forEach((role) => {
            if (!updated[role as UserRole].includes(newPermission)) {
              updated[role as UserRole] = [
                ...updated[role as UserRole],
                newPermission,
              ];
            }
          });
        } else if (selectedRoles.length > 0) {
          selectedRoles.forEach((role) => {
            if (!updated[role].includes(newPermission)) {
              updated[role] = [...updated[role], newPermission];
            }
          });
        }
        return updated;
      });

      setPermissionLoading(false);
    },
    []
  );

  const removeCustomPermission = useCallback(
    async (permission: Permission): Promise<void> => {
      setPermissionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setCustomPermissionLabels((prev) => {
        const updated = { ...prev };
        delete updated[permission];
        return updated;
      });

      setRolePermissions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((role) => {
          updated[role as UserRole] = updated[role as UserRole].filter(
            (p) => p !== permission
          );
        });
        return updated;
      });

      setPermissionLoading(false);
    },
    []
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground";
      case "direcao":
        return "bg-primary text-primary-foreground";
      case "professor":
        return "bg-secondary text-secondary-foreground";
      case "secretaria":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const organizePermissionsByCategory = (permissions: Permission[]) => {
    const organized: Record<string, Permission[]> = {};
    const allAvailablePermissions = getAllAvailablePermissions();

    Object.keys(PERMISSION_CATEGORIES).forEach((categoryKey) => {
      const categoryPermissions = allAvailablePermissions.filter(
        (p) => p.startsWith(`${categoryKey}.`) && permissions.includes(p)
      );
      if (categoryPermissions.length > 0) {
        organized[categoryKey] = categoryPermissions;
      }
    });

    const otherPermissions = permissions.filter((p) => {
      return !Object.keys(PERMISSION_CATEGORIES).some((categoryKey) =>
        p.startsWith(`${categoryKey}.`)
      );
    });
    if (otherPermissions.length > 0) {
      organized.other = otherPermissions;
    }

    return organized;
  };

  // Event handlers
  const handleRoleChange = (role: string) => {
    if (hasChanges) {
      const confirmChange = window.confirm(
        "Você tem alterações não salvas. Deseja continuar?"
      );
      if (!confirmChange) return;
    }

    const newRole = role as UserRole;
    setSelectedRole(newRole);
    setTempPermissions(rolePermissions[newRole] || []);
    setHasChanges(false);
  };

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    if (checked) {
      setTempPermissions((prev) => [...prev, permission]);
    } else {
      setTempPermissions((prev) => prev.filter((p) => p !== permission));
    }
    setHasChanges(true);
  };

  const handleCategoryToggle = (
    categoryPermissions: Permission[],
    checked: boolean
  ) => {
    if (checked) {
      setTempPermissions((prev) => {
        const newPermissions = [...prev];
        categoryPermissions.forEach((perm) => {
          if (!newPermissions.includes(perm)) {
            newPermissions.push(perm);
          }
        });
        return newPermissions;
      });
    } else {
      setTempPermissions((prev) =>
        prev.filter((p) => !categoryPermissions.includes(p))
      );
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateRolePermissions(selectedRole, tempPermissions);
      setHasChanges(false);
      console.log("Permissões atualizadas com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
    }
  };

  const handleReset = async () => {
    try {
      await resetRolePermissions(selectedRole);
      setTempPermissions(DEFAULT_ROLE_PERMISSIONS[selectedRole]);
      setHasChanges(false);
      setShowResetDialog(false);
      console.log("Permissões restauradas para o padrão.");
    } catch (error) {
      console.error("Erro ao restaurar permissões:", error);
    }
  };

  const handleDiscard = () => {
    setTempPermissions(rolePermissions[selectedRole] || []);
    setHasChanges(false);
  };

  const handleAddPermission = async () => {
    if (!newPermissionKey.trim() || !newPermissionLabel.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!applyToAllRoles && selectedRolesForNewPermission.length === 0) {
      alert(
        "Selecione pelo menos um perfil ou marque 'Aplicar a todos os perfis'."
      );
      return;
    }

    const allPermissions = getAllAvailablePermissions();
    if (allPermissions.includes(newPermissionKey as Permission)) {
      alert("Esta permissão já existe no sistema.");
      return;
    }

    try {
      await addCustomPermission(
        newPermissionKey,
        newPermissionLabel,
        selectedRolesForNewPermission,
        applyToAllRoles
      );

      if (
        applyToAllRoles ||
        selectedRolesForNewPermission.includes(selectedRole)
      ) {
        setTempPermissions((prev) => [...prev, newPermissionKey as Permission]);
      }

      setNewPermissionKey("");
      setNewPermissionLabel("");
      setSelectedRolesForNewPermission([]);
      setApplyToAllRoles(false);
      setShowAddPermissionDialog(false);

      const appliedTo = applyToAllRoles
        ? "todos os perfis"
        : selectedRolesForNewPermission
            .map((role) => ROLE_LABELS[role])
            .join(", ");

      console.log(
        `A permissão "${newPermissionLabel}" foi criada e aplicada a: ${appliedTo}.`
      );
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
      alert("Ocorreu um erro ao criar a permissão. Tente novamente.");
    }
  };

  const handleDeletePermission = async () => {
    if (!permissionToDelete) return;

    try {
      await removeCustomPermission(permissionToDelete);
      setPermissionToDelete(null);
      setShowDeletePermissionDialog(false);
      setTempPermissions((prev) =>
        prev.filter((p) => p !== permissionToDelete)
      );
      console.log("A permissão foi excluída com sucesso de todos os perfis.");
    } catch (error) {
      console.error("Erro ao excluir permissão:", error);
      alert("Ocorreu um erro ao excluir a permissão. Tente novamente.");
    }
  };

  const handleRoleToggleForNewPermission = (
    role: UserRole,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedRolesForNewPermission((prev) => [...prev, role]);
    } else {
      setSelectedRolesForNewPermission((prev) =>
        prev.filter((r) => r !== role)
      );
    }
  };

  // Get current role permissions for display
  const currentRolePermissions = rolePermissions[selectedRole] || [];
  const organizedPermissions = organizePermissionsByCategory(
    currentRolePermissions
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Permissões</h1>
          <p className="text-muted-foreground">
            Configure as permissões para cada perfil de usuário no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gerenciamento de Permissões
          </CardTitle>
          <CardDescription>
            Configure as permissões para cada perfil de usuário. Adicione ou
            remova permissões específicas para controlar o acesso às
            funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-2">
                <Label htmlFor="role-select">Selecionar Perfil</Label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([role, label]) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getRoleColor(role as UserRole)}`}
                          />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={showAddPermissionDialog}
                  onOpenChange={setShowAddPermissionDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Nova Permissão
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Permissão</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova permissão personalizada e escolha
                        quais perfis receberão essa permissão.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="permission-key">
                          Chave da Permissão
                        </Label>
                        <Input
                          id="permission-key"
                          placeholder="ex: users.export"
                          value={newPermissionKey}
                          onChange={(e) => setNewPermissionKey(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="permission-label">
                          Nome da Permissão
                        </Label>
                        <Input
                          id="permission-label"
                          placeholder="ex: Exportar Usuários"
                          value={newPermissionLabel}
                          onChange={(e) =>
                            setNewPermissionLabel(e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Aplicar Permissão aos Perfis</Label>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="apply-all-roles"
                            checked={applyToAllRoles}
                            onCheckedChange={(checked) => {
                              setApplyToAllRoles(checked as boolean);
                              if (checked) {
                                setSelectedRolesForNewPermission([]);
                              }
                            }}
                          />
                          <Label
                            htmlFor="apply-all-roles"
                            className="text-sm font-medium"
                          >
                            Aplicar a todos os perfis (incluindo futuros perfis)
                          </Label>
                        </div>

                        {!applyToAllRoles && (
                          <div className="space-y-2 pl-6 border-l-2 border-muted">
                            <Label className="text-sm text-muted-foreground">
                              Ou selecione perfis específicos:
                            </Label>
                            <div className="space-y-2">
                              {Object.entries(ROLE_LABELS).map(
                                ([role, label]) => (
                                  <div
                                    key={role}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`role-${role}`}
                                      checked={selectedRolesForNewPermission.includes(
                                        role as UserRole
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleRoleToggleForNewPermission(
                                          role as UserRole,
                                          checked as boolean
                                        )
                                      }
                                    />
                                    <Label
                                      htmlFor={`role-${role}`}
                                      className="text-sm cursor-pointer flex items-center gap-2"
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full ${getRoleColor(role as UserRole)}`}
                                      />
                                      {label}
                                    </Label>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddPermissionDialog(false);
                          setNewPermissionKey("");
                          setNewPermissionLabel("");
                          setSelectedRolesForNewPermission([]);
                          setApplyToAllRoles(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddPermission}
                        disabled={permissionLoading}
                      >
                        {permissionLoading ? "Criando..." : "Criar Permissão"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {hasChanges && (
                  <Button variant="outline" onClick={handleDiscard} size="sm">
                    Descartar
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restaurar Padrão
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || permissionLoading}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {permissionLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissões do Perfil: {ROLE_LABELS[selectedRole]}
                </CardTitle>
                <CardDescription>
                  Configure as permissões específicas para este perfil de
                  usuário.
                  {hasChanges && (
                    <span className="text-accent font-medium">
                      {" "}
                      (Alterações não salvas)
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getRoleColor(selectedRole)}>
                    {ROLE_LABELS[selectedRole]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tempPermissions.length} permissão
                    {tempPermissions.length !== 1 ? "ões" : ""} ativa
                    {tempPermissions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {Object.entries(PERMISSION_CATEGORIES).map(
                ([categoryKey, category]) => {
                  const allAvailablePermissions = getAllAvailablePermissions();
                  const categoryPermissions = allAvailablePermissions.filter(
                    (p) =>
                      p.startsWith(`${categoryKey}.`) &&
                      currentRolePermissions.includes(p)
                  );

                  if (categoryPermissions.length === 0) {
                    return null;
                  }

                  const hasAllPermissions = categoryPermissions.every((p) =>
                    tempPermissions.includes(p)
                  );
                  const hasSomePermissions = categoryPermissions.some((p) =>
                    tempPermissions.includes(p)
                  );
                  const IconComponent = category.icon;

                  return (
                    <Card key={categoryKey}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <IconComponent className="h-4 w-4" />
                            {category.label}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCategoryToggle(
                                  categoryPermissions,
                                  !hasAllPermissions
                                )
                              }
                              className="h-8 px-2"
                            >
                              {hasAllPermissions ? (
                                <>
                                  <Minus className="h-3 w-3 mr-1" />
                                  Remover Todas
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Adicionar Todas
                                </>
                              )}
                            </Button>
                            <Checkbox
                              checked={hasAllPermissions}
                              //   ref={(el) => {
                              //     if (el)
                              //       el.indeterminate =
                              //         hasSomePermissions && !hasAllPermissions;
                              //   }}
                              onCheckedChange={(checked) =>
                                handleCategoryToggle(
                                  categoryPermissions,
                                  checked as boolean
                                )
                              }
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`permission-${permission}`}
                                checked={tempPermissions.includes(permission)}
                                onCheckedChange={(checked) =>
                                  handlePermissionToggle(
                                    permission,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor={`permission-${permission}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {getPermissionLabel(permission)}
                                {isCustomPermission(permission) && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (customizada)
                                  </span>
                                )}
                              </Label>
                              {isCustomPermission(permission) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPermissionToDelete(permission);
                                    setShowDeletePermissionDialog(true);
                                  }}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}

              {organizedPermissions.other &&
                organizedPermissions.other.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Settings className="h-4 w-4" />
                        Outras Permissões
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {organizedPermissions.other.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`permission-${permission}`}
                              checked={tempPermissions.includes(permission)}
                              onCheckedChange={(checked) =>
                                handlePermissionToggle(
                                  permission,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`permission-${permission}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {getPermissionLabel(permission)}
                              {isCustomPermission(permission) && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (customizada)
                                </span>
                              )}
                            </Label>
                            {isCustomPermission(permission) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPermissionToDelete(permission);
                                  setShowDeletePermissionDialog(true);
                                }}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Resumo das Permissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tempPermissions.length === 0 ? (
                    <span className="text-muted-foreground text-sm">
                      Nenhuma permissão ativa
                    </span>
                  ) : (
                    tempPermissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {getPermissionLabel(permission)}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Permissões Padrão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja restaurar as permissões do perfil{" "}
              {ROLE_LABELS[selectedRole]} para o padrão? Esta ação não pode ser
              desfeita e todas as permissões customizadas serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={permissionLoading}
            >
              {permissionLoading ? "Restaurando..." : "Restaurar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Permission Dialog */}
      <AlertDialog
        open={showDeletePermissionDialog}
        onOpenChange={setShowDeletePermissionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Permissão Customizada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a permissão "
              {permissionToDelete ? getPermissionLabel(permissionToDelete) : ""}
              "? Esta ação removerá a permissão de todos os perfis e não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePermission}
              disabled={permissionLoading}
            >
              {permissionLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
