import { Course } from "./_components/course-selector";
import { Discipline } from "./_components/discipline-selector";
import { Semester } from "./_components/semester-selector";
import { Period } from "@prisma/client";

import { Sun, Sunset, Moon } from "lucide-react";
import { TimePeriod } from "./_components/time-period.selector";

export const academicCourses: Course[] = [
  {
    id: "itManagement",
    name: "Gestão da Tecnologia da Informação",
    description:
      "Programação, algoritmos, ciência de dados e inteligência artificial",
    periods: [Period.EVENING],
  },
  {
    id: "medicine",
    name: "Medicina",
    description: "Ciências médicas, saúde e estudos clínicos",
    periods: [Period.MORNING, Period.AFTERNOON],
  },
  {
    id: "psychology",
    name: "Psicologia",
    description: "Comportamento humano, processos cognitivos e saúde mental",
    periods: [Period.EVENING],
  },
  {
    id: "administration",
    name: "Administração",
    description: "Gestão empresarial, finanças, marketing e empreendedorismo",
    periods: [Period.EVENING],
  },
  {
    id: "agronomy",
    name: "Agronomia",
    description:
      "Agricultura, manejo de solo, produção vegetal e sustentabilidade",
    periods: [Period.EVENING],
  },
  {
    id: "accounting",
    name: "Ciências Contábeis",
    description:
      "Contabilidade, auditoria, controladoria e planejamento financeiro",
    periods: [Period.EVENING],
  },
  {
    id: "law",
    name: "Direito",
    description:
      "Leis, justiça, direito civil, penal, trabalhista e constitucional",
    periods: [Period.EVENING],
  },
  {
    id: "physicalEducation",
    name: "Educação Física",
    description: "Atividade física, saúde, esportes e qualidade de vida",
    periods: [Period.EVENING],
  },
  {
    id: "nursing",
    name: "Enfermagem",
    description: "Cuidado ao paciente, saúde pública e práticas clínicas",
    periods: [Period.EVENING],
  },
  {
    id: "civilEngineering",
    name: "Engenharia Civil",
    description:
      "Construção civil, estruturas, geotecnia e planejamento urbano",
    periods: [Period.EVENING],
  },
  {
    id: "physiotherapy",
    name: "Fisioterapia",
    description: "Reabilitação física, terapias manuais e biomecânica",
    periods: [Period.EVENING],
  },
  {
    id: "literature",
    name: "Letras",
    description: "Linguística, literatura, tradução e ensino de idiomas",
    periods: [Period.EVENING],
  },
  {
    id: "veterinary",
    name: "Medicina Veterinária",
    description:
      "Saúde animal, clínica veterinária, zootecnia e bem-estar animal",
    periods: [Period.EVENING],
  },
  {
    id: "dentistry",
    name: "Odontologia",
    description: "Saúde bucal, ortodontia, periodontia e odontopediatria",
    periods: [Period.EVENING],
  },
  {
    id: "pedagogy",
    name: "Pedagogia",
    description:
      "Educação, didática, psicologia da aprendizagem e gestão escolar",
    periods: [Period.EVENING],
  },
];

