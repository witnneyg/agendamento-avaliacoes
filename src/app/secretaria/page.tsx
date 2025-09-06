"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, GraduationCap, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeachersTab } from "./secretaria/teachers-tab";
import { CoursesTab } from "./secretaria/coursers-tab";
import { SettingsTab } from "./secretaria/settings-tab";
import DisciplinesTab from "./secretaria/disciplines-tab";
import { NavBar } from "../_components/navbar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="container mx-auto py-6 flex-1">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Painel da Secretaria
              </h1>
              <p className="text-muted-foreground">
                Gerencie o seu sistema de orientação acadêmica
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="teachers">Professores</TabsTrigger>
              <TabsTrigger value="courses">Cursos</TabsTrigger>
              <TabsTrigger value="disciplines">Disciplinas</TabsTrigger>
              {/* <TabsTrigger value="appointments">Agendamentos</TabsTrigger> */}
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Professores
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">
                      +2 em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cursos Ativos
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6</div>
                    <p className="text-xs text-muted-foreground">
                      Todos os departamentos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Disciplinas
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48</div>
                    <p className="text-xs text-muted-foreground">
                      Em todos os cursos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Este Mês
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142</div>
                    <p className="text-xs text-muted-foreground">
                      Agendamentos realizados
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>Últimas ações no sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Novo professor adicionado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dra. Sarah Johnson - Ciência da Computação
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">2h atrás</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Agendamento realizado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Matemática - Álgebra Linear
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">4h atrás</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Disciplina atualizada
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Desenvolvimento Web - Descrição alterada
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">1d atrás</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                      Tarefas administrativas comuns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Novo Professor
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Curso
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Disciplina
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Todos os Agendamentos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="teachers">
              <TeachersTab />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesTab />
            </TabsContent>

            <TabsContent value="disciplines">
              <DisciplinesTab />
            </TabsContent>

            {/* <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent> */}

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
