"use client";

import Link from "next/link";
import "../styles/featuredStories.css"; 
import {
  Award,
  Building2,
  Lightbulb,
  Rocket,
  Newspaper,
  ArrowUpRight,
  BookOpen,
  Mic,
  FileText,
  Globe,
} from "lucide-react";

const spotlightSections = [
  {
    title: "LEADERSHIP SPOTLIGHT",
    description: "Insights from visionary leaders driving change.",
    icon: Award,
    href: "/spotlight/leadership",
  },
  {
    title: "CXO SPOTLIGHT",
    description: "Conversations with CXOs shaping industries.",
    icon: Lightbulb,
    href: "/spotlight/cxo",
  },
  {
    title: "COMPANY SPOTLIGHT",
    description: "Innovative companies making a global impact.",
    icon: Building2,
    href: "/spotlight/company",
  },
  {
    title: "STARTUP SPOTLIGHT",
    description: "Emerging startups and entrepreneurs to watch.",
    icon: Rocket,
    href: "/spotlight/startup",
  },
  {
    title: "COVER STORIES",
    description: "Exclusive cover stories of extraordinary journeys.",
    icon: Newspaper,
    href: "/cover-stories",
  },
];

// Universal latest items: Can be Article, Cover Story, Magazine, News, or Podcast
const latestStories = [
  {
    contentType: "COVER STORY",
    category: "LEADERSHIP",
    date: "MAY 2026",
    title: "The Architects of Autonomous Enterprise and Recursive AI",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    href: "/cover-stories/architects-of-autonomous-enterprise",
    icon: Newspaper,
  },
  {
    contentType: "MAGAZINE",
    category: "SPECIAL ISSUE",
    date: "Q2 2026",
    title: "Global Innovation Review: The Quantum Workforce",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    href: "/magazine/q2-2026-quantum",
    icon: BookOpen,
  },
  {
    contentType: "PODCAST",
    category: "AUDIO INTERVIEW",
    date: "MAY 2026",
    title: "Scaling Venture Capital in a Multi-Polar World with Elite Founders",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    href: "/podcasts/scaling-venture-capital",
    icon: Mic,
  },
  {
    contentType: "NEWS",
    category: "INDUSTRY UPDATE",
    date: "MAY 2026",
    title: "Trillions Shift Toward Scalable Carbon-Negative Energy Infrastructure",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    href: "/news/trillions-shift-green-tech",
    icon: Globe,
  },
  {
    contentType: "ARTICLE",
    category: "EXECUTIVE INSIGHTS",
    date: "MAY 2026",
    title: "Redefining Enterprise Governance in an Accelerated Digital Economy",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    href: "/articles/redefining-enterprise-governance",
    icon: FileText,
  },
];

export default function FeaturedStories() {
  return (
    <>
      <section className="featured-section" id="featured-stories">
        <div className="featured-container">

          {/* =====================================================
              OUR SPOTLIGHT SECTIONS
          ===================================================== */}
          <div className="spotlight-heading">
            <span>OUR SPOTLIGHT SECTIONS</span>
          </div>

          <div className="spotlight-grid">
            {spotlightSections.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  href={item.href}
                  className="spotlight-item"
                  key={item.title}
                >
                  <div className="spotlight-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="spotlight-item-title">
                    {item.title}
                  </div>

                  <div className="spotlight-description">
                    {item.description}
                  </div>

                  <div className="spotlight-active-line" />
                </Link>
              );
            })}
          </div>

          {/* =====================================================
              LATEST UPDATES HEADER
          ===================================================== */}
          <div className="latest-heading-row">
            <div>
              <h2>LATEST UPDATES</h2>
              <p className="latest-subtitle">Fresh articles, cover stories, magazines, news & podcasts</p>
            </div>

            <Link
              href="/archive"
              className="view-all"
            >
              <span>VIEW ALL CONTENT</span>
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
          </div>

          {/* =====================================================
              DYNAMIC CONTENT FEED GRID
          ===================================================== */}
          <div className="story-grid">
            {latestStories.map((item) => {
              const TypeIcon = item.icon;

              return (
                <Link
                  href={item.href}
                  className="story-card"
                  key={item.title}
                >
                  {/* IMAGE / VISUAL AREA WITH DYNAMIC TYPE BADGE */}
                  <div className="story-image-container">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="story-image"
                    />
                    <div className="story-image-overlay" />

                    {/* Content Type Badge overlaying top-left */}
                    <div className="content-type-badge">
                      <TypeIcon size={12} strokeWidth={2} />
                      <span>{item.contentType}</span>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="story-body">
                    <div className="story-meta">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>

                    <h3>{item.title}</h3>

                    <div className="story-footer">
                      <span>EXPLORE {item.contentType}</span>
                      <ArrowUpRight size={18} strokeWidth={1.8} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

    </>
  );
}