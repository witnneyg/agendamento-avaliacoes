import { NavBar } from "./_components/navbar";
import { Scheduling } from "./_components/scheduling";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="container mx-auto py-10 flex-1">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Agendamento de avaliações
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Selecione seu curso, disciplina, turma, data e horário convenientes
            para você e, em seguida, receba um e-mail de confirmação.
          </p>
          <Scheduling />
        </div>
      </main>
      <footer className="border-t py-6 relative">
        <div className="absolute bottom-0 left-0 container text-sm text-muted-foreground p-4 ">
          <p>
            DESENVOLVIDO POR Giuseppe Moreira Vitória Da Silva, Manoel José De
            Araújo Neto, Witnney Gabriel Cardoso Sousa
          </p>
        </div>
      </footer>
    </div>
  );
}
