"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "../styles/ArticlesSection.css";  // ← Add this import

const ARTICLES = [
  {
    category: "BUSINESS",
    title: "Building Businesses That Shape the Future",
    excerpt:
      "Discover the ideas, strategies and leadership decisions transforming modern business.",
    image: "/article-1.jpg",
    slug: "building-businesses-that-shape-the-future",
  },
  {
    category: "LEADERSHIP",
    title: "The Leaders Redefining What's Possible",
    excerpt:
      "Meet the visionary minds creating meaningful impact across industries.",
    image: "/article-2.jpg",
    slug: "the-leaders-redefining-whats-possible",
  },
  {
    category: "INNOVATION",
    title: "Innovation Beyond the Expected",
    excerpt:
      "Exploring breakthrough ideas and the people turning them into reality.",
    image: "/article-3.jpg",
    slug: "innovation-beyond-the-expected",
  },
  {
    category: "TECHNOLOGY",
    title: "Technology Creating the Next Business Advantage",
    excerpt:
      "Exploring the technologies transforming how modern organizations operate and grow.",
    image: "/article-4.jpg",
    slug: "technology-next-business-advantage",
  },
];

export default function ArticlesSection() {
  return (
    <section
      id="articles"
      className="relative w-full overflow-hidden border-b border-slate-200/60 bg-[#f6f9fc] -mt-2 pt-4 pb-16 lg:-mt-4 lg:pt-6 lg:pb-20"
    >
      {/* ================= BACKGROUND GRID ================= */}

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(25, 76, 130, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 76, 130, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-5 sm:mb-8 sm:pb-6">
          {/* LEFT SIDE */}

          <div className="min-w-0">
            <span className="mb-2 block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#2a619d] sm:text-[10px] sm:tracking-[0.15em]">
              PERSPECTIVES &amp; THOUGHT LEADERSHIP
            </span>

            <h2 className="whitespace-nowrap text-[25px] font-black uppercase leading-none tracking-[-0.045em] text-[#082e63] sm:text-[34px] lg:text-[42px]">
              Latest Articles
            </h2>
          </div>

          {/* RIGHT SIDE */}

          <Link
            href="/articles"
            className="group flex shrink-0 items-center gap-2 border-b-2 border-[#285a9c] pb-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#174a84] transition-all duration-200 hover:gap-3 sm:text-[10px]"
          >
            <span className="whitespace-nowrap">Explore All Articles</span>

            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
            />
          </Link>
        </div>

        {/* ================= ARTICLES ================= */}

        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide lg:overflow-visible">
          <div className="flex gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {ARTICLES.map((article, index) => (
              <article
                key={index}
                className="group flex w-[calc((100vw-43px)/3)] min-w-[calc((100vw-43px)/3)] flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(8,46,99,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9c8d9] hover:shadow-[0_14px_30px_rgba(8,46,99,0.08)] sm:w-auto sm:min-w-0 lg:rounded-lg"
              >
                {/* ================= IMAGE ================= */}

                <Link
                  href={`/articles/${article.slug}`}
                  className="relative block aspect-[16/9] w-full overflow-hidden bg-[#eef2f7]"
                >
                  {/* IMAGE */}

                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* FALLBACK */}

                  <div className="absolute inset-0 -z-0 flex items-center justify-center bg-[#eef2f7]">
                    <span className="text-center text-[6px] font-bold uppercase tracking-[0.16em] text-[#082e63]/30 sm:text-[9px] sm:tracking-[0.25em]">
                      ICONIQ SPHERE
                    </span>
                  </div>

                  {/* CATEGORY */}

                  <div className="absolute left-1.5 top-1.5 z-10 sm:left-3 sm:top-3">
                    <span className="inline-flex items-center rounded-sm bg-white/95 px-1.5 py-1 text-[5px] font-black uppercase tracking-[0.08em] text-[#2a619d] shadow-sm backdrop-blur-sm sm:rounded-md sm:px-2.5 sm:py-1.5 sm:text-[8px] sm:tracking-[0.12em]">
                      {article.category}
                    </span>
                  </div>

                  {/* HOVER ARROW */}

                  <div className="absolute inset-0 flex items-end justify-end bg-[#082e63]/10 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-3">
                    <div className="flex h-6 w-6 translate-y-2 items-center justify-center rounded-full bg-white text-[#082e63] shadow-md transition-transform duration-300 group-hover:translate-y-0 sm:h-9 sm:w-9">
                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.8}
                        className="sm:h-4 sm:w-4"
                      />
                    </div>
                  </div>
                </Link>

                {/* ================= CONTENT ================= */}

                <div className="flex flex-1 flex-col justify-between p-2 sm:p-3.5 lg:p-4.5">
                  <div>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="line-clamp-3 text-[9px] font-extrabold leading-[1.2] tracking-[-0.015em] text-[#082e63] transition-colors duration-200 group-hover:text-[#2a619d] sm:line-clamp-2 sm:text-[14px] lg:text-[17px] lg:leading-[1.2]">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="mt-1.5 line-clamp-3 text-[7px] leading-[1.45] text-[#4a688d] sm:mt-2.5 sm:text-[10px] sm:leading-[1.55] lg:mt-2.5 lg:text-[11px] lg:leading-[1.5]">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* ================= FOOTER ================= */}

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 sm:mt-4 sm:pt-3 lg:mt-4 lg:pt-3">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex min-w-0 items-center gap-1 text-[5px] font-black uppercase tracking-[0.08em] text-[#174a84] transition-colors group-hover:text-[#082e63] sm:gap-1.5 sm:text-[8px] sm:tracking-[0.1em] lg:gap-2 lg:text-[9px] lg:tracking-[0.12em]"
                    >
                      <span className="whitespace-nowrap">
                        Read Article
                      </span>

                      <span className="hidden h-px w-3 bg-[#174a84] transition-all duration-300 group-hover:w-6 sm:block lg:w-5 lg:group-hover:w-8" />

                      <ArrowUpRight
                        size={8}
                        strokeWidth={1.8}
                        className="shrink-0 sm:h-3 sm:w-3 lg:h-3 lg:w-3"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}