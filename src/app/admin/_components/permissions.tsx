"use client";

import { useState } from "react";
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
import { Shield, Plus, Trash2 } from "lucide-react";

type ProfileType =
  | "direcao"
  | "professor"
  | "secretaria"
  | "usuario_padrao"
  | "admin";

type Permission = {
  id: string;
  name: string;
  isCustom?: boolean;
};

type ProfilePermissions = {
  [key in ProfileType]: string[];
};

const AVAILABLE_PERMISSIONS: Permission[] = [
  {
    id: "manage_users",
    name: "Gerenciar Usuários",
  },
  {
    id: "manage_profiles",
    name: "Gerenciar Perfis",
  },
  {
    id: "view_reports",
    name: "Visualizar Relatórios",
  },
  {
    id: "manage_classes",
    name: "Gerenciar Turmas",
  },
  {
    id: "manage_schedule",
    name: "Gerenciar Horários",
  },
  {
    id: "access_grades",
    name: "Acessar Notas",
  },
  {
    id: "system_settings",
    name: "Configurações do Sistema",
  },
  {
    id: "backup_restore",
    name: "Backup e Restauração",
  },
];

const PROFILE_LABELS: Record<ProfileType, string> = {
  direcao: "Direção",
  professor: "Professor",
  secretaria: "Secretaria",
  usuario_padrao: "Usuário Padrão",
  admin: "Admin",
};

const PROFILE_COLORS: Record<ProfileType, string> = {
  direcao: "bg-red-100 text-red-800 border-red-200",
  professor: "bg-blue-100 text-blue-800 border-blue-200",
  secretaria: "bg-green-100 text-green-800 border-green-200",
  usuario_padrao: "bg-gray-100 text-gray-800 border-gray-200",
  admin: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function ProfileManagement() {
  const [profilePermissions, setProfilePermissions] =
    useState<ProfilePermissions>({
      direcao: [
        "manage_users",
        "manage_profiles",
        "view_reports",
        "system_settings",
        "backup_restore",
      ],
      professor: ["manage_classes", "access_grades", "view_reports"],
      secretaria: ["manage_users", "manage_schedule", "view_reports"],
      usuario_padrao: [],
      admin: [
        "manage_users",
        "manage_profiles",
        "view_reports",
        "manage_classes",
        "manage_schedule",
        "access_grades",
        "system_settings",
        "backup_restore",
      ],
    });

  const [selectedProfile, setSelectedProfile] =
    useState<ProfileType>("direcao");

  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);
  const [newPermissionName, setNewPermissionName] = useState("");

  const allPermissions = [...AVAILABLE_PERMISSIONS, ...customPermissions];

  const togglePermission = (profileType: ProfileType, permissionId: string) => {
    setProfilePermissions((prev) => {
      const currentPermissions = prev[profileType];
      const hasPermission = currentPermissions.includes(permissionId);

      return {
        ...prev,
        [profileType]: hasPermission
          ? currentPermissions.filter((id) => id !== permissionId)
          : [...currentPermissions, permissionId],
      };
    });
  };

  const hasPermission = (profileType: ProfileType, permissionId: string) => {
    return profilePermissions[profileType].includes(permissionId);
  };

  const addCustomPermission = () => {
    if (!newPermissionName.trim()) return;

    const newPermission: Permission = {
      id: `custom_${Date.now()}`,
      name: newPermissionName.trim(),
      isCustom: true,
    };

    setCustomPermissions((prev) => [...prev, newPermission]);
    setNewPermissionName("");
  };

  const removePermission = (permissionId: string) => {
    const permission = allPermissions.find((p) => p.id === permissionId);

    if (permission?.isCustom) {
      setCustomPermissions((prev) => prev.filter((p) => p.id !== permissionId));
    }

    setProfilePermissions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((profile) => {
        updated[profile as ProfileType] = updated[
          profile as ProfileType
        ].filter((id) => id !== permissionId);
      });
      return updated;
    });
  };

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
          <Button
            onClick={addCustomPermission}
            disabled={!newPermissionName.trim()}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Permissão
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(PROFILE_LABELS).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedProfile === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedProfile(key as ProfileType)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {label}
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
                    Perfil: {PROFILE_LABELS[selectedProfile]}
                  </CardTitle>
                  <CardDescription>
                    Configure as permissões para usuários com perfil de{" "}
                    {PROFILE_LABELS[selectedProfile].toLowerCase()}
                  </CardDescription>
                </div>
                <Badge className={PROFILE_COLORS[selectedProfile]}>
                  {profilePermissions[selectedProfile].length} permissões ativas
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {allPermissions.map((permission) => {
                  const isActive = hasPermission(
                    selectedProfile,
                    permission.id
                  );

                  return (
                    <Card
                      key={permission.id}
                      className={`transition-all ${isActive ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{permission.name}</h4>
                              {permission.isCustom && (
                                <Badge variant="outline" className="text-xs">
                                  Personalizada
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isActive}
                              onCheckedChange={() =>
                                togglePermission(selectedProfile, permission.id)
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePermission(permission.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
