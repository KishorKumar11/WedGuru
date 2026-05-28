import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  CalendarCheck2,
  Wallet,
  Palette,
  Users,
  Camera,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Star,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",         href: "#hero" },
  { label: "Features",     href: "#features" },
  { label: "How it Works", href: "#demo" },
  { label: "Contact",      href: "#contact" },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: CalendarCheck2, title: "Smart Checklist",   desc: "Phase-aware timeline that auto-generates tasks based on your wedding date, so nothing slips through.",                        accent: "#d67ba0" },
  { icon: Wallet,         title: "Budget Control",    desc: "Track every dollar across 11 categories. Real-time donut chart keeps overspending impossible to ignore.",                     accent: "#b85c8a" },
  { icon: Users,          title: "Guest Management", desc: "Invite, RSVP-track, and seat every guest with drag-and-drop table assignments.",                                               accent: "#9b4870" },
  { icon: Palette,        title: "Theme Explorer",   desc: "Curated mood boards, color palettes, and visual references to lock in your wedding aesthetic.",                               accent: "#c86a95" },
  { icon: Camera,         title: "Photo Wall",       desc: "A shared album where your wedding party contributes photos — one beautiful memory hub.",                                      accent: "#d67ba0" },
  { icon: Sparkles,       title: "AI Planner",       desc: "Ask anything. Your AI wedding assistant helps with vendor ideas, timelines, and budget breakdowns.",                          accent: "#a0527a" },
];

const JOURNEY_STEPS = [
  { step: "01", title: "Create your account",  desc: "Sign up in 30 seconds. Set your wedding date and location to personalise your entire planning experience.", icon: Heart,          color: "#fff1f6", border: "rgba(214,123,160,0.3)" },
  { step: "02", title: "Build your checklist", desc: "Your AI-generated phase timeline kicks in immediately — tasks sorted from 12 months out to the big day.",   icon: CalendarCheck2, color: "#fef9f0", border: "rgba(198,143,90,0.3)" },
  { step: "03", title: "Set your budget",      desc: "Enter your total budget. Add expected and actual costs per category, watch the donut chart fill up.",         icon: Wallet,         color: "#f5f0ff", border: "rgba(160,82,122,0.3)" },
  { step: "04", title: "Invite your guests",   desc: "Send magic invite links. Guests RSVP, share photos, and get auto-seated with your seating plan.",            icon: Users,          color: "#f0fff4", border: "rgba(72,160,120,0.3)" },
  { step: "05", title: "Walk down the aisle",  desc: "Everything handled. Every seat filled. Every memory saved. Just show up and say I do.",                       icon: Sparkles,       color: "#fff5f0", border: "rgba(214,123,160,0.4)" },
];

