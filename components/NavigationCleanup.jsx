"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * NavigationCleanup
 * Automatically unpins any active GSAP pin-spacers and kills obsolete
 * ScrollTrigger instances when the user navigates between routes.
 * This permanently prevents "Failed to execute 'removeChild' on 'Node'"
 * runtime crashes during Next.js client-side page transitions.
 */
export default function NavigationCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // When leaving the current route, cleanly revert and kill all ScrollTriggers
    return () => {
      try {
        if (typeof window !== "undefined") {
          gsap.registerPlugin(ScrollTrigger);
          const triggers = ScrollTrigger.getAll();
          triggers.forEach((trigger) => {
            // Revert pin-spacer back to original DOM structure before React unmounts
            if (trigger.pin) {
              trigger.kill(true); // true = revert pin-spacer
            } else {
              trigger.kill();
            }
          });
          ScrollTrigger.clearMatchMedia();
        }
      } catch (err) {
        console.warn("[NavigationCleanup] Error cleaning up ScrollTriggers:", err);
      }
    };
  }, [pathname]);

  return null;
}
