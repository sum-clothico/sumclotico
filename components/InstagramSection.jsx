"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiInstagram, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InstagramSection() {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isLive && data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts.slice(0, 4));
        } else {
          setPosts([]);
        }
        setIsLoaded(true);
      })
      .catch((_) => {
        setPosts([]);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Header animation
      gsap.fromTo(
        section.querySelectorAll(".ig-anim-header"),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );

      // Cards stagger animation
      const cards = section.querySelectorAll(".ig-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [posts]);

  // If not loaded yet or no real posts from the live API, show blank (nothing rendered)
  if (!isLoaded || posts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="ig-section"
      style={{
        backgroundColor: "var(--bg-color, #EDE8DC)",
        padding: "clamp(50px, 8vh, 90px) clamp(16px, 4vw, 40px)",
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header Block */}
        <div
          className="ig-anim-header"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: "clamp(24px, 4vw, 40px)",
            paddingBottom: 20,
            borderBottom: "1px solid rgba(44, 32, 22, 0.12)",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#660608",
                marginBottom: 8,
              }}
            >
              <FiInstagram size={15} />
              <span>@sumclothico · Follow on Instagram</span>
            </div>
            <h3
              style={{
                fontFamily: "inherit",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 600,
                color: "#2C2016",
                margin: "4px 0 6px",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Real people living in Sum.
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(13px, 1.2vw, 15px)",
                color: "#6B5A4E",
              }}
            >
              Wear your everyday stories with us. Tag #SumClothico to be featured.
            </p>
          </div>

          <a
            href="https://www.instagram.com/sumclothico/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              background: "#2C2016",
              color: "#FAF6F0",
              boxShadow: "0 4px 14px rgba(44, 32, 22, 0.15)",
              transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
          >
            <span>Visit Instagram</span>
            <FiArrowUpRight size={16} />
          </a>
        </div>

        {/* 4 Photo Grid */}
        <div
          className="ig-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(14px, 2vw, 24px)",
          }}
        >
          {posts.map((post, idx) => (
            <a
              key={post.id || idx}
              href={post.permalink || "https://www.instagram.com/sumclothico/"}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-card"
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                aspectRatio: "3 / 4",
                background: "#EBE5D9",
                boxShadow: "0 8px 24px rgba(44, 32, 22, 0.08)",
                cursor: "pointer",
                display: "block",
                textDecoration: "none",
                transform: "translateZ(0)",
              }}
            >
              <img
                src={post.media_url || post.img}
                alt={post.caption || "Sum Clothico Instagram Post"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(30, 20, 12, 0.85) 0%, rgba(30, 20, 12, 0.1) 45%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(250, 246, 240, 0.85)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  <FiInstagram size={12} />
                  <span>@sumclothico</span>
                </div>
                <p
                  style={{
                    color: "#FAF6F0",
                    fontSize: 12,
                    margin: 0,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
