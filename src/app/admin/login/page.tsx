"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // DEMO ADMIN CREDENTIALS
  // ------------------------------------------------------------
  const ADMIN_EMAIL = "iconiq@gmail.com";
  const ADMIN_PASSWORD = "12345";

  // ------------------------------------------------------------
  // LOGIN
  // ------------------------------------------------------------
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Demo authentication
    if (
      cleanEmail === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      try {
        localStorage.setItem(
          "iconiq_admin_logged_in",
          "true"
        );
        router.push("/admin/dashboard");
      } catch (err) {
        setLoading(false);
        setError("Storage is disabled. Please enable cookies/local storage.");
      }
      return;
    }

    setLoading(false);
    setError("Invalid email or password.");
  };

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#f7f9fc]
        text-[#082e63]
        flex
        items-center
        justify-center
        px-3
        py-3
        overflow-hidden
      "
    >

      {/* =====================================================
          MAIN LOGIN CONTAINER
      ====================================================== */}

      <div
        className="
          w-full
          max-w-[1100px]
          h-[calc(100vh-24px)]
          max-h-[780px]
          bg-white
          border
          border-[#dce4ed]
          shadow-[0_15px_45px_rgba(8,46,99,0.08)]
          flex
          flex-col
          lg:flex-row
          overflow-hidden
        "
      >

        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}

        <div
          className="
            hidden
            lg:flex
            lg:w-[44%]
            bg-[#082e63]
            relative
            overflow-hidden
            flex-col
            justify-between
            px-7
            py-7
            xl:px-9
            xl:py-8
          "
        >

          {/* SUBTLE GRID */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.055]
              pointer-events-none
            "
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* GOLD ACCENT */}

          <div
            className="
              absolute
              top-0
              left-0
              w-[95px]
              h-[2px]
              bg-[#c9a24d]
            "
          />

          {/* =================================================
              LOGO
          ================================================== */}

          <div className="relative z-10 flex items-center">

            <Image
              src="/iconiq-sphere-logo-admin.svg"
              alt="Iconiq Sphere"
              width={210}
              height={60}
              className="
                w-auto
                h-[52px]
                max-w-[210px]
                object-contain
              "
              priority
            />

          </div>

          {/* =================================================
              CENTER CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              max-w-[370px]
              my-auto
            "
          >

            <span
              className="
                block
                text-[9px]
                font-bold
                tracking-[0.25em]
                uppercase
                text-[#c9a24d]
                mb-2.5
              "
            >
              ADMINISTRATION PORTAL
            </span>

            <h1
              className="
                text-[34px]
                xl:text-[38px]
                font-black
                leading-[1.03]
                tracking-[-0.035em]
                uppercase
                text-white
              "
            >
              Shape the
              <br />
              stories.
            </h1>

            <p
              className="
                mt-3
                text-[12px]
                leading-5
                text-white/65
                max-w-[350px]
              "
            >
              Manage stories, magazines, categories, awards,
              featured content and the editorial experience of
              Iconiq Sphere.
            </p>

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-2.5
            "
          >

            <span
              className="
                w-7
                h-[1px]
                bg-[#c9a24d]
              "
            />

            <span
              className="
                text-[8px]
                font-bold
                tracking-[0.2em]
                uppercase
                text-white/45
              "
            >
              ICONIQ SPHERE • SECURE ADMIN • ©{" "}
              {new Date().getFullYear()}
            </span>

          </div>

        </div>


        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <div
          className="
            w-full
            lg:w-[56%]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-white
          "
        >

          <div
            className="
              w-full
              max-w-[420px]
              px-5
              sm:px-8
              py-5
              sm:py-6
            "
          >

            {/* =================================================
                MOBILE LOGO
            ================================================== */}

            <div
              className="
                lg:hidden
                mb-5
                flex
                items-center
              "
            >

              <Image
                src="/iconiq-sphere-logo.svg"
                alt="Iconiq Sphere"
                width={170}
                height={50}
                className="
                  w-auto
                  h-10
                  object-contain
                "
                priority
              />

            </div>


            {/* =================================================
                HEADER
            ================================================== */}

            <div className="mb-5">

              <span
                className="
                  block
                  text-[9px]
                  font-bold
                  tracking-[0.24em]
                  uppercase
                  text-[#6680a3]
                  mb-1.5
                "
              >
                AUTHENTICATION
              </span>

              <h2
                className="
                  text-[28px]
                  sm:text-[30px]
                  font-black
                  tracking-[-0.03em]
                  leading-none
                  uppercase
                "
              >
                Admin Login
              </h2>

              <p
                className="
                  mt-2
                  text-[12px]
                  leading-5
                  text-[#71859e]
                "
              >
                Sign in to access your Iconiq Sphere
                administration panel.
              </p>

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-3.5"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    block
                    text-[9px]
                    font-black
                    tracking-[0.18em]
                    uppercase
                    mb-1.5
                    text-[#082e63]
                  "
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#8da0b7]
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    placeholder="iconiq@gmail.com"
                    className="
                      w-full
                      h-[44px]
                      bg-[#f8fafc]
                      border
                      border-[#d9e2ec]
                      pl-10
                      pr-4
                      text-[13px]
                      text-[#082e63]
                      outline-none
                      transition-all
                      duration-200
                      focus:border-[#082e63]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#082e63]/5
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label
                  htmlFor="password"
                  className="
                    block
                    text-[9px]
                    font-black
                    tracking-[0.18em]
                    uppercase
                    mb-1.5
                    text-[#082e63]
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#8da0b7]
                    "
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="
                      w-full
                      h-[44px]
                      bg-[#f8fafc]
                      border
                      border-[#d9e2ec]
                      pl-10
                      pr-11
                      text-[13px]
                      text-[#082e63]
                      outline-none
                      transition-all
                      duration-200
                      focus:border-[#082e63]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#082e63]/5
                    "
                  />

                  {/* SHOW / HIDE PASSWORD */}

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="
                      absolute
                      right-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#8da0b7]
                      hover:text-[#082e63]
                      transition-colors
                    "
                  >

                    {showPassword ? (
                      <EyeOff
                        size={16}
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Eye
                        size={16}
                        strokeWidth={1.7}
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  FORGOT PASSWORD
              ================================================== */}

              <div
                className="
                  flex
                  justify-end
                  pt-0
                "
              >

                <Link
                  href="/admin/forgot-password"
                  className="
                    text-[10px]
                    font-bold
                    tracking-[0.08em]
                    text-[#466789]
                    hover:text-[#c9a24d]
                    transition-colors
                  "
                >
                  Forgot Password?
                </Link>

              </div>


              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {error && (
                <div
                  className="
                    w-full
                    border
                    border-red-200
                    bg-red-50
                    px-3.5
                    py-2.5
                    text-[10px]
                    font-medium
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}


              {/* =================================================
                  SIGN IN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  w-full
                  h-[44px]
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
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  mt-1
                "
              >

                <span>
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </span>

                {!loading && (
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                )}

              </button>

            </form>


            {/* =================================================
                SECURITY NOTE
            ================================================== */}

            <div
              className="
                mt-5
                pt-3.5
                border-t
                border-[#e2e8ef]
              "
            >

              <p
                className="
                  text-[10px]
                  leading-5
                  text-[#8a9bb0]
                "
              >
                Restricted area for authorized Iconiq Sphere
                administrators.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}