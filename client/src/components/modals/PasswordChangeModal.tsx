import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateFunnyPassword } from "@/utils/passwordGenerator";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { toast } from "sonner";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordChangeRequired: boolean;
  remainingLogins: number;
}

export function PasswordChangeModal({
  isOpen,
  onClose,
  passwordChangeRequired,
  remainingLogins,
}: PasswordChangeModalProps) {
  const { updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validation = {
    minLength: password.length >= 10,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!#$%&_\-?*@]/.test(password),
  };

  const isFormValid = Object.values(validation).every(Boolean) && password === confirmPassword;

  const handleGeneratePassword = (checked: boolean) => {
    if (checked) {
      const funny = generateFunnyPassword();
      setPassword(funny);
      setConfirmPassword(funny);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      await api.patch("/auth/change-password", { newPassword: password });
      toast.success("Password changed successfully!");
      updateUser({ passwordChangeRequired: false });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !passwordChangeRequired) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl ring-1 ring-white/20 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Security Update
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Your account requires a password update to maintain security standards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert variant="destructive" className="bg-red-50/50 border-red-200 text-red-700 rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              You have {remainingLogins} more attempt{remainingLogins !== 1 ? "s" : ""} to log in before your account is locked for security.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-11 rounded-xl border-slate-200 focus:ring-indigo-500"
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500"
                placeholder="Repeat your password"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <Checkbox
                id="suggest"
                onCheckedChange={(checked) => handleGeneratePassword(!!checked)}
              />
              <Label htmlFor="suggest" className="text-sm font-medium text-slate-600 cursor-pointer">
                Sugerencias (Funny Password Generator)
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 px-1">
            <ValidationItem label="Min 10 characters" met={validation.minLength} />
            <ValidationItem label="Uppercase letter" met={validation.hasUpper} />
            <ValidationItem label="Number" met={validation.hasNumber} />
            <ValidationItem label="Special character" met={validation.hasSpecial} />
          </div>
        </div>

        <DialogFooter className="sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full sm:w-auto h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-200"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ValidationItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium transition-all">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
      )}
      <span className={met ? "text-slate-700" : "text-slate-400"}>{label}</span>
    </div>
  );
}
