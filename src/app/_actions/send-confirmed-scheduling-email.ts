// eslint-disable-next-line @typescript-eslint/no-unused-vars

"use server";

import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

interface SendConfirmationSchedulingEmailProps {
  to: string;
  name: string;
  date: Date;
  time: string;
  courseName?: string;
  disciplineName?: string;
  className?: string;
}

export async function sendConfirmationSchedulingEmail({
  to,
  name,
  date,
  time,
  courseName,
  disciplineName,
  className,
}: SendConfirmationSchedulingEmailProps) {
  try {
    const formattedDate = format(date, "dd/MM/yyyy");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h1 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
          ✅ Agendamento Confirmado!
        </h1>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Seu agendamento de avaliação foi <strong>realizado com sucesso</strong>. Seguem os detalhes:</p>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 Detalhes do Agendamento:</h3>
          <p><strong>Curso:</strong> ${courseName}</p>
          <p><strong>Disciplina:</strong> ${disciplineName}</p>
          <p><strong>Turma:</strong> ${className}</p>
        </div>
        
        <div style="background: #d1fae5; padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #10b981;">
          <h3 style="color: #065f46; margin-top: 0;">📅 Detalhes da Avaliação:</h3>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Horário(s):</strong> ${time}</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <em>Este é um e-mail automático de confirmação. Por favor, não responda.</em>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Atenciosamente,<br/>
          <strong>Sistema de Agendamento de Avaliações</strong><br/>
          Unicerrado</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || "Agendamentos"} <onboarding@resend.dev>`,
      //   to: to, // Usar o email real
      to: "agendamento146@gmail.com",

      subject: `✅ Agendamento Confirmado - ${courseName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Erro ao enviar email de confirmação:", error);
      return { success: false, error: error.message };
    }

    console.log("Email de confirmação enviado com sucesso. ID:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error("Erro no processo de envio de email de confirmação:", err);
    return { success: false, error: String(err) };
  }
}
