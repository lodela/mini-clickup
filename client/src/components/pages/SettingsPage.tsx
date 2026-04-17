import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Settings } from "lucide-react";

/**
 * Settings Page Component (Stub)
 */
export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your account settings</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-4">
                Profile
              </h3>
              <p className="text-sm text-neutral-500">
                Profile management will be available soon
              </p>
            </div>
            <div className="border-t border-neutral-200" />
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-4">
                Notifications
              </h3>
              <p className="text-sm text-neutral-500">
                Notification preferences coming soon
              </p>
            </div>
            <div className="border-t border-neutral-200" />
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-4">
                Security
              </h3>
              <p className="text-sm text-neutral-500">
                Password and security settings coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
