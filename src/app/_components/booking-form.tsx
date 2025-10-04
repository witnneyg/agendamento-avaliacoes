"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getTeacherByCourse } from "../_actions/get-teacher-by-disciplines";
import { format, isSameDay } from "date-fns";
import { Scheduling } from "@prisma/client";
import { getSchedulingBySemester } from "../_actions/get-scheduling-by-semesterId";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface Teacher {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingFormProps {
  onSubmit: (details: { name: string; time: string; date: Date }) => void;
  onBack: () => void;
  courseId: string;
  semesterId: string;
  timePeriodId: string;
}

const bookingSchema = z.object({
  teacherId: z
    .string()
    .uuid("O nome do professor deve ser obrigatório")
    .nonempty("O nome é obrigatório"),
  time: z.array(z.string()).nonempty("Selecione pelo menos um horário"),
  date: z.date({ required_error: "Selecione uma data" }),
});

type BookingSchema = z.infer<typeof bookingSchema>;

export const generateTimeSlotsAndCheckAvailability = (
  date: Date | undefined,
  scheduledTimes: Scheduling[] = [],
  timePeriodId: string
) => {
  let slots: string[] = [];

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

  if (timePeriodId === "morning") {
    slots = morningSlots;
  } else if (timePeriodId === "afternoon") {
    slots = afternoonSlots;
  } else if (timePeriodId === "evening") {
    slots = eveningSlots;
  } else {
    slots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
  }

  if (!date) {
    return slots.map((slot) => ({ time: slot, available: false }));
  }

  const result = slots.map((slot) => {
    const [startStr, endStr] = slot.split(" - ");

    const isTaken = scheduledTimes.some((scheduling) => {
      try {
        const schedulingDate = new Date(scheduling.date);
        const schedulingStartTime = format(
          new Date(scheduling.startTime),
          "HH:mm"
        );
        const schedulingEndTime = format(new Date(scheduling.endTime), "HH:mm");

        const isSameDate = isSameDay(schedulingDate, date);
        const isSameStartTime = schedulingStartTime === startStr;
        const isSameEndTime = schedulingEndTime === endStr;

        return isSameDate && isSameStartTime && isSameEndTime;
      } catch (error) {
        return false;
      }
    });

    return {
      time: slot,
      available: !isTaken,
    };
  });

  return result;
};

export function BookingForm({
  onSubmit,
  onBack,
  courseId,
  semesterId,
  timePeriodId,
}: BookingFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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
      teacherId: "",
    },
  });

  const watchedDate = watch("date");

  async function handleSubmitForm(data: BookingSchema) {
    if (!data.date) {
      alert("Por favor, selecione uma data");
      return;
    }

    const teacher = teachers.find((t) => t.id === data.teacherId);

    if (!teacher) {
      alert("Professor não encontrado");
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
      ...data,
      name: teacher.name,
      time: sortedTimes.join(", "),
      date: data.date,
    });
  }

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const data = await getTeacherByCourse(courseId);
        setTeachers(data);
      } catch (error) {
        console.error("❌ Erro ao carregar professores:", error);
      }
    }

    fetchTeachers();
  }, [courseId]);

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
    timePeriodId
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
        Voltar ao período
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
        <p className="text-sm text-muted-foreground mb-4">
          {selectedDate
            ? `Selecione os horários para ${selectedDate.toLocaleDateString("pt-BR")}`
            : "Selecione uma data para ver os horários disponíveis"}
        </p>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
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
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot, index) => (
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
                          slot.available && selectedDate
                            ? "hover:bg-primary/10 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }
                        disabled={!slot.available || !selectedDate}
                        onClick={() =>
                          slot.available &&
                          selectedDate &&
                          toggleTime(slot.time)
                        }
                      >
                        {slot.time}
                        {!slot.available && " (Indisponível)"}
                      </Button>
                    ))}
                  </div>

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

          {selectedDate && (
            <>
              <div className="space-y-2">
                <Label htmlFor="teacher">Selecione o Professor</Label>
                <Controller
                  control={control}
                  name="teacherId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um professor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Professores</SelectLabel>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.teacherId && (
                  <p className="text-red-500 text-sm">
                    {errors.teacherId.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={!selectedDate}
              >
                Confirmar Agendamento
              </Button>
            </>
          )}
        </form>
      </div>
    </>
  );
}
