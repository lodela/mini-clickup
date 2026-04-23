/**
 * ProtectedLayoutTemplate Component
 *
 * Main layout template for authenticated users.
 * Fixed sidebar (toggleable) + Fixed header + Flexible main content area.
 *
 * @param children - Main content area (page content)
 * @param sidebar - Sidebar organism component
 * @param header - Header organism component
 * @param isSidebarOpen - Whether the sidebar is currently visible
 */

interface ProtectedLayoutTemplateProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  isSidebarOpen: boolean;
}

const SIDEBAR_WIDTH = 260;

export function ProtectedLayoutTemplate({
  children,
  sidebar,
  header,
  isSidebarOpen,
}: ProtectedLayoutTemplateProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      {/* Sidebar — slides in/out */}
      <div
        className="fixed left-0 top-0 bottom-0 z-20 p-5 transition-transform duration-300 ease-in-out"
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
        }}
      >
        {sidebar}
      </div>

      {/* Main Content Area — shifts right when sidebar is open */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0' }}
      >
        {/* Header — full-width when sidebar closed */}
        <div
          className="fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out"
          style={{ left: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0' }}
        >
          {header}
        </div>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto pt-[64px] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
