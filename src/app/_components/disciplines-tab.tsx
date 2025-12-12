"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Search, Filter, X } from "lucide-react";
import type { Course, Period, Prisma, Semester } from "@prisma/client";

import { createDiscipline } from "@/app/_actions/discipline/create-discipline";
import { getSemesterByCourse } from "@/app/_actions/semesters/get-semester-by-course-selected";
import { deleteDiscipline } from "../_actions/discipline/delete-discipline";
import { updateDiscipline } from "../_actions/discipline/update-discipline";
import { getDisciplinesByDirector } from "../_actions/director/get-disciplines-by-director";
import { getCoursesByDirector } from "../_actions/director/get-coursers-by-director";

const disciplineSchema = z.object({
  name: z.string().min(1, "O nome da disciplina é obrigatório"),
  courseId: z.string().min(1, "O curso é obrigatório"),
  semesterId: z.string().min(1, "O período é obrigatório"),
  dayPeriods: z
    .array(z.enum(["MORNING", "AFTERNOON", "EVENING"]))
    .min(1, "Selecione pelo menos um turno"),
});

type DisciplineFormData = z.infer<typeof disciplineSchema>;

export type DisciplineWithRelations = Prisma.DisciplineGetPayload<{
  include: {
    courses: true;
    semester: true;
  };
}>;

const periodOptions: { value: Period; label: string }[] = [
  { value: "MORNING", label: "Matutino" },
  { value: "AFTERNOON", label: "Vespertino" },
  { value: "EVENING", label: "Noturno" },
];

const periodOrder: Period[] = ["MORNING", "AFTERNOON", "EVENING"];

