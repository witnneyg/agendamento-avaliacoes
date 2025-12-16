"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Scheduling } from "@prisma/client";
import { getSchedulingById } from "../_actions/scheduling/get-scheduling-by-id";
import { isSameDay, format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeacherByCourse } from "../_actions/teacher/get-teacher-by-disciplines";

interface Teacher {
  name: string;
  id: string;
}

interface TimeAndDetailsFormProps {
  date: Date;
  disciplineId: string;
  timePeriodId: string;
  courseId: string;
  onBack: () => void;
  onSubmit: (details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    time: string;
  }) => void;
}

const bookingSchema = z.object({
  name: z.string().nonempty("Selecione o nome"),
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
  time: z.string().nonempty("Selecione um horário"),
});

type BookingSchema = z.infer<typeof bookingSchema>;

export function TimeAndDetailsForm({
  date,
  disciplineId,
  timePeriodId,
  courseId,
  onBack,
  onSubmit,
}: TimeAndDetailsFormProps) {
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>([]);
  const [teacher, setTeacher] = useState<Teacher[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
  });

  const generateTimeSlots = (
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

    if (timePeriodId === "morning") slots = morningSlots;
    if (timePeriodId === "afternoon") slots = afternoonSlots;
    if (timePeriodId === "evening") slots = eveningSlots;

    return slots.map((slot) => {
      const [startStr, endStr] = slot.split(" - ");
      const isTaken = scheduledTimes.some(
        (s) =>
          isSameDay(new Date(s.date), date) &&
          format(new Date(s.startTime), "HH:mm") === startStr &&
          format(new Date(s.endTime), "HH:mm") === endStr
      );
      return { time: slot, available: !isTaken };
    });
  };

  const timeSlots = generateTimeSlots(date, schedulingTimes, timePeriodId);

  useEffect(() => {
    async function fetchData() {
      const scheds = await getSchedulingById(disciplineId);
      setSchedulingTimes(scheds);
      const teachers = await getTeacherByCourse(courseId);
      setTeacher(teachers);
    }
    fetchData();
  }, [disciplineId, courseId]);

  async function handleSubmitForm(data: any) {
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-2"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot, index) => (
          <Controller
            key={index}
            name="time"
            control={control}
            render={({ field }) => (
              <Button
                type="button"
                variant={
                  slot.available && field.value === slot.time
                    ? "default"
                    : slot.available
                      ? "outline"
                      : "ghost"
                }
                disabled={!slot.available}
                className={
                  slot.available
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
                onClick={() => field.onChange(slot.time)}
              >
                {slot.time} {!slot.available && " (Indisponível)"}
              </Button>
            )}
          />
        ))}
      </div>
      {errors.time && (
        <p className="text-red-500 text-sm">{errors.time.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nome" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Professor</SelectLabel>
                  {teacher.map(({ id, name }) => (
                    <SelectItem key={id} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
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
          {...register("phone")}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionais (Opcional)</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      <Button type="submit" className="w-full">
        Confirmar Agendamento
      </Button>
    </form>
  );
}
