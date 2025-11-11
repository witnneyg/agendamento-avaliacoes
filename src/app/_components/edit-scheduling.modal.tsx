"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isSameDay, isBefore, startOfDay, parse } from "date-fns";
import { Scheduling, Period } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslatedPeriods } from "../_helpers/getOrderedPeriods";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateScheduling } from "../_actions/update-scheduling";
import { getScheduling } from "../_actions/get-scheduling";

interface EditSchedulingModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAppointments: Partial<Scheduling>[]) => void;
  disciplineDayPeriods: Period[];
}

const editSchema = z.object({
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.array(z.string()).min(1, "Selecione pelo menos um horário"),
});

type EditSchema = z.infer<typeof editSchema>;

const isPastDate = (date: Date): boolean =>
  isBefore(date, startOfDay(new Date()));

const extractCurrentTimeSlots = (appointment: any) => {
  try {
    if (appointment.details && typeof appointment.details === "object") {
      const details = appointment.details as any;
      if (details.timeSlots && Array.isArray(details.timeSlots))
        return details.timeSlots;
      if (details.time && typeof details.time === "string")
        return details.time.split(",").map((slot: string) => slot.trim());
    }
    const startTime = format(new Date(appointment.startTime), "HH:mm");
    const endTime = format(new Date(appointment.endTime), "HH:mm");
    return [`${startTime} - ${endTime}`];
  } catch (error) {
    console.error("Erro ao extrair horários atuais:", error);
    const startTime = format(new Date(appointment.startTime), "HH:mm");
    const endTime = format(new Date(appointment.endTime), "HH:mm");
    return [`${startTime} - ${endTime}`];
  }
};

const generateTimeSlotsAndCheckAvailability = (
  date: Date | undefined,
  scheduledTimes: Scheduling[] = [],
  dayPeriods: Period[],
  currentAppointmentId?: string,
  currentTimeSlots?: string[],
  originalAppointmentDate?: Date
) => {
  const morningSlots = [
    "07:30 - 08:20",
    "08:20 - 09:10",
    "09:40 - 10:30",
    "10:30 - 11:20",
  ];
  const afternoonSlots = [
    "13:00 - 13:50",
    "13:50 - 14:40",
    "14:40 - 15:30",
    "15:30 - 16:20",
    "16:30 - 17:20",
    "17:20 - 18:10",
    "18:10 - 19:00",
  ];
  const eveningSlots = [
    "19:00 - 19:50",
    "19:50 - 20:40",
    "21:00 - 21:50",
    "21:50 - 22:40",
  ];
  const periodSlots = {
    [Period.MORNING]: morningSlots,
    [Period.AFTERNOON]: afternoonSlots,
    [Period.EVENING]: eveningSlots,
  };

  if (!date)
    return Object.entries(periodSlots)
      .filter(([period]) => dayPeriods.includes(period as Period))
      .map(([period, slots]) => ({
        period: period as Period,
        slots: slots.map((time) => ({ time, available: false })),
      }));

  return Object.entries(periodSlots)
    .filter(([period]) => dayPeriods.includes(period as Period))
    .map(([period, slots]) => ({
      period: period as Period,
      slots: slots.map((slot) => {
        const isTaken = scheduledTimes.some((scheduling) => {
          // SEMPRE permite editar o agendamento atual
          if (scheduling.id === currentAppointmentId) {
            return false;
          }

          const schedulingDate = new Date(scheduling.date);
          if (!isSameDay(schedulingDate, date)) return false;

          if (scheduling.details && typeof scheduling.details === "object") {
            const details = scheduling.details as any;

            if (details.timeSlots && Array.isArray(details.timeSlots)) {
              return details.timeSlots.includes(slot);
            }

            if (details.time && typeof details.time === "string") {
              const timeSlotsFromString = details.time
                .split(",")
                .map((t: string) => t.trim());
              return timeSlotsFromString.includes(slot);
            }
          }

          const schedulingStartTime = format(
            new Date(scheduling.startTime),
            "HH:mm"
          );
          const schedulingEndTime = format(
            new Date(scheduling.endTime),
            "HH:mm"
          );
          const existingTimeSlot = `${schedulingStartTime} - ${schedulingEndTime}`;
          return existingTimeSlot === slot;
        });

        const isCurrentTimeSlot =
          currentTimeSlots?.includes(slot) &&
          originalAppointmentDate &&
          isSameDay(originalAppointmentDate, date) &&
          currentAppointmentId;

        return {
          time: slot,
          available: !isTaken || isCurrentTimeSlot,
          isCurrentTimeSlot,
        };
      }),
    }));
};

