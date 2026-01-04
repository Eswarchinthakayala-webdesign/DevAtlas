import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Home, 
  Radar, 
  WifiOff, 
  Terminal,
  Activity
} from "lucide-react";

// --- Utility Components ---

/**
 * Background Grid
 * Creates the futuristic "empty sector" scanning effect.
 */
const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
    {/* Base Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    
    {/* Radial Fade (Vignette) */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent,var(--background))]"></div>
    
    {/* Scanning Line Animation */}
    <motion.div 
      initial={{ top: "-10%" }}
      animate={{ top: "110%" }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent blur-sm"
    />
  </div>
);

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const glitchVariants = {
  idle: { x: 0 },
  glitch: {
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 3,
      repeatType: "mirror",
    },
  },
};

// --- Main 404 Page Component ---

export default function NotFoundPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden  text-zinc-900  dark:text-white selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans">
      
      

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center px-6 text-center max-w-3xl"
      >
        

        {/* 1. Icon & Status Pill */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center md:justify-start">
        <div
            className="
            inline-flex items-center gap-2
            rounded-full px-4 py-1.5
            border
            border-zinc-200 dark:border-zinc-800
            bg-white/80 dark:bg-zinc-900/70
            backdrop-blur-md
            text-xs font-mono font-semibold tracking-wider
            text-zinc-700 dark:text-zinc-300
            shadow-sm
            "
        >
            {/* Status Indicator Dot */}
            <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-400 dark:bg-zinc-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-700 dark:bg-zinc-300" />
            </span>

            {/* Icon */}
            <WifiOff className="h-3.5 w-3.5 opacity-80" />

            {/* Label */}
            <span className="uppercase">
            Signal Lost
            </span>
        </div>
        </motion.div>


       {/* 2. Glitchy 404 Text */}
        <motion.div
        variants={itemVariants}
        className="relative mb-8 flex items-center justify-center select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        {/* Echo / Shadow Layers (Depth) */}
        <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center
            text-[7rem] sm:text-[9rem] md:text-[11rem]
            font-extrabold tracking-tighter
            text-zinc-200 dark:text-zinc-800/30
            blur-2xl -z-20"
        >
            404
        </span>

        <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center
            text-[7rem] sm:text-[9rem] md:text-[11rem]
            font-extrabold tracking-tighter
            text-zinc-300 dark:text-zinc-700/40
            blur-lg -z-10 translate-x-[2px] translate-y-[2px]"
        >
            404
        </span>

        {/* Main Glitch Layer */}
        <motion.h1
            variants={glitchVariants}
            animate="glitch"
            className="
            relative
            text-[7rem] sm:text-[9rem] md:text-[11rem]
            font-extrabold tracking-tighter
            bg-clip-text text-transparent
            bg-gradient-to-b
                from-zinc-950 via-zinc-700 to-zinc-500
                dark:from-white dark:via-zinc-300 dark:to-zinc-600
            leading-none
            "
        >
            404
        </motion.h1>

        {/* Subtle Glow */}
        <div
            aria-hidden
            className="
            absolute inset-0 -z-30
            bg-gradient-to-b
            from-zinc-900/10 via-transparent to-transparent
            dark:from-white/10
            blur-[120px]
            "
        />
        </motion.div>


        {/* 3. Message */}
        <motion.h2
        variants={itemVariants}
        className="
            mb-3
            text-2xl sm:text-3xl md:text-4xl
            font-bold tracking-tight
            text-zinc-900 dark:text-white
            text-center
        "
        >
        Coordinates Invalid
        </motion.h2>

        <motion.p
        variants={itemVariants}
        className="
            mb-10
            text-base sm:text-lg
            text-zinc-600 dark:text-zinc-400
            leading-relaxed
            max-w-md
            mx-auto
            text-center
        "
        >
        The vector you are trying to access has been decoupled from the mainframe.
        It may have been moved, deleted, or never existed in this sector.
        </motion.p>

        {/* 4. Action Buttons */}
        <motion.div
        variants={itemVariants}
        className="
            flex
            flex-col sm:flex-row
            gap-4
            w-full
            sm:w-auto
            justify-center
        "
        >
        {/* Primary Action */}
        <Button
            asChild
            className="
            h-12
            px-8
            rounded-full
            bg-zinc-900 text-white
            hover:bg-zinc-800
            dark:bg-white dark:text-black dark:hover:bg-zinc-200
            transition-all
            font-semibold
            tracking-tight
            shadow-md hover:shadow-lg
            active:scale-95
            "
        >
            <Link to="/" className="flex items-center justify-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Base
            </Link>
        </Button>

        {/* Secondary Action */}
        <Button
            asChild
            variant="outline"
            className="
            h-12
            px-8
            rounded-full
            border-zinc-300 dark:border-zinc-800
            bg-transparent
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            text-zinc-900 dark:text-zinc-300
            transition-all
            font-medium
            active:scale-95
            "
        >
            <Link to="/contact" className="flex items-center justify-center">
            <Activity className="mr-2 h-4 w-4" />
            Report Anomaly
            </Link>
        </Button>
        </motion.div>


        {/* 5. Footer System Indicator */}
        <motion.div
        variants={itemVariants}
        className="
            mt-16 flex items-center justify-center gap-4
            text-zinc-500 dark:text-zinc-600
            opacity-70
        "
        >
        {/* Left Divider */}
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-zinc-300 dark:to-zinc-700" />

        {/* Status */}
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em]">
            <span className="relative flex h-4 w-4 items-center justify-center">
            {/* Pulse ring */}
            <span className="absolute h-full w-full rounded-full bg-zinc-400/20 dark:bg-zinc-600/20 animate-ping" />
            <Radar className="relative h-3 w-3 animate-spin [animation-duration:3s]" />
            </span>
            <span className="whitespace-nowrap">System Scanning</span>
        </div>

        {/* Right Divider */}
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-zinc-300 dark:to-zinc-700" />
        </motion.div>


      </motion.div>
    </div>
  );
}