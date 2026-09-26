"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FiSend,
  FiCheckCircle,
  FiCalendar,
  FiUser,
  FiInstagram,
  FiArrowRight,
  FiX,
  FiTag,
  FiMessageSquare,
  FiPlay,
  FiCheck
} from "react-icons/fi";

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
    title: "The Handlooms of Bharatpur: Walking Through Madhya Pradesh's Weaving Villages",
    subtitle: "Where every warp has a name, and time is measured in hand movements.",
    author: "Sum Clothico",
    date: "Autumn 2026",
    readTime: "4 min read",
    image: "/assets/wev.jpg",
    gallery: ["/assets/wev.jpg", "/assets/fabric.jpg", "/assets/han.jpg"],
    excerpt: "Before our first stitch was drafted, we spent weeks in Madhya Pradesh's Sidhi district. Walking down lanes where the sound of the wooden pit loom echoes from every courtyard.",
    content: [
      "Before our first stitch was drafted, we spent weeks walking through the rural clusters of Bharatpur in Madhya Pradesh. In this corner of India, weaving is not an automated factory shift—it is the cadence of daily life. The rhythm begins at dawn with the winding of yarn around wooden spindles and continues through the afternoon with the click-clack of the handloom shuttle.",
      "What strikes you first is the quiet patience of the artisans. When you watch a weaver run their fingers along handspun Khadi yarn, you realize why mass production can never replicate this texture. The slight irregularities—the tiny slubs and breathable air pockets—are not flaws. They are the human signature of the maker.",
      "We spent hours speaking with the women who spin the charkha. For them, every yard of cloth carries the memory of their family's lineage. Sum was born out of the desire to bring these authentic textiles into contemporary, uncomplicated everyday wardrobes without stripping away their heritage.",
    ],
  },
  {
    id: "khadi-museum",
    category: "CLOTH",
    title: "Inside The Khadi Museum: Living Archives of Slow Time",
    subtitle: "Understanding how a humble spinning wheel sparked self-reliance and timeless style.",
    author: "Sum Clothico",
    date: "Late Summer 2026",
    readTime: "5 min read",
    image: "/assets/chakra.jpg",
    gallery: ["/assets/chakra.jpg", "/assets/fabric.jpg", "/assets/ctn.jpg"],
    videoUrl: "/assets/videos/vid2.mp4",
    excerpt: "Surrounded by historic charkhas and hand-spun weaves, we were reminded that Khadi was never simply a fabric. It was a philosophy of slowing down enough to care about every step.",
    content: [
      "Visiting the Khadi textile archive feels like stepping into a sanctuary of slow time. Standing among decades-old wooden charkhas, preserved swatches of double-spun cotton, and handwritten weaver ledgers, the pace of modern fast fashion instantly feels hollow.",
      "Here, you see why Khadi was celebrated: it requires no massive industrial power plants, consumes minimal water, and leaves zero toxic runoff. The thread is created purely through human skill and natural cotton fiber. The air pockets woven into the textile act as natural insulation—keeping the skin cool in scorching afternoons and comfortably warm when the evening breeze arrives.",
      "At Sum Clothico, we return to this archive not to preserve Khadi behind museum glass, but to set it free in everyday life. We want you to wear it to work, take it on travels, wash it repeatedly, and let it become your favourite second skin.",
    ],
  },
  {
    id: "miras-college",
    category: "PEOPLE",
    title: "Mira's College: The Uniform of Real Living",
    subtitle: "Conversations on campus about repeat wearability, pockets, and feeling comfortable.",
    author: "Sum Clothico",
    date: "Monsoon 2026",
    readTime: "4 min read",
    image: "/assets/img/18.png",
    gallery: ["/assets/img/18.png", "/assets/m1.png", "/assets/m2.png"],
    excerpt: "We spent an afternoon talking with young women at Mira's College about what actually belongs in their wardrobes. The verdict was unanimous: comfort, deep pockets, and pieces you never get tired of repeating.",
    content: [
      "College mornings are notoriously rushed. You have an 8:30 AM lecture, a library study session, a quick café plan with friends, and maybe errands before heading home. Who has the energy to change outfits three times a day?",
      "During our conversations with students and faculty at Mira's College, we asked one simple question: 'What makes you reach for the same piece again and again?' The answers were remarkably consistent: 'I want clothes that let me breathe when the weather is hot,' 'I need pockets that actually fit my phone,' and 'I want something that looks put-together without feeling like I'm trying too hard.'",
      "That insight directly shaped pieces like Meera's Dress and Sara's Top. Modern women don't need another brand prescribing rigid trends. They need silhouettes that leave room for living.",
    ],
  },
  {
    id: "the-making-of-sum",
    category: "SUM",
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
    <>
      <Navbar />
      <style>{`
        .journal-page {
          background-color: #FAF6F0;
          color: #1a140e;
          min-height: 100vh;
          padding-top: 120px;
          padding-bottom: 100px;
        }
        .journal-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .j-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(42, 31, 20, 0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .j-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        .j-card-img-wrap {
          height: 240px;
          overflow: hidden;
          position: relative;
          background: #e8dfd0;
        }
        .j-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .j-card:hover .j-card-img-wrap img {
          transform: scale(1.04);
        }
        .j-pill {
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
        }
        .j-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 20, 14, 0.7);
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
          border-radius: 24px;
          padding: clamp(28px, 5vw, 48px);
          position: relative;
          border: 1px solid rgba(42, 31, 20, 0.15);
        }
      `}</style>

      <div className="journal-page">
        <div className="journal-container">

          {/* ─── HERO ─── */}
          <section style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 60px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 12 }}>
              The Sum Journal
            </span>
            <h1 style={{ fontFamily: "serif", fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", fontWeight: 500, lineHeight: 1.15, color: "#1a140e", margin: "0 0 24px" }}>
              Things worth talking about.
            </h1>
            <div style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#4a3c30", maxWidth: 660, margin: "0 auto" }}>
              <p style={{ margin: "0 0 6px" }}>Clothes are rarely just clothes.</p>
              <p style={{ margin: "0 0 6px" }}>They carry memories.</p>
              <p style={{ margin: "0 0 6px" }}>They tell us where we&apos;ve been.</p>
              <p style={{ margin: "0 0 6px" }}>They introduce us to people and places.</p>
              <p style={{ margin: "0 0 16px" }}>And sometimes, they make us feel like ourselves again.</p>
              <p style={{ margin: 0, fontWeight: 700, color: "#1a140e", fontStyle: "italic", fontFamily: "serif", fontSize: "1.2rem" }}>
                The Sum Journal is a space for those stories.
              </p>
            </div>
          </section>

          {/* ─── EXPLORE THE JOURNAL CATEGORIES ─── */}
          <section style={{ marginBottom: 50 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
              {JOURNAL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className="j-pill"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      background: isSelected ? "#1a140e" : "#ffffff",
                      color: isSelected ? "#FAF6F0" : "#4a3c30",
                      borderColor: isSelected ? "#1a140e" : "rgba(42, 31, 20, 0.15)",
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Category Description Banner */}
            <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", fontSize: "0.95rem", color: "#6e5d4e", fontStyle: "italic" }}>
              {activeCategoryObj.description}
            </div>
          </section>

          {/* ─── STORIES GRID ─── */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, marginBottom: 90 }}>
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="j-card"
                onClick={() => setActiveStory(story)}
              >
                <div className="j-card-img-wrap">
                  <img src={story.image} alt={story.title} />
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: "rgba(255, 255, 255, 0.94)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#1a140e",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FiTag size={11} color="#b36338" />
                    <span>{story.category}</span>
                  </div>
                  {story.videoUrl && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 14,
                        right: 14,
                        background: "rgba(26, 20, 14, 0.85)",
                        color: "#FAF6F0",
                        padding: "4px 10px",
                        borderRadius: 30,
                        fontSize: 11,
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

                <div style={{ padding: "26px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#8a7a6c", marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <FiCalendar size={12} />
                      {story.date}
                    </span>
                    <span>•</span>
                    <span>{story.readTime}</span>
                  </div>

                  <h2 style={{ fontFamily: "serif", fontSize: "1.35rem", fontWeight: 600, lineHeight: 1.3, color: "#1a140e", margin: "0 0 10px" }}>
                    {story.title}
                  </h2>

                  <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: "0 0 20px", flex: 1 }}>
                    {story.excerpt}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(42,31,20,0.08)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#7a6c5f", display: "flex", alignItems: "center", gap: 5 }}>
                      <FiUser size={13} color="#b36338" />
                      {story.author}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1a140e", display: "flex", alignItems: "center", gap: 4 }}>
                      Read Story <FiArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* ─── COMMUNITY SECTION ─── */}
          <section style={{ maxWidth: 960, margin: "0 auto 80px" }}>
            <div style={{ background: "#ffffff", padding: "clamp(36px, 5vw, 60px)", borderRadius: 24, border: "1px solid rgba(42,31,20,0.1)", textAlign: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 10 }}>
                Community
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 18px" }}>
                Your wardrobe has stories too.
              </h2>
              <div style={{ fontSize: "1.06rem", lineHeight: 1.85, color: "#4a3c30", maxWidth: 660, margin: "0 auto 28px" }}>
                <p style={{ margin: "0 0 8px" }}>Maybe there is a dress you have had for ten years.</p>
                <p style={{ margin: "0 0 8px" }}>A textile your grandmother brought home.</p>
                <p style={{ margin: "0 0 8px" }}>A place you think we should visit.</p>
                <p style={{ margin: "0 0 8px" }}>A weaver we should know.</p>
                <p style={{ margin: "0 0 16px" }}>A thought about clothing you&apos;ve never had anywhere to put.</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#1a140e", fontStyle: "italic", fontFamily: "serif", fontSize: "1.25rem" }}>
                  Tell us.
                </p>
              </div>
              <button
                onClick={scrollToSubmission}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 32px",
                  borderRadius: 99,
                  background: "#1a140e",
                  color: "#FAF6F0",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                <span>Share Your Story</span>
                <FiArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* ─── SUBMISSION PAGE / FORM ─── */}
          <section id="submission-form" style={{ maxWidth: 840, margin: "0 auto 90px" }}>
            <div style={{ background: "#2a1f14", color: "#FAF6F0", padding: "clamp(36px, 5vw, 60px)", borderRadius: 24 }}>
              <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 36px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d89b6c", display: "block", marginBottom: 10 }}>
                  Submission
                </span>
                <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.2vw, 2.6rem)", color: "#FAF6F0", margin: "0 0 16px" }}>
                  Tell us something.
                </h2>
                <p style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "rgba(250, 246, 240, 0.85)", margin: 0 }}>
                  We&apos;d love to hear what clothing means to you. You can share a story, a suggestion, a memory, a place we should explore, a textile we should know about — or simply tell us what you think.
                </p>
              </div>

              {isSuccess ? (
                <div style={{ textAlign: "center", padding: "40px 24px", background: "rgba(255,255,255,0.06)", borderRadius: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#15803d", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <FiCheck size={28} />
                  </div>
                  <h3 style={{ fontFamily: "serif", fontSize: "1.6rem", color: "#FAF6F0", margin: "0 0 10px" }}>
                    Thank you for sharing with Sum, {formData.name}
                  </h3>
                  <p style={{ color: "rgba(250,246,240,0.85)", fontSize: "0.96rem", lineHeight: 1.65, maxWidth: 500, margin: "0 auto 20px" }}>
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
                      border: "1.5px solid #d89b6c",
                      color: "#d89b6c",
                      padding: "10px 24px",
                      borderRadius: 99,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Submit Another Story
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, color: "#d89b6c" }}>
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
                          padding: "14px 16px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.06)",
                          color: "#FAF6F0",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, color: "#d89b6c" }}>
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
                          padding: "14px 16px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.06)",
                          color: "#FAF6F0",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, color: "#d89b6c" }}>
                      Instagram Handle (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      placeholder="@yourhandle"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#FAF6F0",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* What are you sharing? */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, color: "#d89b6c" }}>
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
                            padding: "8px 16px",
                            borderRadius: 999,
                            border: `1.5px solid ${formData.category === type ? "#d89b6c" : "rgba(255,255,255,0.18)"}`,
                            background: formData.category === type ? "#d89b6c" : "transparent",
                            color: formData.category === type ? "#1a140e" : "#FAF6F0",
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
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, color: "#d89b6c" }}>
                      Tell Us More *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your memory, textile thought, or suggestion here..."
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#FAF6F0",
                        fontSize: 14,
                        lineHeight: 1.6,
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Permission Checkboxes */}
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: 18, borderRadius: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#d89b6c" }}>
                      Permission
                    </span>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(250,246,240,0.9)", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="permission"
                        checked={formData.permissionShare}
                        onChange={() => setFormData({ ...formData, permissionShare: true })}
                        style={{ marginTop: 3 }}
                      />
                      <span>Yes, you may share my submission on Sum Clothico&apos;s Instagram/social channels.</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(250,246,240,0.9)", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="permission"
                        checked={!formData.permissionShare}
                        onChange={() => setFormData({ ...formData, permissionShare: false })}
                        style={{ marginTop: 3 }}
                      />
                      <span>Please keep my submission private.</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "16px 32px",
                      borderRadius: 10,
                      background: "#FAF6F0",
                      color: "#1a140e",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 6,
                    }}
                  >
                    <FiSend size={15} />
                    <span>{isSubmitting ? "Sending..." : "SEND IT OUR WAY"}</span>
                  </button>

                  {/* Note */}
                  <p style={{ fontSize: 11, lineHeight: 1.6, color: "rgba(250,246,240,0.6)", margin: 0, textAlign: "center" }}>
                    By submitting, you give Sum Clothico permission to review your contribution. If you choose social sharing permission, Sum may edit the submission for length or clarity before publishing.
                  </p>
                </form>
              )}
            </div>
          </section>

          {/* ─── CLOSING ─── */}
          <section style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              Community
            </span>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 20px" }}>
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
                fontWeight: 700,
                fontSize: "0.82rem",
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

            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              {activeStory.category}
            </span>

            <h1 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", color: "#1a140e", margin: "0 0 10px", lineHeight: 1.25 }}>
              {activeStory.title}
            </h1>

            {activeStory.subtitle && (
              <p style={{ fontSize: "1.1rem", color: "#5c4033", fontStyle: "italic", margin: "0 0 18px" }}>
                {activeStory.subtitle}
              </p>
            )}

            <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#8a7a6c", marginBottom: 24, borderBottom: "1px solid rgba(42,31,20,0.1)", paddingBottom: 16 }}>
              <span>{activeStory.date}</span>
              <span>•</span>
              <span>Author: <strong>{activeStory.author}</strong></span>
              <span>•</span>
              <span>{activeStory.readTime}</span>
            </div>

            {/* Media Gallery / Video */}
            {activeStory.videoUrl ? (
              <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", background: "#000", marginBottom: 24 }}>
                <video src={activeStory.videoUrl} controls autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", marginBottom: 24, background: "#e8dfd0" }}>
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
            <div style={{ background: "#ffffff", padding: "24px 28px", borderRadius: 16, border: "1px solid rgba(42,31,20,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <strong style={{ display: "block", color: "#1a140e", fontSize: "1.05rem", fontFamily: "serif" }}>
                  Have something to add?
                </strong>
                <span style={{ fontSize: 13, color: "#7a6c5f" }}>
                  Share your own wardrobe memory, textile idea, or feedback.
                </span>
              </div>
              <button
                onClick={scrollToSubmission}
                style={{
                  background: "#1a140e",
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

      <Footer />
    </>
  );
}
