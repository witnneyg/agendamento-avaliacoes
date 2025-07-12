import { Course, Period } from "./_components/course-selector";
import { Discipline } from "./_components/discipline-selector";
import { Semester } from "./_components/semester-selector";

import {
  BookOpen,
  Calculator,
  Microscope,
  Brain,
  Code,
  Briefcase,
  Leaf,
  FileText,
  Gavel,
  Dumbbell,
  Syringe,
  Hammer,
  Activity,
  PawPrint,
  GraduationCap,
  Smile,
} from "lucide-react";

export const academicCourses: Course[] = [
  {
    id: "itManagement",
    title: "Gestão da Tecnologia da Informação",
    icon: <Code className="h-6 w-6 text-primary" />,
    description:
      "Programação, algoritmos, ciência de dados e inteligência artificial",
    periods: [Period.EVENING],
  },
  {
    id: "medicine",
    title: "Medicina",
    icon: <Microscope className="h-6 w-6 text-primary" />,
    description: "Ciências médicas, saúde e estudos clínicos",
    periods: [Period.MORNING, Period.AFTERNOON],
  },
  {
    id: "psychology",
    title: "Psicologia",
    icon: <Brain className="h-6 w-6 text-primary" />,
    description: "Comportamento humano, processos cognitivos e saúde mental",
    periods: [Period.EVENING],
  },
  {
    id: "administration",
    title: "Administração",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    description: "Gestão empresarial, finanças, marketing e empreendedorismo",
    periods: [Period.EVENING],
  },
  {
    id: "agronomy",
    title: "Agronomia",
    icon: <Leaf className="h-6 w-6 text-primary" />,
    description:
      "Agricultura, manejo de solo, produção vegetal e sustentabilidade",
    periods: [Period.EVENING],
  },
  {
    id: "accounting",
    title: "Ciências Contábeis",
    icon: <FileText className="h-6 w-6 text-primary" />,
    description:
      "Contabilidade, auditoria, controladoria e planejamento financeiro",
    periods: [Period.EVENING],
  },
  {
    id: "law",
    title: "Direito",
    icon: <Gavel className="h-6 w-6 text-primary" />,
    description:
      "Leis, justiça, direito civil, penal, trabalhista e constitucional",
    periods: [Period.EVENING],
  },
  {
    id: "physicalEducation",
    title: "Educação Física",
    icon: <Dumbbell className="h-6 w-6 text-primary" />,
    description: "Atividade física, saúde, esportes e qualidade de vida",
    periods: [Period.EVENING],
  },
  {
    id: "nursing",
    title: "Enfermagem",
    icon: <Syringe className="h-6 w-6 text-primary" />,
    description: "Cuidado ao paciente, saúde pública e práticas clínicas",
    periods: [Period.EVENING],
  },
  {
    id: "civilEngineering",
    title: "Engenharia Civil",
    icon: <Hammer className="h-6 w-6 text-primary" />,
    description:
      "Construção civil, estruturas, geotecnia e planejamento urbano",
    periods: [Period.EVENING],
  },
  {
    id: "physiotherapy",
    title: "Fisioterapia",
    icon: <Activity className="h-6 w-6 text-primary" />,
    description: "Reabilitação física, terapias manuais e biomecânica",
    periods: [Period.EVENING],
  },
  {
    id: "literature",
    title: "Letras",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    description: "Linguística, literatura, tradução e ensino de idiomas",
    periods: [Period.EVENING],
  },
  {
    id: "veterinary",
    title: "Medicina Veterinária",
    icon: <PawPrint className="h-6 w-6 text-primary" />,
    description:
      "Saúde animal, clínica veterinária, zootecnia e bem-estar animal",
    periods: [Period.EVENING],
  },
  {
    id: "dentistry",
    title: "Odontologia",
    icon: <Smile className="h-6 w-6 text-primary" />,
    description: "Saúde bucal, ortodontia, periodontia e odontopediatria",
    periods: [Period.EVENING],
  },
  {
    id: "pedagogy",
    title: "Pedagogia",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    description:
      "Educação, didática, psicologia da aprendizagem e gestão escolar",
    periods: [Period.EVENING],
  },
];

