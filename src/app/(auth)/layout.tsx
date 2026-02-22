export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PostFlow
            </h1>
            <p className="text-sm text-slate-500 mt-1">Social Media Planner</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
