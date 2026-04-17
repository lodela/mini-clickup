import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { AlertTriangle, X } from "lucide-react";

/**
 * Delete Team Confirm Props
 */
interface DeleteTeamConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onConfirm: () => Promise<void>;
}

/**
 * Delete Team Confirm Component
 *
 * Confirmation dialog for deleting a team
 */
export function DeleteTeamConfirm({
  isOpen,
  onClose,
  teamName,
  onConfirm,
}: DeleteTeamConfirmProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Check if confirm text matches team name
   */
  const canDelete = confirmText === teamName;

  /**
   * Handle confirm deletion
   */
  const handleConfirm = async () => {
    if (!canDelete) return;

    setIsDeleting(true);

    try {
      await onConfirm();
      toast.success("Team deleted successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete team");
    } finally {
      setIsDeleting(false);
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

  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-neutral-900"
              >
                Delete Team
              </h2>
              <p className="text-sm text-neutral-500">
                This action cannot be undone
              </p>
            </div>
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
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="text-sm text-destructive">
                <p className="font-semibold mb-1">Warning: Permanent Action</p>
                <p>
                  Deleting <strong className="font-medium">"{teamName}"</strong>{" "}
                  will remove all associated data including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>All projects and tasks</li>
                  <li>All team members</li>
                  <li>All chat history</li>
                  <li>All attachments and files</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Type <strong className="text-destructive">"{teamName}"</strong> to
              confirm deletion:
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={teamName}
              autoFocus
              autoComplete="off"
              className={
                confirmText !== teamName && confirmText.length > 0
                  ? "border-destructive"
                  : ""
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="w-full"
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Team"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTeamConfirm;
