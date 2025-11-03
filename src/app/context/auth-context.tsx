// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { checkUserAccess } from "../_actions/permissions/check-user-access";

// interface AuthContextType {
//   accessChecked: boolean;
//   hasAccess: boolean;
//   userStatus: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const { status, data: session } = useSession();
//   const router = useRouter();
//   const [accessChecked, setAccessChecked] = useState(false);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [userStatus, setUserStatus] = useState<string | null>(null);

//   useEffect(() => {
//     async function verifyAccess() {
//       if (status === "unauthenticated") {
//         router.push("/login");
//         return;
//       }

//       if (status === "authenticated" && session?.user?.email) {
//         try {
//           const result = await checkUserAccess();

//           if (result.redirect) {
//             router.push(result.redirect);
//             return;
//           }

//           if (!result.access && result.status) {
//             setUserStatus(result.status);

//             if (result.status === "PENDING_APPROVAL") {
//               router.push("/pending-access");
//               return;
//             }

//             if (result.status === "PENDING_ACTIVATION") {
//               router.push("/pending-activation");
//               return;
//             }
//           }

//           setHasAccess(result.access);
//         } catch (error) {
//           console.error("Erro ao verificar acesso:", error);
//           router.push("/login");
//         } finally {
//           setAccessChecked(true);
//         }
//       }
//     }

//     if (!accessChecked) {
//       verifyAccess();
//     }
//   }, [status, session, accessChecked, router]);

//   return (
//     <AuthContext.Provider value={{ accessChecked, hasAccess, userStatus }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
