"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Bell, Calendar, Shield } from "lucide-react";

export function SettingsTab() {
  const [settings, setSettings] = useState({
    systemName: "Sistema de Aconselhamento Acadêmico",
    systemDescription:
      "Agendamento completo de consultas para aconselhamento acadêmico",
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    autoConfirmation: true,
    maxAppointmentsPerDay: 8,
    appointmentDuration: 60,
    workingHoursStart: "08:00",
    workingHoursEnd: "17:00",
  });

  const handleSave = () => {
    console.log("Configurações salvas:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Configure preferências e opções do sistema
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>Configuração básica do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">Nome do Sistema</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    systemName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemDescription">Descrição do Sistema</Label>
              <Textarea
                id="systemDescription"
                value={settings.systemDescription}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    systemDescription: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure preferências de notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações por email para agendamentos
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar lembretes por SMS para os alunos
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    smsNotifications: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de Agendamento</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar lembretes 24 horas antes dos agendamentos
                </p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    appointmentReminders: checked,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Configurações de Agendamento
            </CardTitle>
            <CardDescription>
              Configure opções de agendamento de consultas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmação Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Confirmar automaticamente novos agendamentos
                </p>
              </div>
              <Switch
                checked={settings.autoConfirmation}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoConfirmation: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAppointments">Máx. Agendamentos/Dia</Label>
                <Input
                  id="maxAppointments"
                  type="number"
                  value={settings.maxAppointmentsPerDay}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxAppointmentsPerDay: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={settings.appointmentDuration}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appointmentDuration: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Início do Expediente</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      workingHoursStart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fim do Expediente</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      workingHoursEnd: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
