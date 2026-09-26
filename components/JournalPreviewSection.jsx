"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiMessageCircle, FiClock } from "react-icons/fi";

const FEATURED_STORIES = [
  {
    id: "bharatpur-weavers",
    category: "PLACES",
    title: "The Handlooms of Bharatpur: Walking Through Madhya Pradesh's Weaving Villages",
    excerpt:
      "A morning spent among wooden frame looms, listening to the rhythm of shuttles and the artisans who turn raw cotton into living cloth.",
    image: "/assets/wev.jpg",
    readTime: "4 min read",
    author: "Sum Field Notes",
    tagColor: "#C85A32", // Warm terracotta
  },
  {
    id: "khadi-museum",
    category: "CLOTH",
    title: "Inside The Khadi Museum: Living Archives of Slow Time",
    excerpt:
      "From charkha revolutions to contemporary wardrobes — why the simplest textile in human history remains our most radical act of living.",
    image: "/assets/chakra.jpg",
    readTime: "5 min read",
    author: "Textile Archives",
    tagColor: "#395B64", // Deep indigo-slate
  },
  {
    id: "everyday-women",
    category: "PEOPLE",
    title: "Real Living: How Women Wear Sum from Morning Coffee to Slow Evenings",
    excerpt:
      "Conversations with architects, ceramicists, and writers on why clothes should feel lighter, softer, and more honest with every passing season.",
    image: "/assets/img/20.png",
    readTime: "6 min read",
    author: "Community Stories",
    tagColor: "#4A5B4E", // Deep sage green
  },
];

export default function JournalPreviewSection() {
  return (
    <section
      id="home-journal"
      style={{
        background: "#FAF8F5",
        padding: "100px 24px 110px",
        position: "relative",
        borderTop: "1px solid #ECE7E1",
        borderBottom: "1px solid #ECE7E1",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "#F0EAE1",
              color: "#C85A32",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <FiBookOpen size={13} />
            <span>The Sum Journal</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(30px, 4.5vw, 48px)",
              fontWeight: 800,
              color: "#1A1714",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 16px",
              fontFamily: "var(--font-serif, inherit)",
            }}
          >
            Things worth talking about.
          </h2>

          <p
            style={{
              fontSize: "clamp(15px, 1.4vw, 17px)",
              color: "#5C554E",
              lineHeight: 1.65,
              margin: "0 auto",
              maxWidth: 640,
            }}
          >
            Clothes are rarely just clothes. They carry memories. They tell us where we&apos;ve been.
            They introduce us to people and places. And sometimes, they make us feel like ourselves again.
          </p>
        </div>

        {/* Stories Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            marginBottom: 56,
          }}
        >
          {FEATURED_STORIES.map((story) => (
            <Link
              key={story.id}
              href="/journal"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                background: "#FFFFFF",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #ECE7E1",
                boxShadow: "0 6px 24px rgba(44, 38, 30, 0.04)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(44, 38, 30, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(44, 38, 30, 0.04)";
              }}
            >
              {/* Card Image Banner — Portrait 4:3 / 16:11 Aspect */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  background: "#F0EAE1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Category Pill */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(6px)",
                    color: story.tagColor,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {story.category}
                </div>
              </div>

              {/* Card Content */}
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 12,
                      color: "#8C827A",
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    <span>{story.author}</span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <FiClock size={12} />
                      {story.readTime}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1A1714",
                      lineHeight: 1.35,
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {story.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 14,
                      color: "#6B635B",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {story.excerpt}
                  </p>
                </div>

                {/* Read Link */}
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid #F0EAE1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#1A1714",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <span>Read Article</span>
                  <FiArrowRight size={15} color="#C85A32" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Bottom Actions / Community Hook */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "36px 40px",
            border: "1px solid #ECE7E1",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            boxShadow: "0 4px 20px rgba(44, 38, 30, 0.03)",
          }}
        >
          <div style={{ maxWidth: 580 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#C85A32",
                display: "block",
                marginBottom: 6,
              }}
            >
              Have a story? Tell us.
            </span>
            <h4
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                fontWeight: 800,
                color: "#1A1714",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              Share your thoughts, discoveries, or memories.
            </h4>
            <p style={{ fontSize: 14, color: "#6B635B", margin: 0, lineHeight: 1.55 }}>
              Maybe you know a weaver we should meet, or a textile from your hometown. We welcome words, photographs, and field notes from our community.
            </p>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/journal"
              style={{
                background: "#1A1714",
                color: "#FFFFFF",
                padding: "14px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span>Explore The Journal</span>
              <FiArrowRight size={15} />
            </Link>

            <Link
              href="/contact"
              style={{
                background: "#F0EAE1",
                color: "#1A1714",
                padding: "14px 24px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #E2D9CE",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#E6DDD0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#F0EAE1")}
            >
              <FiMessageCircle size={15} />
              <span>Share Something with Us</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
