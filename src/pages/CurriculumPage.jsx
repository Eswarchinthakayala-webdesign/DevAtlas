import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  Code2,
  Smartphone,
  Server,
  Layout,
  Zap,
  Filter,
  MoreVertical,
  Trophy,
  ArrowLeft,
  FileText,
  Hash,
  Cpu,
  Database,
  Layers,
  Flame,
  Menu,
  X,
  PlayCircle
} from "lucide-react";

// ------------------------------------------------------------------
// 1. DATA STORE (Enhanced with Markdown Content)
// ------------------------------------------------------------------

export const CURRICULUM_DATA = [
  {
    id: "track-react-core",
    title: "React Internals & Architecture",
    description: "A comprehensive text-based analysis of the React reconciliation algorithm, fiber architecture, and concurrent rendering features.",
    icon: Code2,
    level: "Advanced",
    totalDuration: "12h 45m",
    modules: [
      {
        id: "mod-rec-algo",
        title: "The Reconciliation Algorithm",
        duration: "45m",
        lessons: [
          { 
            id: "les-vdom-real", 
            title: "Virtual DOM vs Real DOM: Memory Allocation", 
            duration: "10 min read", 
            type: "concept",
            content: `
# Virtual DOM vs Real DOM

React creates a tree of custom objects ("virtual DOM") in memory.

## Why Virtual DOM?
Manipulating the DOM is slow. Updating the virtual DOM is fast.

\`\`\`javascript
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
\`\`\`
            `
          },
          { 
            id: "les-diff-algo", 
            title: "The Heuristic O(n) Diffing Algorithm", 
            duration: "15 min read", 
            type: "documentation",
            content: "# Diffing Algorithm\n\nReact implements a heuristic O(n) algorithm..." 
          },
          { 
            id: "les-keys-render", 
            title: "Keys and List Rendering Performance", 
            duration: "12 min read", 
            type: "guide",
            content: "# Keys\n\nKeys help React identify which items have changed..." 
          },
          { 
            id: "les-batching", 
            title: "Automatic Batching in React 18", 
            duration: "8 min read", 
            type: "concept",
            content: "# Automatic Batching\n\nReact 18 batches state updates..." 
          },
        ]
      },
      {
        id: "mod-fiber-arch",
        title: "React Fiber Architecture",
        duration: "2h 10m",
        lessons: [
          { 
            id: "les-fiber-node", 
            title: "Anatomy of a Fiber Node", 
            duration: "18 min read", 
            type: "documentation",
            content: "# Fiber Node\n\nA Fiber is a JavaScript object that contains information about a component..." 
          },
          { id: "les-work-loop", title: "The Work Loop & Scheduler Priority", duration: "25 min read", type: "architecture", content: "# Work Loop\n\n..." },
          { id: "les-phases", title: "Render Phase vs Commit Phase", duration: "20 min read", type: "concept", content: "# Phases\n\n..." },
          { id: "les-time-slice", title: "Time Slicing & Interruptible Rendering", duration: "30 min read", type: "guide", content: "# Time Slicing\n\n..." },
        ]
      },
      {
        id: "mod-concurrent",
        title: "Concurrent Features",
        duration: "3h 00m",
        lessons: [
          { id: "les-use-trans", title: "useTransition: Non-blocking Updates", duration: "20 min read", type: "documentation", content: "# useTransition\n\n..." },
          { id: "les-use-defer", title: "useDeferredValue Implementation Details", duration: "15 min read", type: "guide", content: "# useDeferredValue\n\n..." },
          { id: "les-suspense", title: "Suspense Boundaries & Fallback UI", duration: "45 min read", type: "architecture", content: "# Suspense\n\n..." },
          { id: "les-streaming", title: "Streaming Server Rendering (SSR)", duration: "50 min read", type: "guide", content: "# SSR Streaming\n\n..." },
        ]
      },
      {
        id: "mod-state-mgmt",
        title: "State Management Patterns",
        duration: "2h 30m",
        lessons: [
          { id: "les-context-perf", title: "Context API Performance Pitfalls", duration: "25 min read", type: "guide", content: "# Context API\n\n..." },
          { id: "les-zustand", title: "Atomic State with Zustand", duration: "20 min read", type: "documentation", content: "# Zustand\n\n..." },
          { id: "les-server-state", title: "Server State vs Client State", duration: "15 min read", type: "concept", content: "# Server State\n\n..." },
        ]
      }
    ]
  },
  // ... (Other tracks would follow the same structure with 'content' added)
  {
    id: "track-comp-patterns",
    title: "Advanced Component Patterns",
    description: "Design scalable, headless component libraries using composition, compound components, and advanced props patterns.",
    icon: Layout,
    level: "Intermediate",
    totalDuration: "8h 30m",
    modules: [
        {
            id: "mod-composition",
            title: "Composition Patterns",
            duration: "1h 30m",
            lessons: [
              { id: "les-containment", title: "Containment vs Specialization", duration: "15 min read", type: "concept", content: "# Containment\n\n..." },
            ]
        }
    ]
  },
  {
    id: "track-native-prod",
    title: "React Native Production",
    description: "Building high-performance mobile applications. Bridge architecture, JSI, and native modules.",
    icon: Smartphone,
    level: "Expert",
    totalDuration: "15h 00m",
    modules: [
        {
            id: "mod-bridge",
            title: "The Native Bridge",
            duration: "1h 45m",
            lessons: [
              { id: "les-threads", title: "JS Thread vs UI Thread Architecture", duration: "20 min read", type: "architecture", content: "# Threads\n\n..." },
            ]
        }
    ]
  },
  {
    id: "track-edge-eng",
    title: "Edge & Server Engineering",
    description: "Backend-for-frontend patterns. Next.js App Router, Edge Functions, and Distributed Databases.",
    icon: Server,
    level: "Expert",
    totalDuration: "10h 15m",
    modules: [
        {
            id: "mod-runtimes",
            title: "Runtime Environments",
            duration: "1h 15m",
            lessons: [
                { id: "les-node-edge", title: "Node.js vs Edge Runtime Differences", duration: "20 min read", type: "concept", content: "# Runtimes\n\n..." },
            ]
        }
    ]
  }
];

