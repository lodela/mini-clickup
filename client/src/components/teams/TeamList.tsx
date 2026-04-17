import { Button } from "@/components/ui";
import { TeamCard } from "./TeamCard";
import { Team } from "@/hooks/useTeams";
import { Plus, RefreshCw, AlertCircle, Inbox, Mail } from "lucide-react";

/**
 * Team List Props
 */
interface TeamListProps {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreateTeam: () => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onView: (team: Team) => void;
  onInvite?: (team: Team) => void;
  onManageMembers?: (team: Team) => void;
}

/**
 * Team List Component
 *
 * Displays a grid of team cards with loading and error states
 */
export function TeamList({
  teams,
  isLoading,
  error,
  onRefresh,
  onCreateTeam,
  onEdit,
  onDelete,
  onView,
  onInvite,
  onManageMembers: _onManageMembers,
}: TeamListProps) {
  /**
   * Loading state
   */
  if (isLoading && teams.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 rounded-lg bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Failed to load teams
        </h3>
        <p className="text-neutral-500 mb-4">{error}</p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Button
            variant="accent"
            onClick={onCreateTeam}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Team
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              onInvite?.({
                _id: "",
                name: "",
                owner: "",
                members: [],
                createdAt: "",
                updatedAt: "",
              } as Team)
            }
            leftIcon={<Mail className="w-4 h-4" />}
            disabled={teams.length === 0}
          >
            Invite Members
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Empty state
   */
  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          No teams yet
        </h3>
        <p className="text-neutral-500 mb-4">
          Create your first team to get started
        </p>
        <Button
          variant="accent"
          onClick={onCreateTeam}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Team
        </Button>
        {teams.length > 0 && (
          <Button
            variant="outline"
            onClick={() => onInvite?.(teams[0])}
            leftIcon={<Mail className="w-4 h-4" />}
          >
            Invite Members
          </Button>
        )}
      </div>
    );
  }

  /**
   * Team grid
   */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team._id}
          team={team}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}

export default TeamList;
