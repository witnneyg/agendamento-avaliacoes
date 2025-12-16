"use server";

import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

interface SendEditSchedulingEmailProps {
  to: string;
  name: string;
  date: Date;
  time: string;
  originalDate: Date;
  originalTime: string;
  courseName?: string;
  disciplineName?: string;
  className?: string;
}

export async function sendEditSchedulingEmail({
  to,
  name,
  date,
  time,
  originalDate,
  originalTime,
  courseName,
  disciplineName,
  className,
}: SendEditSchedulingEmailProps) {
  try {
    const formattedDate = format(date, "dd/MM/yyyy");
    const formattedOriginalDate = format(originalDate, "dd/MM/yyyy");
    console.log(to);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          ✏️ Agendamento Atualizado
        </h1>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Seu agendamento foi <strong>atualizado com sucesso</strong>. Seguem os detalhes:</p>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 Detalhes Gerais:</h3>
          <p><strong>Curso:</strong> ${courseName}</p>
          <p><strong>Disciplina:</strong> ${disciplineName}</p>
          <p><strong>Turma:</strong> ${className}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <h3 style="color: #374151; margin-top: 0;">📅 Detalhes Anteriores:</h3>
          <p><strong>Data:</strong> ${formattedOriginalDate}</p>
          <p><strong>Horário(s):</strong> ${originalTime}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-top: 0;">✅ Novos Detalhes:</h3>
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
      //   to: to,
      to: "agendamento146@gmail.com",
      subject: `✏️ Agendamento atualizado - ${courseName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Erro ao enviar email de edição:", error);
      return { success: false, error: error.message };
    }

    console.log("Email de edição enviado com sucesso. ID:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error("Erro no processo de envio de email de edição:", err);
    return { success: false, error: String(err) };
  }
}
