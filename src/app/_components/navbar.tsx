"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex gap-2 items-center">
          <Link href="/" className="mr-4 font-semibold hover:text-primary/70">
            UniCerrado
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={cn(
                "flex items-center px-3 py-2 text-sm transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Agendamento
            </Link>
            <Link
              href="/calendar"
              className={cn(
                "flex items-center px-3 py-2 text-sm transition-colors hover:text-primary",
                pathname === "/calendar"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendário
            </Link>
            <Link
              href="/admin"
              className={cn(
                "flex items-center px-3 py-2 text-sm transition-colors hover:text-primary",
                pathname.startsWith("/admin")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center text-sm px-3 py-2 rounded-md transition-colors hover:text-primary text-muted-foreground cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </button>
      </div>
    </nav>
  );
}
