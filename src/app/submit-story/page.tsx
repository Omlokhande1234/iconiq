"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Mic2,
  Newspaper,
  BookOpen,
  Sparkles,
} from "lucide-react";

const sections = [
  {
    id: "cover-stories",
    number: "01",
    name: "Cover Stories",
    description:
      "For exceptional leaders, companies and stories that deserve a deeper editorial spotlight.",
    icon: Sparkles,
  },
  {
    id: "articles",
    number: "02",
    name: "Articles",
    description:
      "Business, technology, leadership and industry stories prepared for editorial consideration.",
    icon: FileText,
  },
  {
    id: "magazines",
    number: "03",
    name: "Magazines",
    description:
      "Submit your story for consideration in an upcoming ICONIQ SPHERE magazine edition.",
    icon: BookOpen,
  },
  {
    id: "podcasts",
    number: "04",
    name: "Podcasts",
    description:
      "Share your expertise and apply for a featured conversation with ICONIQ SPHERE.",
    icon: Mic2,
  },
  {
    id: "news",
    number: "05",
    name: "News",
    description:
      "Timely company, product, business and industry announcements for editorial review.",
    icon: Newspaper,
  },
];

export default function SubmitStoryPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedSection = sections.find((item) => item.id === selected);

  return (
    <main className="story-submit-page">
      <section className="story-submit-hero">
        <div className="story-submit-shell">
          <div className="story-submit-breadcrumb">
            <Link href="/">ICONIQ SPHERE</Link>
            <span>/</span>
            <span>Submit Your Story</span>
          </div>

          <div className="story-submit-hero-content">
            <div className="story-submit-eyebrow">
              <span />
              SUBMIT YOUR STORY
            </div>

            <h1>
              Your story.
              <br />
              <em>Our platform.</em>
            </h1>

            <p>
              Tell us where your story belongs and our editorial team will
              guide you through the submission process.
            </p>
          </div>
        </div>
      </section>

      <section className="story-submit-selection">
        <div className="story-submit-shell">
          <div className="story-submit-section-head">
            <div>
              <span className="story-submit-kicker">01 / DESTINATION</span>
              <h2>Where should your story appear?</h2>
            </div>

            <p>
              Select the editorial destination that best matches your content.
              You can review your submission and applicable fee before payment.
            </p>
          </div>

          <div className="story-submit-list">
            {sections.map((item) => {
              const Icon = item.icon;
              const isSelected = selected === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`story-submit-row ${
                    isSelected ? "story-submit-row-selected" : ""
                  }`}
                  onClick={() => setSelected(item.id)}
                >
                  <span className="story-submit-number">{item.number}</span>

                  <span className="story-submit-icon">
                    <Icon size={17} strokeWidth={1.7} />
                  </span>

                  <span className="story-submit-row-copy">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>

                  <span className="story-submit-row-action">
                    {isSelected ? (
                      <span className="story-submit-selected">
                        <Check size={14} />
                        Selected
                      </span>
                    ) : (
                      <ArrowUpRight size={18} strokeWidth={1.7} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className={`story-submit-next ${
              selectedSection ? "story-submit-next-visible" : ""
            }`}
          >
            {selectedSection && (
              <>
                <div className="story-submit-next-copy">
                  <span className="story-submit-kicker">
                    02 / NEXT STEP
                  </span>
                  <strong>{selectedSection.name}</strong>
                  <span>
                    Continue to provide your story details.
                  </span>
                </div>

                <div className="story-submit-next-actions">
                  <Link
                    href={`/submit-story/${selectedSection.id}`}
                    className="story-submit-continue"
                  >
                    Continue
                    <ChevronRight size={17} />
                  </Link>

                  <button
                    type="button"
                    className="story-submit-change"
                    onClick={() => setSelected(null)}
                  >
                    Change
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="story-submit-footer-note">
            <span className="story-submit-gold-line" />
            <p>
              Every submission is reviewed by our editorial team. Pricing is
              presented at the appropriate stage before payment.
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .story-submit-page {
          --story-navy: #11113f;
          --story-primary: #24105f;
          --story-primary-light: #382080;
          --story-muted: #5d6075;
          --story-soft: #85889a;
          --story-border: #e5e5ed;
          --story-surface: #f7f7fa;
          --story-gold: #c8a951;

          min-height: 100vh;
          background: #ffffff;
          color: var(--story-navy);
          font-family: var(--font-inter), sans-serif;
        }

        .story-submit-page h1,
        .story-submit-page h2,
        .story-submit-page strong,
        .story-submit-page button {
          font-family: var(--font-manrope), sans-serif;
        }

        .story-submit-shell {
          width: min(1180px, calc(100% - 64px));
          margin: 0 auto;
        }

        .story-submit-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 86% 24%,
              rgba(56, 32, 128, 0.07),
              transparent 25%
            ),
            linear-gradient(180deg, #ffffff 0%, #fafafd 100%);
          border-bottom: 1px solid rgba(17, 17, 63, 0.07);
        }

        .story-submit-hero::after {
          content: "";
          position: absolute;
          right: 8%;
          bottom: -100px;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(200, 169, 81, 0.17);
          border-radius: 50%;
          pointer-events: none;
        }

        .story-submit-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 25px;
          color: #85889a;
          font-size: 10px;
          letter-spacing: 0.15px;
        }

        .story-submit-breadcrumb a {
          color: var(--story-navy);
          font-weight: 700;
        }

        .story-submit-hero-content {
          max-width: 700px;
          padding: 70px 0 76px;
        }

        .story-submit-eyebrow,
        .story-submit-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--story-primary-light);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .story-submit-eyebrow span {
          width: 30px;
          height: 1px;
          background: var(--story-gold);
        }

        .story-submit-hero h1 {
          margin: 19px 0 17px;
          color: var(--story-navy);
          font-size: clamp(46px, 6vw, 72px);
          line-height: 1.02;
          letter-spacing: -2.8px;
          font-weight: 750;
        }

        .story-submit-hero h1 em {
          color: var(--story-primary);
          font-family: Georgia, serif;
          font-weight: 400;
          letter-spacing: -2px;
        }

        .story-submit-hero p {
          max-width: 555px;
          margin: 0;
          color: var(--story-muted);
          font-size: 14px;
          line-height: 1.75;
        }

        .story-submit-selection {
          padding: 62px 0 76px;
          background: #ffffff;
        }

        .story-submit-section-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 370px;
          gap: 70px;
          align-items: end;
          margin-bottom: 27px;
        }

        .story-submit-section-head h2 {
          margin: 8px 0 0;
          font-size: 26px;
          line-height: 1.2;
          letter-spacing: -0.8px;
          font-weight: 750;
        }

        .story-submit-section-head p {
          margin: 0;
          color: var(--story-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .story-submit-list {
          border-top: 1px solid var(--story-border);
        }

        .story-submit-row {
          width: 100%;
          min-height: 91px;
          display: grid;
          grid-template-columns: 48px 42px minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          padding: 14px 8px;
          border: 0;
          border-bottom: 1px solid var(--story-border);
          background: #ffffff;
          color: var(--story-navy);
          text-align: left;
          cursor: pointer;
          transition:
            background 0.25s ease,
            padding 0.25s ease;
        }

        .story-submit-row:hover {
          padding-left: 14px;
          padding-right: 14px;
          background: #fbfbfd;
        }

        .story-submit-row-selected {
          background: #f7f7fa;
          padding-left: 14px;
          padding-right: 14px;
        }

        .story-submit-number {
          color: #a5a6b3;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        .story-submit-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--story-border);
          border-radius: 50%;
          color: var(--story-primary);
          background: #ffffff;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .story-submit-row-selected .story-submit-icon {
          border-color: var(--story-primary);
          background: var(--story-primary);
          color: #ffffff;
        }

        .story-submit-row-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .story-submit-row-copy strong {
          font-size: 14px;
          line-height: 1.2;
          font-weight: 750;
        }

        .story-submit-row-copy small {
          max-width: 620px;
          color: var(--story-muted);
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          line-height: 1.5;
        }

        .story-submit-row-action {
          min-width: 88px;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          color: var(--story-primary);
        }

        .story-submit-selected {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--story-primary);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .story-submit-next {
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 18px;
          padding: 0 22px;
          overflow: hidden;
          border-radius: 8px;
          background: var(--story-navy);
          color: #ffffff;
          opacity: 0;
          transform: translateY(-5px);
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            min-height 0.25s ease,
            padding 0.25s ease;
        }

        .story-submit-next-visible {
          min-height: 88px;
          padding: 17px 22px;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .story-submit-next-copy {
          display: grid;
          grid-template-columns: auto auto;
          column-gap: 13px;
          row-gap: 3px;
          align-items: baseline;
        }

        .story-submit-next-copy .story-submit-kicker {
          grid-column: 1 / -1;
          color: var(--story-gold);
          margin-bottom: 1px;
        }

        .story-submit-next-copy strong {
          font-size: 14px;
          font-weight: 750;
        }

        .story-submit-next-copy > span:last-child {
          color: #b9bac9;
          font-size: 10px;
        }

        .story-submit-next-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .story-submit-continue {
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 13px;
          border-radius: 6px;
          background: var(--story-gold);
          color: var(--story-navy);
          font-family: var(--font-manrope), sans-serif;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.45px;
        }

        .story-submit-change {
          border: 0;
          background: transparent;
          color: #b9bac9;
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
        }

        .story-submit-footer-note {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 26px;
        }

        .story-submit-gold-line {
          flex: 0 0 25px;
          width: 25px;
          height: 1px;
          background: var(--story-gold);
        }

        .story-submit-footer-note p {
          margin: 0;
          color: var(--story-soft);
          font-size: 10px;
          line-height: 1.55;
        }

        @media (max-width: 800px) {
          .story-submit-shell {
            width: calc(100% - 32px);
          }

          .story-submit-hero-content {
            padding: 58px 0 62px;
          }

          .story-submit-hero h1 {
            font-size: clamp(43px, 13vw, 62px);
            letter-spacing: -2px;
          }

          .story-submit-section-head {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .story-submit-row {
            grid-template-columns: 30px 36px minmax(0, 1fr) 25px;
            gap: 10px;
            min-height: 86px;
          }

          .story-submit-row-action {
            min-width: 25px;
          }

          .story-submit-row-copy small {
            font-size: 10px;
          }

          .story-submit-selected {
            font-size: 0;
          }

          .story-submit-selected svg {
            width: 16px;
            height: 16px;
          }

          .story-submit-next-visible {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
            padding: 18px;
          }

          .story-submit-next-actions {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .story-submit-shell {
            width: calc(100% - 24px);
          }

          .story-submit-breadcrumb {
            padding-top: 18px;
            font-size: 9px;
          }

          .story-submit-hero-content {
            padding: 49px 0 54px;
          }

          .story-submit-hero h1 {
            font-size: 43px;
          }

          .story-submit-hero p {
            font-size: 13px;
          }

          .story-submit-selection {
            padding: 48px 0 58px;
          }

          .story-submit-section-head h2 {
            font-size: 23px;
          }

          .story-submit-row {
            grid-template-columns: 26px 32px minmax(0, 1fr) 20px;
            padding: 13px 4px;
          }

          .story-submit-row:hover,
          .story-submit-row-selected {
            padding-left: 8px;
            padding-right: 8px;
          }

          .story-submit-icon {
            width: 30px;
            height: 30px;
          }

          .story-submit-row-copy strong {
            font-size: 13px;
          }

          .story-submit-row-copy small {
            font-size: 9.5px;
          }
        }
      `}</style>
    </main>
  );
}
