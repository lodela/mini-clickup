/**
 * ProtectedLayoutTemplate Component
 * 
 * Main layout template for authenticated users.
 * Fixed header + Fixed sidebar + Flexible main content area.
 * 
 * This template defines the structure but receives all UI components as props.
 * No business logic, no data fetching.
 * 
 * @param children - Main content area (page content)
 * @param sidebar - Sidebar organism component
 * @param header - Header organism component
 */

interface ProtectedLayoutTemplateProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export function ProtectedLayoutTemplate({
  children,
  sidebar,
  header,
}: ProtectedLayoutTemplateProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      {/* Sidebar - Fixed */}
      <div className="fixed left-0 top-0 bottom-0 z-20 p-5">
        {sidebar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[260px]">
        {/* Header - Fixed */}
        <div className="fixed top-0 right-0 left-[260px] z-10">
          {header}
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto pt-[64px] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
