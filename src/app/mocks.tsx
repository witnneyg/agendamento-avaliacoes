import { Course } from "./_components/course-selector";
import { Discipline } from "./_components/discipline-selector";
import { Semester } from "./_components/semester-selector";
import { Period } from "@prisma/client";

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
        description: "Fundamentals of programming using Python",
      },
      {
        id: "discrete-math",
        name: "Discrete Mathematics",
        description: "Mathematical foundations for computer science",
      },
    ],
    second: [
      {
        id: "data-structures",
        name: "Data Structures",
        description: "Implementation and analysis of data structures",
      },
      {
        id: "algorithms",
        name: "Algorithms",
        description: "Design and analysis of algorithms",
      },
    ],
    third: [
      {
        id: "web-dev",
        name: "Web Development",
        description: "Building web applications with modern technologies",
      },
      {
        id: "databases",
        name: "Database Systems",
        description: "Design and implementation of database systems",
      },
    ],
    fourth: [
      {
        id: "ai-intro",
        name: "Introduction to AI",
        description: "Foundations of artificial intelligence",
      },
      {
        id: "mobile-dev",
        name: "Mobile App Development",
        description: "Building applications for iOS and Android",
      },
    ],
  },
  medicine: {
    first: [
      {
        id: "anatomy-1",
        name: "Anatomia Aplicada a Medicina I",
        description: "Structure of the human body",
      },
      {
        id: "2",
        name: "Genética Geral",
        description: "Biochemical processes in the human body",
      },
      {
        id: "3",
        name: "Biologia Celular e Molecular",
        description: "Biochemical processes in the human body",
      },
      {
        id: "4",
        name: "Biofísica Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "5",
        name: "Embriologia",
        description: "Biochemical processes in the human body",
      },
      {
        id: "6",
        name: "Bioética",
        description: "Biochemical processes in the human body",
      },
      {
        id: "7",
        name: "Fisiologia Humana I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "8",
        name: "Casos Clinicos Colaborativos I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "9",
        name: "Habilidades Médicas I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "10",
        name: "MISCO - Medicina Integrada à Comunidade I",
        description: "Biochemical processes in the human body",
      },
    ],
    second: [
      {
        id: "anatomy-1",
        name: "Anatomia Aplicada a Medicina II",
        description: "Structure of the human body",
      },
      {
        id: "2",
        name: "Psicologia Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "3",
        name: "Metodologia Científica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "biochemistry",
        name: "Bioquímica I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "4",
        name: "Histologia Humana I",
        description: "Biochemical processes in the human body",
      },
      {
        id: "5",
        name: "Parasitologia Médica",
        description: "Biochemical processes in the human body",
      },
      {
        id: "6",
        name: "Habilidades Médicas II",
        description: "Biochemical processes in the human body",
      },
      {
        id: "7",
        name: "Casos Clinicos Colaborativos II",
        description: "Biochemical processes in the human body",
      },
      {
        id: "8",
        name: "MISCO - Medicina Integrada à Comunidade II",
        description: "Biochemical processes in the human body",
      },
    ],
    third: [
      {
        id: "pharmacology",
        name: "Basic Pharmacology",
        description: "Principles of drug action",
      },
      {
        id: "pathology",
        name: "General Pathology",
        description: "Mechanisms of disease",
      },
    ],
    fourth: [
      {
        id: "clinical-skills",
        name: "Clinical Skills",
        description: "Basic clinical examination techniques",
      },
      {
        id: "medical-ethics",
        name: "Medical Ethics",
        description: "Ethical issues in medicine",
      },
    ],
  },
  psychology: {
    first: [
      {
        id: "intro-psych",
        name: "Introduction to Psychology",
        description: "Overview of psychological principles",
      },
      {
        id: "developmental",
        name: "Developmental Psychology",
        description: "Psychological development across the lifespan",
      },
    ],
    second: [
      {
        id: "cognitive",
        name: "Cognitive Psychology",
        description: "Mental processes such as thinking and memory",
      },
      {
        id: "social",
        name: "Social Psychology",
        description:
          "How people's thoughts and behaviors are influenced by others",
      },
    ],
    third: [
      {
        id: "abnormal",
        name: "Abnormal Psychology",
        description: "Psychological disorders and treatments",
      },
      {
        id: "personality",
        name: "Personality Psychology",
        description: "Theories and research on personality",
      },
    ],
    fourth: [
      {
        id: "clinical",
        name: "Clinical Psychology",
        description: "Assessment and treatment of mental disorders",
      },
      {
        id: "health",
        name: "Health Psychology",
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
