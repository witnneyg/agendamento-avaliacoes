// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

// interface UserFormProps {
//   user?: User;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
//   const { addUser, updateUser, loading } = useUsers();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState<UserFormData>({
//     name: user?.name || "",
//     email: user?.email || "",
//     role: user?.role || "secretaria",
//     courseId: user?.courseId || "",
//     subjectIds: user?.subjectIds || [],
//   });

//   const [availableSubjects, setAvailableSubjects] = useState(
//     formData.courseId ? getSubjectsByCourse(formData.courseId) : []
//   );

//   // Update available subjects when course changes
//   useEffect(() => {
//     if (formData.courseId) {
//       const subjects = getSubjectsByCourse(formData.courseId);
//       setAvailableSubjects(subjects);
//       // Clear selected subjects if they don't belong to the new course
//       setFormData((prev) => ({
//         ...prev,
//         subjectIds:
//           prev.subjectIds?.filter((id) =>
//             subjects.some((subject) => subject.id === id)
//           ) || [],
//       }));
//     } else {
//       setAvailableSubjects([]);
//       setFormData((prev) => ({ ...prev, subjectIds: [] }));
//     }
//   }, [formData.courseId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (user) {
//         await updateUser(user.id, formData);
//         toast({
//           title: "Usuário atualizado",
//           description: "Os dados do usuário foram atualizados com sucesso.",
//         });
//       } else {
//         await addUser(formData);
//         toast({
//           title: "Usuário criado",
//           description: "O novo usuário foi criado com sucesso.",
//         });
//       }
//       onSuccess();
//     } catch (error) {
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao salvar o usuário. Tente novamente.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRoleChange = (role: UserRole) => {
//     setFormData((prev) => ({
//       ...prev,
//       role,
//       // Clear course and subjects if not professor
//       courseId: role === "professor" ? prev.courseId : "",
//       subjectIds: role === "professor" ? prev.subjectIds : [],
//     }));
//   };

//   const handleSubjectToggle = (subjectId: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjectIds: checked
//         ? [...(prev.subjectIds || []), subjectId]
//         : (prev.subjectIds || []).filter((id) => id !== subjectId),
//     }));
//   };

//   const showCourseSelection = formData.role === "professor";
//   const showSubjectSelection =
//     formData.role === "professor" && formData.courseId;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Name */}
//         <div className="space-y-2">
//           <Label htmlFor="name">Nome *</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, name: e.target.value }))
//             }
//             placeholder="Nome completo"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="email">Email *</Label>
//           <Input
//             id="email"
//             type="email"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, email: e.target.value }))
//             }
//             placeholder="email@exemplo.com"
//             required
//           />
//         </div>
//       </div>

//       {/* Role */}
//       <div className="space-y-2">
//         <Label htmlFor="role">Perfil *</Label>
//         <Select value={formData.role} onValueChange={handleRoleChange}>
//           <SelectTrigger>
//             <SelectValue placeholder="Selecione o perfil" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.entries(ROLE_LABELS).map(([role, label]) => (
//               <SelectItem key={role} value={role}>
//                 {label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Course Selection (only for professors) */}
//       {showCourseSelection && (
//         <div className="space-y-2">
//           <Label htmlFor="course">Curso</Label>
//           <Select
//             value={formData.courseId || "default"}
//             onValueChange={(value) =>
//               setFormData((prev) => ({ ...prev, courseId: value }))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Selecione o curso" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="default">Nenhum curso</SelectItem>
//               {mockCourses
//                 .filter((course) => course.isActive)
//                 .map((course) => (
//                   <SelectItem key={course.id} value={course.id}>
//                     {course.name} ({course.code})
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//         </div>
//       )}

//       {/* Subject Selection (only for professors with course) */}
//       {showSubjectSelection && availableSubjects.length > 0 && (
//         <div className="space-y-2">
//           <Label>Disciplinas</Label>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-border rounded-md p-3">
//             {availableSubjects.map((subject) => (
//               <div key={subject.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`subject-${subject.id}`}
//                   checked={formData.subjectIds?.includes(subject.id) || false}
//                   onCheckedChange={(checked) =>
//                     handleSubjectToggle(subject.id, checked as boolean)
//                   }
//                 />
//                 <Label
//                   htmlFor={`subject-${subject.id}`}
//                   className="text-sm font-normal cursor-pointer"
//                 >
//                   {subject.name} ({subject.code})
//                 </Label>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Form Actions */}
//       <div className="flex justify-end gap-3 pt-4 border-t border-border">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancelar
//         </Button>
//         <Button type="submit" disabled={loading}>
//           {loading ? "Salvando..." : user ? "Atualizar" : "Criar Usuário"}
//         </Button>
//       </div>
//     </form>
//   );
// }
