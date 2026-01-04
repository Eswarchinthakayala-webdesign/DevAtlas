import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Terminal,
  ArrowRight,
  Code2,
  Cpu,
  Globe,
  Zap,
  Box,
  Layers,
  Smartphone,
  Server,
  Sparkles,
  Command,
  GitBranch,
  Rocket
} from "lucide-react";

// --- Utility Components ---

/**
 * 1. Spotlight Card
 * Tracks mouse movement to create a glowing gradient that follows the cursor.
 */


const SpotlightCard = ({ children, className = "", span = 1 }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-3xl border",
        "bg-white dark:bg-zinc-950",
        "border-zinc-200 dark:border-zinc-800",
        "shadow-sm dark:shadow-none",
        "transition-colors",
        span === 2 ? "md:col-span-2" : "md:col-span-1",
        className
      )}
    >
      {/* Spotlight Layer (Theme Aware) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `
            radial-gradient(
              600px circle at ${position.x}px ${position.y}px,
              rgba(0,0,0,0.08),
              transparent 45%
            )
          `,
        }}
      />

      {/* Dark mode spotlight override */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:block hidden"
        style={{
          opacity,
          background: `
            radial-gradient(
              600px circle at ${position.x}px ${position.y}px,
              rgba(255,255,255,0.12),
              transparent 45%
            )
          `,
        }}
      />

      {/* Subtle ambient edge glow */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10
          bg-gradient-to-b
          from-zinc-100/40 to-transparent
          dark:from-white/5
          opacity-70
        "
      />

      {/* Content */}
      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </motion.div>
  );
};


