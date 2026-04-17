/**
 * UserAvatar Atom Component
 * 
 * Displays user avatar image or initials fallback.
 * Pure presentational component.
 * 
 * @param src - Image URL
 * @param name - User's name (for fallback initials)
 * @param size - Avatar size in pixels
 */

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: number;
}

export function UserAvatar({ src, name, size = 30 }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div 
      className="rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-foreground"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold">{getInitials(name)}</span>
      )}
    </div>
  );
}
