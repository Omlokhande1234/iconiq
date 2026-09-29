"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Crown,
  Star,
  Trophy,
} from "lucide-react";

const awards = [
  {
    number: "01",
    category: "LEADERSHIP",
    year: "2026",
    title: "Top 10 Chief AI Officers - 2026",
    description:
      "Recognizing visionary Top 10 Chief AI Officers transforming data into strategic assets, driving innovation, and unlocking business value.",
    recipients: [
      { name: "James Szmak", org: "Elevationary.ai", href: "#" },
      { name: "Gary Toor", org: "Programming.com", href: "#" },
    ],
    icon: Crown,
  },
  {
    number: "02",
    category: "INNOVATION",
    year: "2026",
    title: "Innovation Excellence Awards",
    description:
      "Celebrating organizations and innovators creating new possibilities through technology, bold thinking, and digital transformation.",
    recipients: [
      { name: "Elena Rostova", org: "QuantumLeap Labs", href: "#" },
      { name: "Marcus Chen", org: "Synthetix AI", href: "#" },
    ],
    icon: Star,
  },
  {
    number: "03",
    category: "BUSINESS",
    year: "2026",
    title: "Business Impact & Growth",
    description:
      "Honoring organizations demonstrating exceptional growth, sustainable purpose, and measurable long-term impact.",
    recipients: [
      { name: "Aura Financial", org: "Global FinTech Group", href: "#" },
    ],
    icon: Trophy,
  },
  {
    number: "04",
    category: "GLOBAL IMPACT",
    year: "2026",
    title: "Global Impact Laurels",
    description:
      "Recognizing people and organizations making a measurable difference across global communities and major industries.",
    recipients: [
      { name: "EcoStream Initiative", org: "CleanTech Alliance", href: "#" },
    ],
    icon: Award,
  },
];

