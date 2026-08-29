import { describe, expect, it } from "vitest";
import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";
import { roomCharter } from "./charter";

/**
 * The closing document has to describe the firm the room just watched.
 *
 * It did not. The room could be switched to a fixed fee with a junior
 * safeguard in place and still close on a charter reading "Hourly" and
 * "None in place", because the charter came from a different framing of the
 * same firm. That is two baselines for one firm, which this project has now
 * corrected three times, so it is worth a test rather than care.
 */

const RETUNED: Levers = {
  ...NAIVE_DEPLOYMENT,
  pricingModel: "FIXED_FEE",
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

const read = (levers: Levers) => {
  const out = runEngine(ATLAS_BASELINE, levers);
  const fields = roomCharter(out, levers);
  return { out, text: fields.map((f) => `${f.label}: ${f.value}`).join("\n") };
};

describe("the room charter follows the room", () => {
  it("names the fee model the room actually chose", () => {
    expect(read(NAIVE_DEPLOYMENT).text).toMatch(/Hourly\. Every saved hour/);
    expect(read(RETUNED).text).toMatch(/Fixed fee per package/);
  });

  it("names the junior safeguard the room actually chose", () => {
    expect(read(NAIVE_DEPLOYMENT).text).toMatch(/Deep-practice hours are at zero/);
    expect(read(RETUNED).text).toMatch(/20 percent manual first pass/);
  });

  it("quotes the same review hours the drawing shows", () => {
    for (const levers of [NAIVE_DEPLOYMENT, RETUNED]) {
      const { out, text } = read(levers);
      expect(text).toContain(out.peHoursPerWeek.toFixed(1));
      expect(text).toContain(
        String(ATLAS_BASELINE.pePillarSustainableHrsPerWeek),
      );
    }
  });

  it("never reports quality as measured, whatever the levers say", () => {
    // The one field no lever can satisfy. It is why the answer is an
    // experiment and not a deployment.
    for (const levers of [NAIVE_DEPLOYMENT, RETUNED]) {
      expect(read(levers).text).toMatch(/Unmeasured\. A blind audit/);
    }
  });

  it("says where the capacity goes, or that nobody decided", () => {
    expect(read(NAIVE_DEPLOYMENT).text).toMatch(/nowhere named to send them/);
    expect(read(RETUNED).text).toMatch(/routed to billable backlog/);
  });
});
