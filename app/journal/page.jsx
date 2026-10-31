"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import PageHeaderHero from "@/components/PageHeaderHero";
import Link from "next/link";
import IndianArchBadge from "@/components/IndianArchBadge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiSend,
  FiCalendar,
  FiUser,
  FiInstagram,
  FiArrowRight,
  FiX,
  FiClock,
  FiPlay,
  FiCheck
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWords({ text, className = "journal-anim-word" }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            marginRight: i === words.length - 1 ? 0 : "0.26em",
          }}
        >
          <span className={className} style={{ display: "inline-block" }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

const JOURNAL_CATEGORIES = [
  {
    id: "ALL",
    name: "ALL STORIES",
    description: "Every discovery, artisan diary, and community memory.",
  },
  {
    id: "CLOTH",
    name: "CLOTH",
    description: "Textiles, techniques and the things we learn along the way.",
  },
  {
    id: "PEOPLE",
    name: "PEOPLE",
    description: "The makers, women and characters behind the clothes.",
  },
  {
    id: "PLACES",
    name: "PLACES",
    description: "Journeys, sourcing stories and places worth knowing.",
  },
  {
    id: "STYLE",
    name: "STYLE",
    description: "Ways to wear, rethink and live with your clothes.",
  },
  {
    id: "SUM",
    name: "SUM",
    description: "The making of the brand — the good, the difficult and everything between.",
  },
  {
    id: "YOUR STORIES",
    name: "YOUR STORIES",
    description: "Stories submitted by the Sum community.",
  },
];

const JOURNAL_STORIES = [
  {
    id: "bharatpur-weavers",
    category: "PLACES",
    tagColor: "#8B4513",
    title: "The Handlooms of Bharatpur: Walking Through Madhya Pradesh's Weaving Villages",
    subtitle: "Where every warp has a name, and time is measured in hand movements.",
    author: "Sum Field Notes",
    date: "Autumn 2026",
    readTime: "4 min read",
    image: "/assets/wev.jpg",
    gallery: ["/assets/wev.jpg", "/assets/fabric.jpg", "/assets/han.jpg"],
    excerpt: "A morning spent among wooden frame looms, listening to the rhythm of shuttles and the artisans who turn raw cotton into living cloth.",
    content: [
      "Before our first stitch was drafted, we spent weeks walking through the rural clusters of Bharatpur in Madhya Pradesh. In this corner of India, weaving is not an automated factory shift—it is the cadence of daily life. The rhythm begins at dawn with the winding of yarn around wooden spindles and continues through the afternoon with the click-clack of the handloom shuttle.",
      "What strikes you first is the quiet patience of the artisans. When you watch a weaver run their fingers along handspun Khadi yarn, you realize why mass production can never replicate this texture. The slight irregularities—the tiny slubs and breathable air pockets—are not flaws. They are the human signature of the maker.",
      "We spent hours speaking with the women who spin the charkha. For them, every yard of cloth carries the memory of their family's lineage. Sum was born out of the desire to bring these authentic textiles into contemporary, uncomplicated everyday wardrobes without stripping away their heritage.",
    ],
  },
  {
    id: "khadi-museum",
    category: "CLOTH",
    tagColor: "#660608",
    title: "Inside The Khadi Museum: Living Archives of Slow Time",
    subtitle: "Understanding how a humble spinning wheel sparked self-reliance and timeless style.",
    author: "Textile Archives",
    date: "Late Summer 2026",
    readTime: "5 min read",
    image: "/assets/chakra.jpg",
    gallery: ["/assets/chakra.jpg", "/assets/fabric.jpg", "/assets/ctn.jpg"],
    videoUrl: "/assets/videos/vid2.mp4",
    excerpt: "From charkha revolutions to contemporary wardrobes — why the simplest textile in human history remains our most radical act of living.",
    content: [
      "Visiting the Khadi textile archive feels like stepping into a sanctuary of slow time. Standing among decades-old wooden charkhas, preserved swatches of double-spun cotton, and handwritten weaver ledgers, the pace of modern fast fashion instantly feels hollow.",
      "Here, you see why Khadi was celebrated: it requires no massive industrial power plants, consumes minimal water, and leaves zero toxic runoff. The thread is created purely through human skill and natural cotton fiber. The air pockets woven into the textile act as natural insulation—keeping the skin cool in scorching afternoons and comfortably warm when the evening breeze arrives.",
      "At Sum Clothico, we return to this archive not to preserve Khadi behind museum glass, but to set it free in everyday life. We want you to wear it to work, take it on travels, wash it repeatedly, and let it become your favourite second skin.",
    ],
  },
  {
    id: "miras-college",
    category: "PEOPLE",
    tagColor: "#4A3B30",
    title: "Real Living: How Women Wear Sum from Morning Coffee to Slow Evenings",
    subtitle: "Conversations on campus and city studios about repeat wearability, pockets, and feeling comfortable.",
    author: "Community Stories",
    date: "Monsoon 2026",
    readTime: "6 min read",
    image: "/assets/img/18.png",
    gallery: ["/assets/img/18.png", "/assets/m1.png", "/assets/m2.png"],
    excerpt: "Conversations with architects, ceramicists, and writers on why clothes should feel lighter, softer, and more honest with every passing season.",
    content: [
      "College mornings are notoriously rushed. You have an 8:30 AM lecture, a library study session, a quick café plan with friends, and maybe errands before heading home. Who has the energy to change outfits three times a day?",
      "During our conversations with students and faculty at Mira's College, we asked one simple question: 'What makes you reach for the same piece again and again?' The answers were remarkably consistent: 'I want clothes that let me breathe when the weather is hot,' 'I need pockets that actually fit my phone,' and 'I want something that looks put-together without feeling like I'm trying too hard.'",
      "That insight directly shaped pieces like Meera's Dress and Sara's Top. Modern women don't need another brand prescribing rigid trends. They need silhouettes that leave room for living.",
    ],
  },
  {
    id: "the-making-of-sum",
    category: "SUM",
    tagColor: "#660608",
    title: "The Diary of Sum: Learning What Not To Rush",
    subtitle: "The trials of small-batch production and why we said no to seasonal fast fashion.",
    author: "Sum Clothico",
    date: "Summer 2026",
    readTime: "6 min read",
    image: "/assets/han.jpg",
    gallery: ["/assets/han.jpg", "/assets/cloth.png", "/assets/wev.jpg"],
    excerpt: "Building a brand rooted in handloom textiles means learning that you cannot rush a weaver. Here is the unvarnished story of our making—the good, the difficult, and everything between.",
    content: [
      "When we first told manufacturing consultants that we wanted to build Sum around hand-spun Khadi cotton from Madhya Pradesh, they cautioned us: 'Handloom is too slow. You can't scale it like mill cotton. Deliveries take weeks longer.'",
      "They were right about the speed, but entirely wrong about the value. In a world drowning in synthetic polyester and micro-trends discarded after two washes, slowness is our greatest strength. When a weaver weaves only four to five meters of Khadi a day, every inch receives human attention.",
      "Building Sum has meant embracing that pace. It means producing in limited batches, ensuring artisans receive fair compensation, and focusing on quality over excess. We're still figuring things out as we grow, but we know exactly how we want our clothes to feel: thoughtful, human, easy, and entirely Sum.",
    ],
  },
  {
    id: "grandmother-sari",
    category: "YOUR STORIES",
    tagColor: "#8B4513",
    title: "My Grandmother's 40-Year-Old Odhna",
    subtitle: "A community story by Ananya Iyer, Mumbai.",
    author: "Sum Community Voice",
    date: "Spring 2026",
    readTime: "3 min read",
    image: "/assets/img/23.png",
    gallery: ["/assets/img/23.png", "/assets/model.png"],
    excerpt: "In my family, clothes are never thrown away. They are mended, passed down, and softened by decades of affection. Here is the story of a handwoven cotton drape that outlived three relocations.",
    content: [
      "'My grandmother bought a handwoven cotton odhna in Bhopal back in 1984. She wore it through monsoons, wrapped my mother in it when she was an infant, and eventually gave it to me when I moved into my first flat in Mumbai.'",
      "'The edges have been mended twice, but the cloth itself is softer than any silk or branded luxury top I own. Every time I drape it over my shoulders during a long workday, it feels like an anchor.'",
      "'When I discovered Sum Clothico, it felt like someone was finally speaking the language of my grandmother's wardrobe: clothes made to be lived in, repeated, and loved over time.'",
    ],
  },
];

export default function JournalPage() {
  const containerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeStory, setActiveStory] = useState(null);

  // Community Submission Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagramHandle: "",
    category: "My story",
    message: "",
    permissionShare: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // GSAP Text Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl.fromTo(
        ".journal-hero-badge",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" }
      );

      heroTl.fromTo(
        ".journal-anim-title .journal-anim-word",
        { y: "135%", rotate: 4, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.06 },
        "-=0.4"
      );

      heroTl.fromTo(
        ".journal-anim-placard",
        { opacity: 0, scale: 0.94, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" },
        "-=0.6"
      );

      // Cards staggered reveal on scroll
      gsap.fromTo(
        ".journal-story-card",
        { y: 50, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".journal-stories-grid",
            start: "top 82%",
          },
        }
      );

      // Form card reveal
      gsap.fromTo(
        ".journal-form-card",
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".journal-form-card",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredStories =
    selectedCategory === "ALL"
      ? JOURNAL_STORIES
      : JOURNAL_STORIES.filter((s) => s.category === selectedCategory);

  const activeCategoryObj =
    JOURNAL_CATEGORIES.find((c) => c.id === selectedCategory) || JOURNAL_CATEGORIES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your name, email, and story.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          instagramHandle: formData.instagramHandle,
          category: formData.category,
          message: formData.message,
          allowSocialShare: formData.permissionShare,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSubmission = () => {
    const el = document.getElementById("submission-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (activeStory) {
      setActiveStory(null);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", minHeight: "100vh", backgroundColor: "#EDE8DC" }}>
      <Navbar />
      <PageHeaderHero
        badgeText="CHRONICLES & DIARIES"
        title="Things Worth Talking About"
        subtitle="Clothes are rarely just clothes. They carry memories, places, and people."
        breadcrumb="Home / Journal"
      />

      <style>{`
        .journal-page {
          background-color: #EDE8DC;
          color: #1a140e;
          min-height: 100vh;
          padding-top: 40px;
          padding-bottom: 90px;
          position: relative;
          overflow: hidden;
        }
        .journal-container {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 56px);
          position: relative;
          z-index: 3;
        }
        .j-pill {
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .journal-stories-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
          margin-bottom: 70px;
        }
        @media (max-width: 1024px) {
          .journal-stories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
        }
        @media (max-width: 640px) {
          .journal-stories-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        .j-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 20, 14, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .j-modal-content {
          background: #FAF6F0;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 16px;
          padding: clamp(28px, 5vw, 44px);
          position: relative;
          border: 1px solid rgba(44, 32, 22, 0.15);
        .side-pattern-decor {
          width: 24px;
          background-size: 24px auto;
          opacity: 0.12;
        }
        @media (max-width: 768px) {
          .side-pattern-decor {
            width: 16px !important;
            background-size: 16px auto !important;
            opacity: 0.1 !important;
          }
          .journal-page {
            padding: 95px 22px 60px !important;
          }
          .journal-container {
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="journal-page">
        {/* ─── LEFT SIDE REPEATING PATTERN IMAGE (bgele2.png, SLIM & LOW OPACITY) ─── */}
        <div
          className="side-pattern-decor"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "24px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "24px auto",
            opacity: 0.12,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* ─── RIGHT SIDE REPEATING PATTERN IMAGE (bgele2.png, MIRRORED, SLIM & LOW OPACITY) ─── */}
        <div
          className="side-pattern-decor"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "24px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "24px auto",
            transform: "scaleX(-1)",
            opacity: 0.12,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        <div className="journal-container">

          {/* Traditional Indian Border Pattern Divider */}
          <div
            style={{
              width: "100%",
              height: "28px",
              backgroundImage: 'url("/assets/footerpattern-accent.png")',
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              backgroundSize: "auto 26px",
              opacity: 0.85,
              margin: "0 0 40px",
            }}
            aria-hidden="true"
          />

          {/* ─── CATEGORY FILTER PILLS ─── */}
          <section style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
              {JOURNAL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className="j-pill"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      background: isSelected ? "#660608" : "transparent",
                      color: isSelected ? "#FAF6F0" : "#4a3c30",
                      border: `1.5px solid ${isSelected ? "#660608" : "rgba(44, 32, 22, 0.2)"}`,
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", fontSize: "0.95rem", color: "#6e5d4e", fontStyle: "italic" }}>
              {activeCategoryObj.description}
            </div>
          </section>

          {/* ─── STORIES GRID WITH ASTAKA SCALLOPED CARDS (MATCHING IMAGE 2) ─── */}
          <section className="journal-stories-grid">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="journal-story-card"
                onClick={() => setActiveStory(story)}
                style={{
                  position: "relative",
                  padding: "10px 10px 18px",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* SVG ASTAKA Scalloped Corner Card Framing with Inner Accent Hairline */}
                <svg
                  viewBox="0 0 380 520"
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                  aria-hidden="true"
                >
                  {/* Outer Silhouette — Top Scalloped Ears, Bottom Smooth Rounded Corners */}
                  <path
                    d="M 34,0 L 346,0 L 346,6 A 28 28 0 0 0 374 34 L 380 34 L 380 498 A 22 22 0 0 1 358 520 L 22 520 A 22 22 0 0 1 0 498 L 0 34 L 6 34 A 28 28 0 0 0 34 6 L 34 0 Z"
                    fill="#FAF6F0"
                    stroke="rgba(44, 32, 22, 0.18)"
                    strokeWidth="1.5"
                  />
                  {/* Inner Accent Hairline */}
                  <path
                    d="M 38,10 L 342,10 L 342,14 A 24 24 0 0 0 366 38 L 370 38 L 370 494 A 16 16 0 0 1 354 510 L 26 510 A 16 16 0 0 1 10 494 L 10 38 L 14 38 A 24 24 0 0 0 38 14 L 38 10 Z"
                    fill="none"
                    stroke="#660608"
                    strokeWidth="1"
                    strokeOpacity="0.32"
                  />
                </svg>

                {/* Card Image Banner */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 11",
                    background: "#EBE5D9",
                    overflow: "hidden",
                    borderRadius: "4px",
                    zIndex: 1,
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
                      filter: "sepia(0.03) contrast(1.02)",
                    }}
                  />

                  {/* Category Tag Pill (Top Left) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(250, 246, 240, 0.94)",
                      backdropFilter: "blur(6px)",
                      color: story.tagColor || "#660608",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(44, 32, 22, 0.1)",
                    }}
                  >
                    {story.category}
                  </div>

                  {story.videoUrl && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        background: "rgba(26, 20, 14, 0.85)",
                        color: "#FAF6F0",
                        padding: "4px 10px",
                        borderRadius: 30,
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FiPlay size={10} />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div
                  style={{
                    padding: "16px 14px 10px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                        color: "#8C7868",
                        marginBottom: 8,
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
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#2C2016",
                        lineHeight: 1.35,
                        margin: "0 0 8px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {story.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#6B5A4E",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {story.excerpt}
                    </p>
                  </div>

                  {/* Read Article Bottom Link */}
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(44, 32, 22, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "#2C2016",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <span>Read Article</span>
                    <FiArrowRight size={15} color="#660608" />
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* ─── COMMUNITY BANNER PLACARD (MATCHING IMAGE 2 EXACT PLACARD) ─── */}
          <div
            style={{
              position: "relative",
              padding: "36px 44px",
              background: "transparent",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 70,
            }}
          >
            {/* SVG Placard with Stepped Scalloped Corners and Inner Hairline Border */}
            <svg
              viewBox="0 0 1192 200"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              <path
                d="M 32,0 L 1160,0 L 1160,6 A 26 26 0 0 0 1186 32 L 1192 32 L 1192 168 L 1186 168 A 26 26 0 0 0 1160 194 L 1160 200 L 32 200 L 32 194 A 26 26 0 0 0 6 168 L 0 168 L 0 32 L 6 32 A 26 26 0 0 0 32 6 L 32 0 Z"
                fill="#FAF6F0"
                stroke="rgba(44, 32, 22, 0.2)"
                strokeWidth="1.5"
              />
              <path
                d="M 36,10 L 1156,10 L 1156,14 A 22 22 0 0 0 1178 36 L 1182 36 L 1182 164 L 1178 164 A 22 22 0 0 0 1156 186 L 1156 190 L 36 190 L 36 186 A 22 22 0 0 0 14 164 L 10 164 L 10 36 L 14 36 A 22 22 0 0 0 36 14 L 36 10 Z"
                fill="none"
                stroke="#660608"
                strokeWidth="1"
                strokeOpacity="0.38"
              />
            </svg>

            <div style={{ maxWidth: 620, position: "relative", zIndex: 1 }}>
              <IndianArchBadge style={{ marginBottom: 12 }}>
                <span>Have a story? Tell us.</span>
              </IndianArchBadge>
              <h4
                style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  fontWeight: 800,
                  color: "#2C2016",
                  margin: "0 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                Have something to share?
              </h4>
              <p style={{ fontSize: 14, color: "#6B5A4E", margin: 0, lineHeight: 1.55 }}>
                A clothing memory, a fabric you love, a place we should explore or simply a suggestion — we&apos;d love to hear from you.
              </p>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", position: "relative", zIndex: 1 }}>
              <button
                onClick={scrollToSubmission}
                style={{
                  background: "#660608",
                  color: "#FAF6F0",
                  padding: "14px 28px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "background 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4d0406";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#660608";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span>Write To Us</span>
                <FiArrowRight size={15} />
              </button>

              <button
                onClick={scrollToSubmission}
                style={{
                  background: "#EBE5D9",
                  color: "#2C2016",
                  padding: "14px 24px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <span>Share Your Story</span>
              </button>
            </div>
          </div>

          {/* ─── SUBMISSION SECTION / FORM (USING THE SAME ASTAKA CARD SHAPE) ─── */}
          <section
            id="submission-form"
            className="journal-form-card"
            style={{
              maxWidth: 880,
              margin: "0 auto 80px",
              position: "relative",
              padding: "clamp(36px, 5vw, 56px)",
            }}
          >
            {/* SVG ASTAKA Placard Outer Frame for Form */}
            <svg
              viewBox="0 0 880 720"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              <path
                d="M 32,0 L 848,0 L 848,6 A 26 26 0 0 0 874 32 L 880 32 L 880 688 L 874 688 A 26 26 0 0 0 848 714 L 848 720 L 32 720 L 32 714 A 26 26 0 0 0 6 688 L 0 688 L 0 32 L 6 32 A 26 26 0 0 0 32 6 L 32 0 Z"
                fill="#FAF6F0"
                stroke="rgba(44, 32, 22, 0.22)"
                strokeWidth="1.5"
              />
              <path
                d="M 36,10 L 844,10 L 844,14 A 22 22 0 0 0 866 36 L 870 36 L 870 684 L 866 684 A 22 22 0 0 0 844 706 L 844 710 L 36 710 L 36 706 A 22 22 0 0 0 14 684 L 10 684 L 10 36 L 14 36 A 22 22 0 0 0 36 14 L 36 10 Z"
                fill="none"
                stroke="#660608"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
            </svg>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 30px" }}>
                <IndianArchBadge style={{ marginBottom: "12px" }}>
                  Submission
                </IndianArchBadge>
                <h2 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(2rem, 3.2vw, 2.6rem)", color: "#1a140e", margin: "0 0 12px" }}>
                  Have something to share?
                </h2>
                <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
                  A clothing memory, a fabric you love, a place we should explore or simply a suggestion — we&apos;d love to hear from you.
                </p>
              </div>

              {isSuccess ? (
                <div style={{ textAlign: "center", padding: "40px 24px", border: "1px solid rgba(44, 32, 22, 0.12)", borderRadius: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#660608", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <FiCheck size={26} />
                  </div>
                  <h3 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "1.6rem", color: "#1a140e", margin: "0 0 10px" }}>
                    Thank you for sharing with Sum, {formData.name}
                  </h3>
                  <p style={{ color: "#55483d", fontSize: "0.96rem", lineHeight: 1.65, maxWidth: 500, margin: "0 auto 20px" }}>
                    Our editorial team reads every submission with care. If selected, we will reach out to feature your piece in our journal.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        instagramHandle: "",
                        category: "My story",
                        message: "",
                        permissionShare: true,
                      });
                    }}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #660608",
                      color: "#660608",
                      padding: "10px 24px",
                      borderRadius: 99,
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Submit Another Story
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, color: "#660608" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: "1px solid rgba(44, 32, 22, 0.2)",
                          background: "rgba(255, 255, 255, 0.8)",
                          color: "#1a140e",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, color: "#660608" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: "1px solid rgba(44, 32, 22, 0.2)",
                          background: "rgba(255, 255, 255, 0.8)",
                          color: "#1a140e",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, color: "#660608" }}>
                      Instagram Handle (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      placeholder="@yourhandle"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid rgba(44, 32, 22, 0.2)",
                        background: "rgba(255, 255, 255, 0.8)",
                        color: "#1a140e",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* What are you sharing? */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, color: "#660608" }}>
                      What are you sharing?
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[
                        "My story",
                        "A clothing memory",
                        "A textile / fabric suggestion",
                        "A place Sum should explore",
                        "Feedback",
                        "Something else",
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: type })}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 999,
                            border: `1.5px solid ${formData.category === type ? "#660608" : "rgba(44, 32, 22, 0.2)"}`,
                            background: formData.category === type ? "#660608" : "transparent",
                            color: formData.category === type ? "#FAF6F0" : "#443528",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tell us more */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, color: "#660608" }}>
                      Tell Us More *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your memory, textile thought, or suggestion here..."
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid rgba(44, 32, 22, 0.2)",
                        background: "rgba(255, 255, 255, 0.8)",
                        color: "#1a140e",
                        fontSize: 14,
                        lineHeight: 1.6,
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Permission Checkboxes */}
                  <div style={{ borderLeft: "2.5px solid #660608", paddingLeft: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#660608", letterSpacing: "0.08em" }}>
                      Permission
                    </span>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, color: "#443528", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="permission"
                        checked={formData.permissionShare}
                        onChange={() => setFormData({ ...formData, permissionShare: true })}
                        style={{ marginTop: 2, accentColor: "#660608" }}
                      />
                      <span>Yes, you may share my submission on Sum Clothico&apos;s Instagram/social channels.</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, color: "#443528", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="permission"
                        checked={!formData.permissionShare}
                        onChange={() => setFormData({ ...formData, permissionShare: false })}
                        style={{ marginTop: 2, accentColor: "#660608" }}
                      />
                      <span>Please keep my submission private.</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "15px 32px",
                      borderRadius: 99,
                      background: "#660608",
                      color: "#FAF6F0",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <FiSend size={14} />
                    <span>{isSubmitting ? "Sending..." : "SHARE YOUR STORY"}</span>
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* ─── CLOSING ─── */}
          <section style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <IndianArchBadge style={{ marginBottom: "14px" }}>
              Community
            </IndianArchBadge>
            <h2 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 20px" }}>
              Keep the conversation going.
            </h2>
            <a
              href="https://www.instagram.com/sumclothico/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 30px",
                borderRadius: 99,
                background: "#1a140e",
                color: "#FAF6F0",
                fontWeight: 800,
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <FiInstagram size={16} />
              <span>FOLLOW US ON INSTAGRAM</span>
            </a>
          </section>

        </div>
      </div>

      {/* ─── ARTICLE READER MODAL ─── */}
      {activeStory && (
        <div className="j-modal-overlay" onClick={() => setActiveStory(null)}>
          <div className="j-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveStory(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                color: "#1a140e",
                cursor: "pointer",
                padding: 6,
              }}
              aria-label="Close story"
            >
              <FiX size={24} />
            </button>

            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#660608", display: "block", marginBottom: 8 }}>
              {activeStory.category}
            </span>

            <h1 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", color: "#1a140e", margin: "0 0 10px", lineHeight: 1.25 }}>
              {activeStory.title}
            </h1>

            {activeStory.subtitle && (
              <p style={{ fontSize: "1.1rem", color: "#660608", fontStyle: "italic", margin: "0 0 18px" }}>
                {activeStory.subtitle}
              </p>
            )}

            <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#8a7a6c", marginBottom: 24, borderBottom: "1px solid rgba(44, 32, 22, 0.12)", paddingBottom: 16 }}>
              <span>{activeStory.date}</span>
              <span>•</span>
              <span>Author: <strong>{activeStory.author}</strong></span>
              <span>•</span>
              <span>{activeStory.readTime}</span>
            </div>

            {/* Media Gallery / Video */}
            {activeStory.videoUrl ? (
              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", background: "#000", marginBottom: 24 }}>
                <video src={activeStory.videoUrl} controls autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", marginBottom: 24, background: "#e8dfd0" }}>
                <img src={activeStory.image} alt={activeStory.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* Story Paragraphs */}
            <div style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#3f3329", marginBottom: 36 }}>
              {activeStory.content.map((p, idx) => (
                <p key={idx} style={{ marginBottom: 16 }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Article End Action */}
            <div style={{ borderTop: "1.5px solid #660608", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <strong style={{ display: "block", color: "#1a140e", fontSize: "1.05rem", fontFamily: "Epilogue, sans-serif" }}>
                  Have something to add?
                </strong>
                <span style={{ fontSize: 13, color: "#7a6c5f" }}>
                  Share your own wardrobe memory, textile idea, or feedback.
                </span>
              </div>
              <button
                onClick={scrollToSubmission}
                style={{
                  background: "#660608",
                  color: "#FAF6F0",
                  padding: "12px 24px",
                  borderRadius: 99,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                SHARE YOUR STORY
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
