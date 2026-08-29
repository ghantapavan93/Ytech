"use client";

import { VisionLatticeDiagram } from "./diagram/VisionLatticeDiagram";
import { CommandHint } from "./CommandPalette";
import {
  FIRST_PRINCIPLES,
  SERVICES,
  SPOKEN,
  STACK,
  TEN_X,
  VISION_RESTRAINTS,
} from "@/lib/content/vision-data";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Layers,
  Lock,
  MessageSquareQuote,
  Rocket,
  Scale3d,
} from "lucide-react";
import Link from "next/link";
import { CompoundingSim } from "./CompoundingSim";

const STATUS_STYLE: Record<
  (typeof STACK)[number]["status"],
  { text: string; bg: string }
> = {
  SHIPPED: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  NEXT: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  HORIZON: { text: "text-zinc-400", bg: "bg-white/[0.06]" },
};

/** House reveal idiom (matches the user's earlier projects). */
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
} as const;

function SectionHead({
  icon,
  kicker,
  title,
  sub,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <motion.div {...reveal} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <p className="micro-label">{kicker}</p>
      </div>
      <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-zinc-100 sm:text-3xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-zinc-400">{sub}</p>
      )}
    </motion.div>
  );
}

export function VisionContent() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  return (
    <div className="min-h-screen">
      {/* Reading progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-cyan-400/80"
        style={{ scaleX: progress }}
      />

      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-[14px] font-bold tracking-[-0.01em] text-zinc-100 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11px] text-zinc-600 sm:block">
              // The Vision
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CommandHint />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-500 transition-colors hover:border-line-strong hover:text-zinc-200"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Instrument</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-20">
        {/* Hero */}
        <section className="relative pt-20 sm:pt-28">
          <div className="hero-decor" aria-hidden />
          <motion.p
            className="micro-label"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            One reader's thinking, offered for argument
          </motion.p>
          <motion.h1
            className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-100 sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            We built one instrument.
            <span className="block text-zinc-500">
              Here is where it could go, if it earns the right.
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            You have spent twenty years in this industry and we have spent a
            few weeks reading what you published, so treat everything below as
            a proposal rather than a plan. The reasoning is simple enough to
            argue with. Intelligence is getting cheaper by the token, which
            moves the advantage toward whoever learns fastest about where that
            intelligence actually survives inside a real firm. If that is
            wrong, the fastest way to find out is to tell us where.
          </motion.p>
        </section>

        {/* First principles */}
        <section className="mt-20">
          <SectionHead
            icon={<Atom size={14} />}
            kicker="Step one · reduce to first principles"
            title={
              <>
                Four things stay true{" "}
                <span className="text-zinc-500">when everything else commoditizes.</span>
              </>
            }
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FIRST_PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.n}
                className="card p-6"
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="mono-num text-[11px] font-semibold text-cyan-400/80">{p.n}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-zinc-200">{p.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-400">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The stack */}
        <section className="mt-16">
          <VisionLatticeDiagram />
        </section>

        <section className="mt-20">
          <SectionHead
            icon={<Rocket size={14} />}
            kicker="Step two · build the instrument layer"
            title={
              <>
                One question per stage.{" "}
                <span className="text-zinc-500">Stage one is already flying.</span>
              </>
            }
            sub="Not a platform, not a registry, a stack of gates, each answering one question a firm must survive before the next. Every gate deposits evidence as a side effect of normal use."
          />
          <div className="mt-6 space-y-3">
            {STACK.map((s, i) => {
              const st = STATUS_STYLE[s.status];
              return (
                <motion.div
                  key={s.stage}
                  className="card grid gap-4 p-6 sm:grid-cols-[64px_1fr_auto]"
                  {...reveal}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mono-num text-2xl font-bold text-zinc-700">{s.stage}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[15px] font-semibold text-zinc-200">{s.name}</h3>
                      <span className="text-[12.5px] italic text-zinc-500">{s.question}</span>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">{s.detail}</p>
                  </div>
                  <span
                    className={`mono-num h-fit rounded-md px-2 py-1 text-[9px] font-bold tracking-[0.14em] ${st.text} ${st.bg}`}
                  >
                    {s.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Simulator */}
        <section className="mt-20">
          <SectionHead
            icon={<Layers size={14} />}
            kicker="Step three · run the numbers"
            title={
              <>
                The learning rate, simulated.{" "}
                <span className="text-zinc-500">Drag it.</span>
              </>
            }
            sub="A deterministic toy model of the compounding argument. The dashed line is every consultancy that starts each engagement from a blank page, including, today, all of YegaTech's competitors."
          />
          <motion.div className="mt-6" {...reveal} transition={{ duration: 0.55 }}>
            <CompoundingSim />
          </motion.div>
        </section>

        {/* 10% vs 10X */}
        <section className="mt-20">
          <SectionHead
            icon={<Scale3d size={14} />}
            kicker="Step four · apply their own test"
            title={
              <>
                10% firm, 10X firm.{" "}
                <span className="text-zinc-500">Their language, turned on consulting itself.</span>
              </>
            }
          />
          <motion.div
            className="card mt-6 overflow-hidden"
            {...reveal}
            transition={{ duration: 0.55 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="micro-label px-5 py-3 font-semibold">Dimension</th>
                    <th className="micro-label px-5 py-3 font-semibold">The 10% consultancy</th>
                    <th className="micro-label px-5 py-3 font-semibold !text-cyan-300">
                      The 10X consultancy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TEN_X.map((r) => (
                    <tr key={r.dimension} className="border-b border-line/60 last:border-0">
                      <td className="px-5 py-3 text-[12.5px] font-medium text-zinc-300">
                        {r.dimension}
                      </td>
                      <td className="px-5 py-3 text-[12.5px] text-zinc-500">{r.ten_pct}</td>
                      <td className="bg-cyan-500/[0.05] px-5 py-3 text-[12.5px] text-zinc-300">
                        {r.ten_x}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Her voice */}
        <section className="mt-20">
          <SectionHead
            icon={<MessageSquareQuote size={14} />}
            kicker="Step five · check it against your own words"
            title={
              <>
                We did not invent any of this.{" "}
                <span className="text-zinc-500">We read it back to you.</span>
              </>
            }
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {SPOKEN.map((q, i) => (
              <motion.div
                key={q.quote}
                className="card flex flex-col justify-between gap-4 p-6"
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[13.5px] italic leading-relaxed text-zinc-300">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div>
                  <a
                    href={q.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    {q.source} · {q.date}
                  </a>
                  <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-relaxed text-zinc-500">
                    {q.echo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mt-20">
          <SectionHead
            icon={<Layers size={14} />}
            kicker="Step six · where it might earn its keep"
            title={
              <>
                Five places this could help.{" "}
                <span className="text-zinc-500">
                  None of them ask you to become a software vendor.
                </span>
              </>
            }
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.name}
                className="card flex flex-col gap-3 p-6"
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[13.5px] font-semibold text-zinc-200">{s.name}</h3>
                  <span
                    className={`mono-num shrink-0 rounded-md px-2 py-1 text-[9px] font-bold tracking-[0.12em] ${
                      s.tag === "EXISTS TODAY"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-cyan-500/10 text-cyan-400"
                    }`}
                  >
                    {s.tag}
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-zinc-400">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Restraint + CTA */}
        <section className="mt-20 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <motion.div className="card p-6" {...reveal} transition={{ duration: 0.55 }}>
            <div className="flex items-center gap-2 text-zinc-300">
              <Lock size={14} />
              <span className="micro-label !text-zinc-400">
                What never gets automated, the physics of trust
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {VISION_RESTRAINTS.map((r) => (
                <li key={r} className="flex gap-2.5 text-[12.5px] leading-relaxed text-zinc-400">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="card flex flex-col justify-between gap-5 border-cyan-500/20 bg-cyan-500/[0.04] p-7"
            {...reveal}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            <div>
              <p className="micro-label !text-cyan-300/80">The proof is not this page</p>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-300">
                Stage one of the stack isn't a roadmap item. It runs, it
                refuses, it compiles charters, and it demos itself in ninety
                seconds.
              </p>
            </div>
            <Link
              href="/?run=1"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[14px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              Watch stage one fly
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </section>

        <p className="mt-10 text-[11px] text-zinc-600">
          Built by Pavan Kalyan. Independent work, not affiliated with or
          endorsed by YegaTech. Quotes verbatim, ≤15 words, attributed; the
          simulator is a labeled toy model, not a forecast.
        </p>
      </main>
    </div>
  );
}
