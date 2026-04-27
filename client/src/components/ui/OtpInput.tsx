import { useCallback } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

/**
 * 6-digit OTP input using shadcn InputOTP component.
 */
export function OtpInput({ value, onChange, length = 6, disabled = false }: OtpInputProps) {
  const handleChange = useCallback(
    (v: string) => onChange(v.replace(/\D/g, "").slice(0, length)),
    [onChange, length]
  );

  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        containerClassName="gap-3"
      >
        <InputOTPGroup>
          {Array.from({ length }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="h-12 w-12 text-xl font-semibold border-2"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
