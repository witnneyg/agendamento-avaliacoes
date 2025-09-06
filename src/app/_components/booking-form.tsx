"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { sendSchedulingEmail } from "../_actions/send-scheduling-email";
import { format, isSameDay } from "date-fns";
import { Scheduling } from "@prisma/client";
import { getSchedulingById } from "../_actions/get-scheduling-by-id";

interface Teacher {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingFormProps {
  onSubmit: (details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    time: string;
  }) => void;
  onBack: () => void;
  courseId: string;
  disciplineId: string;
  timePeriodId: string;
  date: Date;
}

const bookingSchema = z.object({
  teacherId: z
    .string()
    .uuid("Professor inválido")
    .nonempty("O nome é obrigatório"),
  time: z.array(z.string()).nonempty("Selecione pelo menos um horário"),
  email: z
    .string()
    .email("Email inválido")
    .nonempty("O email deve ser obrigatório")
    .refine(
      (email) =>
        email.endsWith("@unicerrado.edu.br") ||
        email.endsWith("@alunos.unicerrado.edu.br"),
      {
        message: "O email deve ser do domínio unicerrado",
      }
    ),
  phone: z
    .string()
    .min(10, "O telefone deve ter no mínimo 10 dígitos")
    .max(15, "O telefone deve ter no máximo 15 dígitos")
    .regex(
      /^\+?\d{10,15}$/,
      "Telefone deve conter apenas números, com ou sem DDI"
    ),
  notes: z
    .string()
    .max(500, "Notas devem ter no máximo 500 caracteres")
    .optional(),
});

type BookingSchema = z.infer<typeof bookingSchema>;

const generateTimeSlotsAndCheeckAvailability = (
  date: Date,
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
  }
  return slots.map((slot) => {
    const [startStr, endStr] = slot.split(" - ");

    const isTaken = scheduledTimes.some((s) => {
      return (
        isSameDay(new Date(s.date), date) &&
        format(new Date(s.startTime), "HH:mm") === startStr &&
        format(new Date(s.endTime), "HH:mm") === endStr
      );
    });

    return {
      time: slot,
      available: !isTaken,
    };
  });
};

export function BookingForm({
  onSubmit,
  onBack,
  courseId,
  disciplineId,
  timePeriodId,
  date,
}: BookingFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
  });

  async function handleSubmitForm(data: any) {
    const teacher = teachers.find((t) => t.id === data.teacherId);

    await sendSchedulingEmail({
      to: data.email,
      name: teacher!.name,
      date,
      time: data.time.join(", "),
    });

    onSubmit({
      ...data,
      name: teacher!.name,
      time: data.time.join(", "),
    });
  }

  useEffect(() => {
    async function fetch() {
      const data = await getTeacherByCourse(courseId);
      setTeachers(data);
    }

    fetch();
  }, []);

  const timeSlots = generateTimeSlotsAndCheeckAvailability(
    date,
    schedulingTimes,
    timePeriodId
  );
  useEffect(() => {
    async function fetch() {
      const data = await getSchedulingById(disciplineId);
      setSchedulingTimes(data);
    }

    fetch();
  }, [disciplineId]);

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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
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
                      slot.available
                        ? "hover:bg-primary/10 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }
                    disabled={!slot.available}
                    onClick={() => slot.available && toggleTime(slot.time)}
                  >
                    {slot.time}
                    {!slot.available && " (Indisponível)"}
                  </Button>
                ))}
              </div>
            );
          }}
        />
        {errors.time && (
          <p className="text-red-500 text-sm">{errors.time.message}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Controller
            control={control}
            name="teacherId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Professor</SelectLabel>
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
            <p className="text-red-500 text-sm">{errors.teacherId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(99) 9999-9999"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas adicional (Opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Quaisquer pedidos ou informações especiais que devamos saber"
            {...register("notes")}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full">
          Agendar
        </Button>
      </form>
    </>
  );
}
