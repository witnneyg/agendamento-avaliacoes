"use client";

import { useState } from "react";
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
import { Search, Plus, Trash2, Users, Check, X } from "lucide-react";
import { NavBar } from "@/app/_components/navbar";

const mockUsers = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana.silva@escola.com",
    access: ["Admin"],
  },
  {
    id: 2,
    name: "Carlos Santos",
    email: "carlos.santos@escola.com",
    access: ["Professor"],
  },
  {
    id: 3,
    name: "Maria Oliveira",
    email: "maria.oliveira@escola.com",
    access: ["Secretaria"],
  },
  {
    id: 4,
    name: "João Costa",
    email: "joao.costa@escola.com",
    access: ["Professor", "Direção"],
  },
  {
    id: 5,
    name: "Fernanda Lima",
    email: "fernanda.lima@escola.com",
    access: ["Direção"],
  },
  {
    id: 6,
    name: "Pedro Almeida",
    email: "pedro.almeida@escola.com",
    access: ["Professor"],
  },
  {
    id: 7,
    name: "Lucia Ferreira",
    email: "lucia.ferreira@escola.com",
    access: ["Secretaria", "Professor"],
  },
  {
    id: 8,
    name: "Roberto Souza",
    email: "roberto.souza@escola.com",
    access: ["Direção", "Admin"],
  },
];

