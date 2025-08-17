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
  }) => void;
  onBack: () => void;
  courseId: string;
  date: Date;
  time: string;
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
});

type BookingSchema = z.infer<typeof bookingSchema>;

export function BookingForm({
  onSubmit,
  onBack,
  courseId,
  date,
  time,
}: BookingFormProps) {
  const [teacher, setTeacher] = useState<Teacher[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
  });

  async function handleSubmitForm(data: any) {
    await sendSchedulingEmail({
      to: data.email,
      name: data.name,
      date,
      time,
    });

    onSubmit(data);
  }

  useEffect(() => {
    async function fetch() {
      const data = await getTeacherByCourse(courseId);
      setTeacher(data);
    }

    fetch();
  }, []);

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
        Voltar aos horários
      </Button>

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
                  {teacher.map(({ name, id }) => (
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
  );
}
