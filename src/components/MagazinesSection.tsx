
"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useState } from "react";
import "../styles/magazines.css";

const LATEST_MAGAZINES = [
  {
    id: "seema-jimmy",
    title: "The Future of African Enterprise",
    image: "/magazine-1.jpg",
  },
  {
    id: "alyoum-jordan",
    title: "Food & Beverage 2026",
    image: "/magazine-2.jpg",
  },
  {
    id: "grace-mathhape",
    title: "Innovators & Influencers",
    image: "/magazine-3.jpg",
  },
  {
    id: "aci-world",
    title: "ACI World Services",
    image: "/magazine-4.jpg",
  },
];

export default function MagazinesSection() {
  return (
    <section
      id="magazines"
      className="w-full border-b border-slate-100 bg-white scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        {/* HEADER */}

        <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5 sm:mb-8 sm:pb-6">
          {/* LEFT SIDE */}

          <div className="min-w-0">
            <span className="mb-2 block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#2a619d] sm:text-[10px] sm:tracking-[0.15em]">
              CURATED EDITIONS
            </span>

            <h2 className="whitespace-nowrap text-[27px] font-black uppercase leading-none tracking-[-0.045em] text-[#082e63] sm:text-[36px] lg:text-[42px]">
              LATEST MAGAZINES
            </h2>
          </div>

          {/* RIGHT SIDE */}

          <Link
            href="/magazines"
            className="group flex shrink-0 items-center gap-2 border-b-2 border-[#285a9c] pb-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#174a84] transition-all duration-200 hover:gap-3 sm:text-[10px]"
          >
            <span className="whitespace-nowrap">EXPLORE ALL MAGAZINES</span>

            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4"
            />
          </Link>
        </div>

        {/* MAGAZINES */}

        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide lg:overflow-visible">
          <div className="flex gap-2.5 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid lg:grid-cols-4 lg:gap-5">
            {LATEST_MAGAZINES.map((magazine) => (
              <MagazineCard
                key={magazine.id}
                id={magazine.id}
                title={magazine.title}
                image={magazine.image}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MAGAZINE CARD
========================================================= */

type MagazineCardProps = {
  id: string;
  title: string;
  image: string;
};

function MagazineCard({
  id,
  title,
  image,
}: MagazineCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/magazines/${id}`}
      className="group relative block aspect-[3/4] w-[calc((100vw-43px)/3)] min-w-[calc((100vw-43px)/3)] overflow-hidden rounded-[4px] border border-slate-200 bg-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:min-w-0"
    >
      {/* IMAGE */}

      {!imageError ? (
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          onError={() => setImageError(true)}
        />
      ) : (
        /* FALLBACK */

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0b3470] text-white">
          <BookOpen
            size={42}
            strokeWidth={1.3}
            className="text-[#d4a83e]"
          />

          <span className="px-6 text-center text-[11px] font-bold uppercase tracking-[0.18em]">
            ICONIQ SPHERE
          </span>
        </div>
      )}

      {/* DARK HOVER OVERLAY */}

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#071f43]/95 via-[#071f43]/40 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-5 lg:p-5">
        <div className="w-full translate-y-3 transition-transform duration-500 group-hover:translate-y-0">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen
              size={15}
              strokeWidth={1.7}
              className="text-[#d4a83e]"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              Magazine
            </span>
          </div>

          <h3 className="mb-4 text-[12px] font-bold uppercase leading-4 tracking-wide text-white sm:text-sm sm:leading-5">
            {title}
          </h3>

          <span className="inline-flex items-center gap-2 bg-[#d4a83e] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:px-4 sm:py-2.5 sm:text-[10px]">
            Read Edition

            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
            />
          </span>
        </div>
      </div>

      {/* SMALL NUMBER */}

      <span className="absolute left-3 top-3 z-10 text-[9px] font-bold tracking-[0.15em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:left-4 sm:top-4 sm:text-[11px]">
        {String(
          LATEST_MAGAZINES.findIndex(
            (item) => item.id === id
          ) + 1
        ).padStart(2, "0")}
      </span>
    </Link>
  );
}

