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
      return "Matutino";
    case "AFTERNOON":
      return "Vespertino";
    case "EVENING":
      return "Noturno";
    default:
      return period;
  }
};

const periodOrder = ["MORNING", "AFTERNOON", "EVENING"];

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
    console.error("Erro ao extrair horários:", error);
    return [];
  }
};

interface AppointmentItemProps {
  appointment: SchedulingWithRelations;
  onDelete: (id: string) => void;
  userSession: UserWithoutEmailVerified | null;
  onAppointmentUpdated?: (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => void;
  onAppointmentDeleted?: (deletedId: string) => void;
  onRefreshAppointments?: () => Promise<void>;
}

export const AppointmentItem = ({
  appointment,
  onDelete,
  userSession,
  onAppointmentUpdated,
  onAppointmentDeleted,
  onRefreshAppointments,
}: AppointmentItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar o AlertDialog principal

  const isOwner = appointment.userId === userSession?.id;
  const timeSlots = extractTimeSlots(appointment);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSave = async (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => {
    console.log("Salvando agendamentos:", updatedAppointments);

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

    // FECHA AMBOS OS MODAIS
    setIsEditOpen(false);
    setIsAlertOpen(false);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    // Não fecha o modal principal aqui, apenas quando salvar
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(appointment.id);

      // Notifica o componente pai sobre a exclusão se a função foi fornecida
      if (onAppointmentDeleted) {
        onAppointmentDeleted(appointment.id);
      }

      setIsDeleteDialogOpen(false);
      setIsAlertOpen(false); // Fecha o modal principal após excluir
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
              "w-full p-2 rounded border-l-4 overflow-hidden cursor-pointer mb-1",
              getDepartmentColor(appointment.course.name)
            )}
          >
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
              {isOwner && (
                <Edit
                  className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={handleEditClick}
                />
              )}
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

      {/* Diálogo de exclusão */}
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
        onClose={handleEditClose}
        onSave={handleSave}
        disciplineDayPeriods={appointment.discipline.dayPeriods}
      />
    </>
  );
};
