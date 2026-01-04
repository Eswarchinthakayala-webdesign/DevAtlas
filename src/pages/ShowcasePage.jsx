import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Search,
  Layout,
  Smartphone,
  Server,
  ExternalLink,
  Github,
  ArrowRight,
  Menu,
  Zap,
  Filter,
  Layers,
  Star,
  Globe,
  Code2,
  ArrowLeft,
  MoreVertical,
  Cpu,
  Database,
  Share2
} from "lucide-react";

// ------------------------------------------------------------------
// 1. MOCK DATA: SHOWCASE PROJECTS
// ------------------------------------------------------------------

const SHOWCASE_DATA = [
  {
    id: "proj-1",
    title: "Lumina Dashboard",
    description: "A high-performance analytics dashboard handling 1M+ data points using React 18 Concurrent features and virtualization.",
    author: "Sarah Chen",
    role: "Senior Frontend Dev",
    category: "web",
    tags: ["React 18", "D3.js", "Zustand"],
    stats: { stars: 128, forks: 34 },
    featured: true,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "proj-2",
    title: "Apex Finance Mobile",
    description: "Cross-platform fintech application built with React Native and Reanimated 3. Features 60fps charts and biometric auth.",
    author: "James Wilson",
    role: "Mobile Engineer",
    category: "mobile",
    tags: ["Expo", "Reanimated", "Skia"],
    stats: { stars: 89, forks: 12 },
    featured: false,
    color: "from-zinc-500 to-teal-500"
  },
  {
    id: "proj-3",
    title: "EdgeDB Scale",
    description: "Distributed database layer deployed on Cloudflare Workers. Implements custom caching strategies and connection pooling.",
    author: "Alex K.",
    role: "Systems Architect",
    category: "systems",
    tags: ["Workers", "Rust", "Redis"],
    stats: { stars: 245, forks: 67 },
    featured: false,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "proj-4",
    title: "Untitled UI Kit",
    description: "A headless, accessible component library based on Radix Primitives. Fully typed and themed.",
    author: "Maria Garcia",
    role: "UI Engineer",
    category: "web",
    tags: ["Radix", "Tailwind", "Storybook"],
    stats: { stars: 56, forks: 8 },
    featured: false,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "proj-5",
    title: "Hyperion Chat",
    description: "Real-time encrypted messaging app using WebSockets and local-first architecture (CRDTs).",
    author: "David Kim",
    role: "Full Stack",
    category: "systems",
    tags: ["WebSockets", "CRDT", "Node.js"],
    stats: { stars: 92, forks: 21 },
    featured: false,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "proj-6",
    title: "Zenith Commerce",
    description: "Headless e-commerce storefront utilizing Next.js App Router and Server Components for maximum SEO.",
    author: "Elena R.",
    role: "Frontend Dev",
    category: "web",
    tags: ["Next.js", "Stripe", "Sanity"],
    stats: { stars: 45, forks: 5 },
    featured: false,
    color: "from-zinc-500 to-zinc-300"
  }
];

const FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Apps", icon: Globe },
  { id: "mobile", label: "Native Mobile", icon: Smartphone },
  { id: "systems", label: "Systems & API", icon: Server },
];

// ------------------------------------------------------------------
// 2. REUSABLE COMPONENTS
// ------------------------------------------------------------------

