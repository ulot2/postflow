"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import SignUpLeftPanel from "@/components/auth/SignUpLeftPanel";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      await signUp.create({ emailAddress, password, firstName, lastName });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message || "Failed to sign up with Google.",
      );
      setIsGoogleLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.warn("Verification incomplete:", result);
      }
    } catch (err) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verification screen ──────────────────────────────────────────────────
  if (pendingVerification) {
    return (
      <div className="grid grid-cols-2 min-h-screen max-[860px]:grid-cols-1">
        <SignUpLeftPanel />
        <div className="flex items-center justify-center bg-[#f7f4ef] p-[52px_44px]">
          <div className="w-full max-w-[408px]">
            <div className="mb-10">
              <h1 className="font-syne text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-[9px] text-[#0f0f0f]">
                Check your
                <br />
                email
              </h1>
              <p className="text-[#6b6b6b] text-[14.5px] leading-[1.55]">
                We sent a 6-digit code to{" "}
                <strong className="text-[#0f0f0f]">{emailAddress}</strong>
              </p>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col gap-3.5">
              {error && (
                <div className="bg-red-50 text-red-600 text-[13.5px] p-2.5 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="123456"
                  className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none tracking-[0.15em]"
                />
              </div>

              <button
                type="submit"
                disabled={!isLoaded || isLoading}
                className={`w-full flex items-center justify-center gap-2.5 mt-1 bg-[#0f0f0f] text-[#d4f24a] rounded-[11px] px-5 py-3.5 font-syne font-bold text-[15px] ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer hover:opacity-90 transition"
                }`}
              >
                {isLoading ? (
                  <div className="w-[18px] h-[18px] border-2 border-[rgba(212,242,74,0.3)] border-t-[#d4f24a] rounded-full animate-spin" />
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Sign-up screen ───────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 min-h-screen max-[860px]:grid-cols-1">
      <SignUpLeftPanel />

      <div className="flex items-center justify-center bg-[#f7f4ef] p-[52px_44px]">
        <div className="w-full max-w-[408px]">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-[6px] bg-[rgba(15,15,15,0.06)] border border-[#e0dbd3] rounded-full py-[4px] px-[11px] mb-[18px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e]" />
              <span className="text-[11.5px] font-semibold text-[#6b6b6b] font-syne tracking-[0.05em]">
                Free forever plan available
              </span>
            </div>

            <h1 className="font-syne text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-[9px] text-[#0f0f0f]">
              Create your
              <br />
              account
            </h1>

            <p className="text-[#6b6b6b] text-[14.5px] leading-[1.55]">
              No credit card. No fluff. Just PostFlow.
            </p>
          </div>

          {/* Google */}
          <div className="mb-[18px]">
            <button
              onClick={handleGoogleSignUp}
              disabled={!isLoaded || isGoogleLoading || isLoading}
              className={`w-full flex items-center justify-center gap-[9px] px-[22px] py-[12px] rounded-[11px] text-[14px] font-semibold font-instrument-sans border-[1.5px] border-[#e0dbd3] bg-white text-[#0f0f0f] transition ${
                isGoogleLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              {isGoogleLoading ? (
                <div className="w-[18px] h-[18px] border-2 border-[#ddd] border-t-[#555] rounded-full animate-spin" />
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
              <div className="flex items-center gap-3 text-[#c0bbb3] text-[11.5px] font-syne font-semibold mb-4">
                <div className="flex-1 h-px bg-[#e0dbd3]" />
                or
                <div className="flex-1 h-px bg-[#e0dbd3]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
                {error && (
                  <div className="bg-red-50 text-red-600 text-[13.5px] p-2.5 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Alex Johnson"
                    className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    placeholder="alex@studio.co"
                    className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
                      Confirm
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isLoaded || isLoading}
                  className={`w-full flex items-center justify-center gap-2.5 mt-1 bg-[#0f0f0f] text-[#d4f24a] rounded-[11px] px-5 py-3.5 font-syne font-bold text-[15px] transition ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-90"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-[18px] h-[18px] border-2 border-[rgba(212,242,74,0.3)] border-t-[#d4f24a] rounded-full animate-spin" />
                  ) : (
                    <>
                      Get started — it&apos;s free
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

              {/* Sign in Link */}
              <div className="mt-5.5 text-center">
                <span className="text-[13.5px] text-[#6b6b6b]">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/sign-in"
                  className="text-[13.5px] font-bold text-[#0f0f0f] underline underline-offset-3 font-syne"
                >
                  Sign in
                </Link>
              </div>

              <div id="clerk-captcha" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
