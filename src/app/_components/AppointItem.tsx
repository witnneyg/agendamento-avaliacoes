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
import { Edit, Trash2, X, Loader2 } from "lucide-react";
import { getDepartmentColor } from "@/utils/getDepartamentColor";
import {
  SchedulingWithRelations,
  UserWithoutEmailVerified,
} from "../calendar/page";
import { EditSchedulingModal } from "./edit-scheduling.modal";

const getPeriodLabel = (period: string) => {
  switch (period) {
    case "MORNING":
      return "Manhã";
    case "AFTERNOON":
      return "Tarde";
    case "EVENING":
      return "Noite";
    default:
      return period;
  }
};
const periodOrder = ["MORNING", "AFTERNOON", "EVENING"];

export const AppointmentItem = ({
  appointment,
  onDelete,
  userSession,
}: {
  appointment: SchedulingWithRelations;
  onDelete: (id: string) => void;
  userSession: UserWithoutEmailVerified | null;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verifica se o usuário atual é o dono do agendamento
  const isOwner = appointment.userId === userSession?.id;

  // Server action ou lógica de salvar múltiplos horários
  const handleSave = async (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => {
    // Aqui você chamaria sua server action, ex:
    // await saveAppointments(updatedAppointments);
    updatedAppointments.forEach((a) =>
      console.log("Salvando agendamento editado:", a)
    );
    setIsEditOpen(false);
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(appointment.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            className={cn(
              "w-full p-2 rounded border-l-4 overflow-hidden cursor-pointer mb-1",
              getDepartmentColor(appointment.course.name)
            )}
          >
            <div className="overflow-hidden">
              <div className="flex gap-2 font-medium text-xs truncate">
                {appointment.discipline.name}{" "}
                <div className="text-xs truncate">
                  {new Intl.DateTimeFormat("pt-BR", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(appointment.startTime))}
                  {" – "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(appointment.endTime))}
                </div>
              </div>
              <div className="text-xs truncate">{appointment.name}</div>
            </div>
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex gap-4 justify-end">
              {/* Ícone de edição - aparece apenas para o dono do agendamento */}
              {isOwner && (
                <Edit
                  className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={handleEditClick}
                />
              )}
              {/* Ícone de exclusão - aparece apenas para o dono do agendamento */}
              {isOwner && (
                <Trash2
                  className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={handleDeleteClick}
                />
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
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 text-sm pt-2">
            <div className="flex gap-2 items-center">
              <p className="font-medium">Curso:</p>
              {appointment.course.name}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Período:</p>
              {appointment.course.periods
                .slice()
                .sort((a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b))
                .map((p) => getPeriodLabel(p))
                .join(", ")}
            </div>
            <div className="flex gap-2 items-center">
              <p className="font-medium">Turma:</p>
              {appointment.class?.name ?? "N/A"}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Professor:</p>
              {appointment.name}
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Horário:</p>
              {new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }).format(new Date(appointment.startTime))}
              {" ⋅ "}
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(appointment.startTime))}
              {" – "}
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(appointment.endTime))}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não
              pode ser desfeita.
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

      {/* Modal de edição */}
      <EditSchedulingModal
        appointment={appointment}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        scheduledTimes={[]}
        disciplineDayPeriods={appointment.discipline.dayPeriods}
      />
    </>
  );
};
