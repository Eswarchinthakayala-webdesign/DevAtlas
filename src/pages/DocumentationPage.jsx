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
},
{
  id: "js-5",
  title: "Hello World",
  content: `
# Hello, world!

This part of the tutorial is about core JavaScript, the language itself.

But we need a working environment to run our scripts and, since this book is online, the browser is a good choice. We'll keep the amount of browser-specific commands (like \`alert\`) to a minimum so that you don't spend time on them if you plan to concentrate on another environment (like Node.js). We'll focus on JavaScript in the browser in the [next part](/ui) of the tutorial.

So first, let's see how we attach a script to a webpage. For server-side environments (like Node.js), you can execute the script with a command like \`"node my.js"\`.

## The "script" tag

JavaScript programs can be inserted almost anywhere into an HTML document using the \`<script>\` tag.

For instance:

\`\`\`html
<!DOCTYPE HTML>
<html>

<body>

  <p>Before the script...</p>

  <script>
    alert( 'Hello, world!' );
  </script>

  <p>...After the script.</p>

</body>

</html>
\`\`\`

The \`<script>\` tag contains JavaScript code which is automatically executed when the browser processes the tag.

## Modern markup

The \`<script>\` tag has a few attributes that are rarely used nowadays but can still be found in old code:

**The \`type\` attribute: \`<script type=...>\`**
The old HTML standard, HTML4, required a script to have a \`type\`. Usually it was \`type="text/javascript"\`. It's not required anymore. Also, the modern HTML standard totally changed the meaning of this attribute. Now, it can be used for JavaScript modules. But that's an advanced topic, we'll talk about modules in another part of the tutorial.

**The \`language\` attribute: \`<script language=...>\`**
This attribute was meant to show the language of the script. This attribute no longer makes sense because JavaScript is the default language. There is no need to use it.

**Comments before and after scripts**
In really ancient books and guides, you may find comments inside \`<script>\` tags, like this:

\`\`\`html
<script type="text/javascript"></script>
\`\`\`

This trick isn't used in modern JavaScript. These comments hide JavaScript code from old browsers that didn't know how to process the \`<script>\` tag. Since browsers released in the last 15 years don't have this issue, this kind of comment can help you identify really old code.

## External scripts

If we have a lot of JavaScript code, we can put it into a separate file.

Script files are attached to HTML with the \`src\` attribute:

\`\`\`html
<script src="/path/to/script.js"></script>
\`\`\`

Here, \`/path/to/script.js\` is an absolute path to the script from the site root. One can also provide a relative path from the current page. For instance, \`src="script.js"\`, just like \`src="./script.js"\`, would mean a file \`"script.js"\` in the current folder.

We can give a full URL as well. For instance:

\`\`\`html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
\`\`\`

To attach several scripts, use multiple tags:

\`\`\`html
<script src="/js/script1.js"></script>
<script src="/js/script2.js"></script>
…
\`\`\`

> **Separate files benefits**
>
> As a rule, only the simplest scripts are put into HTML. More complex ones reside in separate files.
>
> The benefit of a separate file is that the browser will download it and store it in its [cache](https://en.wikipedia.org/wiki/Web_cache).
>
> Other pages that reference the same script will take it from the cache instead of downloading it, so the file is actually downloaded only once.
>
> That reduces traffic and makes pages faster.

> **Warning: If \`src\` is set, the script content is ignored.**
>
> A single \`<script>\` tag can't have both the \`src\` attribute and code inside.
>
> This won't work:
>
> \`\`\`html
> <script src="file.js">
>   alert(1); // the content is ignored, because src is set
> </script>
> \`\`\`
>
> We must choose either an external \`<script src="…">\` or a regular \`<script>\` with code.
>
> The example above can be split into two scripts to work:
>
> \`\`\`html
> <script src="file.js"></script>
> <script>
>   alert(1);
> </script>
> \`\`\`

## Summary

- We can use a \`<script>\` tag to add JavaScript code to a page.
- The \`type\` and \`language\` attributes are not required.
- A script in an external file can be inserted with \`<script src="path/to/script.js"></script>\`.

There is much more to learn about browser scripts and their interaction with the webpage. But let's keep in mind that this part of the tutorial is devoted to the JavaScript language, so we shouldn't distract ourselves with browser-specific implementations of it. We'll be using the browser as a way to run JavaScript, which is very convenient for online reading, but only one of many.
`
},
{
  id: "js-6",
  title: "Code Structure",
  content: `
# Code Structure

The first step in mastering JavaScript is understanding its fundamental building blocks.

## Statements

Statements are syntax constructs and commands that perform actions. They are the "sentences" of the language.

We've already seen a statement:
\`\`\`javascript
alert('Hello, world!');
\`\`\`

We can have as many statements in our code as we want. Statements can be separated with a semicolon.

\`\`\`javascript
alert('Hello'); alert('World');
\`\`\`

**Best Practice:** usually, statements are written on separate lines to maximize readability:

\`\`\`javascript
alert('Hello');
alert('World');
\`\`\`

## Semicolons

A semicolon may be omitted in most cases when a line break exists. JavaScript interprets the line break as an "implicit" semicolon. This is called **Automatic Semicolon Insertion (ASI)**.

However, "in most cases" does not mean "always".

### The Trap: Implicit Insertion Failure
There are situations where JavaScript fails to assume a semicolon where it is really needed, leading to bugs that are difficult to trace.

Consider this error scenario involving square brackets \`[]\`:

\`\`\`javascript
// ❌ This code throws an error
alert("Hello")

[1, 2].forEach(alert);
\`\`\`

**Why does this fail?**
Because JavaScript does not assume a semicolon before square brackets. The engine treats the code as a single statement:

\`\`\`javascript
// How the engine reads it:
alert("Hello")[1, 2].forEach(alert);
\`\`\`

It tries to treat the result of \`alert("Hello")\` as an array/object and access index \`[1, 2]\` of it, which is invalid.

> **Production Rule:**
> We recommend **always** putting semicolons between statements, even if they are separated by newlines. While it is possible to rely on ASI, explicit semicolons are safer and standard in professional codebases.

## Comments

As programs grow in complexity, it becomes necessary to add *comments* to describe the logic. Comments are completely ignored by the JavaScript engine; they exist solely for developers.

### Single-line Comments
Start with two forward slashes \`//\`. The rest of the line is a comment.

\`\`\`javascript
// This comment occupies a line of its own
alert('Hello');

alert('World'); // This comment follows the statement
\`\`\`

### Multiline Comments
Start with \`/*\` and end with \`*/\`.

\`\`\`javascript
/* An example with two messages.
This is a multiline comment.
*/
alert('Hello');
alert('World');
\`\`\`

> **Pro Tip: Hotkeys**
> In most editors (VS Code, WebStorm), you can toggle comments quickly:
> * **Win/Linux:** \`Ctrl + /\`
> * **Mac:** \`Cmd + /\`

> **Warning: Nested Comments**
> Nested multiline comments are not supported and will cause an error.
>
> \`\`\`javascript
> /*
>   /* nested comment ?!? */
> */
> alert( 'World' ); // Error
> \`\`\`

**Note on Production:**
Don't hesitate to comment your code. While they add bytes to the file size, modern build tools (minifiers) remove all comments before publishing the code to production, so there is no performance penalty.
`
},
{
  id: "js-7",
  title: "Modern Mode: \"use strict\"",
  content: `
# The Modern Mode: "use strict"

For a long time, JavaScript evolved without breaking compatibility. New features were added, but old functionality remained unchanged. While this prevented legacy code from breaking, it meant that mistakes or poor design decisions in the language's early days were stuck forever.

This changed in 2009 with **ECMAScript 5 (ES5)**. It introduced new features and cleaned up the language. To maintain compatibility with old code, these modifications are *off by default*.

You must explicitly enable them using the directive: \`"use strict"\`.

## Enabling Strict Mode

The directive looks like a string: \`"use strict"\` or \`'use strict'\`.

When placed at the **top** of a script, the entire script executes in the "modern" way.

\`\`\`javascript
"use strict";

// This code works the modern way
const x = 5;
\`\`\`

You can also place it at the beginning of a specific function to enable strict mode only for that function, though global usage is more common.

> **Critical Rule: Top-Level Placement**
> Ensure that \`"use strict"\` is the very first statement in your script. If there is code (other than comments) before it, the directive is ignored.
>
> \`\`\`javascript
> // ❌ Strict mode is NOT enabled here
> alert("some code");
> "use strict";
> \`\`\`

> **No Cancellation**
> There is no \`"no use strict"\` directive. Once the engine enters strict mode, it cannot go back to the "old" mode for that scope.

## Strict Mode in the Browser Console

By default, the developer console in browsers does **not** use strict mode.

To test strict mode behavior in the console:

1.  **Multi-line Input**: Press \`Shift+Enter\` to create a new line.
2.  **Add Directive**: Type \`'use strict';\` at the top.
3.  **Run**:
    \`\`\`javascript
    'use strict';
    // ... your code
    \`\`\`

If that fails (in older browsers), use an IIFE (Immediately Invoked Function Expression) wrapper:

\`\`\`javascript
(function() {
  'use strict';
  // ... your code ...
})()
\`\`\`

## Do We Always Need It?

You might think you should add \`"use strict"\` to every file forever. However, modern JavaScript architecture handles this for you.

**Modules and Classes enable strict mode automatically.**

If you are using modern build tools (Vite, Webpack), TypeScript, or native ES Modules (\`<script type="module">\`), strict mode is already enabled by default. You do not need to add the string manually.

**Summary:**
* For legacy scripts or simple HTML prototypes: **Add \`"use strict";\`**.
* For modern application development (Modules/Classes): **It's automatic.**
`
},
{
  id: "js-8",
  title: "Variables & Storage",
  content: `
# Variables: Storing Data

Most applications need to work with information—goods in a shop, messages in a chat, or user profiles. **Variables** are the named storage units for this data.

## 1. Declaring Variables

To create a variable in modern JavaScript, we use the \`let\` keyword.

\`\`\`javascript
let message; // Declaration
message = 'Hello'; // Assignment
\`\`\`

We can combine these steps into a single line, which is the standard practice:

\`\`\`javascript
let message = 'Hello!';
alert(message); // Output: Hello!
\`\`\`

### Multiple Variables
You can declare multiple variables in one line, but for **readability**, it is strongly recommended to declare each on its own line.

\`\`\`javascript
// ❌ Avoid (Hard to read)
let user = 'John', age = 25, message = 'Hello';

// ✅ Preferred (Clean)
let user = 'John';
let age = 25;
let message = 'Hello';
\`\`\`

## 2. A Real-Life Analogy

Imagine a variable as a **box** for data with a unique sticker name on it.



You can put any value in the box, and you can change it as many times as you want. When you change the value, the old data is removed and replaced.

\`\`\`javascript
let message;
message = 'Hello!';
message = 'World!'; // Old value 'Hello!' is discarded
\`\`\`

> **Critical Rule: Declaration**
> A variable should be declared **only once** in a scope. Repeating \`let\` triggers an error.
> \`\`\`javascript
> let message = "This";
> let message = "That"; // ❌ SyntaxError: 'message' has already been declared
> \`\`\`

## 3. Constants (\`const\`)

To declare a variable that cannot be reassigned, use \`const\`.

\`\`\`javascript
const myBirthday = '18.04.1982';
myBirthday = '01.01.2001'; // ❌ TypeError: Assignment to constant variable.
\`\`\`

### Uppercase Constants
There is a widespread practice to use uppercase names for **hard-coded** values known prior to execution.

\`\`\`javascript
const COLOR_RED = "#F00";
const COLOR_GREEN = "#0F0";

let color = COLOR_RED;
\`\`\`

* **Capital-named constants**: Used for values known *before* execution (aliases).
* **CamelCase constants**: Used for values calculated at *runtime* that won't change (e.g., \`const pageLoadTime = ...\`).

## 4. Legacy: \`var\`

In older scripts, you will see \`var\` instead of \`let\`.

\`\`\`javascript
var message = 'Hello';
\`\`\`

**Production Rule**: Do not use \`var\`.
It has subtle scoping differences (hoisting, no block scope) that lead to bugs. Modern development uses \`let\` and \`const\` exclusively.

## 5. Variable Naming Rules

JavaScript has strict rules and conventions for naming variables.

**The Rules:**
1.  Must contain only letters, digits, \`$\`, or \`_\`.
2.  Must **not** start with a digit.
3.  **Reserved words** (like \`let\`, \`class\`, \`return\`) cannot be used.

**The Conventions:**
* **CamelCase**: \`userName\`, \`shoppingCart\`.
* **Descriptive**: \`currentUser\` is better than \`u\`. \`shoppingCart\` is better than \`data\`.

> **Best Practice: Naming**
> Variable naming is a skill. A variable name should clearly describe the data it stores.
> * ❌ \`let a = 10;\`
> * ✅ \`let maxRetries = 10;\`
`
},
{
  id: "js-9",
  title: "Data Types",
  content: `
# Data Types

Every value in JavaScript belongs to a specific type. JavaScript is a **dynamically typed** language, which means a variable is not bound to a specific data type; it can hold a string now and a number later.

\`\`\`javascript
let message = "hello"; // String
message = 123456;      // Number (No error)
\`\`\`

There are **8 basic data types** in JavaScript.

## 1. Number

The \`number\` type represents both integers and floating-point numbers.

\`\`\`javascript
let n = 123;
n = 12.345;
\`\`\`

### Special Numeric Values
* **Infinity**: Represents the mathematical infinity (∞). Example: \`1 / 0\`.
* **NaN** (Not a Number): Represents a computational error. It is "sticky"—any operation with \`NaN\` results in \`NaN\`.

\`\`\`javascript
alert( "not a number" / 2 ); // NaN
alert( NaN + 1 ); // NaN
\`\`\`

## 2. BigInt

For integers larger than the safe limit \`±(2^53-1)\` (approx. 9 quadrillion), regular numbers lose precision. \`BigInt\` was added to handle integers of arbitrary length.

A \`BigInt\` is created by appending \`n\` to the end of an integer.

\`\`\`javascript
const bigInt = 1234567890123456789012345678901234567890n;
\`\`\`

## 3. String

A string must be surrounded by quotes. JavaScript supports three types:

1.  **Double quotes**: \`"Hello"\`
2.  **Single quotes**: \`'Hello'\`
3.  **Backticks**: \`\` \`Hello\` \`\`

Double and single quotes are functionally identical. **Backticks** are special—they allow "template literals" to embed variables and expressions.

\`\`\`javascript
let name = "John";

// Embed variable
alert( \`Hello, \${name}!\` ); // Hello, John!

// Embed expression
alert( \`The result is \${1 + 2}\` ); // The result is 3
\`\`\`

## 4. Boolean

Represents logical values: \`true\` and \`false\`.

\`\`\`javascript
let isGreater = 4 > 1; // true
let checked = false;
\`\`\`

## 5. The \`null\` Value

\`null\` is a special type that contains only the value \`null\`.
In JavaScript, it does **not** mean a "null pointer" like in C++. It represents "nothing", "empty", or "value unknown".

\`\`\`javascript
let age = null; // Age is currently unknown
\`\`\`

## 6. The \`undefined\` Value

\`undefined\` is another special type containing only \`undefined\`.
It means "value is not assigned". If a variable is declared but not initialized, its value is \`undefined\`.

\`\`\`javascript
let age;
alert(age); // undefined
\`\`\`

> **Best Practice**:
> Use \`null\` to explicitly assign an "empty" value.
> Leave \`undefined\` for the engine to indicate an unassigned state.

## 7. Objects and Symbols

* **Object**: The only non-primitive type. Used to store collections of data and complex entities.
* **Symbol**: Used to create unique identifiers for object properties.

## 8. The \`typeof\` Operator

The \`typeof\` operator returns the type of the operand as a string.

\`\`\`javascript
typeof undefined // "undefined"
typeof 0         // "number"
typeof 10n       // "bigint"
typeof true      // "boolean"
typeof "foo"     // "string"
typeof Symbol("id") // "symbol"
typeof Math      // "object"
typeof null      // "object" (Legacy Error)
typeof alert     // "function" (Legacy Behavior)
\`\`\`

> **Legacy Quirks:**
> 1. \`typeof null\` returns \`"object"\`. This is a known bug in JavaScript kept for backward compatibility. \`null\` is **not** an object.
> 2. \`typeof function\` returns \`"function"\`. Technically functions are objects, but \`typeof\` treats them uniquely, which is often convenient.



## Summary

JavaScript has 8 types:
1.  **Number** (Floats & Integers)
2.  **BigInt** (Arbitrary precision integers)
3.  **String** (Text)
4.  **Boolean** (Logical)
5.  **Null** (Empty/Unknown)
6.  **Undefined** (Unassigned)
7.  **Symbol** (Unique IDs)
8.  **Object** (Complex data structures)
`
},
{
  id: "js-10",
  title: "Browser Interaction",
  content: `
# Browser Interaction

JavaScript provides three built-in functions to interact with the user via the browser interface: \`alert\`, \`prompt\`, and \`confirm\`.

These methods create **Modal Windows**. A modal window halts the internal execution of the script and prevents the user from interacting with the rest of the page until the window is dismissed.



## 1. Alert

The simplest form of interaction. It displays a message and waits for the user to press "OK".

\`\`\`javascript
alert("Hello");
\`\`\`

## 2. Prompt

The \`prompt\` function accepts two arguments and asks the user for textual input.

\`\`\`javascript
const result = prompt(title, [default]);
\`\`\`

* **title**: The text to show the visitor.
* **default** (optional): The initial value for the input field.

**Return Behavior:**
* **String**: If the user types text and clicks OK.
* **null**: If the user clicks Cancel or presses \`Esc\`.

\`\`\`javascript
let age = prompt('How old are you?', '18');

alert(\`You are \${age} years old!\`);
\`\`\`

> **Best Practice: Default Value**
> In older browsers (IE), omitting the second argument could result in the text "undefined" appearing in the input. To be safe, always supply an empty string \`''\` if no default is needed.
> \`\`\`javascript
> prompt("Test", ''); // Safe cross-browser
> \`\`\`

## 3. Confirm

The \`confirm\` function shows a modal with a question and two buttons: **OK** and **Cancel**.

\`\`\`javascript
const isBoss = confirm("Are you the boss?");

alert(isBoss); // true if OK is pressed, false otherwise
\`\`\`

## 4. Engineering Limitations

While useful for debugging or simple internal tools, these methods are rarely used in modern production applications (like React/Vue apps) for specific reasons:

1.  **Blocking Nature**: They pause the entire script execution. This can freeze animations or background processes.
2.  **Unstyleable**: You cannot change their color, font, or position. They look different on every OS/Browser.
3.  **UX Friction**: They disrupt the user flow aggressively.

**Modern Alternative**:
Professional applications use **Non-blocking Modals** (HTML/CSS overlays) or libraries like \`Radix UI Dialog\` or \`SweetAlert\`, which allow full styling and do not freeze the JavaScript thread.

## Summary

| Method | Description | Returns |
| :--- | :--- | :--- |
| \`alert\` | Shows a message. | \`undefined\` |
| \`prompt\` | Asks for text input. | String or \`null\` |
| \`confirm\` | Asks a Yes/No question. | \`true\` or \`false\` |
`
},
{
  id: "js-11",
  title: "Type Conversions",
  content: `
# Type Conversions

In JavaScript, operators and functions often convert values to the required type automatically. This is called **Implicit Conversion** (or Type Coercion). However, we often need to manually convert values, known as **Explicit Conversion**.

## 1. String Conversion

Happens when we need the text form of a value (e.g., \`alert()\`).
To convert manually, use the \`String()\` function.

\`\`\`javascript
let value = true;
value = String(value); // "true"
\`\`\`

The conversion is intuitive:
* \`false\` -> \`"false"\`
* \`null\` -> \`"null"\`
* \`undefined\` -> \`"undefined"\`

## 2. Numeric Conversion

Happens in mathematical functions and expressions.

\`\`\`javascript
alert("6" / "2"); // 3 (Strings converted to numbers)
\`\`\`

To convert manually, use the \`Number()\` function.

\`\`\`javascript
let num = Number("123"); // 123
\`\`\`

### Conversion Rules Table

| Value | Becomes... |
| :--- | :--- |
| \`undefined\` | \`NaN\` |
| \`null\` | \`0\` |
| \`true\` | \`1\` |
| \`false\` | \`0\` |
| \`string\` | Trims whitespace. Empty string -> \`0\`. Invalid chars -> \`NaN\`. |

> **Critical Distinction**:
> * \`Number(null)\` is \`0\`.
> * \`Number(undefined)\` is \`NaN\`.

## 3. Boolean Conversion

Happens in logical operations (if statements) or manually via \`Boolean()\`.

**The Rule of "Falsy" Values:**
The following values become \`false\`. **Everything else** becomes \`true\`.

1.  \`0\`
2.  \`""\` (Empty string)
3.  \`null\`
4.  \`undefined\`
5.  \`NaN\`

\`\`\`javascript
alert(Boolean("hello")); // true
alert(Boolean(""));      // false
\`\`\`

> **The PHP Trap**
> In JavaScript, the string \`"0"\` is **true** because it is a non-empty string.
> \`\`\`javascript
> Boolean("0"); // true
> Boolean(" "); // true (space is a character)
> \`\`\`



## Summary

| Type | Function | Key Exception to Remember |
| :--- | :--- | :--- |
| **String** | \`String(val)\` | Everything is intuitive. |
| **Number** | \`Number(val)\` | \`undefined\` -> \`NaN\`, but \`null\` -> \`0\`. |
| **Boolean** | \`Boolean(val)\` | \`"0"\` is \`true\`. Only empty string \`""\` is \`false\`. |
`
},
{
  id: "js-12",
  title: "Basic Operators & Maths",
  content: `
# Basic Operators & Maths

In JavaScript, operators go beyond school arithmetic. Understanding how the engine handles data types during operations is critical for preventing logic bugs.

## 1. Terminology

* **Operand**: The value the operator applies to (e.g., in \`5 * 2\`, 5 and 2 are operands).
* **Unary**: Applies to **one** operand (e.g., \`-x\` reverses the sign).
* **Binary**: Applies to **two** operands (e.g., \`y - x\`).

## 2. Arithmetic Operators

Standard math operations are supported:
* Addition \`+\`
* Subtraction \`-\`
* Multiplication \`*\`
* Division \`/\`
* **Remainder \`%\`**: Not a percent. It is the remainder of integer division.
* **Exponentiation \`**\`**: Raises power. \`2 ** 3\` is 8.

\`\`\`javascript
alert( 5 % 2 ); // 1
alert( 2 ** 4 ); // 16
\`\`\`

## 3. String Concatenation (Binary +)

The binary \`+\` is special. If **any** operand is a string, it converts the other to a string and concatenates (merges) them.

\`\`\`javascript
alert( '1' + 2 ); // "12"
alert( 2 + '1' ); // "21"
\`\`\`



**Left-to-Right Evaluation Rule:**
Operations execute sequentially.

\`\`\`javascript
// 1. (2 + 2) = 4 (Math)
// 2. 4 + '1' = "41" (Concat)
alert( 2 + 2 + '1' ); // "41"

// 1. ('1' + 2) = "12" (Concat)
// 2. "12" + 2 = "122" (Concat)
alert( '1' + 2 + 2 ); // "122"
\`\`\`

> **Note**: Other operators (\`-\`, \`/\`, \`*\`) always convert strings to numbers.
> \`alert( '6' / '2' ); // 3\`

## 4. Numeric Conversion (Unary +)

The unary plus (\`+\`) applied to a single value converts it to a number. It is a shorthand for \`Number()\`.

\`\`\`javascript
alert( +true );  // 1
alert( +"" );    // 0
alert( +"123" ); // 123
\`\`\`

It allows concise summation of string inputs:
\`\`\`javascript
let apples = "2";
let oranges = "3";

alert( +apples + +oranges ); // 5 (Math)
\`\`\`

## 5. Assignment & In-Place Modification

Assignment \`=\` is an operator that **returns a value**.

\`\`\`javascript
let a = 1;
let b = 2;
let c = 3 - (a = b + 1); // a becomes 3, returns 3. c = 3 - 3 = 0.
\`\`\`

**Modify-in-place:**
Shorthand operators exist for common math.

\`\`\`javascript
let n = 2;
n += 5; // n = 7 (n = n + 5)
n *= 2; // n = 14 (n = n * 2)
\`\`\`

## 6. Increment / Decrement

Used to increase/decrease a variable by 1.
* **Prefix (\`++value\`)**: Returns the **new** value.
* **Postfix (\`value++\`)**: Returns the **old** value (before increment).

\`\`\`javascript
let counter = 1;
let a = ++counter; // a is 2

let counter2 = 1;
let b = counter2++; // b is 1 (counter2 becomes 2 AFTER this line)
\`\`\`

## 7. The Comma Operator

One of the rarest operators. It evaluates multiple expressions but **only returns the result of the last one**.

\`\`\`javascript
// (1+2) runs, result ignored. (3+4) runs, result returned.
let a = (1 + 2, 3 + 4); 
alert(a); // 7
\`\`\`

> **Engineering Tip:**
> Avoid the comma operator in standard logic. It is mostly found in complex framework internals or minified code.

## Summary of Priorities (Precedence)

1.  Parentheses \`()\`: Override everything.
2.  Unary Operators (\`++\`, \`--\`, \`!\`, unary \`+\`)
3.  Exponentiation \`**\`
4.  Multiplication/Division \`*\`, \`/\`
5.  Addition/Subtraction \`+\`, \`-\`
6.  Assignment \`=\`
7.  Comma \`,\`
`
},
{
  id: "js-13",
  title: "Comparisons",
  content: `
# Comparisons

Comparison operators in JavaScript return a **Boolean** value (\`true\` or \`false\`).

## 1. Basic Operators

* **Greater/Less**: \`a > b\`, \`a < b\`
* **Greater/Less or Equal**: \`a >= b\`, \`a <= b\`
* **Equals**: \`a == b\` (Loose equality)
* **Not Equals**: \`a != b\`

\`\`\`javascript
alert( 2 > 1 );  // true
alert( 2 == 1 ); // false
\`\`\`

## 2. String Comparison

Strings are compared letter-by-letter in "dictionary" (lexicographical) order.

\`\`\`javascript
alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true ('o' is greater than 'e')
\`\`\`

> **Note**: Case matters. Lowercase letters are "greater" than uppercase in Unicode. \`'a' > 'A'\` is true.

## 3. Comparison of Different Types

When types differ, JavaScript converts values to **Numbers**.

\`\`\`javascript
alert( '2' > 1 ); // true (String '2' becomes number 2)
alert( '01' == 1 ); // true
alert( true == 1 ); // true
alert( false == 0 ); // true
\`\`\`

## 4. Strict Equality (\`===\`)

The regular equality operator \`==\` has a flaw: it cannot distinguish \`0\` from \`false\`.

\`\`\`javascript
alert( 0 == false ); // true (Both become 0)
\`\`\`

**The Fix: Strict Equality (\`===\`)**
Checks equality **without** type conversion. If types differ, it returns \`false\`.

\`\`\`javascript
alert( 0 === false ); // false (Number vs Boolean)
\`\`\`



## 5. Null and Undefined Quirks

This is a famous JavaScript interview topic.

1.  **Strict Check**: \`null === undefined\` is **false**.
2.  **Loose Check**: \`null == undefined\` is **true**. They are a "couple" and equal no other value.

### The Trap: Null vs 0
\`\`\`javascript
alert( null > 0 );  // false
alert( null == 0 ); // false
alert( null >= 0 ); // true
\`\`\`

**Why?**
* **Equality (\`==\`)**: \`null\` only equals \`undefined\`. It does **not** convert to a number.
* **Comparisons (\`>\`, \`<\`)**: \`null\` converts to \`0\`. So \`null >= 0\` (0 >= 0) is true.

## Summary

* Always use **Strict Equality** (\`===\`) to avoid type conversion bugs.
* Strings compare alphabetically (lexicographically).
* \`null\` and \`undefined\` equal each other loosely (\`==\`), but nothing else.
* Be careful comparing \`null\` or \`undefined\` with numbers (operators like \`>\` or \`<\` convert them, but \`==\` does not).
`
},
{
  id: "js-14",
  title: "Conditional Branching",
  content: `
# Conditional Branching

Conditional statements allow your code to perform different actions based on different inputs or states. This is the core of **Control Flow**.

## 1. The \`if\` Statement

The \`if(...)\` statement evaluates a condition. If the result converts to \`true\`, the block of code executes.



[Image of if else statement flowchart]


\`\`\`javascript
const year = 2015;

if (year === 2015) {
  alert("Correct!");
}
\`\`\`

**Boolean Conversion:**
The condition is automatically converted to a boolean. Recall the **Falsy** values: \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Everything else is **Truthy**.

> **Best Practice: Curly Braces**
> Always wrap your code block in curly braces \`{}\`, even if it is a single line. This improves readability and prevents errors during refactoring.
>
> \`\`\`javascript
> // ❌ Avoid
> if (year === 2015) alert("Yes");
>
> // ✅ Preferred
> if (year === 2015) {
>   alert("Yes");
> }
> \`\`\`

## 2. The \`else\` and \`else if\` Clauses

* **\`else\`**: Executes if the condition is falsy.
* **\`else if\`**: Tests a new condition if the previous one was falsy.

\`\`\`javascript
const year = 2024;

if (year < 2015) {
  alert('Too early...');
} else if (year > 2015) {
  alert('Too late');
} else {
  alert('Exactly!');
}
\`\`\`

## 3. The Ternary Operator (\`?\`)

The "Conditional Operator" (or Ternary) is the only JavaScript operator that takes three operands. It is primarily used for **conditional assignment**, not for controlling flow logic.



**Syntax:**
\`let result = condition ? valueIfTrue : valueIfFalse;\`

\`\`\`javascript
let age = 18;

// Clean assignment
let accessAllowed = (age > 18) ? true : false;
\`\`\`

### Chaining Ternaries
You can chain them to mimic \`else if\`, though this can hurt readability if overused.

\`\`\`javascript
let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';
\`\`\`

## 4. Engineering Anti-Pattern: Ternary for Execution

A common mistake is using the ternary operator as a replacement for \`if\` statements to "save lines" when not assigning a value.

\`\`\`javascript
// ❌ Bad Practice: Hard to scan vertically
(company == 'Netscape') ? alert('Right!') : alert('Wrong.');

// ✅ Good Practice: Clear intent
if (company == 'Netscape') {
  alert('Right!');
} else {
  alert('Wrong.');
}
\`\`\`

> **The Rule of Thumb:**
> * Use **Ternary (\`?\`)** when you need to **return a value** (assignment).
> * Use **If/Else** when you need to **execute a code block** (branching logic).
`
},
{
  id: "js-15",
  title: "Logical Operators",
  content: `
# Logical Operators

JavaScript supports three primary logical operators: \`||\` (OR), \`&&\` (AND), and \`!\` (NOT).

While traditional programming treats these strictly as Boolean manipulators, JavaScript treats them as **Value Selectors**. They can process values of any type and return values of any type.



[Image of logical operators truth table]


## 1. OR (\`||\`) - The Selector

The "OR" operator finds the **first truthy value**.

**The Algorithm:**
1.  Evaluate operands from left to right.
2.  Convert each to a boolean.
3.  If \`true\`, stop and **return the original value** of that operand.
4.  If all are \`false\`, return the **last** operand.



\`\`\`javascript
const result = value1 || value2 || value3;
\`\`\`

### Common Use Case: Default Values
This behavior is frequently used to assign default values to variables.

\`\`\`javascript
const input = ""; // Falsy
const user = input || "Anonymous"; // Selects "Anonymous"

const port = process.env.PORT || 3000;
\`\`\`

> **Short-Circuit Evaluation**
> If the first operand is truthy, the second operand is **never evaluated**.
> \`\`\`javascript
> true || alert("This will NOT run");
> false || alert("This WILL run");
> \`\`\`

## 2. AND (\`&&\`) - The Guard

The "AND" operator finds the **first falsy value**.

**The Algorithm:**
1.  Evaluate operands from left to right.
2.  Convert each to a boolean.
3.  If \`false\`, stop and **return the original value** of that operand.
4.  If all are \`true\`, return the **last** operand.



\`\`\`javascript
// Returns the first falsy value (null), ignores the rest
const result = 1 && null && 2; // null
\`\`\`

### Common Use Case: Guard Clauses
The \`&&\` operator is often used to execute code only if a condition is met.

\`\`\`javascript
const isLoggedIn = true;
const user = { name: "John" };

// Only runs if isLoggedIn is truthy
isLoggedIn && alert(\`Welcome, \${user.name}\`);
\`\`\`

> **Engineering Note: Don't abuse &&**
> While \`condition && action()\` is shorter than an \`if\` statement, it makes code harder to read. Use it for rendering (like in React JSX) but prefer explicit \`if\` statements for complex business logic.

## 3. NOT (\`!\`) - The Inverter

The NOT operator accepts a single argument. It converts the value to a boolean and returns the **inverse**.

\`\`\`javascript
alert( !true ); // false
alert( !0 );    // true (0 is falsy, inverse is true)
\`\`\`

### The Double Bang (\`!!\`)
A common pattern to explicitly convert a value to a \`boolean\`.

\`\`\`javascript
const value = "Hello";
const hasValue = !!value; // true
\`\`\`

## 4. Precedence

The order of execution is critical when mixing operators.
**Order:** \`!\` (Highest) > \`&&\` > \`||\` (Lowest).

\`\`\`javascript
// && runs before ||
// Equivalent to: (a && b) || (c && d)
if (a && b || c && d) { ... }
\`\`\`

## Summary

| Operator | Logic | Returns |
| :--- | :--- | :--- |
| **\`||\` (OR)** | Finds first **Truthy** | The value itself (or last value) |
| **\`&&\` (AND)** | Finds first **Falsy** | The value itself (or last value) |
| **\`!\` (NOT)** | Inverts Boolean | Boolean (\`true\`/\`false\`) |
`
},
{
  id: "js-16",
  title: "Nullish Coalescing Operator '??'",
  content: `
# Nullish Coalescing Operator '??'

The **nullish coalescing operator** (\`??\`) is a modern JavaScript feature that provides a safe way to handle default values.

It treats \`null\` and \`undefined\` as "undefined" values, while everything else (including \`0\` and \`false\`) is considered "defined".

**The Logic:**
\`result = a ?? b\`

* If \`a\` is **defined** (not null/undefined), return \`a\`.
* If \`a\` is **null** or **undefined**, return \`b\`.

\`\`\`javascript
const user = null;
alert(user ?? "Anonymous"); // "Anonymous"

const user2 = "John";
alert(user2 ?? "Anonymous"); // "John"
\`\`\`

## 1. The Critical Difference: \`??\` vs \`||\`

This is the most common interview question regarding this operator.

* **OR (\`||\`)**: Returns the first **Truthy** value.
* **Nullish (\`??\`)**: Returns the first **Defined** value.

**The "Zero" Problem:**
Imagine \`height = 0\`. In many apps, 0 is a valid number, not "empty".

\`\`\`javascript
let height = 0;

// ❌ OR operator treats 0 as false
alert(height || 100); // 100 (Wrong! We wanted 0)

// ✅ Nullish operator treats 0 as defined
alert(height ?? 100); // 0 (Correct)
\`\`\`



## 2. Precedence

The precedence of \`??\` is low (similar to \`||\`). It executes **after** math operations like \`*\` or \`+\`.

**Warning:** Always use parentheses when mixing with math.

\`\`\`javascript
let height = null;
let width = null;

// ❌ Wrong: 100 * width runs first
// let area = height ?? 100 * width ?? 50;

// ✅ Correct
let area = (height ?? 100) * (width ?? 50); // 5000
\`\`\`

## 3. Safety Restriction

JavaScript forbids mixing \`??\` directly with \`||\` or \`&&\` without parentheses. This prevents ambiguous logic errors.

\`\`\`javascript
// ❌ Syntax Error
let x = 1 && 2 ?? 3;

// ✅ Correct
let x = (1 && 2) ?? 3;
\`\`\`

## Summary

* Use \`??\` when you want to assign a default value **only** for \`null\` or \`undefined\`.
* Use \`||\` when you want to handle all falsy values (like \`0\` or \`""\`).
* Always use parentheses when mixing \`??\` with other logical or mathematical operators.
`
},
{
  id: "js-17",
  title: "Loops: while and for",
  content: `
# Loops: Repeating Logic

Loops are used to repeat a block of code multiple times.

## 1. The \`while\` Loop

The simplest loop. It runs **while** the condition is truthy.



[Image of while loop flowchart]


\`\`\`javascript
let i = 0;
while (i < 3) {
  alert(i);
  i++;
}
\`\`\`

**Infinite Loops**: If you forget to update the condition (like \`i++\`), the loop will run forever and freeze the browser.

## 2. The \`do..while\` Loop

The condition is checked **after** the body executes.
**Guarantee**: The loop body always runs **at least once**.

\`\`\`javascript
let i = 0;
do {
  alert(i);
  i++;
} while (i < 3);
\`\`\`

## 3. The \`for\` Loop

The most commonly used loop for standard iteration.

**Syntax:**
\`for (begin; condition; step) { body }\`

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  alert(i);
}
\`\`\`

### Execution Flow
1.  **Begin**: \`let i = 0\` (Runs once)
2.  **Condition**: \`i < 3\` (Checked before every iteration)
3.  **Body**: \`alert(i)\` (Runs if condition is true)
4.  **Step**: \`i++\` (Runs after body)



## 4. Controlling Loops

### \`break\`
Stops the loop immediately.

\`\`\`javascript
while (true) {
  let value = +prompt("Enter number", '');
  if (!value) break; // Exits loop if input is empty
}
\`\`\`

### \`continue\`
Stops the **current iteration** and jumps to the next one (skips the rest of the body).

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  // If even, skip alert
  if (i % 2 == 0) continue;
  alert(i); // Shows 1, 3, 5...
}
\`\`\`

## 5. Labels (Breaking Nested Loops)

To break out of **multiple** nested loops at once, you need a **Label**.

\`\`\`javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    let input = prompt(\`Coords (\${i},\${j})\`, '');

    // Breaks BOTH loops
    if (!input) break outer;
  }
}
alert('Done!');
\`\`\`

## Summary

* **\`while\`**: Check -> Run.
* **\`do..while\`**: Run -> Check (Runs at least once).
* **\`for\`**: Complex configuration (Begin -> Condition -> Body -> Step).
* **\`break\`**: Exits the loop.
* **\`continue\`**: Skips current iteration.
* **Labels**: Allow breaking out of nested loops.
`
},
{
  id: "js-18",
  title: "The Switch Statement",
  content: `
# The Switch Statement

A \`switch\` statement is an alternative to multiple \`if...else if\` checks. It provides a clearer, more descriptive syntax when comparing a single value against multiple potential variants.

## 1. Syntax & Logic

The \`switch\` evaluates an expression and tries to match its value against one or more \`case\` clauses.



\`\`\`javascript
switch(x) {
  case 'value1':  // if (x === 'value1')
    // code...
    break;

  case 'value2':  // if (x === 'value2')
    // code...
    break;

  default:
    // code...
}
\`\`\`

**Key Behaviors:**
1.  **Strict Equality**: The comparison uses \`===\`. A string \`"3"\` will *not* match a number \`3\`.
2.  **Fallthrough**: Without a \`break\` statement, execution continues into the next case *regardless* of whether that case matches.
3.  **Default**: Executes if no cases match (similar to \`else\`).

## 2. The Importance of \`break\`

If you omit \`break\`, the script ignores checks and executes subsequent cases until it hits a break or the end of the block.

\`\`\`javascript
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
  case 4:
    alert( 'Exactly!' ); // Matches, starts here
  case 5:
    alert( 'Too big' ); // Runs because previous case had no break
  default:
    alert( "I don't know" ); // Runs as well
}
\`\`\`

> **Engineering Tip:**
> While "fallthrough" is sometimes a feature (see Grouping), unintentional fallthrough is a common source of bugs. Always verify your \`break\` statements.

## 3. Grouping Cases

You can utilize fallthrough to group cases that share the same logic.

\`\`\`javascript
let day = "Saturday";

switch (day) {
  case "Saturday":
  case "Sunday":
    alert("It's the weekend!");
    break;
  case "Monday":
    alert("Work day.");
    break;
}
\`\`\`

## 4. Expressions in Cases

Both the switch statement and the case values can be dynamic expressions, not just constants.

\`\`\`javascript
let a = "1";
let b = 0;

switch (+a) {
  case b + 1:
    alert("Math works!"); // This runs because 1 === 0 + 1
    break;
}
\`\`\`

## 5. Type Strictness Trap

Because \`switch\` uses \`===\`, types must match exactly.

\`\`\`javascript
let arg = prompt("Enter 3"); // Returns string "3"

switch (arg) {
  case 3:
    alert( 'Never executes!' ); // Number 3 !== String "3"
    break;
  case '3':
    alert( 'Executes!' );
    break;
}
\`\`\`

## Summary

* Use \`switch\` for checking a single value against many constants.
* Always remember \`break\` unless you explicitly want fallthrough.
* Comparisons are strict (\`===\`); type matters.
`
},
{
  id: "js-19",
  title: "Functions",
  content: `
# Functions

Functions are the main building blocks of the program, allowing code reuse.



## 1. Function Declaration

The standard way to define a function:

\`\`\`javascript
function showMessage() {
  alert('Hello everyone!');
}

showMessage(); // Calling the function
\`\`\`

## 2. Variables Scope

* **Local Variables**: Declared *inside* the function. Only visible inside.
* **Outer Variables**: Declared *outside* the function. The function can access and modify them.

**Shadowing:**
If a variable inside the function has the same name as an outer one, the local one "shadows" (hides) the outer one.

\`\`\`javascript
let userName = 'John';

function showMessage() {
  let userName = "Bob"; // Local variable
  alert(userName); // Bob
}

showMessage();
alert(userName); // John (Outer remains unchanged)
\`\`\`

## 3. Parameters & Arguments

* **Parameter**: The variable listed in the declaration (\`function sum(a, b)\`).
* **Argument**: The actual value passed when called (\`sum(1, 2)\`).

**Pass by Value:**
Primitive parameters (strings, numbers) are passed as copies. Changing them inside the function does *not* affect the original variable.

## 4. Default Parameters

If an argument is missing, it becomes \`undefined\`. We can set defaults:

\`\`\`javascript
function showMessage(from, text = "no text given") {
  alert(from + ": " + text);
}

showMessage("Ann"); // Ann: no text given
\`\`\`

## 5. Returning Values

The \`return\` directive stops execution and returns a value to the caller.

\`\`\`javascript
function sum(a, b) {
  return a + b;
}

let result = sum(1, 2); // 3
\`\`\`

> **Rule:** If a function does not return a value, it returns \`undefined\`.

## 6. Naming Conventions

Functions are actions, so names should be verbs.

* \`get...\` – Return a value
* \`calc...\` – Calculate something
* \`create...\` – Create something
* \`check...\` – Return boolean

\`\`\`javascript
// ✅ Good: Self-describing
function checkPermission(user) { ... }

// ❌ Bad: Ambiguous
function user(u) { ... }
\`\`\`

## Summary

* Functions structure code and prevent duplication.
* Variables inside are local; variables outside are global/outer.
* Parameters copy primitive values.
* Always use \`return\` to output data.
* Use descriptive, verb-based names (e.g., \`getUser\`).
`
},
{
  id: "js-20",
  title: "Function Expressions",
  content: `
# Function Expressions

In JavaScript, a function is not a magical structure; it is a special kind of **value**.

## 1. Syntax

We have two main ways to create functions:

**Function Declaration:**
\`\`\`javascript
function sayHi() {
  alert( "Hello" );
}
\`\`\`

**Function Expression:**
Here, we create a function and assign it to a variable, just like any other value.
\`\`\`javascript
let sayHi = function() {
  alert( "Hello" );
};
\`\`\`

> **Note**: A semicolon \`;\` is used at the end of a Function Expression because it is an assignment statement (\`let x = ...;\`).

## 2. Functions are Values

Because functions are values, we can:
1.  **Print them**: \`alert(sayHi)\` shows the source code.
2.  **Copy them**:

\`\`\`javascript
let func = sayHi; // Copies the reference
func(); // Works!
sayHi(); // Still works!
\`\`\`



## 3. Callback Functions

A **Callback** is a function passed as an argument to another function, to be "called back" later.

\`\`\`javascript
function ask(question, yes, no) {
  if (confirm(question)) yes();
  else no();
}

// Usage with Anonymous Function Expressions
ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled."); }
);
\`\`\`

## 4. Declaration vs. Expression (The Interview Question)

| Feature | Function Declaration | Function Expression |
| :--- | :--- | :--- |
| **Syntax** | \`function sum() {}\` | \`let sum = function() {}\` |
| **Creation Time** | Created **before** code execution (Hoisted). | Created when execution reaches the line. |
| **Visibility** | Can be called **before** definition. | Must be defined before calling. |
| **Block Scope** | Visible only inside the block \`{...}\`. | Depends on the variable (\`let\`/\`var\`). |

### The Hoisting Difference

**Declaration (Works):**
\`\`\`javascript
sayHi("John"); // Works!

function sayHi(name) {
  alert(name);
}
\`\`\`

**Expression (Fails):**
\`\`\`javascript
sayHi("John"); // Error!

let sayHi = function(name) {
  alert(name);
};
\`\`\`

### The Block Scope Trap
In strict mode, a Function Declaration inside an \`if\` block is not visible outside that block. To conditionally define a function usable outside, use a Function Expression.

\`\`\`javascript
let welcome;

if (age < 18) {
  welcome = function() { alert("Hello!"); };
} else {
  welcome = function() { alert("Greetings!"); };
}

welcome(); // Works!
\`\`\`

## Summary

* **Function Declarations** are hoisted (can call before defining) and preferred for readability.
* **Function Expressions** are created when execution reaches them and are useful for conditional functions or callbacks.
* Functions are **values**; they can be stored, copied, and passed around.
`
},
{
  id: "js-21",
  title: "Arrow Functions Basics",
  content: `
# Arrow Functions

Arrow functions (introduced in ES6) provide a concise syntax for writing function expressions. They are a staple in modern JavaScript development (especially in frameworks like React).



## 1. Syntax Shorthand

The arrow function \`=>\` replaces the \`function\` keyword.

\`\`\`javascript
// Traditional Function Expression
let sum = function(a, b) {
  return a + b;
};

// Arrow Function
let sum = (a, b) => a + b;
\`\`\`

## 2. The Implicit Return

One of the most powerful features is the **Implicit Return**.
If the function body is a single expression, you can omit the curly braces \`{}\` and the \`return\` keyword. The result of the expression is returned automatically.

\`\`\`javascript
// Explicit Return (Block Body)
const double = (n) => { return n * 2; };

// Implicit Return (Concise Body)
const double = n => n * 2;
\`\`\`

## 3. Parentheses Rules

The syntax changes slightly based on the number of arguments:

| Arguments | Syntax | Note |
| :--- | :--- | :--- |
| **Zero** | \`const func = () => ...\` | Parentheses are **mandatory**. |
| **One** | \`const func = n => ...\` | Parentheses are **optional**. |
| **Two+** | \`const func = (a, b) => ...\` | Parentheses are **mandatory**. |

\`\`\`javascript
// No arguments
let sayHi = () => alert("Hello!");

// One argument (no parens needed)
let double = n => n * 2;

// Two arguments
let add = (a, b) => a + b;
\`\`\`

## 4. Multiline Arrow Functions

If you need multiple statements (variables, loops, logic), you must use curly braces \`{}\`.

**The Trap:**
Once you open curly braces, the **implicit return is lost**. You must specify \`return\` explicitly.

\`\`\`javascript
// ❌ Returns undefined (Common Bug)
const sum = (a, b) => {
  a + b;
};

// ✅ Correct
const sum = (a, b) => {
  let result = a + b;
  return result;
};
\`\`\`

## Summary

Arrow functions are the preferred syntax for simple one-liners and callbacks (like \`.map\` or \`.filter\`).

* **Syntax**: \`(args) => expression\`.
* **Concise**: Removes \`function\`, \`return\`, and \`{}\` for single expressions.
* **Block Body**: If using \`{}\`, you must write \`return\`.
`
},
{
  id: "js-22",
  title: "JavaScript Specials: A Recap",
  content: `
# JavaScript Specials: A Recap

This chapter consolidates the fundamental features of JavaScript we've covered so far, focusing on subtle behaviors and best practices.

## 1. Code Structure

Statements are delimited with a semicolon. While JavaScript has **Automatic Semicolon Insertion (ASI)**, relying on it can lead to edge-case errors.

\`\`\`javascript
// ❌ Risky (ASI failure)
alert("Error incoming")
[1, 2].forEach(alert)

// ✅ Safe (Explicit semicolons)
alert("Safe");
[1, 2].forEach(alert);
\`\`\`

## 2. Strict Mode

To enable modern JavaScript features and fix legacy quirks, always start your scripts or functions with the directive:

\`\`\`javascript
'use strict';
\`\`\`

## 3. Variables & Data Types



We declare variables using \`let\`, \`const\`, or (legacy) \`var\`. JavaScript is **dynamically typed**, meaning a variable can hold any data type.

There are **8 Data Types**:
1.  **Number**: Integers and floats.
2.  **BigInt**: Arbitrary precision integers.
3.  **String**: Text.
4.  **Boolean**: \`true\` / \`false\`.
5.  **Null**: Explicitly empty.
6.  **Undefined**: Not assigned.
7.  **Object**: Complex data structures.
8.  **Symbol**: Unique identifiers.

**The \`typeof\` Quirks:**
\`\`\`javascript
typeof null == "object" // ❌ Language Error (Historical)
typeof function(){} == "function" // ✅ Special treatment
\`\`\`

## 4. Interaction (Modals)

The browser provides three **blocking** (modal) functions:

| Function | Usage | Returns |
| :--- | :--- | :--- |
| \`alert(msg)\` | Output info | \`undefined\` |
| \`prompt(msg, default)\` | Ask for input | String or \`null\` |
| \`confirm(msg)\` | Ask Yes/No | \`true\` / \`false\` |

## 5. Operators

* **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (remainder), \`**\` (power).
    * *Note*: Binary \`+\` concatenates strings if one operand is a string.
* **Logical**: \`&&\`, \`||\`, \`!\`.
* **Nullish Coalescing (\`??\`)**: Returns the first defined value (not \`null\`/\`undefined\`).
* **Comparison**:
    * \`==\` (Loose): Converts types (e.g., \`0 == false\` is true).
    * \`===\` (Strict): No conversion (e.g., \`0 === false\` is false).

## 6. Loops & Switch

**Loops**:
We have \`while\`, \`do..while\`, and \`for\`. You can control them with \`break\` and \`continue\`.

**Switch**:
Replaces multiple \`if\` checks. Uses **strict equality** (\`===\`) for comparisons.

\`\`\`javascript
switch (age) {
  case 18: /*...*/ break;
  default: /*...*/
}
\`\`\`

## 7. Functions

We have three distinct ways to define functions:



1.  **Function Declaration**: Hoisted (usable before definition).
    \`\`\`javascript
    function sum(a, b) { return a + b; }
    \`\`\`
2.  **Function Expression**: Created when execution reaches the line.
    \`\`\`javascript
    let sum = function(a, b) { return a + b; };
    \`\`\`
3.  **Arrow Function**: Concise syntax, ideal for callbacks.
    \`\`\`javascript
    let sum = (a, b) => a + b;
    let double = n => n * 2;
    \`\`\`
`
},

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
    <ScrollArea className="flex-1    px-2 sm:px-4 py-4 sm:py-6">
      <div className="space-y-8 pb-20 h-140 no-scrollbar sm:h-120 overflow-y-auto ">
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
    <div className="flex   min-h-screen  fixed  pb-20 mt-20 w-full scroll-smooth text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80  border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
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

                    <div className="overflow-y-auto no-scrollbar h-screen pb-60 sm:pb-100">

                    {/* CUSTOM MARKDOWN RENDERER WITH ID INJECTION */}
                    <div data-color-mode={isDark ? "dark" : "light"} className="prose prose-invert  max-w-none">
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