"use client";

import Link from "next/link";
import "../styles/categories.css";  // ← Add this import
import {
  ArrowUpRight,
  Cpu,
  HeartPulse,
  Landmark,
  Factory,
  ShoppingBag,
  Zap,
  Building2,
} from "lucide-react";

const categories = [
  {
    title: "TECHNOLOGY",
    description:
      "Companies, innovations and digital forces transforming the way the world works.",
    icon: Cpu,
    href: "/categories/technology",
  },
  {
    title: "STARTUPS",
    description:
      "Bold founders, emerging companies and ideas shaping the businesses of tomorrow.",
    icon: Zap,
    href: "/categories/startups",
  },
  {
    title: "REAL ESTATE",
    description:
      "Businesses redefining property, infrastructure and the built environment.",
    icon: Building2,
    href: "/categories/real-estate",
  },
  {
    title: "HEALTHCARE",
    description:
      "Leaders and organizations advancing healthcare, wellness and human potential.",
    icon: HeartPulse,
    href: "/categories/healthcare",
  },
  {
    title: "ENTERPRISE",
    description:
      "Organizations building stronger operations, smarter strategies and lasting growth.",
    icon: ShoppingBag,
    href: "/categories/enterprise",
  },
  {
    title: "BANKING & FINANCE",
    description:
      "Financial institutions and innovators shaping the future of global finance.",
    icon: Landmark,
    href: "/categories/banking-finance",
  },
  {
    title: "AI INNOVATION",
    description:
      "Artificial intelligence and emerging technologies redefining what is possible.",
    icon: Zap,
    href: "/categories/ai-innovation",
  },
  {
    title: "MANUFACTURING",
    description:
      "Businesses reshaping production, supply chains and industrial transformation.",
    icon: Factory,
    href: "/categories/manufacturing",
  },
];

export default function CategoriesSection() {
  return (
    <section className="categories-section" id="categories">
      {/* ================= BACKGROUND ================= */}

      <div className="categories-background">
        <div className="categories-grid-pattern" />
      </div>

      {/* ================= CONTAINER ================= */}

      <div className="categories-container">

        {/* ================= HEADER ================= */}

        <div className="categories-header">
          <div className="categories-heading">
            <span className="categories-eyebrow">
              ACROSS THE WORLD
            </span>

            <h2>CATEGORIES</h2>
          </div>

          <Link
            href="/categories"
            className="categories-view-all"
          >
            <span>EXPLORE ALL CATEGORIES</span>

            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {/* ================= CATEGORIES GRID ================= */}

        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={category.href}
                className="category-card"
                key={category.title}
              >
                {/* ================= VISUAL ================= */}

                <div className="category-visual">

                  <div className="category-orbit orbit-one" />
                  <div className="category-orbit orbit-two" />
                  <div className="category-orbit orbit-three" />

                  <ArrowUpRight
                    className="category-arrow"
                    size={17}
                    strokeWidth={1.7}
                  />

                  <div className="category-icon-wrapper">
                    <div className="category-icon-ring">
                      <Icon
                        size={23}
                        strokeWidth={1.45}
                      />
                    </div>
                  </div>
                </div>

                {/* ================= CONTENT ================= */}

                <div className="category-content">
                  <span className="category-label">
                    CATEGORY
                  </span>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <div className="category-explore">
                    <span>EXPLORE</span>
                    <span className="category-explore-line" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ================= BOTTOM ================= */}

        <div className="categories-bottom">
          <div className="categories-total">
            08+
          </div>

          <div className="categories-bottom-copy">
            <span>CATEGORIES</span>

            <strong>ONE GLOBAL PERSPECTIVE</strong>
          </div>

          <Link
            href="/categories"
            className="categories-directory"
          >
            <span>VIEW DIRECTORY</span>

            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>

    </section>
  );
}