const ProjectPreview = ({ category, color }) => {
  return (
    <div
      className="
        w-full h-full relative overflow-hidden
        rounded-xl
        transition-transform duration-700
        group-hover:scale-[1.04]

        bg-white
        dark:bg-zinc-900
      "
    >
      {/* Background gradient */}
      <div
        className={cn(
          `
          absolute inset-0 opacity-20
          bg-gradient-to-br
          `,
          color
        )}
      />

      {/* Mockup container */}
      <div
        className="
          absolute inset-2 sm:inset-3 md:inset-4
          rounded-xl
          border
          p-2 sm:p-3
          flex flex-col gap-2
          backdrop-blur-sm
          shadow-xl

          bg-white/80 border-zinc-200
          dark:bg-zinc-950/80 dark:border-zinc-800/50
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center gap-2
            pb-2
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>

          <div
            className="
              h-1.5 w-16 sm:w-20
              rounded-full ml-auto
              bg-zinc-200
              dark:bg-zinc-800
            "
          />
        </div>

        {/* ---------------- WEB ---------------- */}
        {category === "web" && (
          <div className="flex gap-2 h-full">
            {/* Sidebar */}
            <div
              className="
                w-1/4 min-w-[28px]
                rounded-md
                bg-zinc-100
                dark:bg-zinc-900
              "
            />

            {/* Main */}
            <div className="flex-1 flex flex-col gap-2">
              <div
                className="
                  relative h-20 sm:h-24
                  rounded-md overflow-hidden
                  bg-zinc-200
                  dark:bg-zinc-800/60
                "
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-10 bg-gradient-to-r",
                    color
                  )}
                />
              </div>

              <div className="flex gap-2 flex-1">
                <div className="flex-1 rounded-md bg-zinc-100 dark:bg-zinc-900" />
                <div className="flex-1 rounded-md bg-zinc-100 dark:bg-zinc-900" />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MOBILE ---------------- */}
        {category === "mobile" && (
          <div className="flex justify-center h-full pt-1">
            <div
              className="
                w-14 sm:w-16 md:w-20
                h-full
                rounded-t-2xl
                border-x border-t
                p-1

                border-zinc-300 bg-white
                dark:border-zinc-700 dark:bg-black
              "
            >
              <div
                className="
                  relative w-full h-full
                  rounded-t-xl overflow-hidden
                  bg-zinc-100
                  dark:bg-zinc-900
                "
              >
                <div className="absolute top-2 left-2 right-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                <div className="absolute top-6 left-2 h-8 w-8 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-200/70 dark:bg-zinc-800/50 backdrop-blur-md" />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SYSTEMS ---------------- */}
        {category === "systems" && (
          <div
            className="
              flex-1
              font-mono
              text-[7px] sm:text-[8px]
              leading-relaxed
              p-1

              text-zinc-600
              dark:text-zinc-500
            "
          >
            <span className="text-purple-500">fn</span> main() {"{"}
            <br />
            &nbsp;&nbsp;
            <span className="text-blue-500">let</span> pool =
            <span className="text-yellow-500"> PgPool</span>::connect(&url).
            <span className="text-blue-500">await</span>?;<br />
            &nbsp;&nbsp;
            <span className="text-purple-500">match</span> result {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-green-500">Ok</span>(val) =&gt; println!(
            <span className="text-emerald-600">"{'{:?}'}"</span>, val),
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-red-500">Err</span>(e) =&gt; eprintln!(
            <span className="text-emerald-600">"Error"</span>),
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            {"}"}
          </div>
        )}
      </div>
    </div>
  );
};


const SidebarContent = ({ onNavigate }) => (
  <div
    className="
      flex h-full flex-col
      bg-white text-zinc-900
      dark:bg-zinc-950 dark:text-zinc-100
    "
  >
    {/* ---------- Header ---------- */}
    <div
      className="
        p-4 sm:p-6
        border-b
        border-zinc-200
        dark:border-zinc-800
      "
    >
      <Link
        to="/"
        onClick={onNavigate}
        className="
          flex items-center gap-2 mb-5
          text-zinc-500 hover:text-zinc-900
          dark:text-zinc-400 dark:hover:text-white
          transition-colors group
        "
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-xl
            bg-zinc-900 text-white
            dark:bg-white dark:text-black
            flex items-center justify-center
            shadow-sm
          "
        >
          <Terminal className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <h1 className="font-bold text-base sm:text-lg tracking-tight truncate">
            DevAtlas
          </h1>
          <span
            className="
              text-[10px] sm:text-xs
              text-zinc-500
              dark:text-zinc-400
              font-mono tracking-wider
            "
          >
            SHOWCASE 
          </span>
        </div>
      </div>
    </div>

    {/* ---------- Navigation ---------- */}
    <ScrollArea className="flex-1 px-3 sm:px-4 py-5">
      <div className="space-y-6">
        <div className="px-1">
          <h3
            className="
              text-xs font-bold uppercase tracking-widest mb-4
              text-zinc-500 dark:text-zinc-400
            "
          >
            Navigation
          </h3>

          <nav className="space-y-1">
            <Link
              to="/curriculum"
              onClick={onNavigate}
              className="
                flex items-center gap-3
                px-3 py-2.5
                rounded-md
                text-sm
                text-zinc-600 hover:text-zinc-900
                hover:bg-zinc-100
                dark:text-zinc-400 dark:hover:text-white
                dark:hover:bg-zinc-900
                transition-colors
              "
            >
              <Code2 className="w-4 h-4" />
              <span>Curriculum</span>
            </Link>

            <Link
              to="/showcase"
              onClick={onNavigate}
              className="
                flex items-center gap-3
                px-3 py-2.5
                rounded-md
                text-sm font-medium
                bg-zinc-100 text-zinc-900
                dark:bg-zinc-900 dark:text-white
                shadow-inner
              "
            >
              <Layout className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Project Showcase</span>
            </Link>

            <Link
              to="/docs"
              onClick={onNavigate}
              className="
                flex items-center gap-3
                px-3 py-2.5
                rounded-md
                text-sm
                text-zinc-600 hover:text-zinc-900
                hover:bg-zinc-100
                dark:text-zinc-400 dark:hover:text-white
                dark:hover:bg-zinc-900
                transition-colors
              "
            >
              <Globe className="w-4 h-4" />
              <span>Documentation</span>
            </Link>
          </nav>
        </div>
      </div>
    </ScrollArea>
  </div>
);


