/**
 * What the category cannot say.
 *
 * Around forty-five readiness assessments, maturity models and return
 * calculators were examined, thirteen with their formulas extracted and
 * several driven live to their worst case.
 *
 * A first pass of this research concluded that no calculator can return a
 * loss. That was too strong and it is corrected below: six of thirteen
 * can, and one of them is genuinely excellent. The claim that survives is
 * narrower and sharper, which is the better outcome.
 *
 * Enterprise vendors are unnamed here, consistent with the rest of the
 * page. Two exceptions are named because the point is a compliment: the
 * AIA, whose toolkit is cited approvingly elsewhere on this site, and the
 * one calculator that models the downside properly and deserves the
 * credit.
 */

export interface FloorCase {
  n: string;
  mechanism: string;
  evidence: string;
  isCode: boolean;
  reading: string;
  /** Marks the honourable exception rather than another failure. */
  exception?: boolean;
}

export const FLOOR_CASES: FloorCase[] = [
  {
    n: "01",
    mechanism: "The official formula has no investment term",
    evidence: "value = assisted hours × hourly rate",
    isCode: true,
    reading:
      "No licence, no build, no maintenance. Failed sessions still earn value: escalated and abandoned ones are weighted at 0.7. The same page warns, one paragraph earlier, that claiming value from theoretical time savings undermines credibility, and then publishes precisely that formula.",
  },
  {
    n: "02",
    mechanism: "Clamps both outputs to zero",
    evidence: "Math.max(0, …)",
    isCode: true,
    reading:
      "The improvement rates are hard-coded constants rather than inputs: an eighty percent cut in handling time, an eighty-five percent cut in matching hours, a fixed ninety-nine percent accuracy target. The growth sliders are floored at five percent, so the model cannot represent flat demand, let alone falling demand.",
  },
  {
    n: "03",
    mechanism: "Every branch terminates in a benefit or zero",
    evidence: "(getter('V1.enabled') ? getter('V1.benefit') : 0.0)",
    isCode: true,
    reading:
      "No negative branch exists anywhere in the model, and the smallest annual case volume the form will accept is five thousand. There is no licence cost, no implementation cost, no cost line of any kind.",
  },
  {
    n: "04",
    mechanism: "Set every input to its own declared minimum",
    evidence: "+856.8% return, one-month payback",
    isCode: false,
    reading:
      "Six inputs, all of them benefit drivers, all floored above zero. Its largest single term is a hard-coded twenty percent of your revenue, which is unrelated to the AI being evaluated.",
  },
  {
    n: "05",
    mechanism: "It multiplies saved hours by the billing rate",
    evidence: "calculator___billable_rate",
    isCode: true,
    reading:
      "This one is an AEC tool, and the field name is real. In its model, eliminating billable work increases the reported return. The time-and-materials inversion this whole instrument was built to expose is shipping in production, arguing the case for us. Exactly one calculator found frames it correctly, by modelling a utilization increase into additional billable hours rather than treating a saved hour as money.",
  },
  {
    n: "06",
    mechanism: "The honourable exception, and proof it can be done",
    evidence: "−$16,519,000, return −197.5%",
    isCode: false,
    reading:
      "Free, ungated, whole formula readable. It carries an explicit cost for the productivity dip during adoption, a tooltip telling you to subtract the verification tax of code review, and defaults that assume the change makes quality slightly worse, shipping a negative downtime line out of the box. Drive its time-saving input negative and it reports a sixteen million dollar loss. One tool in this landscape will tell you the work got slower.",
    exception: true,
  },
];

export interface FloorFinding {
  title: string;
  body: string;
  headline?: boolean;
}

