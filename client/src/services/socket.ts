import { io, Socket } from 'socket.io-client';

/**
 * Socket.IO server URL from environment
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Socket.IO event types
 */
export interface SocketEvents {
  // Client -> Server
  'join-team': (teamId: string) => void;
  'join-project': (projectId: string) => void;
  'chat-message': (data: ChatMessageData) => void;
  'task-update': (data: TaskUpdateData) => void;

  // Server -> Client
  'chat-message-received': (data: ChatMessageData) => void;
  'task-updated': (data: TaskUpdateData) => void;
}

/**
 * Chat Message Data
 */
export interface ChatMessageData {
  teamId: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type?: 'text' | 'file' | 'system';
}

/**
 * Task Update Data
 */
export interface TaskUpdateData {
  projectId: string;
  taskId: string;
  action: 'created' | 'updated' | 'deleted';
  data?: any;
  userId: string;
  userName: string;
  timestamp: string;
}

/**
 * Socket.IO service class
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to Socket.IO server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Join team room
   */
  joinTeam(teamId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-team', teamId);
      console.log(`Joined team room: ${teamId}`);
    }
  }

  /**
   * Join project room
   */
  joinProject(projectId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-project', projectId);
      console.log(`Joined project room: ${projectId}`);
    }
  }

  /**
   * Send chat message
   */
  sendChatMessage(data: ChatMessageData): void {
    if (this.socket?.connected) {
      this.socket.emit('chat-message', data);
    }
  }

  /**
   * Send task update
   */
  sendTaskUpdate(data: TaskUpdateData): void {
    if (this.socket?.connected) {
      this.socket.emit('task-update', data);
    }
  }

  /**
   * Listen to chat message events
   */
  onChatMessage(callback: (data: ChatMessageData) => void): () => void {
    if (this.socket) {
      this.socket.on('chat-message-received', callback);
      return () => {
        this.socket?.off('chat-message-received', callback);
      };
    }
    return () => {};
  }

  /**
   * Listen to task update events
   */
  onTaskUpdate(callback: (data: TaskUpdateData) => void): () => void {
    if (this.socket) {
      this.socket.on('task-updated', callback);
      return () => {
        this.socket?.off('task-updated', callback);
      };
    }
    return () => {};
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
