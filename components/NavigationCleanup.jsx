"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Universal DOM Safeguard
 * Prevents "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 * This occurs when GSAP pin-spacers or extensions modify DOM hierarchy outside React's Virtual DOM.
 * When React unmounts an element reparented by GSAP, this safely removes it from its actual parent,
 * preventing zombie orphaned sections from lingering across route changes.
 */
if (typeof window !== "undefined") {
  if (!window.__dom_remove_child_patched) {
    window.__dom_remove_child_patched = true;

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (!child) return child;
      if (child.parentNode !== this) {
        try {
          if (child.parentNode) {
            const parent = child.parentNode;
            originalRemoveChild.call(parent, child);
            if (
              parent.classList &&
              parent.classList.contains("pin-spacer") &&
              parent.parentNode === this
            ) {
              originalRemoveChild.call(this, parent);
            }
          }
        } catch (_) {}
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        try {
          if (referenceNode.parentNode) {
            return originalInsertBefore.call(referenceNode.parentNode, newNode, referenceNode);
          }
        } catch (_) {}
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
 * Safely reverts and kills active ScrollTriggers on route transitions so
 * all pinned elements and spacers unwrap cleanly without lingering into other routes.
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
            // Revert pins cleanly to restore original DOM tree before route leaves
            trigger.kill(true);
          });
          ScrollTrigger.clearMatchMedia();

          // Remove any lingering orphaned pin-spacers
          document.querySelectorAll(".pin-spacer").forEach((spacer) => {
            if (spacer.parentNode && spacer.children.length === 0) {
              spacer.parentNode.removeChild(spacer);
            }
          });
        }
      } catch (err) {
        // Safe ignore
      }
    };
  }, [pathname]);

  return null;
}
