"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Trash2, Loader2 } from "lucide-react";
import { createPermission } from "@/app/_actions/permissions/create-permission";
import { getRoles } from "@/app/_actions/permissions/get-roles";
import { getPermissions } from "@/app/_actions/permissions/get-permission";
import { updateRolePermissions } from "@/app/_actions/permissions/update-role-permission";
import { deletePermission } from "@/app/_actions/permissions/delete-permission";

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type Permission = {
  id: string;
  name: string;
};

export function PermissionsSection() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newPermissionName, setNewPermissionName] = useState("");
  const [creatingPermission, setCreatingPermission] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingPermissions, setDeletingPermissions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [rolesData, permissionsData] = await Promise.all([
          getRoles(),
          getPermissions(),
        ]);

        setRoles(rolesData);
        setPermissions(permissionsData);

        if (rolesData.length > 0 && !selectedRole) {
          setSelectedRole(rolesData[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedRole]);

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) return;

    try {
      setCreatingPermission(true);
      const newPermission = await createPermission(newPermissionName.trim());

      setPermissions((prev) => [...prev, newPermission]);

      setNewPermissionName("");
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
    } finally {
      setCreatingPermission(false);
    }
  };

  const handlePermissionToggle = async (
    roleId: string,
    permissionId: string
  ) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    const currentPermissions = role.permissions.map((p) => p.id);
    const hasPermission = currentPermissions.includes(permissionId);

    let newPermissionIds: string[];

    if (hasPermission) {
      newPermissionIds = currentPermissions.filter((id) => id !== permissionId);
    } else {
      newPermissionIds = [...currentPermissions, permissionId];
    }

    try {
      setUpdatingRole(roleId);
      await updateRolePermissions(roleId, newPermissionIds);

      const newPermissionsList = permissions.filter((permission) =>
        newPermissionIds.includes(permission.id)
      );

      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === roleId ? { ...r, permissions: newPermissionsList } : r
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
    } finally {
      setUpdatingRole(null);
    }
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return false;

    return role.permissions.some((p) => p.id === permissionId);
  };

  const selectedRoleData = roles.find((role) => role.id === selectedRole);

  const getRoleBadgeColor = (roleName: string) => {
    const colorMap: { [key: string]: string } = {
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      DIRECAO: "bg-red-100 text-red-800 border-red-200",
      PROFESSOR: "bg-blue-100 text-blue-800 border-blue-200",
      SECRETARIA: "bg-green-100 text-green-800 border-green-200",
      USER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      colorMap[roleName.toUpperCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta permissão? Esta ação removerá a permissão de todos os perfis."
      )
    ) {
      return;
    }

    try {
      setDeletingPermissions((prev) => new Set(prev).add(permissionId));

      const result = await deletePermission(permissionId);

      if (result.success) {
        setRoles((prevRoles) =>
          prevRoles.map((role) => ({
            ...role,
            permissions: role.permissions.filter((p) => p.id !== permissionId),
          }))
        );

        setPermissions((prev) => prev.filter((p) => p.id !== permissionId));

        console.log("Permissão excluída com sucesso");
      } else {
        console.error("Erro ao excluir permissão:", result.error);
        alert("Erro ao excluir permissão: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir permissão:", error);
      alert("Erro ao excluir permissão");
    } finally {
      setDeletingPermissions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(permissionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Gerenciamento de Permissões
          </h2>
          <p className="text-muted-foreground">
            Configure as permissões para cada perfil de usuário
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Gerenciamento de Permissões
        </h2>
        <p className="text-muted-foreground">
          Configure as permissões para cada perfil de usuário
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Nova Permissão
          </CardTitle>
          <CardDescription>
            Crie permissões personalizadas que podem ser atribuídas aos perfis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Permissão</label>
            <Input
              placeholder="Ex: Gerenciar Biblioteca"
              value={newPermissionName}
              onChange={(e) => setNewPermissionName(e.target.value)}
            />
          </div>
          <div className="cursor-pointer w-fit">
            <Button
              onClick={handleCreatePermission}
              disabled={!newPermissionName.trim() || creatingPermission}
              className="w-full md:w-auto"
            >
              {creatingPermission ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {creatingPermission ? "Criando..." : "Adicionar Permissão"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className="w-full justify-start cursor-pointer"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {role.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Perfil: {selectedRoleData?.name || "Selecione um perfil"}
                  </CardTitle>
                  <CardDescription>
                    Configure as permissões para usuários com perfil de{" "}
                    {selectedRoleData?.name.toLowerCase()}
                  </CardDescription>
                </div>
                {selectedRoleData && (
                  <Badge className={getRoleBadgeColor(selectedRoleData.name)}>
                    {selectedRoleData.permissions.length} permissões ativas
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedRoleData ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {permissions.map((permission) => {
                    const isActive = hasPermission(selectedRole, permission.id);

                    return (
                      <Card
                        key={permission.id}
                        className={`transition-all ${
                          isActive ? "ring-2 ring-primary" : ""
                        } ${updatingRole === selectedRole ? "opacity-50" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {permission.name}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {updatingRole === selectedRole ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Switch
                                  checked={isActive}
                                  onCheckedChange={() =>
                                    handlePermissionToggle(
                                      selectedRole,
                                      permission.id
                                    )
                                  }
                                  className="cursor-pointer"
                                />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemovePermission(permission.id)
                                }
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                                disabled={updatingRole === selectedRole}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Selecione um perfil para configurar as permissões
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
