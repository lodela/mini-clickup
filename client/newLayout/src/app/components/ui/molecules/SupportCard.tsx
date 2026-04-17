/**
 * SupportCard Molecule Component
 *
 * A promotional card for support with illustration and CTA button.
 * Pure presentational component.
 *
 * @param onSupportClick - Callback when support button is clicked
 * @param buttonLabel - Label for the support button
 */

import { Headphones } from "lucide-react";
import { Button } from "../atoms/Button";

interface SupportCardProps {
  onSupportClick?: () => void;
  buttonLabel: string;
}

export function SupportCard({
  onSupportClick,
  buttonLabel,
}: SupportCardProps) {
  return (
    <div className="relative mx-4 p-6 bg-[#3f8cff]/10 rounded-[24px] overflow-hidden">
      {/* Illustration placeholder - can be replaced with actual SVG */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-24 flex items-center justify-center">
          {/* Simple illustration placeholder */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-[#B0D4FF] rounded-full opacity-50" />
            <div className="absolute inset-2 bg-[#3f8cff] rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="default"
        onClick={onSupportClick}
        className="w-full"
      >
        <Headphones className="w-5 h-5" />
        {buttonLabel}
      </Button>
    </div>
  );
}