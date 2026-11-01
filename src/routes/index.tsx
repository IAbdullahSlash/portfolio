import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useAnimate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import heroVideo from "@/assets/hero.mp4";
import profilePic from "@/assets/abdullah.webp";
import hackvedaCertificate from "@/assets/hackveda/certificate.webp";
import hackvedaTeam from "@/assets/hackveda/team.webp";
import hackvedaWinner from "@/assets/hackveda/winner.webp";
import hackvedaWork from "@/assets/hackveda/work.webp";
import smartIndiaTeam from "@/assets/internal-sih/team-win.webp";
import gdgTeam from "@/assets/gdg/gdg-team.webp";
import githubFoundationsCert from "@/assets/Foundations.webp";
import mongodbDataModelerCert from "@/assets/mongodb-data-modeler.webp";
import naturalHealerShot from "@/assets/projects/natural-healer.webp";
import ideaEvaluatorShot from "@/assets/projects/idea-evaluator.webp";
import financeTwinShot from "@/assets/projects/finance-twin.webp";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { WebShotLink } from "@/components/web-shot-link";
import ContributionSkyline, {
  type ContributionDay,
} from "@/components/contribution-skyline";
import { HalftoneWordmark } from "@/components/halftone-wordmark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(STRUCTURED_DATA),
      },
    ],
  }),
  component: Portfolio,
});

const GITHUB_URL = "https://github.com/IAbdullahSlash";
const LINKEDIN_URL = "https://www.linkedin.com/in/abdullahslash";
const EMAIL = "abdullahaz7677@gmail.com";
const PHONE = "+91 8756857677";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL,
)}&su=${encodeURIComponent("Hiring Inquiry – Portfolio")}&body=${encodeURIComponent(
  "Hello Abdullah,\n\nI came across your portfolio and would like to discuss an opportunity with you.\n\nLooking forward to hearing from you.\nBest Regards,",
)}`;
const WHATSAPP_NUMBER = PHONE.replace(/[^\d]/g, "");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Abdullah, I came across your portfolio and would like to connect!",
)}`;

const SEO_TITLE = "Abdullah Azmi | AI Engineer & Full Stack Developer";
const SEO_DESCRIPTION =
  "AI Engineer & Full Stack Developer. Explore Abdullah Azmi's projects, hackathon wins, publications and certifications.";

// schema.org data so search engines can tie the name to this site and the linked profiles.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Abdullah Azmi",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/og-image.jpg`,
      jobTitle: "AI Engineer & Full Stack Developer",
      email: `mailto:${EMAIL}`,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Integral University, Lucknow",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Large Language Models",
        "Model Context Protocol",
        "Full Stack Development",
        "React",
        "TypeScript",
        "Python",
      ],
      sameAs: [
        GITHUB_URL,
        LINKEDIN_URL,
        "https://abdullahslash.substack.com",
        "https://www.skills.google/public_profiles/357ec843-643c-4e7e-8d38-4c640348f205",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Abdullah Azmi",
      url: `${SITE_URL}/`,
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

// Beyond this distance from a card (px) its spotlight is fully off (--glow-size in styles.css is 280px).
const GLOW_REACH = 300;

function Portfolio() {
  const [introDone, setIntroDone] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Pointer position for the .glow-card spotlight, written only to on-screen cards
  // the pointer is near, in card-local coords, so the rest of the page never restyles.
  useEffect(() => {
    const onScreen = new Set<HTMLElement>();
    const parked = new WeakSet<HTMLElement>();
    let x = 0;
    let y = 0;
    let known = false;
    let raf = 0;
    const write = () => {
      raf = 0;
      for (const card of onScreen) {
        const r = card.getBoundingClientRect();
        const dx = x - Math.max(r.left, Math.min(x, r.right));
        const dy = y - Math.max(r.top, Math.min(y, r.bottom));
        const near = Math.hypot(dx, dy) <= GLOW_REACH;
        if (!near && parked.has(card)) continue;
        if (near) parked.delete(card);
        else parked.add(card);
        card.style.setProperty("--glow-x", `${x - r.left}px`);
        card.style.setProperty("--glow-y", `${y - r.top}px`);
      }
    };
    const schedule = () => {
      if (known && !raf) raf = requestAnimationFrame(write);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      known = true;
      schedule();
    };
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) onScreen.add(card);
        else onScreen.delete(card);
      }
      schedule();
    });
    document
      .querySelectorAll<HTMLElement>(".glow-card")
      .forEach((card) => io.observe(card));
    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  // RootShell applies the saved theme to <html> before first paint; sync the toggle with it.
  useEffect(() => {
    if (document.documentElement.dataset.theme === "light") setTheme("light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Storage blocked (private mode etc.): theme still applies for this visit.
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--pf-bg)] text-[var(--pf-fg)] antialiased font-sans selection:bg-[var(--pf-accent)] selection:text-[var(--pf-text-on-accent)] overflow-x-hidden">
      <ScrollProgressBar />
      <AnimatePresence>{!introDone && <Intro />}</AnimatePresence>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <About />
      <TechMarquee />
      <Skills />
      <Process />
      <Experience />
      <Projects />
      <Achievements />
      <Publications />
      <Certifications />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{
        scaleX,
        background: "var(--pf-accent)",
        transformOrigin: "0% 50%",
      }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[90]"
    />
  );
}

function Intro() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--pf-accent)" }}
    >
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-black tracking-tight text-white"
      >
        Abdullah Azmi<span className="text-black">.</span>
      </motion.p>
    </motion.div>
  );
}

