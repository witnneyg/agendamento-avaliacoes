import {
  Calculator,
  FlaskRoundIcon as Flask,
  Globe,
  Microscope,
  Code,
  Brain,
} from "lucide-react";

import { Course } from "./_components/course-selector";
import { Semester } from "./_components/semester-selector";
import { Discipline } from "./_components/discipline-selector";

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
    icon: <Flask className="h-6 w-6 text-primary" />,
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

export const semesters: Semester[] = [
  {
    id: "first",
    title: "Primeiro período",
    period: "",
  },
  {
    id: "second",
    title: "Segundo período",
    period: "",
  },
  {
    id: "third",
    title: "Terceiro período",
    period: "",
  },
  {
    id: "fourth",
    title: "Quarto período",
    period: "",
  },
];

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
