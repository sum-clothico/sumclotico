"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const YT_VIDEO_ID = "foEIJ8aX0b0";

export default function VideoPinSection() {
  const sectionRef = useRef(null);
  const videoBoxRef = useRef(null);
  const ytContainerRef = useRef(null);
  const playerObjRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const createPlayer = () => {
      if (!ytContainerRef.current) return;
      playerObjRef.current = new window.YT.Player(ytContainerRef.current, {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: YT_VIDEO_ID,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        createPlayer();
      };
    }

    // Circle clip-path pinned scroll animation (desktop only)
    if (!mobile && sectionRef.current && videoBoxRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
        },
      });

      tl.to(videoBoxRef.current, {
        clipPath: "circle(100% at 50% 50%)",
        duration: 1,
        ease: "power2.inOut",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === sectionRef.current) t.kill();
      });
      if (playerObjRef.current && playerObjRef.current.destroy) {
        playerObjRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="vd-pin-section" ref={sectionRef}>
      <div
        ref={videoBoxRef}
        className="video-box"
        style={{
          clipPath: isMobile
            ? "circle(100% at 50% 50%)"
            : "circle(8% at 50% 50%)",
        }}
      >
        <div ref={ytContainerRef} className="video-box__player" />

        <div className="video-box__overlay">
          {/* Spinning circle text */}
          <svg
            className="video-box__spin-circle"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                id="circlePath"
                d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0"
                fill="none"
              />
            </defs>
            <text className="video-box__circle-text">
              <textPath href="#circlePath" startOffset="0%">
                OUR CRAFT • BEHIND THE LOOM • SUM CLOTHICO •&nbsp;
              </textPath>
            </text>
          </svg>
          {/* Play button */}
          <div className="video-box__play-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M6 12V5.20128C6 4.37664 6.89256 3.86113 7.60685 4.27322L19.3914 11.072C20.1061 11.4843 20.1061 12.5158 19.3914 12.9281L7.60685 19.7269C6.89256 20.139 6 19.6234 6 18.7988V12Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
