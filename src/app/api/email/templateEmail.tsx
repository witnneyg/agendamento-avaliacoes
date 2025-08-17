import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";
import { format } from "date-fns";

interface AppointmentConfirmedProps {
  name: string;
  date: Date;
  time: string;
}

export function SchedulingTemplateEmail({
  name,
  date,
  time,
}: AppointmentConfirmedProps) {
  const dateFormated = format(date, "dd/MM/yy");

  return (
    <Html>
      <Head />
      <Preview>Seu horário foi agendado com sucesso!</Preview>
      <Body
        style={{
          backgroundColor: "#f6f6f6",
          fontFamily: "Arial",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ color: "#333" }}>
            Confirmação de Agendamento
          </Heading>
          <Text>
            Olá <strong>{name}</strong>,
          </Text>
          <Text>Seu horário foi agendado para:</Text>
          <Section>
            <Text>
              📅 <strong>{dateFormated}</strong> <br />
              🕒 <strong>{time}</strong>
            </Text>
          </Section>
          <Text>
            Obrigado por agendar conosco! Nos vemos no dia e hora marcados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
