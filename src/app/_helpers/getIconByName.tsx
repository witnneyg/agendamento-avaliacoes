import {
  Code,
  Microscope,
  Brain,
  Briefcase,
  Leaf,
  FileText,
  Gavel,
  Dumbbell,
  Syringe,
  Hammer,
  Activity,
  BookOpen,
  PawPrint,
  Smile,
  GraduationCap,
  Book,
} from "lucide-react";

export function getIconByName(name: string) {
  switch (name) {
    case "Gestão da Tecnologia da Informação":
      return <Code className="h-6 w-6 text-primary" />;
    case "Medicina":
      return <Microscope className="h-6 w-6 text-primary" />;
    case "Psicologia":
      return <Brain className="h-6 w-6 text-primary" />;
    case "Administração":
      return <Briefcase className="h-6 w-6 text-primary" />;
    case "Agronomia":
      return <Leaf className="h-6 w-6 text-primary" />;
    case "Ciências Contábeis":
      return <FileText className="h-6 w-6 text-primary" />;
    case "Direito":
      return <Gavel className="h-6 w-6 text-primary" />;
    case "Educação Física":
      return <Dumbbell className="h-6 w-6 text-primary" />;
    case "Enfermagem":
      return <Syringe className="h-6 w-6 text-primary" />;
    case "Engenharia Civil":
      return <Hammer className="h-6 w-6 text-primary" />;
    case "Fisioterapia":
      return <Activity className="h-6 w-6 text-primary" />;
    case "Letras":
      return <BookOpen className="h-6 w-6 text-primary" />;
    case "Medicina Veterinária":
      return <PawPrint className="h-6 w-6 text-primary" />;
    case "Odontologia":
      return <Smile className="h-6 w-6 text-primary" />;
    case "Pedagogia":
      return <GraduationCap className="h-6 w-6 text-primary" />;
    default:
      return <Book className="h-6 w-6 text-primary" />;
  }
}
