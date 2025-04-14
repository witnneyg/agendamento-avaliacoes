import { AppointmentScheduler } from "./_components/scheduling";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Agendamento de avaliações
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Selecione seu curso, disciplina, turma, data e horário convenientes
          para você e, em seguida, receba um e-mail de confirmação.
        </p>
        <AppointmentScheduler />
      </div>
    </main>
  );
}
