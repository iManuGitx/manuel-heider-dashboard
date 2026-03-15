export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle gradient orbs like the original website */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[rgba(124,58,237,0.08)] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[rgba(6,182,212,0.06)] blur-[100px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
