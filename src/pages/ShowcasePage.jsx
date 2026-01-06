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
  Share2,
  Eye,   // Added for Live Preview
  Code,  // Added for Source Code
  GitBranch // Added for Fork stats
} from "lucide-react";

// ------------------------------------------------------------------
// 1. MOCK DATA: SHOWCASE PROJECTS (Updated with Images & Links)
// ------------------------------------------------------------------

const SHOWCASE_DATA = [
  {
    id: "proj-1",
    title: "Revolyx",
    description: "Revolyx is a modern design and development platform offering tools for icons, flowcharts, backgrounds, QR codes, and more — all in one place.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React 18", "shadcnUI", "motion","three.js","etc"],
    stats: { stars: 128, forks: 34 },
    featured: true,
    color: "from-purple-500 to-indigo-500",
    image: "/project-1.png",
    liveUrl: "https://revolyx.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/Revolyx"
  },
  {
    id: "proj-2",
    title: "VectorHue",
    description: "An interactive learning portal for Engineering Mathematics II covering gradients, derivatives, tangent planes, and more — designed with clarity and real-time visuals.",
    author: "Eswar Chinthakayala",
    role: "Frontend Dev",
    category: "web",
    tags: ["React 18", "motion", "plot3d","three.js","etc"],
    stats: { stars: 89, forks: 12 },
    featured: false,
    color: "from-zinc-500 to-teal-500",
    image: "/project-2.png",
    liveUrl: "https://vectorhue.vercel.app",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/VectorHue"
  },
  {
    id: "proj-3",
    title: "Numexis",
    description: "Explore convergence, optimization, PDE relaxation, eigenvectors, and root finding — brought to life with custom Three.js animations.",
    author: "Eswar Chinthakayala",
    role: "Frontend Dev",
    category: "web",
    tags: ["React 18", "ShadcnUI", "motion","Recharts","three.js","plot3d","etc"],
    stats: { stars: 245, forks: 67 },
    featured: false,
    color: "from-orange-500 to-red-500",
   image: "/project-3.png",
    liveUrl: "https://numexis.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/Numexis"
  },
  {
    id: "proj-4",
    title: "TaskAraa",
    description: "The ultimate productivity companion to manage your tasks, boost your focus, and elevate your daily habits. Perfect for creators, teams, and anyone striving for personal growth.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React 18", "Tailwind", "Supabase","Kanban","zustand"],
    stats: { stars: 56, forks: 8 },
    featured: false,
    color: "from-blue-500 to-cyan-500",
    image: "/project-4.png",
    liveUrl: "https://taskaraa.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/TaskAraa"
  },
  {
    id: "proj-5",
    title: "SVIT LMS",
    description: "Empower your internship program with structured courses, attendance tracking, assignment workflows, in-course notes, curated links, task management, and analytics — all on a single platform.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React 18", "kanban", "Node.js","Supabase","etc"],
    stats: { stars: 92, forks: 21 },
    featured: false,
    color: "from-pink-500 to-rose-500",
    image: "/project-5.png",
    liveUrl: "https://svit-lms.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/SVIT-LMS"
  },
  {
    id: "proj-6",
    title: "Recruits",
    description: "Job Portal Application allows companies to post job listings and users to search and apply for jobs. It provides features for both job seekers and employers, with user-friendly interfaces and secure authentication.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React.js", "Supabase", "MDeditor","etc"],
    stats: { stars: 45, forks: 5 },
    featured: false,
    color: "from-zinc-500 to-zinc-300",
     image: "/project-6.png",
    liveUrl: "https://recrutis.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/Recrutis"
  },
   {
    id: "proj-7",
    title: "Climetrik",
    description: "A minimalist weather dashboard providing real-time climatic metrics and forecasts using modern web technologies.",
    author: "Eswar Chinthakayala",
    role: "Frontend dev",
    category: "web",
    tags: ["React.js","Weather API", "Vercel", "Typescript","etc"],
    stats: { stars: 45, forks: 5 },
    featured: false,
      color: "from-pink-500 to-rose-500",
     image: "/project-7.png",
    liveUrl: "https://climetrik.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/Recrutis"
  },
    {
    id: "proj-8",
    title: "SparkLab",
    description: "Experience real-time circuit simulation and interactive visualization. Learn BEEE concepts the smart, modern way.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React 18", "Tailwind", "Three.js","svg","motion"],
    stats: { stars: 56, forks: 8 },
    featured: false,
    color: "from-blue-500 to-cyan-500",
    image: "/project-8.png",
    liveUrl: "https://sparklab-beee.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/SparkLab"
  },
    {
    id: "proj-9",
    title: "NexEmbed",
    description: "NexEmbed is a modern, web-native lab for building IoT and embedded projects. Drag components, wire pins, write firmware, and visualize results with virtual instruments — no installs required.",
    author: "Eswar Chinthakayala",
    role: "Frontend Dev",
    category: "web",
    tags: ["React 18", "motion", "plot3d","three.js","etc"],
    stats: { stars: 89, forks: 12 },
    featured: false,
    color: "from-zinc-500 to-teal-500",
    image: "/project-9.png",
    liveUrl: "https://nexembed.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/NexEmbed"
  },
    {
    id: "proj-10",
    title: "ZifHub",
    description: "ZifHub is a modern, high-performance GIF discovery platform built with React.js, designed for speed, simplicity, and seamless user experience. It allows users to explore, search, and instantly preview high-quality GIFs through a clean, responsive interface optimized for both light and dark themes.",
    author: "Eswar Chinthakayala",
    role: "Full Stack",
    category: "web",
    tags: ["React 18", "tailwind", "Node.js","REST API integration"],
    stats: { stars: 92, forks: 21 },
    featured: false,
    color: "from-pink-500 to-rose-500",
    image: "/project-10.png",
    liveUrl: "https://zifhub.vercel.app/",
    repoUrl: "https://github.com/Eswarchinthakayala-webdesign/ZifHub"
  },
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
const ProjectPreview = ({ category, color, image }) => {
  return (
    <div
      className="
        w-full h-full relative overflow-hidden
        rounded-xl
        transition-transform duration-700
        group-hover:scale-[1.02]

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
        {/* Header (Traffic Lights) */}
        <div
          className="
            flex items-center gap-2
            pb-2
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/80" />
            <div className="w-2 h-2 rounded-full bg-amber-500/80" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
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

        {/* ---------------- WEB PREVIEW ---------------- */}
        {category === "web" && (
          <div className="flex gap-2 h-full overflow-hidden">
            {/* Sidebar */}
            <div
              className="
                w-1/4 
                rounded-md
                bg-zinc-100
                dark:bg-zinc-900/50
              "
            />

          
              {image ? (
                <div className="absolute inset-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                   <img 
                    src={image} 
                    alt="Project" 
                    className="w-full h-full object-cover object-top" 
                   />
                </div>
              ) : (
                <>
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
                </>
              )}
          
          </div>
        )}

        {/* ---------------- MOBILE PREVIEW ---------------- */}
        {category === "mobile" && (
          <div className="flex justify-center h-full pt-1">
            <div
              className="
                w-16 sm:w-20
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
                {image ? (
                   <img 
                    src={image} 
                    alt="App" 
                    className="w-full h-full object-cover object-top" 
                   />
                ) : (
                   <>
                    <div className="absolute top-2 left-2 right-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <div className="absolute top-6 left-2 h-8 w-8 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                   </>
                )}
                {/* Notch/Island Hint */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black rounded-b-lg z-10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SYSTEMS PREVIEW ---------------- */}
        {category === "systems" && (
          <div
            className="
              flex-1
              font-mono
              text-[7px] sm:text-[8px]
              leading-relaxed
              p-2
              rounded-md
              bg-zinc-50 dark:bg-black/50
              text-zinc-600
              dark:text-zinc-400
              overflow-hidden
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
    <div className="flex min-h-screen w-full mt-20 text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
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

                {/* Search */}
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
                        
                        {/* New Action Buttons for Featured */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button 
                                className="bg-zinc-900 cursor-pointer dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); window.open(featuredProject.liveUrl, '_blank')}}
                            >
                                <Eye className="w-4 h-4 mr-2" /> Live Preview
                            </Button>
                            <Button 
                                variant="outline" 
                                className="border-zinc-300 dark:border-zinc-700 text-black dark:text-white cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={(e) => { e.stopPropagation(); window.open(featuredProject.repoUrl, '_blank')}}
                            >
                                <Github className="w-4 h-4 mr-2" /> Source Code
                            </Button>
                        </div>

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
                        grid gap-6
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

                            hover:shadow-2xl
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
                                relative
                            "
                            >
                                <ProjectPreview
                                    category={project.category}
                                    color={project.color}
                                    image={project.image}
                                />
                                
                                {/* Overlay Link on entire preview for quick access */}
                                <a 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
                                >
                                </a>
                            </div>

                            {/* ---------- Body ---------- */}
                            <div className="p-5 flex flex-col gap-4 flex-1">
                                <div>
                                    <div className="flex justify-between items-start gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                                            {project.title}
                                        </h3>
                                        
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400">
                                                <Star className="w-3 h-3" />
                                                {project.stats.stars}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400">
                                                <GitBranch className="w-3 h-3" />
                                                {project.stats.forks}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                        {project.description}
                                    </p>
                                </div>

                                {/* ---------- New Action Buttons ---------- */}
                                <div className="grid grid-cols-2 gap-2 mt-auto">
                                    <a 
                                        href={project.liveUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="
                                            flex items-center justify-center gap-2 
                                            px-3 py-2 rounded-lg text-xs font-semibold
                                            bg-zinc-900 text-white 
                                            hover:bg-zinc-700
                                            dark:bg-zinc-100 dark:text-zinc-900
                                            dark:hover:bg-zinc-200
                                            transition-colors
                                        "
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Live Preview
                                    </a>
                                    <a 
                                        href={project.repoUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="
                                            flex items-center justify-center gap-2 
                                            px-3 py-2 rounded-lg text-xs font-semibold
                                            border border-zinc-200 bg-white text-zinc-700
                                            hover:bg-zinc-50 hover:text-black
                                            dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300
                                            dark:hover:bg-zinc-800 dark:hover:text-white
                                            transition-colors
                                        "
                                    >
                                        <Code className="w-3.5 h-3.5" />
                                        Source
                                    </a>
                                </div>

                                {/* ---------- Footer ---------- */}
                                <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-tr from-zinc-200 to-white border border-zinc-200 dark:from-zinc-800 dark:to-zinc-700 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                                            {project.author.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium text-zinc-900 dark:text-zinc-200">
                                                {project.author}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                                                {project.role}
                                            </span>
                                        </div>
                                    </div>
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