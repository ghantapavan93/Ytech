# ADR 001: Build a thin agent runtime, do not fork a framework

Status: accepted
Date: 28 August 2026

## Context

The working agent at `/agent` needs to route a typed task, run steps against
the project's engines, and hand judgment back to a human. The obvious move
is to fork one of the large open-source agent or assistant projects. We
surveyed twenty-two of them before deciding not to.

The requirements that did the deciding:

1. TypeScript, inside an existing Next.js 15 and React 19 app.
2. Runs with no API key attached, in a mode that is genuinely useful rather
   than a stub.
3. Human approval is a first-class primitive, not a pattern we hand-roll.
4. A licence that survives white-labelled commercial use.

## What the survey found

Star count turned out to be a poor guide. Three of the most attractive
targets fail on inspection.

| Project | Stars | Why it was rejected |
| --- | ---: | --- |
| Flowise | 55,399 | Archived and read-only. The highest-star visual builder is dead. |
| Dify | 153,694 | Modified Apache licence forbids multi-tenant operation without written permission. |
| Open WebUI | 150,153 | Licence prohibits removing its branding above 50 users in a rolling 30 days. |
| Khoj | 36,740 | AGPL-3.0. Network use triggers source disclosure. |
| AutoGen | 60,659 | Last push April 2026. Superseded by microsoft/agent-framework. |
| Onyx | 31,796 | Python. Loses end-to-end types, adds a second service. |
| LangGraph.js | 3,237 | The Python original has 40,571. The JS port carries 8% of the ecosystem. |

Four projects came through with clean licences and the right language:
Vercel AI SDK, CopilotKit, AnythingLLM, and LibreChat.

## Decision

**Build a purpose-built runtime. When a model is added, put it behind the
Vercel AI SDK.**

Forking any of the large apps means adopting a second product, with its own
auth, database, migrations, admin UI, and release cadence. Our need is one
feature inside an app that already exists. A fork diverges within weeks and
then charges rent forever.

The AI SDK earns the eventual dependency on four counts. Its licence is
plain Apache-2.0 with no enterprise carve-out and no branding clause. It is
the native path for this stack. Approvals are built in: a tool declares `needsApproval`, which also accepts
an async function so small actions pass and large ones gate, and the client
resolves it through `addToolApprovalResponse` from `useChat`. And keyless operation is a
supported feature: `ai/test` ships `MockLanguageModelV4` and
`simulateReadableStream`, so demo mode and the test suite become the same
code path.

Mastra was the serious runner-up and is better at durable state that
survives a process restart. It is also built on top of the AI SDK, so the
real question was whether we want its opinions about storage, bundling, and
its own dev server. For one feature, those opinions cost more than they pay.

## The part most people get wrong

Turning the language model off is easy. Turning the embeddings off is not.
A keyless mode whose only retrieval path is vector similarity has no
knowledge base at all, which makes the demo hollow exactly when it matters.

This project sidesteps the problem rather than solving it. There is no
retrieval layer. Every line the agent emits comes from a typed method
object with a published source attached, so the keyless mode is not a
degraded mode. It is the mode.

## The seam, built now rather than later

`lib/model-boundary.ts` defines the interface a model will sit behind. It
exists today, with the deterministic implementation wired in, because a
degraded path retrofitted after the fact is always half-wired, and the
first thing to quietly stop working is the part that refuses.

The contract is narrow. A model may write prose into a named slot. It may
never touch a refusal, a source attribution, a number, or a decision. Those
four travel as `sealed`, and `SealedDrafter` verifies them on the way out.
A drafter that rewrites a number or drops a refusal throws rather than
shipping prose that contradicts its own evidence. Twelve tests cover the
violations, including a rogue drafter that softens a refusal.

## Consequences

Good. No new dependency yet. Routing stays keyword scoring, which is
auditable in a way a model's choice is not. The agent runs anywhere,
including on a plane. The four protected categories are protected by types
and tests rather than by prompt instructions.

Costs. We wrote the runtime ourselves, so we maintain it. Keyword routing
handles five known jobs and refuses the sixth, which is the correct
behaviour but means new jobs are code rather than configuration. No durable
run state survives a restart; if approval-by-email is ever wanted, Mastra
or n8n is the shortcut and this decision should be revisited.

## If this is revisited

Add the SDK before adding a framework. The upgrade path is a second
implementation of `Drafter`, wrapped in `SealedDrafter`. No caller changes.

```bash
npm i ai @ai-sdk/groq @ai-sdk/react zod
npx ai-elements@latest add confirmation task tool
```

Build the mock provider first, before any real model call. Retrofitted, it
never quite works.

## Addendum, 28 August 2026: which provider

Groq goes first, for one reason that outweighs the others. It is the only
major provider still publishing an actual free-tier table: 30 requests a
minute and 1,000 a day, in writing. Google, Cerebras, and Mistral have all
retreated to "check your dashboard", and a rate-limit guard cannot be
written against a number nobody publishes. Groq also ships a first-party
provider package, and its latency keeps assisted mode from breaking the
ninety-second autopilot.

Gemini is not second on limits, it is second on data policy. Its own pricing
page confines the "content is not used to improve our products" guarantee to
the paid tier, so free-tier content is used for training. The draft slots in
this app carry client firm characteristics, which makes that the wrong
default for a tool shown to a prospective client. If Gemini is ever wired
in, the training caveat belongs in the interface, not a footnote.

Ollama stays on the ladder underneath both, because it is the only option
that preserves the property this whole ADR is about: it runs on a plane.

Two names in this document were checked against the current SDK and
corrected above. `toolApproval` is now `needsApproval`, and the install line
named the wrong provider package.
