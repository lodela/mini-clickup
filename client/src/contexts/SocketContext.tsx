import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Socket Connection State
 */
type SocketState = "disconnected" | "connecting" | "connected" | "error";

/**
 * Socket Context State
 */
interface SocketContextType {
  socket: Socket | null;
  state: SocketState;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinTeam: (teamId: string) => void;
  joinProject: (projectId: string) => void;
  sendChatMessage: (data: ChatMessageData) => void;
  sendTaskUpdate: (data: TaskUpdateData) => void;
  onChatMessage: (callback: (data: any) => void) => void;
  onTaskUpdate: (callback: (data: any) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

/**
 * Chat Message Data
 */
interface ChatMessageData {
  teamId: string;
  content: string;
  type?: "text" | "file" | "system";
}

/**
 * Task Update Data
 */
interface TaskUpdateData {
  projectId: string;
  taskId: string;
  action: "created" | "updated" | "deleted";
  data?: any;
}

/**
 * Socket Context
 */
const SocketContext = createContext<SocketContextType | undefined>(undefined);

/**
 * Socket Provider Props
 */
interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Socket Provider Component
 *
 * Provides Socket.IO connection and event handlers to the application.
 * Manages real-time connections for teams, projects, and chat.
 */
export function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<SocketState>("disconnected");
  const socketRef = useRef<Socket | null>(null);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  /**
   * Connect to Socket.IO server
   */
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setState("connecting");

    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected:", newSocket.id);
      setState("connected");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO disconnected:", reason);
      setState("disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error);
      setState("error");
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_URL]);

  /**
   * Disconnect from Socket.IO server
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setState("disconnected");
    }
  }, []);

  /**
   * Join team room
   */
  const joinTeam = useCallback(
    (teamId: string) => {
      if (socket?.connected) {
        socket.emit("join-team", teamId);
        console.log(`Joined team room: ${teamId}`);
      }
    },
    [socket],
  );

  /**
   * Join project room
   */
  const joinProject = useCallback(
    (projectId: string) => {
      if (socket?.connected) {
        socket.emit("join-project", projectId);
        console.log(`Joined project room: ${projectId}`);
      }
    },
    [socket],
  );

  /**
   * Send chat message
   */
  const sendChatMessage = useCallback(
    (data: ChatMessageData) => {
      if (socket?.connected) {
        socket.emit("chat-message", data);
        console.log("Chat message sent:", data);
      }
    },
    [socket],
  );

  /**
   * Send task update
   */
  const sendTaskUpdate = useCallback(
    (data: TaskUpdateData) => {
      if (socket?.connected) {
        socket.emit("task-update", data);
        console.log("Task update sent:", data);
      }
    },
    [socket],
  );

  /**
   * Listen to chat message events
   */
  const onChatMessage = useCallback(
    (callback: (data: any) => void) => {
      if (socket) {
        socket.on("chat-message-received", callback);
        return () => {
          socket.off("chat-message-received", callback);
        };
      }
    },
    [socket],
  );

  /**
   * Listen to task update events
   */
  const onTaskUpdate = useCallback(
    (callback: (data: any) => void) => {
      if (socket) {
        socket.on("task-updated", callback);
        return () => {
          socket.off("task-updated", callback);
        };
      }
    },
    [socket],
  );

  /**
   * Remove event listener
   */
  const removeListener = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket],
  );

  /**
   * Connect when authenticated, disconnect when logged out
   */
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value: SocketContextType = {
    socket,
    state,
    isConnected: state === "connected",
    connect,
    disconnect,
    joinTeam,
    joinProject,
    sendChatMessage,
    sendTaskUpdate,
    onChatMessage,
    onTaskUpdate,
    removeListener,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

/**
 * Hook to use socket context
 *
 * @returns Socket context with connection state and methods
 * @throws Error if used outside SocketProvider
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export default SocketContext;
