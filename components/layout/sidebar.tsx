import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <span className="text-sm font-bold text-primary">MH</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Manuel Heider</p>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
