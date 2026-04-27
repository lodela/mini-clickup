import { memo, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Team } from "@/hooks/useTeams";
import {
  MoreVertical,
  Edit,
  Trash2,
  Users,
  FolderKanban,
  Mail,
} from "lucide-react";

/**
 * Team Card Props
 */
interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onView: (team: Team) => void;
  onInvite?: (team: Team) => void;
  onManageMembers?: (team: Team) => void;
}

/**
 * Team Card Component
 *
 * Displays team information with action buttons
 */
export const TeamCard = memo(function TeamCard({
  team,
  onEdit,
  onDelete,
  onView,
  onInvite,
  onManageMembers,
}: TeamCardProps) {
  /**
   * Generate initials from team name
   */
  const initials = useMemo(() => {
    return team.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [team.name]);

  /**
   * Get member count
   */
  const memberCount = useMemo(() => {
    return team.members?.length || 0;
  }, [team.members]);

  /**
   * Get project count (placeholder)
   */
  const projectCount = useMemo(() => {
    return team.projects?.length || 0;
  }, [team.projects]);

  /**
   * Handle action menu
   */
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative">
      <Card
        className="glass hover:shadow-lg transition-all duration-200"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-navy text-white flex items-center justify-center font-bold text-lg shadow-md">
              {initials}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-neutral-500" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 glass rounded-lg shadow-lg border border-neutral-200 z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        onManageMembers?.(team);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Manage Members
                    </button>
                    <button
                      onClick={() => {
                        onInvite?.(team);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors border-t border-neutral-200"
                    >
                      <Mail className="w-4 h-4" />
                      Invite Members
                    </button>
                    <button
                      onClick={() => {
                        onEdit(team);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors border-t border-neutral-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Team
                    </button>
                    <button
                      onClick={() => {
                        onDelete(team);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-neutral-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Team
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <CardTitle className="text-lg font-semibold text-neutral-900">
              {team.name}
            </CardTitle>
            {team.description && (
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                {team.description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-600">
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-600">
                {projectCount} {projectCount === 1 ? "project" : "projects"}
              </span>
            </div>
          </div>

          {/* Member Avatars (placeholder) */}
          {memberCount > 0 && (
            <div className="flex -space-x-2 mt-4">
              {team.members.slice(0, 4).map((member, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                  title={
                    typeof member.user === "string"
                      ? member.user
                      : member.user.name
                  }
                >
                  {typeof member.user === "string"
                    ? member.user.charAt(0).toUpperCase()
                    : member.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {memberCount > 4 && (
                <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-500">
                  +{memberCount - 4}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(team)}
              className="flex-1"
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onManageMembers?.(team)}
              aria-label="Manage members"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onInvite?.(team)}
              aria-label="Invite members"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default TeamCard;
