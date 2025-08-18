"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Search, Filter } from "lucide-react";
import { useAppointments } from "@/app/context/appointment";
import { AppointmentModal } from "../scheduling-modal";

export function AppointmentsTab() {
  const { appointments } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.details.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.disciplineName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (date: Date) => {
    const now = new Date();
    const appointmentDate = new Date(date);

    if (appointmentDate < now) {
      return <Badge variant="secondary">Concluído</Badge>;
    } else if (appointmentDate.toDateString() === now.toDateString()) {
      return <Badge variant="default">Hoje</Badge>;
    } else {
      return <Badge variant="outline">Agendado</Badge>;
    }
  };

  const handleViewAppointment = (appointment: (typeof appointments)[0]) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agendamentos</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os agendamentos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar agendamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter(
                  (apt) =>
                    new Date(apt.date).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter((apt) => {
                  const appointmentDate = new Date(apt.date);
                  const now = new Date();
                  const weekFromNow = new Date(
                    now.getTime() + 7 * 24 * 60 * 60 * 1000
                  );
                  return (
                    appointmentDate >= now && appointmentDate <= weekFromNow
                  );
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Agendamentos</CardTitle>
          <CardDescription>
            {filteredAppointments.length} agendamentos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Data & Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment: any) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {appointment.details.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.details.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.course.title}</TableCell>
                  <TableCell>{appointment.discipline.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {format(appointment.date, "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.date)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
