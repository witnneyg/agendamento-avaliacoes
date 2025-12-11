"use client";

import { useState } from "react";
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

import { cn } from "@/lib/utils";
import { Edit, Trash2, X, Loader2, Shield, ClipboardList } from "lucide-react";
import { getDepartmentColor } from "@/utils/getDepartamentColor";
import {
  SchedulingWithRelations,
  UserWithoutEmailVerified,
} from "../calendar/page";
import { EditSchedulingModal } from "./edit-scheduling.modal";

const extractSemesterNumber = (semesterName: string): string => {
  const numberMatch = semesterName.match(/^(\d+)/);
  if (numberMatch) {
    return `${numberMatch[1]}° período`;
  }

  if (semesterName.match(/Primeiro|primeiro|1/i)) {
    return "1° período";
  } else if (semesterName.match(/Segundo|segundo|2/i)) {
    return "2° período";
  } else if (semesterName.match(/Terceiro|terceiro|3/i)) {
    return "3° período";
  } else if (semesterName.match(/Quarto|quarto|4/i)) {
    return "4° período";
  } else if (semesterName.match(/Quinto|quinto|5/i)) {
    return "5° período";
  } else if (semesterName.match(/Sexto|sexto|6/i)) {
    return "6° período";
  } else if (semesterName.match(/Sétimo|sétimo|7/i)) {
    return "7° período";
  } else if (semesterName.match(/Oitavo|oitavo|8/i)) {
    return "8° período";
  }
  return semesterName;
};

const extractTimeSlots = (appointment: SchedulingWithRelations) => {
  try {
    if (
      appointment.details &&
      typeof appointment.details === "object" &&
      "timeSlots" in appointment.details
    ) {
      const details = appointment.details as any;
      if (Array.isArray(details.timeSlots)) {
        return details.timeSlots;
      }
    }

    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    return [
      `${startTime.getHours().toString().padStart(2, "0")}:${startTime
        .getMinutes()
        .toString()
        .padStart(2, "0")} - ${endTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`,
    ];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return [];
  }
};

interface AppointmentItemProps {
  appointment: SchedulingWithRelations;
  isSecretary?: boolean; // ← Adicione esta prop
  onDelete: (id: string) => void;
  userSession: UserWithoutEmailVerified | null;
  onAppointmentUpdated?: (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => void;
  onAppointmentDeleted?: (deletedId: string) => void;
  isDirector?: boolean;
  directorCourses?: { id: string }[];
}

export const AppointmentItem = ({
  appointment,
  onDelete,
  userSession,
  onAppointmentUpdated,
  onAppointmentDeleted,
  isDirector = false,
  isSecretary = false,
  directorCourses = [],
}: AppointmentItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isOwner = appointment.userId === userSession?.id;
  const isDirectorOfCourse =
    isDirector &&
    directorCourses.some((course) => course.id === appointment.courseId);

  const canEdit = isSecretary || isDirectorOfCourse || isOwner;
  const canDeleteItem = isSecretary || isDirectorOfCourse || isOwner;

  const timeSlots = extractTimeSlots(appointment);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!canEdit) {
      if (isDirector) {
        alert("Você só pode editar agendamentos dos cursos que administra");
      } else if (isSecretary) {
        alert("Como secretaria, você pode editar qualquer agendamento");
      } else {
        alert("Você só pode editar seus próprios agendamentos");
      }
      return;
    }

    setIsEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!canDeleteItem) {
      if (isDirector) {
        alert("Você só pode excluir agendamentos dos cursos que administra");
      } else if (isSecretary) {
        alert("Como secretaria, você pode excluir qualquer agendamento");
      } else {
        alert("Você só pode excluir seus próprios agendamentos");
      }
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSave = async (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => {
    if (updatedAppointments.length > 0 && updatedAppointments[0].id) {
      const updatedAppointment = {
        ...appointment,
        ...updatedAppointments[0],
        id: updatedAppointments[0].id,
      };

      if (onAppointmentUpdated) {
        onAppointmentUpdated([updatedAppointment]);
      }
    }

    setIsEditOpen(false);
    setIsAlertOpen(false);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(appointment.id);

      if (onAppointmentDeleted) {
        onAppointmentDeleted(appointment.id);
      }

      setIsDeleteDialogOpen(false);
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <div
            className={cn(
              "w-full p-2 rounded border-l-4 overflow-hidden cursor-pointer mb-1 relative",
              getDepartmentColor(appointment.course.name)
            )}
          >
            {(isDirectorOfCourse || isSecretary) && (
              <div className="absolute top-1 right-1">
                {isSecretary ? (
                  <ClipboardList className="h-3 w-3 text-green-600" />
                ) : (
                  <Shield className="h-3 w-3 text-purple-600" />
                )}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="flex gap-2 font-medium text-xs truncate">
                {appointment.discipline.name}
                <div className="text-xs truncate">
                  {timeSlots[0]}
                  {timeSlots.length > 1 && ` +${timeSlots.length - 1}`}
                </div>
              </div>
              <div className="text-xs truncate">{appointment.name}</div>
            </div>
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex gap-4 justify-end">
              {canEdit && (
                <button
                  onClick={handleEditClick}
                  className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors"
                  title={
                    isSecretary
                      ? "Editar (secretaria)"
                      : isDirectorOfCourse
                        ? "Editar (administra este curso)"
                        : "Editar"
                  }
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {canDeleteItem && (
                <button
                  onClick={handleDeleteClick}
                  className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                  title={
                    isSecretary
                      ? "Excluir (secretaria)"
                      : isDirectorOfCourse
                        ? "Excluir (administra este curso)"
                        : "Excluir"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <AlertDialogCancel className="h-4 w-4 cursor-pointer border-none hover:bg-gray-100 rounded transition-colors">
                <X />
              </AlertDialogCancel>
            </div>
            <AlertDialogTitle className="flex gap-2 items-center mt-2">
              <div
                className={cn(
                  "flex gap-2 w-3 h-3 rounded-xs flex-shrink-0",
                  getDepartmentColor(appointment.course.name)
                )}
              />
              <p className="font-medium">Disciplina:</p>
              {appointment.discipline.name}
              {isSecretary && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                  <ClipboardList className="h-3 w-3 inline mr-1" />
                  Secretaria
                </span>
              )}
              {!isSecretary && isDirectorOfCourse && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Administra
                </span>
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 text-sm pt-2">
            <div className="flex gap-2 items-center">
              <p className="font-medium">Curso:</p>
              {appointment.course.name}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Período:</p>
              {extractSemesterNumber(appointment.semester.name)}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Turma:</p>
              {appointment.class?.name ?? "N/A"}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Professor:</p>
              {appointment.name}
            </div>

            <div className="flex gap-2 items-start">
              <p className="font-medium">Horários:</p>
              <div className="flex flex-col gap-1">
                {timeSlots.map((timeSlot: any, index: any) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {timeSlot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Data:</p>
              {new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(appointment.date))}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {isSecretary ? (
                <>
                  <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2 text-green-700">
                      <ClipboardList className="h-4 w-4" />
                      <span className="font-medium">Ação da Secretaria</span>
                    </div>
                    <p className="text-sm mt-1">
                      Você está excluindo um agendamento como secretaria.
                    </p>
                  </div>
                </>
              ) : isDirectorOfCourse ? (
                <>
                  Você está excluindo um agendamento de um curso que administra.
                </>
              ) : null}
              <div className="mt-2 space-y-1">
                <div>
                  <strong>Professor:</strong> {appointment.name}
                </div>
                <div>
                  <strong>Curso:</strong> {appointment.course.name}
                </div>
                <div>
                  <strong>Disciplina:</strong> {appointment.discipline.name}
                </div>
                <div className="mt-2 text-red-600 font-medium">
                  Esta ação não pode ser desfeita.
                </div>
              </div>
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

      {canEdit && (
        <EditSchedulingModal
          appointment={appointment}
          isOpen={isEditOpen}
          onClose={handleEditClose}
          onSave={handleSave}
          disciplineDayPeriods={appointment.discipline.dayPeriods}
          isDirector={isDirector}
          isSecretary={isSecretary}
          canEdit={canEdit}
        />
      )}
    </>
  );
};
