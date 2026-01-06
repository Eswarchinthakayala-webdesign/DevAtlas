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
  X,
  Code
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import '../markdown.css'
import mermaid from "mermaid";
import JSTMd from "../md/jst.md?raw";
// ------------------------------------------------------------------
// 1. UTILITY: SLUGIFY
// Converts "Core Concepts" -> "core-concepts" for IDs
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
// 2. MOCK DOCUMENTATION DATA
// ------------------------------------------------------------------

const DOCS_DATA = [
  {
    category: "Onboarding",
    items: [
{
        id: "intro",
        title: "About DevAtlas",
        content: `
# About DevAtlas

Welcome to **DevAtlas**, my personal engineering portfolio and comprehensive knowledge base.

This platform allows me to bridge the gap between **learning** and **building**. Instead of a static resume, DevAtlas serves as a living documentation of my technical journey, providing a transparent view of my skills and growth.

## What is DevAtlas?

DevAtlas is designed around three core pillars that define my career progression:

1.  **The Curriculum**: A detailed tracker of the courses and technical tracks I have mastered (e.g., React Internals, Native Architecture). It's not just a list; it's a proof of knowledge.
2.  **The Showcase**: A gallery of the projects I have engineered. This demonstrates how I translate theoretical concepts into production-ready applications.
3.  **The Profile**: A dynamic dashboard showing my real-time coding activity, GitHub streaks, and contributions.

## Why I Built This

I believe in **Proof of Work**. 

- **Documentation**: I don't just consume content; I document complex concepts to ensure deep understanding.
- **Application**: I build projects to cement my knowledge of frameworks like React, Next.js, and React Native.
- **Consistency**: The profile section proves my daily commitment to writing code.

## The Tech Stack

This website itself is an engineering demonstration, built with:

- **Core**: React ecosystem (Vite)
- **Styling**: Tailwind CSS + Shadcn UI
- **Language**: JavaScript
        `
      }
    ]
  },
  {
    category: "Javascript",
    items: [

      {
  id: "js-1",
  title: "Introduction",
  content: `

# An Introduction to JavaScript

Let's see what's so special about JavaScript, what we can achieve with it, and what other technologies play well with it.

## What is JavaScript?

*JavaScript* was initially created to "make web pages alive".

The programs in this language are called *scripts*. They can be written right in a web page's HTML and run automatically as the page loads.

Scripts are provided and executed as plain text. They don't need special preparation or compilation to run.

In this aspect, JavaScript is very different from another language called [Java](https://en.wikipedia.org/wiki/Java_(programming_language)).


smart header="Why is it called <u>Java</u>Script?"
When JavaScript was created, it initially had another name: "LiveScript". But Java was very popular at that time, so it was decided that positioning a new language as a "younger brother" of Java would help.

But as it evolved, JavaScript became a fully independent language with its own specification called [ECMAScript](http://en.wikipedia.org/wiki/ECMAScript), and now it has no relation to Java at all.


Today, JavaScript can execute not only in the browser, but also on the server, or actually on any device that has a special program called [the JavaScript engine](https://en.wikipedia.org/wiki/JavaScript_engine).

The browser has an embedded engine sometimes called a "JavaScript virtual machine".

Different engines have different "codenames". For example:

* [V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) -- in Chrome, Opera and Edge.
* [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) -- in Firefox.
* ...There are other codenames like "Chakra" for IE, "JavaScriptCore", "Nitro" and "SquirrelFish" for Safari, etc.

The terms above are good to remember because they are used in developer articles on the internet. We'll use them too. For instance, if "a feature X is supported by V8", then it probably works in Chrome, Opera and Edge.


smart header="How do engines work?"

Engines are complicated. But the basics are easy.

1. The engine (embedded if it's a browser) reads ("parses") the script.
2. Then it converts ("compiles") the script to machine code.
3. And then the machine code runs, pretty fast.

The engine applies optimizations at each step of the process. It even watches the compiled script as it runs, analyzes the data that flows through it, and further optimizes the machine code based on that knowledge.


## What can in-browser JavaScript do?

Modern JavaScript is a "safe" programming language. It does not provide low-level access to memory or the CPU, because it was initially created for browsers which do not require it.

JavaScript's capabilities greatly depend on the environment it's running in. For instance, [Node.js](https://wikipedia.org/wiki/Node.js) supports functions that allow JavaScript to read/write arbitrary files, perform network requests, etc.

In-browser JavaScript can do everything related to webpage manipulation, interaction with the user, and the webserver.

For instance, in-browser JavaScript is able to:

* Add new HTML to the page, change the existing content, modify styles.
* React to user actions, run on mouse clicks, pointer movements, key presses.
* Send requests over the network to remote servers, download and upload files (so-called [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) and [COMET](https://en.wikipedia.org/wiki/Comet_(programming)) technologies).
* Get and set cookies, ask questions to the visitor, show messages.
* Remember the data on the client-side ("local storage").

## What CAN'T in-browser JavaScript do?

JavaScript's abilities in the browser are limited to protect the user's safety. The aim is to prevent an evil webpage from accessing private information or harming the user's data.

Examples of such restrictions include:

* JavaScript on a webpage may not read/write arbitrary files on the hard disk, copy them or execute programs. It has no direct access to OS functions.
Modern browsers allow it to work with files, but the access is limited and only provided if the user does certain actions, like "dropping" a file into a browser window or selecting it via an \`<input>\` tag.
There are ways to interact with the camera/microphone and other devices, but they require a user's explicit permission. So a JavaScript-enabled page may not sneakily enable a web-camera, observe the surroundings and send the information to the [NSA](https://en.wikipedia.org/wiki/National_Security_Agency).
* Different tabs/windows generally do not know about each other. Sometimes they do, for example when one window uses JavaScript to open the other one. But even in this case, JavaScript from one page may not access the other page if they come from different sites (from a different domain, protocol or port).
This is called the "Same Origin Policy". To work around that, *both pages* must agree for data exchange and must contain special JavaScript code that handles it. We'll cover that in the tutorial.
This limitation is, again, for the user's safety. A page from \`http://anysite.com\` which a user has opened must not be able to access another browser tab with the URL \`http://gmail.com\`, for example, and steal information from there.
* JavaScript can easily communicate over the net to the server where the current page came from. But its ability to receive data from other sites/domains is crippled. Though possible, it requires explicit agreement (expressed in HTTP headers) from the remote side. Once again, that's a safety limitation.

Such limitations do not exist if JavaScript is used outside of the browser, for example on a server. Modern browsers also allow plugins/extensions which may ask for extended permissions.

## What makes JavaScript unique?

There are at least *three* great things about JavaScript:


compare

* Full integration with HTML/CSS.
* Simple things are done simply.
* Supported by all major browsers and enabled by default.

JavaScript is the only browser technology that combines these three things.

That's what makes JavaScript unique. That's why it's the most widespread tool for creating browser interfaces.

That said, JavaScript can be used to create servers, mobile applications, etc.

## Languages "over" JavaScript

The syntax of JavaScript does not suit everyone's needs. Different people want different features.

That's to be expected, because projects and requirements are different for everyone.

So, recently a plethora of new languages appeared, which are *transpiled* (converted) to JavaScript before they run in the browser.

Modern tools make the transpilation very fast and transparent, actually allowing developers to code in another language and auto-converting it "under the hood".

Examples of such languages:

* [CoffeeScript](https://coffeescript.org/) is "syntactic sugar" for JavaScript. It introduces shorter syntax, allowing us to write clearer and more precise code. Usually, Ruby devs like it.
* [TypeScript](https://www.typescriptlang.org/) is concentrated on adding "strict data typing" to simplify the development and support of complex systems. It is developed by Microsoft.
* [Flow](https://flow.org/) also adds data typing, but in a different way. Developed by Facebook.
* [Dart](https://www.dartlang.org/) is a standalone language that has its own engine that runs in non-browser environments (like mobile apps), but also can be transpiled to JavaScript. Developed by Google.
* [Brython](https://brython.info/) is a Python transpiler to JavaScript that enables the writing of applications in pure Python without JavaScript.
* [Kotlin](https://kotlinlang.org/docs/reference/js-overview.html) is a modern, concise and safe programming language that can target the browser or Node.

There are more. Of course, even if we use one of these transpiled languages, we should also know JavaScript to really understand what we're doing.

## Summary

* JavaScript was initially created as a browser-only language, but it is now used in many other environments as well.
* Today, JavaScript has a unique position as the most widely-adopted browser language, fully integrated with HTML/CSS.
* There are many languages that get "transpiled" to JavaScript and provide certain features. It is recommended to take a look at them, at least briefly, after mastering JavaScript.
`
},
{
   id: "js-2",
  title: "Manuals and specifications",
  content: `
  
# Manuals and specifications

This book is a *tutorial*. It aims to help you gradually learn the language. But once you're familiar with the basics, you'll need other resources.

## Specification

[The ECMA-262 specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm) contains the most in-depth, detailed and formalized information about JavaScript. It defines the language.

But being that formalized, it's difficult to understand at first. So if you need the most trustworthy source of information about the language details, the specification is the right place. But it's not for everyday use.

A new specification version is released every year. Between these releases, the latest specification draft is at <https://tc39.es/ecma262/>.

To read about new bleeding-edge features, including those that are "almost standard" (so-called "stage 3"), see proposals at <https://github.com/tc39/proposals>.

Also, if you're developing for the browser, then there are other specifications covered in the [second part](info:browser-environment) of the tutorial.

## Manuals

- **MDN (Mozilla) JavaScript Reference** is the main manual with examples and other information. It's great to get in-depth information about individual language functions, methods etc.

    You can find it at <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference>.

Although, it's often best to use an internet search instead. Just use "MDN [term]" in the query, e.g. <https://google.com/search?q=MDN+parseInt> to search for the \`parseInt\` function.

## Compatibility tables

JavaScript is a developing language, new features get added regularly.

To see their support among browser-based and other engines, see:

- <https://caniuse.com> - per-feature tables of support, e.g. to see which engines support modern cryptography functions: <https://caniuse.com/#feat=cryptography>.
- <https://kangax.github.io/compat-table> - a table with language features and engines that support those or don't support.

All these resources are useful in real-life development, as they contain valuable information about language details, their support, etc.

Please remember them (or this page) for the cases when you need in-depth information about a particular feature.`
},
{
   id: "js-3",
  title: "Code Editors",
  content: ` 
  # Code editors

A code editor is the place where programmers spend most of their time.

There are two main types of code editors: IDEs and lightweight editors. Many people use one tool of each type.

## IDE

The term [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) (Integrated Development Environment) refers to a powerful editor with many features that usually operates on a "whole project." As the name suggests, it's not just an editor, but a full-scale "development environment."

An IDE loads the project (which can be many files), allows navigation between files, provides autocompletion based on the whole project (not just the open file), and integrates with a version management system (like [git](https://git-scm.com/)), a testing environment, and other "project-level" stuff.

If you haven't selected an IDE yet, consider the following options:

- [Visual Studio Code](https://code.visualstudio.com/) (cross-platform, free).
- [WebStorm](https://www.jetbrains.com/webstorm/) (cross-platform, paid).

For Windows, there's also "Visual Studio", not to be confused with "Visual Studio Code". "Visual Studio" is a paid and mighty Windows-only editor, well-suited for the .NET platform. It's also good at JavaScript. There's also a free version [Visual Studio Community](https://www.visualstudio.com/vs/community/).

Many IDEs are paid, but have a trial period. Their cost is usually negligible compared to a qualified developer's salary, so just choose the best one for you.

## Lightweight editors

"Lightweight editors" are not as powerful as IDEs, but they're fast, elegant and simple.

They are mainly used to open and edit a file instantly.

The main difference between a "lightweight editor" and an "IDE" is that an IDE works on a project-level, so it loads much more data on start, analyzes the project structure if needed and so on. A lightweight editor is much faster if we need only one file.

In practice, lightweight editors may have a lot of plugins including directory-level syntax analyzers and autocompleters, so there's no strict border between a lightweight editor and an IDE.

There are many options, for instance:

- [Sublime Text](https://www.sublimetext.com/) (cross-platform, shareware).
- [Notepad++](https://notepad-plus-plus.org/) (Windows, free).
- [Vim](https://www.vim.org/) and [Emacs](https://www.gnu.org/software/emacs/) are also cool if you know how to use them.

## Let's not argue

The editors in the lists above are those that either I or my friends whom I consider good developers have been using for a long time and are happy with.

There are other great editors in our big world. Please choose the one you like the most.

The choice of an editor, like any other tool, is individual and depends on your projects, habits, and personal preferences.

The author's personal opinion:

- I'd use [Visual Studio Code](https://code.visualstudio.com/) if I develop mostly frontend.
- Otherwise, if it's mostly another language/platform and partially frontend, then consider other editors, such as XCode (Mac), Visual Studio (Windows) or Jetbrains family (Webstorm, PHPStorm, RubyMine etc, depending on the language).`
},
{
  id:"js-4",
  title:"Developer console",
  content:`
  
# Developer console

Code is prone to errors. You will quite likely make errors... Oh, what am I talking about? You are *absolutely* going to make errors, at least if you're a human, not a [robot](https://en.wikipedia.org/wiki/Bender_(Futurama)).

But in the browser, users don't see errors by default. So, if something goes wrong in the script, we won't see what's broken and can't fix it.

To see errors and get a lot of other useful information about scripts, "developer tools" have been embedded in browsers.

Most developers lean towards Chrome or Firefox for development because those browsers have the best developer tools. Other browsers also provide developer tools, sometimes with special features, but are usually playing "catch-up" to Chrome or Firefox. So most developers have a "favorite" browser and switch to others if a problem is browser-specific.

Developer tools are potent; they have many features. To start, we'll learn how to open them, look at errors, and run JavaScript commands.

## Google Chrome

Open the page [bug.html](bug.html).

There's an error in the JavaScript code on it. It's hidden from a regular visitor's eyes, so let's open developer tools to see it.

Press \`key:F12\` or, if you're on Mac, then \`key:Cmd+Opt+J\`.

The developer tools will open on the Console tab by default.

It looks somewhat like this:

![chrome](/chrome.webp)

The exact look of developer tools depends on your version of Chrome. It changes from time to time but should be similar.

- Here we can see the red-colored error message. In this case, the script contains an unknown "lalala" command.
- On the right, there is a clickable link to the source \`bug.html:12\` with the line number where the error has occurred.

Below the error message, there is a blue \`>\` symbol. It marks a "command line" where we can type JavaScript commands. Press \`key:Enter\` to run them.

Now we can see errors, and that's enough for a start. We'll come back to developer tools later and cover debugging more in-depth in the chapter <info:debugging-chrome>.

\`\`\`smart header="Multi-line input"
Usually, when we put a line of code into the console, and then press \`key:Enter\`, it executes.

To insert multiple lines, press \`key:Shift+Enter\`. This way one can enter long fragments of JavaScript code.
\`\`\`

## Firefox, Edge, and others

Most other browsers use \`key:F12\` to open developer tools.

The look & feel of them is quite similar. Once you know how to use one of these tools (you can start with Chrome), you can easily switch to another.

## Safari

Safari (Mac browser, not supported by Windows/Linux) is a little bit special here. We need to enable the "Develop menu" first.

Open Settings and go to the "Advanced" pane. There's a checkbox at the bottom:

![safari](/safari.png)

Now \`key:Cmd+Opt+C\` can toggle the console. Also, note that the new top menu item named "Develop" has appeared. It has many commands and options.

## Summary

- Developer tools allow us to see errors, run commands, examine variables, and much more.
- They can be opened with \`key:F12\` for most browsers on Windows. Chrome for Mac needs \`key:Cmd+Opt+J\`, Safari: \`key:Cmd+Opt+C\` (need to enable first).

Now we have the environment ready. In the next section, we'll get down to JavaScript.

  `
}

    ]
  },
  {
    category: "React Ecosystem",
    items: [
      {
        id: "react-vite",
        title: "React via Vite",
        content: `
# React Runtime: Vite

While React is the library, **Vite** is the build tool that serves it. We choose Vite over Create-React-App (CRA) for its Native ESM (ECMAScript Modules) support, offering near-instant server starts.

## Initialization

Scaffold a new Single Page Application (SPA) using the Vite CLI.

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## Architecture
Vite projects distinguish between **Public** assets (served as-is) and **Source** code (compiled).

\`\`\`
/src
  /assets      # Imported images/fonts
  /components  # Atomic UI units
  App.tsx      # Root Component
  main.tsx     # DOM Injection Entry Point
\`\`\`
        `
      }
    ]
  },
  {
    category: "Next.js Framework",
    items: [
      {
        id: "next-intro",
        title: "Next.js Architecture",
        content: `
# Next.js: The React Framework

Next.js handles the configuration needed for production: Hybrid Rendering, Routing, and Optimization.

## App Router Paradigm
We utilize the modern **App Router** (\`app/\` directory), which leverages React Server Components (RSC). This allows components to render on the server by default, sending zero JavaScript to the client.

## Installation

Initialize a full-stack environment:

\`\`\`bash
npx create-next-app@latest
\`\`\`

**Recommended Configuration:**
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- \`src/\` directory: **Yes**
- App Router: **Yes**
- Import alias (\`@/*\`): **Yes**
        `
      },
      {
        id: "next-ui-stack",
        title: "UI Engineering (Shadcn + Tailwind)",
        content: `
# The Modern UI Stack

We utilize a "Headless" approach to UI. We do not use component libraries that trap us in their design system (like MUI or Bootstrap). Instead, we own our component code.

## The Stack
1.  **Tailwind CSS**: Atomic styling engine.
2.  **Radix UI**: Accessible, headless primitives.
3.  **Shadcn UI**: Copy/paste component architecture.

## Integration Pipeline

Assuming a fresh Next.js installation with Tailwind CSS configured:

### 1. Initialize Shadcn
Run the CLI to configure your \`components.json\` and theme variables.

\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

### 2. Utility Class Merge
This setup installs a \`cn()\` utility (usually in \`lib/utils.ts\`). This is crucial for merging Tailwind classes dynamically without conflicts.

\`\`\`typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
\`\`\`

### 3. Adding Components
Unlike npm packages, you add component source code to your project.

\`\`\`bash
npx shadcn-ui@latest add button
\`\`\`

This creates \`components/ui/button.tsx\`, which you can fully customize.
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
                {section.category === "Onboarding" && <Zap className="w-3 h-3" />}
                {section.category === "Javascript" && <Code className="w-3 text-yellow-400 dark:text-yellow-500 h-3" />}
                {section.category === "React Ecosystem" && <Layers className="w-3 h-3" />}
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