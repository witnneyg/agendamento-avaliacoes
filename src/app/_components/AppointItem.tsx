import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getDepartmentColor,
  SchedulingWithRelations,
  UserWithoutEmailVerified,
} from "../calendar/page";
import { cn } from "@/lib/utils";
import { Edit, Trash2, X } from "lucide-react";
import { EditSchedulingModal } from "./edit-scheduling.modal";

const getPeriodLabel = (period: string) => {
  switch (period) {
    case "MORNING":
      return "manhä";
    case "AFTERNOON":
      return "tarde";
    case "EVENING":
      return "noite";
    default:
      return period;
  }
};

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

  const handleSave = (updatedAppointment: Partial<SchedulingWithRelations>) => {
    // Aqui você pode fazer um update no backend via ação ou API
    console.log("Salvando agendamento editado:", updatedAppointment);
    setIsEditOpen(false);
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
              <Edit
                className="h-4 w-4 cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              />
              {appointment.userId === userSession?.id && (
                <Trash2
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => onDelete(appointment.id)}
                />
              )}
              <AlertDialogCancel className="h-4 w-4 cursor-pointer border-none">
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
            <div className="flex gap-2 items-center">
              {appointment.course.periods.map((p) => (
                <span key={p} className="flex gap-1 items-center">
                  <p className="font-medium">Período:</p>

                  {getPeriodLabel(p)}
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <p className="font-medium">Anotações:</p>

              {appointment.notes ? appointment.notes : "Sem anotações"}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de edição */}
      <EditSchedulingModal
        appointment={appointment}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};
