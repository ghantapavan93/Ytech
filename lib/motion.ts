import type { Transition } from "framer-motion";

/**
 * One motion vocabulary, so the whole site moves like one thing.
 *
 * Before this, `[0.16, 1, 0.3, 1]` was written out in about twenty files and
 * the durations beside it were picked one at a time. Nothing was wrong in
 * isolation and the result still felt slightly assembled, which is what Emil
 * Kowalski means by an animation feeling right: easing and duration have to
 * agree across a product, not within a component.
 *
 * The split that matters here is between motion that answers a click and
 * motion that introduces content.
 *
 * Feedback is a spring. A spring has no fixed duration, so a second click
 * mid-flight retargets from wherever the element currently is instead of
 * queueing behind the first. That is interruptibility, and both Kowalski's
 * fifth principle and Apple's motion guidance ask for it in the same words:
 * do not make somebody wait out an animation they are going to see again.
 *
 * Entrances are a duration curve. They happen once, as content scrolls into
 * view, and nobody is waiting on them, so they are allowed to be slower and
 * more deliberate than anything that answers an input.
 *
 * Both springs below are very close to critically damped, so they arrive
 * without overshoot. Wobble reads as decoration, and this is a site that
 * argues against decoration.
 */

/**
 * Answering a click. Settles in about 150ms.
 *
 * Damping ratio ~1.0 at stiffness 520 / mass 0.7, which is the fastest this
 * can be without bouncing.
 */
export const SNAP: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
};

/**
 * Something travelling to a new place: a row that has been re-ranked, a
 * panel finding its height. Settles in about 210ms.
 *
 * Slower than SNAP on purpose. A larger displacement wants a longer arc or
 * it reads as a jump cut, which is the one part of this that is taste rather
 * than physics.
 */
export const SETTLE: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.9,
};

/**
 * Content arriving as it scrolls into view. Not feedback, so the 300ms
 * ceiling that applies to interaction does not apply here.
 */
export const ENTER_EASE = [0.16, 1, 0.3, 1] as const;

export const ENTER: Transition = { duration: 0.5, ease: ENTER_EASE };

/** The same entrance, for something small enough that half a second drags. */
export const ENTER_QUICK: Transition = { duration: 0.32, ease: ENTER_EASE };