export const FLOOR_FINDINGS: FloorFinding[] = [
  {
    title: "The number can go negative. The recommendation never does.",
    body: "One calculator does model a loss, and it is the only one found that treats value capture honestly. Driven to its worst case it returned 0.42x: fourteen thousand dollars in, under six thousand out. The recommendation text at that setting was then compared byte for byte against the text at 2.63x. Identical. Both invite you to book the same thirty-minute call. Showing a loss and advising against acting turn out to be entirely different capabilities, and the second one is the rare one.",
    headline: true,
  },
  {
    title: "A correction, because the first pass overstated this",
    body: "An earlier reading of this research concluded that no calculator can return a loss. With thirteen formulas extracted rather than four, six of them can and one hides a negative it has already computed. The decisive variable is not sophistication, it is simply whether the tool has a cost input a user can edit. The claim that survives is narrower: what is missing is not arithmetic that can go negative, it is advice that can.",
  },
  {
    title: "On maturity and readiness, the refusal count is still zero",
    body: "Around twenty-five readiness and maturity instruments, and not one puts a stop verdict at the bottom of its scale. Every scale is a ladder to climb. One framework contains exactly the right question, whether development or deployment should proceed at all, and deliberately computes no score, so it can say do not and calculates nothing.",
  },
  {
    title: "The one instrument that refuses inherited the refusal",
    body: "A free compliance checker built by a non-profit returns a hard stop, styled as a danger state, when a system touches any of eight prohibited practices. It can do that because the prohibition comes from a statute rather than from a threshold anyone had to choose. Every instrument that had to draw its own line declined to draw one.",
  },
  {
    title: "The comfortable middle is where the arithmetic sends you",
    body: "The AIA's AI Firm Toolkit is free, ungated and publishes its algorithm, which makes it the most honest instrument in this field and the only one that can be audited. Compute its full outcome space across all 1,024 answer patterns and the bottom tier is reachable by 2.1 percent of them, the top by 2.1 percent, and 95.9 percent land in the two comfortable middle bands.",
  },
  {
    title: "Its prose already knows what its score cannot say",
    body: "The same toolkit warns, in words, not to count time savings as pure savings and always to include verification time. That is exactly right, and it is exactly what a four-tier maturity score has no way to express. The guidance and the instrument are disconnected, and that gap is the one an actual model closes.",
  },
  {
    title: "Nobody models the second order",
    body: "Of thirteen calculators with formulas extracted: ten are single-period arithmetic, three discount properly, none is probabilistic, and none has a feedback loop of any kind. Three model value capture. So the gap is not that a spreadsheet cannot subtract, it is that almost nothing represents a saved hour arriving somewhere else, a reviewer slowing down, or a decision that ages.",
  },
  {
    title: "The transparent ones are the ones with nothing to sell",
    body: "A non-profit, two governments and a professional body publish their scoring. The consultancies do not, and four of the seven best-known consultancy maturity models turn out to be survey reports assigning tiers to respondents rather than instruments anyone can take. Two platform vendors are the exception and publish everything, because in their case the assessment sells infrastructure rather than itself.",
  },
  {
    title: "The ladder is the product, and it is rented",
    body: "Questionnaire, weighted score, tier, PDF, sales call. Not merely the dominant format but a subscription category starting around sixty-nine dollars a month, sold to consultants with automatic report generation included. One platform states the purpose plainly in its own marketing: a maturity model gives prospects the motivation to advance from one level to the next.",
  },
  {
    title: "Nobody has built the model everybody is writing essays about",
    body: "Searched for a public, browser-playable model where somebody sets an adoption rate and watches margin, capacity and employment recompute over time. Nothing clears the bar. Relax it and the count moves: one student project, two economy-level models, three if a PDF counts, about six once sales-gated tools are allowed. At organisation level, for AI economics, in public, the number is zero. Meanwhile the essays about AI breaking the billable hour are endless.",
  },
  {
    title: "The one public model that can be driven somewhere bad",
    body: "An independent research lab publishes a free economy-level simulator with editable parameters, preset scenarios and run comparison. Two of its five automation charts are labour share of income and the marginal product of human labour, and both fall on the default run. It is the proof the format works. It is also about the economy rather than about a firm.",
  },
  {
    title: "The best free simulator added AI as an electricity load",
    body: "The most respected public policy simulator added explicit AI modelling in July 2026, in the form of six new sliders for data-centre energy demand. The one place where AI is a driveable parameter in a serious free model treats it as demand on the grid rather than as a change in how work gets done.",
  },
  {
    title: "For architecture and engineering, there is nothing",
    body: "No AI return calculator exists for AEC firms. Every AEC calculator located returns zero hits for AI, machine learning, or generative anything in its model code. They are BIM and document-management tools, one of which hard-codes onboarding training cost to return zero. The sophisticated multi-period machinery exists elsewhere in the market, and AEC buyers do not get it.",
  },
];

export const FLOOR_WHY =
  "There is a reason none of these can be driven anywhere. Almost every one of them rests on the same substrate, a public catalogue of work activities crossed with employment and wage data, and they differ only in who was asked to judge it. Patents, crowd workers, a language model, expert panels, usage logs, a homegrown classifier. They disagree because the judge differs, not because the world differs. The judgement was made once, offline, and frozen into a column, which is exactly what a column cannot un-freeze when a firm's own conditions change.";

export const FLOOR_CONTRAST =
  "The instrument on this site opens on a negative number. Its default demonstration ends in a recommendation not to deploy, the configuration with the best margin on paper is rejected outright on professional-liability grounds, and a decision that has expired cannot be repaired back into the clearance it used to have. That is not a better calculator. It is a different claim about what a calculator is for.";

export const FLOOR_METHOD =
  "Around forty-five instruments surveyed, thirteen calculators with formulas extracted, roughly twenty-five readiness and maturity models reviewed. Several were read by pulling scoring logic out of client-side source or public APIs, several driven live to their worst case. No forms were submitted and no gates bypassed. One conclusion was overturned mid-research and the correction is published above rather than quietly dropped.";
