"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, AlertTriangle, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { Scheduling, Period } from "@prisma/client";
import { getSchedulingBySemester } from "../_actions/get-scheduling-by-semesterId";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { getDisciplineById } from "../_actions/get-discipline-by-id";
import { getTranslatedPeriods } from "../_helpers/getOrderedPeriods";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

interface Teacher {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingFormProps {
  onSubmit: (details: {
    name: string;
    time: string;
    date: Date;
    teacherId: string;
  }) => void;
  onBack: () => void;
  courseId: string;
  semesterId: string;
  disciplineId: string;
  classId: string;
}

const bookingSchema = z.object({
  teacherId: z.string().min(1, "Professor é obrigatório"),
  time: z.array(z.string()).nonempty("Selecione pelo menos um horário"),
  date: z.date({ required_error: "Selecione uma data" }),
});

type BookingSchema = z.infer<typeof bookingSchema>;

export const generateTimeSlotsAndCheckAvailability = (
  date: Date | undefined,
  scheduledTimes: Scheduling[] = [],
  dayPeriods: Period[]
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

  if (!date) {
    return Object.entries(periodSlots)
      .filter(([period]) => dayPeriods.includes(period as Period))
      .map(([period, slots]) => ({
        period: period as Period,
        slots: slots.map((slot) => ({ time: slot, available: false })),
      }));
  }

  const result = Object.entries(periodSlots)
    .filter(([period]) => dayPeriods.includes(period as Period))
    .map(([period, slots]) => {
      const availableSlots = slots.map((slot) => {
        const [startStr, endStr] = slot.split(" - ");

        const isTaken = scheduledTimes.some((scheduling) => {
          try {
            const schedulingDate = new Date(scheduling.date);

            if (!isSameDay(schedulingDate, date)) {
              return false;
            }

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
          } catch (error) {
            console.error("Erro ao verificar horário ocupado:", error);
            return false;
          }
        });

        return {
          time: slot,
          available: !isTaken,
        };
      });

      return {
        period: period as Period,
        slots: availableSlots,
      };
    });

  return result;
};

const checkExistingAppointments = (
  date: Date | undefined,
  scheduledTimes: Scheduling[],
  courseId: string,
  classId: string,
  disciplineId: string
): { hasConflict: boolean; existingCount: number } => {
  if (!date) return { hasConflict: false, existingCount: 0 };

  const existingAppointments = scheduledTimes.filter((scheduling) => {
    try {
      const schedulingDate = new Date(scheduling.date);

      return (
        isSameDay(schedulingDate, date) &&
        scheduling.courseId === courseId &&
        scheduling.classId === classId &&
        scheduling.disciplineId === disciplineId
      );
    } catch (error) {
      console.error("Erro ao verificar conflito:", error);
      return false;
    }
  });

  return {
    hasConflict: existingAppointments.length > 0,
    existingCount: existingAppointments.length,
  };
};

export function BookingForm({
  onSubmit,
  onBack,
  courseId,
  semesterId,
  disciplineId,
  classId,
}: BookingFormProps) {
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [disciplineData, setDisciplineData] = useState<{
    dayPeriods: Period[];
  } | null>(null);
  const [appointmentConflict, setAppointmentConflict] = useState<{
    hasConflict: boolean;
    existingCount: number;
  }>({ hasConflict: false, existingCount: 0 });

  const { data: session } = useSession();
  const user = session?.user;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    resetField,
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      time: [],
      teacherId: user?.id || "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      setValue("teacherId", user.id);
    }
  }, [user, setValue]);

  const watchedDate = watch("date");

  useEffect(() => {
    async function fetchDisciplineData() {
      try {
        const data = await getDisciplineById(disciplineId);
        setDisciplineData(data);
      } catch (error) {
        console.error("Erro ao carregar dados da disciplina:", error);
      }
    }

    if (disciplineId) {
      fetchDisciplineData();
    }
  }, [disciplineId]);

  useEffect(() => {
    const conflict = checkExistingAppointments(
      selectedDate,
      schedulingTimes,
      courseId,
      classId,
      disciplineId
    );
    setAppointmentConflict(conflict);
  }, [selectedDate, schedulingTimes, courseId, classId, disciplineId]);

  async function handleSubmitForm(data: BookingSchema) {
    if (!data.date) {
      alert("Por favor, selecione uma data");
      return;
    }

    const finalConflict = checkExistingAppointments(
      data.date,
      schedulingTimes,
      courseId,
      classId,
      disciplineId
    );

    if (finalConflict.hasConflict) {
      const confirmMessage = `Já existem ${finalConflict.existingCount} avaliação(ões) para esta disciplina no mesmo dia. Deseja continuar mesmo assim?`;

      if (!confirm(confirmMessage)) {
        return;
      }
    }

    if (!user?.name || !data.teacherId) {
      alert("Usuário não encontrado");
      return;
    }

    const sortedTimes = data.time.sort((a: string, b: string) => {
      const getStartHour = (time: string) => {
        const [hour, minute] = time.split(" - ")[0].split(":").map(Number);
        return hour * 60 + minute;
      };

      return getStartHour(a) - getStartHour(b);
    });

    onSubmit({
      name: user.name,
      teacherId: data.teacherId,
      time: sortedTimes.join(", "),
      date: data.date,
    });
  }

  useEffect(() => {
    async function fetchSchedulingTimes() {
      try {
        const data = await getSchedulingBySemester(semesterId);
        setSchedulingTimes(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSchedulingTimes();
  }, [semesterId]);

  useEffect(() => {
    if (selectedDate) {
      resetField("time");
    }
  }, [selectedDate, resetField]);

  function handleSelectDate(date: Date | undefined) {
    setSelectedDate(date);
    if (date) {
      setValue("date", date);
    } else {
      resetField("time");
    }
  }

  const timeSlots = generateTimeSlotsAndCheckAvailability(
    selectedDate,
    schedulingTimes,
    disciplineData?.dayPeriods || []
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="self-start mb-2"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para disciplinas
      </Button>

      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={(date) =>
              date < new Date() || date.getDay() === 0 || date.getDay() === 6
            }
            locale={ptBR}
            className="rounded-md border"
          />
        </div>

        {errors.date && (
          <p className="text-red-500 text-sm text-center">
            {errors.date.message}
          </p>
        )}
      </div>

      <div className="mt-6">
        <Label className="text-lg font-semibold">Horários Disponíveis</Label>

        {!selectedDate ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20 mt-4">
            <p className="text-muted-foreground mb-2">
              ⏰ Selecione uma data para ver os horários disponíveis
            </p>
            <p className="text-sm text-muted-foreground">
              Escolha uma data no calendário acima para visualizar os horários
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {`Selecione os horários para ${selectedDate.toLocaleDateString("pt-BR")}`}
            </p>

            {appointmentConflict.hasConflict && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  ⚠️ Atenção! Já existe {appointmentConflict.existingCount}
                  {appointmentConflict.existingCount === 1
                    ? " avaliação"
                    : " avaliações"}{" "}
                  agendada(s) para esta turma no mesmo dia. O recomendado é ter
                  apenas 1 avaliação por dia.
                </AlertDescription>
              </Alert>
            )}

            {disciplineData && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Períodos disponíveis:{" "}
                  {getTranslatedPeriods(disciplineData.dayPeriods)}
                </p>
              </div>
            )}

            {user && (
              <div className="mb-4 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Professor:</span>
                  <span className="text-sm font-semibold text-blue-700">
                    {user.name}
                  </span>
                </div>
                <input type="hidden" value={user.id} />
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              <input
                type="hidden"
                {...control.register("teacherId")}
                value={user?.id || ""}
              />

              <Controller
                control={control}
                name="time"
                render={({ field }) => {
                  const selectedTimes = field.value || [];

                  const toggleTime = (slotTime: string) => {
                    if (selectedTimes.includes(slotTime)) {
                      field.onChange(
                        selectedTimes.filter((t: string) => t !== slotTime)
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
                              {periodGroup.period === Period.MORNING && "Manhã"}
                              {periodGroup.period === Period.AFTERNOON &&
                                "Tarde"}
                              {periodGroup.period === Period.EVENING && "Noite"}
                            </Label>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {periodGroup.slots.map((slot, index) => (
                              <Button
                                type="button"
                                key={index}
                                variant={
                                  !slot.available
                                    ? "ghost"
                                    : selectedTimes.includes(slot.time)
                                      ? "default"
                                      : "outline"
                                }
                                className={
                                  slot.available
                                    ? "hover:bg-primary/10 cursor-pointer"
                                    : "opacity-50 cursor-not-allowed"
                                }
                                disabled={!slot.available}
                                onClick={() =>
                                  slot.available && toggleTime(slot.time)
                                }
                              >
                                {slot.time}
                                {!slot.available && " (Indisponível)"}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {timeSlots.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhum horário disponível para o período selecionado.
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer mt-2"
                disabled={!selectedDate}
              >
                Confirmar Agendamento
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
