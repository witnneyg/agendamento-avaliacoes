// import { User } from "@prisma/client";

// export type UserWithRoles = User & {
//   roles: Array<{
//     name: string;
//   }>;
// };

// interface PolicyStatement {
//   actions: string[];
//   resource: string;
//   condition?: (user: UserWithRoles, resource: any) => boolean;
// }

// const policies: Record<string, PolicyStatement[]> = {
//   teacher: [
//     {
//       actions: ["read", "create"],
//       resource: "scheduling",
//     },
//     {
//       actions: ["read"],
//       resource: "calendar",
//     },
//   ],
//   director: [
//     {
//       actions: ["read", "manage"],
//       resource: "reports",
//     },
//   ],
//   secretaria: [
//     {
//       actions: ["read", "create", "update"],
//       resource: "course",
//     },
//     {
//       actions: ["create", "read", "update", "delete"],
//       resource: "discipline",
//     },
//     {
//       actions: ["create", "read", "update", "delete"],
//       resource: "class",
//     },
//     {
//       actions: ["create", "read", "update", "delete"],
//       resource: "teacher",
//     },
//     {
//       actions: ["create", "read", "update", "delete"],
//       resource: "scheduling",
//     },
//     {
//       actions: ["read"],
//       resource: "calendar",
//     },
//   ],
//   admin: [
//     {
//       actions: ["create", "read", "update", "delete", "manage"],
//       resource: "all",
//     },
//   ],
// };

// export function hasPermission(
//   user: UserWithRoles | null | undefined,
//   action: string,
//   resource?: string
// ): boolean {
//   if (!user) return false;

//   const userPolicies: PolicyStatement[] = [];

//   for (const role of user.roles) {
//     const roleName = role.name.toLowerCase();

//     const rolePolicies = policies[roleName];
//     if (rolePolicies) {
//       userPolicies.push(...rolePolicies);
//     }
//   }

//   for (const policy of userPolicies) {
//     const resourceMatches =
//       policy.resource === "all" || policy.resource === resource;

//     if (policy.actions.includes(action) && resourceMatches) {
//       if (policy.condition) {
//         return policy.condition(user, resource);
//       }
//       return true;
//     }
//   }

//   return false;
// }
