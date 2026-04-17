import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { EmailInput } from "./EmailInput";
import { useTeams } from "@/hooks/useTeams";
import { X, Users, Shield, User, UserPlus } from "lucide-react";
import { validateEmails } from "@/utils/email";

/**
 * Role Option Type
 */
type MemberRole = "admin" | "member" | "guest";

/**
 * Invite Member Modal Props
 */
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onSuccess: () => void;
}

/**
 * Role Option Interface
 */
interface RoleOption {
  value: MemberRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Role options configuration
 */
const roleOptions: RoleOption[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Can manage team members and settings",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    value: "member",
    label: "Member",
    description: "Can view and create tasks",
    icon: <User className="w-4 h-4" />,
  },
  {
    value: "guest",
    label: "Guest",
    description: "Limited access, view-only",
    icon: <UserPlus className="w-4 h-4" />,
  },
];

/**
 * Invite Member Modal Component
 *
 * Modal dialog for inviting multiple members to a team
 */
export function InviteMemberModal({
  isOpen,
  onClose,
  teamId,
  onSuccess,
}: InviteMemberModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<MemberRole>("member");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inviteMembers } = useTeams();

  /**
   * Reset form when modal closes
   */
  useEffect(() => {
    if (!isOpen) {
      setEmails([]);
      setRole("member");
      setErrors({});
    }
  }, [isOpen]);

  /**
   * Validate form fields
   */
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (emails.length === 0) {
      newErrors.emails = "At least one email is required";
    } else {
      const { invalid, duplicates } = validateEmails(emails);

      if (invalid.length > 0) {
        newErrors.emails = `${invalid.length} invalid email format${invalid.length > 1 ? "s" : ""}`;
      } else if (duplicates.length > 0) {
        newErrors.emails = `${duplicates.length} duplicate email${duplicates.length > 1 ? "s" : ""}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [emails]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await inviteMembers(teamId, emails, role);

      toast.success(
        `Invitation${emails.length > 1 ? "s" : ""} sent to ${emails.length} member${emails.length > 1 ? "s" : ""}!`,
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitations");
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
              Invite Members
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Add new members to your team
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
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Addresses
            </label>
            <EmailInput
              value={emails}
              onChange={setEmails}
              error={!!errors.emails}
              errorMessage={errors.emails}
              placeholder="Enter team member emails"
              disabled={isSubmitting}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Role
            </label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${
                      role === option.value
                        ? "border-electric-blue bg-electric-blue/5 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="mt-0.5 w-4 h-4 text-electric-blue border-neutral-300 focus:ring-electric-blue"
                    disabled={isSubmitting}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${role === option.value ? "text-electric-blue" : "text-neutral-900"}`}
                      >
                        {option.label}
                      </span>
                      <span className="text-neutral-400">{option.icon}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          {emails.length > 0 && (
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Users className="w-4 h-4" />
                <span>
                  Inviting{" "}
                  <strong className="text-neutral-900">{emails.length}</strong>{" "}
                  member{emails.length > 1 ? "s" : ""} as{" "}
                  <strong className="text-neutral-900">{role}</strong>
                </span>
              </div>
            </div>
          )}

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
              disabled={isSubmitting || emails.length === 0}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              {isSubmitting
                ? "Sending..."
                : `Send ${emails.length > 1 ? "Invitations" : "Invitation"}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteMemberModal;
