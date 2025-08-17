"use server";

import { Resend } from "resend";
import { SchedulingTemplateEmail } from "../api/email/templateEmail";

const resend = new Resend("re_Lnb9Jysb_9VwC5NzmoHGQiYLf8Wnhvrba");

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
      from: "Acme <onboarding@resend.dev>",
      to: ["witnneygabriel13@gmail.com"],
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
