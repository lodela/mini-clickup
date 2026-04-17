import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Bell } from "lucide-react";

export function HeaderNotifications() {
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Add a new notification
  const addNotification = useCallback(
    (_notification: { type: string; message: string }) => {
      // We don't store the notification itself, just increment unread count
      setUnreadCount((prev) => prev + 1);
    },
    [],
  );

  // Set up Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    // Handle task status changes (for QA ready notifications)
    socket.on("task:qa-ready", (_data: any) => {
      addNotification({
        type: "task-qa-ready",
        message: "Task is ready for QA review",
      });
    });

    // Handle bug creation
    socket.on("bug:created", (_data: any) => {
      addNotification({
        type: "bug-created",
        message: "A task has been rejected and converted to a bug",
      });
    });

    // Handle task approval
    socket.on("task:approved", (_data: any) => {
      addNotification({
        type: "task-approved",
        message: "Task has been approved for sprint",
      });
    });

    // Cleanup
    return () => {
      socket.off("task:qa-ready");
      socket.off("bug:created");
      socket.off("task:approved");
    };
  }, [socket, addNotification]);

  // Handle bell click to mark all notifications as read
  const handleBellClick = () => {
    // In a real app, this would open a notification dropdown
    // For now, we'll just mark all as read when clicked
    setUnreadCount(0);
  };

  return (
    <button
      className="relative p-2 hover:bg-neutral-100 rounded-lg"
      onClick={handleBellClick}
    >
      <Bell className="w-5 h-5 text-neutral-600" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
