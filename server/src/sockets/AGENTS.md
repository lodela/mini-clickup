# Server Sockets Guidelines

## Overview

Socket.IO real-time communication handlers and middleware.

## Structure

```
server/src/sockets/
├── index.ts            # Socket server creation and utilities
├── middleware.ts       # Authentication and authorization middleware
├── handlers.ts         # Event handlers for all socket events
└── AGENTS.md           # This file
```

## Where to Look

| Task                      | File           |
| ------------------------- | -------------- |
| Create socket server      | `index.ts`     |
| Authentication middleware | `middleware.ts`|
| Event handlers            | `handlers.ts`  |
| Broadcast helpers         | `index.ts`     |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT CONNECTION                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Socket.IO Middleware Layer                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Authentication (JWT validation)                  │ │
│  │  - Validate token from cookie/auth object         │ │
│  │  - Attach user to socket.data.user                │ │
│  │  - Reject if invalid/expired                      │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 Event Handlers Layer                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Room Management:                                  │ │
│  │  - join-team, join-project                        │ │
│  │  - leave-team, leave-project                      │ │
│  │                                                    │ │
│  │  Real-time Events:                                 │ │
│  │  - chat-message                                   │ │
│  │  - task-update, task-status-change                │ │
│  │  - task-assign                                    │ │
│  │  - typing-start, typing-stop                      │ │
│  │  - set-online, set-offline                        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Usage in Express Server

```typescript
// server/src/index.ts
import { createServer } from "http";
import { createSocketServer } from "./sockets/index.js";

// Create HTTP server
const httpServer = createServer(app);

// Create and attach Socket.IO server
const io = createSocketServer(httpServer);

// Make io available to routes
app.set("io", io);

// Start server
httpServer.listen(PORT, () => {
  console.log("Server running");
});
```

## Usage in Controllers

```typescript
// Emit event from controller
export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.create(req.body);
    
    // Get io instance from app
    const io = req.app.get("io");
    
    // Emit to project room
    emitTaskCreated(io, task.project, task, req.user.userId);
    
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}
```

## Room Strategy

```typescript
// Room naming convention
`team:${teamId}`      // All members of a team
`project:${projectId}` // All members of a project
`user:${userId}`       // Specific user (requires mapping)

// Join rooms
socket.on("join-team", (teamId) => {
  socket.join(`team:${teamId}`);
});

socket.on("join-project", (projectId) => {
  socket.join(`project:${projectId}`);
});

// Broadcast to rooms
io.to(`team:${teamId}`).emit("event", data);
io.to(`project:${projectId}`).emit("event", data);
```

## Authentication Flow

```typescript
// 1. Client connects with token
const socket = io("http://localhost:5000", {
  auth: { token: accessToken },
  withCredentials: true, // Send cookies
});

// 2. Middleware validates token
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.request.cookies.accessToken;
  const payload = tokenService.verifyAccessToken(token);
  socket.data.user = payload;
  next();
});

// 3. Handlers can access user
socket.on("chat-message", (data) => {
  const user = socket.data.user; // { userId, email, role }
  // Handle message with authenticated user
});
```

## Event Catalog

### Room Management
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join-team` | Client → Server | `{ teamId: string }` | Join team room |
| `join-project` | Client → Server | `{ projectId: string }` | Join project room |
| `leave-team` | Client → Server | `{ teamId: string }` | Leave team room |
| `leave-project` | Client → Server | `{ projectId: string }` | Leave project room |
| `team-joined` | Server → Client | `{ teamId: string }` | Confirmation |
| `project-joined` | Server → Client | `{ projectId: string }` | Confirmation |

### Chat
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat-message` | Client → Server | `{ teamId, content, type? }` | Send message |
| `chat-message-received` | Server → Client | `{ teamId, content, userId, email, timestamp }` | Receive message |
| `typing-start` | Client → Server | `{ teamId }` | Start typing |
| `user-typing` | Server → Client | `{ userId, email, timestamp }` | User typing indicator |
| `typing-stop` | Client → Server | `{ teamId }` | Stop typing |
| `user-stop-typing` | Server → Client | `{ userId }` | Stop typing indicator |

