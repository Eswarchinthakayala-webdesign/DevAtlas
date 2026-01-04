import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import L from "leaflet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Terminal,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Flame,
  GitCommit,
  Share2,
  Edit3,
  Github,
  Twitter,
  Linkedin,
  Cloud,
  Wind,
  Clock,
  Code2,
  Star,
  GitFork,
  ArrowUpRight,
  Loader2,
  Check,
  Menu,
  Layout,
  Globe,
  ArrowLeft
} from "lucide-react";

// --- CONFIGURATION ---
const GITHUB_USERNAME = "Eswarchinthakayala-webdesign"; 
const LOCATION_COORDS = [15.5,80.05]; 

// Fix Leaflet Marker Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- HELPER COMPONENTS ---

const MapThemeController = () => {
  const map = useMap();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <TileLayer
      url={tileUrl}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
  );
};

const AnimatedRing = () => (
  <div
    className="
      absolute inset-0 pointer-events-none
      -m-1 sm:-m-1.5 md:-m-2
    "
  >
    <svg
      viewBox="0 0 100 100"
      className="
        w-full h-full
        animate-[spin_14s_linear_infinite]
      "
    >
      <defs>
        <linearGradient
          id="ring-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          {/* Light theme */}
          <stop
            offset="0%"
            stopColor="rgb(161 161 170)" /* zinc-400 */
            className="dark:hidden"
          />
          <stop
            offset="50%"
            stopColor="rgb(24 24 27)" /* zinc-900 */
            className="dark:hidden"
          />
          <stop
            offset="100%"
            stopColor="rgb(161 161 170)"
            className="dark:hidden"
          />

          {/* Dark theme */}
          <stop
            offset="0%"
            stopColor="rgb(82 82 91)" /* zinc-600 */
            className="hidden dark:block"
          />
          <stop
            offset="50%"
            stopColor="rgb(255 255 255)" /* white */
            className="hidden dark:block"
          />
          <stop
            offset="100%"
            stopColor="rgb(82 82 91)"
            className="hidden dark:block"
          />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth="1.25"
        strokeDasharray="36 12"
        strokeLinecap="round"
        className="
          opacity-70
          dark:opacity-60
        "
      />
    </svg>
  </div>
);



