"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
ArrowUpRight,
Mail,
CheckCircle2,
Globe,
ShieldCheck,
} from "lucide-react";
import "../../styles/footer.css";

const exploreLinks = [
{ label: "Home", href: "/" },
{ label: "Cover Stories", href: "/#cover-stories" },
{ label: "Articles", href: "/#articles" },
{ label: "Magazines", href: "/#magazines" },
];

const discoverLinks = [
{ label: "Categories", href: "/#categories" },
{ label: "Hall of Fame", href: "/#hall-of-fame" },
{ label: "Awards", href: "/#awards" },
{ label: "Podcasts", href: "/#podcasts" },
];

const globalBureaus = [
{ city: "New York", region: "North America HQ" },
{ city: "London", region: "European Operations" },
{ city: "Singapore", region: "Asia-Pacific Hub" },
];

type SocialLink = {
label: string;
href: string;
svg: React.ReactNode;
};

const socialLinks: SocialLink[] = [
{
label: "LinkedIn",
href: "#",
svg: ( <svg
     className="w-3.5 h-3.5 fill-current"
     viewBox="0 0 24 24"
     aria-hidden="true"
   > <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /> </svg>
),
},
{
label: "Twitter",
href: "#",
svg: ( <svg
     className="w-3.5 h-3.5 fill-current"
     viewBox="0 0 24 24"
     aria-hidden="true"
   > <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> </svg>
),
},
{
label: "Instagram",
href: "#",
svg: ( <svg
     className="w-3.5 h-3.5 fill-current"
     viewBox="0 0 24 24"
     aria-hidden="true"
   > <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> </svg>
),
},
{
label: "YouTube",
href: "#",
svg: ( <svg
     className="w-3.5 h-3.5 fill-current"
     viewBox="0 0 24 24"
     aria-hidden="true"
   > <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> </svg>
),
},
{
label: "Pinterest",
href: "#",
svg: ( <svg
     className="w-3.5 h-3.5 fill-current"
     viewBox="0 0 24 24"
     aria-hidden="true"
   > <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.493-.695-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.221 7.462-1.217 0-2.365-.632-2.756-1.378l-.749 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /> </svg>
),
},
];

