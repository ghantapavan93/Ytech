import { VisionContent } from "@/components/VisionContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Vision · Value Shift",
  description:
    "First principles for the AI consulting firm of the future: own the instrument layer, compound evidence every engagement, and let the learning rate, not the model, become the moat.",
};

export default function VisionPage() {
  return <VisionContent />;
}
