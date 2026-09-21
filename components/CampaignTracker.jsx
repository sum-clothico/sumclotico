"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackCampaignVisit, trackPageView, trackEvent } from "@/lib/analytics";

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrolledMilestones = useRef(new Set());
  const startTimeRef = useRef(Date.now());

  // Track Page View and UTM parameters on route change
  useEffect(() => {
    const search = searchParams?.toString();
    const url = pathname + (search ? `?${search}` : "");
    trackPageView(url, document.title);
    trackCampaignVisit();

    scrolledMilestones.current.clear();
    startTimeRef.current = Date.now();
  }, [pathname, searchParams]);

  // Automated Scroll Depth Milestone Tracking (25%, 50%, 75%, 90%)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      const milestones = [25, 50, 75, 90];

      milestones.forEach((m) => {
        if (scrollPercent >= m && !scrolledMilestones.current.has(m)) {
          scrolledMilestones.current.add(m);
          trackEvent("scroll_depth", {
            depth_percent: m,
            page_path: pathname,
            page_title: document.title,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Time on Page Engagement Milestones (15s, 30s, 60s, 120s)
  useEffect(() => {
    const intervals = [15, 30, 60, 120];
    const timers = intervals.map((sec) =>
      setTimeout(() => {
        trackEvent("user_engagement", {
          engagement_time_msec: sec * 1000,
          time_seconds: sec,
          page_path: pathname,
        });
      }, sec * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  // Outbound Link & Social Channel Click Tracking
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor || !anchor.href) return;

      const href = anchor.href;
      const isExternal = href.startsWith("http") && !href.includes(window.location.host);

      if (isExternal) {
        let channel = "external_link";
        if (href.includes("wa.me") || href.includes("whatsapp.com")) channel = "whatsapp";
        else if (href.includes("instagram.com")) channel = "instagram";
        else if (href.includes("facebook.com")) channel = "facebook";
        else if (href.includes("pinterest.com")) channel = "pinterest";

        trackEvent("outbound_click", {
          destination_url: href,
          channel,
          link_text: anchor.innerText?.slice(0, 50) || "outbound",
          page_path: pathname,
        });
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [pathname]);

  return null;
}

export default function CampaignTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}

