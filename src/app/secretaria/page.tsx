"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeachersTab } from "../_components/teachers-tab";
import { CoursesTab } from "../_components/coursers-tab";
import DisciplinesTab from "../_components/disciplines-tab";
import { ClassesTab } from "../_components/classes-tab";
import { NavBar } from "../_components/navbar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses" className="cursor-pointer">
                Cursos
              </TabsTrigger>
              <TabsTrigger value="classes" className="cursor-pointer">
                Turmas
              </TabsTrigger>
              <TabsTrigger value="disciplines" className="cursor-pointer">
                Disciplinas
              </TabsTrigger>
              <TabsTrigger value="teachers" className="cursor-pointer">
                Professores
              </TabsTrigger>
              {/* <TabsTrigger value="settings" className="cursor-pointer">
                Configurações
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="courses">
              <CoursesTab />
            </TabsContent>
            <TabsContent value="classes">
              <ClassesTab />
            </TabsContent>
            <TabsContent value="disciplines">
              <DisciplinesTab />
            </TabsContent>
            <TabsContent value="teachers">
              <TeachersTab />
            </TabsContent>
            {/* <TabsContent value="settings">
              <SettingsTab />
            </TabsContent> */}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
