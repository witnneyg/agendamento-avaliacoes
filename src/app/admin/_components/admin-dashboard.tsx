"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  Check,
  X,
  Settings,
  Loader2,
  Shield,
  UserX,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/app/_components/navbar";
import { getUsers } from "@/app/_actions/user/get-users";
import { getRoles } from "@/app/_actions/permissions/get-roles";
import { updateUserRole } from "@/app/_actions/permissions/update-user-role";
import { deleteRole } from "@/app/_actions/permissions/delete-role";
import { getUser } from "@/app/_actions/user/getUser";
import { DirectorTab } from "@/app/_components/director-tab";
import { getDirectorByUserId } from "@/app/_actions/get-director-by-user-id";
import { removeAllDirectorCourses } from "@/app/_actions/director/remove-all-director-courses";

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
  teacher?: {
    id: string;
    name: string;
    status: string;
  } | null;
};

type CurrentUserType = {
  id: string;
  roles: Role[];
} | null;

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [removeRoleConfirmOpen, setRemoveRoleConfirmOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<{
    userId: string;
    roleId: string;
    userName: string;
    roleName: string;
  } | null>(null);
  const [updatingRole, setUpdatingRole] = useState<{
    userId: string;
    roleId: string;
  } | null>(null);
  const [deleteRoleConfirmOpen, setDeleteRoleConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUserType>(null);
  const [removeAllRolesConfirmOpen, setRemoveAllRolesConfirmOpen] =
    useState(false);
  const [userToRemoveAllRoles, setUserToRemoveAllRoles] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUserData = await getUser();
        setCurrentUser({
          id: currentUserData.id,
          roles: currentUserData.roles || [],
        });

        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles(),
        ]);

        const formattedUsers: User[] = usersData!.map((user: any) => {
          const userRoles = Array.isArray(user.roles) ? user.roles : [];

          return {
            id: user.id,
            name: user.name || "Nome não informado",
            email: user.email,
            roles: userRoles,
            image: user.image,
            emailVerified: user.emailVerified,
            teacher: user.teacher || null,
          };
        });

        setUsers(formattedUsers);
        setRoles(rolesData);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    }

    fetchData();
  }, [refetchTrigger]);

  useEffect(() => {
    const handleUserRoleUpdated = (event: CustomEvent) => {
      const { userId } = event.detail;

      if (userId) {
        setRefetchTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener(
      "userRoleUpdated",
      handleUserRoleUpdated as EventListener
    );

    return () => {
      window.removeEventListener(
        "userRoleUpdated",
        handleUserRoleUpdated as EventListener
      );
    };
  }, []);

  const isAdmin = currentUser?.roles?.some(
    (role) => role.name === "ADMIN" || role.name === "DIRECAO"
  );

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

  const handleRoleToggle = async (userId: string, roleId: string) => {
    if (!isAdmin) {
      alert("Apenas administradores podem gerenciar acessos de usuários.");
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentRoles = user.roles.map((r) => r.id);
    const hasRole = currentRoles.includes(roleId);

    if (hasRole) {
      const roleToRemove = roles.find((r) => r.id === roleId);

      if (
        roleToRemove?.name === "PROFESSOR" &&
        user.teacher?.status === "ACTIVE"
      ) {
        alert(
          "Não é possível remover o acesso de professor enquanto o professor estiver com status ATIVO"
        );
        return;
      }
    }

    let newRoleIds: string[];

    if (hasRole) {
      newRoleIds = currentRoles.filter((id) => id !== roleId);
    } else {
      newRoleIds = [...currentRoles, roleId];
    }

    try {
      // Setar apenas a role específica como carregando
      setUpdatingRole({ userId, roleId });

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

      // Se está removendo a role DIRECAO, também remover todos os cursos vinculados
      const role = roles.find((r) => r.id === roleId);
      if (role?.name === "DIRECAO" && hasRole) {
        try {
          // Buscar o diretor associado ao usuário
          const director = await getDirectorByUserId(userId);

          if (director) {
            // Remover todas as associações de cursos
            await removeAllDirectorCourses(director.id);

            console.log(
              `Todos os cursos foram removidos do diretor ${user.name}`
            );
          }
        } catch (error) {
          console.error("Erro ao remover cursos do diretor:", error);
        }

        // Disparar evento para atualizar o director-tab
        window.dispatchEvent(
          new CustomEvent("userRoleUpdated", {
            detail: { userId },
          })
        );
      }

      // Se está adicionando a role DIRECAO, também disparar evento
      if (role?.name === "DIRECAO" && !hasRole) {
        window.dispatchEvent(
          new CustomEvent("userRoleUpdated", {
            detail: { userId },
          })
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar roles do usuário:", error);
      // Forçar refetch em caso de erro
      setRefetchTrigger((prev) => prev + 1);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRemoveAllRoles = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setUserToRemoveAllRoles({
      userId,
      userName: user.name || "Usuário",
    });
    setRemoveAllRolesConfirmOpen(true);
  };

  const confirmRemoveAllRoles = async () => {
    if (!userToRemoveAllRoles) return;

    const { userId } = userToRemoveAllRoles;
    const user = users.find((u) => u.id === userId);

    if (user?.teacher?.status === "ACTIVE") {
      alert("Não é possível remover todas as roles de um professor ativo");
      setRemoveAllRolesConfirmOpen(false);
      setUserToRemoveAllRoles(null);
      return;
    }

    try {
      setUpdatingRole({ userId, roleId: "all" });

      const updatedUser = await updateUserRole(userId, []);

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

      const hadDirecaoRole = user!.roles.some(
        (role) => role.name === "DIRECAO"
      );
      if (hadDirecaoRole) {
        window.dispatchEvent(
          new CustomEvent("userRoleUpdated", {
            detail: { userId },
          })
        );
      }
    } catch (error) {
      console.error("Erro ao remover todos os acessos do usuário:", error);
    } finally {
      setUpdatingRole(null);
      setRemoveAllRolesConfirmOpen(false);
      setUserToRemoveAllRoles(null);
    }
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    if (!isAdmin) {
      alert("Apenas administradores podem remover acessos de usuários.");
      return;
    }

    const user = users.find((u) => u.id === userId);
    const role = roles.find((r) => r.id === roleId);

    if (!user || !role) return;

    if (!canRemoveRole(userId, roleId)) {
      if (role.name === "PROFESSOR" && user.teacher?.status === "ACTIVE") {
        alert(
          "Não é possível remover o acesso de professor enquanto o professor estiver com status ATIVO"
        );
      }
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

    const roleToRemove = roles.find((r) => r.id === roleId);

    if (
      roleToRemove?.name === "PROFESSOR" &&
      user.teacher?.status === "ACTIVE"
    ) {
      return false;
    }

    return true;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "NO_ROLE"
        ? user.roles.length === 0
        : user.roles.some((role) => role.id === roleFilter));

    return matchesSearch && matchesRole;
  });

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
                  Painel Admin
                </h1>
              </div>
            </div>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <Users className="h-4" />
                Gerenciar Usuários
              </TabsTrigger>
              <TabsTrigger
                value="director"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4" />
                Gerenciar Diretores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Gerenciar Acessos do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mt-1">
                    <h4 className="text-sm font-medium mb-3">
                      Acessos do Sistema
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
                          </div>
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
                <CardContent className="p-3 sm:p-6 -mt-10">
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
                        <SelectItem value="ALL">Todas os Acessos</SelectItem>
                        <SelectItem value="NO_ROLE">Sem Acessos</SelectItem>
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
                            Acessos
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
                              <div>{user.name}</div>
                            </TableCell>
                            <TableCell className="text-card-foreground">
                              {user.email || "Email não informado"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.roles.length === 0 ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-muted-foreground"
                                  >
                                    Sem acesso
                                  </Badge>
                                ) : (
                                  user.roles.map((role) => (
                                    <div
                                      key={role.id}
                                      className="flex items-center"
                                    >
                                      <Badge
                                        variant={getRoleBadgeVariant(role.name)}
                                        className="text-xs pr-1"
                                        title={
                                          role.name === "PROFESSOR" &&
                                          user.teacher?.status === "ACTIVE"
                                            ? "Não é possível remover o acesso de professor enquanto o professor estiver ativo"
                                            : undefined
                                        }
                                      >
                                        {updatingRole?.userId === user.id &&
                                        updatingRole?.roleId === role.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <>
                                            {role.name}
                                            {canRemoveRole(
                                              user.id,
                                              role.id
                                            ) && (
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
                                                disabled={
                                                  updatingRole?.userId ===
                                                    user.id &&
                                                  updatingRole?.roleId ===
                                                    role.id
                                                }
                                              >
                                                <X className="h-2.5 w-2.5" />
                                              </button>
                                            )}
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  ))
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 ml-1 cursor-pointer"
                                      title="Adicionar acesso"
                                      disabled={
                                        updatingRole?.userId === user.id
                                      }
                                    >
                                      {updatingRole?.userId === user.id ? (
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
                                        disabled={
                                          updatingRole?.userId === user.id &&
                                          updatingRole?.roleId === role.id
                                        }
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
                              {user.roles.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAllRoles(user.id)}
                                  disabled={
                                    updatingRole?.userId === user.id ||
                                    user.teacher?.status === "ACTIVE"
                                  }
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                                  title={
                                    user.teacher?.status === "ACTIVE"
                                      ? "Não é possível remover todos os acessos de um professor ativo"
                                      : "Remover todas os acessos"
                                  }
                                >
                                  {updatingRole?.userId === user.id &&
                                  updatingRole?.roleId === "all" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserX className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

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
                                {user.teacher && (
                                  <Badge
                                    variant={
                                      user.teacher.status === "ACTIVE"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="mt-1 text-xs"
                                  >
                                    {user.teacher.status === "ACTIVE"
                                      ? "Professor Ativo"
                                      : "Professor Inativo"}
                                  </Badge>
                                )}
                              </div>
                              {user.roles.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAllRoles(user.id)}
                                  disabled={
                                    updatingRole?.userId === user.id ||
                                    user.teacher?.status === "ACTIVE"
                                  }
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                                  title={
                                    user.teacher?.status === "ACTIVE"
                                      ? "Não é possível remover todos os acessos de um professor ativo"
                                      : "Remover todos os acessos"
                                  }
                                >
                                  {updatingRole?.userId === user.id &&
                                  updatingRole?.roleId === "all" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserX className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Acessos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {user.roles.length === 0 ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-muted-foreground"
                                  >
                                    Sem acesso
                                  </Badge>
                                ) : (
                                  user.roles.map((role) => (
                                    <div
                                      key={role.id}
                                      className="flex items-center"
                                    >
                                      <Badge
                                        variant={getRoleBadgeVariant(role.name)}
                                        className="text-xs pr-1"
                                        title={
                                          role.name === "PROFESSOR" &&
                                          user.teacher?.status === "ACTIVE"
                                            ? "Não é possível remover o acesso de professor enquanto o professor estiver ativo"
                                            : undefined
                                        }
                                      >
                                        {updatingRole?.userId === user.id &&
                                        updatingRole?.roleId === role.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <>
                                            {role.name}
                                            {canRemoveRole(
                                              user.id,
                                              role.id
                                            ) && (
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
                                                disabled={
                                                  updatingRole?.userId ===
                                                    user.id &&
                                                  updatingRole?.roleId ===
                                                    role.id
                                                }
                                              >
                                                <X className="h-2.5 w-2.5" />
                                              </button>
                                            )}
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  ))
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-transparent"
                                      title="Adicionar acesso"
                                      disabled={
                                        updatingRole?.userId === user.id
                                      }
                                    >
                                      {updatingRole?.userId === user.id ? (
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
                                        disabled={
                                          updatingRole?.userId === user.id &&
                                          updatingRole?.roleId === role.id
                                        }
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
                open={removeRoleConfirmOpen}
                onOpenChange={setRemoveRoleConfirmOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirmar Remoção de Acesso</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover o acesso{" "}
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
                      disabled={
                        updatingRole?.userId === roleToRemove?.userId &&
                        updatingRole?.roleId === roleToRemove?.roleId
                      }
                    >
                      {updatingRole?.userId === roleToRemove?.userId &&
                      updatingRole?.roleId === roleToRemove?.roleId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sim, Remover"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={removeAllRolesConfirmOpen}
                onOpenChange={setRemoveAllRolesConfirmOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Confirmar Remoção de Todas os Acessos
                    </DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover{" "}
                      <strong>todos os acessos</strong> do usuário{" "}
                      <strong>{userToRemoveAllRoles?.userName}</strong>?
                      <br />
                      <span className="text-destructive">
                        O usuário ficará sem nenhum perfil no sistema.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setRemoveAllRolesConfirmOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmRemoveAllRoles}
                      disabled={
                        updatingRole?.userId === userToRemoveAllRoles?.userId &&
                        updatingRole?.roleId === "all"
                      }
                    >
                      {updatingRole?.userId === userToRemoveAllRoles?.userId &&
                      updatingRole?.roleId === "all" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sim, Remover Todas"
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
                    <DialogTitle>Confirmar Exclusão de Acesso</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir o acesso{" "}
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

            <TabsContent value="director" className="space-y-6">
              <DirectorTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
