import { cn } from "@/components/ui/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dialog" | "elevated";
}

export function GlassCard({
  className,
  variant = "default",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-200",
        variant === "default" && "bg-white/5 rounded-xl",
        variant ===
          "dialog" &&
          "bg-[rgba(15,15,30,0.85)] backdrop-blur-2xl rounded-2xl shadow-2xl border-white/15",
        variant ===
          "elevated" &&
          "bg-white/8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:bg-white/12",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