const TESTIMONIALS = [
  { name: "Ram & Sita",     role: "Married Dec 2024", quote: "WedGuru made our 400-guest wedding feel manageable. The guest seating tool alone saved us weeks.",               rating: 5, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=80&q=80" },
  { name: "Meera & Karthik", role: "Married Feb 2025", quote: "The AI planner answered every obscure question. It felt like having a wedding coordinator in our pocket.",       rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" },
  { name: "Ananya & Dev",    role: "Planning Nov 2025", quote: "Budget tracking is brilliant. We finally know where every dollar is going — no more spreadsheet chaos.", rating: 5, avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=80&q=80" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scrollTo(href: string) {
  document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="default" className="mb-5 gap-2 text-xs tracking-widest uppercase font-bold px-3.5 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shrink-0" />
      {children}
    </Badge>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ["hero", "features", "demo", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="landing-nav-inner">
        {/* Logo */}
        <button className="landing-nav-logo" onClick={() => scrollTo("#hero")}>
          <span className="landing-nav-logo-icon">
            <Heart size={15} fill="currentColor" />
          </span>
          WedGuru
        </button>

        {/* Desktop links */}
        <ul className="landing-nav-links">
          {NAV_LINKS.map(({ label, href }) => {
            const active = activeSection === href.replace("#", "");
            return (
              <li key={href}>
                <button
                  className={`landing-nav-link ${active ? "landing-nav-link--active" : ""}`}
                  onClick={() => scrollTo(href)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="landing-nav-cta">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button className="landing-nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} color="#6e304f" /> : <Menu size={20} color="#6e304f" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div className="landing-nav-mobile" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button key={href} className="landing-nav-mobile-link" onClick={() => { scrollTo(href); setMenuOpen(false); }}>
              {label}
            </button>
          ))}
          <div className="landing-nav-mobile-cta">
            <Button variant="gradient" asChild className="flex-1"><Link to="/login">Sign in</Link></Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 400], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const yVisual = useTransform(scrollY, [0, 400], [0, 40]);

  return (
    <section id="hero" className="landing-hero">
      {/* Gradient mesh background */}
      <div className="hero-mesh" aria-hidden>
        <div className="hero-mesh-orb hero-mesh-orb-1" />
        <div className="hero-mesh-orb hero-mesh-orb-2" />
        <div className="hero-mesh-orb hero-mesh-orb-3" />
        <div className="hero-mesh-orb hero-mesh-orb-4" />
      </div>

      {/* Content */}
      <motion.div className="landing-hero-content" style={{ y, opacity }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Badge variant="default" className="mb-6 gap-2 border-rose-300/60 bg-gradient-to-r from-rose-50 to-pink-100 text-love-700 shadow-sm">
            <Sparkles size={12} />
            AI-powered wedding planning
            <Badge variant="new" className="ml-1">New</Badge>
          </Badge>
        </motion.div>

        <motion.h1 className="hero-headline" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          Your wedding,
          <br />
          <span className="hero-headline-accent">perfectly planned.</span>
        </motion.h1>

        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
          One calm, beautiful hub for your checklist, budget, guests, themes, and memories.
          Less spreadsheet chaos. More joy.
        </motion.p>

        <motion.div className="hero-cta-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/register">
              Start planning free <ArrowRight size={17} />
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => scrollTo("#demo")}>
            See how it works <ChevronDown size={16} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Hero visual */}
      <motion.div className="hero-visual" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ y: yVisual }}>
        <Card className="hero-card-main glass-love border-0">
          <CardContent className="p-5">
            <div className="hero-card-header">
              <div className="hero-card-avatar" />
              <div>
                <div className="hero-card-name">Ram &amp; Sita's Wedding</div>
                <div className="hero-card-date">December 18, 2025 · Singapore</div>
              </div>
              <Badge variant="subtle" className="ml-auto bg-emerald-50 border-emerald-200 text-emerald-700 text-[0.7rem]">On Track</Badge>
            </div>
            <div className="hero-card-progress-row">
              <span>Checklist progress</span>
              <span className="hero-card-pct">68%</span>
            </div>
            <div className="hero-card-bar">
              <div className="hero-card-bar-fill" style={{ width: "68%" }} />
            </div>
            <div className="hero-card-tasks">
              {[
                { t: "Book photographer", done: true },
                { t: "Confirm catering",  done: true },
                { t: "Send invites — 3 pending", done: false },
                { t: "Finalise seating",  done: false },
              ].map(({ t, done }) => (
                <div key={t} className={`hero-card-task ${done ? "done" : ""}`}>
                  <CheckCircle2 size={13} />
                  {t}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floating badges */}
        <motion.div className="hero-float hero-float-budget" animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <div className="glass-pill hero-float-inner">
            <div className="hero-float-icon" style={{ background: "rgba(214,123,160,0.15)", color: "#d67ba0" }}><Wallet size={14} /></div>
            <div>
              <div className="hero-float-label">Budget</div>
              <div className="hero-float-value">$12.4K / $15K</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-float hero-float-guests" animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <div className="glass-pill hero-float-inner">
            <div className="hero-float-icon" style={{ background: "rgba(180,92,138,0.13)", color: "#b85c8a" }}><Users size={14} /></div>
            <div>
              <div className="hero-float-label">Guests</div>
              <div className="hero-float-value">284 confirmed</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-float hero-float-ai" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <div className="glass-pill hero-float-inner">
            <div className="hero-float-icon" style={{ background: "rgba(130,80,160,0.13)", color: "#8a50a0" }}><Sparkles size={14} /></div>
            <div>
              <div className="hero-float-label">AI Planner</div>
              <div className="hero-float-value">Ready to help</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="landing-section">
      {/* Gradient band */}
      <div className="features-gradient-band" aria-hidden />

      <div className="landing-section-inner">
        <FadeUp>
          <SectionPill>Everything you need</SectionPill>
          <h2 className="landing-section-title">One hub, six powerful tools</h2>
          <p className="landing-section-sub">
            From your first checklist task to the last wedding waltz — WedGuru covers every dimension of planning.
          </p>
        </FadeUp>

        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <Card className="feature-card group glass border-0 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_20px_48px_rgba(110,48,79,0.16)]">
                <CardHeader className="pb-2">
                  <div className="feature-icon-wrap mb-2" style={{ background: `${accent}18`, color: accent }}>
                    <Icon size={22} />
                  </div>
                  <CardTitle className="text-base font-bold text-love-900">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-rose-700/65 leading-relaxed">{desc}</CardDescription>
                  <Link to="/register" className="feature-link mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 group-hover:gap-2.5 transition-all">
                    Explore <ArrowRight size={12} />
                  </Link>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* Gradient divider */}
        <Separator className="my-16" />

        {/* Testimonials */}
        <FadeUp delay={0.1}>
          <SectionPill>Loved by couples</SectionPill>
          <h3 className="landing-section-title text-2xl mb-8">Real stories, real weddings</h3>
        </FadeUp>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(({ name, role, quote, rating, avatar }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <Card className="testimonial-card glass border-0 h-full flex flex-col">
                <CardContent className="p-5 flex flex-col gap-3 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Star key={j} size={13} fill="#d67ba0" color="#d67ba0" />
                    ))}
                  </div>
                  <p className="text-[0.88rem] italic leading-relaxed text-love-800 flex-1">"{quote}"</p>
                  <div className="flex items-center gap-3 pt-1">
                    <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover border-2 border-rose-200/60" />
                    <div>
                      <div className="text-sm font-bold text-love-900">{name}</div>
                      <div className="text-xs text-rose-400">{role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
function DemoSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="demo" className="landing-section landing-section--alt">
      <div className="landing-section-inner">
        <FadeUp>
          <SectionPill>How it works</SectionPill>
          <h2 className="landing-section-title">From sign-up to "I do"</h2>
          <p className="landing-section-sub">
            Follow the journey of a couple who planned their dream wedding in WedGuru — start to finish.
          </p>
        </FadeUp>

        <div className="demo-layout">
          {/* Steps */}
          <div className="demo-steps">
            {JOURNEY_STEPS.map(({ step, title, desc, icon: Icon }, i) => (
              <FadeUp key={step} delay={i * 0.06}>
                <button
                  className={`demo-step ${active === i ? "demo-step--active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <div className={`demo-step-badge ${active === i ? "demo-step-badge--active" : ""}`}>{step}</div>
                  <div className="flex-1 text-left">
                    <div className="demo-step-title">{title}</div>
                    {active === i && (
                      <motion.p className="demo-step-desc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                        {desc}
                      </motion.p>
                    )}
                  </div>
                  <Icon size={17} className={`flex-shrink-0 transition-opacity ${active === i ? "text-rose-500 opacity-100" : "text-rose-300 opacity-40"}`} />
                </button>
              </FadeUp>
            ))}
          </div>

          {/* Visual panel */}
          <FadeUp delay={0.2} className="demo-visual-wrap">
            <motion.div
              key={active}
              className="demo-visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              style={{ background: JOURNEY_STEPS[active].color, borderColor: JOURNEY_STEPS[active].border }}
            >
              <div className="demo-visual-header">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-[0.75rem] text-rose-400 ml-2 flex-1">WedGuru — {JOURNEY_STEPS[active].title}</span>
              </div>
              <div className="demo-visual-body">
                {active === 0 && <DemoCreateAccount />}
                {active === 1 && <DemoChecklist />}
                {active === 2 && <DemoBudget />}
                {active === 3 && <DemoGuests />}
                {active === 4 && <DemoCelebrate />}
              </div>
            </motion.div>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <div className="text-center mt-12">
            <p className="text-sm text-rose-400 mb-4">Ready to start your own journey?</p>
            <Button variant="gradient" size="lg" asChild>
              <Link to="/register">Create your free plan <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Demo mocks ───────────────────────────────────────────────────────────────
function DemoCreateAccount() {
  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <div className="flex flex-col gap-1">
        <Label>Wedding date</Label>
        <Input readOnly value="December 18, 2025" className="bg-white/80 text-sm py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Location</Label>
        <Input readOnly value="Singapore" className="bg-white/80 text-sm py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Your name</Label>
        <Input readOnly value="Sita" className="bg-white/80 text-sm py-2" />
      </div>
      <Button variant="gradient" size="sm" className="mt-1 self-start gap-2">
        <Heart size={13} fill="white" /> Create my plan
      </Button>
    </div>
  );
}

function DemoChecklist() {
  const tasks = [
    { t: "Book ceremony venue",   done: true  },
    { t: "Hire photographer",     done: true  },
    { t: "Send invitations",      done: true  },
    { t: "Confirm catering menu", done: false },
    { t: "Arrange floral decor",  done: false },
  ];
  return (
    <div className="flex flex-col gap-2">
      {tasks.map(({ t, done }) => (
        <div key={t} className={`flex items-center gap-2 text-sm ${done ? "text-love-900" : "text-rose-300"}`}>
          <CheckCircle2 size={14} className={done ? "text-rose-500" : "text-rose-200"} />
          {t}
        </div>
      ))}
      <div className="flex items-center gap-3 mt-3 text-xs text-rose-400">
        <span>60% done</span>
        <div className="flex-1 h-1.5 bg-rose-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-400 to-love-700 rounded-full" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

function DemoBudget() {
  const cats = [
    { label: "Venue",        pct: 40, color: "#d67ba0" },
    { label: "Catering",     pct: 28, color: "#b85c8a" },
    { label: "Photo/Video",  pct: 12, color: "#9b4870" },
    { label: "Florals",      pct: 10, color: "#c86a95" },
    { label: "Other",        pct: 10, color: "#e8aac5" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-bold text-love-900 mb-1">$12.4K spent of $15K</div>
      {cats.map(({ label, pct, color }) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          <span className="w-20 text-rose-400 shrink-0">{label}</span>
          <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
          </div>
          <span className="w-7 text-right text-rose-400">{pct}%</span>
        </div>
      ))}
    </div>
  );
}

function DemoGuests() {
  const guests = [
    { name: "Anjali Mehta", table: "Table 3", status: "confirmed" },
    { name: "Rohit Verma",  table: "Table 1", status: "confirmed" },
    { name: "Deepa Iyer",   table: "Table 5", status: "pending"   },
    { name: "Sanjay Nair",  table: "Table 2", status: "confirmed" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {guests.map(({ name, table, status }) => (
        <div key={name} className="flex items-center gap-2.5 py-1.5 border-b border-rose-100 last:border-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-300 to-love-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {name[0]}
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs font-semibold text-love-900">{name}</span>
            <span className="text-[0.7rem] text-rose-400">{table}</span>
          </div>
          <Badge variant={status === "confirmed" ? "subtle" : "outline"} className={status === "confirmed" ? "bg-emerald-50 border-emerald-200 text-emerald-700 text-[0.65rem]" : "border-amber-200 text-amber-600 text-[0.65rem]"}>
            {status}
          </Badge>
        </div>
      ))}
      <p className="text-[0.7rem] text-rose-400 mt-1">284 confirmed · 16 pending · 400 total</p>
    </div>
  );
}

function DemoCelebrate() {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-love-700 flex items-center justify-center shadow-love">
        <Heart size={30} fill="white" color="white" />
      </div>
      <h3 className="font-display text-xl font-semibold text-love-900">The big day is here!</h3>
      <p className="text-xs text-rose-400 leading-relaxed max-w-[220px]">Every task done. Every seat filled. Every memory saved.</p>
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {["400 guests ✓", "Budget on track ✓", "Memories saved ✓"].map((c) => (
          <Badge key={c} variant="default" className="text-[0.68rem]">{c}</Badge>
        ))}
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="landing-section relative overflow-hidden">
      {/* Gradient wash */}
      <div className="contact-gradient-wash" aria-hidden />

      <div className="landing-section-inner relative z-10">
        <FadeUp>
          <SectionPill>Get in touch</SectionPill>
          <h2 className="landing-section-title">We'd love to hear from you</h2>
          <p className="landing-section-sub">
            Questions about pricing, features, or your big day? Drop us a message and we'll reply within 24 hours.
          </p>
        </FadeUp>

        <div className="contact-layout">
          {/* Info column */}
          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail,   label: "Email us",     val: "hello@wedguru.app",  href: "mailto:hello@wedguru.app" },
                { icon: Phone,  label: "Call us",       val: "+65 9111 2222",      href: "tel:+6591112222" },
                { icon: MapPin, label: "Headquarters",  val: "Singapore",          href: undefined },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-widest text-rose-400 mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-love-900 hover:text-rose-500 transition-colors">{val}</a>
                    ) : (
                      <span className="text-sm font-semibold text-love-900">{val}</span>
                    )}
                  </div>
                </div>
              ))}

              <Separator />

              <Card className="border-rose-200/40 bg-gradient-to-br from-rose-50 to-pink-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-rose-600 leading-relaxed">
                    We reply within 24 hours. No bots — a real person from our team reads every message.
                  </p>
                </CardContent>
              </Card>
            </div>
          </FadeUp>

          {/* Form card */}
          <FadeUp delay={0.2}>
            <Card className="glass-love border-0 shadow-none">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <motion.div className="flex flex-col items-center gap-4 py-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-love-700 flex items-center justify-center shadow-love">
                      <CheckCircle2 size={28} color="white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-love-900">Message sent!</h3>
                    <p className="text-sm text-rose-400">We'll get back to you within 24 hours.</p>
                    <Button variant="muted" size="sm" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}>
                      Send another
                    </Button>
                  </motion.div>
                ) : (
                  <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-name">Full name *</Label>
                        <Input id="c-name" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-email">Email address *</Label>
                        <Input id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="c-msg">Message *</Label>
                      <Textarea id="c-msg" placeholder="Tell us how we can help with your wedding planning..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} />
                    </div>
                    <Button type="submit" variant="gradient" className="self-start gap-2">
                      Send message <ArrowRight size={15} />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="landing-footer">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />

      <div className="landing-footer-inner">
        <div>
          <div className="landing-nav-logo mb-3" style={{ fontSize: "1.15rem" }}>
            <span className="landing-nav-logo-icon"><Heart size={15} fill="currentColor" /></span>
            WedGuru
          </div>
          <p className="text-sm text-rose-400 leading-relaxed max-w-[260px]">
            Your wedding command center. Free to start, beautiful to use.
          </p>
        </div>

        <div className="footer-links-grid">
          {[
            { group: "Product",  links: [{ l: "Features", h: "#features" }, { l: "How it works", h: "#demo" }, { l: "Sign up free", h: "/register", internal: true }] },
            { group: "Company",  links: [{ l: "Contact", h: "#contact" }, { l: "Blog", h: "#" }, { l: "Careers", h: "#" }] },
            { group: "Legal",    links: [{ l: "Privacy", h: "#" }, { l: "Terms", h: "#" }] },
          ].map(({ group, links }) => (
            <div key={group}>
              <div className="text-[0.72rem] font-bold uppercase tracking-widest text-rose-300 mb-3">{group}</div>
              {links.map(({ l, h, internal }) =>
                internal ? (
                  <Link key={l} to={h} className="block text-sm text-rose-400 hover:text-love-700 mb-2 transition-colors">{l}</Link>
                ) : (
                  <a key={l} href={h} className="block text-sm text-rose-400 hover:text-love-700 mb-2 transition-colors">{l}</a>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-0" />
      <div className="text-center py-5">
        <span className="text-xs text-rose-400">
          © 2025 WedGuru. Made with{" "}
          <Heart size={11} fill="#d67ba0" color="#d67ba0" className="inline align-middle" />{" "}
          in Singapore.
        </span>
      </div>
    </footer>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="landing-root">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