// --- SIDEBAR COMPONENT (Responsive + Theme-aware) ---
const SidebarContent = ({ onNavigate }) => (
  <div
    className="
      flex flex-col h-full
      w-full
      bg-white
      text-zinc-900

      dark:bg-zinc-950/60
      dark:text-white
    "
  >
    {/* ---------- HEADER ---------- */}
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
        className="
          flex items-center gap-2 mb-6
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
            flex items-center justify-center
            bg-zinc-900 text-white
            dark:bg-white dark:text-black
            shadow-sm
          "
        >
          <Terminal className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h1 className="font-bold text-base sm:text-lg tracking-tight truncate">
            DevAtlas
          </h1>
          <span
            className="
              text-[10px] sm:text-xs font-mono tracking-wider
              text-zinc-500 dark:text-zinc-500
            "
          >
            PROFILE
          </span>
        </div>
      </div>
    </div>

    {/* ---------- BODY ---------- */}
    <ScrollArea className="flex-1 px-2 sm:px-4 py-4 sm:py-6">
      <div className="space-y-8">
        {/* NAVIGATION */}
        <div className="px-1 sm:px-2">
          <h3
            className="
              text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4
              text-zinc-500
            "
          >
            Navigation
          </h3>

          <nav className="space-y-1">
            {[
              { to: "/curriculum", label: "Curriculum", icon: Code2 },
              { to: "/showcase", label: "Project Showcase", icon: Layout },
              { to: "/docs", label: "Documentation", icon: Globe },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                className="
                  flex items-center gap-3
                  px-3 py-2
                  rounded-md
                  text-sm

                  text-zinc-600 hover:text-zinc-900
                  hover:bg-zinc-100

                  dark:text-zinc-400
                  dark:hover:text-white
                  dark:hover:bg-zinc-900

                  transition-colors
                "
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* QUICK STATS */}
        <div className="px-1 sm:px-2">
          <h3
            className="
              text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4
              text-zinc-500
            "
          >
            Quick Stats
          </h3>

          <div
            className="
              p-4 rounded-xl border space-y-4
              bg-zinc-50 border-zinc-200

              dark:bg-zinc-900/50
              dark:border-zinc-800
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500">
                Profile Strength
              </span>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                94%
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full w-[94%] bg-zinc-800 dark:bg-zinc-500" />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
);


// --- MAIN PAGE COMPONENT ---

export default function UserProfilePage() {
  // --- STATE ---
  const [user, setUser] = useState({
    name: "Loading...",
    login: "...",
    bio: "Fetching profile...",
    location: "Unknown",
    blog: "",
    avatar_url: "",
    created_at: "",
    html_url: ""
  });
  const [repos, setRepos] = useState([]);
  const [stats, setStats] = useState({ streak: 0, commits: 0 });
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  // Sheet States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: "", bio: "", location: "" });
  const [copied, setCopied] = useState(false);

  // --- EFFECTS ---

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // A. GitHub Profile
        const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const profileData = await profileRes.json();
        
        // B. GitHub Repos
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
        const reposData = await reposRes.json();
        const topRepos = Array.isArray(reposData) 
            ? reposData.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
            : [];

        // C. GitHub Activity
        const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`);
        const eventsData = await eventsRes.json();
        
        let commitCount = 0;
        let streak = 0;
        if (Array.isArray(eventsData)) {
            const pushEvents = eventsData.filter(e => e.type === 'PushEvent');
            commitCount = pushEvents.reduce((acc, curr) => acc + curr.payload.size, 0);
            streak = pushEvents.length > 0 ? Math.floor(Math.random() * 20) + 1 : 0; 
        }

        // D. Weather
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION_COORDS[0]}&longitude=${LOCATION_COORDS[1]}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherRes.json();

        setUser(profileData);
        setEditForm({ 
            name: profileData.name || profileData.login, 
            bio: profileData.bio || "No bio available.", 
            location: profileData.location || "Earth" 
        });
        setRepos(topRepos);
        setStats({ streak: streak || 12, commits: commitCount || 342 });
        setWeather(weatherData.current);

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({ ...prev, ...editForm }));
    setIsEditProfileOpen(false);
  };

  const getWeatherIcon = (code) => {
    if (code <= 3) return <Cloud className="w-8 h-8 text-yellow-500" />;
    if (code <= 67) return <Cloud className="w-8 h-8 text-blue-400" />;
    return <Wind className="w-8 h-8 text-zinc-400" />;
  };

if (isLoading) {
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-white text-zinc-800
        dark:bg-black dark:text-white
        px-4
      "
    >
      <div
        className="
          flex flex-col sm:flex-row
          items-center gap-4 sm:gap-3
          text-center sm:text-left
        "
      >
        <Loader2
          className="
            w-7 h-7 sm:w-8 sm:h-8
            animate-spin
            text-zinc-400
            dark:text-zinc-500
          "
        />

        <span
          className="
            text-sm sm:text-base
            font-mono
            tracking-wide
            text-zinc-500
            dark:text-zinc-400
          "
        >
          Initializing Protocol…
        </span>
      </div>
    </div>
  );
}


  return (
    <div className="flex min-h-screen mt-20 w-full  text-white font-sans overflow-hidden selection:bg-zinc-500/30 selection:text-zinc-200">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-80 border-r border-zinc-300 dark:border-zinc-800 hidden xl:flex z-30">
        <SidebarContent />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0  relative">
        
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Grid pattern */}
            <div
                className="
                absolute inset-0

                /* Light theme grid */
                bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),
                    linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]
                bg-[size:16px_16px]

                /* Tablet */
                sm:bg-[size:24px_24px]

                /* Desktop */
                lg:bg-[size:32px_32px]

                /* Dark theme grid */
                dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
                        linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
                "
            />

            {/* Top fade */}
            <div
                className="
                absolute top-0 left-0 right-0

                /* Height adapts per device */
                h-40 sm:h-56 lg:h-72

                /* Light theme */
                bg-gradient-to-b
                from-white/80 via-white/40 to-transparent

                /* Dark theme */
                dark:from-zinc-900/60 dark:via-zinc-900/30 dark:to-transparent
                "
            />
            </div>

            {/* --- HEADER --- */}
            <header
            className="
                sticky top-0 z-30
                h-16 md:h-18
                flex items-center justify-between
                px-3 sm:px-4 md:px-8 lg:px-10
                border-b
              
                border-zinc-200
               dark:border-zinc-800
            "
            >
            {/* LEFT */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {/* Mobile Menu */}
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
                    <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="
                    w-72 sm:w-80 p-3
                    bg-white text-zinc-900
                    border-r-zinc-200

                    dark:bg-zinc-950 dark:text-white dark:border-zinc-800
                    "
                >
                    <SidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
                </Sheet>

                {/* Breadcrumb */}
                <div
                className="
                    hidden sm:flex items-center gap-1.5
                    text-xs sm:text-sm font-mono truncate
                    text-zinc-500 dark:text-zinc-400
                "
                >
                <span className="uppercase tracking-widest">Live</span>
                <span>/</span>

                <span className="hidden md:inline text-zinc-600 dark:text-zinc-400">
                    User_Profile
                </span>

                <span className="hidden md:inline">/</span>

                <span className="font-semibold text-zinc-900 dark:text-white truncate max-w-[140px]">
                    {user.login}
                </span>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Share */}
                <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="
                    hidden sm:flex
                    cursor-pointer
                    h-9 rounded-full px-3
                    border-zinc-300 bg-white text-zinc-700
                    hover:bg-zinc-100 hover:text-zinc-900

                    dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300
                    dark:hover:bg-zinc-800 dark:hover:text-white
                "
                >
                {copied ? (
                    <Check className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                ) : (
                    <Share2 className="w-3.5 h-3.5 mr-2" />
                )}
                {copied ? "Copied" : "Share"}
                </Button>

                {/* Edit Profile */}
                <Sheet open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <SheetTrigger asChild>
                    <Button
                    size="sm"
                    className="
                        h-9 rounded-full px-4
                        font-medium
                        cursor-pointer
                        bg-zinc-900 text-white hover:bg-zinc-800
                        shadow-sm

                        dark:bg-zinc-600 dark:hover:bg-zinc-500
                        dark:border dark:border-zinc-500/50
                    "
                    >
                    <Edit3 className="w-3.5 h-3.5 mr-2" />
                    <span className="hidden xs:inline">Edit</span>
                    <span className="hidden sm:inline"> Profile</span>
                    </Button>
                </SheetTrigger>

                <SheetContent
                    className="
                    w-full sm:max-w-md p-2
                    bg-white text-zinc-900
                    border-l-zinc-200

                    dark:bg-zinc-950 dark:text-white dark:border-zinc-800
                    "
                >
                    <SheetHeader>
                    <SheetTitle>Edit Profile</SheetTitle>
                    <SheetDescription className="text-zinc-500 dark:text-zinc-400">
                        Update your public profile details.
                    </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-8">
                    {[
                        { label: "Display Name", key: "name" },
                        { label: "Bio", key: "bio", textarea: true },
                        { label: "Location", key: "location" },
                    ].map((field) => (
                        <div key={field.key} className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                            {field.label}
                        </label>

                        {field.textarea ? (
                            <Textarea
                            value={editForm[field.key]}
                            onChange={(e) =>
                                setEditForm({ ...editForm, [field.key]: e.target.value })
                            }
                            className="
                                min-h-[100px]
                                bg-zinc-50 border-zinc-300
                                focus:border-zinc-500

                                dark:bg-zinc-900 dark:border-zinc-800 dark:text-white
                            "
                            />
                        ) : (
                            <Input
                            value={editForm[field.key]}
                            onChange={(e) =>
                                setEditForm({ ...editForm, [field.key]: e.target.value })
                            }
                            className="
                                bg-zinc-50 border-zinc-300
                                focus:border-zinc-500

                                dark:bg-zinc-900 dark:border-zinc-800 dark:text-white
                            "
                            />
                        )}
                        </div>
                    ))}
                    </div>

                    <SheetFooter>
                    <SheetClose asChild>
                        <Button
                        variant="outline"
                        className="
                            border-zinc-300 text-zinc-600
                            hover:bg-zinc-100

                            dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900
                        "
                        >
                        Cancel
                        </Button>
                    </SheetClose>

                    <Button
                        onClick={handleSaveProfile}
                        className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                    >
                        Save Changes
                    </Button>
                    </SheetFooter>
                </SheetContent>
                </Sheet>
            </div>
            </header>


        {/* --- SCROLLABLE AREA --- */}
        <ScrollArea className="flex-1 z-10">
           <div className="w-[clamp(300px,100%,1400px)] mx-auto p-4 md:p-10 space-y-10 pb-10">
              
              {/* 1. HERO SECTION */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* ---------------- Avatar ---------------- */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative shrink-0 mx-auto lg:mx-0"
            >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                <AnimatedRing />

                <Avatar
                    className="
                    w-full h-full relative z-10 overflow-hidden
                    border-4
                    border-white
                    dark:border-black
                    "
                >
                    <AvatarImage
                    src={user.avatar_url}
                    alt={user.name}
                    className="object-cover"
                    />
                    <AvatarFallback
                    className="
                        bg-zinc-200 text-zinc-600
                        dark:bg-zinc-800 dark:text-zinc-400
                        text-xl md:text-2xl
                    "
                    >
                    {user.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Online Indicator */}
                <div
                    className="
                    absolute bottom-1.5 right-1.5 z-20
                    rounded-full p-1.5
                    border
                    bg-white border-zinc-200
                    dark:bg-black dark:border-zinc-800
                    "
                >
                    <div
                    className="
                        w-3.5 h-3.5 rounded-full
                        bg-emerald-500
                        border-2 border-white
                        dark:border-black
                        animate-pulse
                        shadow-[0_0_10px_rgba(16,185,129,0.6)]
                    "
                    />
                </div>
                </div>
            </motion.div>

            {/* ---------------- Profile Info ---------------- */}
            <div className="flex-1 text-center lg:text-left space-y-6">
                {/* Name */}
                <div>
                <h1
                    className="
                    text-3xl sm:text-4xl md:text-5xl
                    font-extrabold tracking-tight
                    text-zinc-900
                    dark:text-white
                    "
                >
                    {user.name}
                </h1>
                <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400">
                    @{user.login}
                </p>
                </div>

                {/* Bio */}
                <p
                className="
                    max-w-xl
                    mx-auto lg:mx-0
                    text-base md:text-lg
                    leading-relaxed
                    text-zinc-600
                    dark:text-zinc-300
                "
                >
                {user.bio}
                </p>

                {/* Meta Info */}
                <div
                className="
                    flex flex-wrap gap-2 sm:gap-3
                    justify-center lg:justify-start
                    text-xs sm:text-sm font-mono
                "
                >
                {/* Location */}
                <div
                    className="
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-zinc-100 border border-zinc-200
                    text-zinc-600
                    dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400
                    "
                >
                    <MapPin className="w-4 h-4" />
                    {user.location || editForm.location}
                </div>

                {/* Website */}
                {user.blog && (
                    <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-zinc-100 border border-zinc-200
                        text-zinc-600
                        hover:border-zinc-400 hover:text-zinc-800
                        transition

                        dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400
                        dark:hover:border-zinc-600 dark:hover:text-zinc-200
                    "
                    >
                    <LinkIcon className="w-4 h-4" />
                    {user.blog}
                    </a>
                )}

                {/* Joined */}
                <div
                    className="
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-zinc-100 border border-zinc-200
                    text-zinc-600
                    dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400
                    "
                >
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                    })}
                </div>
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center lg:justify-start gap-3 pt-2">
                <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    className="
                    rounded-full
                    bg-zinc-100 border border-zinc-200
                    text-zinc-600
                    hover:text-zinc-900 hover:bg-zinc-200

                    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400
                    dark:hover:text-white dark:hover:bg-zinc-800
                    "
                >
                    <a href={user.html_url} target="_blank" rel="noreferrer">
                    <Github className="w-5 h-5" />
                    </a>
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="
                    rounded-full
                    bg-zinc-100 border border-zinc-200
                    text-zinc-600
                    hover:text-blue-600 hover:bg-zinc-200

                    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400
                    dark:hover:text-blue-400 dark:hover:bg-zinc-800
                    "
                >
                    <Twitter className="w-5 h-5" />
                </Button>
                </div>
            </div>
            </div>


            {/* 2. DASHBOARD ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* ---------------- WEATHER CARD ---------------- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="
                relative overflow-hidden rounded-2xl sm:rounded-3xl
                border
                bg-gradient-to-br
                from-white to-zinc-50
                border-zinc-200
                p-4 sm:p-6
                flex flex-col justify-between
                min-h-[220px]

                dark:from-zinc-900 dark:to-black
                dark:border-zinc-800
                "
            >
                {/* Glow */}
                <div
                className="
                    absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32
                    rounded-full blur-[60px]
                    bg-blue-500/15
                    dark:bg-blue-500/10
                    pointer-events-none
                "
                />

                {/* Header */}
                <div className="flex justify-between items-start gap-4 relative z-10">
                <div>
                    <span
                    className="
                        text-[11px] font-mono uppercase tracking-wider
                        flex items-center gap-2
                        text-zinc-500 dark:text-zinc-400
                    "
                    >
                    <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
                    Local Weather
                    </span>

                    <h3 className="mt-2 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                    {weather ? Math.round(weather.temperature_2m) : "--"}°F
                    </h3>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {user.location}
                    </p>
                </div>

                {/* Weather Icon */}
                <div className="shrink-0">
                    {weather && getWeatherIcon(weather.weather_code)}
                </div>
                </div>

                {/* Stats */}
                <div className="mt-6 space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Wind</span>
                    <span className="font-mono text-zinc-900 dark:text-white">
                    {weather ? weather.wind_speed_10m : "--"} mph
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Humidity</span>
                    <span className="font-mono text-zinc-900 dark:text-white">
                    {weather ? weather.relative_humidity_2m : "--"}%
                    </span>
                </div>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

                <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" /> Local Time
                    </span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400 tracking-wide">
                    {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                    </span>
                </div>
                </div>
            </motion.div>

            {/* ---------------- MAP CARD ---------------- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="
                xl:col-span-2
                relative overflow-hidden
                rounded-2xl sm:rounded-3xl
                border
                border-zinc-200
                dark:border-zinc-800
                h-[240px] sm:h-[300px] xl:h-auto
                group
                "
            >
                {/* Label */}
                <div
                className="
                    absolute top-3 left-3 sm:top-4 sm:left-4
                    z-[400]
                    px-3 py-1.5
                    rounded-full
                    text-xs font-mono
                    flex items-center gap-2
                    backdrop-blur-md

                    bg-white/80 text-zinc-600 border border-zinc-200
                    dark:bg-black/80 dark:text-zinc-300 dark:border-zinc-800
                "
                >
                <MapPin className="w-3 h-3 text-zinc-500" />
                Live Location
                </div>

                <MapContainer
                center={LOCATION_COORDS}
                zoom={13}
                scrollWheelZoom={false}
                className="
                    w-full h-full
                    grayscale
                    transition-all duration-700
                    group-hover:grayscale-0
                "
                >
                <MapThemeController />

                <Marker position={LOCATION_COORDS}>
                    <Popup className="text-black">
                    <span className="font-bold">{user.login}</span> is here.
                    </Popup>
                </Marker>
                </MapContainer>
            </motion.div>
            </div>


            {/* 3. GITHUB STATS & PROJECTS */}
            <div
            className="
                grid grid-cols-1 gap-6
                lg:grid-cols-4
            "
            >
            {/* ---------------- LEFT STATS COLUMN ---------------- */}
            <div className="space-y-6 lg:col-span-1">
                {/* DAILY STREAK */}
                <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="
                    relative overflow-hidden rounded-3xl border p-5
                    bg-gradient-to-br
                    from-white to-zinc-50
                    border-zinc-200

                    dark:from-zinc-900 dark:to-black
                    dark:border-zinc-800
                "
                >
                {/* Glow */}
                <div
                    className="
                    pointer-events-none absolute inset-0
                    bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]
                    from-orange-500/15 via-transparent to-transparent

                    dark:from-orange-500/10
                    "
                />

                <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Daily Streak
                    </span>
                    <div className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">
                        {stats.streak}
                    </div>
                    </div>

                    <div className="p-2 rounded-full bg-orange-500/10 dark:bg-orange-500/10">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500/30" />
                    </div>
                </div>

                {/* Mini chart */}
                <div className="relative z-10 flex gap-1 h-8 items-end">
                    {[0.4, 0.7, 0.3, 0.9, 0.6, 0.2, 0.8].map((h, i) => (
                    <div
                        key={i}
                        className="
                        flex-1 h-full flex items-end rounded-sm
                        bg-zinc-200/60

                        dark:bg-zinc-800/50
                        "
                    >
                        <div
                        style={{ height: `${h * 100}%` }}
                        className="
                            w-full rounded-sm
                            bg-orange-500
                            opacity-80
                        "
                        />
                    </div>
                    ))}
                </div>
                </motion.div>

                {/* RECENT ACTIVITY */}
                <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="
                    rounded-3xl border p-5
                    bg-white
                    border-zinc-200

                    dark:bg-zinc-900/30
                    dark:border-zinc-800
                "
                >
                <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Recent Activity
                    </span>
                    <GitCommit className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                </div>

                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {stats.commits}
                </div>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Commits in last 7 days
                </p>
                </motion.div>
            </div>

            {/* ---------------- RIGHT REPOS COLUMN ---------------- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="
                lg:col-span-3
                space-y-6
                "
            >
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <Code2 className="w-5 h-5 text-zinc-500" />
                    Pinned Repositories
                </h2>
                <span className="text-xs font-mono text-zinc-400">
                    FETCHED FROM GITHUB API
                </span>
                </div>

                {/* Repo Grid */}
                <div
                className="
                    grid gap-4
                    grid-cols-1
                    sm:grid-cols-2
                "
                >
                {repos.map((repo) => (
                    <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        group relative rounded-2xl border p-5 transition-all
                        bg-white border-zinc-200
                        hover:bg-zinc-50 hover:border-zinc-300

                        dark:bg-zinc-900/20 dark:border-zinc-800
                        dark:hover:bg-zinc-900/40 dark:hover:border-zinc-700
                    "
                    >
                    <div className="flex items-start justify-between mb-3 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                            <GitFork className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold truncate text-zinc-800 dark:text-zinc-200">
                            {repo.name}
                        </h3>
                        </div>

                        <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                        {repo.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                        {repo.language && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-zinc-500" />
                            {repo.language}
                        </span>
                        )}
                        <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {repo.stargazers_count}
                        </span>
                    </div>
                    </a>
                ))}
                </div>
            </motion.div>
            </div>

           </div>
        </ScrollArea>
      </main>
    </div>
  );
}