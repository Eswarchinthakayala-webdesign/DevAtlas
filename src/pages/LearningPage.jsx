import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import mermaid from "mermaid";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  Menu,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Code2,
  Check,
  Trophy,
  Scroll,
  Layout,
  Smartphone,
  Server,

} from "lucide-react";
import { useTheme } from "../components/theme-provider";
import '../markdown.css'
import { CURRICULUM_DATA } from "../data/curriculum";
// ------------------------------------------------------------------
// 1. DATA & UTILS
// ------------------------------------------------------------------

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// Helper to extract raw text from React children (Fixes the [object Object] error)
const getNodeText = (node) => {
  if (["string", "number"].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join("");
  if (typeof node === "object" && node?.props?.children)
    return getNodeText(node.props.children);
  return "";
};



const Mermaid = ({ chart }) => {
  const { theme } = useTheme?.() ?? { theme: "system" };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const ref = useRef(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (!chart) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      themeVariables: {
        background: isDark ? "#000000" : "#ffffff",
        primaryColor: isDark ? "#27272a" : "#fff",
        primaryBorderColor: isDark ? "#3f3f46" : "#d4d4d8",
        primaryTextColor: isDark ? "#ffffff" : "#fff",
        lineColor: isDark ? "#71717a" : "#a1a1aa",
      },
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error("Mermaid error:", error);
        setSvg(`
          <pre class="
            text-xs p-3 rounded-lg border
            text-red-600 bg-red-50 border-red-200
            dark:text-red-400 dark:bg-red-950/30 dark:border-red-900
          ">
${error.message}
          </pre>
        `);
      }
    };

    renderChart();
  }, [chart, isDark]);

  return (
    <div
      ref={ref}
      className="
        my-6 flex justify-center overflow-x-auto rounded-xl border p-6

        bg-white border-zinc-200
        dark:bg-black dark:border-zinc-800
      "
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};






// ------------------------------------------------------------------
// 2. STYLES (Custom Markdown Theme)
// ------------------------------------------------------------------
const editorStyles = `
  .wmde-markdown { background: transparent !important; color: #a1a1aa !important; font-family: ui-sans-serif, system-ui !important; font-size: 1.05rem; line-height: 1.8; }
  .wmde-markdown h1 { color: white !important; font-size: 2.25rem !important; font-weight: 800; border-bottom: 1px solid #27272a; padding-bottom: 1rem; margin-bottom: 2rem; margin-top: 1rem; scroll-margin-top: 100px; }
  .wmde-markdown h2 { color: #f4f4f5 !important; font-size: 1.5rem !important; font-weight: 700; margin-top: 3rem; margin-bottom: 1rem; scroll-margin-top: 100px; }
  .wmde-markdown h3 { color: #e4e4e7 !important; font-size: 1.25rem !important; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; scroll-margin-top: 100px; }
  .wmde-markdown code { background: #18181b !important; color: #e4e4e7; border: 1px solid #27272a; border-radius: 4px; padding: 2px 6px; font-size: 0.9em; font-family: monospace; }
  .wmde-markdown pre { background: #09090b !important; border: 1px solid #27272a; border-radius: 8px; margin: 2rem 0; }
  .wmde-markdown blockquote { border-left: 4px solid #10b981; background: #064e3b10; padding: 1.5rem; color: #d1fae5; margin: 2rem 0; border-radius: 0 8px 8px 0; }
`;

// ------------------------------------------------------------------
// 3. COMPONENTS
// ------------------------------------------------------------------

