"use client";

import { useEffect, useState } from "react";
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
  UserPlus,
  Settings,
  BarChart3,
} from "lucide-react";
import { NavBar } from "@/app/_components/navbar";
import { getUsers } from "@/app/_actions/get-users";
import { Role, User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionsPage from "./permissions";

// Labels em português
const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  TEACHER: "Professor",
  USER: "Usuário",
};

const getAccessBadgeVariant = (access: Role) => {
  switch (access) {
    case "ADMIN":
      return "destructive";
    case "TEACHER":
      return "outline";
    case "USER":
      return "secondary";
    default:
      return "outline";
  }
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState<Role | "ALL">("ALL");
  const [users, setUsers] = useState<User[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [removeAccessConfirmOpen, setRemoveAccessConfirmOpen] = useState(false);
  const [accessToRemove, setAccessToRemove] = useState<{
    userId: string;
    accessLevel: Role;
    userName: string;
  } | null>(null);
  const currentUserId = "1";

  useEffect(() => {
    const fetch = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetch();
  }, []);

  const handleDeleteClick = (user: User) => {
    if (user.id === currentUserId && user.roles.includes("ADMIN")) {
      return;
    }

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
      if (newAccess.length === 0) return;

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
    if (newAccess.length === 0) return;

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

    if (user.roles.length <= 1) return false;

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

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-background p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
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
                  Gerencie usuários e seus níveis de acesso
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full  grid-cols-2">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 " />
                Gerenciar Usuários
              </TabsTrigger>
              <TabsTrigger value="add-user" className="flex items-center gap-2">
                <UserPlus className="h-4" />
                Gerenciar Permissões
              </TabsTrigger>
            </TabsList>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Total de Usuários
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        {users.length}
                      </p>
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary self-end sm:self-auto" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Professores
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        {
                          users.filter((u) => u.roles.includes("TEACHER"))
                            .length
                        }
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs self-end sm:self-auto"
                    >
                      Professor
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Admins
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        {users.filter((u) => u.roles.includes("ADMIN")).length}
                      </p>
                    </div>
                    <Badge
                      variant="destructive"
                      className="text-xs self-end sm:self-auto"
                    >
                      Admin
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Usuários
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        {users.filter((u) => u.roles.includes("USER")).length}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs self-end sm:self-auto"
                    >
                      Usuário
                    </Badge>
                  </div>
                </CardContent>
              </Card> */}
            </div>
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
                        {Object.values(Role).map((r) => (
                          <SelectItem key={r} value={r}>
                            {roleLabels[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Users Table */}
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
                              {user.email}
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
                                    {(Object.values(Role) as Role[]).map(
                                      (level) => (
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
                                      )
                                    )}
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
                                  (user.id === currentUserId &&
                                    user.roles.includes("ADMIN")) ||
                                  (user.roles.includes("ADMIN") &&
                                    users.filter((u) =>
                                      u.roles.includes("ADMIN")
                                    ).length <= 1)
                                }
                                className={`h-8 w-8 p-0 cursor-pointer ${
                                  (user.id === currentUserId &&
                                    user.roles.includes("ADMIN")) ||
                                  (user.roles.includes("ADMIN") &&
                                    users.filter((u) =>
                                      u.roles.includes("ADMIN")
                                    ).length <= 1)
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

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum usuário encontrado com os filtros aplicados.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dialogs */}
              <Dialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
              >
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir o usuário{" "}
                      <strong>{userToDelete?.name}</strong>? Esta ação não pode
                      ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={cancelDelete}
                      className="w-full sm:w-auto bg-transparent cursor-pointer"
                    >
                      Não
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
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Confirmar Remoção de Acesso</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover o nível de acesso{" "}
                      <strong>
                        {accessToRemove
                          ? roleLabels[accessToRemove.accessLevel]
                          : ""}
                      </strong>{" "}
                      do usuário <strong>{accessToRemove?.userName}</strong>?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
            <TabsContent value="add-user" className="space-y-6">
              <PermissionsPage />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                d
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Relatórios Disponíveis
                  </h3>
                  <p className="text-muted-foreground">
                    Esta seção pode ser expandida com gráficos e relatórios
                    detalhados sobre o uso do sistema.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Stats Cards */}
        </div>
      </div>
    </>
  );
}
