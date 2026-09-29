"use client";

import Link from "next/link";
import "../styles/podcastSection.css";
import {
  ArrowUpRight,
  Clock3,
  Headphones,
  Mic2,
  Play,
  Radio,
  Sparkles,
} from "lucide-react";

const episodes = [
  {
    season: "S2",
    episode: "EP 11",
    number: "11",
    title: "The Leadership Code for a Disruptive Era",
    guest: "Mark Thompson",
    role: "CEO, Global Innovate Labs",
    date: "May 18, 2025",
    duration: "38:21",
    listeners: "1.2K",
    image: "/podcast-1.jpg",
  },
  {
    season: "S2",
    episode: "EP 10",
    number: "10",
    title: "Women Leading with Impact",
    guest: "Ananya Mehta",
    role: "Founder, Rise & Lead Initiative",
    date: "May 11, 2025",
    duration: "32:47",
    listeners: "987",
    image: "/podcast-2.jpg",
  },
  {
    season: "S2",
    episode: "EP 09",
    number: "09",
    title: "Tech, Trust & Transformation",
    guest: "Rahul Verma",
    role: "CTO, NextGen Systems",
    date: "May 04, 2025",
    duration: "41:05",
    listeners: "1.1K",
    image: "/podcast-3.jpg",
  },
  {
    season: "S2",
    episode: "EP 08",
    number: "08",
    title: "Sustainability as Strategy",
    guest: "Elena Rodriguez",
    role: "Sustainability Advisor",
    date: "Apr 27, 2025",
    duration: "29:14",
    listeners: "856",
    image: "/podcast-4.jpg",
  },
  {
    season: "S2",
    episode: "EP 07",
    number: "07",
    title: "The Future of Work is Human",
    guest: "James Collins",
    role: "Futurist & Workplace Strategist",
    date: "Apr 20, 2025",
    duration: "36:18",
    listeners: "1.3K",
    image: "/podcast-5.jpg",
  },
];

const features = [
  {
    icon: Mic2,
    title: "EXPERT CONVERSATIONS",
    text: "Insights from industry leaders & visionaries.",
  },
  {
    icon: Sparkles,
    title: "DIVERSE PERSPECTIVES",
    text: "Exploring ideas that shape tomorrow.",
  },
  {
    icon: Radio,
    title: "GLOBAL VOICES",
    text: "Stories from changemakers around the world.",
  },
  {
    icon: Clock3,
    title: "NEW EPISODES WEEKLY",
    text: "Fresh conversations, every week.",
  },
];

