"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] text-[#082e63] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px]">

        {/* LOGO */}
        <div className="flex justify-center mb-7">
          <Link href="/" aria-label="Iconiq Sphere home">
            <Image
              src="/iconiq-sphere-logo.svg"
              alt="Iconiq Sphere"
              width={180}
              height={50}
              className="w-auto h-11 object-contain"
              priority
            />
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#dce4ed] shadow-[0_20px_60px_rgba(8,46,99,0.08)]">

          {/* GOLD ACCENT */}
          <div className="h-[2px] bg-[#c9a24d]" />

          <div className="px-7 sm:px-10 py-9 sm:py-10">

            {!submitted ? (
              <>
                {/* HEADER */}
                <div className="mb-7">

                  <span className="block text-[10px] font-bold tracking-[0.24em] uppercase text-[#6680a3] mb-2">
                    ACCOUNT RECOVERY
                  </span>

                  <h1 className="text-[30px] sm:text-[34px] font-black tracking-[-0.03em] leading-none uppercase text-[#082e63]">
                    Forgot Password?
                  </h1>

                  <p className="mt-3 text-[13px] leading-5 text-[#71859e] max-w-[390px]">
                    Enter the email address associated with your
                    administrator account and we'll send you a
                    secure password reset link.
                  </p>

                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* EMAIL */}
                  <div>

                    <label
                      htmlFor="email"
                      className="block text-[10px] font-black tracking-[0.18em] uppercase mb-2 text-[#082e63]"
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={16}
                        strokeWidth={1.7}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8da0b7]"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        required
                        className="
                          w-full
                          h-[48px]
                          bg-[#f8fafc]
                          border
                          border-[#d9e2ec]
                          pl-10
                          pr-4
                          text-[13.5px]
                          text-[#082e63]
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-[#9aabc0]
                          focus:border-[#082e63]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#082e63]/5
                        "
                      />

                    </div>

                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="
                      group
                      w-full
                      h-[48px]
                      bg-[#082e63]
                      text-white
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-[10px]
                      font-black
                      tracking-[0.2em]
                      uppercase
                      transition-all
                      duration-300
                      hover:bg-[#0b3b7c]
                      hover:shadow-lg
                    "
                  >

                    <span>Send Reset Link</span>

                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.8}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />

                  </button>

                </form>

                {/* BACK TO LOGIN */}
                <div className="mt-7 text-center">

                  <Link
                    href="/admin/login"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-[11px]
                      font-bold
                      tracking-[0.08em]
                      text-[#466789]
                      hover:text-[#c9a24d]
                      transition-colors
                    "
                  >
                    <ArrowLeft
                      size={14}
                      strokeWidth={1.7}
                    />

                    <span>Back to Admin Login</span>
                  </Link>

                </div>

                {/* SECURITY NOTE */}
                <div className="mt-7 pt-4 border-t border-[#e2e8ef]">

                  <p className="text-[11px] leading-5 text-[#8a9bb0]">
                    For security reasons, reset instructions will
                    only be sent if the email belongs to an
                    authorized administrator.
                  </p>

                </div>

              </>
            ) : (

              /* SUCCESS STATE */
              <div className="text-center py-3">

                {/* SUCCESS ICON */}
                <div className="mx-auto mb-6 w-14 h-14 border border-[#c9a24d] flex items-center justify-center">

                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#082e63"
                    strokeWidth="1.7"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>

                </div>

                <span className="block text-[10px] font-bold tracking-[0.24em] uppercase text-[#c9a24d] mb-2">
                  REQUEST RECEIVED
                </span>

                <h1 className="text-[28px] sm:text-[30px] font-black tracking-[-0.03em] leading-tight uppercase text-[#082e63]">
                  Check Your Email
                </h1>

                <p className="mt-3 text-[13px] leading-5 text-[#71859e]">
                  If an administrator account exists for that
                  email address, password reset instructions
                  will be sent shortly.
                </p>

                <Link
                  href="/admin/login"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    mt-7
                    h-[46px]
                    px-7
                    bg-[#082e63]
                    text-white
                    text-[10px]
                    font-black
                    tracking-[0.18em]
                    uppercase
                    hover:bg-[#0b3b7c]
                    transition-colors
                  "
                >
                  <span>Return to Login</span>

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                  />

                </Link>

              </div>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-5">

          <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#9aabbe]">
            ICONIQ SPHERE &bull; SECURE ADMIN &bull; ©{" "}
            {new Date().getFullYear()}
          </p>

        </div>

      </div>
    </main>
  );
}