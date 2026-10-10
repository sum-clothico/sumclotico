import React from "react";

const ARCH_PATH =
  "M 0,0 L 0.05,0.00 L 1.73,0.52 L 2.32,1.05 L 2.70,1.62 L 4.49,2.14 L 6.92,2.71 L 7.78,3.23 L 8.32,3.75 L 8.76,4.32 L 8.97,4.85 L 9.19,5.41 L 9.30,5.94 L 9.35,6.50 L 10.49,7.03 L 11.89,7.55 L 12.65,8.12 L 13.14,8.64 L 13.51,9.21 L 13.84,9.74 L 14.11,10.30 L 14.32,10.83 L 14.54,11.35 L 14.81,11.92 L 15.08,12.44 L 15.30,13.01 L 15.62,13.53 L 15.95,14.10 L 16.32,14.62 L 16.81,15.15 L 17.57,15.72 L 17.62,16.24 L 16.86,16.81 L 16.38,17.33 L 15.95,17.86 L 15.62,18.42 L 15.30,18.95 L 15.08,19.51 L 14.81,20.04 L 14.59,20.61 L 14.32,21.13 L 14.11,21.65 L 13.84,22.22 L 13.57,22.74 L 13.14,23.31 L 12.65,23.84 L 11.89,24.40 L 10.70,24.93 L 9.35,25.45 L 9.30,26.02 L 9.19,26.54 L 9.03,27.11 L 8.76,27.63 L 8.38,28.20 L 7.84,28.73 L 7.03,29.25 L 4.97,29.82 L 2.76,30.34 L 2.32,30.91 L 1.78,31.43 L 0.00,32.00 L 0,32 Z";

export default function IndianArchBadge({
  children,
  color = "#660608",
  textColor = "#ffffff",
  height = 32,
  widthRatio = 18,
  style = {},
  className = "",
}) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        position: "relative",
        boxShadow: "none",
        filter: "none",
        maxWidth: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Left Indian Arch End (Pointing Left) */}
      <svg
        width={widthRatio}
        height={height}
        viewBox="0 0 18 32"
        style={{
          display: "block",
          flexShrink: 0,
          transform: "scaleX(-1)",
          marginRight: "-1px", // Seamless joint
        }}
        aria-hidden="true"
      >
        <path d={ARCH_PATH} fill={color} />
      </svg>

      {/* Center Body with Text */}
      <div
        style={{
          background: color,
          color: textColor,
          height: height,
          padding: "0 10px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "clamp(9.5px, 2.4vw, 11px)",
          fontWeight: 800,
          letterSpacing: "clamp(1px, 0.35vw, 2.5px)",
          textTransform: "uppercase",
          boxShadow: "none",
          whiteSpace: "nowrap",
          maxWidth: "calc(100vw - 64px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </div>

      {/* Right Indian Arch End (Pointing Right) */}
      <svg
        width={widthRatio}
        height={height}
        viewBox="0 0 18 32"
        style={{
          display: "block",
          flexShrink: 0,
          marginLeft: "-1px", // Seamless joint
        }}
        aria-hidden="true"
      >
        <path d={ARCH_PATH} fill={color} />
      </svg>
    </div>
  );
}