export default function PodcastsSection() {
  return (
    <>
      <section
        id="podcasts"
        className="w-full border-b border-slate-100 bg-white scroll-mt-24 podcasts-section"
      >
        <div className="mx-auto w-full max-w-[1360px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14 podcasts-container">

          {/* =====================================================
              HEADER (Aligned with NewsSection style)
          ====================================================== */}
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5 sm:mb-8 sm:pb-6 podcasts-heading-wrapper">
            {/* LEFT */}
            <div className="min-w-0">
              <span className="mb-2 block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#2a619d] sm:text-[10px] sm:tracking-[0.15em]">
                PODCASTS &amp; UPDATES
              </span>

              <h2 className="whitespace-nowrap text-[27px] font-black uppercase leading-none tracking-[-0.045em] text-[#082e63] sm:text-[36px] lg:text-[42px]">
                Podcasts
              </h2>
            </div>

            {/* RIGHT */}
            <Link
              href="/podcasts"
              className="group flex shrink-0 items-center gap-2 border-b-2 border-[#285a9c] pb-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#174a84] transition-all duration-200 hover:gap-3 sm:text-[10px]"
            >
              <span className="whitespace-nowrap">
                View All Episodes
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
              />
            </Link>
          </div>

          {/* =====================================================
              FEATURED PODCAST SECTION
          ====================================================== */}
          <article className="featured-podcast">

            {/* Left text box */}
            <div className="featured-text-overlay">
              <span className="overlay-eyebrow">ICONIQSPHERE</span>
              <h2 className="overlay-title">
                VOICES THAT
                <br />
                <span>INSPIRE</span>
                <br />
                CHANGE.
              </h2>
              <p className="overlay-desc">
                ICONIQSPHERE Podcasts bring you thought-provoking
                conversations with leaders, innovators, and changemakers
                from around the world.
              </p>
            </div>

            {/* Center microphone visual */}
            <div className="featured-visual">
              <div className="visual-grid" />

              <div className="sound-wave">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      height: `${16 + ((index * 13) % 45)}px`,
                    }}
                  />
                ))}
              </div>

              <div className="microphone">
                <div className="mic-head">
                  <div className="mic-highlight" />
                </div>

                <div className="mic-body">
                  <div className="mic-line" />
                  <div className="mic-line" />
                  <div className="mic-line" />
                  <div className="mic-line" />
                </div>

                <div className="mic-stand" />
                <div className="mic-base" />
              </div>
            </div>

            {/* =====================================================
                COMPACT, PREMIUM, PROFESSIONAL RIGHT CARD
            ====================================================== */}
            <div className="featured-card">
              <div className="featured-card-top">
                <span>FEATURED EPISODE</span>

                <div className="featured-wave">
                  <i style={{ height: "8px" }} />
                  <i style={{ height: "13px" }} />
                  <i style={{ height: "18px" }} />
                  <i style={{ height: "11px" }} />
                  <i style={{ height: "20px" }} />
                  <i style={{ height: "14px" }} />
                  <i style={{ height: "10px" }} />
                </div>

                <button
                  type="button"
                  className="featured-play"
                  aria-label="Play featured episode"
                >
                  <Play size={9} fill="currentColor" />
                </button>
              </div>

              <div className="featured-card-content">
                <div className="featured-image">
                  <img
                    src="/podcast-featured.jpg"
                    alt="Featured podcast guest"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="featured-image-placeholder">
                    <Headphones size={28} strokeWidth={1.1} />
                  </div>
                </div>

                <div className="featured-info">
                  <span className="episode-meta">S2 · EP 12</span>

                  <h3>
                    Building Future-Ready
                    <br />
                    Organizations
                  </h3>

                  <p className="featured-guest">
                    with <strong>Priya Nair</strong>
                  </p>

                  <p className="featured-role">
                    Chief People Officer, TechNova Global
                  </p>

                  <div className="featured-bottom">
                    <button type="button" className="listen-button">
                      <span>LISTEN NOW</span>
                      <Play size={7} fill="currentColor" />
                    </button>

                    <span className="featured-duration">45:32</span>
                  </div>
                </div>
              </div>
            </div>

          </article>

          {/* =====================================================
              FEATURE STRIP
          ====================================================== */}
          <div className="podcast-features">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div className="podcast-feature" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={21} strokeWidth={1.5} />
                  </div>

                  <div className="feature-content">
                    <span>{feature.title}</span>
                    <p>{feature.text}</p>
                  </div>

                  {index !== features.length - 1 && (
                    <div className="feature-divider" />
                  )}
                </div>
              );
            })}
          </div>

          {/* =====================================================
              BROWSE HEADER
          ====================================================== */}
          <div className="browse-header">
            <h3>BROWSE PODCASTS</h3>

            <Link href="/podcasts" className="browse-all">
              <span>VIEW ALL EPISODES</span>
              <ArrowUpRight size={15} strokeWidth={2} />
            </Link>
          </div>

          {/* =====================================================
              EPISODE CARDS
          ====================================================== */}
          <div className="episodes-grid">
            {episodes.map((episode) => (
              <article className="episode-card" key={episode.number}>
                <Link href="/podcasts" className="episode-image">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="episode-image-placeholder">
                    <Mic2 size={36} strokeWidth={1} />
                  </div>

                  <div className="episode-image-overlay" />

                  <span className="episode-number">
                    {episode.season} - {episode.episode}
                  </span>

                  <span className="episode-play">
                    <Play size={14} fill="currentColor" />
                  </span>

                  <span className="episode-duration">
                    {episode.duration}
                  </span>
                </Link>

                <div className="episode-content">
                  <h4>{episode.title}</h4>

                  <div className="episode-guest">
                    with <strong>{episode.guest}</strong>
                  </div>

                  <div className="episode-role">{episode.role}</div>

                  <div className="episode-footer">
                    <span>{episode.date}</span>
                    <span className="episode-listeners">◉ {episode.listeners}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* =====================================================
              NEVER MISS
          ====================================================== */}
          <div className="never-miss">
            <div className="never-miss-left">
              <div className="never-miss-icon">
                <Radio size={20} strokeWidth={1.4} />
              </div>

              <div>
                <h3>Never Miss an Episode</h3>
                <p>Subscribe now and get notified when new conversations go live.</p>
              </div>
            </div>

            <form
              className="subscribe-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
              />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}