export const getDepartmentColor = (departmentId: string) => {
  const colors: Record<string, string> = {
    "Gestão da Tecnologia da Informação":
      "bg-teal-500 border-teal-600 text-teal-100",
    Medicina: "bg-emerald-500 border-emerald-600 text-emerald-100",
    Psicologia: "bg-indigo-500 border-indigo-600 text-indigo-100",
    Administração: "bg-amber-500 border-amber-600 text-amber-100",
    Agronomia: "bg-pink-500 border-pink-600 text-pink-100",
    Contabilidade: "bg-orange-500 border-orange-600 text-orange-100",
    Direito: "bg-red-500 border-red-600 text-red-100",
    "Educação Física": "bg-yellow-500 border-yellow-600 text-yellow-100",
    Enfermagem: "bg-lime-500 border-lime-600 text-lime-100",
    "Engenharia Civil": "bg-blue-500 border-blue-600 text-blue-100",
    Fisioterapia: "bg-cyan-500 border-cyan-600 text-cyan-100",
    Literatura: "bg-purple-500 border-purple-600 text-purple-100",
    Veterinária: "bg-gray-500 border-brown-600 text-brown-100",
    Odontologia: "bg-gray-500 border-gray-600 text-gray-100",
    Pedagogia: "bg-green-500 border-green-600 text-green-100",
  };
  return colors[departmentId] || "bg-gray-500 border-gray-500 text-gray-800";
};
