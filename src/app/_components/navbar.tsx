"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Agendamento", icon: Home },
    { href: "/calendar", label: "Calendário", icon: Calendar },
    { href: "/secretaria", label: "Secretaria", icon: FileText },
    { href: "/direcao", label: "Direção", icon: GraduationCap },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link
          href="/"
          className="font-semibold hover:text-primary/70 flex-shrink-0"
        >
          UniCerrado
        </Link>

        <div className="hidden md:flex space-x-1 lg:space-x-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
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
          ))}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden md:flex items-center text-sm px-3 py-2 rounded-md transition-colors hover:text-primary text-muted-foreground cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Sair</span>
        </button>

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

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-2 space-y-1">
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
          </div>
        </div>
      )}
    </nav>
  );
}