// ------------------------------------------------------------------
// 2. UTILITY HELPER: DATE FUNCTIONS
// ------------------------------------------------------------------

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

// ------------------------------------------------------------------
// 3. REUSABLE SIDEBAR CONTENT COMPONENT
// ------------------------------------------------------------------

const SidebarContent = ({ 
  activeTrackId, 
  setActiveTrackId, 
  streakData, 
  chartHeights, 
  calculateTrackProgress,
  onNavigate 
}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950/50">
      {/* Sidebar Header */}
        <div
        className="
            px-6 pt-6 pb-5
            border-b border-zinc-200 dark:border-zinc-800
            bg-white dark:bg-zinc-950
        "
        >
        {/* Back Navigation */}
        <Link
            to="/"
            className="
            mb-6 inline-flex items-center gap-2
            text-sm font-medium
            text-zinc-500 dark:text-zinc-400
            hover:text-zinc-900 dark:hover:text-white
            transition-colors group
            "
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
        </Link>

        {/* Brand Block */}
        <div className="flex items-center gap-3">
            <div
                className="
                    h-10 w-10 rounded-xl flex items-center justify-center
                    bg-black text-white
                    shadow-sm
                    dark:bg-white dark:text-black
                "
            >
                <Terminal className="h-6 w-6" />
            </div>
    
            <div className="min-w-0">
                <h1 className="font-bold text-base text-black/90 dark:text-white sm:text-lg tracking-tight truncate">
                    DevAtlas
                </h1>
                <span className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-500">
                    CURRICULUM
                </span>
            </div>
        </div>
        </div>


      {/* Track List */}
      <ScrollArea className="flex-1 bg-white dark:bg-black px-4 py-6">
        <div className="space-y-8">
        <div className="px-2">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest
                        text-zinc-500 dark:text-zinc-400">
            <Layers className="w-3 h-3" />
            Core Tracks
        </h3>

        <div className="space-y-1">
            {CURRICULUM_DATA.map((track) => {
            const progress = calculateTrackProgress(track);
            const isCompleted = progress === 100;
            const isActive = activeTrackId === track.id;

            return (
                <button
                key={track.id}
                onClick={() => {
                    setActiveTrackId(track.id);
                    if (onNavigate) onNavigate();
                }}
                className={cn(
                    "group relative w-full cursor-pointer overflow-hidden rounded-lg border px-3 py-3 text-left transition-all",
                    "border-transparent",
                    isActive
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-black dark:text-white dark:ring-zinc-800"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/60"
                )}
                >
                {/* Active indicator */}
                {isActive && (
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-zinc-500" />
                )}

                <div className="relative z-10 flex items-start gap-3">
                    <div
                    className={cn(
                        "mt-0.5",
                        isActive
                        ? "text-zinc-500"
                        : "text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                    )}
                    >
                    <track.icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                        {track.title}
                        </span>

                        {isCompleted && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        )}
                    </div>

                    <div className="mt-2">
                        <Progress
                        value={progress}
                        className="h-1 bg-zinc-200 dark:bg-zinc-800"
                        indicatorClassName={cn(
                            "transition-colors",
                            isCompleted
                            ? "bg-zinc-500"
                            : "bg-zinc-400 dark:bg-zinc-500"
                        )}
                        />
                    </div>
                    </div>
                </div>
                </button>
            );
            })}
        </div>
        </div>


          {/* Weekly Streak Widget */}
            <div className="px-2">
            <div
                className="
                relative overflow-hidden rounded-xl border
                bg-gradient-to-br
                from-white to-zinc-50
                border-zinc-200
                p-5
                group

                dark:from-zinc-900 dark:to-black
                dark:border-zinc-800
                "
            >
                <div
                className={cn(
                    `
                    absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px]
                    pointer-events-none transition-colors duration-1000
                    `,
                    streakData.currentStreak > 0
                    ? `
                        bg-orange-500/15 group-hover:bg-orange-500/25
                        dark:bg-orange-500/10 dark:group-hover:bg-orange-500/20
                    `
                    : `
                        bg-zinc-200/40
                        dark:bg-zinc-800/30
                    `
                )}
                />

                <div className="relative z-10 flex justify-between items-start mb-4">
                <div>
                    <h4
                    className="
                        text-xs font-semibold uppercase tracking-widest mb-1
                        text-zinc-500
                        dark:text-zinc-400
                    "
                    >
                    Activity Log
                    </h4>

                    <div className="flex items-baseline gap-1">
                    <span
                        className={cn(
                        "text-2xl font-bold transition-colors",
                        streakData.currentStreak > 0
                            ? "text-orange-500"
                            : "text-zinc-400 dark:text-zinc-500"
                        )}
                    >
                        {streakData.currentStreak}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-500">
                        day streak
                    </span>
                    </div>
                </div>

                <div
                    className={cn(
                    `
                    p-2 rounded-full transition-all duration-500
                    `,
                    streakData.currentStreak > 0
                        ? `
                        bg-orange-500/10
                        dark:bg-orange-500/10
                        `
                        : `
                        bg-zinc-100
                        dark:bg-zinc-800
                        `
                    )}
                >
                    <Flame
                    className={cn(
                        "w-5 h-5 transition-all duration-500",
                        streakData.currentStreak > 0
                        ? "text-orange-500 fill-orange-500/40"
                        : "text-zinc-400 dark:text-zinc-600"
                    )}
                    />
                </div>
                </div>

                <div className="relative z-10 flex gap-1.5 h-12 items-end">
                {chartHeights.map((h, i) => {
                    const isToday = i === 6;
                    return (
                    <div
                        key={i}
                        className="
                        flex-1 h-full flex items-end overflow-hidden rounded-sm
                        bg-zinc-100
                        dark:bg-zinc-800/40
                        "
                    >
                        <motion.div
                        initial={false}
                        animate={{ height: `${Math.max(h, 5)}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "w-full transition-colors duration-300",
                            isToday && h > 0
                            ? "bg-orange-500"
                            : h > 0
                                ? "bg-zinc-400 dark:bg-zinc-400"
                                : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                        />
                    </div>
                    );
                })}
                </div>

                <div className="flex justify-between mt-2 px-0.5">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-600">
                    7 Days Ago
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-600">
                    Today
                </span>
                </div>
            </div>
            </div>

        </div>
      </ScrollArea>
    </div>
  );
};

const TypeIcon = ({ type }) => {
    switch (type) {
      case "architecture": return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case "documentation": return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case "concept": return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case "guide": return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
      default: return <Hash className="w-3.5 h-3.5 text-zinc-400" />;
    }
};

// ------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ------------------------------------------------------------------

export default function CurriculumPage() {
  // --- STATE MANAGEMENT ---
  const [activeTrackId, setActiveTrackId] = useState(() => {
    return localStorage.getItem("devatlas_active_track") || CURRICULUM_DATA[0].id;
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("devatlas_completed_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem("devatlas_streak_data");
    return saved ? JSON.parse(saved) : { currentStreak: 0, history: {} };
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("devatlas_active_track", activeTrackId);
  }, [activeTrackId]);

  useEffect(() => {
    localStorage.setItem("devatlas_completed_lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("devatlas_streak_data", JSON.stringify(streakData));
  }, [streakData]);


  // --- LOGIC ---
  const updateStreakLogic = (isAdding) => {
    const today = getTodayDate();
    setStreakData(prev => {
        const newHistory = { ...prev.history };
        const currentCount = newHistory[today] || 0;
        
        if (isAdding) {
            newHistory[today] = currentCount + 1;
        } else {
            newHistory[today] = Math.max(0, currentCount - 1);
        }

        let calculatedStreak = 0;
        const d = new Date();
        const todayStr = d.toISOString().split("T")[0];
        
        if ((newHistory[todayStr] || 0) > 0) calculatedStreak++;

        while (true) {
            d.setDate(d.getDate() - 1);
            const dateStr = d.toISOString().split("T")[0];
            if ((newHistory[dateStr] || 0) > 0) {
                calculatedStreak++;
            } else {
                break;
            }
        }
        return { currentStreak: calculatedStreak, history: newHistory };
    });
  };

  const toggleLesson = (lessonId) => {
    let isAdding = false;
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        isAdding = true;
        return [...prev, lessonId];
      }
    });
    setTimeout(() => updateStreakLogic(isAdding), 0);
  };

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const activeTrack = CURRICULUM_DATA.find(t => t.id === activeTrackId) || CURRICULUM_DATA[0];

  const calculateTrackProgress = (track) => {
    const totalLessons = track.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedCount = track.modules.reduce((acc, mod) => {
      return acc + mod.lessons.filter(l => completedLessons.includes(l.id)).length;
    }, 0);
    return totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  };

  const calculateModuleProgress = (module) => {
    const total = module.lessons.length;
    const completed = module.lessons.filter(l => completedLessons.includes(l.id)).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return CURRICULUM_DATA;
    const lowerQuery = searchQuery.toLowerCase();

    return CURRICULUM_DATA.map(track => {
      const trackMatches = track.title.toLowerCase().includes(lowerQuery);
      const filteredModules = track.modules.map(mod => {
        const modMatches = mod.title.toLowerCase().includes(lowerQuery);
        const filteredLessons = mod.lessons.filter(l => l.title.toLowerCase().includes(lowerQuery));
        if (modMatches || filteredLessons.length > 0) {
            return { ...mod, lessons: filteredLessons.length > 0 ? filteredLessons : mod.lessons };
        }
        return null;
      }).filter(Boolean);

      if (trackMatches || filteredModules.length > 0) {
        return { ...track, modules: filteredModules.length > 0 ? filteredModules : track.modules };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery && filteredData.length > 0) {
        const currentInFiltered = filteredData.find(t => t.id === activeTrackId);
        if (!currentInFiltered) {
            setActiveTrackId(filteredData[0].id);
        }
    }
  }, [filteredData, searchQuery, activeTrackId]);

  const displayTrack = filteredData.find(t => t.id === activeTrackId) || activeTrack;

  const last7Days = useMemo(() => getLast7Days(), []);
  const chartHeights = last7Days.map(date => {
     const count = streakData.history[date] || 0;
     return Math.min(count * 10, 100);
  });

  return (
    <div className="flex min-h-screen w-full mt-20 text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* ------------------ DESKTOP SIDEBAR (Aside) ------------------ */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
        <SidebarContent 
            activeTrackId={activeTrackId}
            setActiveTrackId={setActiveTrackId}
            streakData={streakData}
            chartHeights={chartHeights}
            calculateTrackProgress={calculateTrackProgress}
        />
      </aside>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <main className="flex-1 flex flex-col min-w-0  relative">
        
        {/* Background Grids */}
       <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid pattern */}
        <div
            className="
            absolute inset-0
            bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),
                linear-gradient(to_bottom,#0000000a_1px,transparent_1px)]
            bg-[size:32px_32px]

            dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),
                    linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]
            "
        />

        {/* Top fade */}
        <div
            className="
            absolute top-0 left-0 right-0 h-64
            bg-gradient-to-b
            from-white/60 to-transparent

            dark:from-zinc-900/40
            "
        />
        </div>


            {/* Header */}
            <header
            className="
                w-full
                h-18
                flex items-center justify-between
                px-4 md:px-10
                border-b
                border-zinc-200
                bg-transparent
                dark:border-zinc-800
            "
            >
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
                {/* MOBILE SIDEBAR TRIGGER */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="
                        xl:hidden
                        text-zinc-500 hover:text-zinc-900

                        dark:text-zinc-400
                        dark:hover:text-white
                    "
                    >
                    <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="
                    p-0 w-80
                    bg-white
                    border-r border-zinc-200

                    dark:bg-zinc-950
                    dark:border-zinc-800
                    "
                >
                    <SidebarContent
                    activeTrackId={activeTrackId}
                    setActiveTrackId={setActiveTrackId}
                    streakData={streakData}
                    chartHeights={chartHeights}
                    calculateTrackProgress={calculateTrackProgress}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                    />
                </SheetContent>
                </Sheet>

                {/* Search */}
                <div className="relative w-full group">
                <Search
                    className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    w-4 h-4
                    text-zinc-400
                    group-focus-within:text-zinc-700

                    dark:text-zinc-500
                    dark:group-focus-within:text-white
                    transition-colors
                    "
                />

                <Input
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                    h-10 w-full rounded-full pl-10 text-sm
                    bg-zinc-50 border-zinc-200
                    focus:bg-white focus:border-zinc-300

                    dark:bg-zinc-900/50
                    dark:border-zinc-800
                    dark:focus:bg-zinc-900
                    dark:focus:border-zinc-700

                    transition-all
                    "
                />
                </div>
            </div>

            </header>


        {/* Main Scrollable Area */}
        <ScrollArea className="flex-1 z-10">
           <div className="w-full max-w-[1800px] mx-auto p-4 md:p-10 pb-10 space-y-10">
              
            {/* Hero Section */}
            <motion.section
            key={displayTrack.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
                relative overflow-hidden rounded-3xl border p-6 md:p-12

                bg-white
                border-zinc-200

                dark:bg-zinc-900/40
                dark:border-zinc-800
            "
            >
            {/* Decorative Icon */}
            <div
                className="
                absolute top-0 right-0 p-12 pointer-events-none hidden md:block
                opacity-[0.04]
                dark:opacity-[0.06]
                "
            >
                <displayTrack.icon className="w-96 h-96 text-zinc-900 dark:text-white" />
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-start justify-between">
                {/* Left Content */}
                <div className="flex-1 space-y-6 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge
                    variant="outline"
                    className="
                        rounded-md px-3 py-1 text-xs font-medium
                        border-zinc-300/50 bg-zinc-50 text-zinc-700

                        dark:border-zinc-900/50
                        dark:bg-zinc-900/10
                        dark:text-zinc-400
                    "
                    >
                    {displayTrack.level}
                    </Badge>

                    <span
                    className="
                        flex items-center text-xs font-mono rounded border px-2 py-1

                        text-zinc-500 bg-zinc-100 border-zinc-200

                        dark:text-zinc-400
                        dark:bg-zinc-900/50
                        dark:border-zinc-800
                    "
                    >
                    <Clock className="w-3 h-3 mr-1.5" />
                    {displayTrack.totalDuration}
                    </span>
                </div>

                <h1
                    className="
                    text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight

                    text-zinc-900
                    dark:text-white
                    "
                >
                    {displayTrack.title}
                </h1>

                <p
                    className="
                    text-base md:text-xl leading-relaxed max-w-2xl

                    text-zinc-600
                    dark:text-zinc-400
                    "
                >
                    {displayTrack.description}
                </p>
                </div>

                {/* Progress Circle */}
                <div
                className="
                    hidden md:flex flex-col items-center gap-3 self-start
                    rounded-2xl border p-6 backdrop-blur-sm

                    bg-zinc-50 border-zinc-200

                    dark:bg-zinc-950/50
                    dark:border-zinc-800/50
                "
                >
                <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg
                    className="h-full w-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                    >
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        className="text-zinc-200 dark:text-zinc-800"
                        strokeWidth="8"
                    />

                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{
                        strokeDashoffset:
                            251.2 -
                            (251.2 * calculateTrackProgress(displayTrack)) / 100,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span
                        className="
                        text-2xl font-bold tabular-nums
                        text-zinc-900
                        dark:text-white
                        "
                    >
                        {calculateTrackProgress(displayTrack)}%
                    </span>
                    </div>
                </div>

                <span
                    className="
                    text-xs font-medium uppercase tracking-widest

                    text-zinc-500
                    dark:text-zinc-500
                    "
                >
                    Track Completion
                </span>
                </div>
            </div>
            </motion.section>


              {/* Modules Grid */}
              <div className="space-y-6">
                <div
                    className="
                        flex items-end justify-between pb-4 border-b
                        border-zinc-200
                        dark:border-zinc-800
                    "
                    >
                    <div>
                        <h2
                        className="
                            text-xl md:text-2xl font-bold
                            text-zinc-900
                            dark:text-white
                        "
                        >
                        Core Modules
                        </h2>

                        <p
                        className="
                            text-xs md:text-sm mt-1
                            text-zinc-500
                            dark:text-zinc-500
                        "
                        >
                        Select a module to expand contents.
                        </p>
                    </div>
                    </div>

<motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  {displayTrack.modules.map((module, index) => {
    const moduleProgress = calculateModuleProgress(module);
    const isExpanded = expandedModules[module.id];
    const isModuleCompleted = moduleProgress === 100;

    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border",
          isExpanded
            ? `
              col-span-1 xl:col-span-2
              bg-white border-zinc-300 ring-1 ring-zinc-300/60
              dark:bg-zinc-900/40 dark:border-zinc-700 dark:ring-zinc-700/50
            `
            : `
              bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50
              dark:bg-zinc-900/20 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/30
            `
        )}
      >
        {/* ---------------- Module Header ---------------- */}
        <div
          onClick={() => toggleModule(module.id)}
          className="
            p-6 md:p-8 cursor-pointer
            flex flex-col md:flex-row md:items-center justify-between gap-6
            group select-none
          "
        >
          <div className="flex items-start gap-5">
            {/* Index */}
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
                isModuleCompleted
                  ? `
                    bg-zinc-500/10 border-zinc-500/30 text-zinc-600
                    dark:text-zinc-400
                  `
                  : `
                    bg-zinc-100 border-zinc-300 text-zinc-500
                    dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400
                  `
              )}
            >
              <span className="text-sm font-bold font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <h3
                className="
                  text-lg md:text-xl font-bold transition-colors
                  text-zinc-900 group-hover:text-zinc-600
                  dark:text-white dark:group-hover:text-zinc-400
                "
              >
                {module.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> {module.duration}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{module.lessons.length} topics</span>
                <span className="hidden sm:inline">•</span>
                <span
                  className={cn(
                    "font-medium",
                    isModuleCompleted
                      ? "text-zinc-600 dark:text-zinc-400"
                      : "text-zinc-500"
                  )}
                >
                  {moduleProgress}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Progress + Chevron */}
          <div className="flex items-center gap-6 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
            <div className="flex-1 md:w-32 md:flex-none">
              <Progress
                value={moduleProgress}
                className="h-1.5 bg-zinc-200 dark:bg-zinc-800"
                indicatorClassName={cn(
                  "bg-zinc-500",
                  isModuleCompleted && "bg-zinc-500"
                )}
              />
            </div>

            <div
              className={cn(
                `
                  h-8 w-8 rounded-full flex items-center justify-center
                  transition-all duration-300
                  bg-zinc-100 text-zinc-500
                  group-hover:bg-zinc-200
                  dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700
                `,
                isExpanded &&
                  `
                    rotate-180
                    bg-zinc-900 text-white
                    dark:bg-white dark:text-black
                  `
              )}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ---------------- Lessons ---------------- */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="
                border-t
                bg-zinc-50 border-zinc-200
                dark:bg-black/20 dark:border-zinc-800/50
              "
            >
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <div
                        key={lesson.id}
                        className={cn(
                            "group/lesson flex items-center justify-between p-4 rounded-xl border transition-all select-none",
                            isCompleted
                            ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-900/20"
                            : "bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700"
                        )}
                        >
                        {/* 1. Link Area (Navigates to Learning Page) */}
                        <Link 
                            to={`/learning/${activeTrack.id}/${module.id}/${lesson.id}`}
                            className="flex items-center gap-4 flex-1 cursor-pointer"
                        >
                            {/* Icon / Status */}
                            <div
                            className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors border",
                                isCompleted
                                ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                                : "bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:border-zinc-700"
                            )}
                            >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col gap-1 min-w-0">
                            <span
                                className={cn(
                                "text-sm font-medium transition-colors line-clamp-1",
                                isCompleted
                                    ? "text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-500 dark:decoration-zinc-600"
                                    : "text-zinc-900 group-hover/lesson:text-zinc-700 dark:text-zinc-200 dark:group-hover/lesson:text-white"
                                )}
                            >
                                {lesson.title}
                            </span>

                            <span className="flex items-center text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                                <TypeIcon type={lesson.type} />
                                <span className="ml-1.5">{lesson.type}</span>
                                <span className="mx-1.5">•</span>
                                {lesson.duration}
                            </span>
                            </div>
                        </Link>

                        {/* 2. Checkbox Area (Toggles Completion) */}
                        <div
                            onClick={(e) => {
                            e.stopPropagation(); // Stop click from triggering Link
                            toggleLesson(lesson.id);
                            }}
                            className="ml-4 cursor-pointer p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                        >
                            <div
                            className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                isCompleted
                                ? "bg-zinc-500 border-zinc-500"
                                : "border-zinc-300 dark:border-zinc-600"
                            )}
                            >
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  })}
</motion.div>

              </div>
           </div>
        </ScrollArea>
      </main>
    </div>
  );
}