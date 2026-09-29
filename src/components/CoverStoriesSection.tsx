"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import "../styles/cover-stories.css";  // ← Add this import

const coverStories = [
  {
    id: "01",
    edition: "SPECIAL ISSUE // Q2 2026",
    title: "The Architects of Autonomous Enterprise",
    subtitle: "How visionary leaders are redesigning global infrastructure with recursive AI and decentralized trust.",
    author: "Elena Rostova",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85",
    href: "/cover-stories/architects-of-autonomous-enterprise",
  },
  {
    id: "02",
    edition: "GLOBAL INNOVATION // MAY 2026",
    title: "Beyond Silicon: The Quantum Workforce",
    subtitle: "Inside the laboratories where quantum supremacy is transitioning from theoretical physics to enterprise dominance.",
    author: "Dr. Marcus Vance",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85",
    href: "/cover-stories/beyond-silicon-quantum-workforce",
  },
  {
    id: "03",
    edition: "EXECUTIVE BRIEF // SPRING 2026",
    title: "The Capital Renaissance of Green Tech",
    subtitle: "Trillions in sovereign wealth are shifting toward closed-loop manufacturing and scalable carbon-negative energy.",
    author: "Siddharth Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=85",
    href: "/cover-stories/capital-renaissance-green-tech",
  },
];

export default function CoverStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextStory = () => {
    setActiveIndex((prev) => (prev + 1) % coverStories.length);
  };

  const prevStory = () => {
    setActiveIndex((prev) => (prev - 1 + coverStories.length) % coverStories.length);
  };

  const current = coverStories[activeIndex];

  return (
    <section
      id="cover-stories"
      className="w-full border-b border-slate-100 bg-white scroll-mt-24 cover-stories-section"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14 cover-stories-container">

        {/* =====================================================
            HEADER (Aligned with News & Podcasts sections)
        ====================================================== */}
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5 sm:mb-8 sm:pb-6 cover-stories-heading-wrapper">
          {/* LEFT */}
          <div className="min-w-0">
            <span className="mb-2 block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#2a619d] sm:text-[10px] sm:tracking-[0.15em]">
              ICONIQ SPHERE EDITORIAL
            </span>

            <h2 className="whitespace-nowrap text-[27px] font-black uppercase leading-none tracking-[-0.045em] text-[#082e63] sm:text-[36px] lg:text-[42px]">
              Cover Stories
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Interactive Carousel Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-full">
              <button
                type="button"
                onClick={prevStory}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#082e63] hover:bg-white transition-colors shadow-sm"
                aria-label="Previous story"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[9px] font-bold px-2 text-[#082e63]">
                0{activeIndex + 1} / 0{coverStories.length}
              </span>
              <button
                type="button"
                onClick={nextStory}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#082e63] hover:bg-white transition-colors shadow-sm"
                aria-label="Next story"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <Link
              href="/cover-stories"
              className="group flex shrink-0 items-center gap-2 border-b-2 border-[#285a9c] pb-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#174a84] transition-all duration-200 hover:gap-3 sm:text-[10px]"
            >
              <span className="whitespace-nowrap">
                View All Archive
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
              />
            </Link>
          </div>
        </div>

        {/* =====================================================
            DYNAMIC SHOWCASE DISPLAY
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#edf3f9] border border-slate-200/80 rounded-xl overflow-hidden p-6 sm:p-8 shadow-sm">
          
          {/* Left Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 z-10">
            <div>
              <div className="inline-block px-2.5 py-1 rounded bg-[#082e63] text-white text-[8.5px] font-black uppercase tracking-widest mb-4">
                {current.edition}
              </div>

              <div className="text-[#5a7393] font-mono text-[10px] mb-2 uppercase tracking-wider">
                FEATURE STORY // <span className="text-[#082e63] font-extrabold">{current.id}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#082e63] leading-[1.1] mb-3">
                {current.title}
              </h3>

              <p className="text-[#5a7393] text-xs sm:text-sm leading-relaxed font-medium mb-4">
                {current.subtitle}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-300/60">
              <div className="flex items-center justify-between text-[11px] text-[#5a7393]">
                <span>By <strong className="text-[#082e63] font-bold">{current.author}</strong></span>
                <span className="font-semibold">{current.readTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={current.href}
                  className="inline-flex items-center gap-2 bg-[#082e63] hover:bg-[#123f78] text-white px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all shadow-md group"
                >
                  <span>Read Full Story</span>
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* Mobile controls */}
                <div className="flex sm:hidden items-center gap-1">
                  <button onClick={prevStory} className="p-2 bg-white rounded border border-slate-200 text-[#082e63]">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={nextStory} className="p-2 bg-white rounded border border-slate-200 text-[#082e63]">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[350px] lg:h-[380px] rounded-lg overflow-hidden group shadow-inner">
            <img
              key={current.image}
              src={current.image}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[9px] font-bold tracking-wider text-[#082e63]">
              COVER STORY {current.id}
            </div>
          </div>

        </div>

        {/* =====================================================
            SELECTION TABS STRIP
        ====================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {coverStories.map((story, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`text-left p-3.5 rounded-xl transition-all border flex items-center gap-3.5 ${
                  isActive
                    ? "bg-[#082e63] text-white border-[#082e63] shadow-md"
                    : "bg-white text-[#082e63] border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative bg-slate-200">
                  <img src={story.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`block text-[8px] font-mono mb-0.5 tracking-wider ${isActive ? "text-blue-200" : "text-[#2a619d]"}`}>
                    STORY {story.id}
                  </span>
                  <h4 className={`text-[11px] font-bold truncate ${isActive ? "text-white" : "text-[#082e63]"}`}>
                    {story.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}