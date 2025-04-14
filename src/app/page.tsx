import { AppointmentScheduler } from "./_components/scheduling";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Academic Advising Appointment
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Select your department, choose a date and time that works for you, and
          connect you with an academic advisor.
        </p>
        <AppointmentScheduler />
      </div>
    </main>
  );
}
