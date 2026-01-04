import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
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
  BookOpen,
  ArrowLeft,
  Menu,
  ChevronRight,
  Hash,
  FileText,
  Copy,
  Check,
  Code2,
  Cpu,
  Layers,
  Zap,
  Layout,
  Globe,
  X
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import '../markdown.css'
// ------------------------------------------------------------------
// 1. UTILITY: SLUGIFY
// Converts "Core Concepts" -> "core-concepts" for IDs
// ------------------------------------------------------------------
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Helper to extract raw text from React children (for the ID generation)
const getNodeText = (node) => {
  if (["string", "number"].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join("");
  if (typeof node === "object" && node?.props?.children)
    return getNodeText(node.props.children);
  return "";
};

// ------------------------------------------------------------------
// 2. MOCK DOCUMENTATION DATA
// ------------------------------------------------------------------

const DOCS_DATA = [
  {
    category: "Getting Started",
    items: [
      {
        id: "intro",
        title: "Introduction",
        content: `
# DevAtlas Protocol

DevAtlas is a structured learning environment designed to bridge the gap between **theoretical knowledge** and **production engineering**. Unlike traditional courses, DevAtlas functions as an operating system for your learning journey.

## Core Philosophy

1.  **System over Syntax**: We prioritize architectural patterns over syntax memorization.
2.  **Production Grade**: All modules enforce TypeScript, Accessibility (a11y), and Testing.
3.  **Non-Linear**: Jump between React internals, Systems Design, and Native mobile development.

## System Requirements

Before initializing the protocol, ensure your environment meets these standards:

- **Node.js**: v18.17.0 or higher
- **PackageManager**: pnpm (recommended) or npm v9+
- **Editor**: VS Code with the *DevAtlas Extension Pack*

\`\`\`bash
# Verify your node version
node -v
# v20.10.0
\`\`\`
        `
      },
      {
        id: "installation",
        title: "Installation & Setup",
        content: `
# Installation

Initialize your local learning environment using our CLI tool. This will scaffold your personal dashboard and sync your progress with the remote protocol.

## Step 1: The CLI

Run the initialization command in your terminal:

\`\`\`bash
npx create-devatlas@latest
\`\`\`

You will be prompted to select your track:
- \`Core (React + Next.js)\`
- \`Mobile (React Native + Expo)\`
- \`Systems (Rust + Wasm)\`

## Step 2: Configuration

Create a \`.devatlasrc\` file in your root directory to customize your learning path:

\`\`\`json
{
  "theme": "zinc",
  "modules": ["react-internals", "system-design"],
  "mode": "strict"
}
\`\`\`

> **Note**: Strict mode enforces test passing before unlocking the next module.
        `
      }
    ]
  },
  {
    category: "Core Concepts",
    items: [
      {
        id: "architecture",
        title: "Architecture",
        content: `
# System Architecture

DevAtlas is built on a **headless content model**. This means the curriculum data is decoupled from the presentation layer, allowing you to consume the learning materials via our web dashboard, CLI, or even a custom VS Code extension.

## The Sync Engine

Your progress is tracked via a local CRDT (Conflict-free Replicated Data Type) store, ensuring that you can learn offline. When you reconnect, your progress syncs with the global ledger.

\`\`\`mermaid
graph LR
A[Local State] -- Sync --> B((DevAtlas Cloud))
B -- Update --> C[Leaderboards]
\`\`\`

## Module Structure

Each module consists of three distinct phases:

| Phase | Description | Output |
| :--- | :--- | :--- |
| **Ingest** | Reading documentation and watching concept videos. | Knowledge Graph |
| **Apply** | Completing interactive labs and coding challenges. | Git Commit |
| **Verify** | Automated tests run against your solution. | Pass/Fail |
        `
      },
      {
        id: "cli-reference",
        title: "CLI Reference",
        content: `
# Command Line Interface

The \`da\` (DevAtlas) command line tool is your primary interface for interacting with the curriculum.

## Common Commands

### \`da sync\`
Synchronizes your local progress with the cloud.

### \`da submit\`
Submits the current lab for verification.

\`\`\`bash
$ da submit ./labs/module-01
> Running tests...
> ✅ Reconciliation tests passed
> ✅ Fiber architecture tests passed
> 🚀 Module Completed! +500 XP
\`\`\`

### \`da next\`
Downloads the next lesson in your active track.
        `
      }
    ]
  },
  {
    category: "API Reference",
    items: [
      {
        id: "sdk",
        title: "DevAtlas SDK",
        content: `
# DevAtlas SDK

Build custom tools on top of your learning data using the Node.js SDK.

## Usage

\`\`\`javascript
import { DevAtlas } from '@devatlas/sdk';

const client = new DevAtlas({
  apiKey: process.env.DA_KEY
});

// Fetch your current streak
const profile = await client.user.getProfile();
console.log(profile.streak); // 12
\`\`\`
        `
      }
    ]
  }
];

// ------------------------------------------------------------------
// 3. COMPONENTS
// ------------------------------------------------------------------

const SidebarContent = ({
  activeDocId,
  setActiveDocId,
  onNavigate,
  docsData,
}) => (
  <aside
    className="
      flex flex-col h-full
      bg-white
      border-r border-zinc-200

      dark:bg-zinc-950/60
      dark:border-zinc-800
    "
  >
    {/* ---------------- HEADER ---------------- */}
    <div
      className="
        p-4 sm:p-6
        border-b border-zinc-200

        dark:border-zinc-800
      "
    >
      <Link
        to="/"
        className="
          flex items-center gap-2 mb-5
          text-zinc-500 hover:text-zinc-900
          transition-colors group text-sm

          dark:text-zinc-400 dark:hover:text-white
        "
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

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
            DOCS
          </span>
        </div>
      </div>
    </div>

    {/* ---------------- CONTENT ---------------- */}
    <ScrollArea className="flex-1 px-2 sm:px-4 py-4 sm:py-6">
      <div className="space-y-8">
        {/* PRIMARY NAV */}
        <nav className="px-1 space-y-1">
          <Link
            to="/curriculum"
            onClick={onNavigate}
            className="
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100

              dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900
            "
          >
            <Code2 className="w-4 h-4" />
            Curriculum
          </Link>

          <Link
            to="/showcase"
            onClick={onNavigate}
            className="
              flex items-center gap-3 px-3 py-2 rounded-md text-sm
              text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100

              dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900
            "
          >
            <Layout className="w-4 h-4" />
            Showcase
          </Link>
        </nav>

        {/* DOC SECTIONS */}
        {docsData.length > 0 ? (
          docsData.map((section, idx) => (
            <div key={idx}>
              <h3
                className="
                  px-2 mb-3 text-xs font-bold uppercase tracking-widest
                  text-zinc-500 flex items-center gap-2

                  dark:text-zinc-400
                "
              >
                {section.category === "Getting Started" && <Zap className="w-3 h-3" />}
                {section.category === "Core Concepts" && <Cpu className="w-3 h-3" />}
                {section.category === "API Reference" && <Layers className="w-3 h-3" />}
                {section.category}
              </h3>

              <div
                className="
                  ml-2 pl-3 space-y-0.5
                  border-l border-zinc-200

                  dark:border-zinc-800
                "
              >
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveDocId(item.id);
                      if (onNavigate) onNavigate();
                    }}
                    className={cn(
                      `
                      relative w-full cursor-pointer text-left px-2 py-1.5 rounded-md text-sm transition-all
                      `,
                      activeDocId === item.id
                        ? `
                          font-medium text-zinc-900 bg-zinc-100
                          dark:text-white dark:bg-zinc-900
                        `
                        : `
                          text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/70
                          dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60
                        `
                    )}
                  >
                    {item.title}

                    {/* Active Indicator: Aligned vertically on the border line */}
                    {activeDocId === item.id && (
                      <span
                        className="
                          absolute -left-[13px] top-1.5 bottom-1.5 w-[2px] rounded-full
                          bg-zinc-500
                        "
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              mx-2 mt-6 p-4 text-sm text-center rounded-lg border border-dashed
              text-zinc-500 border-zinc-300

              dark:text-zinc-500 dark:border-zinc-800
            "
          >
            No matching documents found.
          </div>
        )}
      </div>
    </ScrollArea>
  </aside>
);

// ------------------------------------------------------------------
// 4. MAIN PAGE
// ------------------------------------------------------------------

export default function DocumentationPage() {
  const [activeDocId, setActiveDocId] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Ref to scroll content to top on change
  const contentRef = useRef(null);
  const { theme } = useTheme?.() ?? { theme: "system" };  
  const isDark =
       theme === "dark" ||
       (theme === "system" &&
         typeof window !== "undefined" &&
         window.matchMedia("(prefers-color-scheme: dark)").matches);  

  // Scroll to top when doc changes
  useEffect(() => {
    if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeDocId]);

  // --- LOGIC: SEARCH FILTER ---
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return DOCS_DATA;
    const lowerQuery = searchQuery.toLowerCase();

    return DOCS_DATA.map(section => {
      const filteredItems = section.items.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.content.toLowerCase().includes(lowerQuery)
      );
      
      if (filteredItems.length > 0) {
        return { ...section, items: filteredItems };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  // --- LOGIC: NEXT / PREV BUTTONS ---
  const flatDocs = useMemo(() => DOCS_DATA.flatMap(s => s.items), []);
  const currentIndex = flatDocs.findIndex(i => i.id === activeDocId);
  const activeDoc = flatDocs[currentIndex];
  const prevDoc = flatDocs[currentIndex - 1];
  const nextDoc = flatDocs[currentIndex + 1];

  // --- LOGIC: TABLE OF CONTENTS ---
  // Generate TOC based on the regex of ## headers in raw markdown
  const toc = useMemo(() => {
    if (!activeDoc) return [];
    return activeDoc.content.match(/^## (.*$)/gm)?.map(h => h.replace('## ', '')) || [];
  }, [activeDoc]);

  // --- LOGIC: SCROLL TO SECTION ---
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex min-h-screen mt-20 w-full scroll-smooth text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
        <SidebarContent 
            activeDocId={activeDocId} 
            setActiveDocId={setActiveDocId} 
            docsData={filteredDocs}
        />
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
            bg-[size:20px_20px] sm:bg-[size:24px_24px] lg:bg-[size:32px_32px]
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),
                    linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
            "
        />
        </div>

        {/* Header */}
        <header
          className="
            sticky top-0 z-40 h-16
            border-b
            border-zinc-200
            flex items-center justify-between
            px-3 sm:px-4 md:px-6
            dark:border-zinc-800
            
            backdrop-blur-xl
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    xl:hidden
                    text-zinc-600 hover:text-zinc-900
                    dark:text-zinc-400 dark:hover:text-white
                  "
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="
                  p-0 w-80
                  bg-white text-zinc-900
                  border-r border-zinc-200
                  dark:bg-zinc-950 dark:border-zinc-800 dark:text-white
                "
              >
                <SidebarContent
                  activeDocId={activeDocId}
                  setActiveDocId={setActiveDocId}
                  docsData={filteredDocs}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm truncate">
              <span className="text-zinc-500 dark:text-zinc-500">Docs</span>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className="truncate text-zinc-900 dark:text-zinc-200 font-medium">
                {activeDoc?.title}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <Input
                placeholder="Search docs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  h-9 pl-9 pr-9 rounded-full text-sm
                  bg-white border-zinc-200 text-zinc-900
                  focus:bg-white
                  dark:bg-zinc-900/70
                  dark:border-zinc-800
                  dark:text-white
                "
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea ref={contentRef} className="flex-1 z-10">
           <div className="max-w-[1600px] mx-auto flex">
              
              {/* Markdown Content */}
              <div className="flex-1 min-w-0 p-6 md:p-12 lg:pr-16 overflow-hidden sm:w-[clamp(100%,80vw,1280px)] w-screen">
                 <motion.div
                    key={activeDocId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                 >
                    <div className="flex items-center gap-2 mb-6">
                        <Badge variant="outline" className="border-zinc-900/50 text-zinc-500 bg-zinc-900/10">
                            v2.4.0
                        </Badge>
                        <span className="text-xs text-zinc-500">Last updated today</span>
                    </div>

                    {/* CUSTOM MARKDOWN RENDERER WITH ID INJECTION */}
                    <div data-color-mode={isDark ? "dark" : "light"} className="prose prose-invert max-w-none">
                        <MDEditor.Markdown 
                            source={activeDoc?.content} 
                            components={{
                                // Custom renderers to add IDs to headers
                                h1: ({ children }) => <h1 id={slugify(getNodeText(children))}>{children}</h1>,
                                h2: ({ children }) => <h2 id={slugify(getNodeText(children))}>{children}</h2>,
                                h3: ({ children }) => <h3 id={slugify(getNodeText(children))}>{children}</h3>,
                            }}
                            style={{ 
                                backgroundColor: isDark ? "transparent" : "", 
                                fontSize: '1rem'
                            }} 
                        />
                    </div>

                    {/* Pagination */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
                        <div className="flex-1">
                        {prevDoc && (
                            <Button
                            variant="outline"
                            onClick={() => setActiveDocId(prevDoc.id)}
                            className="
                                w-full sm:w-auto h-auto px-4 py-3 flex flex-col items-start gap-1 rounded-xl transition cursor-pointer
                                bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400
                                dark:bg-black dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:border-zinc-700
                            "
                            >
                            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                                <ArrowLeft className="w-3 h-3" /> Previous
                            </span>
                            <span className="text-sm sm:text-base font-semibold">{prevDoc.title}</span>
                            </Button>
                        )}
                        </div>

                        <div className="flex-1 sm:flex sm:justify-end">
                        {nextDoc && (
                            <Button
                            variant="outline"
                            onClick={() => setActiveDocId(nextDoc.id)}
                            className="
                                w-full sm:w-auto h-auto px-4 py-3 flex flex-col items-end gap-1 text-right rounded-xl transition cursor-pointer
                                bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400
                                dark:bg-black dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:border-zinc-700
                            "
                            >
                            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                                Next <ChevronRight className="w-3 h-3" />
                            </span>
                            <span className="text-sm sm:text-base font-semibold">{nextDoc.title}</span>
                            </Button>
                        )}
                        </div>
                    </div>
                    </div>

                 </motion.div>
              </div>

              {/* Right Sidebar: Table of Contents */}
              <div className="hidden lg:block w-72 sticky top-0 h-[calc(100vh-4rem)] p-8 pl-0">
                <div className="lg:sticky lg:top-16 h-auto lg:h-[calc(100vh-4rem)] px-4 lg:px-0">
                    <div className="
                        relative rounded-xl lg:rounded-none border border-zinc-200 bg-white p-5 lg:p-0 lg:pl-6 lg:border-0 lg:border-l
                        dark:bg-black dark:border-zinc-800
                    ">
                    <div className="pb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-zinc-600 dark:text-zinc-500">
                        On This Page
                        </h4>

                        <ul className="space-y-2">
                        {toc.length > 0 ? (
                            toc.map((item, idx) => {
                                const id = slugify(item);
                                return (
                                    <li key={idx}>
                                        <a
                                        href={`#${id}`}
                                        onClick={(e) => handleScrollToSection(e, id)}
                                        className="
                                            block text-sm leading-snug transition-colors
                                            text-zinc-600 hover:text-black
                                            dark:text-zinc-400 dark:hover:text-white
                                        "
                                        >
                                        {item}
                                        </a>
                                    </li>
                                )
                            })
                        ) : (
                            <li className="text-sm italic text-zinc-500 dark:text-zinc-600">
                            No sub-sections
                            </li>
                        )}
                        </ul>
                    </div>

                    <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-600 dark:text-zinc-500">
                        Community
                        </h4>
                        <div className="space-y-2">
                        <a href="#" className="flex items-center gap-2 text-sm transition-colors text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                            <FileText className="w-3.5 h-3.5" /> Edit on GitHub
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm transition-colors text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                            <Check className="w-3.5 h-3.5" /> Report an issue
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
              </div>

           </div>
        </ScrollArea>
      </main>
    </div>
  );
}