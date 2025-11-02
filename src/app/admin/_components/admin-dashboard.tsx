"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Trash2,
  Users,
  Check,
  X,
  Settings,
  Loader2,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/app/_components/navbar";
import { getUsers } from "@/app/_actions/get-users";
import { getRoles } from "@/app/_actions/permissions/get-roles";
import { createRole } from "@/app/_actions/permissions/create-role";
import { PermissionsSection } from "./permissions";
import { updateUserRole } from "@/app/_actions/permissions/update-user-role";
import { deleteRole } from "@/app/_actions/permissions/delete-role";
import { deleteUser } from "@/app/_actions/delete-user";
import { getUser } from "@/app/_actions/getUser";

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type Permission = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  roles: Role[];
  image?: string | null;
  emailVerified?: Date | null;
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [removeRoleConfirmOpen, setRemoveRoleConfirmOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<{
    userId: string;
    roleId: string;
    userName: string;
    roleName: string;
  } | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [creatingRole, setCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [deleteRoleConfirmOpen, setDeleteRoleConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const currentUserData = await getUser();
        setCurrentUser(currentUserData.id);

        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles(),
        ]);

        const formattedUsers: User[] = usersData.map((user: any) => {
          const userRoles = Array.isArray(user.roles) ? user.roles : [];

          return {
            id: user.id,
            name: user.name || "Nome não informado",
            email: user.email,
            roles: userRoles,
            image: user.image,
            emailVerified: user.emailVerified,
          };
        });

        setUsers(formattedUsers);
        setRoles(rolesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getRoleBadgeVariant = (roleName: string) => {
    const variantMap: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      ADMIN: "destructive",
      DIRECAO: "destructive",
      PROFESSOR: "default",
      SECRETARIA: "secondary",
      USER: "outline",
    };
    return variantMap[roleName.toUpperCase()] || "outline";
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      setCreatingRole(true);
      const roleNameInCaps = newRoleName.trim().toUpperCase();
      const newRole = await createRole({
        name: roleNameInCaps,
        permissions: [],
      });

      setRoles((prev) => [...prev, newRole]);
      setNewRoleName("");
    } catch (error) {
      console.error("Erro ao criar role:", error);
    } finally {
      setCreatingRole(false);
    }
  };

  const handleRoleToggle = async (userId: string, roleId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentRoles = user.roles.map((r) => r.id);
    const hasRole = currentRoles.includes(roleId);

    let newRoleIds: string[];

    if (hasRole) {
      if (currentRoles.length <= 1) {
        return;
      }
      newRoleIds = currentRoles.filter((id) => id !== roleId);
    } else {
      newRoleIds = [...currentRoles, roleId];
    }

    try {
      setUpdatingUser(userId);
      const updatedUser = await updateUserRole(userId, newRoleIds);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                roles: updatedUser.roles,
              }
            : u
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar roles do usuário:", error);
      const [usersData] = await Promise.all([getUsers()]);
      const refreshedUsers: User[] = usersData.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: Array.isArray(user.roles) ? user.roles : [],
        image: user.image,
        emailVerified: user.emailVerified,
      }));
      setUsers(refreshedUsers);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteRoleClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteRoleConfirmOpen(true);
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    const user = users.find((u) => u.id === userId);
    const role = roles.find((r) => r.id === roleId);

    if (!user || !role) return;

    if (user.roles.length <= 1) {
      return;
    }

    setRoleToRemove({
      userId,
      roleId,
      userName: user.name || "Usuário",
      roleName: role.name,
    });
    setRemoveRoleConfirmOpen(true);
  };

  const confirmRemoveRole = async () => {
    if (!roleToRemove) return;

    const { userId, roleId } = roleToRemove;
    await handleRoleToggle(userId, roleId);

    setRoleToRemove(null);
    setRemoveRoleConfirmOpen(false);
  };

  const cancelRemoveRole = () => {
    setRoleToRemove(null);
    setRemoveRoleConfirmOpen(false);
  };

  const canRemoveRole = (userId: string, roleId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    if (user.roles.length <= 1) return false;

    return true;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || user.roles.some((role) => role.id === roleFilter);

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id)
      );
      setUserToDelete(null);
      setDeleteConfirmOpen(false);

      console.log(`Usuário ${userToDelete.name} excluído com sucesso`);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      setDeletingRole(true);
      await deleteRole(roleToDelete.id);

      setRoles((prev) => prev.filter((role) => role.id !== roleToDelete.id));
      setRoleToDelete(null);
      setDeleteRoleConfirmOpen(false);
    } catch (error) {
      console.error("Erro ao excluir role:", error);
    } finally {
      setDeletingRole(false);
    }
  };

  const cancelDeleteRole = () => {
    setRoleToDelete(null);
    setDeleteRoleConfirmOpen(false);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const canDeleteRole = (role: Role) => {
    const usersWithRole = users.filter((user) =>
      user.roles.some((userRole) => userRole.id === role.id)
    );

    return usersWithRole.length === 0;
  };

  const canDeleteUser = (user: User) => {
    if (currentUser && user.id === currentUser) {
      return false;
    }

    const userIsAdmin = user.roles.some((role) => role.name === "ADMIN");
    if (userIsAdmin) {
      const adminUsers = users.filter((u) =>
        u.roles.some((role) => role.name === "ADMIN")
      );
      if (adminUsers.length <= 1) {
        return false;
      }
    }

    return true;
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-background p-3 sm:p-6">
          <div className="container mx-auto space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background p-3 sm:p-6">
        <div className="container mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-foreground">
                  Gerenciamento de Usuários
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {users.length} usuário(s) encontrado(s)
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Users className="h-4" />
                Gerenciar Usuários
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4" />
                Gerenciar Permissões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Gerenciar Roles
                  </CardTitle>
                  <CardDescription>
                    Crie novas roles ou exclua roles existentes do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Role</label>
                    <Input
                      placeholder="Ex: COORDENADOR"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                  <div className="cursor-pointer w-fit">
                    <Button
                      onClick={handleCreateRole}
                      disabled={!newRoleName.trim() || creatingRole}
                      className="w-full md:w-auto "
                    >
                      {creatingRole ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {creatingRole ? "Criando..." : "Criar Role"}
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">
                      Roles do Sistema
                    </h4>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant={getRoleBadgeVariant(role.name)}>
                              {role.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {role.permissions.length} permissões
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoleClick(role)}
                            disabled={!canDeleteRole(role)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                            title={
                              canDeleteRole(role)
                                ? `Excluir role ${role.name}`
                                : "Esta role não pode ser excluída"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-foreground text-lg sm:text-xl">
                    Lista de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="bg-input border-border cursor-pointer">
                        <SelectValue placeholder="Filtrar por role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todas as Roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.id}
                            className="cursor-pointer"
                          >
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabela para desktop */}
                  <div className="hidden md:block rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-foreground font-semibold">
                            Nome
                          </TableHead>
                          <TableHead className="text-foreground font-semibold">
                            Email
                          </TableHead>
                          <TableHead className="text-foreground font-semibold">
                            Roles
                          </TableHead>
                          <TableHead className="text-foreground font-semibold text-right">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user, index) => (
                          <TableRow
                            key={user.id}
                            className={
                              index % 2 === 0 ? "bg-background" : "bg-card"
                            }
                          >
                            <TableCell className="font-medium text-foreground">
                              {user.name}
                            </TableCell>
                            <TableCell className="text-card-foreground">
                              {user.email || "Email não informado"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map((role) => (
                                  <div
                                    key={role.id}
                                    className="flex items-center"
                                  >
                                    <Badge
                                      variant={getRoleBadgeVariant(role.name)}
                                      className="text-xs pr-1"
                                    >
                                      {updatingUser === user.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <>
                                          {role.name}
                                          {canRemoveRole(user.id, role.id) && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveRole(
                                                  user.id,
                                                  role.id
                                                );
                                              }}
                                              className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                              title={`Remover role ${role.name}`}
                                            >
                                              <X className="h-2.5 w-2.5" />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                ))}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 ml-1 cursor-pointer"
                                      title="Adicionar role"
                                      disabled={updatingUser === user.id}
                                    >
                                      {updatingUser === user.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Plus className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {roles.map((role) => (
                                      <DropdownMenuItem
                                        key={role.id}
                                        onClick={() =>
                                          handleRoleToggle(user.id, role.id)
                                        }
                                        className="flex items-center justify-between"
                                        disabled={updatingUser === user.id}
                                      >
                                        <span>{role.name}</span>
                                        {user.roles.some(
                                          (r) => r.id === role.id
                                        ) && (
                                          <Check className="h-4 w-4 text-green-600" />
                                        )}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                disabled={!canDeleteUser(user)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                title={
                                  canDeleteUser(user)
                                    ? "Excluir usuário"
                                    : "Não é possível excluir este usuário"
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Cards para mobile */}
                  <div className="md:hidden space-y-3">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground truncate">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.email || "Email não informado"}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="h-8 w-8 p-0 ml-2 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Roles
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {user.roles.map((role) => (
                                  <div
                                    key={role.id}
                                    className="flex items-center"
                                  >
                                    <Badge
                                      variant={getRoleBadgeVariant(role.name)}
                                      className="text-xs pr-1"
                                    >
                                      {updatingUser === user.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <>
                                          {role.name}
                                          {canRemoveRole(user.id, role.id) && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveRole(
                                                  user.id,
                                                  role.id
                                                );
                                              }}
                                              className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                              title={`Remover role ${role.name}`}
                                            >
                                              <X className="h-2.5 w-2.5" />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                ))}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-transparent"
                                      title="Adicionar role"
                                      disabled={updatingUser === user.id}
                                    >
                                      {updatingUser === user.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      ) : (
                                        <Plus className="h-3 w-3 mr-1 " />
                                      )}
                                      Adicionar
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {roles.map((role) => (
                                      <DropdownMenuItem
                                        key={role.id}
                                        onClick={() =>
                                          handleRoleToggle(user.id, role.id)
                                        }
                                        className="flex items-center justify-between"
                                        disabled={updatingUser === user.id}
                                      >
                                        <span>{role.name}</span>
                                        {user.roles.some(
                                          (r) => r.id === role.id
                                        ) && (
                                          <Check className="h-4 w-4 text-green-600" />
                                        )}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {users.length === 0
                          ? "Nenhum usuário encontrado no sistema."
                          : "Nenhum usuário encontrado com os filtros aplicados."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                      {userToDelete && !canDeleteUser(userToDelete) ? (
                        <span className="text-destructive">
                          Não é possível excluir este usuário.
                          {userToDelete.roles.some(
                            (role) => role.name === "ADMIN"
                          ) &&
                            users.filter((u) =>
                              u.roles.some((role) => role.name === "ADMIN")
                            ).length <= 1 &&
                            " É o único administrador do sistema."}
                          {currentUser &&
                            userToDelete.id === currentUser &&
                            " Você não pode excluir sua própria conta."}
                        </span>
                      ) : (
                        <>
                          Tem certeza que deseja excluir o usuário{" "}
                          <strong>{userToDelete?.name}</strong>? Esta ação não
                          pode ser desfeita.
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={cancelDelete}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDelete}
                      disabled={
                        userToDelete ? !canDeleteUser(userToDelete) : false
                      }
                    >
                      Sim, Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={removeRoleConfirmOpen}
                onOpenChange={setRemoveRoleConfirmOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirmar Remoção de Role</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover a role{" "}
                      <strong>{roleToRemove?.roleName}</strong> do usuário{" "}
                      <strong>{roleToRemove?.userName}</strong>?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={cancelRemoveRole}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmRemoveRole}
                      disabled={updatingUser === roleToRemove?.userId}
                    >
                      {updatingUser === roleToRemove?.userId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sim, Remover"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={deleteRoleConfirmOpen}
                onOpenChange={setDeleteRoleConfirmOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão de Role</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir a role{" "}
                      <strong>{roleToDelete?.name}</strong>?
                      <br />
                      <span className="text-destructive">
                        Esta ação removerá permanentemente a role e todas as
                        suas permissões associadas.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={cancelDeleteRole}
                      disabled={deletingRole}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteRole}
                      disabled={deletingRole}
                    >
                      {deletingRole ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {deletingRole ? "Excluindo..." : "Sim, Excluir"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <PermissionsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
