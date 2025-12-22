"use server";

import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

interface SendDeleteSchedulingEmailProps {
  to: string;
  name: string;
  date: Date;
  time: string;
  courseName: string;
  disciplineName: string;
  className: string;
  deletedBy: string;
  deletedByRole: "admin" | "secretary" | "director" | "professor" | "owner";
}

export async function sendDeleteSchedulingEmail({
  to,
  name,
  date,
  time,
  courseName,
  disciplineName,
  className,
  deletedBy,
  deletedByRole,
}: SendDeleteSchedulingEmailProps) {
  try {
    const formattedDate = format(date, "dd/MM/yyyy");

    console.log(to);

    const roleNames = {
      admin: "Administrador",
      secretary: "Secretaria",
      director: "Diretor",
      professor: "Professor",
      owner: "Próprio usuário",
    };

    const now = new Date();

    const horaAjuste = -3; // Ajuste de -3 horas
    const dataAjustada = new Date(now.getTime() + horaAjuste * 60 * 60 * 1000);

    const formattedDeletionDate = format(dataAjustada, "dd/MM/yyyy HH:mm");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h1 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          🗑️ Agendamento Excluído
        </h1>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Um agendamento foi <strong>excluído</strong>. Seguem os detalhes:</p>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 Detalhes do Agendamento Excluído:</h3>
          <p><strong>Curso:</strong> ${courseName}</p>
          <p><strong>Disciplina:</strong> ${disciplineName}</p>
          <p><strong>Turma:</strong> ${className}</p>
        </div>
        
        <div style="background: #fee2e2; padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #dc2626;">
          <h3 style="color: #7f1d1d; margin-top: 0;">📅 Detalhes da Avaliação Excluída:</h3>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Horário(s):</strong> ${time}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin-top: 0;">👤 Quem Excluiu:</h3>
          <p><strong>Nome:</strong> ${deletedBy}</p>
          <p><strong>Cargo:</strong> ${roleNames[deletedByRole]}</p>
          <p><strong>Data da exclusão:</strong> ${formattedDeletionDate}</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <h3 style="color: #374151; margin-top: 0;">ℹ️ Informações:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Este agendamento foi permanentemente removido do sistema</li>
            <li>Em caso de dúvidas, entre em contato com a administração</li>
            <li>Caso necessário, um novo agendamento pode ser feito</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <em>Este é um e-mail automático de notificação. Por favor, não responda.</em>
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
      // to: to,
      to: "agendamento146@gmail.com",
      subject: `🗑️ Agendamento Excluído - ${courseName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Erro ao enviar email de exclusão:", error);
      return { success: false, error: error.message };
    }

    console.log("Email de exclusão enviado com sucesso. ID:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error("Erro no processo de envio de email de exclusão:", err);
    return { success: false, error: String(err) };
  }
}