export const semestersByCourse: Record<string, Semester[]> = {
  medicine: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Medicina",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Medicina",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Medicina",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Medicina",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Medicina",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Medicina",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Medicina",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Medicina",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Medicina",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Medicina",
    },
    {
      id: "eleventh",
      name: "11º Período",
      description: "Décimo primeiro período de Medicina",
    },
    {
      id: "twelfth",
      name: "12º Período",
      description: "Décimo segundo período de Medicina",
    },
  ],
  psychology: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Psicologia",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Psicologia",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Psicologia",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Psicologia",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Psicologia",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Psicologia",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Psicologia",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Psicologia",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Psicologia",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Psicologia",
    },
  ],
  administration: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Administração",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Administração",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Administração",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Administração",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Administração",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Administração",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Administração",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Administração",
    },
  ],
  agronomy: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Agronomia",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Agronomia",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Agronomia",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Agronomia",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Agronomia",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Agronomia",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Agronomia",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Agronomia",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Agronomia",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Agronomia",
    },
  ],
  accounting: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Ciências Contábeis",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Ciências Contábeis",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Ciências Contábeis",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Ciências Contábeis",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Ciências Contábeis",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Ciências Contábeis",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Ciências Contábeis",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Ciências Contábeis",
    },
  ],
  law: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Direito",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Direito",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Direito",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Direito",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Direito",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Direito",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Direito",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Direito",
    },
  ],
  physicalEducation: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Educação Física",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Educação Física",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Educação Física",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Educação Física",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Educação Física",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Educação Física",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Educação Física",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Educação Física",
    },
  ],
  nursing: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Enfermagem",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Enfermagem",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Enfermagem",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Enfermagem",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Enfermagem",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Enfermagem",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Enfermagem",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Enfermagem",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Enfermagem",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Enfermagem",
    },
  ],
  civilEngineering: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Engenharia Civil",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Engenharia Civil",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Engenharia Civil",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Engenharia Civil",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Engenharia Civil",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Engenharia Civil",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Engenharia Civil",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Engenharia Civil",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Engenharia Civil",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Engenharia Civil",
    },
  ],
  physiotherapy: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Fisioterapia",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Fisioterapia",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Fisioterapia",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Fisioterapia",
    },
  ],
  itManagement: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Gestão de TI",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Gestão de TI",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Gestão de TI",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Gestão de TI",
    },
  ],
  literature: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Letras",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Letras",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Letras",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Letras",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Letras",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Letras",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Letras",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Letras",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Letras",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Letras",
    },
    {
      id: "eleventh",
      name: "11º Período",
      description: "Décimo primeiro período de Letras",
    },
    {
      id: "twelfth",
      name: "12º Período",
      description: "Décimo segundo período de Letras",
    },
  ],
  veterinary: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Medicina Veterinária",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Medicina Veterinária",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Medicina Veterinária",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Medicina Veterinária",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Medicina Veterinária",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Medicina Veterinária",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Medicina Veterinária",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Medicina Veterinária",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Medicina Veterinária",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Medicina Veterinária",
    },
  ],
  dentistry: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Odontologia",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Odontologia",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Odontologia",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Odontologia",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Odontologia",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Odontologia",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Odontologia",
    },
    {
      id: "eighth",
      name: "8º Período",
      description: "Oitavo período de Odontologia",
    },
    {
      id: "ninth",
      name: "9º Período",
      description: "Nono período de Odontologia",
    },
    {
      id: "tenth",
      name: "10º Período",
      description: "Décimo período de Odontologia",
    },
  ],
  pedagogy: [
    {
      id: "first",
      name: "1º Período",
      description: "Primeiro período de Pedagogia",
    },
    {
      id: "second",
      name: "2º Período",
      description: "Segundo período de Pedagogia",
    },
    {
      id: "third",
      name: "3º Período",
      description: "Terceiro período de Pedagogia",
    },
    {
      id: "fourth",
      name: "4º Período",
      description: "Quarto período de Pedagogia",
    },
    {
      id: "fifth",
      name: "5º Período",
      description: "Quinto período de Pedagogia",
    },
    {
      id: "sixth",
      name: "6º Período",
      description: "Sexto período de Pedagogia",
    },
    {
      id: "seventh",
      name: "7º Período",
      description: "Sétimo período de Pedagogia",
    },
    {
      id: "eighth",
      name: "8º Período",
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
        name: "Introduction to Programming",
      },
      {
        id: "discrete-math",
        name: "Discrete Mathematics",
      },
    ],
    second: [
      {
        id: "data-structures",
        name: "Data Structures",
      },
      {
        id: "algorithms",
        name: "Algorithms",
      },
    ],
    third: [
      {
        id: "web-dev",
        name: "Web Development",
      },
      {
        id: "databases",
        name: "Database Systems",
      },
    ],
    fourth: [
      {
        id: "ai-intro",
        name: "Introduction to AI",
      },
      {
        id: "mobile-dev",
        name: "Mobile App Development",
      },
    ],
  },
  medicine: {
    first: [
      {
        id: "anatomy-1",
        name: "Anatomia Aplicada a Medicina I",
      },
      {
        id: "2",
        name: "Genética Geral",
      },
      {
        id: "3",
        name: "Biologia Celular e Molecular",
      },
      {
        id: "4",
        name: "Biofísica Médica",
      },
      {
        id: "5",
        name: "Embriologia",
      },
      {
        id: "6",
        name: "Bioética",
      },
      {
        id: "7",
        name: "Fisiologia Humana I",
      },
      {
        id: "8",
        name: "Casos Clinicos Colaborativos I",
      },
      {
        id: "9",
        name: "Habilidades Médicas I",
      },
      {
        id: "10",
        name: "MISCO - Medicina Integrada à Comunidade I",
      },
    ],
    second: [
      {
        id: "anatomy-1",
        name: "Anatomia Aplicada a Medicina II",
      },
      {
        id: "2",
        name: "Psicologia Médica",
      },
      {
        id: "3",
        name: "Metodologia Científica",
      },
      {
        id: "biochemistry",
        name: "Bioquímica I",
      },
      {
        id: "4",
        name: "Histologia Humana I",
      },
      {
        id: "5",
        name: "Parasitologia Médica",
      },
      {
        id: "6",
        name: "Habilidades Médicas II",
      },
      {
        id: "7",
        name: "Casos Clinicos Colaborativos II",
      },
      {
        id: "8",
        name: "MISCO - Medicina Integrada à Comunidade II",
      },
    ],
    third: [
      {
        id: "pharmacology",
        name: "Basic Pharmacology",
      },
      {
        id: "pathology",
        name: "General Pathology",
      },
    ],
    fourth: [
      {
        id: "clinical-skills",
        name: "Clinical Skills",
      },
      {
        id: "medical-ethics",
        name: "Medical Ethics",
      },
    ],
  },
  psychology: {
    first: [
      {
        id: "intro-psych",
        name: "Introduction to Psychology",
      },
      {
        id: "developmental",
        name: "Developmental Psychology",
      },
    ],
    second: [
      {
        id: "cognitive",
        name: "Cognitive Psychology",
      },
      {
        id: "social",
        name: "Social Psychology",
      },
    ],
    third: [
      {
        id: "abnormal",
        name: "Abnormal Psychology",
      },
      {
        id: "personality",
        name: "Personality Psychology",
      },
    ],
    fourth: [
      {
        id: "clinical",
        name: "Clinical Psychology",
      },
      {
        id: "health",
        name: "Health Psychology",
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
export const timePeriods: TimePeriod[] = [
  {
    id: "morning",
    title: "Matutino",
    period: "8:00 AM - 12:00 PM",
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    description: "Horários realizados no período da manhã",
  },
  {
    id: "afternoon",
    title: "Vespertino",
    period: "1:00 PM - 6:00 PM",
    icon: <Sunset className="h-6 w-6 text-orange-500" />,
    description: "Horários realizados no período da tarde",
  },
  {
    id: "evening",
    title: "Noturno",
    period: "6:00 PM - 10:00 PM",
    icon: <Moon className="h-6 w-6 text-blue-500" />,
    description: "Horários realizados no período da noite",
  },
];
