"use client";

import React from "react";

/**
 * Traditional Indian Cusped/Scalloped Arch Architectural Frame
 * Replaces raster pillar images with a scalable vector scalloped arch silhouette
 * matching traditional Mughal/Rajput jharokha scalloped architecture.
 */
export default function ScallopedArchFrame({ side = "left" }) {
  const isRight = side === "right";

  // Build the outer scalloped arch contour path (viewBox 0 0 200 1000)
  const buildScallopPath = (inset = 0) => {
    let d = `M 0 ${inset} L ${75 - inset} ${inset} `;
    d += `A 25 25 0 0 1 ${110 - inset} ${22 + inset} `;
    d += `A 25 25 0 0 1 ${140 - inset} ${55 + inset} `;
    d += `A 25 25 0 0 1 ${164 - inset} ${96 + inset} `;
    d += `A 25 25 0 0 1 ${178 - inset} ${144 + inset} `;
    d += `A 25 25 0 0 1 ${184 - inset} ${196 + inset} `;
    
    let y = 196 + inset;
    for (let i = 0; i < 17; i++) {
      const ny = y + 42;
      d += `A 24 21 0 0 1 ${184 - inset} ${ny} `;
      y = ny;
    }
    
    d += `C 188 930, 194 950, 192 970 `;
    d += `C 190 985, 180 995, ${170 - inset} ${1000 - inset} `;
    d += `L 0 ${1000 - inset} Z`;
    return d;
  };

  const outerPath = buildScallopPath(0);
  const innerPath = buildScallopPath(6);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [isRight ? "right" : "left"]: 0,
        width: "clamp(110px, 13vw, 190px)",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        userSelect: "none",
        transform: isRight ? "scaleX(-1)" : "none",
        transformOrigin: isRight ? "right center" : "left center",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 1000"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <defs>
          <linearGradient
            id={`scallopGrad-${side}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#DFD3C3" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#D5C5B0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C9B59C" stopOpacity="0.18" />
          </linearGradient>

          <filter id={`softShadow-${side}`} x="-10%" y="-5%" width="120%" height="110%">
            <feDropShadow dx="3" dy="2" stdDeviation="4" floodColor="#2C2016" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* Base Scalloped Silhouette Fill & Primary Architectural Contour */}
        <path
          d={outerPath}
          fill={`url(#scallopGrad-${side})`}
          stroke="rgba(102, 6, 8, 0.28)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          filter={`url(#softShadow-${side})`}
        />

        {/* Delicate Inner Inset Stitched Contour Line */}
        <path
          d={innerPath}
          fill="none"
          stroke="rgba(139, 111, 71, 0.35)"
          strokeWidth="1"
          strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Traditional Corner Jharokha Rosette Ornament */}
        <g transform="translate(68, 68)" opacity="0.35">
          <circle cx="0" cy="0" r="14" fill="none" stroke="#660608" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#8B6F47" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="0" r="3" fill="#660608" />
          {/* Petal accents */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2="0"
              y2="-13"
              stroke="#660608"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
