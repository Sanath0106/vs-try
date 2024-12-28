"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Resume", href: "/resume" },
  { name: "Challenge", href: "/challenge" },
  { name: "Quiz", href: "/quiz" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Dashboard Header */}
      <header className="fixed w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">AI Interview Coach</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={`${
                      pathname === item.href 
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "hover:text-violet-600 dark:hover:text-violet-400"
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
              <button
                className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button 
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        pathname === item.href 
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "hover:text-violet-600 dark:hover:text-violet-400"
                      }`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        {children}
      </main>
    </div>
  );
} 