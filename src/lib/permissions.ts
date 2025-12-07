// // Estrutura RBAC com todas as permissões de visualização
// const ROLES_PERMISSIONS = {
//   PROFESSOR: [
//     "avaliacao:agendar",
//     "avaliacao:visualizar:proprio",
//     "avaliacao:editar:proprio",
//     "avaliacao:excluir:proprio",

//     "calendario:visualizar:vinculado",
//   ],

//   DIRETOR: [
//     "avaliacao:agendar",
//     "avaliacao:criar",
//     "avaliacao:visualizar:curso",
//     "avaliacao:editar",
//     "avaliacao:deletar",

//     // Disciplinas
//     "disciplina:criar",
//     "disciplina:visualizar:curso",
//     "disciplina:editar",
//     "disciplina:deletar",

//     // Professores
//     "professor:criar",
//     "professor:visualizar:curso",
//     "professor:editar",
//     "professor:deletar",

//     // Calendário
//     "calendario:visualizar:curso",
//   ],

//   SECRETARIA: [
//     // Cursos
//     "curso:criar",
//     "curso:visualizar:todos",
//     "curso:editar",
//     "curso:deletar",

//     // Disciplinas
//     "disciplina:criar",
//     "disciplina:visualizar:todos",
//     "disciplina:editar",
//     "disciplina:deletar",

//     // Turmas
//     "turma:criar",
//     "turma:visualizar:todos",
//     "turma:editar",
//     "turma:deletar",

//     // Professores
//     "professor:criar",
//     "professor:visualizar:todos",
//     "professor:editar",
//     "professor:deletar",

//     // Avaliações
//     "avaliacao:criar",
//     "avaliacao:visualizar:todos",
//     "avaliacao:editar",
//     "avaliacao:deletar",

//     // Calendário
//     "calendario:visualizar:todos",
//   ],

//   ADMINISTRADOR: [
//     // Cursos
//     "curso:criar",
//     "curso:visualizar:todos",
//     "curso:editar",
//     "curso:deletar",

//     // Disciplinas
//     "disciplina:criar",
//     "disciplina:visualizar:todos",
//     "disciplina:editar",
//     "disciplina:deletar",

//     // Turmas
//     "turma:criar",
//     "turma:visualizar:todos",
//     "turma:editar",
//     "turma:deletar",

//     // Professores
//     "professor:criar",
//     "professor:visualizar:todos",
//     "professor:editar",
//     "professor:deletar",
//     "professor:status:gerenciar",

//     // Usuários
//     "usuario:visualizar:todos",
//     "usuario:gerenciar",
//     "usuario:role:editar",

//     // Avaliações
//     "avaliacao:visualizar:todos",

//     // Sistema
//     "sistema:configuracao:acessar",
//   ],
// };

// // Função utilitária para verificar permissões
// function checkPermission(userRole, permission) {
//   return ROLES_PERMISSIONS[userRole]?.includes(permission) || false;
// }

// // Exemplo de verificação de permissões por contexto
// const PERMISSION_CHECKS = {
//   // Contexto: Professor visualizando calendário
//   professorViewCalendar: checkPermission(
//     "PROFESSOR",
//     "calendario:visualizar:vinculado"
//   ),

//   // Contexto: Diretor visualizando disciplinas do curso
//   directorViewDisciplines: checkPermission(
//     "DIRETOR",
//     "disciplina:visualizar:curso"
//   ),

//   // Contexto: Secretaria visualizando todos os professores
//   secretaryViewAllTeachers: checkPermission(
//     "SECRETARIA",
//     "professor:visualizar:todos"
//   ),

//   // Contexto: Admin visualizando todos os usuários
//   adminViewAllUsers: checkPermission(
//     "ADMINISTRADOR",
//     "usuario:visualizar:todos"
//   ),
// };

// // Exemplo de função para obter todas as permissões de visualização de uma role
// function getViewPermissions(role) {
//   const permissions = ROLES_PERMISSIONS[role] || [];
//   return permissions.filter((perm) => perm.includes("visualizar"));
// }

// // Exemplo: Ver permissões de visualização de cada role
// console.log(
//   "Permissões de visualização PROFESSOR:",
//   getViewPermissions("PROFESSOR")
// );
// console.log(
//   "Permissões de visualização DIRETOR:",
//   getViewPermissions("DIRETOR")
// );
// console.log(
//   "Permissões de visualização SECRETARIA:",
//   getViewPermissions("SECRETARIA")
// );
// console.log(
//   "Permissões de visualização ADMINISTRADOR:",
//   getViewPermissions("ADMINISTRADOR")
// );
