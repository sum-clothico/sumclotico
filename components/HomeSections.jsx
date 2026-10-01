"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiArrowRight, FiEye, FiShoppingBag } from "react-icons/fi";
import "@/app/styles/home-sections.css";

export default function HomeSections() {
  const { products = [], setQuickViewProduct, addToCart } = useStore();
  const [activeJournalTab, setActiveJournalTab] = useState("all");

  // Fallback / featured products with personality statements matching Section 04 direction
  const sampleClothes = [
    {
      id: "prod-meera",
      name: "MEERA'S DRESS",
      slug: "meeras-khadi-dress",
      statement: "The dress you reach for without thinking.",
      price: 3850,
      image: "/assets/model.png",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "prod-riya",
      name: "RIYA'S TOP",
      slug: "riyas-easy-top",
      statement: "Easy shape. A little attitude.",
      price: 2450,
      image: "/assets/m2.png",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      id: "prod-sara",
      name: "SARA'S SHIRT",
      slug: "saras-everyday-shirt",
      statement: "Your everyday shirt, reconsidered.",
      price: 2950,
      image: "/assets/m1.png",
      sizes: ["S", "M", "L"],
    },
  ];

  // Merge live products if available
  const displayProducts =
    products.length >= 3
      ? products.slice(0, 3).map((p, idx) => ({
          ...p,
          statement:
            idx === 0
              ? "The dress you reach for without thinking."
              : idx === 1
                ? "Easy shape. A little attitude."
                : "Your everyday shirt, reconsidered.",
        }))
      : sampleClothes;

  return (
    <>
      {/* ─── 02. THE FEELING ─── */}
      <section className="hs-section hs-section--alt" id="the-feeling">
        <div className="hs-container hs-feeling">
          <div className="hs-feeling__text-col">
            <span className="hs-eyebrow">The Feeling</span>
            <h2 className="hs-headline">
              Handwoven beginnings. Easy silhouettes. Clothes made for real
              days.
            </h2>
            <div className="hs-feeling__stanza">
              <p style={{ margin: "0 0 10px" }}>A thread spun by hand.</p>
              <p style={{ margin: "0 0 10px" }}>
                A loom moving at its own rhythm.
              </p>
              <p style={{ margin: "0 0 16px" }}>
                A garment cut, stitched and finished with care.
              </p>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.08rem",
                  fontStyle: "normal",
                  color: "#3f3329",
                }}
              >
                There is something different about clothes that don&apos;t begin
                with a race against time.
              </p>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "1.08rem",
                  fontStyle: "normal",
                  color: "#3f3329",
                }}
              >
                They feel lighter.
              </p>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "1.08rem",
                  fontStyle: "normal",
                  color: "#3f3329",
                }}
              >
                They move differently.
              </p>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: "1.08rem",
                  fontStyle: "normal",
                  color: "#3f3329",
                }}
              >
                And somehow, they become more yours.
              </p>
            </div>
            <div>
              <Link href="/fabric" className="hs-btn hs-btn--primary">
                Explore the Fabric <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className="hs-feeling__media">
            <img
              src="/assets/wev.jpg"
              alt="Loom moving at human pace"
              className="hs-feeling__img"
            />
            <div className="hs-feeling__badge">Handspun Rhythm</div>
          </div>
        </div>
      </section>

      {/* ─── 03. WHAT WE ARE ROOTED IN ─── */}
      <section className="hs-section" id="rooted-in">
        <div className="hs-container hs-rooted">
          <div>
            <span className="hs-eyebrow">The Beginning of the Journey</span>
            <h2 className="hs-headline">Rooted in handwoven textiles.</h2>
            <p className="hs-copy">
              We believe a garment&apos;s story begins long before it reaches
              your wardrobe.
              {"\n"}With the hands that make it.
              {"\n"}The place it comes from.
              {"\n"}The way the yarn is spun.
              {"\n"}The way the loom moves.
              {"\n\n"}At Sum, we&apos;re exploring handwoven textiles from
              across India — one place, one textile and one story at a time.
              {"\n"}Currently: Khadi Cotton · Madhya Pradesh
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link href="/fabric" className="hs-btn hs-btn--secondary">
                Our Fabric Story <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className="hs-rooted__info-box">
            <div className="hs-rooted__tagline-small">
              We design it for today
            </div>
            <div className="hs-rooted__loc">
              Currently: Khadi Cotton · Madhya Pradesh
            </div>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#66584c",
                marginTop: 12,
              }}
            >
              Pure indigenous cotton spun on charkhas, honoring ancestral
              slow-craft and shaped into contemporary, breathable pieces for
              everyday living.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 04. THE CLOTHES ─── */}
      <section className="hs-section hs-section--alt" id="the-clothes">
        <div className="hs-container">
          <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto" }}>
            <span className="hs-eyebrow">For real days.</span>
            <h2 className="hs-headline">Clothes that keep up with you.</h2>
            <p
              className="hs-copy"
              style={{ margin: "0 auto", textAlign: "center" }}
            >
              For mornings that start too early. Workdays that run too long.
              Last-minute plans. Slow Sundays. Train journeys. Coffee runs. And
              all the ordinary, beautiful things in between.
              {"\n\n"}We make pieces that are easy to live in — comfortable
              enough to forget you&apos;re wearing them, considered enough to
              make you feel good in them.
            </p>
          </div>

          {/* Featured Product Cards */}
          <div className="hs-clothes__grid">
            {displayProducts.map((prod) => (
              <div key={prod.id || prod._id} className="hs-product-card">
                <div className="hs-product-card__image-wrap">
                  <img
                    src={prod.images?.[0] || prod.image || "/assets/model.png"}
                    alt={prod.name}
                    className="hs-product-card__img"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuickViewProduct && setQuickViewProduct(prod)
                    }
                    className="hs-product-card__quick-view"
                  >
                    <FiEye style={{ marginRight: 6 }} /> Quick View
                  </button>
                </div>
                <div className="hs-product-card__info">
                  <h3 className="hs-product-card__title">{prod.name}</h3>
                  <p className="hs-product-card__quote">{prod.statement}</p>
                  <div className="hs-product-card__price-row">
                    <span className="hs-product-card__price">
                      ₹
                      {Number(prod.salePrice || prod.price).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart &&
                        addToCart(prod, prod.sizes?.[0] || "M", "", 1)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#b36338",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FiShoppingBag /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/shop" className="hs-btn hs-btn--primary">
              Shop All Pieces <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 05. WHY SUM ─── */}
      <section className="hs-section" id="why-sum">
        <div className="hs-container">
          <div style={{ maxWidth: 780 }}>
            <span className="hs-eyebrow">Why Sum</span>
            <h2 className="hs-headline">
              We don&apos;t make clothes for the wardrobe you wish you had.
            </h2>
            <p className="hs-copy">
              We make them for the life you&apos;re actually living.
              {"\n"}That means thoughtful silhouettes.
              {"\n"}Comfort that doesn&apos;t ask you to compromise on looking
              good.
              {"\n"}Details that have a reason to be there.
              {"\n"}And pieces you can wear more than one way, more than one
              season.
            </p>
          </div>

          <div className="hs-principles-grid">
            <div className="hs-principle-card">
              <span className="hs-principle-card__num">01</span>
              <h3 className="hs-principle-card__title">EASY</h3>
              <p className="hs-principle-card__desc">
                Clothes that move with you.
              </p>
            </div>
            <div className="hs-principle-card">
              <span className="hs-principle-card__num">02</span>
              <h3 className="hs-principle-card__title">THOUGHTFUL</h3>
              <p className="hs-principle-card__desc">
                Every detail has a reason.
              </p>
            </div>
            <div className="hs-principle-card">
              <span className="hs-principle-card__num">03</span>
              <h3 className="hs-principle-card__title">ROOTED</h3>
              <p className="hs-principle-card__desc">
                Textiles with a story and a place.
              </p>
            </div>
            <div className="hs-principle-card">
              <span className="hs-principle-card__num">04</span>
              <h3 className="hs-principle-card__title">LONG-WEARING</h3>
              <p className="hs-principle-card__desc">
                Made to stay beyond a season.
              </p>
            </div>
          </div>

          <div>
            <Link href="/our-story" className="hs-btn hs-btn--secondary">
              Why We Make <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 06. THE SUM PHILOSOPHY ─── */}
      <section className="hs-section hs-section--dark" id="philosophy">
        <div className="hs-container hs-philosophy">
          <span className="hs-eyebrow">The Sum Philosophy</span>
          <h2 className="hs-headline">
            We don&apos;t want to make more clothes.
            <br />
            We want to make better ones.
          </h2>
          <p className="hs-copy">
            There is already enough clothing in the world.
            {"\n"}So we ask a different question before making something:
            {"\n\n"}
            <em>Will you want to wear this again?</em>
            {"\n\n"}
            If the answer is yes, we make it.
            {"\n"}If it can make your everyday easier, better or a little more
            beautiful, if it is an expression of your personality, gives you
            space to be…
            {"\n"}That&apos;s the kind of clothing we&apos;re interested in.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link href="/our-story" className="hs-btn hs-btn--light">
              Read Our Story <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 07. FROM THE MAKING ─── */}
      <section className="hs-section" id="the-making">
        <div className="hs-container">
          <div style={{ maxWidth: 760 }}>
            <span className="hs-eyebrow">Behind the Piece</span>
            <h2 className="hs-headline">
              Before it becomes your clothes,
              <br />
              it passes through many hands.
            </h2>
            <p className="hs-copy">
              From the textile we source to the hands that cut, stitch and
              finish each piece, Sum is a collection of many small acts of
              making. We want you to know where your clothes come from not just
              what they look like when they arrive.
            </p>
          </div>

          <div className="hs-making-track">
            <div className="hs-making-step">
              <img
                src="/assets/fabric.jpg"
                alt="Textile"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">1. Textile</div>
            </div>
            <div className="hs-making-step">
              <img
                src="/assets/han.jpg"
                alt="Hands"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">2. Hands</div>
            </div>
            <div className="hs-making-step">
              <img
                src="/assets/ctn.jpg"
                alt="Cutting"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">3. Cutting</div>
            </div>
            <div className="hs-making-step">
              <img
                src="/assets/wev.jpg"
                alt="Stitching & Weaving"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">4. Stitching</div>
            </div>
            <div className="hs-making-step">
              <img
                src="/assets/cloth.png"
                alt="Finishing"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">5. Finishing</div>
            </div>
            <div className="hs-making-step">
              <img
                src="/assets/model.png"
                alt="Woman Wearing Sum"
                className="hs-making-step__img"
              />
              <div className="hs-making-step__label">6. Garment</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link href="/our-story" className="hs-btn hs-btn--secondary">
              See How It Comes Together <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 08. JOURNAL ─── */}
      <section className="hs-section hs-section--alt" id="journal">
        <div className="hs-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <span className="hs-eyebrow">The Sum Journal</span>
              <h2 className="hs-headline" style={{ marginBottom: 12 }}>
                Things worth talking about.
              </h2>
              <p className="hs-copy" style={{ marginBottom: 0 }}>
                A place for stories about clothes, people, places and the things
                we discover along the way.
                {"\n"}Sometimes we&apos;ll write them. Sometimes you will.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/journal" className="hs-btn hs-btn--secondary">
                Explore the Journal
              </Link>
              <Link
                href="/journal#submission-form"
                className="hs-btn hs-btn--primary"
              >
                Share Your Story
              </Link>
            </div>
          </div>

          {/* Interactive Story Highlight Tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            {[
              { id: "all", label: "All Highlights" },
              { id: "museum", label: "Khadi Museum" },
              { id: "bharatpur", label: "Bharatpur Weavers" },
              { id: "miras", label: "Mira's College" },
              { id: "community", label: "Community Stories" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveJournalTab(tab.id)}
                style={{
                  background:
                    activeJournalTab === tab.id ? "#1a140e" : "#ffffff",
                  color: activeJournalTab === tab.id ? "#FAF6F0" : "#4a3c30",
                  border: `1.5px solid ${activeJournalTab === tab.id ? "#1a140e" : "rgba(42,31,20,0.12)"}`,
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabbed Stories Grid */}
          <div className="hs-journal-grid">
            {(activeJournalTab === "all" ||
              activeJournalTab === "bharatpur") && (
              <Link href="/journal" className="hs-journal-card">
                <img
                  src="/assets/wev.jpg"
                  alt="Bharatpur Weaving Village"
                  className="hs-journal-card__img"
                />
                <div className="hs-journal-card__body">
                  <span className="hs-journal-card__cat">
                    Places · Bharatpur
                  </span>
                  <h3 className="hs-journal-card__title">
                    The Handlooms of Bharatpur: Walking Through MP&apos;s
                    Weaving Villages
                  </h3>
                  <span className="hs-journal-card__read">
                    Read Entry <FiArrowRight />
                  </span>
                </div>
              </Link>
            )}

            {(activeJournalTab === "all" || activeJournalTab === "museum") && (
              <Link href="/journal" className="hs-journal-card">
                <img
                  src="/assets/chakra.jpg"
                  alt="Khadi Museum Archives"
                  className="hs-journal-card__img"
                />
                <div className="hs-journal-card__body">
                  <span className="hs-journal-card__cat">Cloth · Archive</span>
                  <h3 className="hs-journal-card__title">
                    Inside The Khadi Museum: Living Archives of Slow Time
                  </h3>
                  <span className="hs-journal-card__read">
                    Watch & Read <FiArrowRight />
                  </span>
                </div>
              </Link>
            )}

            {(activeJournalTab === "all" || activeJournalTab === "miras") && (
              <Link href="/journal" className="hs-journal-card">
                <img
                  src="/assets/img/18.png"
                  alt="Mira's College Everyday Uniform"
                  className="hs-journal-card__img"
                />
                <div className="hs-journal-card__body">
                  <span className="hs-journal-card__cat">People & Living</span>
                  <h3 className="hs-journal-card__title">
                    Mira&apos;s College: The Everyday Uniform of Real Living
                  </h3>
                  <span className="hs-journal-card__read">
                    Read Entry <FiArrowRight />
                  </span>
                </div>
              </Link>
            )}

            {(activeJournalTab === "all" ||
              activeJournalTab === "community") && (
              <Link href="/journal" className="hs-journal-card">
                <img
                  src="/assets/img/23.png"
                  alt="Community Wardrobe Story"
                  className="hs-journal-card__img"
                />
                <div className="hs-journal-card__body">
                  <span className="hs-journal-card__cat">Your Stories</span>
                  <h3 className="hs-journal-card__title">
                    My Grandmother&apos;s 40-Year-Old Odhna: The Pieces We Keep
                  </h3>
                  <span className="hs-journal-card__read">
                    Read Entry <FiArrowRight />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── 09. COMMUNITY / PARTICIPATION ─── */}
      <section className="hs-section" id="community">
        <div className="hs-container">
          <div className="hs-community-box">
            <span className="hs-eyebrow">Community & Stories</span>
            <h2 className="hs-headline">Have a story? Tell us.</h2>
            <p className="hs-copy">
              Maybe you know a weaver we should meet.
              {"\n"}Maybe there&apos;s a textile from your hometown we&apos;ve
              never heard of.
              {"\n"}Maybe a piece of clothing carries a story you&apos;ll never
              forget.
              {"\n"}We&apos;d like to hear it.
            </p>
            <div style={{ marginTop: 28 }}>
              <Link
                href="/journal#submit-story"
                className="hs-btn hs-btn--light"
              >
                Share Your Story <FiArrowRight />
              </Link>
            </div>
            <p className="hs-community-note">
              You choose whether we&apos;d be allowed to share your submission
              on our social channels.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL SHOPPING MOMENT ─── */}
      <section className="hs-final-shop" id="final-shop">
        <div className="hs-container" style={{ maxWidth: 760 }}>
          <span className="hs-eyebrow">Sum Clothico</span>
          <h2 className="hs-headline">
            Find something you&apos;ll want to live in.
          </h2>
          <p className="hs-copy">
            Thoughtful clothes. Handwoven beginnings. Made for your everyday.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link
              href="/shop"
              className="hs-btn hs-btn--primary"
              style={{ padding: "16px 36px", fontSize: "0.88rem" }}
            >
              Shop Sum Clothico <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
