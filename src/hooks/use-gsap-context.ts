import { useEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * React binding for GSAP's `gsap.context()`.
 *
 * `gsap.context(func, scope)` invokes `func` **synchronously**, passing its
 * own `gsap.Context` instance as `func`'s first argument. Every tween,
 * timeline, and ScrollTrigger created inside `func` — including ones built
 * from plain selector strings like `gsap.to(".card", ...)` — is
 * automatically scoped to `scope` and gets cleaned up in one call to
 * `context.revert()`. That single `revert()` is what makes this pattern
 * safe under React 18/19 Strict Mode, which mounts, unmounts, and
 * remounts effects once in development: every remount reverts the
 * previous context before creating a fresh one, so nothing leaks and
 * nothing doubles up.
 *
 * IMPORTANT: because `gsap.context()` runs `func` immediately, `func` must
 * never close over the variable that `gsap.context()`'s own return value
 * is about to be assigned to (e.g. `const ctx = gsap.context(() =>
 * callback(ctx), scope)`) — `ctx` would still be in the temporal dead zone
 * at that point and throw `ReferenceError: Cannot access 'ctx' before
 * initialization`. The fix is to let GSAP hand the context to the
 * callback itself, as done below, rather than reaching for an
 * outer-scoped variable.
 *
 * @param callback   Receives the live `gsap.Context` (rarely needed —
 *                    mainly useful for `context.add()` if you want to
 *                    expose named, replayable animations).
 * @param deps        Effect dependency list; the context is torn down and
 *                    rebuilt whenever these change, same as any effect.
 * @returns           A ref to attach to the DOM node GSAP should scope
 *                    selector-based animations to.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  callback: (context: gsap.Context) => void,
  deps: DependencyList = []
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);

  useEffect(() => {
    const ctx = gsap.context(callback, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
