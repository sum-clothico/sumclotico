"use client";

import React from "react";

/**
 * FormattedDescription
 * Parses and displays product editorial descriptions with clean paragraphs,
 * structured bullet sections (e.g. THE DETAILS, WEAR IT FOR), and styling callouts.
 */
export default function FormattedDescription({ description, className = "", style = {} }) {
  if (!description) return null;

  // Normalize any escaped literal newlines (\n or \r\n) from JSON/DB serialization
  const normalizedDesc = typeof description === "string"
    ? description.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n")
    : String(description);

  // Split description if it contains known structured section headings (sorted by length desc)
  const sectionKeywords = [
    "STYLE IT YOUR WAY",
    "THE DETAILS",
    "WEAR IT FOR",
    "FABRIC & CARE",
    "HOW IT FITS",
    "SPECIFICATIONS",
    "THE FIT",
    "WASH CARE",
    "DETAILS",
  ];

  // Check if any keyword exists
  const hasSections = sectionKeywords.some((kw) =>
    normalizedDesc.toLowerCase().includes(kw.toLowerCase())
  );

  if (!hasSections) {
    // Normal paragraphs preservation
    const paragraphs = normalizedDesc.split(/\n\s*\n/).filter(Boolean);
    return (
      <div className={className} style={{ ...style, lineHeight: 1.75, color: "#4A3E36" }}>
        {paragraphs.map((p, idx) => (
          <p key={idx} style={{ margin: "0 0 12px", whiteSpace: "pre-line" }}>
            {p}
          </p>
        ))}
      </div>
    );
  }

  // Parse structured sections
  // Step 1: Normalize keyword boundaries with special delimiters
  let text = normalizedDesc;
  sectionKeywords.forEach((kw) => {
    // Matches keyword followed by colon, dash, newline or space
    const r = new RegExp(`(?:^|[\\n\\s])(${kw})[:\\s—–\\-]+`, "gi");
    text = text.replace(r, (match, p1) => `\n\n__SECTION__${p1}__TITLE__`);
  });

  const parts = text.split("__SECTION__").filter(Boolean);

  return (
    <div className={className} style={{ ...style, lineHeight: 1.7, color: "#3f3329" }}>
      {parts.map((part, idx) => {
        if (part.includes("__TITLE__")) {
          const [title, ...contentArr] = part.split("__TITLE__");
          const content = contentArr.join("").trim();
          const cleanTitle = title.trim().toUpperCase();

          // Check if content has bullet delimiters (•, *, |, or newline dashes)
          const isBulleted =
            content.includes("•") ||
            content.includes("*") ||
            content.includes("|") ||
            /\n\s*[-–•*]\s*/.test(content);

          if (isBulleted) {
            const items = content
              .split(/(?:[•*|]|\n\s*[-–•*]\s*)/)
              .map((i) => i.trim())
              .filter(Boolean);

            const isWearItFor = cleanTitle.includes("WEAR");

            return (
              <div key={idx} style={{ marginTop: 14, marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#660608",
                    marginBottom: 8,
                  }}
                >
                  ✦ {cleanTitle}
                </div>
                {isWearItFor ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((item, iIdx) => (
                      <span
                        key={iIdx}
                        style={{
                          background: "#f4ebe1",
                          color: "#4A3E36",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#4A3E36" }}>
                    {items.map((item, iIdx) => (
                      <li key={iIdx} style={{ marginBottom: 4, whiteSpace: "pre-line" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          // Plain text section (like STYLE IT YOUR WAY)
          return (
            <div
              key={idx}
              style={{
                marginTop: 14,
                marginBottom: 14,
                background: "#faf6f0",
                borderLeft: "3px solid #881A1C",
                padding: "10px 14px",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#660608",
                  marginBottom: 4,
                }}
              >
                {cleanTitle}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#4A3E36", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {content}
              </p>
            </div>
          );
        }

        // Introductory story paragraphs
        const introParagraphs = part.split(/\n\s*\n/).filter(Boolean);
        return (
          <div key={idx} style={{ marginBottom: 12 }}>
            {introParagraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                style={{
                  margin: "0 0 10px",
                  lineHeight: 1.7,
                  fontSize: 14,
                  color: "#4A3E36",
                  whiteSpace: "pre-line",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
