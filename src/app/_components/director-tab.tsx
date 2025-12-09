"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Loader2,
  Search,
  X,
  User,
  Shield,
  School,
  Trash2,
  AlertCircle,
} from "lucide-react";

import type { Course, Director, Prisma } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCourses } from "../_actions/coursers/get-coursers";
import { getUsersWithDirectorRole } from "../_actions/director/get-users-with-director-role";
import { getDirectorCourses } from "../_actions/director/get-director-courses";
import { getOrCreateDirector } from "../_actions/director/get-or-create-director";
import { assignDirectorToCourses } from "../_actions/director/assignment-diretor-to-coursers";
import { removeDirectorFromCourses } from "../_actions/director/remove-director-from-coursers";

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true };
}>;

type DirectorWithCourses = Director & {
  courses: Course[];
};

type UserWithRolesAndDirector = UserWithRoles & {
  director?: DirectorWithCourses | null;
};

const directorSchema = z.object({
  userId: z.string().min(1, "Selecione um diretor"),
  courseIds: z.array(z.string()),
});

type DirectorForm = z.infer<typeof directorSchema>;

export function DirectorTab() {
  const [users, setUsers] = useState<UserWithRolesAndDirector[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] =
    useState<UserWithRolesAndDirector | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [directorSearchTerm, setDirectorSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [userCourses, setUserCourses] = useState<Record<string, Course[]>>({});
  const [selectedCoursesToRemove, setSelectedCoursesToRemove] = useState<
    string[]
  >([]);

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DirectorForm>({
    resolver: zodResolver(directorSchema),
    defaultValues: {
      userId: "",
      courseIds: [],
    },
  });

  const selectedCourseIds = watch("courseIds");
  const selectedUserId = watch("userId");

  const clearForm = () => {
    reset({
      userId: "",
      courseIds: [],
    });
    setEditingUser(null);
    setCourseSearchTerm("");
    setUserSearchTerm("");
    setSelectedCoursesToRemove([]);
  };

  const clearDirectorSearch = () => setDirectorSearchTerm("");
  const clearCourseSearch = () => setCourseSearchTerm("");
  const clearUserSearch = () => setUserSearchTerm("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const usersData = await getUsersWithDirectorRole();
        setUsers(usersData as UserWithRolesAndDirector[]);

        const coursesData = await getCourses();
        setCourses(coursesData.sort((a, b) => a.name.localeCompare(b.name)));

        const coursesByUser: Record<string, Course[]> = {};
        for (const user of usersData) {
          const directorCoursesData = await getDirectorCourses(user.id);
          coursesByUser[user.id] = directorCoursesData;
        }
        setUserCourses(coursesByUser);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUserId && userCourses[selectedUserId]) {
      const currentCourses = userCourses[selectedUserId].map((c) => c.id);
      setValue("courseIds", currentCourses);
      setSelectedCoursesToRemove([]);
    }
  }, [selectedUserId, userCourses, setValue]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(directorSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(directorSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredUsersForDialog = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (user: UserWithRolesAndDirector) => {
    setEditingUser(user);
    const currentCourseIds =
      userCourses[user.id]?.map((course) => course.id) || [];
    reset({
      userId: user.id,
      courseIds: currentCourseIds,
    });
    setSelectedCoursesToRemove([]);
    setIsDialogOpen(true);
  };

  const handleCourseSelect = (course: Course) => {
    const currentCourseIds = watch("courseIds");
    if (currentCourseIds.includes(course.id)) {
      if (
        editingUser &&
        userCourses[editingUser.id]?.some((c) => c.id === course.id)
      ) {
        setSelectedCoursesToRemove((prev) =>
          prev.includes(course.id)
            ? prev.filter((id) => id !== course.id)
            : [...prev, course.id]
        );
      }
      setValue(
        "courseIds",
        currentCourseIds.filter((id) => id !== course.id)
      );
    } else {
      setSelectedCoursesToRemove((prev) =>
        prev.filter((id) => id !== course.id)
      );
      setValue("courseIds", [...currentCourseIds, course.id]);
    }
  };

  const handleUserSelect = (userId: string) => {
    if (selectedUserId === userId) {
      setValue("userId", "");
    } else {
      setValue("userId", userId, { shouldValidate: true });
    }
    setUserSearchTerm("");
  };

  const isCourseAlreadyLinked = (courseId: string) => {
    if (!editingUser) return false;
    return userCourses[editingUser.id]?.some((c) => c.id === courseId) || false;
  };

  const isCourseMarkedForRemoval = (courseId: string) => {
    return selectedCoursesToRemove.includes(courseId);
  };
  const onSubmit = async (data: DirectorForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedUser = users.find((user) => user.id === data.userId);
      if (!selectedUser) {
        return;
      }

      const director = await getOrCreateDirector(selectedUser.id);
      if (!director) {
        return;
      }

      const currentLinkedCourseIds =
        userCourses[selectedUser.id]?.map((c) => c.id) || [];

      const coursesToAdd = data.courseIds.filter(
        (courseId) => !currentLinkedCourseIds.includes(courseId)
      );

      const coursesToRemove = selectedCoursesToRemove.filter((courseId) =>
        currentLinkedCourseIds.includes(courseId)
      );

      if (coursesToAdd.length > 0) {
        const addResult = await assignDirectorToCourses({
          directorId: director.id,
          courseIds: coursesToAdd,
        });

        if (!addResult.success) {
          return;
        }
      }

      if (coursesToRemove.length > 0) {
        const removeResult = await removeDirectorFromCourses({
          directorId: director.id,
          courseIds: coursesToRemove,
        });

        if (!removeResult.success) {
          return;
        }
      }

      const updatedCourses = courses.filter((course) =>
        data.courseIds.includes(course.id)
      );

      setUserCourses((prev) => ({
        ...prev,
        [selectedUser.id]: updatedCourses,
      }));

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              director: {
                ...director,
                courses: updatedCourses,
              },
            };
          }
          return user;
        })
      );

      clearForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar cursos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSingleCourse = async (userId: string, courseId: string) => {
    const user = users.find((u) => u.id === userId);
    const course = courses.find((c) => c.id === courseId);

    if (!user || !course) return;

    const confirm = window.confirm(
      `Deseja remover o diretor ${user.name} do curso ${course.name}?`
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const director = await getOrCreateDirector(user.id);
      if (!director) {
        return;
      }

      const result = await removeDirectorFromCourses({
        directorId: director.id,
        courseIds: [courseId],
      });

      if (result.success) {
        setUserCourses((prev) => ({
          ...prev,
          [userId]: (prev[userId] || []).filter((c) => c.id !== courseId),
        }));
      } else {
      }
    } catch (error) {
      console.error("Erro ao remover curso:", error);
      alert("Erro ao remover curso. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAllCourses = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const currentCourses = userCourses[userId] || [];

    if (!user || currentCourses.length === 0) return;

    const confirm = window.confirm(
      `Deseja remover o diretor ${user.name} de todos os ${currentCourses.length} cursos?`
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const director = await getOrCreateDirector(user.id);
      if (!director) {
        return;
      }

      const result = await removeDirectorFromCourses({
        directorId: director.id,
        courseIds: currentCourses.map((c) => c.id),
      });

      if (result.success) {
        setUserCourses((prev) => ({
          ...prev,
          [userId]: [],
        }));
      } else {
      }
    } catch (error) {
      console.error("Erro ao remover cursos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Diretores</h2>
          <p className="text-muted-foreground">
            Gerencie os diretores e seus cursos
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) clearForm();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={clearForm}>
              <Plus className="mr-2 h-4 w-4" />
              {editingUser ? "Editar Cursos" : "Vincular Cursos"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser
                  ? `Editar Cursos: ${editingUser.name}`
                  : "Vincular Diretor a Cursos"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">
                  <User className="inline h-4 w-4 mr-2" />
                  {editingUser ? "Diretor" : "Selecionar Diretor"}
                </Label>

                {(selectedUserId || editingUser) && (
                  <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {editingUser
                            ? "Diretor em edição:"
                            : "Diretor selecionado:"}
                        </span>
                      </div>
                      <Badge variant="secondary">Diretor</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => !editingUser && setValue("userId", "")}
                      >
                        <User className="h-3 w-3" />
                        {editingUser
                          ? editingUser.name
                          : users.find((u) => u.id === selectedUserId)?.name}
                        {!editingUser && <X className="h-3 w-3" />}
                      </Badge>
                    </div>
                  </div>
                )}

                {!editingUser && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar diretores..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {userSearchTerm && (
                        <X
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                          onClick={clearUserSearch}
                        />
                      )}
                    </div>

                    {userSearchTerm && (
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                        {filteredUsersForDialog.length === 0 ? (
                          <div className="text-center py-2">
                            <p className="text-sm text-muted-foreground">
                              Nenhum diretor encontrado
                            </p>
                          </div>
                        ) : (
                          filteredUsersForDialog.map((user) => {
                            const isSelected = selectedUserId === user.id;
                            const currentCourses = userCourses[user.id] || [];

                            return (
                              <div
                                key={user.id}
                                className={`p-2 rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleUserSelect(user.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                      <User className="h-3 w-3 text-primary" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                          {user.name}
                                        </span>
                                        <Badge
                                          variant="default"
                                          className="text-xs bg-purple-500"
                                        >
                                          Diretor
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                          {user.email}
                                        </span>
                                        {currentCourses.length > 0 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {currentCourses.length} curso(s)
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.userId && (
                  <p className="text-sm text-red-500">
                    {errors.userId.message}
                  </p>
                )}
              </div>

              {/* SELEÇÃO DE CURSOS */}
              <div className="space-y-3">
                <Label>Cursos Administrados</Label>

                {editingUser && selectedCoursesToRemove.length > 0 && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      {selectedCoursesToRemove.length} curso(s) serão removidos
                      ao salvar. Cursos desmarcados em{" "}
                      <span className="font-semibold">vermelho</span> serão
                      desvinculados.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar cursos..."
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {courseSearchTerm && (
                      <X
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                        onClick={clearCourseSearch}
                      />
                    )}
                  </div>

                  {selectedCourseIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCourseIds.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        const isMarkedForRemoval =
                          isCourseMarkedForRemoval(courseId);
                        return course ? (
                          <Badge
                            key={courseId}
                            variant={
                              isMarkedForRemoval ? "destructive" : "secondary"
                            }
                            className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleCourseSelect(course)}
                          >
                            <School className="h-3 w-3 mr-1" />
                            {course.name}
                            <X className="h-3 w-3" />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}

                  {courseSearchTerm && (
                    <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                      {filteredCourses.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Nenhum curso encontrado
                        </p>
                      ) : (
                        filteredCourses.map((course) => {
                          const isSelected = selectedCourseIds.includes(
                            course.id
                          );
                          const isAlreadyLinked = isCourseAlreadyLinked(
                            course.id
                          );
                          const isMarkedForRemoval = isCourseMarkedForRemoval(
                            course.id
                          );

                          return (
                            <div
                              key={course.id}
                              className={`p-2 rounded cursor-pointer transition-colors ${
                                isSelected
                                  ? isMarkedForRemoval
                                    ? "bg-destructive/10 border border-destructive"
                                    : "bg-primary/10 border border-primary"
                                  : "hover:bg-muted/50"
                              } ${isAlreadyLinked && !isSelected ? "border-l-4 border-l-amber-500" : ""}`}
                              onClick={() => handleCourseSelect(course)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <School className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{course.name}</span>
                                  {isAlreadyLinked && !isSelected && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Vinculado
                                    </Badge>
                                  )}
                                  {isMarkedForRemoval && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Será removido
                                    </Badge>
                                  )}
                                </div>
                                {isSelected && (
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                      isMarkedForRemoval
                                        ? "bg-destructive"
                                        : "bg-primary"
                                    }`}
                                  >
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {errors.courseIds && (
                  <p className="text-sm text-red-500">
                    {errors.courseIds.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingUser ? "Atualizando..." : "Salvando..."}
                    </>
                  ) : editingUser ? (
                    "Salvar Alterações"
                  ) : (
                    "Vincular Cursos"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative max-w-sm">
            <Input
              placeholder="Buscar diretores por nome ou email..."
              value={directorSearchTerm}
              onChange={(e) => setDirectorSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            {directorSearchTerm && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                onClick={clearDirectorSearch}
              />
            )}
          </div>
        </div>
      </div>

      {/* TABELA DE DIRETORES */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Diretores</CardTitle>
          <CardDescription>
            {filteredUsers.length} diretores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando diretores...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum diretor encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione a role DIRECTOR a um usuário para que ele apareça aqui.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cursos Administrados</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const userCourseList = userCourses[user.id] || [];
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {userCourseList.length > 0 ? (
                              userCourseList.map((course) => (
                                <Badge
                                  key={course.id}
                                  variant="outline"
                                  className="text-xs flex items-center gap-1 group"
                                >
                                  <School className="h-3 w-3" />
                                  {course.name}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSingleCourse(
                                        user.id,
                                        course.id
                                      );
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-destructive"
                                    disabled={isSubmitting}
                                    title="Remover este curso"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">
                                Nenhum curso vinculado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>
                              {userCourseList.length} curso(s) vinculado(s)
                            </span>
                            {userCourseList.length > 0 && (
                              <button
                                onClick={() => handleRemoveAllCourses(user.id)}
                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-3 w-3" />
                                Remover todos
                              </button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {userCourseList.length > 0 ? "Editar" : "Vincular"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
