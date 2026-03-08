import Image from "next/image";

export default function Home() {
  const images = [
    "/img/1.png",
    "/img/2.png",
    "/img/3.png",
    "/img/4.png",
    "/img/5.png",
    "/img/8.png",
    "/img/9.png",
    "/img/11.png",
  ];

  return (
    <div className="relative min-h-screen w-full bg-background font-sans selection:bg-foreground/20 selection:text-foreground flex flex-col items-center text-foreground overflow-x-hidden">
      {/* Global Background Texture Overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage: "url('/texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* Decorative Outer Border Box to match style of reference image */}
      <div className="fixed inset-8 md:inset-12 border border-foreground/30 pointer-events-none z-0 hidden lg:block"></div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto grow">
        {/* Hero Section - 3 Column Layout */}
        <section className="min-h-screen flex flex-col justify-center items-center w-full px-6 md:px-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-8 md:gap-16 pt-24 md:pt-0">
            {/* Left Image (Hidden on very small screens, visible on md+) */}
            <div className="w-full md:w-1/3 aspect-3/4 relative hidden md:block overflow-hidden group">
              <Image
                src="/img/7.png"
                alt="Khadi Fashion Left"
                fill
                priority
                className="object-cover transition-transform duration-2000 group-hover:scale-105 sepia-[.1]"
              />
              <div className="absolute inset-0 border border-foreground/10 pointer-events-none"></div>
            </div>

            {/* Center Logo Area */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/3 order-first md:order-0 z-10 space-y-8">
              <div className="relative w-56 h-56 md:w-72 md:h-72 hover:scale-105 transition-transform duration-700">
                <Image
                  src="/logo.png"
                  alt="Sumclotico Logo"
                  fill
                  priority
                  className="object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex flex-col items-center gap-6 text-center">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-normal tracking-wide leading-tight mt-8">
                  Rooting for Khadi
                </h1>
                <div className="w-12 h-px bg-foreground/40"></div>
                <p className="text-foreground uppercase tracking-[0.3em] font-medium text-[9px] md:text-[11px]">
                  Slow fashion. Sustainable soul.
                </p>
              </div>
            </div>

            {/* Right Image (Hidden on very small screens, visible on md+) */}
            <div className="w-full md:w-1/3 aspect-3/4 relative hidden md:block overflow-hidden group">
              <Image
                src="/img/6.png"
                alt="Khadi Fashion Right"
                fill
                priority
                className="object-cover transition-transform duration-2000 group-hover:scale-105 sepia-[.1]"
              />
              <div className="absolute inset-0 border border-foreground/10 pointer-events-none"></div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 flex flex-col items-center gap-3 animate-pulse opacity-60">
            <span className="text-[9px] uppercase tracking-[0.4em] text-foreground">
              Explore
            </span>
            <div className="w-px h-12 bg-foreground/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-foreground origin-top animate-[scale-y_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="w-full flex flex-col lg:flex-row items-center justify-center gap-16 px-6 lg:px-24 py-32 mt-12 relative">
          {/* Section Label */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/50">
              Our Roots
            </span>
            <div className="w-px h-12 bg-foreground/20"></div>
          </div>

          {/* Story Content */}
          <div className="flex flex-col w-full lg:w-1/2 space-y-10 lg:pl-12 mt-16 lg:mt-0 z-10 order-1 lg:order-2">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-normal tracking-wide leading-[1.1]">
              Crafting <br /> The Foundation.
            </h2>

            <div className="space-y-8 text-foreground font-normal tracking-wide leading-[2em] text-[13px] md:text-sm max-w-lg mt-8">
              <p>
                Every piece of fabric holds a story. At Sumclotico, we are
                deeply rooted in celebrating India's rich textile heritage,
                honoring the artisans who weave magic with their hands.
              </p>
              <p>
                Rooting for Khadi means embracing a slow, deliberate lifestyle.
                We focus on earthy tones, natural fibers, and a timeless
                aesthetic that lives beyond seasonal trends.
              </p>
            </div>

            <div className="w-16 h-px bg-foreground/30 pt-4"></div>
          </div>

          {/* Abstract Visual / Atmosphere */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center opacity-90 z-0 order-2 lg:order-1">
            <div className="relative w-full aspect-[4/5] max-w-sm overflow-hidden group">
              <Image
                src="/img/10.png"
                alt="Khadi Texture"
                fill
                className="object-cover transition-all duration-2000 group-hover:scale-105 opacity-90 sepia-[.3]"
              />
              {/* Elegant Frame matching overarching theme */}
              <div className="absolute inset-4 border border-background/40 pointer-events-none"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Instagram Auto-scrolling Carousel (Moved outside <main> for full width) */}
      <section className="w-full py-24 flex flex-col items-center bg-foreground/[0.03] border-y border-foreground/10 overflow-hidden relative z-10">
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/60">
            Journal
          </span>
          <h3 className="font-serif text-2xl md:text-4xl text-foreground tracking-wider font-light">
            Follow our journey
          </h3>
        </div>

        {/* Auto-scrolling Track */}
        <div className="w-[200vw] overflow-hidden flex select-none relative z-10 bg-transparent">
          <div className="flex flex-row w-max animate-[scroll-x_40s_linear_infinite] hover:[animation-play-state:paused] gap-4 md:gap-6 px-2 md:px-3">
            {/* Duplicate the array to create an infinite loop effect */}
            {[...images, ...images].map((img, i) => (
              <a
                key={i}
                href="https://www.instagram.com/sumclothico/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-[250px] sm:h-[300px] md:h-[400px] aspect-3/4 overflow-hidden shrink-0 flex items-center justify-center bg-foreground/5"
              >
                <Image
                  src={img}
                  alt={`Instagram Feed ${i}`}
                  fill
                  className="object-cover transition-transform duration-2000 group-hover:scale-105 sepia-[.1]"
                  sizes="(max-width: 768px) 300px, 400px"
                />
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-foreground text-xs uppercase tracking-widest px-6 py-3 border border-foreground/50 bg-background/80">
                    View Post
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <a
          href="https://www.instagram.com/sumclothico/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 group relative px-8 py-4 overflow-hidden border border-foreground/30 hover:border-foreground transition-colors duration-500 text-foreground z-20"
        >
          <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase font-medium group-hover:text-background transition-colors duration-500">
            @sumclothico
          </span>
          <div className="absolute inset-0 h-full w-full bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
        </a>
      </section>

      {/* Footer Area with Connect Integration */}
      <footer className="relative z-10 flex flex-col items-center pb-12 w-full pt-16">
        <a
          href="https://www.instagram.com/sumclothico/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 transition-all duration-500 hover:opacity-70"
        >
          <div className="relative w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center overflow-hidden">
            {/* Hover fill background */}
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 w-4 h-4 text-foreground group-hover:text-background transition-colors duration-500"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-foreground/50 group-hover:text-foreground transition-colors duration-500 ml-1">
            Instagram
          </span>
        </a>
      </footer>
    </div>
  );
}
