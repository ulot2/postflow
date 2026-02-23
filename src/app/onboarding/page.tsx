import SignUpLeftPanel from "@/components/auth/SignUpLeftPanel";
import BrandForm from "@/components/onboarding/BrandForm";

export default function OnboardingPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen max-[860px]:grid-cols-1">
      <SignUpLeftPanel />

      <div className="flex items-center justify-center bg-[#f7f4ef] p-[52px_44px]">
        <div className="w-full max-w-[408px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-syne text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] mb-[9px] text-[#0f0f0f]">
              Tell us about
              <br />
              your brand
            </h1>
            <p className="text-[#6b6b6b] text-[14.5px] leading-[1.55]">
              Are you managing a personal brand or a company workspace?
            </p>
          </div>

          <BrandForm />
        </div>
      </div>
    </div>
  );
}