export const semestersByCourse: Record<string, Semester[]> = {
  medicine: [
    {
      id: "first",
      title: "1º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Medicina",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Segundo período de Medicina",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Medicina",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Quarto período de Medicina",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Quinto período de Medicina",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Sexto período de Medicina",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Medicina",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Medicina",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Nono período de Medicina",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Décimo período de Medicina",
    },
    {
      id: "eleventh",
      title: "11º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Décimo primeiro período de Medicina",
    },
    {
      id: "twelfth",
      title: "12º Período",
      icon: <Microscope className="h-6 w-6 text-primary" />,
      description: "Décimo segundo período de Medicina",
    },
  ],
  psychology: [
    {
      id: "first",
      title: "1º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Psicologia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Segundo período de Psicologia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Psicologia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Quarto período de Psicologia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Quinto período de Psicologia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Sexto período de Psicologia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Psicologia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Psicologia",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Nono período de Psicologia",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Brain className="h-6 w-6 text-primary" />,
      description: "Décimo período de Psicologia",
    },
  ],
  administration: [
    {
      id: "first",
      title: "1º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Administração",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Segundo período de Administração",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Administração",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Quarto período de Administração",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Quinto período de Administração",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Sexto período de Administração",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Administração",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Administração",
    },
  ],
  agronomy: [
    {
      id: "first",
      title: "1º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Agronomia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Segundo período de Agronomia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Agronomia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Quarto período de Agronomia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Quinto período de Agronomia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Sexto período de Agronomia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Agronomia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Agronomia",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Nono período de Agronomia",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      description: "Décimo período de Agronomia",
    },
  ],
  accounting: [
    {
      id: "first",
      title: "1º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Ciências Contábeis",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Segundo período de Ciências Contábeis",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Ciências Contábeis",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Quarto período de Ciências Contábeis",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Quinto período de Ciências Contábeis",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Sexto período de Ciências Contábeis",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Ciências Contábeis",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Ciências Contábeis",
    },
  ],
  law: [
    {
      id: "first",
      title: "1º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Direito",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Segundo período de Direito",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Direito",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Quarto período de Direito",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Quinto período de Direito",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Sexto período de Direito",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Direito",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Gavel className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Direito",
    },
  ],
  physicalEducation: [
    {
      id: "first",
      title: "1º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Educação Física",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Segundo período de Educação Física",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Educação Física",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Quarto período de Educação Física",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Quinto período de Educação Física",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Sexto período de Educação Física",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Educação Física",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Educação Física",
    },
  ],
  nursing: [
    {
      id: "first",
      title: "1º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Enfermagem",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Segundo período de Enfermagem",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Enfermagem",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Quarto período de Enfermagem",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Quinto período de Enfermagem",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Sexto período de Enfermagem",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Enfermagem",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Enfermagem",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Nono período de Enfermagem",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Syringe className="h-6 w-6 text-primary" />,
      description: "Décimo período de Enfermagem",
    },
  ],
  civilEngineering: [
    {
      id: "first",
      title: "1º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Engenharia Civil",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Segundo período de Engenharia Civil",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Engenharia Civil",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Quarto período de Engenharia Civil",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Quinto período de Engenharia Civil",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Sexto período de Engenharia Civil",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Engenharia Civil",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Engenharia Civil",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Nono período de Engenharia Civil",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Hammer className="h-6 w-6 text-primary" />,
      description: "Décimo período de Engenharia Civil",
    },
  ],
  physiotherapy: [
    {
      id: "first",
      title: "1º Período",
      icon: <Activity className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Fisioterapia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Activity className="h-6 w-6 text-primary" />,
      description: "Segundo período de Fisioterapia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Activity className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Fisioterapia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Activity className="h-6 w-6 text-primary" />,
      description: "Quarto período de Fisioterapia",
    },
  ],
  itManagement: [
    {
      id: "first",
      title: "1º Período",
      icon: <Code className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Gestão de TI",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Code className="h-6 w-6 text-primary" />,
      description: "Segundo período de Gestão de TI",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Code className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Gestão de TI",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Code className="h-6 w-6 text-primary" />,
      description: "Quarto período de Gestão de TI",
    },
  ],
  literature: [
    {
      id: "first",
      title: "1º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Letras",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Segundo período de Letras",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Letras",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Quarto período de Letras",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Quinto período de Letras",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Sexto período de Letras",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Letras",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Letras",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Nono período de Letras",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Décimo período de Letras",
    },
    {
      id: "eleventh",
      title: "11º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Décimo primeiro período de Letras",
    },
    {
      id: "twelfth",
      title: "12º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Décimo segundo período de Letras",
    },
  ],
  veterinary: [
    {
      id: "first",
      title: "1º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Medicina Veterinária",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Segundo período de Medicina Veterinária",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Medicina Veterinária",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Quarto período de Medicina Veterinária",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Quinto período de Medicina Veterinária",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Sexto período de Medicina Veterinária",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Medicina Veterinária",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Medicina Veterinária",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Nono período de Medicina Veterinária",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <PawPrint className="h-6 w-6 text-primary" />,
      description: "Décimo período de Medicina Veterinária",
    },
  ],
  dentistry: [
    {
      id: "first",
      title: "1º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Odontologia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Segundo período de Odontologia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Odontologia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Quarto período de Odontologia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Quinto período de Odontologia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Sexto período de Odontologia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Odontologia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Odontologia",
    },
    {
      id: "ninth",
      title: "9º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Nono período de Odontologia",
    },
    {
      id: "tenth",
      title: "10º Período",
      icon: <Smile className="h-6 w-6 text-primary" />,
      description: "Décimo período de Odontologia",
    },
  ],
  pedagogy: [
    {
      id: "first",
      title: "1º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Pedagogia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Segundo período de Pedagogia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Pedagogia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Quarto período de Pedagogia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Quinto período de Pedagogia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Sexto período de Pedagogia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Pedagogia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Pedagogia",
    },
  ],
};

