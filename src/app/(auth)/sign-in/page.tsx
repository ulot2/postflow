"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import SignUpLeftPanel from "@/components/auth/SignUpLeftPanel";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.warn("Sign-in incomplete:", result);
      }
    } catch (err) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message || "Failed to sign in with Google.",
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 min-h-screen max-[860px]:grid-cols-1">
      <SignUpLeftPanel />

      <div className="flex items-center justify-center px-[44px] py-[52px] bg-[#f7f4ef]">
        <div className="w-full max-w-[408px]">
          {/* Header */}
          <div className="mb-[30px]">
            <div className="inline-flex items-center gap-[6px] bg-[rgba(15,15,15,0.06)] border border-[#e0dbd3] rounded-full py-[4px] px-[11px] mb-[18px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e]" />
              <span className="text-[11.5px] font-semibold text-[#6b6b6b] font-syne tracking-[0.05em]">
                Welcome back
              </span>
            </div>

            <h1 className="font-syne text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-[9px] text-[#0f0f0f]">
              Sign in to
              <br />
              PostFlow
            </h1>

            <p className="text-[#6b6b6b] text-[14.5px] leading-[1.55]">
              Good to see you again. Pick up right where you left off.
            </p>
          </div>

          {/* Google */}
          <div className="mb-[18px]">
            <button
              onClick={handleGoogleSignIn}
              disabled={!isLoaded || isGoogleLoading || isLoading}
              className={`w-full bg-white text-[#0f0f0f] border-[1.5px] border-[#e0dbd3] px-[22px] py-[12px] rounded-[11px] font-instrument-sans text-[14px] font-semibold flex items-center justify-center gap-[9px] transition ${
                isGoogleLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              {isGoogleLoading ? (
                <div className="w-[18px] h-[18px] border-2 border-[#ddd] border-t-[#555] rounded-full animate-[spin_0.7s_linear_infinite]" />
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          {!isGoogleLoading && (
            <>
              <div className="flex items-center gap-[14px] text-[#c0bbb3] text-[11.5px] font-semibold tracking-[0.06em] font-syne mb-[18px]">
                <div className="flex-1 h-px bg-[#e0dbd3]" />
                or
                <div className="flex-1 h-px bg-[#e0dbd3]" />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[14px]"
              >
                {error && (
                  <div className="bg-[#fef2f2] text-[#dc2626] text-[13.5px] px-[14px] py-[10px] rounded-[10px] border border-[#fecaca]">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block mb-[7px] text-[12px] font-semibold text-[#6b6b6b] font-syne">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    placeholder="alex@studio.co"
                    className="w-full px-[14px] py-[12px] rounded-[10px] border border-[#e0dbd3] text-[14px] outline-none focus:border-black"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-[7px]">
                    <label className="text-[12px] font-semibold text-[#6b6b6b] font-syne">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-[12px] text-[#6b6b6b] underline underline-offset-[3px] font-syne font-semibold"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-[14px] py-[12px] rounded-[10px] border border-[#e0dbd3] text-[14px] outline-none focus:border-black"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isLoaded || isLoading}
                  className={`w-full bg-[#0f0f0f] text-[#d4f24a] px-[22px] py-[14px] rounded-[11px] font-syne text-[15px] font-bold flex items-center justify-center gap-[9px] mt-[4px] transition ${
                    isLoading
                      ? "cursor-not-allowed opacity-70"
                      : "hover:opacity-90"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-[18px] h-[18px] border-2 border-[rgba(212,242,74,0.3)] border-t-[#d4f24a] rounded-full animate-[spin_0.7s_linear_infinite]" />
                  ) : (
                    <>
                      Sign in to PostFlow
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <div className="mt-[22px] text-center">
                <span className="text-[13.5px] text-[#6b6b6b]">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/sign-up"
                  className="text-[13.5px] font-bold text-[#0f0f0f] underline underline-offset-[3px] font-syne"
                >
                  Sign up free
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