// ------------------------------------------------------------------
// 3. MAIN SHOWCASE PAGE
// ------------------------------------------------------------------

export default function ShowcasePage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter Logic
  const filteredProjects = SHOWCASE_DATA.filter(project => {
    const matchesFilter = filter === "all" || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const featuredProject = SHOWCASE_DATA.find(p => p.featured);

  return (
    <div className="flex min-h-screen w-full mt-20  text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0  over relative">
        
      {/* Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
        <div
            className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),
                linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]
            bg-[size:24px_24px]

            sm:bg-[size:28px_28px]
            md:bg-[size:32px_32px]
            lg:bg-[size:36px_36px]

            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
                    linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
            "
        />
        </div>


            {/* Header */}
            <header
            className="
                sticky top-0 z-30
                w-full h-16 md:h-18
                border-b
                backdrop-blur-xl
                transition-colors
              border-zinc-200
              dark:border-zinc-800
            "
            >
            <div
                className="
                h-full flex items-center justify-between
                px-3 sm:px-4 md:px-6 lg:px-10
                gap-3
                "
            >
                {/* LEFT SECTION */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
                
                {/* Mobile Sidebar */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="
                        xl:hidden
                        text-zinc-500 hover:text-zinc-900
                        dark:text-zinc-400 dark:hover:text-white
                        "
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    </SheetTrigger>

                    <SheetContent
                    side="left"
                    className="
                        w-80 p-0
                        bg-white text-black
                        border-r border-zinc-200

                        dark:bg-zinc-950 dark:text-white dark:border-zinc-800
                    "
                    >
                    <SidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>

                {/* Search (hidden on small screens) */}
                <div className="relative w-full group ">
                    <Search
                    className="
                        absolute left-3 top-1/2 -translate-y-1/2
                        w-4 h-4
                        text-zinc-400
                        group-focus-within:text-zinc-900
                        transition-colors

                        dark:text-zinc-500 dark:group-focus-within:text-white
                    "
                    />

                    <Input
                    placeholder="Search projects, tags, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                        h-10 w-full pl-10 pr-4 rounded-full text-sm
                        bg-zinc-100 border-zinc-200
                        focus:bg-white focus:border-zinc-300

                        dark:bg-zinc-900/60 dark:border-zinc-800
                        dark:focus:bg-zinc-900 dark:focus:border-zinc-700

                        transition-all
                    "
                    />
                </div>
                </div>


            </div>
            </header>


        {/* Scrollable Content */}
        <ScrollArea className="flex-1 z-10">
          <div
            className="
                pt-4
                relative
                mx-auto
               
                sm:w-[clamp(100%,80vw,1280px)]
                w-screen
                px-4 sm:px-6 md:px-8 lg:px-10
                pb-10
                space-y-12
                overflow-x-hidden
            "
            >

              
              {/* 1. Featured Project Hero */}
              {featuredProject && !searchQuery && filter === 'all' && (
                 <motion.section
                className="
                    relative overflow-hidden
                    w-full
                    max-w-full
                    rounded-2xl sm:rounded-3xl
                    border
                    bg-white
                    border-zinc-200
                    group cursor-pointer
                    dark:bg-zinc-900/30
                    dark:border-zinc-800
                "
                >

                    {/* Dark overlay for contrast */}
                    <div
                        className="
                        absolute inset-0 z-10
                        bg-gradient-to-r
                        from-white via-white/80 to-transparent

                        dark:from-zinc-950 dark:via-zinc-950/80
                        "
                    />

                    {/* Accent gradient */}
                    <div
                        className="
                        absolute top-0 right-0
                        w-full md:w-2/3
                        h-full
                        opacity-20 md:opacity-30
                        group-hover:opacity-30 md:group-hover:opacity-40
                        transition-opacity duration-700
                        pointer-events-none
                        "
                    >
                        <div className={cn("w-full h-full bg-gradient-to-br", featuredProject.color)} />
                    </div>

                    {/* Content */}
                    <div
                        className="
                        relative z-20
                        p-6 sm:p-8 md:p-12
                        flex flex-col
                        gap-8
                        md:flex-row
                        md:items-end
                        md:justify-between
                        overflow-hidden
                        "
                    >
                        {/* Left */}
                        <div className="max-w-2xl space-y-6">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                            className="
                                border
                                bg-amber-500/10 text-amber-600 border-amber-500/20
                                hover:bg-amber-500/20

                                dark:text-amber-500
                            "
                            >
                            <Star className="w-3 h-3 mr-1 fill-amber-500" />
                            Featured Project
                            </Badge>

                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            by {featuredProject.author}
                            </span>
                        </div>

                        {/* Title + description */}
                        <div>
                            <h1
                            className="
                                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                                font-extrabold tracking-tight
                                text-zinc-900
                                dark:text-white
                                mb-4
                            "
                            >
                            {featuredProject.title}
                            </h1>

                            <p
                            className="
                                text-base sm:text-lg
                                leading-relaxed
                                text-zinc-600
                                dark:text-zinc-300
                                max-w-xl
                            "
                            >
                            {featuredProject.description}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {featuredProject.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="
                                bg-zinc-50 text-zinc-600 border-zinc-300

                                dark:bg-zinc-900/50
                                dark:text-zinc-300
                                dark:border-zinc-700
                                "
                            >
                                {tag}
                            </Badge>
                            ))}
                        </div>
                        </div>

                        {/* CTA */}
                        <div className="flex justify-start md:justify-end">
                        <Button
                            size="lg"
                            className="
                            h-11 sm:h-12
                            px-6 sm:px-8
                            rounded-full
                            font-bold
                            bg-black text-white
                            hover:bg-zinc-800

                            dark:bg-white
                            dark:text-black
                            dark:hover:bg-zinc-200
                            "
                        >
                            View Case Study
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        </div>
                    </div>
                    </motion.section>

              )}

              {/* 2. Filters & Grid */}
              <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-300 dark:border-zinc-800 pb-4">
                      <div className="flex items-center gap-2 overflow-x-auto   pb-2 sm:pb-0 no-scrollbar">
                          {FILTERS.map(f => {
                              const isActive = filter === f.id;
                              const Icon = f.icon;
                              return (
                                  <button
                                      key={f.id}
                                      onClick={() => setFilter(f.id)}
                                      className={cn(
                                          "flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                          isActive 
                                            ? "bg-white text-black shadow-lg" 
                                            : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                                      )}
                                  >
                                      {Icon && <Icon className="w-4 h-4" />}
                                      {f.label}
                                  </button>
                              )
                          })}
                      </div>
                      <div className="text-sm text-zinc-500 font-mono">
                          {filteredProjects.length} PROJECTS FOUND
                      </div>
                  </div>

                    <motion.div
                    layout
                    className="
                        grid gap-5
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                   
                    "
                    >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="
                            group relative flex flex-col overflow-hidden rounded-2xl border
                            bg-white
                            border-zinc-200
                            shadow-sm
                            transition-all

                            hover:shadow-xl
                            hover:-translate-y-1

                            dark:bg-zinc-900/40
                            dark:border-zinc-800
                            dark:hover:border-zinc-700
                            "
                        >
                            {/* ---------- Preview ---------- */}
                            <div
                            className="
                                aspect-video w-full overflow-hidden border-b
                                border-zinc-200
                                dark:border-zinc-800
                            "
                            >
                            <ProjectPreview
                                category={project.category}
                                color={project.color}
                            />
                            </div>

                            {/* ---------- Body ---------- */}
                            <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
                            <div>
                                <div className="flex justify-between items-start gap-3 mb-2">
                                <h3
                                    className="
                                    text-lg sm:text-xl font-semibold
                                    text-zinc-900
                                    group-hover:text-zinc-600
                                    transition-colors

                                    dark:text-white
                                    dark:group-hover:text-zinc-300
                                    "
                                >
                                    {project.title}
                                </h3>

                                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                    <span className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition">
                                    <Star className="w-3.5 h-3.5" />
                                    {project.stats.stars}
                                    </span>
                                    <span className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">
                                    <Github className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                                </div>

                                <p
                                className="
                                    text-sm leading-relaxed line-clamp-3
                                    text-zinc-600
                                    dark:text-zinc-400
                                "
                                >
                                {project.description}
                                </p>
                            </div>

                            {/* ---------- Footer ---------- */}
                            <div
                                className="
                                mt-auto pt-4 flex items-center justify-between border-t
                                border-zinc-200
                                dark:border-zinc-800
                                "
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="
                                    w-7 h-7 rounded-full flex items-center justify-center
                                    text-[11px] font-bold
                                    bg-gradient-to-tr from-zinc-300 to-zinc-200
                                    text-zinc-700

                                    dark:from-zinc-700 dark:to-zinc-600
                                    dark:text-zinc-200
                                    "
                                >
                                    {project.author.charAt(0)}
                                </div>

                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-medium text-zinc-800 dark:text-zinc-300 truncate">
                                    {project.author}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">
                                    {project.role}
                                    </span>
                                </div>
                                </div>

                                <Button
                                size="icon"
                                variant="ghost"
                                className="
                                    rounded-full
                                    text-zinc-500
                                    hover:text-zinc-900
                                    hover:bg-zinc-100

                                    dark:hover:text-white
                                    dark:hover:bg-zinc-800
                                "
                                >
                                <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    </motion.div>

              </div>
           </div>
        </ScrollArea>
      </main>
    </div>
  );
}