export default function ProfessionalFooter(): React.ReactElement {
const [email, setEmail] = useState<string>("");
const [submitted, setSubmitted] = useState<boolean>(false);

const handleEmailChange = (
event: React.ChangeEvent<HTMLInputElement>
): void => {
setEmail(event.target.value);
setSubmitted(false);
};

const handleSubscribe = (
event: React.FormEvent<HTMLFormElement>
): void => {
event.preventDefault();

```
const trimmedEmail = email.trim();

if (!trimmedEmail) {
  return;
}

setSubmitted(true);
setEmail("");
```

};

return ( <footer className="w-full bg-white text-[#082e63] border-t border-[#dce4ed] font-sans antialiased"> <section className="relative overflow-hidden bg-[#f4f8fc] border-b border-[#dce4ed]/60">
<div
className="absolute inset-0 pointer-events-none opacity-30"
style={{
backgroundImage:
"linear-gradient(rgba(8,46,99,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(8,46,99,0.045) 1px, transparent 1px)",
backgroundSize: "32px 32px",
}}
aria-hidden="true"
/>

```
    <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-[2px] bg-[#2d63a8]" aria-hidden="true" />

            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#7186a3]">
              ICONIQ SPHERE MEDIA GROUP
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#082e63] leading-[1.05]">
            Ideas that{" "}
            <span className="text-[#2d63a8]">
              move the world.
            </span>
          </h2>
        </div>

        <div className="max-w-[440px]">
          <p className="text-xs sm:text-sm leading-relaxed text-[#7186a3] font-serif italic">
            “Chronicling visionary leaders, transformative corporations,
            and ideas shaping the future of global business and technology.”
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.14em] uppercase text-[#082e63]">
              <Globe
                size={13}
                strokeWidth={1.8}
                className="text-[#2d63a8]"
                aria-hidden="true"
              />
              <span>Global Edition</span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.14em] uppercase text-[#082e63]">
              <ShieldCheck
                size={13}
                strokeWidth={1.8}
                className="text-[#2d63a8]"
                aria-hidden="true"
              />
              <span>Verified Journalism</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-x-8 gap-y-8 lg:gap-y-0">
      <div className="lg:pr-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 shrink-0 bg-[#082e63] text-white flex items-center justify-center rounded-sm">
            <span className="text-xs font-black tracking-tight">
              IS
            </span>
          </div>

          <div>
            <div className="text-xs font-extrabold tracking-[0.15em] leading-none text-[#082e63]">
              ICONIQ
            </div>

            <div className="text-[7px] tracking-[0.25em] font-bold text-[#7186a3] mt-0.5">
              SPHERE
            </div>
          </div>
        </div>

        <p className="max-w-[260px] text-xs leading-relaxed text-[#7186a3]">
          An independent international publication dedicated to
          leadership, innovation, technology, and global enterprise.
        </p>

        <Link
          href="/about"
          className="group inline-flex items-center gap-1.5 mt-3.5 text-[9px] font-extrabold tracking-[0.15em] uppercase text-[#082e63] hover:text-[#2d63a8] transition-colors"
        >
          <span>Corporate Overview</span>

          <ArrowUpRight
            size={12}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <FooterColumn title="Explore">
        {exploreLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="footer-link"
          >
            {item.label}
          </Link>
        ))}
      </FooterColumn>

      <FooterColumn title="Discover">
        {discoverLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="footer-link"
          >
            {item.label}
          </Link>
        ))}
      </FooterColumn>

      <div>
        <FooterTitle title="Bureaus" />

        <div className="flex flex-col gap-2.5">
          {globalBureaus.map((bureau) => (
            <div key={bureau.city}>
              <p className="text-xs font-serif font-bold text-[#082e63] tracking-wide">
                {bureau.city}
              </p>

              <p className="text-[10px] text-[#7186a3] tracking-tight">
                {bureau.region}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <FooterTitle title="The Sphere Letter" />

        <h3 className="text-sm sm:text-base font-serif font-bold leading-snug text-[#082e63]">
          Executive intelligence, delivered weekly.
        </h3>

        <p className="text-[11px] leading-relaxed text-[#7186a3] mt-1 mb-3">
          Curated analyses and insights for decision-makers and leaders.
        </p>

        {submitted ? (
          <div className="flex items-center gap-2 w-full max-w-[320px] px-3 py-2 bg-[#f4f8fc] border border-[#dce4ed] text-[#082e63] rounded-sm">
            <CheckCircle2
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-[#2d63a8]"
              aria-hidden="true"
            />

            <span className="text-[11px] font-medium">
              Subscribed successfully.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex items-center w-full max-w-[320px] border-b border-[#082e63] pb-1.5 focus-within:border-[#2d63a8] transition-colors"
          >
            <Mail
              size={13}
              strokeWidth={1.6}
              className="shrink-0 text-[#7186a3]"
              aria-hidden="true"
            />

            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="Corporate email"
              aria-label="Email address"
              autoComplete="email"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 text-xs text-[#082e63] placeholder:text-[#9aaabd]"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="w-6 h-6 shrink-0 flex items-center justify-center bg-[#082e63] text-white rounded-sm hover:bg-[#2d63a8] transition-colors"
            >
              <ArrowUpRight
                size={12}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </form>
        )}
      </div>
    </div>

    <div className="w-full h-px bg-[#dce4ed] my-7" />

    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-[11px] text-[#7186a3]">
          © 2026 Iconiq Sphere Inc. All rights reserved.
        </p>

        <span className="hidden sm:inline text-[#dce4ed]">
          •
        </span>

        <span className="text-[11px] text-[#7186a3]">
          ISSN 2790-441X
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <FooterLegalLink
          href="/privacy-policy"
          label="Privacy Policy"
        />

        <FooterLegalLink
          href="/terms"
          label="Terms of Service"
        />

        <FooterLegalLink
          href="/cookies"
          label="Cookie Preferences"
        />

        <FooterLegalLink
          href="/accessibility"
          label="Accessibility"
        />
      </div>

      <div className="flex items-center gap-1.5">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className="w-7 h-7 flex items-center justify-center border border-[#dce4ed] rounded-sm text-[#7186a3] hover:bg-[#082e63] hover:border-[#082e63] hover:text-white transition-all duration-200"
          >
            {item.svg}
          </a>
        ))}
      </div>
    </div>
  </section>

  <div className="border-t border-[#dce4ed] bg-[#f4f8fc]">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <span className="text-[8px] font-bold tracking-[0.18em] uppercase text-[#7186a3]">
          Global Publishing &amp; Media Group
        </span>

        <span className="text-[8px] font-bold tracking-[0.18em] uppercase text-[#7186a3]">
          Secure Enterprise Architecture · SSL Encrypted
        </span>
      </div>
    </div>
  </div>
</footer>


);
}

type FooterColumnProps = {
title: string;
children: React.ReactNode;
};

function FooterColumn({
title,
children,
}: FooterColumnProps): React.ReactElement {
return ( <div> <FooterTitle title={title} />
  <nav className="flex flex-col gap-2">
    {children}
  </nav>
</div>


);
}

type FooterTitleProps = {
title: string;
};

function FooterTitle({
title,
}: FooterTitleProps): React.ReactElement {
return ( <div className="flex items-center gap-2 mb-3"> <span
     className="w-3.5 h-[2px] bg-[#2d63a8]"
     aria-hidden="true"
   />


  <span className="text-[9px] font-extrabold tracking-[0.18em] uppercase text-[#082e63]">
    {title}
  </span>
</div>


);
}

type FooterLegalLinkProps = {
href: string;
label: string;
};

function FooterLegalLink({
href,
label,
}: FooterLegalLinkProps): React.ReactElement {
return ( <Link
   href={href}
   className="text-[11px] text-[#7186a3] hover:text-[#082e63] transition-colors"
 >
{label} </Link>
);
}
