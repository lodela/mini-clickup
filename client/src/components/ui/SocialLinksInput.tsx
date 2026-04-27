import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SOCIAL_NETWORKS = [
  { key: "linkedin",  label: "LinkedIn",   placeholder: "https://linkedin.com/company/..." },
  { key: "facebook",  label: "Facebook",   placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram",  placeholder: "https://instagram.com/..." },
  { key: "x",         label: "X / Twitter",placeholder: "https://x.com/..." },
  { key: "youtube",   label: "YouTube",    placeholder: "https://youtube.com/@..." },
  { key: "tiktok",    label: "TikTok",     placeholder: "https://tiktok.com/@..." },
  { key: "whatsapp",  label: "WhatsApp Business", placeholder: "https://wa.me/521..." },
] as const;

type SocialKey = (typeof SOCIAL_NETWORKS)[number]["key"];

interface SocialLinksInputProps {
  value: Partial<Record<SocialKey, string>>;
  onChange: (value: Partial<Record<SocialKey, string>>) => void;
  disabled?: boolean;
}

/**
 * Inputs for 7 social networks (all optional).
 */
export function SocialLinksInput({ value, onChange, disabled = false }: SocialLinksInputProps) {
  const handleChange = (key: SocialKey, url: string) => {
    onChange({ ...value, [key]: url || undefined });
  };

  return (
    <div className="space-y-3">
      {SOCIAL_NETWORKS.map(({ key, label, placeholder }) => (
        <div key={key} className="grid grid-cols-3 items-center gap-3">
          <Label className="text-right text-sm">{label}</Label>
          <Input
            className="col-span-2"
            type="url"
            placeholder={placeholder}
            value={value[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}
