
"use client";

import Link from "next/link";
import "../styles/NewsSection.css";

type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  date: string;
  href: string;
};

const newsItems: NewsItem[] = [
  {
    id: "news-1",
    title: "The latest developments shaping business and innovation",
    excerpt:
      "Insights, leadership stories and developments from across the global business landscape.",
    image: "/news/news-1.jpg",
    category: "Business",
    date: "Sep 13, 2026",
    href: "/news/news-1",
  },
  {
    id: "news-2",
    title: "Leaders driving the next generation of transformation",
    excerpt:
      "A closer look at the people and ideas influencing industries around the world.",
    image: "/news/news-2.jpg",
    category: "Leadership",
    date: "Sep 12, 2026",
    href: "/news/news-2",
  },
  {
    id: "news-3",
    title: "Innovation continues to reshape the global economy",
    excerpt:
      "Technology, strategy and new opportunities are changing how organisations operate.",
    image: "/news/news-3.jpg",
    category: "Innovation",
    date: "Sep 11, 2026",
    href: "/news/news-3",
  },
];

export default function NewsSection() {
  return (
    <section className="news-section" aria-labelledby="news-heading">
      <div className="news-container">

        {/* Header */}
        <div className="news-header">
          <div className="news-header-left">
            <div className="news-eyebrow">
              Latest Intelligence
            </div>

            <h2 id="news-heading" className="news-title">
              News <span className="news-title-accent">&amp;</span> Insights
            </h2>
          </div>

          <Link href="/news" className="news-view-all">
            View All
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* News Grid */}
        {newsItems.length > 0 ? (
          <div className="news-grid">
            {newsItems.map((item, index) => (
              <article
                key={item.id}
                className={`news-card ${
                  index === 0 ? "news-card-featured" : ""
                }`}
              >
                <Link
                  href={item.href}
                  className="news-card-link"
                  aria-label={`Read ${item.title}`}
                >
                  <div className="news-image-wrapper">
                    <img
                      src={item.image}
                      alt=""
                      className="news-image"
                    />

                    <span className="news-category">
                      {item.category}
                    </span>
                  </div>

                  <div className="news-content">
                    <div className="news-meta">
                      <span>{item.date}</span>

                      <span
                        className="news-meta-divider"
                        aria-hidden="true"
                      />

                      <span>{item.category}</span>
                    </div>

                    <h3 className="news-card-title">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="news-excerpt">
                        {item.excerpt}
                      </p>
                    )}

                    <span className="news-read-more">
                      Read Story
                      <span
                        className="news-read-more-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty">
            No news stories available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}