export default function DisciplinesTab() {
  const [disciplinas, setDisciplinas] = useState<DisciplineWithRelations[]>([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<
    DisciplineWithRelations[]
  >([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscpline, setEditingDiscispline] =
    useState<DisciplineWithRelations | null>(null);
  const [disciplinaParaDeletar, setDisciplinaParaDeletar] =
    useState<DisciplineWithRelations | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("todos");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState("todos");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DisciplineFormData>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
      courseId: "",
      semesterId: "",
      dayPeriods: [],
    },
  });

  const selectedCourseId = watch("courseId");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const disciplinesData = await getDisciplinesByDirector();
        setDisciplinas(disciplinesData as any);
        setFilteredDisciplinas(disciplinesData as any);

        const coursesData = await getCoursesByDirector();
        setCourses(coursesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSemesters() {
      if (!selectedCourseId) {
        setSemesters([]);
        return;
      }
      const semestersData = await getSemesterByCourse(selectedCourseId);
      setSemesters(semestersData);
    }
    fetchSemesters();
  }, [selectedCourseId]);

  useEffect(() => {
    let filtered = disciplinas;

    if (searchTerm) {
      filtered = filtered.filter((disciplina) =>
        disciplina.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourseFilter && selectedCourseFilter !== "todos") {
      filtered = filtered.filter((disciplina) =>
        disciplina.courses.some((course) => course.id === selectedCourseFilter)
      );
    }

    if (selectedSemesterFilter && selectedSemesterFilter !== "todos") {
      filtered = filtered.filter(
        (disciplina) => disciplina.semester.id === selectedSemesterFilter
      );
    }

    setFilteredDisciplinas(filtered);
  }, [disciplinas, searchTerm, selectedCourseFilter, selectedSemesterFilter]);

  const onSubmit = async (data: DisciplineFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const sortedData = {
        ...data,
        name: data.name.toUpperCase(),
        dayPeriods: data.dayPeriods.sort(
          (a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b)
        ),
      };

      if (editingDiscpline) {
        const updated = await updateDiscipline({
          id: editingDiscpline.id,
          ...sortedData,
        });

        setDisciplinas((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
      } else {
        const newDiscipline = await createDiscipline(sortedData);
        setDisciplinas((prev) => [...prev, newDiscipline]);
      }

      reset();
      setEditingDiscispline(null);
      setIsDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (disciplina: DisciplineWithRelations) => {
    const disciplinaCourse = disciplina.courses[0];

    reset({
      name: disciplina.name ?? "",
      courseId: disciplinaCourse?.id ?? "",
      semesterId: disciplina.semesterId,
      dayPeriods: disciplina.dayPeriods ?? [],
    });

    setEditingDiscispline(disciplina);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (disciplina: DisciplineWithRelations) => {
    setDisciplinaParaDeletar(disciplina);
  };

  const handleConfirmDelete = async () => {
    if (!disciplinaParaDeletar || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteDiscipline(disciplinaParaDeletar.id);

      setDisciplinas((prev) =>
        prev.filter((d) => d.id !== disciplinaParaDeletar.id)
      );
      setDisciplinaParaDeletar(null);
    } catch (error) {
      console.error("Erro ao deletar disciplina:", error);
      alert("Erro ao deletar disciplina. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDisciplinaParaDeletar(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourseFilter("todos");
    setSelectedSemesterFilter("todos");
  };

  const uniqueSemesters = Array.from(
    new Set(disciplinas.map((d) => d.semester.id))
  )
    .map((id) => {
      const disciplina = disciplinas.find((d) => d.semester.id === id);
      return disciplina?.semester;
    })
    .filter(Boolean) as Semester[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Disciplinas</h2>
          <p className="text-muted-foreground">
            Gerencie as disciplinas dos seus cursos
          </p>
          {courses.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {courses.length} curso(s) vinculado(s) a você
            </p>
          )}
          {courses.length === 0 && !isLoading && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Você não está vinculado a nenhum curso como diretor
            </p>
          )}
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              reset({
                name: "",
                courseId: "",
                semesterId: "",
                dayPeriods: [],
              });
              setEditingDiscispline(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="cursor-pointer" disabled={courses.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md [&>button]:cursor-pointer">
            <DialogHeader>
              <DialogTitle>
                {editingDiscpline ? "Editar Disciplina" : "Nova Disciplina"}
              </DialogTitle>
              <DialogDescription>
                {editingDiscpline
                  ? "Atualize as informações da disciplina"
                  : "Adicione uma nova disciplina ao seu curso"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome da Disciplina</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Introdução à Programação" />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseId">Curso</Label>
                <Controller
                  name="courseId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((curso) => (
                          <SelectItem key={curso.id} value={curso.id}>
                            {curso.name}
                          </SelectItem>
                        ))}
                        {courses.length === 0 && (
                          <SelectItem value="sem-cursos" disabled>
                            Nenhum curso disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseId && (
                  <p className="text-sm text-red-500">
                    {errors.courseId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semesterId">Período</Label>
                <Controller
                  name="semesterId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um período" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semestre) => (
                          <SelectItem key={semestre.id} value={semestre.id}>
                            {semestre.name}
                          </SelectItem>
                        ))}
                        {semesters.length === 0 && selectedCourseId && (
                          <SelectItem value="sem-periodos" disabled>
                            Nenhum período disponível para este curso
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.semesterId && (
                  <p className="text-sm text-red-500">
                    {errors.semesterId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Turnos da Disciplina</Label>
                <Controller
                  name="dayPeriods"
                  control={control}
                  render={({ field }) => {
                    const selectedCourse = courses.find(
                      (c) => c.id === selectedCourseId
                    );
                    const availablePeriods = selectedCourse?.periods ?? [];

                    return (
                      <div className="flex flex-col gap-2">
                        {periodOptions.map((option) => {
                          const isDisabled = !availablePeriods.includes(
                            option.value
                          );
                          const isChecked =
                            field.value?.includes(option.value) || false;

                          return (
                            <label
                              key={option.value}
                              className={`
                                  flex items-center gap-2
                                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                `}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      option.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      (field.value || []).filter(
                                        (v) => v !== option.value
                                      )
                                    );
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              {option.label}
                            </label>
                          );
                        })}
                      </div>
                    );
                  }}
                />
                {errors.dayPeriods && (
                  <p className="text-sm text-red-500">
                    {errors.dayPeriods.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting || courses.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingDiscpline ? "Atualizando..." : "Criando..."}
                    </>
                  ) : (
                    <>
                      {editingDiscpline ? "Atualizar" : "Adicionar"} Disciplina
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar por nome</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome da disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                {searchTerm && (
                  <X
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseFilter">Filtrar por curso</Label>
              <Select
                value={selectedCourseFilter}
                onValueChange={setSelectedCourseFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os cursos</SelectItem>
                  {courses.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.name}
                    </SelectItem>
                  ))}
                  {courses.length === 0 && (
                    <SelectItem value="sem-cursos" disabled>
                      Nenhum curso disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semesterFilter">Filtrar por período</Label>
              <Select
                value={selectedSemesterFilter}
                onValueChange={setSelectedSemesterFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  {uniqueSemesters.map((semestre) => (
                    <SelectItem key={semestre.id} value={semestre.id}>
                      {semestre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="opacity-0">Limpar</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full cursor-pointer"
                disabled={
                  !searchTerm &&
                  selectedCourseFilter === "todos" &&
                  selectedSemesterFilter === "todos"
                }
              >
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredDisciplinas.length} de {disciplinas.length} disciplinas
            encontradas
            {courses.length === 0 && !isLoading && (
              <span className="block text-amber-600 font-medium mt-1">
                ⚠️ Você não está vinculado a nenhum curso como diretor.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Disciplinas</CardTitle>
          <CardDescription>
            {filteredDisciplinas.length} disciplinas{" "}
            {searchTerm ||
            selectedCourseFilter !== "todos" ||
            selectedSemesterFilter !== "todos"
              ? "filtradas"
              : "cadastradas"}{" "}
            em seus cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando disciplinas...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                Você não está vinculado a nenhum curso como diretor.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Entre em contato com a administração para ser vinculado a um
                curso.
              </p>
            </div>
          ) : filteredDisciplinas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                {disciplinas.length === 0
                  ? "Nenhuma disciplina cadastrada ainda nos seus cursos."
                  : "Nenhuma disciplina encontrada com os filtros aplicados."}
              </p>
              {(searchTerm ||
                selectedCourseFilter !== "todos" ||
                selectedSemesterFilter !== "todos") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4 cursor-pointer"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Turnos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisciplinas.map((disciplina) => (
                  <TableRow key={disciplina.id}>
                    <TableCell className="font-medium">
                      {disciplina.name}
                    </TableCell>
                    <TableCell>
                      {disciplina.courses.map((item) => item.name).join(", ")}
                    </TableCell>
                    <TableCell>{disciplina.semester.name}</TableCell>
                    <TableCell>
                      {disciplina.dayPeriods
                        .map((p) =>
                          p === "MORNING"
                            ? "Matutino"
                            : p === "AFTERNOON"
                              ? "Vespertino"
                              : "Noturno"
                        )
                        .join(", ")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleEdit(disciplina)}
                          disabled={isSubmitting || isDeleting}
                        >
                          <Edit className="h-4 w-4 " />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(disciplina)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              disabled={isSubmitting || isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta disciplina?
                                Esta ação não pode ser desfeita.
                                <br />
                                <br />
                                <strong>Atenção:</strong> Todos os agendamentos
                                vinculados a esta disciplina também serão
                                excluídos permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={handleCancelDelete}
                                className="cursor-pointer"
                                disabled={isDeleting}
                              >
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-500 hover:bg-red-600 cursor-pointer"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                  </>
                                ) : (
                                  "Excluir"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