// --- Completion Modal (Theme Aware) ---
const CompletionModal = ({ isOpen, onClose, lessonTitle }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="
          fixed inset-0 z-[100] flex items-center justify-center p-4
          bg-black/40 backdrop-blur-sm

          dark:bg-black/80
        "
      >
        <motion.div
          initial={{ scale: 0.85, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="
            relative w-full max-w-sm overflow-hidden rounded-3xl p-8 text-center shadow-2xl
            border border-zinc-200
            bg-white

            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >
          {/* Ambient Glow */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
              from-zinc-300/40 via-transparent to-transparent

              dark:from-zinc-500/20
              animate-pulse
            "
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Trophy */}
            <div
              className="
                mb-6 flex h-20 w-20 items-center justify-center rounded-full
                border shadow-inner

                bg-zinc-100 border-zinc-200
                dark:bg-zinc-900 dark:border-zinc-800
              "
            >
              <Trophy
                className="
                  h-10 w-10
                  text-yellow-500
                  fill-yellow-500/30
                "
              />
            </div>

            {/* Title */}
            <h2
              className="
                mb-2 text-2xl font-bold
                text-zinc-900

                dark:text-white
              "
            >
              Lesson Complete!
            </h2>

            {/* Subtitle */}
            <p
              className="
                mb-6 text-sm leading-relaxed
                text-zinc-500

                dark:text-zinc-400
              "
            >
              You’ve mastered{" "}
              <span
                className="
                  font-medium
                  text-zinc-700

                  dark:text-zinc-300
                "
              >
                “{lessonTitle}”
              </span>
              .
            </p>

            {/* CTA */}
            <Button
              onClick={onClose}
              className="
                w-full rounded-full font-bold transition
                bg-zinc-900 text-white hover:bg-zinc-800

                dark:bg-white dark:text-black dark:hover:bg-zinc-200
              "
            >
              Continue Learning
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);




// --- Table of Contents (Fixed Right Sidebar) ---
const TableOfContents = ({ content, containerRef }) => {
  const [activeId, setActiveId] = useState("");
  
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split("\n");
    const regex = /^(#{1,3})\s+(.*)$/;
    return lines.map((line) => {
        const match = line.match(regex);
        if (match) {
          return { level: match[1].length, text: match[2], id: slugify(match[2]) };
        }
        return null;
      }).filter(Boolean);
  }, [content]);

  // Scroll Spy Logic
  useEffect(() => {
    if (!containerRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: containerRef.current, rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, containerRef]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
<div
  className="
    hidden xl:flex flex-col w-72 sticky top-0
    h-[calc(100vh-4rem)]
    p-8 pl-0

    border-l border-zinc-200
    bg-white/70 backdrop-blur

    dark:border-zinc-800
    dark:bg-black/50
  "
>
  <div className="pl-4 py-2">
    <h4
      className="
        text-xs font-bold uppercase tracking-widest mb-4
        text-zinc-500
        dark:text-zinc-500
      "
    >
      On This Page
    </h4>

    {/* Navigation List */}
    <div
      className="
        relative flex flex-col pl-4 space-y-3
        border-l border-zinc-200

        dark:border-zinc-800
      "
    >
      {headings.map((item) => (
        <button
          key={item.id}
          onClick={() => handleScrollTo(item.id)}
          className={cn(
            `
            relative block text-left cursor-pointer transition-colors
            focus:outline-none
            `,
            activeId === item.id
              ? `
                text-zinc-900 font-medium
                dark:text-zinc-300
              `
              : `
                text-zinc-500 hover:text-zinc-700
                dark:text-zinc-500 dark:hover:text-zinc-300
              `,
            item.level === 3 && "pl-4 text-xs"
          )}
        >
          {/* Active Indicator */}
          {activeId === item.id && (
            <motion.div
              layoutId="toc-active-indicator"
              className="
                absolute -left-[17px] top-0 bottom-0 w-[2px]
                rounded-full

                bg-zinc-400
                dark:bg-zinc-500
              "
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {item.text}
        </button>
      ))}
    </div>
  </div>
</div>

  );
};

// --- Lesson Sidebar (Fixed Left Sidebar) ---
const LessonSidebar = ({
  activeTrack,
  currentLessonId,
  completedLessons,
  toggleLesson,
  onNavigate
}) => {
  const totalTrackLessons = activeTrack.modules.flatMap(m => m.lessons).length;
  const completedTrackLessons = activeTrack.modules
    .flatMap(m => m.lessons)
    .filter(l => completedLessons.includes(l.id)).length;

  const trackProgress =
    totalTrackLessons === 0
      ? 0
      : Math.round((completedTrackLessons / totalTrackLessons) * 100);

  return (
    <aside
      className="
        flex flex-col
        h-screen min-h-0
        bg-white text-zinc-900
        dark:bg-zinc-950 dark:text-white
      "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
          shrink-0
          p-6 border-b
          border-zinc-200
          dark:border-zinc-800
        "
      >
        <Link
          to="/curriculum"
          className="
            flex items-center gap-2 mb-6 text-sm font-medium
            text-zinc-500 hover:text-zinc-900
            dark:text-zinc-400 dark:hover:text-white
            transition-colors group
          "
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Curriculum
        </Link>

        <h2
          className="
            font-bold text-lg leading-tight mb-3 truncate
            text-zinc-900 dark:text-white
          "
        >
          {activeTrack.title}
        </h2>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Progress
            value={trackProgress}
            className="h-1.5 flex-1 bg-zinc-200 dark:bg-zinc-800"
            indicatorClassName="bg-zinc-500"
          />
          <span className="text-zinc-500">{trackProgress}%</span>
        </div>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <ScrollArea className="flex-1 pb-20 min-h-0">
        <div className="px-4 py-6 space-y-8">
          {activeTrack.modules.map((module, idx) => (
            <div key={module.id}>
              {/* Module Title */}
              <h3
                className="
                  px-2 mb-3 flex items-center gap-2
                  text-xs font-bold uppercase tracking-widest
                  text-zinc-500
                "
              >
                <span
                  className="
                    w-5 h-5 flex items-center justify-center rounded
                    text-[10px]
                    bg-zinc-100 border border-zinc-200 text-zinc-600
                    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400
                  "
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {module.title}
              </h3>

              {/* Lessons */}
              <div
                className="
                  relative ml-2 pl-3 space-y-1
                  border-l border-zinc-200
                  dark:border-zinc-800
                "
              >
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <div key={lesson.id} className="relative">
                      <Link
                        to={`/learning/${activeTrack.id}/${module.id}/${lesson.id}`}
                        onClick={onNavigate}
                        className={cn(
                          `
                            flex items-start gap-3 p-2 rounded-lg text-sm
                            transition-all relative
                          `,
                          isActive
                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 dark:text-zinc-400 dark:hover:bg-zinc-900/50"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-lesson-glow"
                            className="
                              absolute -left-[13px] top-2 bottom-2 w-[2px] rounded-full
                              bg-zinc-500
                            "
                          />
                        )}

                        {/* Completion Toggle */}
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLesson(lesson.id);
                          }}
                          className={cn(
                            `
                              mt-0.5 w-4 h-4 shrink-0 rounded-full border
                              flex items-center justify-center cursor-pointer
                              transition-colors z-20
                            `,
                            isCompleted
                              ? "bg-zinc-500 border-zinc-500 text-white"
                              : "border-zinc-400 hover:border-zinc-600 dark:border-zinc-600 dark:hover:border-zinc-400"
                          )}
                        >
                          <Check className="w-3 h-3" />
                        </div>

                        <span className="leading-snug">{lesson.title}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};


// ------------------------------------------------------------------
// 5. MAIN PAGE COMPONENT
// ------------------------------------------------------------------

export default function LearningPage() {
  const { trackId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null); // Ref for scrollable middle area

    const { theme } = useTheme?.() ?? { theme: "system" };  
    const isDark =
         theme === "dark" ||
         (theme === "system" &&
           typeof window !== "undefined" &&
           window.matchMedia("(prefers-color-scheme: dark)").matches); 

  // State
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("devatlas_completed_lessons");
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);


  // Scroll Reset
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lessonId]);

  // Data Resolution
  const activeTrack = CURRICULUM_DATA.find(t => t.id === trackId);
  const activeModule = activeTrack?.modules.find(m => m.id === moduleId);
  const activeLesson = activeModule?.lessons.find(l => l.id === lessonId);

  // Navigation Logic
  const flatLessons = useMemo(() => {
    if (!activeTrack) return [];
    return activeTrack.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  }, [activeTrack]);

  const currentIndex = flatLessons.findIndex(l => l.id === lessonId);
  const prevLesson = flatLessons[currentIndex - 1];
  const nextLesson = flatLessons[currentIndex + 1];

  // Handlers
  const handleMarkComplete = () => {
    if (!activeLesson) return;
    if (!completedLessons.includes(activeLesson.id)) setShowConfetti(true);
    setCompletedLessons(prev => {
      const newSet = [...new Set([...prev, activeLesson.id])];
      localStorage.setItem("devatlas_completed_lessons", JSON.stringify(newSet));
      return newSet;
    });
  };

  const toggleLesson = (id) => {
    setCompletedLessons(prev => {
        const newSet = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
        localStorage.setItem("devatlas_completed_lessons", JSON.stringify(newSet));
        return newSet;
    });
  };

  if (!activeTrack || !activeLesson) return <div className="p-10 text-white  h-screen">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(activeLesson.id);

  return (
    <div className="flex min-h-screen fixed  pb-20 mt-20 w-full  text-white font-sans overflow-hidden selection:bg-zinc-500/30 selection:text-zinc-200">
      
      {/* 1. FIXED LEFT SIDEBAR (Desktop) */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30 flex-col ">
        <LessonSidebar 
          activeTrack={activeTrack} 
          currentLessonId={lessonId} 
          completedLessons={completedLessons}
          toggleLesson={toggleLesson}
        />
      </aside>

      {/* 2. MIDDLE CONTENT AREA (Flexible) */}
      <main className="flex-1 flex flex-col min-w-0  relative">
        
       {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
            <div
                className="
                absolute inset-0
                bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),
                    linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]
                bg-[size:32px_32px]

                dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
                        linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
                "
            />
            </div>


            {/* Sticky Header */}
            <header
            className="
                sticky top-0 z-20 shrink-0 h-16
                flex items-center justify-between px-6
                border-b
               border-zinc-200
                 dark:border-zinc-800
            "
            >
            <div className="flex items-center gap-4 flex-1 min-w-0">
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
                    p-0 w-80
                     text-black border-r border-zinc-200

                     dark:text-white dark:border-zinc-800
                    "
                >
                    <LessonSidebar
                    activeTrack={activeTrack}
                    currentLessonId={lessonId}
                    completedLessons={completedLessons}
                    toggleLesson={toggleLesson}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                    />
                </SheetContent>
                </Sheet>

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm truncate min-w-0">
                <span className="hidden sm:block shrink-0 text-zinc-500 dark:text-zinc-400">
                    {activeTrack.title}
                </span>

                <ChevronRight className="hidden sm:block w-4 h-4 text-zinc-400 dark:text-zinc-600" />

                <span className="hidden sm:block shrink-0 text-zinc-500 dark:text-zinc-400">
                    {activeModule.title}
                </span>

                <ChevronRight className="hidden sm:block w-4 h-4 text-zinc-400 dark:text-zinc-600" />

                <span className="truncate font-medium text-zinc-900 dark:text-white">
                    {activeLesson.title}
                </span>
                </div>
            </div>

            {/* Action */}
            <div className="flex items-center gap-3">
                <Button
                size="sm"
                onClick={handleMarkComplete}
                className={cn(
                    `
                    h-9 rounded-full cursor-pointer font-medium transition-all
                    shadow-[0_0_15px_rgba(16,185,129,0.2)]
                    `,
                    isCompleted
                    ? `
                        bg-zinc-200 text-zinc-700 hover:bg-zinc-300
                        dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600
                    `
                    : `
                        bg-black text-white hover:bg-zinc-800
                        dark:bg-white dark:text-black dark:hover:bg-zinc-200
                    `
                )}
                >
                {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                ) : (
                    <div className="w-4 h-4 mr-2 border-2 border-current rounded-full" />
                )}

                {isCompleted ? "Completed" : "Mark Complete"}
                </Button>
            </div>
            </header>


        {/* Scrollable Content Container */}
        {/* We attach ref here so TOC can observe elements inside this scroll container */}
            <div
            ref={contentRef}
            className="
                flex-1 overflow-y-auto scroll-smooth relative z-10
               
            "
            >
            <div className="flex max-w-[1600px] mx-auto">
                {/* CONTENT COLUMN */}
                <div className="flex-1 min-w-0 p-6 md:p-12 lg:pr-16 max-w-4xl">
                <motion.div
                    key={activeLesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* META */}
                    <div className="flex items-center gap-3 mb-8">
                    <Badge
                        variant="outline"
                        className="
                        rounded-md
                        border-zinc-300 text-zinc-600 bg-zinc-100
                        dark:border-zinc-500/30 dark:text-zinc-400 dark:bg-zinc-500/10
                        "
                    >
                        {activeLesson.type}
                    </Badge>

                    <span className="flex items-center text-xs font-mono text-zinc-500 dark:text-zinc-500">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {activeLesson.duration} read
                    </span>
                    </div>

                    {/* MARKDOWN BODY */}
                    <div className="overflow-y-auto no-scrollbar h-screen">
                    <div data-color-mode={isDark ? "dark" : "light"} className="prose  prose-invert max-w-none">
                        <MDEditor.Markdown 
                           source={activeLesson.content}
                         components={{
                              
                              // FIX: Extract text from children properly for code blocks
                              code: ({ inline, children, className, ...props }) => {
                                const match = /language-(\w+)/.exec(className || "");
                                const codeContent = getNodeText(children); // Use helper here
                                
                                if (!inline && match && match[1] === "mermaid") {
                                  return <Mermaid chart={codeContent} />;
                                }
                                return <code className={className} {...props}>{children}</code>;
                              }
                            }}
                           
                            style={{ 
                                backgroundColor: isDark ? "transparent" : "", 
                                fontSize: '1rem'
                            }} 
                        />
                    </div>
                    {/* NAVIGATION FOOTER */}
                    <div
                    className="
                        mt-20 pt-8 pb-80
                        grid grid-cols-1 sm:grid-cols-2 gap-4
                        border-t border-zinc-200
                        dark:border-zinc-800
                    "
                    >
                    {/* PREVIOUS */}
                    {prevLesson ? (
                        <Link to={`/learning/${trackId}/${prevLesson.moduleId}/${prevLesson.id}`}>
                        <button
                            className="
                            w-full group flex flex-col items-start text-left
                            p-6 rounded-2xl
                            border transition-all duration-300
                               
                            cursor-pointer
                            bg-white border-zinc-200
                            hover:bg-zinc-50 hover:border-zinc-300

                            dark:bg-zinc-900/40 dark:border-zinc-800
                            dark:hover:bg-zinc-900/70 dark:hover:border-zinc-700
                            "
                        >
                            <span
                            className="
                                flex items-center gap-1
                                text-xs font-bold uppercase tracking-widest mb-2
                                text-zinc-500
                                dark:text-zinc-400
                            "
                            >
                            <ChevronLeft className="w-3 h-3" />
                            Previous Lesson
                            </span>

                            <span
                            className="
                                text-lg font-semibold
                                text-zinc-900
                                dark:text-zinc-100
                                group-hover:underline underline-offset-4
                            "
                            >
                            {prevLesson.title}
                            </span>
                        </button>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {/* NEXT */}
                    {nextLesson ? (
                        <Link to={`/learning/${trackId}/${nextLesson.moduleId}/${nextLesson.id}`}>
                        <button
                            className="
                            w-full group flex flex-col items-end text-right
                            p-6 rounded-2xl
                            cursor-pointer
                            border transition-all duration-300

                            bg-white border-zinc-200
                            hover:bg-zinc-50 hover:border-zinc-300

                            dark:bg-zinc-900/40 dark:border-zinc-800
                            dark:hover:bg-zinc-900/70 dark:hover:border-zinc-700
                            "
                        >
                            <span
                            className="
                                flex items-center gap-1
                                text-xs font-bold uppercase tracking-widest mb-2
                                text-zinc-500
                                dark:text-zinc-400
                            "
                            >
                            Next Lesson
                            <ChevronRight className="w-3 h-3" />
                            </span>

                            <span
                            className="
                                text-lg font-semibold
                                text-zinc-900
                                dark:text-zinc-100
                                group-hover:underline underline-offset-4
                            "
                            >
                            {nextLesson.title}
                            </span>
                        </button>
                        </Link>
                    ) : (
                        <div
                        className="
                            flex flex-col items-end justify-center text-right
                            p-6 rounded-2xl
                            border border-dashed

                            bg-zinc-50 border-zinc-300 text-zinc-500

                            dark:bg-zinc-900/20 dark:border-zinc-800 dark:text-zinc-400
                        "
                        >
                        <span className="text-sm">Track Complete</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-200">
                            Great Job! 🎉
                        </span>
                        </div>
                    )}
                    </div>

                    </div>
                </motion.div>
                </div>

                {/* RIGHT SIDEBAR */}
                <TableOfContents
                content={activeLesson.content}
                containerRef={contentRef}
                />
            </div>
            </div>

      </main>

      {/* Completion Overlay */}
      <CompletionModal 
        isOpen={showConfetti} 
        onClose={() => setShowConfetti(false)} 
        lessonTitle={activeLesson.title} 
      />
    </div>
  );
}