function GithubIcon({
  className = "w-5 h-5",
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className}>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.19 1.18a11.1 11.1 0 0 1 5.81 0c2.22-1.49 3.19-1.18 3.19-1.18.63 1.59.23 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.67.8.56 4.57-1.53 7.86-5.84 7.86-10.93C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({
  className = "w-5 h-5",
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.53v14H.24V8zm7.5 0h4.34v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.53v-6.24c0-1.49-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.3V22H7.74V8z" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m3 6.5 8.4 6.2a1.7 1.7 0 0 0 2.2 0L22 6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.02 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.26 4.86L2 22l5.32-1.4a9.9 9.9 0 0 0 4.7 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.53 2 12.02 2zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.15.83.84-3.07-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.55 3.71-8.25 8.28-8.25 2.21 0 4.28.86 5.85 2.42a8.2 8.2 0 0 1 2.42 5.84c0 4.55-3.71 8.26-8.28 8.26z" />
    </svg>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: string;
  onToggle: () => void;
}) {
  const isDark = theme === "dark";
  const slot =
    "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={onToggle}
      className={`flex shrink-0 w-16 h-8 p-1 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] ${
        isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <span className="flex justify-between items-center w-full">
        <span
          className={`${slot} ${isDark ? "translate-x-0 bg-zinc-800" : "translate-x-8 bg-gray-200"}`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          )}
        </span>
        <span
          className={`${slot} ${isDark ? "bg-transparent" : "-translate-x-8"}`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          )}
        </span>
      </span>
    </button>
  );
}

function Nav({
  theme,
  onToggleTheme,
}: {
  theme: string;
  onToggleTheme: () => void;
}) {
  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 px-6 py-3 rounded-full border border-[var(--pf-card-border)] bg-[var(--pf-glass-bg)] backdrop-blur-md shadow-[0_8px_30px_var(--pf-shadow)]">
        <a
          href="#top"
          className="text-lg font-black tracking-tight shrink-0 text-[var(--pf-fg)]"
        >
          Abdullah Azmi<span style={{ color: "var(--pf-accent)" }}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--pf-fg-muted)]">
          {[
            ["Home", "#top"],
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Experience", "#experience"],
            ["Projects", "#projects"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="hover:text-[var(--pf-fg)] transition"
            >
              <RandomLetterSwap label={label} />
            </a>
          ))}
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

// On hover, each letter slides up and is replaced by a copy from below, in random order.
function RandomLetterSwap({
  label,
  stagger = 0.025,
}: {
  label: string;
  stagger?: number;
}) {
  const [scope, animate] = useAnimate();
  const running = useRef(false);

  const swap = async () => {
    if (
      running.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    running.current = true;

    const order = [...label].map((_, i) => i).sort(() => Math.random() - 0.5);
    await Promise.all(
      order.map((i, n) =>
        animate(
          `[data-letter="${i}"]`,
          { y: "-100%" },
          { type: "spring", duration: 0.6, bounce: 0.2, delay: n * stagger },
        ),
      ),
    );
    await animate("[data-letter]", { y: 0 }, { duration: 0 });
    running.current = false;
  };

  return (
    <span
      ref={scope}
      onMouseEnter={swap}
      className="relative inline-flex overflow-hidden"
    >
      <span className="sr-only">{label}</span>
      {[...label].map((letter, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          <span data-letter={i} className="inline-block">
            {letter}
          </span>
          <span
            data-letter={i}
            className="absolute left-0 top-full inline-block"
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

function FlipText({ children }: { children: string }) {
  const letters = children.split("").map((l) => (l === " " ? " " : l));
  const letterClass =
    "inline-block transition-transform duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <span className="group relative inline-block overflow-hidden whitespace-nowrap align-top">
      <span className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className={`${letterClass} group-hover:-translate-y-[110%]`}
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className={`${letterClass} translate-y-[110%] group-hover:translate-y-0`}
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const videoInView = useInView(videoRef);

  // Stop decoding the reel while it is off screen, unless it is playing with sound.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (videoInView) v.play().catch(() => {});
    else if (v.muted) v.pause();
  }, [videoInView]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.muted) {
      v.muted = false;
      v.currentTime = v.currentTime || 0;
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.muted = true;
      setPlaying(false);
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 px-6"
    >
      <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
          >
            Hi, I'm <FlipText>Abdullah Azmi</FlipText>,
            <br />
            <span style={{ color: "var(--pf-accent)" }}>AI Engineer</span> &
            Full Stack Developer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="mt-6 max-w-xl text-base md:text-lg text-[var(--pf-fg-muted)]"
          >
            I build intelligent, scalable applications blending AI, modern web
            frameworks, and clean full-stack architecture.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <WebShotLink href="#projects" variant="solid">
              View My Work
            </WebShotLink>
            <WebShotLink href="#contact">Contact Me</WebShotLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="relative w-full h-[70vh] lg:h-[85vh] rounded-3xl overflow-hidden border border-[var(--pf-card-border)] shadow-[0_15px_40px_var(--pf-shadow-xl)]"
        >
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <button
            onClick={togglePlay}
            aria-label={playing ? "Mute reel" : "Play reel with sound"}
            className="absolute bottom-5 right-5 flex flex-col items-center gap-1.5 group"
          >
            <span className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              {playing ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polygon
                    points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                    fill="currentColor"
                    stroke="none"
                  />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polygon
                    points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                    fill="currentColor"
                    stroke="none"
                  />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[var(--pf-fg-dim)] uppercase">
              {playing ? "" : ""}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ABOUT                                                             */
/* ------------------------------------------------------------------ */
function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-40 px-6 overflow-hidden"
      style={{ background: "var(--pf-accent)" }}
    >
      <motion.div
        aria-hidden
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <div className="absolute -top-56 -left-56 w-[800px] h-[800px] bg-[radial-gradient(closest-side,rgb(0_0_0/0.2),transparent)]" />
        <div className="absolute -bottom-56 -right-56 w-[800px] h-[800px] bg-[radial-gradient(closest-side,rgb(255_255_255/0.2),transparent)]" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="md:sticky md:top-32">
          <div className="w-full h-[70vh] lg:h-[85vh] mx-auto rounded-3xl bg-white/85 border-2 border-black/20 overflow-hidden shadow-2xl">
            <img
              src={profilePic}
              alt="Abdullah Azmi"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/85 border border-black/20 flex items-center justify-center hover:bg-white/85 transition"
            >
              <LinkedInIcon className="w-4 h-4" fill="black" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/85 border border-black/20 flex items-center justify-center hover:bg-white/85 transition"
            >
              <GithubIcon className="w-4 h-4" fill="black" />
            </a>
          </div>
        </div>

        <div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] uppercase text-white/65 mb-4"
          >
            About Me
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[0.95]"
          >
            Engineer.
            <br />
            Builder.
            <br />
            <span className="text-black">Problem-solver.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-white/95 leading-relaxed"
          >
            As an{" "}
            <span className="font-black text-black">
              AI Engineer & Software developer{" "}
            </span>{" "}
            I work under Artificial Intelligence, software engineering, and
            applied research. I have experience in developing scalable, data
            driven, and machine learning algorithem applications. I enjoy
            experimenting with new technologies, and finding smarter ways to
            solve complex challenges.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-xl md:text-2xl font-black text-white"
          >
            Always learning, always building, always shipping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { k: "IEEE", v: "Member" },
              { k: "2×", v: "Hackathon Wins" },
              { k: "10+", v: "Shipped Projects" },
            ].map((s) => (
              <div
                key={s.v}
                className="p-4 rounded-2xl bg-white/98 border border-black/20 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-black">
                  {s.k}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-black/60 mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* TECH MARQUEE                                                      */
/* ------------------------------------------------------------------ */
const marqueeTech = [
  "Python",
  "TypeScript",
  "JavaScript",
  "SQL",
  "React",
  "Next.js",
  "Node.js",
  "TensorFlow",
  "Scikit-learn",
  "LangChain",
  "LangFlow",
  "LLaMA",
  "Gemini",
  "Pandas",
  "NumPy",
  "PyQt5",
  "FastAPI",
  "Firebase",
  "Supabase",
  "MongoDB",
  "MySQL",
  "AWS",
  "GCP",
  "Docker",
  "Git",
];

function TechMarquee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      className="relative py-16 bg-[var(--pf-bg)] border-y border-[var(--pf-line)] overflow-hidden"
    >
      <div
        className="tech-marquee flex gap-12 whitespace-nowrap text-4xl md:text-6xl font-black tracking-tight"
        style={{ animationPlayState: inView ? "running" : "paused" }}
      >
        {[...marqueeTech, ...marqueeTech].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-[var(--pf-fg-dim)] hover:text-[var(--pf-fg)] transition">
              {t}
            </span>
            <span style={{ color: "var(--pf-accent)" }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SKILLS                                                            */
/* ------------------------------------------------------------------ */
const skillGroups = [
  {
    title: "AI / ML",
    subtitle: "Core expertise",
    items: [
      { name: "Python", pct: 92 },
      { name: "TensorFlow", pct: 82 },
      { name: "PyTorch", pct: 80 },
      { name: "Scikit-learn", pct: 86 },
      { name: "LangChain", pct: 88 },
      { name: "LLM Fine-tuning", pct: 90 },
      { name: "Data Pipeline Management", pct: 88 },
      { name: "AI Agents", pct: 82 },
      { name: "RAG Systems", pct: 84 },
      { name: "Dataset Preparation", pct: 80 },
    ],
  },
  {
    title: "Languages & Full Stack",
    subtitle: "Code to deployment",
    items: [
      { name: "MERN Stack", pct: 90 },
      { name: "Python", pct: 88 },
      { name: "Django", pct: 88 },
      { name: "SQL", pct: 88 },
      { name: "PHP", pct: 72 },
      { name: "Tkinter", pct: 88 },
      { name: "FastAPI", pct: 88 },
      { name: "Flask", pct: 88 },
    ],
  },
  {
    title: "Research",
    subtitle: "Applied research skills",
    items: [
      { name: "Critical Thinking and Problem-Solving", pct: 86 },
      { name: "Data Visualization", pct: 82 },
      { name: "Study of Decision Support Systems", pct: 80 },
      { name: "Literature Review", pct: 84 },
      { name: "Experimental Design", pct: 78 },
      { name: "Porject management", pct: 82 },
    ],
  },
  {
    title: "Data & Cloud",
    subtitle: "Scale & insight",
    items: [
      { name: "Pandas / NumPy", pct: 90 },
      { name: "PyQt5 / Matplotlib", pct: 84 },
      { name: "Chart.js", pct: 76 },
      { name: "Tableau", pct: 74 },
      { name: "Power BI", pct: 74 },
      { name: "AWS", pct: 78 },
      { name: "GCP", pct: 76 },
      { name: "Azure", pct: 76 },
      { name: "Docker / Kubernetes", pct: 80 },
      { name: "Git / GitHub", pct: 85 },
    ],
  },
];

function SkillChip({ name, i }: { name: string; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: i * 0.03 }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--pf-accent-border)] bg-[var(--pf-accent-soft)] text-[var(--pf-fg)] text-sm font-medium whitespace-nowrap transition-colors"
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: "var(--pf-accent)" }}
      />
      {name}
    </motion.span>
  );
}

function SkillCard({
  group,
  index,
}: {
  group: (typeof skillGroups)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative rounded-3xl border border-[var(--pf-card-border)] bg-[var(--pf-card-bg)] p-6 md:p-8 overflow-hidden group hover:border-[var(--pf-accent-border)] transition break-inside-avoid mb-6"
    >
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-64 h-64 opacity-10 group-hover:opacity-20 transition"
        style={{
          background:
            "radial-gradient(closest-side, var(--pf-accent), transparent)",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black mb-3"
              style={{
                background: "var(--pf-accent)",
                color: "var(--pf-text-on-accent)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              {group.title}
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-fg-dim)] mt-1">
              {group.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {group.items.map((s, i) => (
            <SkillChip key={s.name} name={s.name} i={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 bg-[var(--pf-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
          >
            Skills
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            My <span style={{ color: "var(--pf-accent)" }}>technical</span>{" "}
            arsenal
          </motion.h2>
          <p className="mt-6 text-[var(--pf-fg-subtle)] text-lg">
            A competency map of the languages, frameworks, and platforms I use
            to Excel at my work as an Engineer.
          </p>
        </div>

        <div className="md:columns-2 gap-6">
          {skillGroups.map((g, i) => (
            <SkillCard key={g.title} group={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS                                                             */
/* ------------------------------------------------------------------ */
const processSteps = [
  {
    n: "01",
    title: "Research",
    body: "I start by understanding goals, user requirements, and technical constraints to lay a rock-solid foundation for the project.",
  },
  {
    n: "02",
    title: "Design",
    body: "Crafting clean architecture, intuitive interfaces, and pixel-perfect wireframes that guarantee an engaging and accessible user experience.",
  },
  {
    n: "03",
    title: "Develop",
    body: "Building scalable backends and responsive frontends using modern tech stacks and best practices.",
  },
  {
    n: "04",
    title: "Deploy",
    body: "Rigorous testing, performance optimization, and seamless deployment to cloud infrastructure, followed by ongoing feedback.",
  },
];

const cardPositions = [
  { top: "11.8%", left: "67.3%", rotate: 5 },
  { top: "35.8%", left: "12%", rotate: -5 },
  { top: "59.8%", left: "67.3%", rotate: 4 },
  { top: "83.8%", left: "12%", rotate: -3 },
];

const CURVE_D = "M 69 13 L 22 37 L 69 61 L 22 85";

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.3"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section
      id="process"
      className="relative bg-[var(--pf-bg)] text-[var(--pf-fg)] py-28 md:py-36 px-6 overflow-hidden border-t border-[var(--pf-line)]"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--pf-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--pf-grid) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <div ref={ref} className="max-w-6xl mx-auto relative md:h-[1350px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="md:absolute top-10 left-0 md:w-[460px] z-20 mb-16 md:mb-0"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            Here's how I turn ideas into{" "}
            <span style={{ color: "var(--pf-accent)" }}>real-world</span>{" "}
            applications
          </h2>
        </motion.div>

        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 85 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={CURVE_D}
            fill="none"
            stroke="var(--pf-line)"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth="2"
          />
          <motion.path
            d={CURVE_D}
            fill="none"
            stroke="var(--pf-accent)"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth="2.5"
            style={{ pathLength }}
          />
          {[
            [69, 13],
            [22, 37],
            [69, 61],
            [22, 85],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="2.5"
              fill="var(--pf-accent)"
              stroke="var(--pf-bg)"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[repeating-linear-gradient(to_bottom,var(--pf-line)_0_6px,transparent_6px_12px)] z-0" />

        <div className="flex flex-col gap-8 items-center md:block z-10 w-full">
          {processSteps.map((s, i) => (
            <div
              key={s.n}
              className="md:absolute"
              style={{ top: cardPositions[i].top, left: cardPositions[i].left }}
            >
              <ProcessCard
                step={s}
                rotate={cardPositions[i].rotate}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  rotate,
  index,
}: {
  step: (typeof processSteps)[number];
  rotate: number;
  index: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ scale: 1.03 }}
      className="w-72 sm:w-80 rounded-[2rem] p-2 relative flex flex-col items-center z-10 bg-[var(--pf-card-bg)] border border-[var(--pf-card-border)] shadow-[0_15px_40px_var(--pf-shadow-xl)] hover:border-[var(--pf-accent-border)] transition-colors duration-700"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="w-5 h-5 rounded-full absolute top-4 border z-10 transition-colors duration-700"
        style={{
          background: hover ? "var(--pf-accent)" : "var(--pf-card-bg)",
          borderColor: hover ? "var(--pf-accent)" : "var(--pf-glass-border)",
        }}
      />
      <div
        className="w-full rounded-[1.5rem] mt-8 p-8 flex flex-col min-h-[220px] transition-colors duration-700 border"
        style={{
          backgroundColor: hover ? "var(--pf-accent)" : "var(--pf-card-bg)",
          borderColor: hover ? "var(--pf-accent)" : "var(--pf-card-border)",
        }}
      >
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black mb-4 transition-colors duration-700"
          style={{
            background: hover ? "var(--pf-bg)" : "var(--pf-accent)",
            color: hover ? "var(--pf-fg)" : "var(--pf-text-on-accent)",
          }}
        >
          {step.n}
        </span>
        <h3
          className="text-2xl font-black mb-3 tracking-tight transition-colors duration-700"
          style={{ color: "var(--pf-fg)" }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm leading-relaxed font-medium transition-colors duration-700"
          style={{ color: hover ? "rgba(0,0,0,0.9)" : "var(--pf-fg-subtle)" }}
        >
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* EXPERIENCE                                                          */
/* ------------------------------------------------------------------ */
const experiences = [
  {
    period: "Jun 2025 — Dec 2025",
    role: "Python Developer Intern",
    org: "CANDLESTROKES TECHNOLOGIES PVT LTD",
    body: "Built an intelligent Python + PyQt5 desktop application for real-time Indian equities analysis. Streamed live and historical market data, engineered technical indicators (MA, RSI, MACD), and visualized market trends to help investors make smarter, data-driven decisions.",
    tech: ["Python", "PyQt5", "Pandas", "NumPy", "PyQtGraph"],
  },
  {
    period: "Oct 2025 — July 2026",
    role: "Operations & Logistics Lead",
    org: "GDG On Campus · Integral University",
    body: "Led operations, logistics, and event coordination for Google Developer Group activities on campus — from developer workshops to community meetups, ensuring smooth delivery for hundreds of student developers.",
    tech: ["Leadership", "Event Ops", "Community"],
  },
  {
    period: "6 Nov 2025",
    role: "Hackathon Winner",
    org: "Internal SIH - Integral University, Lucknow",
    body: "Won 1st place in the Internal Smart India Hackathon (SIH). Designed, developed, and presented a fully functional prototype with a collaborative team, delivering an innovative solution within the hackathon timeline.",
    tech: ["Ideation & Development", "Team Presentation", "Team Work"],
  },
  {
    period: "23 Apr 2026",
    role: "Article Publish",
    org: "Department of Computer Science & Engineering - Integral University, Lucknow",
    body: "Authored and published The Art of Prompting article in the Department of Computer Science Annual magazine, exploring prompt engineering practices and their important techniques which can bring real change in AI driven workflows.",
    tech: ["Research & Analysis", "Literature Work", "Writing & Publishing"],
  },
  {
    period: "30 Jan 2026",
    role: "Hackathon Winner",
    org: "HackVeda × IBM × AWS — ILM University, Greater Noida",
    body: "Won the HackVeda National Level Hackathon organized in collaboration with IBM and AWS. Designed, built, and pitched a full working prototype under a tight 24-hour build window with my team.",
    tech: ["Full Stack", "AI/ML", "Team Leadership"],
  },
];

function ExperienceArrowButton({ href }: { href?: string }) {
  const content = (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group/arrow relative shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border border-[var(--pf-card-border)] bg-[var(--pf-card-bg)] flex items-center justify-center overflow-hidden transition-colors duration-300 hover:border-transparent"
      aria-label="View details"
    >
      <span
        className="absolute inset-0 scale-0 rounded-full transition-transform duration-300 ease-out group-hover/arrow:scale-100"
        style={{ background: "var(--pf-accent)" }}
      />
      <ArrowUpRight
        className="relative w-5 h-5 text-[var(--pf-fg)] transition-all duration-300 group-hover/arrow:text-[var(--pf-bg)] group-hover/arrow:rotate-45"
        strokeWidth={2.25}
      />
    </motion.button>
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.4", "end 0.6"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      className="relative py-32 px-6 bg-[var(--pf-bg)] border-t border-[var(--pf-line)]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
          >
            Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            Where I've <span style={{ color: "var(--pf-accent)" }}>built</span>{" "}
            & led
          </motion.h2>
        </div>

        <div ref={ref} className="relative pl-8 md:pl-16">
          <div className="absolute left-2 md:left-6 top-0 bottom-0 w-[2px] bg-[var(--pf-line)]" />
          <motion.div
            style={{ height: lineHeight, background: "var(--pf-accent)" }}
            className="absolute left-2 md:left-6 top-0 w-[2px]"
          />

          <div className="space-y-16">
            {experiences.map((e, i) => (
              <motion.div
                key={e.role + i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div
                  className="absolute -left-8 md:-left-16 top-2 w-4 h-4 rounded-full ring-4 ring-[var(--pf-bg)]"
                  style={{ background: "var(--pf-accent)" }}
                />
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs tracking-[0.2em] uppercase font-semibold"
                      style={{ color: "var(--pf-accent)" }}
                    >
                      {e.period}
                    </div>
                    <h3 className="mt-2 text-2xl md:text-3xl font-black">
                      {e.role}
                    </h3>
                    <p className="text-sm text-[var(--pf-fg-subtle)] mt-1">
                      {e.org}
                    </p>
                    <p className="mt-4 text-[var(--pf-fg-muted)] leading-relaxed max-w-2xl">
                      {e.body}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {e.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1 rounded-full border border-[var(--pf-card-border)] text-[var(--pf-fg-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ExperienceArrowButton
                    href={
                      i === 0
                        ? "https://drive.google.com/file/d/1S5PJjtt_vX1GAffsJ8DN5LJ62z7A_qB7/view?usp=sharing"
                        : i === 1
                          ? "https://www.linkedin.com/posts/gdgc-googledevelopergroups-gdgciul-ugcPost-7379898750208561152-63zW/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFkvQK4BR4aRkUAaxrtxsgKquxDlboRyJRo"
                          : i === 2
                            ? "https://www.linkedin.com/posts/abdullahslash_sih-smartindiahackathon-integraluniversity-ugcPost-7393330395666255873-P7DO/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFkvQK4BR4aRkUAaxrtxsgKquxDlboRyJRo"
                            : i === 3
                              ? "https://heyzine.com/flip-book/866962fcb7.html#page/28"
                              : "https://www.linkedin.com/posts/abdullahslash_grateful-for-this-win-proud-to-share-ugcPost-7424507956400033793-vqri/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFkvQK4BR4aRkUAaxrtxsgKquxDlboRyJRo"
                    }
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROJECTS                                                            */
/* ------------------------------------------------------------------ */

const projects = [
  {
    n: "01",
    tag: "Healthcare · Custom AI",
    name: "NaturalHealer",
    subtitle: "Empowering wellness through nature",
    body: "A full-stack AI-powered wellness platform delivering personalized health guidance. Combines structured healthcare datasets with domain-specific knowledge and intelligent recommendation workflows to generate contextual, actionable insights for users.",
    tech: ["Python", "React", "Next.js", "Firebase", "LangFlow", "LLaMA"],
    live: "https://natural-healer.vercel.app/",
    image: naturalHealerShot,
  },
  {
    n: "02",
    tag: "MCP Connector · Idea Evaluation",
    name: "Idea-Evaluator",
    subtitle: "Project ideas, marked like an exam answer",
    body: "A Model Context Protocol tool designed to plug into your everyday AI assistant such as ChatGPT, Claude, Gemini, or Cursor and act as an Idea-Evaluator with your AI and help you to test your ideas, brainstorm better, research more, have a bigger context window and provide broader and grounded answers.",
    tech: [
      "Next.js",
      "TypeScript",
      "MCP",
      "Gemini",
      "Upstash Redis",
      "Tailwind CSS",
    ],
    live: "https://idea-evaluator-slash.vercel.app/",
    image: ideaEvaluatorShot,
  },
  {
    n: "03",
    tag: "Desktop · Fintech",
    name: "Financial Digital Twin",
    subtitle: "Real-time Advisory system",
    body: "AI powered personal finance platform that creates a Digital Financial Twin to simulate financial decisions before they happen. Uses spending behavior, financial goals, and predictive analytics to help users compare scenarios and make smarter, data driven financial decisions.",
    tech: ["Python", "MongoDB", "Pandas", "NumPy", "PyQtGraph", "Scikit Learn"],
    live: "https://finance-twin.vercel.app/",
    image: financeTwinShot,
  },
];

type Project = (typeof projects)[number] & { live?: string; image?: string };

const PREVIEW_W = 320;
const PREVIEW_H = 200;

type PreviewApi = { show: (index: number | null) => void };

/*
 * Floating preview that trails the pointer while a project card is hovered.
 * Driven straight through the DOM (no React state), so hovering never re-renders the cards.
 */
function ProjectPreview({ api }: { api: RefObject<PreviewApi | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const box = boxRef.current;
    if (!el || !box) return;
    const layers = [...box.querySelectorAll<HTMLElement>("[data-layer]")];
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let active: number | null = null;
    let raf = 0;

    const place = () => {
      // Flip to the left of the pointer when there is no room on the right.
      const x =
        pos.x + 20 + PREVIEW_W > window.innerWidth - 16
          ? pos.x - PREVIEW_W - 20
          : pos.x + 20;
      el.style.transform = `translate3d(${x}px, ${pos.y - 100}px, 0)`;
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.35;
      pos.y += (target.y - pos.y) * 0.35;
      place();
      raf =
        Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // While hidden, jump straight to the pointer so it never flies in from the last spot.
      if (active === null) {
        pos.x = target.x;
        pos.y = target.y;
        place();
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    api.current = {
      show(index) {
        if (index === active) return;
        active = index;
        box.dataset.visible = String(index !== null);
        layers.forEach((layer, i) => (layer.dataset.on = String(i === index)));
      },
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      api.current = null;
    };
  }, [api]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 hidden will-change-transform [@media(pointer:fine)]:block"
    >
      <div
        ref={boxRef}
        data-visible="false"
        className="relative overflow-hidden rounded-xl border border-[var(--pf-card-border)] bg-[var(--pf-bg)] shadow-2xl opacity-0 scale-90 transition-[opacity,scale] duration-150 ease-out data-[visible=true]:opacity-100 data-[visible=true]:scale-100"
        style={{ width: PREVIEW_W, height: PREVIEW_H }}
      >
        {(projects as Project[]).map((p) => {
          const layer =
            "absolute inset-0 opacity-0 scale-105 transition-[opacity,scale] duration-200 ease-out data-[on=true]:opacity-100 data-[on=true]:scale-100";
          return p.image ? (
            <img
              key={p.name}
              data-layer
              src={p.image}
              alt=""
              decoding="async"
              className={`${layer} h-full w-full object-cover object-top`}
            />
          ) : (
            <div
              key={p.name}
              data-layer
              className={`${layer} flex flex-col justify-end p-6`}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--pf-fg-subtle)]">
                {p.tag}
              </span>
              <span
                className="mt-2 text-3xl font-black leading-[0.95] tracking-tight"
                style={{ color: "var(--pf-accent)" }}
              >
                {p.name}
              </span>
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}

function Projects() {
  const preview = useRef<PreviewApi | null>(null);

  return (
    <section
      id="projects"
      className="relative bg-[var(--pf-bg)] border-t border-[var(--pf-line)]"
    >
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
        >
          Selected Work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
        >
          Projects that <span style={{ color: "var(--pf-accent)" }}>ship</span>
        </motion.h2>
        <p className="mt-6 max-w-2xl text-[var(--pf-fg-subtle)] text-lg">
          Real products, real impact — each one built end-to-end with production
          engineering practices.
        </p>
      </div>

      <div className="relative">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.name}
            project={p}
            index={i}
            total={projects.length}
            onHover={(on) => preview.current?.show(on ? i : null)}
          />
        ))}
      </div>
      <ProjectPreview api={preview} />
      <GithubActivity />
    </section>
  );
}

// Public, keyless mirror of the GitHub contribution calendar (CORS-enabled).
const CONTRIBUTIONS_URL =
  "https://github-contributions-api.jogruber.de/v4/IAbdullahSlash";
// First year with contributions on the profile.
const FIRST_ACTIVITY_YEAR = 2023;
// "Last 12 months", then every finished year back to the first one; a new year shows up on its own.
const ACTIVITY_PERIODS = [
  "last",
  ...Array.from(
    { length: Math.max(0, new Date().getFullYear() - FIRST_ACTIVITY_YEAR) },
    (_, i) => String(new Date().getFullYear() - 1 - i),
  ),
];
type ActivityPeriod = string;

function GithubActivity() {
  const [period, setPeriod] = useState<ActivityPeriod>("last");
  // The period on screen; it only changes once that period's data has arrived, so the chart never blanks.
  const [shown, setShown] = useState<{
    period: ActivityPeriod;
    data: ContributionDay[];
  } | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<"2d" | "3d">("3d");
  const cache = useRef(new Map<ActivityPeriod, ContributionDay[]>());
  // Fetch and build the chart only once the visitor gets close to it.
  const rootRef = useRef<HTMLDivElement>(null);
  const near = useInView(rootRef, { once: true, margin: "800px" });

  useEffect(() => {
    if (!near) return;
    const cached = cache.current.get(period);
    if (cached) {
      setShown({ period, data: cached });
      return;
    }
    const ctrl = new AbortController();
    fetch(`${CONTRIBUTIONS_URL}?y=${period}`, { signal: ctrl.signal })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((d: { contributions: ContributionDay[] }) => {
        const days = d.contributions.map(({ date, count }) => ({
          date,
          count,
        }));
        cache.current.set(period, days);
        setShown({ period, data: days });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setFailed(true);
      });
    return () => ctrl.abort();
  }, [period, near]);

  // Rather show nothing than an empty or fake graph.
  if (failed) return null;

  const isYear = shown && shown.period !== "last";
  const loading = shown?.period !== period;

  return (
    <div ref={rootRef} className="max-w-6xl mx-auto px-6 pt-20 pb-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-5">
            GitHub Activity
          </span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-[0.95]">
            Shipping,{" "}
            <span style={{ color: "var(--pf-accent)" }}>all the time</span>
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div
            role="group"
            aria-label="Contribution period"
            className="inline-flex flex-wrap rounded-full border border-[var(--pf-card-border)] p-1"
          >
            {ACTIVITY_PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tabular-nums transition ${
                  period === p
                    ? "bg-[var(--pf-fg)] text-[var(--pf-bg)]"
                    : "text-[var(--pf-fg-muted)] hover:text-[var(--pf-fg)]"
                }`}
              >
                {p === "last" ? "Last 12 months" : p}
              </button>
            ))}
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--pf-fg-muted)] hover:text-[var(--pf-fg)] transition"
          >
            View GitHub profile
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      {shown ? (
        <div
          className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {/* Keyed by period so each year rises out of the flat map again. */}
          <ContributionSkyline
            key={shown.period}
            data={shown.data}
            endDate={isYear ? `${shown.period}-12-31` : undefined}
            view={view}
            onViewChange={setView}
            streakLabel={isYear ? "Year-end streak" : "Current streak"}
            title={
              isYear ? (
                <>
                  <span className="font-semibold tabular-nums">
                    {shown.data
                      .reduce((sum, d) => sum + d.count, 0)
                      .toLocaleString("en-US")}
                  </span>{" "}
                  contributions in {shown.period}
                </>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="h-[320px] rounded-3xl border border-[var(--pf-card-border)] bg-[var(--pf-card-bg)] animate-pulse" />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  onHover,
}: {
  project: Project;
  index: number;
  total: number;
  onHover: (on: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.4, 1, 1, 0.4],
  );
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div
      ref={ref}
      className="sticky px-6"
      style={{ top: `${80 + index * 24}px`, zIndex: 10 + index }}
    >
      <motion.article
        style={{
          scale,
          opacity,
          y,
          background: "var(--pf-accent)",
          borderColor: "rgba(0,0,0,0.2)",
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
        onPointerLeave={() => onHover(false)}
        className="group max-w-6xl mx-auto my-6 rounded-3xl border p-8 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-end shadow-[0_15px_40px_var(--pf-shadow-xl)]"
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--pf-accent)] text-[var(--pf-text-on-accent)]">
              {project.tag}
            </span>
            <span className="text-xs uppercase tracking-widest text-[var(--pf-text-on-accent-muted)]">
              Project {project.n} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <h3 className="inline-flex items-center gap-3 text-4xl md:text-6xl font-black tracking-tight leading-[0.95] text-white">
            <span className="relative inline-block">
              {project.name}
              <span className="absolute left-0 -bottom-1 h-[3px] w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              aria-hidden
              className="h-8 w-8 md:h-12 md:w-12 shrink-0 opacity-0 -translate-x-2 translate-y-2 transition-[opacity,translate] duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </h3>
          <p className="mt-3 text-lg md:text-xl font-medium text-[var(--pf-text-on-accent)]">
            {project.subtitle}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-[var(--pf-text-on-accent)]/95">
            {project.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full border border-black/30 text-black bg-black/5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex md:flex-col gap-3 md:items-end">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition bg-[var(--pf-bg)] text-[var(--pf-fg)] hover:opacity-90"
            >
              Live Demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="px-5 py-2 rounded-full text-sm font-semibold bg-[var(--pf-bg)] text-[var(--pf-fg)] opacity-60 cursor-not-allowed">
              Under Maintenance
            </span>
          )}
        </div>
      </motion.article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS                                                        */
/* ------------------------------------------------------------------ */
type AchievementPhoto = { src: string; alt: string };

type Milestone = {
  tag: string;
  title: string;
  org: string;
  body: string;
  photos?: AchievementPhoto[];
  source?: string;
  link?: string;
};

const achievements: Milestone[] = [
  {
    tag: "Winner",
    title: "HackVeda National Hackathon",
    org: "ILM University · IBM × AWS",
    body: "Winner of the HackVeda National Level Hackathon organised in collaboration with IBM and AWS.",
    photos: [
      { src: hackvedaTeam, alt: "HackVeda team outside the event venue" },
      { src: hackvedaWinner, alt: "HackVeda winner certificate held outdoors" },
      {
        src: hackvedaWork,
        alt: "Team working together during the HackVeda hackathon",
      },
      { src: hackvedaCertificate, alt: "HackVeda winner certificate" },
    ],
  },
  {
    tag: "Winner",
    title: "Smart India Hackathon — Internal",
    org: "Integral University",
    body: "Winner of the Smart India Hackathon internal edition at Integral University.",
    photos: [
      {
        src: smartIndiaTeam,
        alt: "Smart India Hackathon internal winning team",
      },
    ],
  },
  {
    tag: "Lead",
    title: "GDG On Campus — Operations Lead",
    org: "Integral University",
    body: "Operations & Logistics Lead for Google Developer Group on Campus, coordinating community events and workshops.",
    photos: [{ src: gdgTeam, alt: "GDG On Campus operations team" }],
  },
];

const publications: Milestone[] = [
  {
    tag: "Published",
    title: "The Art of Prompting",
    org: "Department of Computer Science — Integral University",
    body: 'Authored and published an article on prompt engineering in the department\'s annual magazine "To The Horizon".',
    source: "To The Horizon",
    link: "https://heyzine.com/flip-book/866962fcb7.html#page/29",
  },
  {
    tag: "Article",
    title: "How to Build a Chatbot Wrapper?",
    org: "Substack · abdullahslash",
    source: "Substack",
    body: "A hands-on guide to building a chatbot wrapper on top of an LLM API.",
    link: "https://abdullahslash.substack.com/p/how-to-build-a-chatbot-wrapper?r=7vzbv6",
  },
];

function AchievementPhotoGallery({
  achievement,
  photos,
  activePhoto,
  setActivePhoto,
}: {
  achievement: Milestone;
  photos: AchievementPhoto[];
  activePhoto: number | null;
  setActivePhoto: Dispatch<SetStateAction<number | null>>;
}) {
  const showPreviousPhoto = () => {
    setActivePhoto((current) =>
      current === null ? 0 : (current - 1 + photos.length) % photos.length,
    );
  };

  const showNextPhoto = () => {
    setActivePhoto((current) =>
      current === null ? 0 : (current + 1) % photos.length,
    );
  };

  const isOpen = activePhoto !== null;
  const photoCount = photos.length;

  useEffect(() => {
    if (!isOpen) return;
    const step = (by: number) =>
      setActivePhoto((current) =>
        current === null ? 0 : (current + by + photoCount) % photoCount,
      );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, photoCount, setActivePhoto]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 -mx-2 -mt-2 mb-7">
        {photos.map((photo, photoIndex) => (
          <div
            key={photo.src}
            tabIndex={0}
            role="button"
            aria-label={`Open ${achievement.title} photo ${photoIndex + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              setActivePhoto(photoIndex);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActivePhoto(photoIndex);
              }
            }}
            className={`group/photo relative cursor-zoom-in overflow-hidden rounded-xl border border-[var(--pf-card-border)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] ${
              photos.length === 1 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover/photo:scale-105"
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--pf-bg)]/85 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${achievement.title} photos`}
            onClick={(event) => {
              // Keep the click from reaching the card, which would reopen the popup.
              event.stopPropagation();
              setActivePhoto(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl rounded-3xl border border-[var(--pf-card-border)] bg-[var(--pf-bg)] p-3 shadow-[0_15px_40px_var(--pf-shadow-xl)] md:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label={`Close ${achievement.title} photos`}
                onClick={() => setActivePhoto(null)}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pf-glass-bg)] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative overflow-hidden rounded-2xl bg-[var(--pf-card-bg)]">
                <img
                  src={photos[activePhoto].src}
                  alt={photos[activePhoto].alt}
                  className="max-h-[62vh] min-h-[280px] w-full object-contain md:min-h-[420px]"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous achievement photo"
                      onClick={showPreviousPhoto}
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--pf-glass-bg)] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next achievement photo"
                      onClick={showNextPhoto}
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--pf-glass-bg)] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="mt-4 border-t border-[var(--pf-card-border)] px-2 pb-2 pt-5 md:px-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--pf-accent-soft)]">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: "var(--pf-accent)",
                          boxShadow: "0 0 14px var(--pf-accent-glow)",
                        }}
                      />
                      {achievement.tag}
                    </div>
                    <h3 className="max-w-2xl text-2xl font-black leading-[0.95] tracking-tight text-[var(--pf-fg)] md:text-4xl">
                      {achievement.title}
                    </h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--pf-fg)]">
                      {achievement.org}
                    </p>
                  </div>
                  <span className="rounded-full border border-[var(--pf-card-border)] px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[var(--pf-fg-dim)]">
                    {String(activePhoto + 1).padStart(2, "0")} /{" "}
                    {String(photos.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <p
                    className="max-w-2xl border-l-2 pl-4 text-sm leading-relaxed text-[var(--pf-fg-muted)]"
                    style={{ borderColor: "var(--pf-accent)" }}
                  >
                    {achievement.body}
                  </p>
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--pf-accent-border)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] hover:text-[var(--pf-text-on-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
                    >
                      Read
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MilestoneCard({ item, index }: { item: Milestone; index: number }) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={(event) => {
        if (!item.photos || (event.target as Element).closest("a")) return;
        setActivePhoto(0);
      }}
      className={`glow-card p-8 rounded-3xl border border-[var(--pf-card-border)] transition ${
        item.photos ? "cursor-pointer" : ""
      }`}
    >
      <div aria-hidden className="glow-card-halo" />
      {item.photos ? (
        <AchievementPhotoGallery
          achievement={item}
          photos={item.photos}
          activePhoto={activePhoto}
          setActivePhoto={setActivePhoto}
        />
      ) : (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`Read ${item.title}`}
          className="group/cover -mx-2 -mt-2 mb-7 flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-xl border border-black/20 bg-[var(--pf-accent)] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
        >
          <span className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-[var(--pf-text-on-accent-muted)]">
            {item.source}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:translate-x-1" />
          </span>
          <span className="text-3xl md:text-4xl font-black leading-[0.95] tracking-tight text-white">
            {item.title}
          </span>
        </a>
      )}
      <div
        className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: "var(--pf-accent)" }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: "var(--pf-accent)",
            boxShadow: "0 0 14px var(--pf-accent-glow)",
          }}
        />
        {item.tag}
      </div>
      <h3 className="text-xl font-black mb-2 leading-tight text-[var(--pf-fg)]">
        {item.title}
      </h3>
      <p className="text-xs uppercase tracking-widest text-[var(--pf-fg-subtle)] mb-3">
        {item.org}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-[var(--pf-fg-muted)] leading-relaxed">
          {item.body}
        </p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--pf-accent-border)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] hover:text-[var(--pf-text-on-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
          >
            Read
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function MilestoneSection({
  id,
  eyebrow,
  title,
  accent,
  items,
  columns,
}: {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  items: Milestone[];
  columns: string;
}) {
  return (
    <section
      id={id}
      className="relative py-32 px-6 bg-[var(--pf-bg)] border-t border-[var(--pf-line)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            {title} <span style={{ color: "var(--pf-accent)" }}>{accent}</span>
          </motion.h2>
        </div>

        <div className={`grid ${columns} gap-6`}>
          {items.map((item, i) => (
            <MilestoneCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <MilestoneSection
      id="achievements"
      eyebrow="Recognition"
      title="Wins &"
      accent="Milestones"
      items={achievements}
      columns="md:grid-cols-3"
    />
  );
}

function Publications() {
  return (
    <MilestoneSection
      id="publications"
      eyebrow="Writing"
      title="My"
      accent="Publications"
      items={publications}
      columns="md:grid-cols-2"
    />
  );
}

/* ------------------------------------------------------------------ */
/* CERTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */
const certifications = [
  {
    tag: "Certified",
    title: "GH-900 GitHub Foundations Certificate",
    org: "GitHub · Microsoft Learn",
    body: "A certification that validates my Git and GitHub fundamentals, including version control, collaboration, and CI/CD workflows. Basically, the skills behind how I build, collaborate, and ship code.",
    link: "https://learn.microsoft.com/en-us/users/abdullah-1952/credentials/b636c337abd0aeec",
    image: githubFoundationsCert,
  },
  {
    tag: "Certified",
    title: "MongoDB Associate Data Modeler",
    org: "MongoDB · Credly",
    body: "Validates my ability to design MongoDB data models: choosing between embedding and referencing, applying schema design patterns, and modelling data around how an application reads and writes it.",
    link: "https://www.credly.com/badges/f1af7b9b-1d86-45f7-9d3c-f3c951ca03a1/public_url",
    image: mongodbDataModelerCert,
  },
  {
    tag: "Skill Badges",
    title: "Google Skills Profile",
    org: "Google Cloud · Google Skills",
    body: "Completed 25 skill badges across AI, Machine Learning, Cloud, and other Google services, each earned through hands-on labs and challenge assessments.",
    link: "https://www.skills.google/public_profiles/357ec843-643c-4e7e-8d38-4c640348f205",
    cover: { source: "Google Skills", text: "25 Skill Badges" },
  },
];

function Certifications() {
  return (
    <section className="relative py-32 px-6 bg-[var(--pf-bg)] border-t border-[var(--pf-line)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
          >
            Proven Skills
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            Verified{" "}
            <span style={{ color: "var(--pf-accent)" }}>certificates</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glow-card p-8 rounded-3xl border border-[var(--pf-card-border)] transition"
            >
              <div aria-hidden className="glow-card-halo" />
              {c.image && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${c.title}`}
                  className="group/cert block -mx-2 -mt-2 mb-7 overflow-hidden rounded-xl border border-[var(--pf-card-border)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)]"
                >
                  <img
                    src={c.image}
                    alt={`${c.title} issued to Abdullah Azmi`}
                    loading="lazy"
                    className="block w-full h-auto transition duration-500 group-hover/cert:scale-105"
                  />
                </a>
              )}
              {c.cover && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${c.title}`}
                  className="group/cover -mx-2 -mt-2 mb-7 flex aspect-[1345/574] flex-col justify-between overflow-hidden rounded-xl border border-black/20 bg-[var(--pf-accent)] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
                >
                  <span className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-[var(--pf-text-on-accent-muted)]">
                    {c.cover.source}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:translate-x-1" />
                  </span>
                  <span className="text-2xl md:text-3xl font-black leading-[0.95] tracking-tight text-white">
                    {c.cover.text}
                  </span>
                </a>
              )}
              <div
                className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--pf-accent)" }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: "var(--pf-accent)",
                    boxShadow: "0 0 14px var(--pf-accent-glow)",
                  }}
                />
                {c.tag}
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight text-[var(--pf-fg)]">
                {c.title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-[var(--pf-fg-subtle)] mb-3">
                {c.org}
              </p>
              <p className="mt-4 text-sm text-[var(--pf-fg-muted)] leading-relaxed">
                {c.body}
              </p>
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--pf-accent-border)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--pf-fg)] transition hover:bg-[var(--pf-accent)] hover:text-[var(--pf-text-on-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-fg)]"
              >
                Show
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EDUCATION                                                           */
/* ------------------------------------------------------------------ */
const education = [
  {
    period: "Aug 2024 — Present",
    degree: "B.Tech, Computer Science & Engineering",
    org: "Integral University - Department of Computer Science & Engineering",
    note: "Currently in the final year of my Bachelor's in CSE.",
  },
  {
    period: "Aug 2022 — Jun 2024",
    degree: "Diploma, Computer Science & Engineering",
    org: "Integral University - Department of Polytechnic",
    note: "Graduated with a 9.2 CGPA.",
  },
];

function Education() {
  return (
    <section className="relative py-32 px-6 bg-[var(--pf-bg)] border-t border-[var(--pf-line)]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-12">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[var(--pf-card-border)] text-xs tracking-[0.2em] uppercase text-[var(--pf-fg)] mb-6"
          >
            Education
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]"
          >
            The <span style={{ color: "var(--pf-accent)" }}>foundation</span>
          </motion.h2>
        </div>
        <div className="space-y-6">
          {education.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-[var(--pf-card-border)] bg-[var(--pf-card-bg)] hover:bg-[var(--pf-card-bg)] transition"
            >
              <div
                className="text-xs uppercase tracking-widest font-semibold mb-3"
                style={{ color: "var(--pf-accent)" }}
              >
                {e.period}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[var(--pf-fg)]">
                {e.degree}
              </h3>
              <p className="text-sm text-[var(--pf-fg-subtle)] mt-1">{e.org}</p>
              <p className="mt-4 text-[var(--pf-fg-muted)]">{e.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT                                                             */
/* ------------------------------------------------------------------ */
function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  // Curtain reveal: while the section scrolls in, its content holds still on screen,
  // so the page above slides off it instead of the section scrolling up with the page.
  const reduced = useReducedMotion();
  const curtainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: revealProgress } = useScroll({
    target: curtainRef,
    offset: ["start end", "end end"],
  });
  const reveal = useTransform(revealProgress, [0, 1], ["-100%", "0%"]);
  const inView = useInView(ref);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-[var(--pf-bg)] border-t border-[var(--pf-line)] overflow-hidden"
    >
      {/* Behind the whole section, the name included. */}
      <div
        aria-hidden
        className="contact-aurora pointer-events-none absolute left-1/2 top-1/2 h-full w-full"
        style={{ animationPlayState: inView ? "running" : "paused" }}
      />
      <div
        aria-hidden
        className="contact-grid pointer-events-none absolute inset-0"
      />
      <div ref={curtainRef} className="relative overflow-hidden">
        <motion.div
          style={reduced ? undefined : { y: reveal }}
          className="relative pt-40 pb-24 px-6"
        >
          <motion.div
            style={{ y, scale }}
            className="relative max-w-5xl mx-auto text-center"
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-8"
              style={{ color: "var(--pf-accent)" }}
            >
              Let's build something
            </p>
            <h2 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.9]">
              Say
              <br />
              <span style={{ color: "var(--pf-accent)" }}>
                مَرْحَبًا Hello नमस्ते
              </span>
            </h2>
            <p className="mt-10 text-[var(--pf-fg-muted)] max-w-xl mx-auto text-lg">
              Open to internships, freelance builds, and full-time roles in AI &
              Full-Stack engineering. I typically respond within 24–48 hours.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <WebShotLink
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noreferrer"
                size="lg"
                variant="accent"
              >
                <MailIcon className="w-5 h-5" />
                Email me
              </WebShotLink>
              <WebShotLink
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </WebShotLink>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full border border-[var(--pf-card-border)] flex items-center justify-center hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)] transition"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full border border-[var(--pf-card-border)] flex items-center justify-center hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)] transition"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Outside the curtain so it scrolls with the page; cropped by the closing line. */}
      <div className="relative">
        <HalftoneWordmark word="Abdullah Azmi" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    // Just the closing line under the name; no empty bar after it.
    <footer className="border-t border-[var(--pf-line)] bg-[var(--pf-bg)]" />
  );
}