### Tasks
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `task-update` | Client → Server | `{ projectId, taskId, action }` | Task updated |
| `task-updated` | Server → Client | `{ projectId, taskId, userId, timestamp }` | Broadcast update |
| `task-status-change` | Client → Server | `{ projectId, taskId, oldStatus, newStatus }` | Status changed |
| `task-status-changed` | Server → Client | `{ projectId, taskId, oldStatus, newStatus, userId }` | Broadcast status |
| `task-assign` | Client → Server | `{ projectId, taskId, assigneeId }` | Assign task |
| `task-assigned` | Server → Client | `{ projectId, taskId, assigneeId, assignedBy }` | Broadcast assignment |

### Presence
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `set-online` | Client → Server | `{ teamId? }` | Set user online |
| `user-online` | Server → Client | `{ userId, email, socketId }` | User online broadcast |
| `set-offline` | Client → Server | `{ teamId? }` | Set user offline |
| `user-offline` | Server → Client | `{ userId, email }` | User offline broadcast |
| `user-disconnected` | Server → Client | `{ userId, socketId }` | Connection lost |

## Conventions

### Event Naming
```typescript
// ✅ Use kebab-case for event names
socket.on("task-status-change", handler);
socket.emit("chat-message-received", data);

// ❌ Don't use camelCase
socket.on("taskStatusChange", handler);
```

### Payload Structure
```typescript
// ✅ Include metadata
{
  teamId: string,
  userId: string,
  timestamp: string,  // ISO 8601
  data: unknown
}

// ❌ Don't send bare data
socket.emit("event", "just a string");
```

### Error Handling
```typescript
// ✅ Handle authentication in handlers
socket.on("chat-message", (data) => {
  if (!socket.data.user) {
    socket.emit("error", { message: "Authentication required" });
    return;
  }
  // Handle message
});

// ❌ Assume user is authenticated
socket.on("chat-message", (data) => {
  const userId = socket.data.user.userId; // May be undefined!
});
```

## Anti-Patterns

```typescript
// ❌ Business logic in socket handlers
socket.on("task-update", async (data) => {
  // Direct database access (BAD)
  await Task.findByIdAndUpdate(data.taskId, data.updates);
});

// ✅ Delegate to service layer
socket.on("task-update", async (data) => {
  // Service handles business logic
  const task = await taskService.update(data.taskId, data.updates);
  broadcastToProject(io, data.projectId, "task-updated", task);
});

// ❌ No error handling
socket.on("chat-message", (data) => {
  io.to(`team:${data.teamId}`).emit("chat-message-received", data);
});

// ✅ Proper error handling
socket.on("chat-message", (data) => {
  try {
    if (!socket.data.user) {
      socket.emit("error", { message: "Authentication required" });
      return;
    }
    broadcastToTeam(io, data.teamId, "chat-message-received", {
      ...data,
      userId: socket.data.user.userId,
    });
  } catch (error) {
    console.error("Chat message error:", error);
    socket.emit("error", { message: "Failed to send message" });
  }
});
```

## Testing

```typescript
import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";

describe("Socket.IO Handlers", () => {
  let httpServer: ReturnType<typeof createServer>;
  let io: Server;
  let clientSocket: ClientSocket;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    
    setupSocketHandlers(io);
    
    httpServer.listen(() => {
      clientSocket = new Client(`http://localhost:${httpServer.address().port}`);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it("should join team room", (done) => {
    clientSocket.emit("join-team", { teamId: "123" });
    
    clientSocket.on("team-joined", (data) => {
      expect(data.teamId).toBe("123");
      done();
    });
  });
});
```

## TODO: Implement

- [ ] User-to-socket mapping for direct messaging
- [ ] Room persistence on server restart
- [ ] Message queue for offline users
- [ ] Rate limiting per socket
- [ ] Connection throttling
- [ ] Socket event logging

## Notes

- Socket.IO automatically handles reconnection
- Rooms are cleaned up when sockets disconnect
- Use `socket.data` for storing user context (not `socket.user`)
- Always validate payloads even from authenticated users
- Use `broadcastToTeam` and `broadcastToProject` helpers for consistency
- Include timestamps in all events for client-side ordering