const hasEnoughAvailableSlots = (
  date: Date | undefined,
  scheduledTimes: Scheduling[],
  dayPeriods: Period[],
  requiredSlotsCount: number,
  currentAppointmentId?: string,
  currentTimeSlots?: string[],
  originalAppointmentDate?: Date
): boolean => {
  if (!date) return false;

  // Se for a mesma data, sempre permite (usuário pode estar apenas trocando horários)
  if (originalAppointmentDate && isSameDay(originalAppointmentDate, date)) {
    return true;
  }

  const timeSlots = generateTimeSlotsAndCheckAvailability(
    date,
    scheduledTimes,
    dayPeriods,
    currentAppointmentId,
    currentTimeSlots,
    originalAppointmentDate
  );

  const availableSlotsCount = timeSlots.reduce((count, periodGroup) => {
    return (
      count + periodGroup.slots.filter((slot: any) => slot.available).length
    );
  }, 0);

  return availableSlotsCount >= requiredSlotsCount;
};

export const EditSchedulingModal = ({
  appointment,
  isOpen,
  onClose,
  onSave,
  disciplineDayPeriods,
}: EditSchedulingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(appointment.date)
  );
  const [scheduledTimes, setScheduledTimes] = useState<Scheduling[]>([]);
  const [existingAppointmentsCount, setExistingAppointmentsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentTimeSlots = useMemo(
    () => extractCurrentTimeSlots(appointment),
    [appointment]
  );
  const originalAppointmentDate = new Date(appointment.date);
  const requiredSlotsCount = currentTimeSlots.length;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      date: new Date(appointment.date),
      time: extractCurrentTimeSlots(appointment),
    },
  });

  const watchedDate = watch("date");

  const updateTimeSlots = () => {
    if (!selectedDate || scheduledTimes.length === 0) return;
    const slots = generateTimeSlotsAndCheckAvailability(
      selectedDate,
      scheduledTimes,
      disciplineDayPeriods,
      appointment.id,
      currentTimeSlots,
      originalAppointmentDate
    );
    setTimeSlots(slots);
  };

  useEffect(() => {
    async function fetchScheduledTimes() {
      if (isOpen) {
        setIsLoading(true);
        try {
          const schedulingData = await getScheduling();
          setScheduledTimes(schedulingData as any);
        } catch (error) {
          console.error("Erro ao buscar agendamentos:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchScheduledTimes();
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDate || scheduledTimes.length === 0) {
      setExistingAppointmentsCount(0);
      return;
    }
    const count = scheduledTimes.filter((scheduling) => {
      if (
        scheduling.id === appointment.id &&
        isSameDay(new Date(scheduling.date), selectedDate)
      ) {
        return false;
      }

      const schedulingDate = new Date(scheduling.date);
      return (
        isSameDay(schedulingDate, selectedDate) &&
        scheduling.courseId === appointment.courseId &&
        scheduling.classId === appointment.classId &&
        scheduling.disciplineId === appointment.disciplineId
      );
    }).length;
    setExistingAppointmentsCount(count);
  }, [selectedDate, scheduledTimes, appointment]);

  useEffect(() => {
    if (selectedDate && scheduledTimes.length > 0) updateTimeSlots();
  }, [selectedDate, scheduledTimes]);

  useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date(appointment.date),
        time: extractCurrentTimeSlots(appointment),
      });
      setSelectedDate(new Date(appointment.date));
      if (scheduledTimes.length > 0) updateTimeSlots();
    }
  }, [isOpen, appointment.date, reset]);

  const isDateDisabled = (date: Date): boolean => {
    if (isPastDate(date)) return true;

    if (originalAppointmentDate && isSameDay(originalAppointmentDate, date)) {
      return false;
    }

    return !hasEnoughAvailableSlots(
      date,
      scheduledTimes,
      disciplineDayPeriods,
      requiredSlotsCount,
      appointment.id,
      currentTimeSlots,
      originalAppointmentDate
    );
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue("date", date);
      // Limpa os horários selecionados ao mudar de data
      setValue("time", []);
    }
  };

  const handleFormSubmit = async (data: EditSchema) => {
    if (!data.date || data.time.length === 0) {
      return alert("Selecione pelo menos um horário.");
    }

    if (
      isSameDay(originalAppointmentDate, data.date) &&
      data.time.length === 0
    ) {
      return alert("Você deve manter pelo menos um horário selecionado.");
    }

    if (
      isPastDate(data.date) &&
      (!originalAppointmentDate ||
        !isSameDay(originalAppointmentDate, data.date))
    ) {
      return alert("Não é possível agendar para datas passadas.");
    }

    if (
      !isSameDay(originalAppointmentDate, data.date) &&
      !hasEnoughAvailableSlots(
        data.date,
        scheduledTimes,
        disciplineDayPeriods,
        requiredSlotsCount,
        appointment.id,
        currentTimeSlots,
        originalAppointmentDate
      )
    ) {
      return alert(
        `A data selecionada não possui pelo menos ${requiredSlotsCount} horário(s) disponível(eis) para o agendamento.`
      );
    }

    const isSameDayAndSameSlots =
      isSameDay(originalAppointmentDate, data.date) &&
      JSON.stringify(data.time.sort()) ===
        JSON.stringify(currentTimeSlots.sort());

    if (isSameDayAndSameSlots) {
      onClose();
      return;
    }

    const hasUnavailableSlot = data.time.some((selectedSlot) =>
      timeSlots.some((periodGroup) =>
        periodGroup.slots.some(
          (slot: any) =>
            slot.time === selectedSlot &&
            !slot.available &&
            !slot.isCurrentTimeSlot
        )
      )
    );

    if (hasUnavailableSlot)
      return alert(
        "Um ou mais horários selecionados não estão mais disponíveis. Estes horários podem estar ocupados por outros professores."
      );

    if (
      existingAppointmentsCount > 0 &&
      !isSameDay(originalAppointmentDate, data.date)
    ) {
      if (
        !confirm(
          `Já existe uma avaliação para esta turma no mesmo dia. A PROGRAD recomenda apenas uma avaliação por dia por turma.`
        )
      )
        return;
    }

    setIsSubmitting(true);
    try {
      const sortedTimes = data.time.sort((a, b) => {
        const getStartHour = (time: string) =>
          time
            .split(" - ")[0]
            .split(":")
            .map(Number)
            .reduce((acc, h) => acc * 60 + h, 0);
        return getStartHour(a) - getStartHour(b);
      });

      let earliestStartTime: Date;
      let latestEndTime: Date;

      if (sortedTimes.length === 1) {
        const [startStr, endStr] = sortedTimes[0].split(" - ");
        earliestStartTime = parse(startStr, "HH:mm", new Date(data.date));
        latestEndTime = parse(endStr, "HH:mm", new Date(data.date));
      } else {
        earliestStartTime = parse(
          sortedTimes[0].split(" - ")[0],
          "HH:mm",
          new Date(data.date)
        );
        latestEndTime = parse(
          sortedTimes[sortedTimes.length - 1].split(" - ")[1],
          "HH:mm",
          new Date(data.date)
        );
      }

      const updatedAppointment = {
        id: appointment.id,
        startTime: earliestStartTime,
        endTime: latestEndTime,
        name: appointment.name,
        date: data.date,
        courseId: appointment.courseId,
        disciplineId: appointment.disciplineId,
        classId: appointment.classId,
        semesterId: appointment.semesterId,
        userId: appointment.userId,
        details: {
          name: appointment.name,
          time: sortedTimes.join(", "),
          timeSlots: sortedTimes,
        },
        course: appointment.course,
        semester: appointment.semester,
        discipline: appointment.discipline,
        class: appointment.class,
      };

      const result: any = await updateScheduling({
        appointmentId: appointment.id,
        updatedAppointments: [updatedAppointment],
      });

      if (result.success) {
        if (result.updated && result.updated.length > 0) {
          onSave(result.updated);
        } else if (result.created && result.created.length > 0) {
          onSave(result.created);
        } else {
          onSave([updatedAppointment]);
        }
        onClose();
      } else {
        alert(`Erro ao atualizar agendamento: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      alert("Erro ao atualizar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Agendamento Atual
            </h3>
            <p className="text-sm text-blue-600">
              <strong>Data:</strong>{" "}
              {format(originalAppointmentDate, "dd/MM/yyyy")}
            </p>
            <p className="text-sm text-blue-600">
              <strong>Horários reservados:</strong>{" "}
              {currentTimeSlots.join(", ")}
            </p>
            <p className="text-sm text-blue-600">
              <strong>Quantidade de Horários :</strong> {requiredSlotsCount}
            </p>
            {isLoading && (
              <p className="text-sm text-blue-600">
                <strong>Carregando agendamentos...</strong>
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Label>Selecione uma nova data</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                disabled={isDateDisabled}
                locale={ptBR}
                className="rounded-md border"
              />
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm text-center">
                {errors.date.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground text-center">
              * Datas desabilitadas não possuem horários disponíveis suficientes
              ou são datas passadas
            </p>
          </div>

          <div className="mt-4">
            <Label className="text-lg font-semibold">
              Horários Disponíveis
            </Label>
            {isLoading ? (
              <div className="text-center py-8 border rounded-lg bg-muted/20 mt-4">
                <p className="text-muted-foreground mb-2">
                  📥 Carregando horários disponíveis...
                </p>
              </div>
            ) : (
              <>
                {existingAppointmentsCount > 0 &&
                  !isSameDay(
                    originalAppointmentDate,
                    selectedDate || new Date()
                  ) && (
                    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Já existe uma avaliação para esta turma no mesmo dia. A
                        PROGRAD recomenda apenas uma avaliação por dia por
                        turma.
                      </AlertDescription>
                    </Alert>
                  )}

                {selectedDate &&
                  !isSameDay(originalAppointmentDate, selectedDate) &&
                  !hasEnoughAvailableSlots(
                    selectedDate,
                    scheduledTimes,
                    disciplineDayPeriods,
                    requiredSlotsCount,
                    appointment.id,
                    currentTimeSlots,
                    originalAppointmentDate
                  ) && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Esta data não possui pelo menos {requiredSlotsCount}{" "}
                        horário(s) disponível(eis). Selecione outra data com
                        mais horários livres.
                      </AlertDescription>
                    </Alert>
                  )}

                {disciplineDayPeriods && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Períodos disponíveis:{" "}
                      {getTranslatedPeriods(disciplineDayPeriods)}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  <Controller
                    control={control}
                    name="time"
                    render={({ field }) => {
                      const selectedTimes = field.value || [];
                      const toggleTime = (slotTime: string) => {
                        if (selectedTimes.includes(slotTime)) {
                          field.onChange(
                            selectedTimes.filter((t) => t !== slotTime)
                          );
                        } else {
                          field.onChange([...selectedTimes, slotTime]);
                        }
                      };

                      return (
                        <div className="space-y-6">
                          {timeSlots.map((periodGroup) => (
                            <div key={periodGroup.period} className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <Label className="text-base font-semibold">
                                  {periodGroup.period === Period.MORNING &&
                                    "Matutino"}
                                  {periodGroup.period === Period.AFTERNOON &&
                                    "Vespertino"}
                                  {periodGroup.period === Period.EVENING &&
                                    "Noturno"}
                                </Label>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                {periodGroup.slots.map(
                                  (slot: any, index: number) => (
                                    <Button
                                      type="button"
                                      key={index}
                                      variant={
                                        !slot.available &&
                                        !slot.isCurrentTimeSlot
                                          ? "ghost"
                                          : selectedTimes.includes(slot.time)
                                            ? "default"
                                            : "outline"
                                      }
                                      className={
                                        slot.isCurrentTimeSlot &&
                                        !selectedTimes.includes(slot.time)
                                          ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 w-full justify-start"
                                          : !slot.available &&
                                              !slot.isCurrentTimeSlot
                                            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300 w-full justify-start"
                                            : selectedTimes.includes(slot.time)
                                              ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start"
                                              : "hover:bg-primary/10 cursor-pointer border-primary w-full justify-start"
                                      }
                                      disabled={
                                        !slot.available &&
                                        !slot.isCurrentTimeSlot
                                      }
                                      onClick={() => toggleTime(slot.time)}
                                    >
                                      <div className="flex items-center w-full">
                                        <span className="font-medium">
                                          {slot.time}
                                        </span>
                                        {slot.isCurrentTimeSlot &&
                                          !selectedTimes.includes(
                                            slot.time
                                          ) && (
                                            <span className="text-xs ml-2 text-blue-600">
                                              (Não selecinado)
                                            </span>
                                          )}
                                        {slot.isCurrentTimeSlot &&
                                          selectedTimes.includes(slot.time) && (
                                            <span className="text-xs ml-2 text-green-600">
                                              (Selecionado)
                                            </span>
                                          )}
                                        {!slot.available &&
                                          !slot.isCurrentTimeSlot && (
                                            <span className="text-xs ml-2">
                                              (Indisponível)
                                            </span>
                                          )}
                                      </div>
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm">
                      {errors.time.message}
                    </p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        !selectedDate ||
                        isSubmitting ||
                        (isPastDate(selectedDate) &&
                          !isSameDay(originalAppointmentDate, selectedDate)) ||
                        watch("time").length === 0 ||
                        (!isSameDay(originalAppointmentDate, selectedDate) &&
                          !hasEnoughAvailableSlots(
                            selectedDate,
                            scheduledTimes,
                            disciplineDayPeriods,
                            requiredSlotsCount,
                            appointment.id,
                            currentTimeSlots,
                            originalAppointmentDate
                          ))
                      }
                    >
                      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