export const disciplinesBySemesterAndDepartment: Record<
  string,
  Record<string, Discipline[]>
> = {
  itManagement: {
    first: [
      {
        id: "intro-programming",
        title: "Introduction to Programming",
        description: "Fundamentals of programming using Python",
      },
      {
        id: "discrete-math",
        title: "Discrete Mathematics",
        description: "Mathematical foundations for computer science",
      },
    ],
    second: [
      {
        id: "data-structures",
        title: "Data Structures",
        description: "Implementation and analysis of data structures",
      },
      {
        id: "algorithms",
        title: "Algorithms",
        description: "Design and analysis of algorithms",
      },
    ],
    third: [
      {
        id: "web-dev",
        title: "Web Development",
        description: "Building web applications with modern technologies",
      },
      {
        id: "databases",
        title: "Database Systems",
        description: "Design and implementation of database systems",
      },
    ],
    fourth: [
      {
        id: "ai-intro",
        title: "Introduction to AI",
        description: "Foundations of artificial intelligence",
      },
      {
        id: "mobile-dev",
        title: "Mobile App Development",
        description: "Building applications for iOS and Android",
      },
    ],
  },
  medicine: {
    first: [
      {
        id: "anatomy-1",
        title: "Anatomia Aplicada a Medicina I",
        description: "Structure of the human body",
      },
      {
        id: "2",
        title: "Genética Geral",
        description: "Biochemical processes in the human body",
      },
      {
        id: "3",
        title: "Biologia Celular e Molecular",
        description: "Biochemical processes in the human body",
      },
      {
        id: "4",
        title: "Biofísica Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "5",
        title: "Embriologia",
        description: "Biochemical processes in the human body",
      },
      {
        id: "6",
        title: "Bioética",
        description: "Biochemical processes in the human body",
      },
      {
        id: "7",
        title: "Fisiologia Humana I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "8",
        title: "Casos Clinicos Colaborativos I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "9",
        title: "Habilidades Médicas I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "10",
        title: "MISCO - Medicina Integrada à Comunidade I",
        description: "Biochemical processes in the human body",
      },
    ],
    second: [
      {
        id: "anatomy-1",
        title: "Anatomia Aplicada a Medicina II",
        description: "Structure of the human body",
      },
      {
        id: "2",
        title: "Psicologia Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "3",
        title: "Metodologia Científica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "biochemistry",
        title: "Bioquímica I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "4",
        title: "Histologia Humana I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "5",
        title: "Parasitologia Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "6",
        title: "Habilidades Médicas II",
        description: "Biochemical processes in the human body",
      },
      {
        id: "7",
        title: "Casos Clinicos Colaborativos II",
        description: "Biochemical processes in the human body",
      },
      {
        id: "8",
        title: "MISCO - Medicina Integrada à Comunidade II",
        description: "Biochemical processes in the human body",
      },
    ],
    third: [
      {
        id: "pharmacology",
        title: "Basic Pharmacology",
        description: "Principles of drug action",
      },
      {
        id: "pathology",
        title: "General Pathology",
        description: "Mechanisms of disease",
      },
    ],
    fourth: [
      {
        id: "clinical-skills",
        title: "Clinical Skills",
        description: "Basic clinical examination techniques",
      },
      {
        id: "medical-ethics",
        title: "Medical Ethics",
        description: "Ethical issues in medicine",
      },
    ],
  },
  psychology: {
    first: [
      {
        id: "intro-psych",
        title: "Introduction to Psychology",
        description: "Overview of psychological principles",
      },
      {
        id: "developmental",
        title: "Developmental Psychology",
        description: "Psychological development across the lifespan",
      },
    ],
    second: [
      {
        id: "cognitive",
        title: "Cognitive Psychology",
        description: "Mental processes such as thinking and memory",
      },
      {
        id: "social",
        title: "Social Psychology",
        description:
          "How people's thoughts and behaviors are influenced by others",
      },
    ],
    third: [
      {
        id: "abnormal",
        title: "Abnormal Psychology",
        description: "Psychological disorders and treatments",
      },
      {
        id: "personality",
        title: "Personality Psychology",
        description: "Theories and research on personality",
      },
    ],
    fourth: [
      {
        id: "clinical",
        title: "Clinical Psychology",
        description: "Assessment and treatment of mental disorders",
      },
      {
        id: "health",
        title: "Health Psychology",
        description: "Psychological factors in health and illness",
      },
    ],
  },
};

export const teacherByDisciplines: Record<string, string[]> = {
  itManagement: ["Vinicius", "Pauliane", "Paulo", "Reginaldo", "Messias"],
  medicine: [
    "medicina prof1",
    "medicina prof2",
    "medicina prof3",
    "medicina prof4",
    "medicina prof5",
  ],
  psychology: [
    "psicologia prof1",
    "psicologia prof2",
    "psicologia prof3",
    "psicologia prof4",
    "psicologia prof5",
  ],
  administration: [
    "adm prof1",
    "adm prof2",
    "adm prof3",
    "adm prof4",
    "adm prof5",
  ],
};