type AccessLevel = "Admin" | "Professor" | "Direção" | "Secretaria" | "Todos";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessLevel>("Todos");
  const [users, setUsers] = useState(mockUsers);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [removeAccessConfirmOpen, setRemoveAccessConfirmOpen] = useState(false);
  const [accessToRemove, setAccessToRemove] = useState<{
    userId: number;
    accessLevel: string;
    userName: string;
  } | null>(null);
  const currentUserId = 1;

  const handleDeleteClick = (user: {
    id: number;
    name: string;
    access: string[];
  }) => {
    // Impede que admin se exclua
    if (user.id === currentUserId && user.access.includes("Admin")) {
      return;
    }

    const adminCount = users.filter((u) => u.access.includes("Admin")).length;
    if (user.access.includes("Admin") && adminCount <= 1) {
      return;
    }

    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleAccessToggle = (userId: number, accessLevel: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentAccess = [...user.access];
    const hasAccess = currentAccess.includes(accessLevel);

    if (hasAccess) {
      // Removendo acesso
      if (accessLevel === "Admin") {
        const adminCount = users.filter((u) =>
          u.access.includes("Admin")
        ).length;
        if (adminCount <= 1) {
          return; // Não permite remover o último admin
        }
      }
      const newAccess = currentAccess.filter((level) => level !== accessLevel);
      if (newAccess.length === 0) return; // Não permite usuário sem nenhum acesso

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, access: newAccess } : u
        )
      );
    } else {
      // Adicionando acesso
      const newAccess = [...currentAccess, accessLevel];
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, access: newAccess } : u
        )
      );
    }
  };

  const handleRemoveAccess = (userId: number, accessLevel: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Validações antes de remover
    if (accessLevel === "Admin") {
      const adminCount = users.filter((u) => u.access.includes("Admin")).length;
      if (adminCount <= 1) {
        return; // Não permite remover o último admin
      }
    }

    const newAccess = user.access.filter((level) => level !== accessLevel);
    if (newAccess.length === 0) return; // Não permite usuário sem nenhum acesso

    // Mostrar modal de confirmação
    setAccessToRemove({ userId, accessLevel, userName: user.name });
    setRemoveAccessConfirmOpen(true);
  };

  const confirmRemoveAccess = () => {
    if (!accessToRemove) return;

    const { userId, accessLevel } = accessToRemove;
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newAccess = user.access.filter((level) => level !== accessLevel);
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, access: newAccess } : u))
    );

    setAccessToRemove(null);
    setRemoveAccessConfirmOpen(false);
  };

  const cancelRemoveAccess = () => {
    setAccessToRemove(null);
    setRemoveAccessConfirmOpen(false);
  };

  const canRemoveAccess = (userId: number, accessLevel: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    // Não pode remover se for o último admin
    if (accessLevel === "Admin") {
      const adminCount = users.filter((u) => u.access.includes("Admin")).length;
      if (adminCount <= 1) return false;
    }

    // Não pode remover se for o último acesso do usuário
    if (user.access.length <= 1) return false;

    return true;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccess =
      accessFilter === "Todos" || user.access.includes(accessFilter);
    return matchesSearch && matchesAccess;
  });

  const getAccessBadgeVariant = (access: string) => {
    switch (access) {
      case "Admin":
        return "destructive";
      case "Direção":
        return "default";
      case "Secretaria":
        return "secondary";
      case "Professor":
        return "outline";
      default:
        return "outline";
    }
  };

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
          {/* Header */}
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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
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
                        users.filter((u) => u.access.includes("Professor"))
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
                      Direção
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {users.filter((u) => u.access.includes("Direção")).length}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="text-xs self-end sm:self-auto"
                  >
                    Direção
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Secretaria
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {
                        users.filter((u) => u.access.includes("Secretaria"))
                          .length
                      }
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs self-end sm:self-auto"
                  >
                    Secretaria
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
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
                  onValueChange={(value: AccessLevel) => setAccessFilter(value)}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Filtrar por acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os acessos</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Direção">Direção</SelectItem>
                    <SelectItem value="Secretaria">Secretaria</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table - Desktop */}
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
                            {user.access.map((access) => (
                              <div key={access} className="flex items-center">
                                <Badge
                                  variant={getAccessBadgeVariant(access)}
                                  className="text-xs pr-1"
                                >
                                  {access}
                                  {canRemoveAccess(user.id, access) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAccess(user.id, access);
                                      }}
                                      className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                      title={`Remover acesso ${access}`}
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
                                {[
                                  "Admin",
                                  "Direção",
                                  "Secretaria",
                                  "Professor",
                                ].map((level) => (
                                  <DropdownMenuItem
                                    key={level}
                                    onClick={() =>
                                      handleAccessToggle(user.id, level)
                                    }
                                    className="flex items-center justify-between"
                                  >
                                    <span>{level}</span>
                                    {user.access.includes(level) ? (
                                      <div className="flex items-center gap-1">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-xs text-muted-foreground">
                                          (clique para remover)
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        (clique para adicionar)
                                      </span>
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
                              (user.id === currentUserId &&
                                user.access.includes("Admin")) ||
                              (user.access.includes("Admin") &&
                                users.filter((u) => u.access.includes("Admin"))
                                  .length <= 1)
                            }
                            className={`h-8 w-8 p-0 ${
                              (user.id === currentUserId &&
                                user.access.includes("Admin")) ||
                              (user.access.includes("Admin") &&
                                users.filter((u) => u.access.includes("Admin"))
                                  .length <= 1)
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

              {/* Users Cards - Mobile */}
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
                              {user.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            disabled={
                              (user.id === currentUserId &&
                                user.access.includes("Admin")) ||
                              (user.access.includes("Admin") &&
                                users.filter((u) => u.access.includes("Admin"))
                                  .length <= 1)
                            }
                            className={`h-8 w-8 p-0 ml-2 ${
                              (user.id === currentUserId &&
                                user.access.includes("Admin")) ||
                              (user.access.includes("Admin") &&
                                users.filter((u) => u.access.includes("Admin"))
                                  .length <= 1)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-destructive/10 hover:text-destructive"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-muted-foreground">
                            Níveis de Acesso:
                          </span>
                          <div className="flex flex-wrap gap-1 items-center">
                            {user.access.map((access) => (
                              <div key={access} className="flex items-center">
                                <Badge
                                  variant={getAccessBadgeVariant(access)}
                                  className="text-xs pr-1"
                                >
                                  {access}
                                  {canRemoveAccess(user.id, access) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAccess(user.id, access);
                                      }}
                                      className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                      title={`Remover acesso ${access}`}
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
                                  className="h-6 w-6 p-0"
                                  title="Adicionar nível de acesso"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {[
                                  "Admin",
                                  "Direção",
                                  "Secretaria",
                                  "Professor",
                                ].map((level) => (
                                  <DropdownMenuItem
                                    key={level}
                                    onClick={() =>
                                      handleAccessToggle(user.id, level)
                                    }
                                    className="flex items-center justify-between"
                                  >
                                    <span>{level}</span>
                                    {user.access.includes(level) ? (
                                      <div className="flex items-center gap-1">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-xs text-muted-foreground">
                                          (remover)
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        (adicionar)
                                      </span>
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
                    Nenhum usuário encontrado com os filtros aplicados.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o usuário{" "}
                  <strong>{userToDelete?.name}</strong>? Esta ação não pode ser
                  desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Não
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="w-full sm:w-auto"
                >
                  Sim, Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de confirmação para remoção de nível de acesso */}
          <Dialog
            open={removeAccessConfirmOpen}
            onOpenChange={setRemoveAccessConfirmOpen}
          >
            <DialogContent className="sm:max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Confirmar Remoção de Acesso</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover o nível de acesso{" "}
                  <strong>{accessToRemove?.accessLevel}</strong> do usuário{" "}
                  <strong>{accessToRemove?.userName}</strong>?
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
        </div>
      </div>
    </>
  );
}
