"use server";

import { Resend } from "resend";
import { SchedulingTemplateEmail } from "../api/email/templateEmail";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

interface SendSchedulingEmail {
  to: string;
  name: string;
  date: Date;
  time: string;
}

export async function sendSchedulingEmail({
  to,
  name,
  date,
  time,
}: SendSchedulingEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <onboarding@resend.dev>`,
      // to: to, SO VAI MANDAR PRO EMAIL QND TIVER O DOMINIO,
      to: "agendamento146@gmail.com",
      subject: "Horário agendado com sucesso",
      react: SchedulingTemplateEmail({ name, date, time }),
    });

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