// --- Main Page Component ---

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const navigate=useNavigate()

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={targetRef} className="min-h-screen mt-12 px-4  sm:mt-16 text-white font-sans selection:bg-white selection:text-black">
      


      <main className="relative flex flex-col items-center overflow-hidden">
        
        {/* --- Hero Section --- */}
        <section className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
         

          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="max-w-8xl space-y-10 relative z-20">
            
            {/* 1. Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: "easeOut" }}
            className="mx-auto"
          >
            <div
              className="
                group relative inline-flex items-center gap-2
                rounded-full
                border border-zinc-200 dark:border-zinc-800
                bg-white/70 dark:bg-zinc-950/70
                px-4 py-1.5
                text-xs font-medium
                text-zinc-700 dark:text-zinc-300
                backdrop-blur-xl
                transition-all
                hover:border-zinc-300 dark:hover:border-zinc-700
                cursor-pointer
              "
            >
              {/* Live Indicator */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-900 dark:bg-white opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-900 dark:bg-white" />
              </span>

              {/* Label */}
              <span className="transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">
                Protocol v2.0 Online
              </span>

              {/* Arrow */}
              <ArrowRight
                className="
                  h-3 w-3
                  text-zinc-400
                  transition-transform
                  group-hover:translate-x-1
                "
              />

              {/* Subtle bottom accent */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-x-0 -bottom-px mx-auto
                  h-px w-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-zinc-900/20 dark:via-white/20
                  to-transparent
                "
              />
            </div>
          </motion.div>


            {/* 2. Main Title with Shimmer */}
         {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="
              relative text-center max-w-8xl md:text-left
              font-extrabold tracking-tight
              leading-[0.95]
              text-[clamp(2.5rem,6vw,6rem)]
              lg:text-[clamp(4rem,7vw,5rem)]
            "
          >
            {/* Line 1 */}
            <span
              className="
                block
                bg-clip-text text-center text-transparent
                bg-gradient-to-b
                from-zinc-900 to-zinc-600
                dark:from-white dark:to-zinc-400
              "
            >
              DevAtlas
            </span>

            {/* Line 2 */}
            <span
              className="
                relative block
                bg-clip-text text-center text-transparent
                bg-gradient-to-b
                from-zinc-800 to-zinc-500
                dark:from-white dark:to-zinc-500
              "
            >
              Everything You Learn. Mapped.
            </span>

            {/* Subtle depth glow (theme aware) */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-0 -z-10
                bg-gradient-to-b
                from-zinc-200/30 to-transparent
                dark:from-white/10
                blur-3xl
              "
            />
          </motion.h1>


            {/* 3. Description */}
          <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="
            mx-auto max-w-2xl
            text-base md:text-lg
            leading-relaxed
            text-zinc-600 dark:text-zinc-400
            font-normal
          "
        >
          The definitive learning environment for engineering performant, scalable,
          and accessible interfaces.

        </motion.p>


            {/* 4. CTA Buttons */}
       <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
        className="
          mt-8
          flex flex-row
          items-center justify-center
          gap-4
        "
      >
        {/* Primary CTA */}
        <Button
         
          className="
            h-12 px-7 
            bg-zinc-900 text-white rounded-3xl
            hover:bg-zinc-800
            dark:bg-white dark:text-black dark:hover:bg-zinc-200
            transition-all
            font-semibold
            tracking-tight
            flex items-center cursor-pointer gap-2
          "
           onClick={()=>navigate("/initialization")}

        >
          Initialize Learning
          <Command className="h-4 w-4" />
        </Button>

        {/* Secondary CTA */}
        <Button
       
          variant="outline"
          className="
            h-12 px-7 cursor-pointer rounded-3xl
            border-zinc-300 text-zinc-700
            hover:bg-zinc-100
            dark:border-zinc-700 dark:text-zinc-300
            dark:hover:bg-zinc-900
            transition-all
            font-medium
          "
        >
          Read Docs
        </Button>
      </motion.div>

          </motion.div>
        </section>

        {/* --- Spotlight Bento Grid Section --- */}
        <section className="relative z-10 w-full max-w-[1400px] sm:px-6 pb-10">
          
          {/* Section Header */}
         <div
            className="
              mb-16 flex flex-col items-center justify-center
              border-b border-zinc-200 pb-8 text-center
              dark:border-zinc-800
            "
          >
            <div className="space-y-3 max-w-xl">
              <h2
                className="
                  text-[clamp(2rem,4vw,2.75rem)]
                  font-extrabold tracking-tight
                  text-zinc-900
                  dark:text-white
                "
              >
                Core Modules
              </h2>

              <p
                className="
                  text-sm md:text-base
                  text-zinc-600
                  dark:text-zinc-400
                  leading-relaxed
                "
              >
                Select a learning track. All modules are designed to be completed in
                sequence or used as standalone references.
              </p>
            </div>
          </div>


          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Card 1 */}
            <SpotlightCard className="group">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl
                border border-zinc-200 dark:border-zinc-800
                bg-zinc-100 dark:bg-zinc-900
                text-zinc-900 dark:text-white
                shadow-sm dark:shadow-inner
                group-hover:scale-110 transition-transform duration-300">
                <Code2 className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                React Internals
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                Deep dive into reconciliation, fiber trees, and concurrent mode. Understand how React works under the hood.
              </p>

              <div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white
                group-hover:translate-x-2 transition-transform">
                Start Module <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </SpotlightCard>

            {/* Card 2 */}
            <SpotlightCard className="group">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl
                border border-zinc-200 dark:border-zinc-800
                bg-zinc-100 dark:bg-zinc-900
                text-zinc-900 dark:text-white
                shadow-sm dark:shadow-inner
                group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Animations
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                Master Framer Motion and CSS transitions. Create layout animations, gestures, and complex orchestrations.
              </p>

              <div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white
                group-hover:translate-x-2 transition-transform">
                Start Module <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </SpotlightCard>

            {/* Card 3 */}
            <SpotlightCard className="group">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl
                border border-zinc-200 dark:border-zinc-800
                bg-zinc-100 dark:bg-zinc-900
                text-zinc-900 dark:text-white
                shadow-sm dark:shadow-inner
                group-hover:scale-110 transition-transform duration-300">
                <Box className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Component Architecture
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                Build a headless UI library. Learn compound components, render props, and accessible primitives.
              </p>

              <div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white
                group-hover:translate-x-2 transition-transform">
                Start Module <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </SpotlightCard>

            {/* Card 4 (Wide / Responsive) */}
            <SpotlightCard span={2} className="group">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl
                    border border-zinc-200 dark:border-zinc-800
                    bg-zinc-100 dark:bg-zinc-900
                    text-zinc-900 dark:text-white
                    shadow-sm dark:shadow-inner
                    group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    React Native Production
                  </h3>

                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-md">
                    The complete guide to cross-platform mobile dev. Covers Expo, NativeWind, gesture handling, and native module bridging.
                  </p>

                  <div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white
                    group-hover:translate-x-2 transition-transform">
                    Start Module <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>

                {/* Visual Decoration */}
                <div className="hidden md:block w-1/3 min-h-[150px] rounded-xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-zinc-50 dark:bg-zinc-900/50
                  relative overflow-hidden transition-colors">
                  
                  <div className="absolute top-4 left-4 right-4 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  <div className="absolute top-8 left-4 right-12 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  <div className="absolute top-12 left-4 right-8 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />

                  {/* Scan Line */}
                  <div className="absolute inset-0 bg-gradient-to-b
                    from-transparent via-zinc-400/10 dark:via-white/5 to-transparent
                    -translate-y-full group-hover:translate-y-full
                    transition-transform duration-1000" />
                </div>
              </div>
            </SpotlightCard>

            {/* Card 5 */}
            <SpotlightCard className="group">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl
                border border-zinc-200 dark:border-zinc-800
                bg-zinc-100 dark:bg-zinc-900
                text-zinc-900 dark:text-white
                shadow-sm dark:shadow-inner
                group-hover:scale-110 transition-transform duration-300">
                <Server className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Edge Computing
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                Server Components, Streaming, and Edge Functions. Modern backend patterns for frontend devs.
              </p>

              <div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white
                group-hover:translate-x-2 transition-transform">
                Start Module <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </SpotlightCard>

          </div>
        </section>
                {/* --- Streamlined Success Section (New) --- */}
        <section className="relative z-10 w-full  dark:bg-zinc-950/50 border-y border-zinc-200 dark:border-zinc-800 py-32 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                The Execution Pipeline
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                A linear process designed to take you from initialization to production deployment in record time.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-zinc-200 dark:bg-zinc-800 border-t border-dashed border-zinc-300 dark:border-zinc-700 z-0" />

              {/* Step 1 */}
              <SpotlightCard className="text-center relative z-10 bg-white dark:bg-black" stepLabel="STEP 01">
                <div className="mx-auto mb-8 relative">
                  <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto shadow-[0_0_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(255,255,255,0.2)]">
                    <Terminal className="h-10 w-10 text-zinc-900 dark:text-white" />
                  </div>
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-full border border-zinc-300 dark:border-zinc-700 animate-ping opacity-20" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                  Initialize
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Clone the starter repository, configure your local environment with our CLI, and sync with the remote protocol.
                </p>
              </SpotlightCard>

              {/* Step 2 */}
              <SpotlightCard className="text-center relative z-10 bg-white dark:bg-black" stepLabel="STEP 02">
                <div className="mx-auto mb-8 relative">
                  <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto">
                    <GitBranch className="h-10 w-10 text-zinc-900 dark:text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                  Architect
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Follow the modular curriculum. Build real-world features using advanced patterns, type-safety, and atomic design.
                </p>
              </SpotlightCard>

              {/* Step 3 */}
              <SpotlightCard className="text-center relative z-10 bg-white dark:bg-black" stepLabel="STEP 03">
                <div className="mx-auto mb-8 relative">
                  <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto">
                    <Rocket className="h-10 w-10 text-zinc-900 dark:text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                  Deploy
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Ship your application to the edge. Configure CI/CD pipelines, monitor metrics, and scale globally.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* --- FAQ / Accordion Section (New) --- */}
        <section className="relative z-10 w-full max-w-6xl sm:px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
              System Inquiry
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Clarifications regarding the DevAtlas protocol.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
              <AccordionTrigger className="text-lg cursor-pointer font-medium text-zinc-900 dark:text-white hover:no-underline py-6">
                Is this suitable for absolute beginners?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6">
                DevAtlas is engineered for developers with basic JavaScript knowledge. While we cover fundamentals, the curriculum ramps up quickly to professional-grade architecture. We recommend knowing basic HTML/CSS/JS before initializing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
              <AccordionTrigger className="text-lg cursor-pointer font-medium text-zinc-900 dark:text-white hover:no-underline py-6">
                What is the primary tech stack?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6">
                We focus on the modern "Bleeding Edge" stack: React 19 (Canary features), Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI, Supabase, and Framer Motion.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
              <AccordionTrigger className="text-lg cursor-pointer font-medium text-zinc-900 dark:text-white hover:no-underline py-6">
                Do I get access to updates?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6">
                Yes. The protocol is live. When React or Next.js releases a new major version, modules are patched or rewritten to reflect the new standard within 48 hours.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4" className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
              <AccordionTrigger className="text-lg cursor-pointer font-medium text-zinc-900 dark:text-white hover:no-underline py-6">
                Can I use this for team training?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6">
                 Absolutely. We offer team licenses that include a dedicated dashboard for tracking progress, code review assignments, and private architecture consultations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>


      </main>
    </div>
  );
}