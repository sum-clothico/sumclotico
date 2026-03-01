import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-black font-sans selection:bg-white/30 selection:text-white flex flex-col items-center">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto grow">
        {/* Hero Section (Viewport 1) */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-16 w-full px-6 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
          {/* Logo Area */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 overflow-hidden rounded-full border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] transition-all hover:scale-[1.02] hover:border-white/30 duration-1000 group">
            <Image
              src="/logo.jpg"
              alt="Sumclotico Logo"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000"></div>
          </div>

          {/* Typography Section */}
          <div className="flex flex-col items-center gap-10">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-[0.4em] font-light uppercase ml-4">
              Sumclotico
            </h1>

            {/* Divider */}
            <div className="w-24 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
          </div>

          {/* Dynamic Copy */}
          <p className="font-serif italic text-2xl md:text-4xl text-white/80 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            "We are building the roots."
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 flex flex-col items-center gap-3 animate-pulse opacity-60">
            <span className="text-[9px] uppercase tracking-[0.4em] text-white">
              Scroll
            </span>
            <div className="w-px h-12 bg-white/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white origin-top animate-[scale-y_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </section>

        {/* About Section (Viewport 2) */}
        <section className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-16 px-6 lg:px-24 py-32 border-t border-white/5 relative">
          {/* Section Label */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">
              Our Roots
            </span>
            <div className="w-px h-8 bg-white/20"></div>
          </div>

          {/* Story Content */}
          <div className="flex flex-col w-full lg:w-1/2 space-y-10 lg:pl-12 mt-16 lg:mt-0 z-10">
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-widest font-light leading-tight">
              Crafting <br /> The Foundation.
            </h2>

            <div className="space-y-6 text-white/60 font-light tracking-wide leading-loose text-sm md:text-base max-w-lg">
              <p>
                Every legacy begins beneath the surface. At Sumclotico, we are
                not just designing garments; we are cultivating an ethos.
              </p>
              <p>
                Rooted in an uncompromising dedication to craftsmanship, our
                journey starts with intention. Before the first stitch is sewn,
                we lay the groundwork for a modern aesthetic that balances raw
                authenticity with elevated minimalism.
              </p>
              <p>
                We are building the roots. A slow, methodical process focused on
                quality over noise, preparing for a future where fashion speaks
                quietly, yet profoundly.
              </p>
            </div>

            <div className="w-12 h-px bg-white/30 pt-4"></div>
          </div>

          {/* Abstract Visual / Atmosphere */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center opacity-80 z-0">
            <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[550px] overflow-hidden rounded-sm group">
              {/* Grayscale overlay filter to match the brand aesthetic on a placeholder image */}
              <Image
                src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?q=80&w=1000&auto=format&fit=crop"
                alt="Abstract aesthetic representing foundation and roots"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-2000 group-hover:scale-110 opacity-70"
              />
              {/* Elegant Frame */}
              <div className="absolute inset-4 border border-white/10 pointer-events-none"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Area with Connect Integration */}
      <footer className="relative z-10 flex flex-col items-center pb-12 w-full border-t border-white/5 pt-12">
        <a
          href="https://www.instagram.com/sumclothico/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 transition-all duration-500"
        >
          <div className="relative w-12 h-12 rounded-full border border-white/30 flex items-center justify-center overflow-hidden">
            {/* Hover fill background */}
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 w-4 h-4 text-white group-hover:text-black transition-colors duration-500"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors duration-500 ml-1">
            Follow
          </span>
        </a>
      </footer>
    </div>
  );
}
