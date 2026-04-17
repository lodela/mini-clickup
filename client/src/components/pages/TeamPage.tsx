import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTeams, type Team } from "@/hooks/useTeams";
import { TeamList } from "@/components/teams/TeamList";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { InviteMemberModal } from "@/components/teams/InviteMemberModal";
import { EditTeamModal } from "@/components/teams/EditTeamModal";
import { MemberManagementModal } from "@/components/teams/MemberManagementModal";
import { DeleteTeamConfirm } from "@/components/teams/DeleteTeamConfirm";
import { Button } from "@/components/ui";
import { Plus, Search } from "lucide-react";

/**
 * Team Page Component
 *
 * Main team management page with list and create functionality
 */
export default function TeamPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { teams, isLoading, error, refreshTeams, deleteTeam } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Redirect if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Fetch teams on mount
   */
  useEffect(() => {
    refreshTeams();
  }, []);

  /**
   * Handle create team success
   */
  const handleCreateSuccess = async () => {
    await refreshTeams();
  };

  /**
   * Handle edit team
   */
  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  /**
   * Handle edit success
   */
  const handleEditSuccess = async (_updatedTeam: Team) => {
    await refreshTeams();
    setIsEditModalOpen(false);
    setSelectedTeam(null);
  };

  /**
   * Handle manage members
   */
  const handleManageMembers = (team: Team) => {
    setSelectedTeam(team);
    setIsMembersModalOpen(true);
  };

  /**
   * Handle members success
   */
  const handleMembersSuccess = async () => {
    await refreshTeams();
    setIsMembersModalOpen(false);
    setSelectedTeam(null);
  };

  /**
   * Handle delete team request
   */
  const handleDeleteRequest = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * Handle delete confirm
   */
  const handleDeleteConfirm = async () => {
    if (!selectedTeam) return;

    await deleteTeam(selectedTeam._id);
    setIsDeleteConfirmOpen(false);
    setSelectedTeam(null);
  };

  /**
   * Handle invite members
   */
  const handleInvite = (team: Team) => {
    setSelectedTeam(team);
    setIsInviteModalOpen(true);
  };

  /**
   * Handle invite success
   */
  const handleInviteSuccess = async () => {
    await refreshTeams();
    setIsInviteModalOpen(false);
    setSelectedTeam(null);
    toast.success("Members invited successfully!");
  };

  /**
   * Handle view team (placeholder)
   */
  const handleView = (team: Team) => {
    toast.info(`View team: ${team.name} (Coming soon)`);
  };

  /**
   * Filter teams by search query
   */
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Teams</h1>
          <p className="text-neutral-500 mt-1">
            Manage your teams and collaborate with your members
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Team List */}
      <TeamList
        teams={filteredTeams}
        isLoading={isLoading}
        error={error}
        onRefresh={refreshTeams}
        onCreateTeam={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onView={handleView}
        onInvite={handleInvite}
        onManageMembers={handleManageMembers}
      />

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Invite Member Modal */}
      {selectedTeam && (
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedTeam(null);
          }}
          teamId={selectedTeam._id}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Edit Team Modal */}
      {selectedTeam && (
        <EditTeamModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Member Management Modal */}
      {selectedTeam && (
        <MemberManagementModal
          isOpen={isMembersModalOpen}
          onClose={() => {
            setIsMembersModalOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
          onSuccess={handleMembersSuccess}
        />
      )}

      {/* Delete Team Confirm */}
      {selectedTeam && (
        <DeleteTeamConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false);
            setSelectedTeam(null);
          }}
          teamName={selectedTeam.name}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
