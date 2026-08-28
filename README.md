# Value Shift · the AEC AI Economics Wind Tunnel

> **This agent is 42% faster. The firm should not deploy it. Yet.**

A deterministic scenario-rehearsal instrument. It takes one technically
successful AI workflow (a spec-QA agent inside Atlas Structural & Civil, a
synthetic 45-person firm) and propagates it through the operating system the
technology has to live inside: the fee model, the utilization incentives, the
licensed-PE review gate, and the apprenticeship pipeline. Then it lets
leadership re-tune those four levers live and compiles a bounded 30-day
experiment charter, never a deployment recommendation.

Built as a working prototype in the spirit of YegaTech's thesis
(*"AI won't disrupt AEC, but organizations that redesign work will"*, the
title of Dr. Sam Zolfagharian's May 2026 Egnyte keynote). Independent work,
not affiliated with YegaTech.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # 137 invariant tests across ten suites
npm run build    # production build (deploys clean to Vercel)
```

## Autopilot, the demo that runs itself

Click **▶ Watch the 90-second run** (hero or header) and the instrument
performs the entire story on its own: it resets to the naive state, walks
the stages, narrates with cinematic captions, flips all four levers live
(the redeployment slider visibly eases 0 → 100%), compiles the charter,
glances at Horizon Two, and lands on the closing line. Nothing is canned, the autopilot presses the same state setters a human would, and the engine
recomputes every number in real time. `Esc` or **Skip** hands control back
instantly; the end card offers Replay or free exploration of the state it
built.

Shareable auto-play link: append `?run=1` to the URL and the run starts by
itself, the link to send someone who should just watch. (`?run=fast` is a
6× QA variant.)

## The 90-second demo path (manual)

1. **Stage 1, the illusion.** Terminal run, 42% faster, `TECHNICAL TEST:
   PASSED`. Click **Simulate organizational impact**.
2. **Stage 2, the shockwave.** Verdict: the technology worked, the operating
   system rejected it. Margin down $9,170 a month, PE gate at 26.25 hours a
   week, junior utilization 53%, apprenticeship dark. All four pillars red.
3. **Stage 3, the levers.** Switch pricing to fixed fee, route 100% of freed
   hours to backlog, set the risk-tiered delta gate, turn on the 20% blind
   audit. The system recalculates to **+$22,120 a month, OPTIMAL
   GOVERNANCE**. Note the honest tradeoff: dropping the audit earns $28,000
   but zeroes the learning floor, so that $5,880 gap is the price of future
   PEs.
4. **Stage 4, the charter.** One printable page: owner, bounded scope,
   verifiable targets, deterministic stop conditions, assumption hash. Four
   preset chips reset the room in one click.
5. **Stage 5, Horizon Two.** One run is a demo, a library is a moat. Every
   run compiles one anonymized, downloadable evidence node, pinned by unit
   tests that fail if a name or dollar figure ever enters it. A synthetic
   pattern library files THIS RUN alongside five prior engagements and
   derives findings by scanning nodes rather than asserting them.

## The other routes

| Route | What it is |
| --- | --- |
| `/progress` | Proof of Progress. A green pilot report traced down seven links, from the agent having run to whether the firm was any better off. An unmeasured link blocks rather than passes, so the instrument refuses to call the pilot a success. Add readings at day thirty and the decision rewrites itself. |
| `/proof` | The Proof Office. An authorization rests on eight named conditions. Break a critical one and the decision expires while the agent keeps working. Repairing it earns a bounded retest, never the clearance you had before. |
| `/agent` | The working agent. Type a task, it routes to one of five known jobs, runs the engines, and hands back a work product plus an explicit list of what it will not decide. No model attached. Every run refuses something out loud. |
| `/prep` | The prep board. Enter what you know about a firm and it returns a six-part prep sheet built from published method, every line carrying its source. Keep or set aside each line and it remembers. |
| `/record` | The decision record. Both instruments end in a decision and neither remembered what happened next. Each one now climbs a ladder from claimed to sustained, or is retired on purpose with the reason kept. Only proven records may contribute a pattern. |
| `/stack` | The capability stack. Ten layers an advisory practice runs on, eight productized offers with real published price ranges, and an honest read on which layers a two-person firm can own. Names no competitors, deliberately. |
| `/thesis` | The receipts. Every mechanism mapped to the published claim it operationalizes, quoted and dated. Plus the room's own words, where the premise is weak, the Index lens, and the grounding behind every assumption. |
| `/review` | The kill review. The adversarial review that produced this, including the four fatal charges against earlier concepts and the tournament that picked this one. |
| `/vision` | The vision. First principles, the four-stage instrument stack, and a working compounding simulator. Written as a proposal, not a plan. |

## Architecture

```
app/                    One route per instrument. Server components except
                        where a page drives state.
components/             UI. Feature folders where a page owns several parts.
components/progress/    Proof of Progress: four acts, a state hook, and the
                        shared style vocabulary they argue in.
lib/engines/            The deterministic models, each beside its tests.
                        Zero dependencies, zero LLM involvement. Every
                        number is arithmetic over explicit assumptions.
lib/content/            Researched data and copy. No logic, so a claim can
                        be checked against its source without reading code.
lib/format.ts           Money, percent and hours formatting, plus the
                        FNV-1a assumption hash.
lib/presets.ts          One-click demo states.
lib/nav-data.ts         The command surface: every route, described once.
docs/                   Decision records.
```

Tests sit next to the code they pin rather than in a separate tree, so a
change to an engine and a change to its guarantees show up in the same
diff. Ten suites, 137 tests.

### Local dev note (OneDrive)

This project lives inside a OneDrive-synced folder, and OneDrive races the
dev server's `.next` writes (vanishing `.tmp` manifests → 500s). The repo
works around it: `.next` is a directory **junction** to
`~\.value-shift-next` (outside OneDrive), and the `dev`/`build` scripts set
`NODE_PATH` so modules still resolve from the project when Next executes
code from the junction's real path. On Vercel/Linux the `set NODE_PATH`
prefix is inert and harmless. If the junction is ever deleted, recreate it:

```powershell
New-Item -ItemType Junction -Path .next -Target "$HOME\.value-shift-next"
```

### The causal model, in one paragraph

Junior production hours shrink by the agent speedup. Under time-and-materials
pricing, un-billed hours become a revenue loss unless freed capacity is
redeployed to backlog; under fixed fees the firm keeps the saving. Raw AI
output forwarded upstream surges PE verification 75% (the review gate is the
new bottleneck); a risk-tiered delta gate holds it at 1.0h/package; accepting
raw output ships unreviewed work on a licensed stamp, an automatic rejection
regardless of margin (ASCE Policy 573, NSPE BER Case 24-2). Idle saved hours
collapse the utilization metric PMs are rated on. Full automation zeroes the
deep-practice hours that grow future PEs; a 20% blind audit preserves a
learning floor at a real, visible cost. The verdict and 30-day charter are
derived, not asserted.

### What this is not

Not an ROI predictor, not a dashboard, not an agent registry. It refuses to
invent real-world numbers: every figure is labeled synthetic and editable, and
"do not deploy" is a first-class output.
