import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { ColorPicker } from "./ColorPicker";
import { useTeams, type Team } from "@/hooks/useTeams";
import { X, Users, Shield } from "lucide-react";

/**
 * Edit Team Modal Props
 */
interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onSuccess: (team: Team) => void;
}

/**
 * Edit Team Modal Component
 *
 * Modal dialog for editing team settings
 */
export function EditTeamModal({
  isOpen,
  onClose,
  team,
  onSuccess,
}: EditTeamModalProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description || "");
  const [avatarColor, setAvatarColor] = useState("navy");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateTeam } = useTeams();

  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setName(team.name);
      setDescription(team.description || "");
      setErrors({});
    }
  }, [isOpen, team]);

  /**
   * Validate form fields
   */
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Team name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Team name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedTeam = await updateTeam(team._id, {
        name: name.trim(),
        description: description.trim() || undefined,
        avatar: avatarColor,
      });

      toast.success("Team updated successfully!");
      onSuccess(updatedTeam);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update team");
    } finally {
      setIsSubmitting(false);
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
        className="relative w-full max-w-lg glass rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200"
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
              Edit Team
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Update team information and settings
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Team Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Team Name</label>
            <Input
              type="text"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              required
              autoFocus
              autoComplete="off"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <Input
              type="text"
              placeholder="Brief description of your team"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
            <p className="text-sm text-neutral-500">Describe what your team does</p>
          </div>

          {/* Avatar Color */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Team Color
            </label>
            <ColorPicker
              value={avatarColor}
              onChange={setAvatarColor}
              disabled={isSubmitting}
            />
          </div>

          {/* Team Info */}
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Users className="w-4 h-4" />
              <span>
                <strong className="text-neutral-900">
                  {team.members?.length || 0}
                </strong>{" "}
                members
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Shield className="w-4 h-4" />
              <span>
                Owner:{" "}
                <strong className="text-neutral-900">
                  {typeof team.owner === "string"
                    ? team.owner
                    : team.owner?.name || "Unknown"}
                </strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Team"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTeamModal;
