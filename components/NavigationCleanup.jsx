"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Universal DOM Safeguard
 * Prevents "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 * This fatal React DOMException occurs when GSAP pin-spacers, Google Translate, or browser extensions
 * modify DOM node hierarchy outside React's Virtual DOM during route unmounting/reconciliation.
 */
if (typeof window !== "undefined") {
  if (!window.__dom_remove_child_patched) {
    window.__dom_remove_child_patched = true;

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (!child || child.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[DOM Guard] Prevented removeChild on non-child node", child, this);
        }
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[DOM Guard] Prevented insertBefore on mismatched parent", newNode, referenceNode, this);
        }
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };

    // Auto-reload on stale ChunkLoadError from Next.js HMR or fresh deployments
    window.addEventListener("error", (e) => {
      if (e?.message && (e.message.includes("Loading chunk") || e.message.includes("ChunkLoadError"))) {
        console.warn("[Chunk Guard] Stale chunk detected, refreshing page...", e.message);
        window.location.reload();
      }
    });
  }
}

/**
 * NavigationCleanup
 * Safely kills active ScrollTriggers on route transitions without violently mutating
 * DOM elements that React is already preparing to unmount.
 */
export default function NavigationCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined") {
          gsap.registerPlugin(ScrollTrigger);
          const triggers = ScrollTrigger.getAll();
          triggers.forEach((trigger) => {
            // Kill without forcing DOM reparenting to let React unmount cleanly
            trigger.kill(false);
          });
          ScrollTrigger.clearMatchMedia();
        }
      } catch (err) {
        // Safe ignore
      }
    };
  }, [pathname]);

  return null;
}
