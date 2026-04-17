import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { useTeams, type Team } from "@/hooks/useTeams";
import { X } from "lucide-react";

/**
 * Create Team Modal Props
 */
interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (team: Team) => void;
}

/**
 * Create Team Modal Component
 *
 * Modal dialog for creating a new team
 */
export function CreateTeamModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTeam } = useTeams();

  /**
   * Reset form when modal closes
   */
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setErrors({});
    }
  }, [isOpen]);

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
      const newTeam = await createTeam({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Team created successfully!");
      onSuccess(newTeam);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create team");
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
        className="relative w-full max-w-md glass rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-neutral-900"
          >
            Create New Team
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Team Name */}
          <Input
            type="text"
            label="Team Name"
            placeholder="Enter team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            errorMessage={errors.name}
            required
            autoFocus
            autoComplete="off"
          />

          {/* Description */}
          <Input
            type="text"
            label="Description (optional)"
            placeholder="Brief description of your team"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Describe what your team does"
            autoComplete="off"
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamModal;
