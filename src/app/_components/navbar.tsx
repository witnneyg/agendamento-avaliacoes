"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { getUser } from "../_actions/getUser";

interface UserWithRoles {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  roles: Array<{
    id: string;
    name: string;
    permissions?: Array<{
      id: string;
      name: string;
      description: string | null;
    }>;
  }>;
}

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getUser();
        setUser(data as UserWithRoles);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const hasRole = (roleName: string) => {
    return user?.roles?.some((role) => role.name === roleName);
  };

  const getNavLinks = () => {
    const baseLinks = [
      { href: "/", label: "Agendamento", icon: Home },
      { href: "/calendar", label: "Calendário", icon: Calendar },
    ];

    const secretariaLink = {
      href: "/secretaria",
      label: "Secretaria",
      icon: FileText,
    };
    const direcaoLink = {
      href: "/direcao",
      label: "Direção",
      icon: GraduationCap,
    };
    const adminLink = { href: "/admin", label: "Admin", icon: Settings };

    if (hasRole("ADMIN")) {
      return [...baseLinks, secretariaLink, direcaoLink, adminLink];
    }

    if (hasRole("DIRETOR") || hasRole("DIREÇÃO")) {
      return [...baseLinks, direcaoLink];
    }

    if (hasRole("SECRETARIA")) {
      return [...baseLinks, secretariaLink];
    }

    if (hasRole("PROFESSOR")) {
      return baseLinks;
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold hover:text-primary/70 flex-shrink-0"
        >
          UniCerrado
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-1 lg:space-x-4">
          {isLoading ? (
            // Skeleton de carregamento
            <>
              <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
              <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
              <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
            </>
          ) : (
            navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center px-2 lg:px-3 py-2 text-sm transition-colors hover:text-primary rounded-md",
                  isActiveLink(href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="mr-1 lg:mr-2 h-4 w-4" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))
          )}
        </div>

        {/* Botão de sair */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="h-6 w-14 bg-muted animate-pulse rounded-md" />
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center text-sm px-3 py-2 rounded-md transition-colors hover:text-primary text-muted-foreground cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          )}
        </div>

        {/* Botão do menu mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-accent"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {isLoading ? (
              <>
                <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
                <div className="h-6 w-28 bg-muted animate-pulse rounded-md" />
              </>
            ) : (
              <>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm transition-colors hover:text-primary rounded-md w-full",
                      isActiveLink(href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {label}
                  </Link>
                ))}

                <div className="px-3 py-2 text-xs text-muted-foreground border-t mt-2 pt-2">
                  Logado como: {user?.name || user?.email}
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="flex items-center text-sm px-3 py-3 rounded-md transition-colors hover:text-primary text-muted-foreground cursor-pointer w-full"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
