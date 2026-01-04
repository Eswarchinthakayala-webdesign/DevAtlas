import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Terminal,
  Menu,
  X,
  ChevronRight,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

// --- Navigation Data ---
const navLinks = [
  { name: "Curriculum", href: "/curriculum" },
  { name: "Showcase", href: "/showcase" },
  { name: "Documentation", href: "/docs" },
  { name: "My Profile", href: "/my-profile" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          isScrolled || mobileOpen
            ? "border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* ---------- Logo ---------- */}
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-zinc-900 dark:text-zinc-100">
              DevAtlas
            </span>
          </Link>

          {/* ---------- Desktop Nav ---------- */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/60 p-1"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.href}
                onMouseEnter={() => setHovered(i)}
                className="relative px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {hovered === i && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white dark:bg-zinc-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* ---------- Right Actions ---------- */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="#">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
          </div>

          {/* ---------- Mobile Controls ---------- */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-100 bg-white dark:bg-zinc-950 pt-20 px-4 md:hidden"
          >
            <div className="space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      flex items-center justify-between
                      rounded-xl border border-zinc-200 dark:border-zinc-800
                      bg-zinc-50 dark:bg-zinc-900
                      px-4 py-3 text-base font-medium
                      text-zinc-900 dark:text-zinc-100
                      active:scale-[0.98] transition
                    "
                  >
                    {link.name}
                    <ChevronRight className="h-5 w-5 text-zinc-400" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
