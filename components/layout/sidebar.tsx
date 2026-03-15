import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/ui/logo";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <Logo size={24} />
        <div>
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}>
            Manuel Heider
          </p>
          <p className="section-label text-[0.6rem]! opacity-60!">Dashboard</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
