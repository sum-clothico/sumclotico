"use client";

export default function ClipPathTitle({
  title,
  color,
  bg,
  className,
  borderColor,
}) {
  return (
    <div className="clip-path-title">
      <div
        className={`clip-path-title__inner ${className || ""}`}
        style={{
          clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
          borderColor: borderColor,
          opacity: 0,
        }}
      >
        <div
          className="clip-path-title__content"
          style={{ backgroundColor: bg }}
        >
          <h2 className="clip-path-title__text" style={{ color: color }}>
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
