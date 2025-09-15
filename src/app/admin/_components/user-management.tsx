// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Power,
//   PowerOff,
//   Filter,
// } from "lucide-react";

// export function UserManagement() {
//   const { users, loading, toggleUserStatus, deleteUser } = useUsers();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "active" | "inactive"
//   >("all");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);

//   // Filter users based on search term, role, and status
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter === "all" || user.role === roleFilter;
//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active" && user.isActive) ||
//       (statusFilter === "inactive" && !user.isActive);

//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const handleToggleStatus = async (user: User) => {
//     try {
//       await toggleUserStatus(user.id);
//     } catch (error) {
//       console.error("Erro ao alterar status do usuário:", error);
//     }
//   };

//   const handleDeleteUser = async () => {
//     if (!userToDelete) return;

//     try {
//       await deleteUser(userToDelete.id);
//       setShowDeleteDialog(false);
//       setUserToDelete(null);
//     } catch (error) {
//       console.error("Erro ao excluir usuário:", error);
//     }
//   };

//   const getRoleBadgeVariant = (role: UserRole) => {
//     switch (role) {
//       case "admin":
//         return "destructive";
//       case "direcao":
//         return "default";
//       case "professor":
//         return "secondary";
//       case "secretaria":
//         return "outline";
//       default:
//         return "outline";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex flex-col sm:flex-row gap-4 flex-1">
//           {/* Search */}
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Buscar usuários..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2 bg-transparent"
//                 >
//                   <Filter className="h-4 w-4" />
//                   Perfil:{" "}
//                   {roleFilter === "all" ? "Todos" : ROLE_LABELS[roleFilter]}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuLabel>Filtrar por perfil</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => setRoleFilter("all")}>
//                   Todos os perfis
//                 </DropdownMenuItem>
//                 {Object.entries(ROLE_LABELS).map(([role, label]) => (
//                   <DropdownMenuItem
//                     key={role}
//                     onClick={() => setRoleFilter(role as UserRole)}
//                   >
//                     {label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2 bg-transparent"
//                 >
//                   <Filter className="h-4 w-4" />
//                   Status:{" "}
//                   {statusFilter === "all"
//                     ? "Todos"
//                     : statusFilter === "active"
//                       ? "Ativos"
//                       : "Inativos"}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => setStatusFilter("all")}>
//                   Todos
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setStatusFilter("active")}>
//                   Ativos
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
//                   Inativos
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {/* Add User Button */}
//         <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//           <DialogTrigger asChild>
//             <Button className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               Adicionar Usuário
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Adicionar Novo Usuário</DialogTitle>
//               <DialogDescription>
//                 Preencha os dados do novo usuário. Campos marcados com * são
//                 obrigatórios.
//               </DialogDescription>
//             </DialogHeader>
//             <UserForm
//               onSuccess={() => setShowAddDialog(false)}
//               onCancel={() => setShowAddDialog(false)}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Results count */}
//       <div className="text-sm text-muted-foreground">
//         Mostrando {filteredUsers.length} de {users.length} usuários
//       </div>

//       {/* Users Table */}
//       <div className="border border-border rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Nome</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Perfil</TableHead>
//               <TableHead>Curso</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Criado em</TableHead>
//               <TableHead className="w-[70px]">Ações</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className="text-center py-8 text-muted-foreground"
//                 >
//                   Nenhum usuário encontrado
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredUsers.map((user) => {
//                 const course = user.courseId
//                   ? getCourseById(user.courseId)
//                   : null;

//                 return (
//                   <TableRow key={user.id}>
//                     <TableCell className="font-medium">{user.name}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>
//                       <Badge variant={getRoleBadgeVariant(user.role)}>
//                         {ROLE_LABELS[user.role]}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{course ? course.name : "-"}</TableCell>
//                     <TableCell>
//                       <Badge variant={user.isActive ? "default" : "secondary"}>
//                         {user.isActive ? "Ativo" : "Inativo"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {user.createdAt.toLocaleDateString("pt-BR")}
//                     </TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Ações</DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setShowEditDialog(true);
//                             }}
//                           >
//                             <Edit className="h-4 w-4 mr-2" />
//                             Editar
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleToggleStatus(user)}
//                             disabled={loading}
//                           >
//                             {user.isActive ? (
//                               <>
//                                 <PowerOff className="h-4 w-4 mr-2" />
//                                 Desativar
//                               </>
//                             ) : (
//                               <>
//                                 <Power className="h-4 w-4 mr-2" />
//                                 Ativar
//                               </>
//                             )}
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setUserToDelete(user);
//                               setShowDeleteDialog(true);
//                             }}
//                             className="text-destructive"
//                           >
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Excluir
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Edit User Dialog */}
//       <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Editar Usuário</DialogTitle>
//             <DialogDescription>
//               Altere os dados do usuário. Campos marcados com * são
//               obrigatórios.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedUser && (
//             <UserForm
//               user={selectedUser}
//               onSuccess={() => {
//                 setShowEditDialog(false);
//                 setSelectedUser(null);
//               }}
//               onCancel={() => {
//                 setShowEditDialog(false);
//                 setSelectedUser(null);
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
//             <AlertDialogDescription>
//               Tem certeza que deseja excluir o usuário{" "}
//               <strong>{userToDelete?.name}</strong>? Esta ação não pode ser
//               desfeita.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => {
//                 setShowDeleteDialog(false);
//                 setUserToDelete(null);
//               }}
//             >
//               Cancelar
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteUser}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               disabled={loading}
//             >
//               Excluir
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
