// app/investor/layout.tsx
import Sidebar from "@/components/investor/Sidebar";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Use the viewport height and kill body scrolling for this area
    <div className="bg-neutral-50">
      <div className="mx-auto h-dvh w-full">
        {/* One scroll container for the route; children won't create a second scrollbar */}
        <div className="flex h-full gap-6 overflow-hidden">
          <Sidebar />
          {/* Only MAIN scrolls */}
          <main className="flex-1 h-full max-w-7xl px-6 lg:px-8 overflow-y-auto">
            <div className="py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
