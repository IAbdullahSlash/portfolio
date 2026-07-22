import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import heroVideo from "@/assets/hero.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abdullah Azmi — AI Engineer & Full Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Abdullah Azmi — AI Engineer & Full Stack Developer building intelligent, scalable applications.",
      },
      { property: "og:title", content: "Abdullah Azmi — AI Engineer & Full Stack Developer" },
      {
        property: "og:description",
        content:
          "AI Engineer & Full Stack Developer. Projects, skills, experience, and contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const GITHUB_URL = "https://github.com/IAbdullahSlash";
const LINKEDIN_URL = "https://www.linkedin.com/in/abdullahslash";
const EMAIL = "abdullahaz7677@gmail.com";
const PHONE = "+91 8756857677";
const MAILTO = `mailto:${EMAIL}?subject=Hiring%20Inquiry%20%E2%80%93%20Portfolio&body=Hello%20Abdullah,%0D%0A%0D%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity%20with%20you.%0D%0A%0D%0ALooking%20forward%20to%20hearing%20from%20you.%0D%0ABest%20Regards,`;
const PROFILE_PIC =
  "https://cdn.phototourl.com/free/2026-07-21-abb6ec45-d13e-42a4-b41f-ad3f2db01d3f.jpg";

const RED = "#ff2a2a";


function Portfolio() {
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white antialiased font-sans selection:bg-[#ff2a2a] selection:text-white overflow-x-hidden">
      <ScrollProgressBar />
      <AnimatePresence>{!introDone && <Intro />}</AnimatePresence>
      <Nav />
      <Hero />
      <About />
      <TechMarquee />
      <Skills />
      <Process />
      <Experience />
      <Projects />
      <Achievements />
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
      style={{ scaleX, background: RED, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[90]"
    />
  );
}

function Intro() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: RED }}
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-black tracking-tight text-white"
      >
        Abdullah Azmi<span className="text-black">.</span>
      </motion.h1>
    </motion.div>
  );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.19 1.18a11.1 11.1 0 0 1 5.81 0c2.22-1.49 3.19-1.18 3.19-1.18.63 1.59.23 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.67.8.56 4.57-1.53 7.86-5.84 7.86-10.93C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.53v14H.24V8zm7.5 0h4.34v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.53v-6.24c0-1.49-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.3V22H7.74V8z" />
    </svg>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-black tracking-tight">
          Abdullah Azmi<span style={{ color: RED }}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          {[
            ["Home", "#top"],
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Experience", "#experience"],
            ["Projects", "#projects"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="hover:text-white transition">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="text-sm font-semibold px-5 py-2 rounded-full border border-white/20 bg-black text-white hover:bg-white hover:text-black transition"
        >
          Hire Me
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
            Hi, I'm Abdullah Azmi,
            <br />
            <span style={{ color: RED }}>AI Engineer</span> & Full Stack Developer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="mt-6 max-w-xl text-base md:text-lg text-white/80"
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
            <a
              href="#projects"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-full border border-white/30 text-sm font-semibold hover:bg-white hover:text-black transition"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="relative w-full h-[70vh] lg:h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
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
            <span className="w-14 h-14 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-white/80 uppercase">
              {playing ? "" : ""}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ABOUT — sticky text + parallax portrait                             */
/* ------------------------------------------------------------------ */
function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 6]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-40 px-6 overflow-hidden"
      style={{ background: RED }}
    >
      <motion.div
        aria-hidden
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-black blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <motion.div style={{ y: yImg, rotate }} className="md:sticky md:top-32">
          <div className="w-full h-[70vh] lg:h-[85vh] mx-auto rounded-3xl bg-black/40 border-2 border-white/30 overflow-hidden shadow-2xl">
            <img
              src={PROFILE_PIC}
              alt="Abdullah Azmi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-black/40 border border-white/30 flex items-center justify-center hover:bg-black transition"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-black/40 border border-white/30 flex items-center justify-center hover:bg-black transition"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] uppercase text-black/80 mb-4"
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
            className="text-lg md:text-xl text-white/95 leading-relaxed"
          >
            As an <span className="font-black text-black">AI Engineer & Software developer </span> I work under Artificial Intelligence, software engineering, and applied research. I have experience in developing scalable, data driven, and machine learning algorithem applications. I enjoy experimenting with new technologies, and finding smarter ways to solve complex challenges.
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
                className="p-4 rounded-2xl bg-black/40 border border-white/20 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-white">
                  {s.k}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/80 mt-1">
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
/* TECH MARQUEE — infinite horizontal scroll                           */
/* ------------------------------------------------------------------ */
const marqueeTech = [
  "Python", "TypeScript", "JavaScript", "SQL", "React", "Next.js", "Node.js",
  "TensorFlow", "Scikit-learn", "LangChain", "LangFlow", "LLaMA", "Gemini",
  "Pandas", "NumPy", "PyQt5", "FastAPI", "Firebase", "Supabase", "MongoDB",
  "MySQL", "AWS", "GCP", "Docker", "Git",
];

function TechMarquee() {
  return (
    <section className="relative py-16 bg-black border-y border-white/5 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="flex gap-12 whitespace-nowrap text-4xl md:text-6xl font-black tracking-tight"
      >
        {[...marqueeTech, ...marqueeTech].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-white/20 hover:text-white transition">{t}</span>
            <span style={{ color: RED }}>✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SKILLS — bento-grid competency map                                  */
/* ------------------------------------------------------------------ */
const skillGroups: {
  title: string;
  subtitle: string;
  featured?: boolean;
  items: { name: string; pct: number }[];
}[] = [
  {
    title: "AI / ML",
    subtitle: "Core expertise",
    featured: true,
    items: [
      { name: "Python", pct: 92 },
      { name: "TensorFlow", pct: 82 },
      { name: "Scikit-learn", pct: 86 },
      { name: "LangChain", pct: 88 },
      { name: "LangFlow", pct: 85 },
      { name: "LLaMA", pct: 80 },
      { name: "Gemini", pct: 88 },
      { name: "LLM Integration", pct: 90 },
    ],
  },
  {
    title: "Languages",
    subtitle: "Daily drivers",
    items: [
      { name: "JavaScript", pct: 90 },
      { name: "TypeScript", pct: 85 },
      { name: "SQL", pct: 88 },
      { name: "HTML / CSS", pct: 86 },
    ],
  },
  {
    title: "Full Stack",
    subtitle: "End-to-end delivery",
    items: [
      { name: "React / Next.js", pct: 92 },
      { name: "Node.js / Express", pct: 88 },
      { name: "MongoDB / Supabase", pct: 87 },
      { name: "Firebase", pct: 85 },
    ],
  },
  {
    title: "Data & Cloud",
    subtitle: "Scale & insight",
    items: [
      { name: "Pandas / NumPy", pct: 90 },
      { name: "PyQt5 / Matplotlib", pct: 84 },
      { name: "AWS", pct: 78 },
      { name: "GCP", pct: 76 },
      { name: "Docker / Git", pct: 80 },
    ],
  },
];

function SkillMeter({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.55"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", `${pct}%`]);
  return (
    <div ref={ref} className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div
        style={{ width, background: RED }}
        className="h-full rounded-full"
      />
    </div>
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
      className={`relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 overflow-hidden group hover:border-[#ff2a2a]/40 transition ${
        group.featured ? "md:row-span-2" : ""
      }`}
    >
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition"
        style={{ background: RED }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black mb-3"
              style={{ background: RED, color: "white" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              {group.title}
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
              {group.subtitle}
            </p>
          </div>
        </div>

        <div className={`space-y-4 ${group.featured ? "md:columns-2 md:gap-x-8" : ""}`}>
          {group.items.map((s) => (
            <div key={s.name} className="break-inside-avoid">
              <div className="flex justify-between items-center text-sm mb-1.5">
                <span className="text-white/90 font-medium">{s.name}</span>
                <span style={{ color: RED }} className="font-semibold text-xs">
                  {s.pct}%
                </span>
              </div>
              <SkillMeter pct={s.pct} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.2em] uppercase text-white/70 mb-6"
          >
            Skills
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            My <span style={{ color: RED }}>technical</span> arsenal
          </motion.h2>
          <p className="mt-6 text-white/60 text-lg">
            A competency map of the languages, frameworks, and platforms I use to
            turn ideas into shipped products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillGroups.map((g, i) => (
            <SkillCard key={g.title} group={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS — "Here's how I turn ideas into real-world applications"    */
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
    body: "Rigorous testing, performance optimization, and seamless deployment to cloud infrastructure, followed by ongoing support.",
  },
];


const cardPositions = [
  { top: "11.8%", left: "67.3%", rotate: 5 },   // 01 Research  — SVG (69, 13)
  { top: "35.8%", left: "12%",   rotate: -5 },   // 02 Design    — SVG (22, 37)
  { top: "59.8%", left: "67.3%", rotate: 4 },    // 03 Develop   — SVG (69, 61)
  { top: "83.8%", left: "12%",   rotate: -3 },   // 04 Deploy    — SVG (22, 85)
];

// Card centers in a 85x100 viewBox (matches container aspect ratio ~1152/1350).
// Point 1: (69, 13) | Point 2: (22, 37) | Point 3: (69, 61) | Point 4: (22, 85)
const CURVE_D =
  "M 69 13 L 22 37 L 69 61 L 22 85";

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
      className="relative bg-white text-gray-900 py-28 md:py-36 px-6 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <div ref={ref} className="max-w-6xl mx-auto relative md:h-[1350px]">
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="md:absolute top-10 left-0 md:w-[460px] z-20 mb-16 md:mb-0"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Here's how I turn ideas into real-world applications
          </h2>
        </motion.div>

        {/* Zigzag dotted path linking the cards (desktop) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 85 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Dotted background path */}
          <path
            d={CURVE_D}
            fill="none"
            stroke="#cbd5e1"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth="2"
          />
          {/* Animated solid foreground path */}
          <motion.path
            d={CURVE_D}
            fill="none"
            stroke="#111827"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth="2.5"
            style={{ pathLength }}
          />
          {/* Connection point markers */}
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
              fill="#111827"
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Mobile vertical line */}
        <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[repeating-linear-gradient(to_bottom,#cbd5e1_0_6px,transparent_6px_12px)] z-0" />

        {/* Cards */}
        <div className="flex flex-col gap-8 items-center md:block z-10 w-full">
          {processSteps.map((s, i) => (
            <div
              key={s.n}
              className="md:absolute"
              style={{ top: cardPositions[i].top, left: cardPositions[i].left }}
            >
              <ProcessCard step={s} rotate={cardPositions[i].rotate} index={i} />
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
      className="w-72 sm:w-80 rounded-[2rem] p-2 relative flex flex-col items-center z-10 bg-white border border-gray-200 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="w-5 h-5 rounded-full absolute top-4 border border-gray-300 z-10 bg-gradient-to-br from-gray-300 to-gray-100 shadow-inner" />
      <div
        className="w-full rounded-[1.5rem] mt-8 p-8 flex flex-col min-h-[220px] transition-colors duration-700"
        style={{
          backgroundColor: hover ? RED : "#f4f4f4",
          color: hover ? "#fff" : undefined,
        }}
      >
        <span
          className="text-xl font-bold mb-2 font-serif italic transition-colors duration-700"
          style={{ color: hover ? "rgba(255,255,255,0.7)" : "#9ca3af" }}
        >
          {step.n}
        </span>
        <h3
          className="text-2xl font-black mb-3 tracking-tight transition-colors duration-700"
          style={{ color: hover ? "#fff" : "#111827" }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm leading-relaxed font-medium transition-colors duration-700"
          style={{ color: hover ? "rgba(255,255,255,0.9)" : "#6b7280" }}
        >
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}

/* EXPERIENCE — vertical timeline with scroll-linked progress line     */
/* ------------------------------------------------------------------ */
const experiences = [
  {
    period: "Jun 2025 — Dec 2025",
    role: "Python Developer Intern",
    org: "Stock Market Analytics",
    body: "Built an intelligent Python + PyQt5 desktop application for real-time Indian equities analysis. Streamed live and historical market data, engineered technical indicators (MA, RSI, MACD), and visualized market trends to help investors make smarter, data-driven decisions.",
    tech: ["Python", "PyQt5", "Pandas", "NumPy", "PyQtGraph"],
  },
  {
    period: "2024 — Present",
    role: "Operations & Logistics Lead",
    org: "GDG On Campus · Integral University",
    body: "Lead operations, logistics, and event coordination for Google Developer Group activities on campus — from developer workshops to community meetups, ensuring smooth delivery for hundreds of student developers.",
    tech: ["Leadership", "Event Ops", "Community"],
  },
  {
    period: "2024",
    role: "Hackathon Winner",
    org: "HackVeda × IBM × AWS — ILM University, Greater Noida",
    body: "Won the HackVeda National Level Hackathon organized in collaboration with IBM and AWS. Designed, built, and pitched a full working prototype under a tight 24-hour build window with a small team.",
    tech: ["Full Stack", "AI/ML", "Team Leadership"],
  },
];

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
      className="relative py-32 px-6 bg-black border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.2em] uppercase text-white/70 mb-6"
          >
            Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            Where I've <span style={{ color: RED }}>built</span> & led
          </motion.h2>
        </div>

        <div ref={ref} className="relative pl-8 md:pl-16">
          <div className="absolute left-2 md:left-6 top-0 bottom-0 w-[2px] bg-white/10" />
          <motion.div
            style={{ height: lineHeight, background: RED }}
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
                  className="absolute -left-8 md:-left-16 top-2 w-4 h-4 rounded-full ring-4 ring-black"
                  style={{ background: RED }}
                />
                <div className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: RED }}>
                  {e.period}
                </div>
                <h3 className="mt-2 text-2xl md:text-3xl font-black">
                  {e.role}
                </h3>
                <p className="text-sm text-white/60 mt-1">{e.org}</p>
                <p className="mt-4 text-white/75 leading-relaxed max-w-2xl">
                  {e.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {e.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full border border-white/15 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
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
/* PROJECTS — stacking scroll cards                                    */
/* ------------------------------------------------------------------ */
const projects = [
  {
    n: "01",
    tag: "Flagship · Full Stack AI",
    name: "NaturalHealer",
    subtitle: "Empowering wellness through nature",
    body: "A full-stack AI-powered wellness platform delivering personalized health guidance. Combines structured healthcare datasets with domain-specific knowledge and intelligent recommendation workflows to generate contextual, actionable insights for users.",
    tech: ["Python", "React", "Next.js", "Firebase", "LangFlow", "LLaMA"],
    accent: RED,
  },
  {
    n: "02",
    tag: "AI Validation Engine",
    name: "ProtoEngine",
    subtitle: "Idea Evaluator & feasibility engine",
    body: "A full-stack AI-powered idea validation system that analyses user concepts, evaluates feasibility, and generates structured execution roadmaps using intelligent decision-making workflows and automated planning mechanisms.",
    tech: ["React", "Python", "Supabase", "LangChain", "PHI-4", "Gemini LLM"],
    accent: "#ffffff",
  },
  {
    n: "03",
    tag: "Desktop · Fintech",
    name: "Stock Market Intelligence",
    subtitle: "Real-time equities analytics",
    body: "Python + PyQt5 desktop app for real-time Indian market analysis. Fetches live and historical data, computes MA, RSI, MACD indicators, and visualises trends with interactive charts to help investors act on evidence, not intuition.",
    tech: ["Python", "PyQt5", "Pandas", "NumPy", "PyQtGraph"],
    accent: RED,
  },
];

function Projects() {
  return (
    <section
      id="projects"
      className="relative bg-black border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.2em] uppercase text-white/70 mb-6"
        >
          Selected Work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
        >
          Projects that <span style={{ color: RED }}>ship</span>
        </motion.h2>
        <p className="mt-6 max-w-2xl text-white/60 text-lg">
          Real products, real impact — each one built end-to-end with production
          engineering practices.
        </p>
      </div>

      <div className="relative">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} total={projects.length} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.4, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const isRed = project.accent === RED;

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
          background: isRed ? RED : "#0a0a0a",
          borderColor: isRed ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)",
        }}
        className="max-w-6xl mx-auto my-6 rounded-3xl border p-8 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-end shadow-2xl"
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isRed ? "bg-black text-white" : "text-black"
              }`}
              style={!isRed ? { background: RED } : undefined}
            >
              {project.tag}
            </span>
            <span
              className={`text-xs uppercase tracking-widest ${
                isRed ? "text-black/60" : "text-white/40"
              }`}
            >
              Project {project.n} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <h3
            className={`text-4xl md:text-6xl font-black tracking-tight leading-[0.95] ${
              isRed ? "text-white" : "text-white"
            }`}
          >
            {project.name}
          </h3>
          <p
            className={`mt-3 text-lg md:text-xl font-medium ${
              isRed ? "text-black" : "text-white/60"
            }`}
          >
            {project.subtitle}
          </p>
          <p
            className={`mt-6 max-w-2xl leading-relaxed ${
              isRed ? "text-white/95" : "text-white/75"
            }`}
          >
            {project.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className={`text-xs px-3 py-1 rounded-full border ${
                  isRed
                    ? "border-black/30 text-black bg-black/5"
                    : "border-white/15 text-white/70"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex md:flex-col gap-3 md:items-end">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              isRed
                ? "bg-black text-white hover:bg-white hover:text-black"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            GitHub →
          </a>
        </div>
      </motion.article>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS + CERTIFICATIONS                                       */
/* ------------------------------------------------------------------ */
const achievements = [
  {
    tag: "🏆 Winner",
    title: "HackVeda National Hackathon",
    org: "ILM University · IBM × AWS",
    body: "Winner of the HackVeda National Level Hackathon organised in collaboration with IBM and AWS.",
  },
  {
    tag: "🏆 Winner",
    title: "Smart India Hackathon — Internal",
    org: "Integral University",
    body: "Winner of the Smart India Hackathon internal edition at Integral University.",
  },
  {
    tag: "🚀 Lead",
    title: "GDG On Campus — Operations Lead",
    org: "Integral University",
    body: "Operations & Logistics Lead for Google Developer Group on Campus, coordinating community events and workshops.",
  },
];

const certs = [
  { title: "MERN Stack Development", org: "Self-directed · Production projects" },
  { title: "AI / LLM Engineering", org: "LangChain · LangFlow · Gemini" },
  { title: "Cloud Fundamentals", org: "AWS & GCP" },
  { title: "Data Science with Python", org: "Pandas · NumPy · Scikit-learn" },
];

function Achievements() {
  return (
    <section className="relative py-32 px-6 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.2em] uppercase text-white/70 mb-6"
          >
            Recognition
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
          >
            Wins & <span style={{ color: RED }}>Milestones</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent hover:border-[#ff2a2a]/50 transition"
            >
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6"
                style={{ background: RED, color: "white" }}
              >
                {a.tag}
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">
                {a.title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
                {a.org}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
            Certifications & Focus Areas
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certs.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-full mb-4 flex items-center justify-center text-sm font-black" style={{ background: RED }}>
                  ✓
                </div>
                <h4 className="font-bold text-sm mb-1">{c.title}</h4>
                <p className="text-xs text-white/50">{c.org}</p>
              </motion.div>
            ))}
          </div>
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
    org: "Integral University",
    note: "Currently in the final year of my Bachelor's in CSE.",
  },
  {
    period: "Aug 2022 — Jun 2024",
    degree: "Diploma, Computer Science & Engineering",
    org: "Integral University",
    note: "Graduated with a 9.2 CGPA.",
  },
];

function Education() {
  return (
    <section className="relative py-32 px-6 bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-12">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.2em] uppercase text-white/70 mb-6"
          >
            Education
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]"
          >
            The <span style={{ color: RED }}>foundation</span>
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
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
            >
              <div
                className="text-xs uppercase tracking-widest font-semibold mb-3"
                style={{ color: RED }}
              >
                {e.period}
              </div>
              <h3 className="text-xl md:text-2xl font-black">{e.degree}</h3>
              <p className="text-sm text-white/60 mt-1">{e.org}</p>
              <p className="mt-4 text-white/70">{e.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT — huge scroll-in headline                                   */
/* ------------------------------------------------------------------ */
function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-40 px-6 bg-black border-t border-white/5 overflow-hidden"
    >
      <motion.div
        style={{ y, scale }}
        className="max-w-5xl mx-auto text-center"
      >
        <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: RED }}>
          Let's build something
        </p>
        <h2 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.9]">
          Say
          <br />
          <span style={{ color: RED }}>hello.</span>
        </h2>
        <p className="mt-10 text-white/70 max-w-xl mx-auto text-lg">
          Open to internships, freelance builds, and full-time roles in AI &
          Full-Stack engineering. I typically respond within 24–48 hours.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={MAILTO}
            className="px-8 py-4 rounded-full text-white text-sm font-semibold hover:opacity-90 transition"
            style={{ background: RED }}
          >
            {EMAIL}
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="px-8 py-4 rounded-full border border-white/20 text-sm font-semibold hover:bg-white hover:text-black transition"
          >
            {PHONE}
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10 text-sm text-white/40 bg-black">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Abdullah Azmi
          <span style={{ color: RED }}>.</span> All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition inline-flex items-center gap-2"
          >
            <LinkedInIcon className="w-4 h-4" /> LinkedIn
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition inline-flex items-center gap-2"
          >
            <GithubIcon className="w-4 h-4" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}