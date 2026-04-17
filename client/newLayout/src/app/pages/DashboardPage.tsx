/**
 * DashboardPage - Container/Page component
 * 
 * This is a placeholder page to demonstrate the protected layout.
 * In a real application, this would fetch data and render dashboard organisms.
 */

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard. This is a placeholder page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]"
          >
            <div className="h-20 bg-accent rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-accent rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
