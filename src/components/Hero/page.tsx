"use client";

import { useState } from "react";
import "./hero.css";  // ← Add this import

type Magazine = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

const magazines: Magazine[] = [
  {
    id: 1,
    title: "Leaders Build Legacies",
    subtitle: "Leadership Edition",
    image: "/magazine1.jpg",
  },
  {
    id: 2,
    title: "The Future of Business",
    subtitle: "Innovation Edition",
    image: "/magazine2.jpg",
  },
  {
    id: 3,
    title: "Beyond Boundaries",
    subtitle: "Global Edition",
    image: "/magazine3.jpg",
  },
];

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);

  const getPosition = (index: number) => {
    const total = magazines.length;
    const difference = (index - activeIndex + total) % total;

    if (difference === 0) return "active";
    if (difference === 1) return "right";

    return "left";
  };

  const handleMagazineClick = (index: number) => {
    setActiveIndex(index);
  };

  const scrollToStories = () => {
    const stories = document.getElementById("stories");

    if (stories) {
      stories.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="hero">
      {/* ================= BACKGROUND ================= */}
      <div className="hero-background">
        <div className="hero-grid" />

        <div className="hero-globe">
          <div className="globe-ring globe-ring-1" />
          <div className="globe-ring globe-ring-2" />
          <div className="globe-ring globe-ring-3" />

          <div className="globe-line globe-line-1" />
          <div className="globe-line globe-line-2" />
          <div className="globe-line globe-line-3" />
        </div>

        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="hero-wave hero-wave-one" />
        <div className="hero-wave hero-wave-two" />
      </div>

      {/* ================= MAIN HERO ================= */}
      <div className="hero-inner">
        {/* ================= LEFT CONTENT ================= */}
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            <span className="hero-kicker-text">
              GLOBAL BUSINESS &amp; TECHNOLOGY MEDIA
            </span>
          </div>

          <h1 className="hero-title">
            STORIES OF VISION.
            <br />
            VOICES OF IMPACT.
          </h1>

          <p className="hero-description">
            ICONIQSPHERE brings you inspiring stories of leaders and
            organizations shaping a better tomorrow.
          </p>

          {/* ================= ACTIONS ================= */}
          <div className="hero-actions">
            <button
              type="button"
              className="hero-button"
              onClick={scrollToStories}
            >
              <span>EXPLORE STORIES</span>
              <span className="hero-button-arrow">→</span>
            </button>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="hero-stat-number">50K+</span>
                <span className="hero-stat-label">Global Readers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">100+</span>
                <span className="hero-stat-label">Cover Stories</span>
              </div>
            </div>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={() =>
                window.open("mailto:subscribe@iconiqsphere.com")
              }
            >
              <span>SUBSCRIBE</span>
            </button>
          </div>

          {/* ================= SMALL TAG ================= */}
          <div className="hero-bottom-label">
            <span className="bottom-label-line" />

            <span>
              A BRIGHTER TOMORROW,
              <br />
              TOGETHER
            </span>
          </div>
        </div>

        {/* ================= MAGAZINES ================= */}
        <div className="magazine-area">
          <div className="magazine-stage">
            {magazines.map((magazine, index) => {
              const position = getPosition(index);

              return (
                <button
                  key={magazine.id}
                  type="button"
                  className={`magazine-card magazine-${position}`}
                  onClick={() => handleMagazineClick(index)}
                  aria-label={`View ${magazine.title}`}
                >
                  <div className="magazine-image-wrap">
                    <img
                      src={magazine.image}
                      alt={magazine.title}
                      className="magazine-image"
                    />

                    {/* Fallback content */}
                    <div className="magazine-fallback">
                      <div className="fallback-brand">
                        ICONIQ<span>SPHERE</span>
                      </div>

                      <div className="fallback-small">
                        GLOBAL BUSINESS &amp;
                        <br />
                        TECHNOLOGY MEDIA
                      </div>

                      <div className="fallback-edition">
                        {magazine.subtitle}
                      </div>

                      <div className="fallback-title">
                        {magazine.title}
                      </div>

                      <div className="fallback-footer">
                        MAY 2025 | EDITION 23
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================= MAGAZINE SHELF ================= */}
          <div className="magazine-shelf">
            <span />
          </div>

          {/* ================= DOTS ================= */}
          <div className="magazine-dots">
            {magazines.map((magazine, index) => (
              <button
                key={magazine.id}
                type="button"
                className={
                  index === activeIndex ? "dot active" : "dot"
                }
                onClick={() => handleMagazineClick(index)}
                aria-label={`Select magazine ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}