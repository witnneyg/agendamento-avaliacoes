import { Course } from "./_components/course-selector";
import { Discipline } from "./_components/discipline-selector";
import { Semester } from "./_components/semester-selector";

import {
  BookOpen,
  Calculator,
  Microscope,
  Brain,
  Globe,
  TestTube,
  Code,
} from "lucide-react";

export const academicCourses: Course[] = [
  {
    id: "cs",
    title: "Computer Science",
    icon: <Code className="h-6 w-6 text-primary" />,
    description:
      "Programming, algorithms, data structures, and software engineering",
  },
  {
    id: "medicine",
    title: "Medicine",
    icon: <Microscope className="h-6 w-6 text-primary" />,
    description: "Medical sciences, healthcare, and clinical studies",
  },
  {
    id: "math",
    title: "Mathematics",
    icon: <Calculator className="h-6 w-6 text-primary" />,
    description: "Pure and applied mathematics, statistics, and analysis",
  },
  {
    id: "biology",
    title: "Biology",
    icon: <TestTube className="h-6 w-6 text-primary" />,
    description: "Life sciences, ecology, genetics, and molecular biology",
  },
  {
    id: "psychology",
    title: "Psychology",
    icon: <Brain className="h-6 w-6 text-primary" />,
    description: "Human behavior, cognitive processes, and mental health",
  },
  {
    id: "geography",
    title: "Geography",
    icon: <Globe className="h-6 w-6 text-primary" />,
    description:
      "Physical geography, human geography, and environmental studies",
  },
];

export const semestersByCourse: Record<string, Semester[]> = {
  cs: [
    {
      id: "first",
      title: "1º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Ciência da Computação",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Segundo período de Ciência da Computação",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Ciência da Computação",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Quarto período de Ciência da Computação",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Quinto período de Ciência da Computação",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Sexto período de Ciência da Computação",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Ciência da Computação",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Ciência da Computação",
    },
  ],
  math: [
    {
      id: "first",
      title: "1º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Matemática",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Segundo período de Matemática",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Matemática",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Quarto período de Matemática",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Quinto período de Matemática",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Sexto período de Matemática",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Matemática",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Calculator className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Matemática",
    },
  ],
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
  biology: [
    {
      id: "first",
      title: "1º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Biologia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Segundo período de Biologia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Biologia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Quarto período de Biologia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Quinto período de Biologia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Sexto período de Biologia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Biologia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <TestTube className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Biologia",
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
  geography: [
    {
      id: "first",
      title: "1º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Primeiro período de Geografia",
    },
    {
      id: "second",
      title: "2º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Segundo período de Geografia",
    },
    {
      id: "third",
      title: "3º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Terceiro período de Geografia",
    },
    {
      id: "fourth",
      title: "4º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Quarto período de Geografia",
    },
    {
      id: "fifth",
      title: "5º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Quinto período de Geografia",
    },
    {
      id: "sixth",
      title: "6º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Sexto período de Geografia",
    },
    {
      id: "seventh",
      title: "7º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Sétimo período de Geografia",
    },
    {
      id: "eighth",
      title: "8º Período",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "Oitavo período de Geografia",
    },
  ],
};

export const disciplinesBySemesterAndDepartment: Record<
  string,
  Record<string, Discipline[]>
> = {
  cs: {
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
  math: {
    first: [
      {
        id: "calculus-1",
        title: "Calculus I",
        description: "Limits, derivatives, and applications",
      },
      {
        id: "linear-algebra",
        title: "Linear Algebra",
        description: "Vector spaces, matrices, and linear transformations",
      },
    ],
    second: [
      {
        id: "calculus-2",
        title: "Calculus II",
        description: "Integration techniques and applications",
      },
      {
        id: "probability",
        title: "Probability Theory",
        description: "Fundamentals of probability and random variables",
      },
    ],
    third: [
      {
        id: "statistics",
        title: "Statistics",
        description: "Statistical methods and data analysis",
      },
      {
        id: "differential-equations",
        title: "Differential Equations",
        description: "Solving and applications of differential equations",
      },
    ],
    fourth: [
      {
        id: "numerical-methods",
        title: "Numerical Methods",
        description: "Computational techniques for mathematical problems",
      },
      {
        id: "math-modeling",
        title: "Mathematical Modeling",
        description: "Building and analyzing mathematical models",
      },
    ],
  },
  medicine: {
    first: [
      {
        id: "anatomy-1",
        title: "Human Anatomy I",
        description: "Structure of the human body",
      },
      {
        id: "biochemistry",
        title: "Medical Biochemistry",
        description: "Biochemical processes in the human body",
      },
    ],
    second: [
      {
        id: "physiology",
        title: "Human Physiology",
        description: "Functions of the human body systems",
      },
      {
        id: "histology",
        title: "Histology",
        description: "Microscopic structure of tissues",
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
  biology: {
    first: [
      {
        id: "cell-biology",
        title: "Cell Biology",
        description: "Structure and function of cells",
      },
      {
        id: "genetics",
        title: "Genetics",
        description: "Principles of inheritance and gene expression",
      },
    ],
    second: [
      {
        id: "ecology",
        title: "Ecology",
        description: "Interactions between organisms and their environment",
      },
      {
        id: "evolution",
        title: "Evolutionary Biology",
        description: "Mechanisms and evidence for evolution",
      },
    ],
    third: [
      {
        id: "microbiology",
        title: "Microbiology",
        description: "Study of microorganisms",
      },
      {
        id: "botany",
        title: "Botany",
        description: "Structure and function of plants",
      },
    ],
    fourth: [
      {
        id: "zoology",
        title: "Zoology",
        description: "Study of animals",
      },
      {
        id: "marine-biology",
        title: "Marine Biology",
        description: "Study of marine organisms and ecosystems",
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
  geography: {
    first: [
      {
        id: "physical-geo",
        title: "Physical Geography",
        description: "Natural features and processes of the Earth",
      },
      {
        id: "human-geo",
        title: "Human Geography",
        description:
          "Human activities and their relationship to the environment",
      },
    ],
    second: [
      {
        id: "cartography",
        title: "Cartography",
        description: "Map making and spatial representation",
      },
      {
        id: "climate",
        title: "Climatology",
        description: "Study of climate and climate change",
      },
    ],
    third: [
      {
        id: "gis",
        title: "Geographic Information Systems",
        description:
          "Computer systems for capturing and analyzing spatial data",
      },
      {
        id: "urban",
        title: "Urban Geography",
        description: "Study of cities and urban areas",
      },
    ],
    fourth: [
      {
        id: "economic-geo",
        title: "Economic Geography",
        description: "Spatial distribution of economic activities",
      },
      {
        id: "environmental",
        title: "Environmental Geography",
        description: "Human-environment interactions and sustainability",
      },
    ],
  },
};
