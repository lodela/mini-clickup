import { useState, useCallback, useRef } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  isValidEmail,
  findDuplicates,
  formatEmailForDisplay,
} from "@/utils/email";

/**
 * Email Input Props
 */
interface EmailInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Email Input Component with Chips
 *
 * Allows users to enter multiple emails separated by Enter or comma
 * Displays emails as removable chips with validation feedback
 */
export function EmailInput({
  value = [],
  onChange,
  error = false,
  errorMessage,
  placeholder = "Enter emails separated by comma or press Enter",
  disabled = false,
}: EmailInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Parse and add emails from input
   */
  const addEmails = useCallback(
    (text: string) => {
      if (!text || text.trim() === "") return;

      // Split by comma, space, or semicolon
      const newEmails = text
        .split(/[,\s;]+/)
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0);

      // Remove duplicates from existing value
      const existingEmails = new Set(value.map((e) => e.toLowerCase()));
      const uniqueNewEmails = newEmails.filter(
        (email) => !existingEmails.has(email),
      );

      if (uniqueNewEmails.length > 0) {
        onChange([...value, ...uniqueNewEmails]);
      }

      setInputValue("");
    },
    [value, onChange],
  );

  /**
   * Handle key down (Enter adds, Backspace removes last)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmails(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last email when input is empty and backspace is pressed
      onChange(value.slice(0, -1));
    }
  };

  /**
   * Handle blur (add email if valid)
   */
  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmails(inputValue);
    }
  };

  /**
   * Remove email from list
   */
  const removeEmail = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    inputRef.current?.focus();
  };

  /**
   * Get email status
   */
  const getEmailStatus = (email: string) => {
    const isValid = isValidEmail(email);
    const isDuplicate = findDuplicates(value).includes(email);

    if (!isValid) return "invalid";
    if (isDuplicate) return "duplicate";
    return "valid";
  };

  /**
   * Handle paste (parse multiple emails)
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    addEmails(pastedText);
  };

  return (
    <div className="w-full">
      {/* Input container */}
      <div
        className={`
          min-h-[42px] w-full rounded-md border bg-white px-3 py-2 text-sm
          transition-all duration-200
          focus-within:outline-none focus-within:ring-2 focus-within:ring-electric-blue focus-within:ring-offset-2
          ${error ? "border-destructive" : "border-neutral-300"}
          ${disabled ? "cursor-not-allowed opacity-50 bg-neutral-50" : ""}
        `}
      >
        {/* Chips container */}
        <div className="flex flex-wrap gap-2">
          {value.map((email, index) => {
            const status = getEmailStatus(email);
            const borderColor =
              status === "invalid"
                ? "border-destructive/50 bg-destructive/10"
                : status === "duplicate"
                  ? "border-warning/50 bg-warning/10"
                  : "border-electric-blue/50 bg-electric-blue/10";
            const textColor =
              status === "invalid"
                ? "text-destructive"
                : status === "duplicate"
                  ? "text-warning"
                  : "text-electric-blue";

            return (
              <div
                key={index}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium
                  animate-in fade-in zoom-in duration-150
                  ${borderColor}
                `}
              >
                <span className={`max-w-[200px] truncate ${textColor}`}>
                  {formatEmailForDisplay(email)}
                </span>
                {status === "invalid" && (
                  <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0" />
                )}
                {status === "valid" && (
                  <CheckCircle2 className="w-3 h-3 text-electric-blue flex-shrink-0" />
                )}
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${email}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* Input field */}
          <input
            ref={inputRef}
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPaste={handlePaste}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[200px] outline-none bg-transparent placeholder:text-neutral-400"
            aria-label="Email addresses"
          />
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <p
          className="text-sm text-destructive flex items-center gap-1 mt-1"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </p>
      )}

      {/* Helper text */}
      {!errorMessage && (
        <p className="text-xs text-neutral-500 mt-1">
          Separate emails with comma, space, or press Enter
        </p>
      )}
    </div>
  );
}

export default EmailInput;
