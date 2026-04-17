import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { MessageSquare } from "lucide-react";

/**
 * Chat Page Component (Stub)
 */
export default function ChatPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Chat</h1>
        <p className="text-neutral-500 mt-1">Real-time team communication</p>
      </div>

      <Card glass className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Team Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Chat Coming Soon
              </h3>
              <p className="text-neutral-500 mt-2">
                Real-time chat functionality will be available in Sprint 4
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
