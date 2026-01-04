import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Cpu,
  Wifi,
  ShieldCheck,
  Database,
  Zap,
  CheckCircle2,
  Loader2,
  Server,
  Layers,
  Code2
} from "lucide-react";

// --- MOCK BOOT SEQUENCE DATA ---
const BOOT_SEQUENCE = [
  { id: 1, text: "Initializing secure handshake...", icon: Wifi, color: "text-zinc-400" },
  { id: 2, text: "Allocating virtual memory space...", icon: Database, color: "text-zinc-400" },
  { id: 3, text: "Verifying user identity token...", icon: ShieldCheck, color: "text-zinc-500" },
  { id: 4, text: "Mounting React Fiber architecture...", icon: Code2, color: "text-blue-400" },
  { id: 5, text: "Connecting to Edge Network (Region: us-east-1)...", icon: Server, color: "text-orange-400" },
  { id: 6, text: "Pre-fetching curriculum assets...", icon: Layers, color: "text-purple-400" },
  { id: 7, text: "Optimizing render cycle...", icon: Zap, color: "text-yellow-400" },
  { id: 8, text: "System Ready. Launching Protocol v2.4.", icon: CheckCircle2, color: "text-zinc-500" },
];

export default function InitializeLearning() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // --- SIMULATION LOGIC ---
  useEffect(() => {
    // 1. Progress Bar Timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Randomize speed for realism
        return prev + Math.random() * 3; 
      });
    }, 100);

    // 2. Step Sequence Timer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= BOOT_SEQUENCE.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 450); // Steps happen every 450ms

    // 3. Navigation Timer
    const navTimeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        navigate("/curriculum");
      }, 1000); // Wait for exit animation
    }, 4500); // Total boot time

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full  text-white font-sans overflow-hidden flex flex-col items-center justify-center selection:bg-zinc-500/30">
      
        {/* --- Background Effects --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Lines */}
        <div
            className="
            absolute inset-0
            bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),
                linear-gradient(to_bottom,#00000005_1px,transparent_1px)]
            bg-[size:40px_40px]

            dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),
                linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]
            dark:bg-[size:40px_40px]

            sm:bg-[size:30px_30px]  /* smaller grid on small screens */
            xs:bg-[size:20px_20px]  /* very small for mobile */
            "
        ></div>

        {/* Radial Glow */}
        <div
            className="
            absolute
            top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[800px] h-[800px]
            sm:w-[600px] sm:h-[600px]
            xs:w-[400px] xs:h-[400px]
            rounded-full
            blur-[120px]
            bg-zinc-500/5
            dark:bg-zinc-400/10
            "
        ></div>
        </div>


        <AnimatePresence>
        {!isComplete && (
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-10"
            >
            {/* --- Main HUD Container --- */}
            <div className="
                relative rounded-2xl border
                bg-white/80 dark:bg-zinc-950/80
                border-zinc-200 dark:border-zinc-800
                backdrop-blur-xl overflow-hidden shadow-2xl
            ">
                {/* Scanline Overlay */}
                <div className="
                absolute inset-0 
                bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)]
                bg-[size:100%_4px]
                pointer-events-none opacity-20
                dark:opacity-20 z-20
                " />

                {/* Header Bar */}
                <div className="
                flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4
                border-b border-zinc-300 dark:border-zinc-800
                bg-zinc-100/50 dark:bg-zinc-900/50
                ">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs font-mono text-zinc-700 dark:text-zinc-400 uppercase tracking-widest">
                    SYSTEM_INIT // ROOT_ACCESS
                    </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono text-zinc-600 dark:text-zinc-500 animate-pulse">
                    <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    PROCESSING
                </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center">
                {/* 1. Central Radar/Loader */}
                <div className="relative w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 mb-6 sm:mb-8 flex items-center justify-center">
                    {/* Outer Rings */}
                    <div className="absolute inset-0 border-2 border-zinc-300 dark:border-zinc-700 rounded-full"></div>
                    <div className="absolute inset-1 border border-zinc-400/50 dark:border-zinc-500/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-3 border border-zinc-500/20 dark:border-zinc-500/20 rounded-full animate-[ping_2s_linear_infinite]"></div>

                    {/* Center Icon */}
                    <div className="relative z-10 w-14 sm:w-16 h-14 sm:h-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Terminal className="w-6 sm:w-8 h-6 sm:h-8 text-zinc-500 dark:text-zinc-400" />
                    </div>

                    {/* Scanning beam */}
                    <div className="absolute top-1/2 left-1/2 w-[50%] h-[1.5px] sm:h-[2px] bg-gradient-to-r from-transparent to-zinc-500/50 origin-left animate-[spin_2s_linear_infinite]"></div>
                </div>

                {/* 2. Progress Indicator */}
                <div className="w-full max-w-xs sm:max-w-sm space-y-2 mb-6 sm:mb-8">
                    <div className="flex justify-between text-[9px] sm:text-xs font-mono font-medium">
                    <span className="text-zinc-500 dark:text-zinc-400">LOADING_MODULES...</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress 
                    value={progress} 
                    className="h-1.5 bg-zinc-200 dark:bg-zinc-800"
                    indicatorClassName="bg-zinc-500 dark:bg-zinc-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-100 ease-linear"
                    />
                </div>

                {/* 3. Terminal Log */}
                <div className="w-full h-28 sm:h-32 md:h-36 overflow-hidden flex flex-col justify-end space-y-2 font-mono text-sm border-t border-zinc-300 dark:border-zinc-800/50 pt-3 sm:pt-4 relative">
                    {/* Gradient fade for top of logs */}
                    <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent z-10"></div>

                    <AnimatePresence mode="popLayout">
                    {BOOT_SEQUENCE.slice(0, currentStep + 1).slice(-3).map((step) => (
                        <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 sm:gap-3"
                        >
                        <span className="text-[8px] sm:text-[10px] text-zinc-600 dark:text-zinc-500 whitespace-nowrap">
                            {`[00:0${step.id}:4${step.id}]`}
                        </span>
                        <step.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${step.color}`} />
                        <span className={`truncate ${step.id === currentStep ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
                            {step.text}
                        </span>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
                </div>

                {/* Footer Status Bar */}
                <div className="bg-zinc-100/50 dark:bg-zinc-900/80 px-4 sm:px-6 py-2 flex justify-between items-center border-t border-zinc-300 dark:border-zinc-800 text-[9px] sm:text-[10px] font-mono text-zinc-600 dark:text-zinc-500">
            
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
                    ONLINE
                </span>
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>

    </div>
  );
}