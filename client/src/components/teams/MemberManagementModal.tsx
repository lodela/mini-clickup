import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { useTeams, type Team, type TeamMember } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { X, Users, Shield, Trash2 } from "lucide-react";

/**
 * Member Management Modal Props
 */
interface MemberManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onSuccess: () => void;
}

/**
 * Member Management Modal Component
 *
 * Modal dialog for managing team members
 */
export function MemberManagementModal({
  isOpen,
  onClose,
  team,
  onSuccess,
}: MemberManagementModalProps) {
  const { user: currentUser } = useAuth();
  const { removeMember, updateMemberRole } = useTeams();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  /**
   * Get current user's membership
   */
  const currentMember = team.members?.find((m) =>
    typeof m.user === "string"
      ? m.user === currentUser?._id
      : m.user?._id === currentUser?._id,
  );

  /**
   * Check if current user is admin
   */
  const isAdmin = currentMember?.role === "admin";

  /**
   * Check if member is owner
   */
  const isOwner = (member: TeamMember) => {
    const ownerId =
      typeof team.owner === "string" ? team.owner : team.owner?._id;
    const memberId =
      typeof member.user === "string" ? member.user : member.user?._id;
    return ownerId === memberId;
  };

  /**
   * Remove member from team
   */
  const handleRemoveMember = async (memberId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member from the team?",
    );

    if (!confirmed) return;

    setIsRemoving(memberId);

    try {
      await removeMember(team._id, memberId);
      toast.success("Member removed successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    } finally {
      setIsRemoving(null);
    }
  };

  /**
   * Update member role
   */
  const handleUpdateRole = async (
    memberId: string,
    role: "admin" | "member" | "guest",
  ) => {
    setIsUpdating(memberId);

    try {
      await updateMemberRole(team._id, memberId, role);
      toast.success("Member role updated");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setIsUpdating(null);
    }
  };

  /**
   * Handle Escape key
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl glass rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-neutral-900"
            >
              Manage Members
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {team.name} • {team.members?.length || 0} members
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Members List */}
          <div className="space-y-3">
            {team.members && team.members.length > 0 ? (
              team.members.map((member, index) => {
                const memberUser =
                  typeof member.user === "string"
                    ? { _id: member.user, name: "Unknown" }
                    : member.user;

                const isCurrentUser = memberUser._id === currentUser?._id;
                const memberIsOwner = isOwner(member);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-electric-blue text-white flex items-center justify-center font-medium">
                        {memberUser.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900">
                            {memberUser.name || "Unknown User"}
                            {isCurrentUser && (
                              <span className="text-xs text-neutral-500 ml-1">
                                (You)
                              </span>
                            )}
                          </p>
                          {memberIsOwner && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-electric-blue/10 text-electric-blue font-medium flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Owner
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          {typeof member.user === "string"
                            ? member.user
                            : member.user?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* Role Dropdown */}
                      {isAdmin && !memberIsOwner ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleUpdateRole(
                              memberUser._id,
                              e.target.value as "admin" | "member" | "guest",
                            )
                          }
                          disabled={isUpdating === memberUser._id}
                          className="text-sm border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>
                      ) : (
                        <span className="text-sm px-2 py-1.5 rounded-md bg-neutral-100 text-neutral-600 capitalize">
                          {member.role}
                        </span>
                      )}

                      {/* Remove Button */}
                      {isAdmin && !memberIsOwner && !isCurrentUser ? (
                        <button
                          onClick={() => handleRemoveMember(memberUser._id)}
                          disabled={isRemoving === memberUser._id}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                          aria-label="Remove member"
                        >
                          {isRemoving === memberUser._id ? (
                            <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No members yet</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-neutral-400 mt-0.5" />
              <div className="text-sm text-neutral-600">
                <p className="font-medium mb-1">Role Permissions</p>
                <ul className="space-y-1">
                  <li>
                    <strong className="text-neutral-900">Admin:</strong> Can
                    manage members, edit team settings
                  </li>
                  <li>
                    <strong className="text-neutral-900">Member:</strong> Can
                    view and create tasks
                  </li>
                  <li>
                    <strong className="text-neutral-900">Guest:</strong> Limited
                    access, view-only
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MemberManagementModal;
