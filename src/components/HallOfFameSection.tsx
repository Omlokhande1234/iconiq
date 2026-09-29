"use client";

import Link from "next/link";
import { ArrowUpRight, Award, Star } from "lucide-react";

export default function HallOfFameSection() {
  return (
    <section
      className="hall-of-fame-section"
      id="hall-of-fame"
    >
      {/* ================= BACKGROUND ================= */}

      <div className="hall-bg-grid" />

      <div className="hall-container">

        {/* ================= HEADER ================= */}

        <div className="hall-header">
          <div className="hall-header-left">
            <span className="hall-eyebrow">
              HONOURING EXCEPTIONAL LEADERS
            </span>

            <h2>HALL OF FAME</h2>
          </div>

          <Link
            href="/hall-of-fame"
            className="hall-view-all"
          >
            <span>EXPLORE HALL OF FAME</span>

            <ArrowUpRight
              size={16}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {/* ================= MAIN FEATURED SECTION ================= */}

        <div className="hall-feature">

          {/* ================= LEFT IMAGE ================= */}

          <div className="hall-image-wrap">
            <div className="hall-image-grid" />

            <div className="hall-image-orbit hall-orbit-one" />
            <div className="hall-image-orbit hall-orbit-two" />

            <div className="hall-image-label">
              <span>HALL OF FAME</span>
              <span>2026</span>
            </div>

            <img
              src="/hall-of-fame.jpg"
              alt="Hall of Fame honouree"
              className="hall-main-image"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <div className="hall-image-fallback">
              <Award
                size={50}
                strokeWidth={1.15}
              />

              <span>HALL OF</span>
              <strong>FAME</strong>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}

          <div className="hall-feature-content">

            <div className="hall-feature-top">
              <span className="hall-feature-category">
                FEATURED HONOUREE
              </span>

              <span className="hall-feature-number">
                01
              </span>
            </div>

            <div className="hall-feature-icon">
              <Award
                size={21}
                strokeWidth={1.45}
              />
            </div>

            <span className="hall-feature-kicker">
              HALL OF FAME INDUCTEE
            </span>

            <h3>
              A Trailblazing Leader
              <br />
              Transforming the Future
            </h3>

            <p className="hall-feature-description">
              Honouring an exceptional leader whose vision,
              innovation and leadership continue to create
              meaningful impact across industries and communities.
            </p>

            <div className="hall-feature-divider" />

            <div className="hall-feature-bottom">

              <Link
                href="/hall-of-fame"
                className="hall-read-story"
              >
                <span>READ FULL STORY</span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.8}
                />
              </Link>

              <div className="hall-stars">
                <Star
                  size={11}
                  strokeWidth={1.4}
                />

                <Star
                  size={11}
                  strokeWidth={1.4}
                />

                <Star
                  size={11}
                  strokeWidth={1.4}
                />
              </div>

            </div>
          </div>
        </div>

        {/* ================= 02 / 03 / 04 DESKTOP SECTION ================= */}

        <div className="hall-list">

          <Link
            href="/hall-of-fame"
            className="hall-list-item"
          >
            <span className="hall-list-number">
              02
            </span>

            <div className="hall-list-title">
              <span>
                VISIONARY LEADER
              </span>

              <strong>
                Shaping Tomorrow&apos;s Business
              </strong>
            </div>

            <ArrowUpRight
              size={17}
              strokeWidth={1.7}
            />
          </Link>

          <Link
            href="/hall-of-fame"
            className="hall-list-item"
          >
            <span className="hall-list-number">
              03
            </span>

            <div className="hall-list-title">
              <span>
                INNOVATION LEADER
              </span>

              <strong>
                Creating Meaningful Impact
              </strong>
            </div>

            <ArrowUpRight
              size={17}
              strokeWidth={1.7}
            />
          </Link>

          <Link
            href="/hall-of-fame"
            className="hall-list-item"
          >
            <span className="hall-list-number">
              04
            </span>

            <div className="hall-list-title">
              <span>
                INDUSTRY PIONEER
              </span>

              <strong>
                Redefining What&apos;s Possible
              </strong>
            </div>

            <ArrowUpRight
              size={17}
              strokeWidth={1.7}
            />
          </Link>

        </div>
      </div>

      {/* ================= STYLES ================= */}

      <style>{`

        /* =====================================================
           SECTION
        ===================================================== */

        .hall-of-fame-section {
          position: relative;
          width: 100%;
          overflow: hidden;

          background: #f5f8fc;

          border-top: 1px solid
            rgba(8, 45, 99, 0.10);

          padding: 52px 0 56px;
        }

        .hall-bg-grid {
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.58;

          background-image:
            linear-gradient(
              rgba(38, 79, 125, 0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(38, 79, 125, 0.045) 1px,
              transparent 1px
            );

          background-size: 42px 42px;
        }

        .hall-container {
          position: relative;
          z-index: 2;

          width: calc(100% - 90px);
          max-width: 1360px;

          margin: 0 auto;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .hall-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 28px;
          padding-bottom: 18px;

          border-bottom: 1px solid
            rgba(8, 45, 99, 0.14);
        }

        .hall-header-left {
          min-width: 0;
        }

        .hall-eyebrow {
          display: block;

          margin-bottom: 8px;

          color: #28609b;

          font-size: 9px;
          line-height: 1;

          font-weight: 900;

          letter-spacing: 0.16em;
        }

        .hall-header-left h2 {
          margin: 0;

          color: #082d63;

          font-size: 42px;
          line-height: 0.95;

          font-weight: 900;

          letter-spacing: -0.045em;

          white-space: nowrap;
        }

        /* =====================================================
           EXPLORE
        ===================================================== */

        .hall-view-all {
          display: inline-flex;

          align-items: center;
          justify-content: flex-end;

          gap: 8px;

          flex-shrink: 0;

          padding-bottom: 7px;

          color: #17457e;

          border-bottom: 2px solid #28589d;

          text-decoration: none;

          font-size: 9px;
          line-height: 1;

          font-weight: 900;

          letter-spacing: 0.08em;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            gap 0.2s ease;
        }

        .hall-view-all:hover {
          color: #28589d;
          gap: 11px;
        }

        .hall-view-all svg {
          transition:
            transform 0.2s ease;
        }

        .hall-view-all:hover svg {
          transform:
            translate(2px, -2px);
        }

        /* =====================================================
           MAIN FEATURE
        ===================================================== */

        .hall-feature {
          display: grid;

          grid-template-columns:
            minmax(300px, 0.88fr)
            minmax(360px, 1.12fr);

          min-height: 350px;

          overflow: hidden;

          background: #ffffff;

          border: 1px solid
            rgba(8, 45, 99, 0.12);

          border-radius: 4px;

          box-shadow:
            0 8px 24px
            rgba(8, 45, 99, 0.05);
        }

        /* =====================================================
           IMAGE
        ===================================================== */

        .hall-image-wrap {
          position: relative;

          min-height: 350px;

          overflow: hidden;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #eaf1f8,
              #dce7f2
            );
        }

        .hall-image-grid {
          position: absolute;
          inset: 0;

          opacity: 0.65;

          background-image:
            linear-gradient(
              rgba(42, 89, 137, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(42, 89, 137, 0.06) 1px,
              transparent 1px
            );

          background-size: 36px 36px;
        }

        .hall-image-orbit {
          position: absolute;

          border: 1px solid
            rgba(40, 96, 155, 0.18);

          border-radius: 50%;

          transform: rotate(-18deg);
        }

        .hall-orbit-one {
          width: 430px;
          height: 235px;
        }

        .hall-orbit-two {
          width: 370px;
          height: 205px;

          transform: rotate(22deg);
        }

        .hall-main-image {
          position: relative;
          z-index: 3;

          width: 50%;
          max-width: 220px;

          height: 76%;

          object-fit: cover;

          border: 1px solid
            rgba(8, 45, 99, 0.14);

          box-shadow:
            0 12px 24px
            rgba(8, 45, 99, 0.13);
        }

        .hall-image-fallback {
          position: relative;
          z-index: 2;

          width: 175px;
          height: 225px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 5px;

          color: #174f88;

          background: #f7fafd;

          border: 1px solid
            rgba(8, 45, 99, 0.14);

          box-shadow:
            0 12px 24px
            rgba(8, 45, 99, 0.08);
        }

        .hall-image-fallback span {
          margin-top: 6px;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.18em;
        }

        .hall-image-fallback strong {
          font-size: 20px;

          letter-spacing: -0.02em;
        }

        .hall-main-image
        + .hall-image-fallback {
          display: none;
        }

        .hall-image-label {
          position: absolute;
          z-index: 5;

          top: 16px;

          left: 18px;
          right: 18px;

          display: flex;

          justify-content: space-between;

          color: #28609b;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.15em;
        }

        /* =====================================================
           FEATURE CONTENT
        ===================================================== */

        .hall-feature-content {
          display: flex;

          flex-direction: column;

          padding: 28px 34px 27px;
        }

        .hall-feature-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 18px;
        }

        .hall-feature-category {
          color: #28609b;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .hall-feature-number {
          color: #8aa0b9;

          font-size: 10px;

          font-weight: 800;
        }

        .hall-feature-icon {
          width: 42px;
          height: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 15px;

          color: #1d578f;

          border: 1px solid
            rgba(40, 96, 155, 0.22);

          border-radius: 50%;

          background: #f5f9fd;
        }

        .hall-feature-kicker {
          margin-bottom: 8px;

          color: #28609b;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.15em;
        }

        .hall-feature-content h3 {
          margin: 0;

          color: #082d63;

          font-size:
            clamp(25px, 2.35vw, 35px);

          line-height: 1.04;

          font-weight: 850;

          letter-spacing: -0.045em;
        }

        .hall-feature-description {
          max-width: 500px;

          margin: 14px 0 0;

          color: #607797;

          font-size: 12px;

          line-height: 1.55;

          font-weight: 500;
        }

        .hall-feature-divider {
          width: 100%;
          height: 1px;

          margin-top: auto;
          margin-bottom: 15px;

          background:
            rgba(8, 45, 99, 0.12);
        }

        .hall-feature-bottom {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .hall-read-story {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          color: #082d63;

          text-decoration: none;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.13em;

          transition:
            gap 0.25s ease;
        }

        .hall-read-story:hover {
          gap: 11px;
        }

        .hall-stars {
          display: flex;

          align-items: center;

          gap: 4px;

          color: #28609b;
        }

        /* =====================================================
           02 / 03 / 04 SECTION
           VISIBLE ON DESKTOP
        ===================================================== */

        .hall-list {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          margin-top: 10px;

          border-top: 1px solid
            rgba(8, 45, 99, 0.13);

          border-bottom: 1px solid
            rgba(8, 45, 99, 0.13);

          background: #ffffff;
        }

        .hall-list-item {
          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 10px;

          min-height: 58px;

          padding: 9px 14px;

          color: #082d63;

          text-decoration: none;

          border-right: 1px solid
            rgba(8, 45, 99, 0.10);

          transition:
            background 0.25s ease,
            padding 0.25s ease;
        }

        .hall-list-item:last-child {
          border-right: none;
        }

        .hall-list-item:hover {
          background: #f4f8fc;

          padding-left: 18px;
        }

        .hall-list-number {
          color: #8aa0b9;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.08em;
        }

        .hall-list-title {
          display: flex;

          flex-direction: column;

          gap: 2px;
        }

        .hall-list-title span {
          color: #28609b;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 0.14em;
        }

        .hall-list-title strong {
          color: #082d63;

          font-size: 11px;

          line-height: 1.2;

          font-weight: 750;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .hall-of-fame-section {
            padding: 46px 0 50px;
          }

          .hall-container {
            width: calc(100% - 40px);
          }

          .hall-header {
            gap: 20px;

            margin-bottom: 24px;
          }

          .hall-header-left h2 {
            font-size: 38px;
          }

          .hall-feature {
            grid-template-columns: 1fr;

            min-height: auto;
          }

          .hall-image-wrap {
            min-height: 300px;
          }

          .hall-feature-content {
            min-height: 320px;

            padding: 26px 30px 25px;
          }

          .hall-feature-content h3 {
            font-size: 32px;
          }

          .hall-list {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .hall-list-item {
            min-height: 55px;

            padding: 8px 10px;

            gap: 7px;
          }

          .hall-list-title strong {
            font-size: 10px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .hall-of-fame-section {
            padding: 30px 0 32px;
          }

          .hall-container {
            width: calc(100% - 20px);
          }

          /* HEADER */

          .hall-header {
            align-items: flex-end;

            gap: 8px;

            margin-bottom: 16px;

            padding-bottom: 12px;
          }

          .hall-eyebrow {
            margin-bottom: 6px;

            font-size: 6px;

            letter-spacing: 0.13em;
          }

          .hall-header-left h2 {
            font-size: 27px;

            line-height: 0.95;
          }

          .hall-view-all {
            gap: 5px;

            padding-bottom: 5px;

            font-size: 6px;

            letter-spacing: 0.055em;
          }

          .hall-view-all svg {
            width: 11px;
            height: 11px;
          }

          /* =================================================
             MAIN FEATURED SECTION STAYS ON MOBILE
          ================================================= */

          .hall-feature {
            display: grid;

            /* Mobile: compact horizontal card — image left, content right */
            grid-template-columns: 38% 62%;

            min-height: 235px;

            height: 235px;

            border-radius: 4px;
          }

          /* IMAGE */

          .hall-image-wrap {
            min-height: 235px;

            height: 235px;
          }

          .hall-image-label {
            top: 13px;

            left: 13px;
            right: 13px;

            font-size: 6px;

            letter-spacing: 0.13em;
          }

          .hall-image-orbit {
            transform:
              scale(0.72)
              rotate(-18deg);
          }

          .hall-orbit-two {
            transform:
              scale(0.72)
              rotate(22deg);
          }

          .hall-main-image {
            width: 72%;

            max-width: 130px;

            height: 78%;
          }

          .hall-image-fallback {
            width: 72%;
            max-width: 120px;
            height: 78%;
          }

          .hall-image-fallback svg {
            width: 35px;
            height: 35px;
          }

          .hall-image-fallback span {
            font-size: 6px;
          }

          .hall-image-fallback strong {
            font-size: 16px;
          }

          /* CONTENT */

          .hall-feature-content {
            min-height: 235px;

            height: 235px;

            padding: 16px 15px 14px;

            overflow: hidden;
          }

          .hall-feature-top {
            margin-bottom: 9px;
          }

          .hall-feature-category {
            font-size: 6.5px;

            letter-spacing: 0.13em;
          }

          .hall-feature-number {
            font-size: 8px;
          }

          .hall-feature-icon {
            width: 30px;
            height: 30px;

            margin-bottom: 8px;
          }

          .hall-feature-icon svg {
            width: 18px;
            height: 18px;
          }

          .hall-feature-kicker {
            margin-bottom: 5px;

            font-size: 6px;

            letter-spacing: 0.13em;
          }

          .hall-feature-content h3 {
            font-size: clamp(16px, 4.8vw, 21px);

            line-height: 1.02;

            letter-spacing: -0.035em;
          }

          .hall-feature-description {
            max-width: 100%;

            margin-top: 7px;

            font-size: 8px;

            line-height: 1.35;

            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .hall-feature-divider {
            margin-top: auto;

            margin-bottom: 12px;
          }

          .hall-read-story {
            gap: 4px;

            font-size: 6px;

            letter-spacing: 0.11em;
          }

          .hall-read-story svg {
            width: 12px;
            height: 12px;
          }

          .hall-stars {
            gap: 3px;
          }

          .hall-stars svg {
            width: 10px;
            height: 10px;
          }

          /* =================================================
             REMOVE ONLY 02 / 03 / 04 FROM MOBILE
          ================================================= */

          .hall-list {
            display: none;
          }
        }

        /* =====================================================
           VERY SMALL PHONES
        ===================================================== */

        @media (max-width: 380px) {

          .hall-container {
            width: calc(100% - 16px);
          }

          .hall-header {
            gap: 6px;
          }

          .hall-header-left h2 {
            font-size: 24px;
          }

          .hall-view-all {
            font-size: 5.5px;
          }

          .hall-feature {
            grid-template-columns: 40% 60%;
            min-height: 215px;
            height: 215px;
          }

          .hall-image-wrap {
            min-height: 215px;
            height: 215px;
          }

          .hall-feature-content {
            min-height: 215px;
            height: 215px;
            padding: 14px 12px 12px;
          }

          .hall-feature-content h3 {
            font-size: 15px;
          }

          .hall-feature-description {
            font-size: 7.5px;
          }

          /*
            .hall-list remains hidden
            because it is already hidden
            in the mobile breakpoint.
          */
        }
      `}</style>
    </section>
  );
}