import { Check } from "lucide-react";

/**
 * Available color options
 */
export const COLOR_OPTIONS = [
  { value: "navy", hex: "#0f172a", label: "Navy" },
  { value: "electric-blue", hex: "#3b82f6", label: "Electric Blue" },
  { value: "success", hex: "#10b981", label: "Success" },
  { value: "warning", hex: "#f59e0b", label: "Warning" },
  { value: "destructive", hex: "#ef4444", label: "Destructive" },
  { value: "purple", hex: "#8b5cf6", label: "Purple" },
];

/**
 * Color Picker Props
 */
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

/**
 * Color Picker Component
 *
 * Allows users to select a color from preset options
 */
export function ColorPicker({
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {COLOR_OPTIONS.map((color) => {
        const isSelected = value === color.value;

        return (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            disabled={disabled}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}
              ${
                isSelected
                  ? "border-electric-blue shadow-lg scale-110"
                  : "border-neutral-300 hover:border-neutral-400"
              }
            `}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.label} color`}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  className="w-5 h-5 text-white drop-shadow-lg"
                  strokeWidth={3}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ColorPicker;