export default function AwardsSection() {
  return (
    <section className="awards-section scroll-mt-24" id="awards">
      {/* ================= BACKGROUND ================= */}
      <div className="awards-bg">
        <div className="awards-grid" />
        <div className="awards-orbit awards-orbit-one" />
        <div className="awards-orbit awards-orbit-two" />
      </div>

      <div className="awards-container">
        {/* ================= HEADER ================= */}
        <div className="awards-header">
          <div className="awards-heading">
            <span className="awards-eyebrow">
              RECOGNITION & EXCELLENCE
            </span>
            <h2>AWARDS & RECOGNITION</h2>
          </div>

          <Link
            href="/awards"
            className="awards-view-all"
          >
            <span>EXPLORE MORE REWARDS</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {/* ================= AWARDS SHOWCASE ROWS (2 ITEMS) ================= */}
        <div className="awards-showcase-list">
          {awards.slice(0, 2).map((award) => {
            const Icon = award.icon;

            return (
              <div className="award-showcase-card" key={award.number}>
                {/* LEFT: COMPACT VISUAL BOX */}
                <div className="award-visual-box">
                  <div className="award-year-tag">{award.year}</div>
                  <div className="award-badge-frame">
                    <div className="award-badge-header-stars">★★★★★</div>
                    <div className="award-badge-title">
                      <span>{award.category}</span>
                      <strong>{award.title}</strong>
                    </div>
                    <div className="award-badge-footer-icon">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* RIGHT: DETAILS & RECIPIENTS */}
                <div className="award-details-content">
                  <div>
                    <div className="award-meta-row">
                      <span className="award-number">{award.number}</span>
                      <span className="award-category-pill">{award.category}</span>
                    </div>
                    <h3>{award.title}</h3>
                    <p>{award.description}</p>
                  </div>

                  {/* RECIPIENTS / LINKS LIST */}
                  {award.recipients && award.recipients.length > 0 && (
                    <div className="award-recipients-list">
                      {award.recipients.map((rec, idx) => (
                        <Link href={rec.href} className="recipient-item" key={idx}>
                          <span className="recipient-arrow">»</span>
                          <span className="recipient-name">{rec.name}</span>
                          <span className="recipient-separator">,</span>
                          <span className="recipient-org">{rec.org}</span>
                          <ArrowUpRight size={12} className="recipient-external" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="award-card-actions">
                    <Link href="/awards" className="nominate-button">
                      Nominate a Leader
                    </Link>
                    <Link href="/awards" className="award-explore-link">
                      <span>EXPLORE</span>
                      <ArrowUpRight size={13} strokeWidth={1.8} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= CENTERED VIEW MORE BUTTON ================= */}
        <div className="awards-bottom-cta">
          <Link href="/awards" className="awards-centered-view-button">
            <span>VIEW MORE AWARDS</span>
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </Link>
        </div>

        {/* ================= BOTTOM FEATURE BANNER (SLIM & THIN) ================= */}
        <div className="awards-feature">
          <div className="awards-feature-left">
            <span className="awards-feature-label">
              ICONIQSPHERE AWARDS
            </span>
            <h3>
              Celebrating meaningful impact.
            </h3>
          </div>

          <div className="awards-feature-right">
            <p>
              Recognising visionary leaders and innovators shaping the future.
            </p>
            <Link
              href="/awards"
              className="awards-feature-button"
            >
              <span>DISCOVER THE AWARDS</span>
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .awards-section {
          position: relative;
          width: 100%;
          padding: 42px 0 44px;
          overflow: hidden;
          background: #f6f9fc;
          color: #082e63;
          border-top: 1px solid rgba(8, 46, 99, 0.15);
          border-bottom: 1px solid rgba(8, 46, 99, 0.15);
        }

        .awards-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .awards-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(25, 76, 130, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 76, 130, 0.045) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .awards-orbit {
          position: absolute;
          border: 1px solid rgba(45, 96, 151, 0.10);
          border-radius: 50%;
        }

        .awards-orbit-one {
          width: 550px;
          height: 250px;
          right: -150px;
          top: -80px;
          transform: rotate(-15deg);
        }

        .awards-orbit-two {
          width: 480px;
          height: 220px;
          right: -70px;
          top: -20px;
          transform: rotate(-15deg);
        }

        .awards-container {
          position: relative;
          z-index: 2;
          width: calc(100% - 80px);
          max-width: 1360px;
          margin: 0 auto;
        }

        /* ==============================================
           HEADER - MATCHES CATEGORIES STYLE
        ============================================== */

        .awards-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(8, 46, 99, 0.13);
        }

        .awards-heading {
          min-width: 0;
        }

        .awards-eyebrow {
          display: block;
          margin-bottom: 8px;
          color: #2a619d;
          font-size: 8px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .awards-heading h2 {
          margin: 0;
          color: #082e63;
          font-size: clamp(30px, 3.2vw, 42px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .awards-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding-bottom: 6px;
          color: #174a84;
          border-bottom: 2px solid #285a9c;
          text-decoration: none;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: gap 0.2s ease, color 0.2s ease;
        }

        .awards-view-all:hover {
          gap: 11px;
          color: #2a619d;
        }

        .awards-showcase-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .award-showcase-card {
          display: grid;
          grid-template-columns: 260px 1fr;
          background: #ffffff;
          border: 1px solid #e2e9f2;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(8, 46, 99, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .award-showcase-card:hover {
          transform: translateY(-2px);
          border-color: rgba(40, 90, 156, 0.2);
          box-shadow: 0 8px 20px rgba(8, 46, 99, 0.08);
        }

        .award-visual-box {
          position: relative;
          background: linear-gradient(135deg, #edf3f9 0%, #e0ecf7 50%, #d2e3f4 100%);
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-right: 1px solid rgba(8, 46, 99, 0.08);
        }

        .award-year-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #082e63;
          color: #ffffff;
          font-size: 7px;
          font-weight: 900;
          padding: 3px 6px;
          border-radius: 3px;
          letter-spacing: 0.08em;
        }

        .award-badge-frame {
          background: #ffffff;
          border: 1.5px solid #d4af37;
          border-radius: 4px;
          padding: 11px 13px;
          width: 100%;
          max-width: 190px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(8, 46, 99, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
        }

        .award-badge-header-stars {
          color: #d4af37;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .award-badge-title span {
          display: block;
          font-size: 6.5px;
          font-weight: 900;
          color: #2a619d;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .award-badge-title strong {
          font-size: 9px;
          color: #082e63;
          line-height: 1.15;
          display: block;
        }

        .award-badge-footer-icon {
          color: #19518c;
          background: #f0f5fc;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(25, 81, 140, 0.15);
          margin-top: 2px;
        }

        .award-details-content {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .award-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .award-number {
          color: #8da3bc;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .award-category-pill {
          background: rgba(42, 97, 157, 0.08);
          color: #2a619d;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 6.5px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .award-details-content h3 {
          margin: 0 0 6px;
          color: #082e63;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .award-details-content p {
          margin: 0 0 10px;
          color: #647f9f;
          font-size: 10px;
          line-height: 1.4;
          font-weight: 500;
        }

        .award-recipients-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-bottom: 10px;
          padding: 7px 10px;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid rgba(8, 46, 99, 0.05);
        }

        .recipient-item {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          color: #174a84;
          transition: color 0.2s ease;
          flex-wrap: wrap;
        }

        .recipient-item:hover {
          color: #082e63;
        }

        .recipient-arrow {
          color: #285a9c;
          font-weight: 900;
          flex-shrink: 0;
        }

        .recipient-name {
          font-weight: 700;
        }

        .recipient-separator {
          color: #8da3bc;
        }

        .recipient-org {
          color: #647f9f;
        }

        .recipient-external {
          color: #285a9c;
          flex-shrink: 0;
        }

        .award-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid rgba(8, 46, 99, 0.06);
          padding-top: 10px;
        }

        .nominate-button {
          background: #082e63;
          color: #ffffff;
          padding: 6px 11px;
          border-radius: 3px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .nominate-button:hover {
          background: #174a84;
        }

        .award-explore-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #174a84;
          text-decoration: none;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .award-explore-link:hover {
          color: #082e63;
        }

        .awards-bottom-cta {
          display: flex;
          justify-content: center;
          margin: 18px 0 22px;
        }

        .awards-centered-view-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          color: #082e63;
          border: 1px solid rgba(8, 46, 99, 0.2);
          padding: 9px 20px;
          border-radius: 5px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-decoration: none;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(8, 46, 99, 0.03);
          transition: all 0.25s ease;
        }

        .awards-centered-view-button:hover {
          background: #082e63;
          color: #ffffff;
          border-color: #082e63;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(8, 46, 99, 0.1);
        }

        .awards-feature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: center;
          padding: 12px 22px;
          background: #082e63;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .awards-feature::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 100px;
          right: -60px;
          bottom: -60px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          transform: rotate(-15deg);
          pointer-events: none;
        }

        .awards-feature-left,
        .awards-feature-right {
          position: relative;
          z-index: 2;
        }

        .awards-feature-label {
          display: block;
          margin-bottom: 4px;
          color: #86a6ca;
          font-size: 6px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .awards-feature h3 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(15px, 1.5vw, 20px);
          line-height: 1.15;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .awards-feature-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .awards-feature-right p {
          max-width: 340px;
          margin: 0;
          color: #b6c9df;
          font-size: 9px;
          line-height: 1.4;
          font-weight: 500;
        }

        .awards-feature-button {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          color: #082e63;
          background: #ffffff;
          text-decoration: none;
          border-radius: 3px;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .awards-feature-button:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 1100px) {
          .awards-container {
            width: calc(100% - 40px);
          }
          .awards-header {
            gap: 25px;
          }
        }

        @media (max-width: 900px) {
          .awards-container {
            width: calc(100% - 40px);
          }
          .awards-header {
            gap: 35px;
          }
          .award-showcase-card {
            grid-template-columns: 1fr;
          }
          .award-visual-box {
            border-right: none;
            border-bottom: 1px solid rgba(8, 46, 99, 0.08);
            padding: 18px 14px;
          }
          .awards-feature {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }

        @media (max-width: 760px) {
          .awards-section {
            padding: 32px 0 34px;
          }
          .awards-container {
            width: calc(100% - 24px);
          }
          .awards-header {
            gap: 10px;
            margin-bottom: 17px;
            padding-bottom: 14px;
            flex-direction: row;
            align-items: flex-end;
          }
          .awards-eyebrow {
            font-size: 6px;
            margin-bottom: 6px;
          }
          .awards-heading h2 {
            font-size: 27px;
            white-space: nowrap;
          }
          .awards-view-all {
            margin-left: auto;
            gap: 4px;
            padding-bottom: 4px;
            font-size: 5.5px;
            letter-spacing: 0.055em;
            white-space: nowrap;
          }
          .awards-view-all svg {
            width: 10px;
            height: 10px;
          }
          .award-showcase-list {
            gap: 11px;
            margin-bottom: 15px;
          }

          /* Mobile: show only the first award card */
          .award-showcase-card:nth-child(2) {
            display: none;
          }
          .award-visual-box {
            padding: 14px 12px;
          }
          .award-details-content {
            padding: 14px 15px;
          }
          .award-details-content h3 {
            font-size: 13px;
            margin-bottom: 4px;
          }
          .award-details-content p {
            font-size: 9px;
            margin-bottom: 8px;
          }
          .award-recipients-list {
            padding: 6px 9px;
            gap: 2px;
            margin-bottom: 8px;
          }
          .recipient-item {
            font-size: 9px;
          }
          .award-card-actions {
            padding-top: 8px;
            gap: 6px;
          }
          .nominate-button {
            padding: 5px 9px;
            font-size: 6.5px;
          }
          .award-explore-link {
            font-size: 6.5px;
            gap: 3px;
          }
          .awards-centered-view-button {
            padding: 8px 16px;
            font-size: 7.5px;
            gap: 5px;
          }
          .awards-feature {
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
            padding: 11px 13px;
          }
          .awards-feature-label {
            font-size: 5.5px;
            margin-bottom: 3px;
          }
          .awards-feature h3 {
            font-size: clamp(14px, 5vw, 18px);
          }
          .awards-feature-right {
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
          }
          .awards-feature-right p {
            display: none;
          }
          .awards-feature-button {
            padding: 6px 9px;
            font-size: 6px;
          }
        }

        @media (max-width: 520px) {
          .awards-section {
            padding: 28px 0 32px;
          }
          .awards-container {
            width: calc(100% - 20px);
            max-width: none;
          }
          .award-showcase-card {
            box-shadow: 0 1px 4px rgba(8, 46, 99, 0.03);
            border-radius: 5px;
          }
          .award-visual-box {
            padding: 12px 11px;
          }
          .award-badge-frame {
            max-width: 170px;
            padding: 9px 11px;
          }
          .award-badge-title strong {
            font-size: 8px;
          }
          .award-details-content {
            padding: 12px 13px;
          }
        }
      `}</style>
    </section>
  );
}