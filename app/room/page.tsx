import { RoomMode } from "@/components/room/RoomMode";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room mode · Value Shift",
  description:
    "One screen, five minutes, one decision. A working agent run through the operating model that has to absorb it, live, in front of a room.",
};

export default function RoomPage() {
  return <RoomMode />;
}
