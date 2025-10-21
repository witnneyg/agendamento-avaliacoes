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
  Trash2,
  Users,
  Check,
  X,
  Settings,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileManagement from "./permissions";
import { NavBar } from "@/app/_components/navbar";
import { getUsers } from "@/app/_actions/get-users";

// Baseado no seu schema, o Role padrão é USER, não USUARIO_PADRAO
type Role = "DIRECAO" | "PROFESSOR" | "SECRETARIA" | "USER" | "ADMIN";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  roles: Role[];
  image?: string | null;
  emailVerified?: Date | null;
};

const roleLabels: Record<Role, string> = {
  DIRECAO: "Direção",
  PROFESSOR: "Professor",
  SECRETARIA: "Secretaria",
  USER: "Usuário", // Alterado de USUARIO_PADRAO para USER
  ADMIN: "Admin",
};

const getAccessBadgeVariant = (access: Role) => {
  switch (access) {
    case "DIRECAO":
      return "destructive";
    case "PROFESSOR":
      return "default";
    case "SECRETARIA":
      return "secondary";
    case "USER":
      return "outline";
    case "ADMIN":
      return "destructive";
    default:
      return "outline";
  }
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState<Role | "ALL">("ALL");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [removeAccessConfirmOpen, setRemoveAccessConfirmOpen] = useState(false);
  const [accessToRemove, setAccessToRemove] = useState<{
    userId: string;
    accessLevel: Role;
    userName: string;
  } | null>(null);

  // Buscar usuários do banco de dados
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const usersData = await getUsers();

        // Converter os dados do banco para o formato esperado pelo componente
        const formattedUsers: User[] = usersData.map((user) => ({
          id: user.id,
          name: user.name || "Nome não informado",
          email: user.email,
          roles: (user.roles || ["USER"]) as Role[], // Default para ["USER"] conforme schema
          image: user.image,
          emailVerified: user.emailVerified,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError("Erro ao carregar usuários. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDeleteClick = (user: User) => {
    // Verificar se é o único admin
    const adminCount = users.filter((u) => u.roles.includes("ADMIN")).length;
    if (user.roles.includes("ADMIN") && adminCount <= 1) {
      return;
    }

    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleAccessToggle = (userId: string, accessLevel: Role) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentAccess = [...user.roles];
    const hasAccess = currentAccess.includes(accessLevel);

    if (hasAccess) {
      if (accessLevel === "ADMIN") {
        const adminCount = users.filter((u) =>
          u.roles.includes("ADMIN")
        ).length;
        if (adminCount <= 1) return;
      }

      const newAccess = currentAccess.filter((level) => level !== accessLevel);
      if (newAccess.length === 0) {
        // Se remover todas as roles, manter pelo menos USER (default do schema)
        newAccess.push("USER");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, roles: newAccess } : u))
      );
    } else {
      const newAccess = [...currentAccess, accessLevel];
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, roles: newAccess } : u))
      );
    }
  };

  const handleRemoveAccess = (userId: string, accessLevel: Role) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (accessLevel === "ADMIN") {
      const adminCount = users.filter((u) => u.roles.includes("ADMIN")).length;
      if (adminCount <= 1) return;
    }

    const newAccess = user.roles.filter((level) => level !== accessLevel);
    if (newAccess.length === 0) {
      // Garantir que sempre tenha pelo menos USER role
      newAccess.push("USER");
    }

    setAccessToRemove({
      userId,
      accessLevel,
      userName: user.name || "Usuário",
    });
    setRemoveAccessConfirmOpen(true);
  };

  const confirmRemoveAccess = () => {
    if (!accessToRemove) return;

    const { userId, accessLevel } = accessToRemove;
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newAccess = user.roles.filter((level) => level !== accessLevel);
    if (newAccess.length === 0) {
      newAccess.push("USER");
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, roles: newAccess } : u))
    );

    setAccessToRemove(null);
    setRemoveAccessConfirmOpen(false);
  };

  const cancelRemoveAccess = () => {
    setAccessToRemove(null);
    setRemoveAccessConfirmOpen(false);
  };

  const canRemoveAccess = (userId: string, accessLevel: Role) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    if (accessLevel === "ADMIN") {
      const adminCount = users.filter((u) => u.roles.includes("ADMIN")).length;
      if (adminCount <= 1) return false;
    }

    // Não permitir remover se for a única role (sempre deve ter pelo menos USER)
    if (user.roles.length <= 1 && user.roles[0] === accessLevel) return false;

    return true;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccess =
      accessFilter === "ALL" || user.roles.includes(accessFilter);
    return matchesSearch && matchesAccess;
  });

  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
    setDeleteConfirmOpen(false);
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
                <p className="text-muted-foreground">Carregando usuários...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-background p-3 sm:p-6">
          <div className="container mx-auto space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <X className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Erro ao carregar usuários
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
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
        <div className="container mx-auto space-y-4 sm:space-y-6 ">
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
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4" />
                Gerenciar Usuários
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="flex items-center gap-2"
              >
                <Settings className="h-4" />
                Gerenciar Permissões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
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
                    <Select
                      value={accessFilter}
                      onValueChange={(value: Role | "ALL") =>
                        setAccessFilter(value)
                      }
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Filtrar por acesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        {(
                          [
                            "DIRECAO",
                            "PROFESSOR",
                            "SECRETARIA",
                            "USER", // Alterado de USUARIO_PADRAO para USER
                            "ADMIN",
                          ] as Role[]
                        ).map((r) => (
                          <SelectItem key={r} value={r}>
                            {roleLabels[r]}
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
                            Níveis de Acesso
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
                                {user.roles.map((access) => (
                                  <div
                                    key={access}
                                    className="flex items-center"
                                  >
                                    <Badge
                                      variant={getAccessBadgeVariant(access)}
                                      className="text-xs pr-1"
                                    >
                                      {roleLabels[access]}
                                      {canRemoveAccess(user.id, access) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAccess(user.id, access);
                                          }}
                                          className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                          title={`Remover acesso ${roleLabels[access]}`}
                                        >
                                          <X className="h-2.5 w-2.5" />
                                        </button>
                                      )}
                                    </Badge>
                                  </div>
                                ))}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 ml-1"
                                      title="Adicionar nível de acesso"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {(
                                      [
                                        "DIRECAO",
                                        "PROFESSOR",
                                        "SECRETARIA",
                                        "USER", // Alterado de USUARIO_PADRAO para USER
                                        "ADMIN",
                                      ] as Role[]
                                    ).map((level) => (
                                      <DropdownMenuItem
                                        key={level}
                                        onClick={() =>
                                          handleAccessToggle(user.id, level)
                                        }
                                        className="flex items-center justify-between"
                                      >
                                        <span>{roleLabels[level]}</span>
                                        {user.roles.includes(level) && (
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
                                onClick={() => handleDeleteClick(user)}
                                disabled={
                                  user.roles.includes("ADMIN") &&
                                  users.filter((u) => u.roles.includes("ADMIN"))
                                    .length <= 1
                                }
                                className={`h-8 w-8 p-0 cursor-pointer ${
                                  user.roles.includes("ADMIN") &&
                                  users.filter((u) => u.roles.includes("ADMIN"))
                                    .length <= 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-destructive/10 hover:text-destructive"
                                }`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(user)}
                                disabled={
                                  user.roles.includes("ADMIN") &&
                                  users.filter((u) => u.roles.includes("ADMIN"))
                                    .length <= 1
                                }
                                className={`h-8 w-8 p-0 ml-2 ${
                                  user.roles.includes("ADMIN") &&
                                  users.filter((u) => u.roles.includes("ADMIN"))
                                    .length <= 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-destructive/10 hover:text-destructive"
                                }`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Níveis de Acesso
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {user.roles.map((access) => (
                                  <div
                                    key={access}
                                    className="flex items-center"
                                  >
                                    <Badge
                                      variant={getAccessBadgeVariant(access)}
                                      className="text-xs pr-1"
                                    >
                                      {roleLabels[access]}
                                      {canRemoveAccess(user.id, access) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAccess(user.id, access);
                                          }}
                                          className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                          title={`Remover acesso ${roleLabels[access]}`}
                                        >
                                          <X className="h-2.5 w-2.5" />
                                        </button>
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
                                      title="Adicionar nível de acesso"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Adicionar
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {(
                                      [
                                        "DIRECAO",
                                        "PROFESSOR",
                                        "SECRETARIA",
                                        "USER", // Alterado de USUARIO_PADRAO para USER
                                        "ADMIN",
                                      ] as Role[]
                                    ).map((level) => (
                                      <DropdownMenuItem
                                        key={level}
                                        onClick={() =>
                                          handleAccessToggle(user.id, level)
                                        }
                                        className="flex items-center justify-between"
                                      >
                                        <span>{roleLabels[level]}</span>
                                        {user.roles.includes(level) && (
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
                <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)]">
                  <DialogHeader>
                    <DialogTitle className="text-left">
                      Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Tem certeza que deseja excluir o usuário{" "}
                      <strong>{userToDelete?.name}</strong>? Esta ação não pode
                      ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={cancelDelete}
                      className="w-full sm:w-auto bg-transparent cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDelete}
                      className="w-full sm:w-auto cursor-pointer"
                    >
                      Sim, Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={removeAccessConfirmOpen}
                onOpenChange={setRemoveAccessConfirmOpen}
              >
                <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)]">
                  <DialogHeader>
                    <DialogTitle className="text-left">
                      Confirmar Remoção de Acesso
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Tem certeza que deseja remover o nível de acesso{" "}
                      <strong>
                        {accessToRemove
                          ? roleLabels[accessToRemove.accessLevel]
                          : ""}
                      </strong>{" "}
                      do usuário <strong>{accessToRemove?.userName}</strong>?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={cancelRemoveAccess}
                      className="w-full sm:w-auto bg-transparent"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmRemoveAccess}
                      className="w-full sm:w-auto"
                    >
                      Sim, Remover
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <ProfileManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
