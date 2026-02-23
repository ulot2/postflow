export default function SignUpLeftPanel() {
  return (
    <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0f0f0f] p-11 w-full min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatA {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-16px) rotate(-1.5deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .fa { animation: floatA 7s ease-in-out infinite; }
        .fb { animation: floatB 6s ease-in-out 0.8s infinite; }
        .fc { animation: floatC 8s ease-in-out 0.3s infinite; }
        .live-dot { animation: blink 2s ease-in-out infinite; }
      `,
        }}
      />

      {/* Background blobs */}
      <div className="absolute rounded-full blur-[90px] pointer-events-none w-[500px] h-[500px] bg-[#d4f24a] opacity-[0.07] -top-[150px] -right-[150px]"></div>
      <div className="absolute rounded-full blur-[90px] pointer-events-none w-[300px] h-[300px] bg-[#7c3aed] opacity-[0.08] -bottom-[80px] -left-[60px]"></div>

      {/* Watermark */}
      <div
        className="absolute -bottom-10 -left-4 font-syne text-[200px] font-extrabold text-transparent leading-none pointer-events-none select-none whitespace-nowrap"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        Flow
      </div>

      {/* Brand */}
      <div className="relative z-10 flex items-center gap-[11px]">
        <div className="w-[34px] h-[34px] bg-[#d4f24a] rounded-[9px] flex items-center justify-center shrink-0">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f0f0f"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <span className="text-white text-[19px] font-extrabold tracking-[-0.02em] font-syne">
          PostFlow
        </span>
      </div>

      {/* Floating UI illustration — fills available vertical space */}
      <div className="relative flex-1 z-10 flex items-center justify-center my-4">
        <div className="relative w-full max-w-[500px] h-full max-h-[420px]">
          {/* Calendar card – top left, anchored to top */}
          <div className="absolute fa w-[260px] p-[18px] -top-[10px] -left-[8px] bg-[#161616] border border-[#252525] rounded-[18px]">
            <div className="flex justify-between items-center mb-[14px]">
              <span className="text-white font-syne text-[12px] font-bold">
                February 2025
              </span>
              <div className="flex gap-[5px]">
                <div className="w-[22px] h-[22px] rounded-md bg-[#222]"></div>
                <div className="w-[22px] h-[22px] rounded-md bg-[#222]"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-[3px] mb-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-[5px] bg-[#2e2e2e] rounded-sm" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-[3px]">
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222] p-[2px] flex flex-col gap-[2px]">
                <div className="h-[3px] bg-[#2a2a2a] rounded-[1px]"></div>
                <div className="h-[3px] bg-blue-500 rounded-sm"></div>
              </div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#2e2e2e] bg-[#1e1e1e] p-[2px] flex flex-col gap-[2px]">
                <div className="h-[3px] bg-sky-500 rounded-sm"></div>
                <div className="h-[3px] bg-pink-500 rounded-sm"></div>
              </div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222] p-[2px] flex flex-col gap-[2px]">
                <div className="h-[3px] bg-purple-500 rounded-sm"></div>
              </div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] bg-[#d4f24a] flex items-center justify-center">
                <span className="text-[7px] font-extrabold text-[#0f0f0f] font-syne">
                  14
                </span>
              </div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222]"></div>
              <div className="aspect-square rounded-[5px] border border-[#222] p-[2px] flex flex-col gap-[2px]">
                <div className="h-[3px] bg-blue-500 rounded-sm"></div>
                <div className="h-[3px] bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Post preview card – overlapping right, vertically centered */}
          <div className="absolute fb w-[220px] p-[16px] top-[50%] -translate-y-[40%] right-[-12px] bg-white border border-[#eee] rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
            <div className="flex gap-[2px] mb-[11px]">
              <div className="h-[3px] w-[28px] bg-blue-500 rounded-sm"></div>
              <div className="h-[3px] w-[28px] bg-[#e5e5e5] rounded-sm"></div>
              <div className="h-[3px] w-[28px] bg-[#e5e5e5] rounded-sm"></div>
            </div>
            <div className="flex items-center gap-[9px] mb-[10px]">
              <div className="w-[30px] h-[30px] rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] shrink-0"></div>
              <div>
                <div className="h-[7px] w-[72px] bg-[#e8e8e8] rounded-[3px] mb-1"></div>
                <div className="h-[5px] w-[44px] bg-[#f0f0f0] rounded-[3px]"></div>
              </div>
            </div>
            <div className="mb-[9px]">
              <div className="h-[5px] w-full bg-[#f0f0f0] rounded-sm mb-1"></div>
              <div className="h-[5px] w-[88%] bg-[#f0f0f0] rounded-sm mb-1"></div>
              <div className="h-[5px] w-[64%] bg-[#f0f0f0] rounded-sm"></div>
            </div>
            <div className="h-[72px] rounded-[9px] bg-linear-to-br from-blue-50 to-green-50 border border-blue-100 flex items-center justify-center mb-[9px]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="flex gap-[10px]">
              <div className="h-[5px] w-[18px] bg-[#e8e8e8] rounded-sm"></div>
              <div className="h-[5px] w-[18px] bg-[#e8e8e8] rounded-sm"></div>
              <div className="h-[5px] w-[18px] bg-[#e8e8e8] rounded-sm"></div>
            </div>
          </div>

          {/* Notification badge – floats near post preview for visual interest */}
          <div className="absolute top-[42%] right-[168px] fc bg-[#d4f24a] rounded-full w-[22px] h-[22px] flex items-center justify-center shadow-[0_4px_12px_rgba(212,242,74,0.35)] z-10">
            <span className="text-[9px] font-extrabold text-[#0f0f0f] font-syne">
              3
            </span>
          </div>

          {/* Stats card – bottom left */}
          <div className="absolute fc w-[200px] p-[16px] -bottom-[10px] left-[4px] bg-[#161616] border border-[#252525] rounded-[18px]">
            <div className="flex items-center gap-2 mb-[12px]">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d4f24a]/10 flex items-center justify-center shrink-0">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d4f24a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-[#666] text-[9.5px] font-bold tracking-widest uppercase font-syne">
                This Week
              </span>
            </div>
            <div className="text-white font-syne text-[22px] font-extrabold mb-0.5 tracking-[-0.02em]">
              12 Posts
            </div>
            <div className="text-[#d4f24a] text-[11px] font-semibold mb-3">
              Across 3 platforms
            </div>
            <div className="flex items-end gap-[3px] h-[30px]">
              <div className="flex-1 h-[38%] bg-[#252525] rounded-t-[3px]"></div>
              <div className="flex-1 h-[65%] bg-[#252525] rounded-t-[3px]"></div>
              <div className="flex-1 h-[50%] bg-[#252525] rounded-t-[3px]"></div>
              <div className="flex-1 h-[88%] bg-[#d4f24a] rounded-t-[3px]"></div>
              <div className="flex-1 h-[62%] bg-[#252525] rounded-t-[3px]"></div>
              <div className="flex-1 h-[76%] bg-[#252525] rounded-t-[3px]"></div>
              <div className="flex-1 h-[42%] bg-[#252525] rounded-t-[3px]"></div>
            </div>
          </div>

          {/* Live syncing pill – bottom right */}
          <div className="absolute -bottom-[4px] right-[14px] bg-[#161616] border border-[#252525] rounded-full p-[7px_13px] flex items-center gap-[7px] fb">
            <div className="w-[7px] h-[7px] rounded-full bg-green-500 live-dot"></div>
            <span className="text-[#888] text-[10.5px] font-semibold font-syne">
              Live syncing
            </span>
          </div>
        </div>
      </div>

      {/* Bottom copy */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-[6px] border border-[#2a2a2a] rounded-full p-[5px_12px] mb-[18px]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#d4f24a]"></div>
          <span className="text-[#888] text-[11px] font-semibold tracking-[0.08em] font-syne uppercase">
            Your all-in-one content workspace
          </span>
        </div>
        <h2 className="text-white text-[30px] font-extrabold leading-[1.18] tracking-[-0.025em] mb-3">
          Your content.
          <br />
          Your schedule.
          <br />
          <span className="text-[#d4f24a]">Your growth.</span>
        </h2>
        <p className="text-[#5a5a5a] text-[14.5px] leading-[1.65]">
          Plan, preview, and publish across every platform — from one
          beautifully simple dashboard.
        </p>
        <div className="flex items-center gap-[18px] mt-6 opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.23-1.89 1.48-4.4 2.1-6.76 1.63-2.58-.51-4.83-2.3-5.74-4.73-.85-2.27-.63-4.96.64-7.05 1.12-1.85 3.02-3.1 5.14-3.48 1.46-.26 2.98-.12 4.38.37v4.11c-.55-.26-1.16-.39-1.78-.36-1.32.06-2.59.88-3.13 2.06-.57 1.16-.48 2.64.24 3.73.69 1.05 1.95 1.6 3.2 1.48 1.23-.11 2.37-.93 2.85-2.07.28-.66.42-1.38.41-2.1V1.49l-.01-1.47z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
