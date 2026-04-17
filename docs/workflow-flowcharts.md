# Mini ClickUp Workflow Flowcharts

## Task Workflow State Diagram

```mermaid
stateDiagram-v2
    [*] --> Todo
    Todo --> "In Progress"
    "In Progress" --> Review
    Review --> Done
    Done --> QA
    QA --> "Approved" : Approve
    QA --> "Rejected (Bug)" : Reject
    "Approved" --> [*] : Assigned to Sprint
    "Rejected (Bug)" --> [*] : Converted to Bug

    %% Auto-transition from Done to QA
    Done --> QA : Auto-transition

    %% Allow moving backward in workflow for corrections
    "In Progress" --> Todo : Move Back
    Review --> "In Progress" : Move Back
    Done --> Review : Move Back
    QA --> Done : Move Back

    %% Allow skipping states for direct completion (if needed)
    Todo --> "In Progress" : Start Work
    "In Progress" --> Done : Skip Review
    Review --> Done : Skip QA
```

## Task Type Conversion Flow

```mermaid
flowchart TD
    A[Task Created] --> B{Task Type}
    B -->|Regular Task| C[Todo Status]
    B -->|Bug| D[Todo Status - Bug Type]

    %% Regular task workflow
    C --> E[In Progress]
    E --> F[Review]
    F --> G[Done]
    G --> H[QA Review]
    H --> I{Decision}
    I -->|Approve| J[Approved for Sprint]
    I -->|Reject| K[Convert to Bug]
    K --> L[Bug Task - Todo Status]

    %% Bug workflow (simplified)
    L --> M[In Progress - Bug]
    M --> N[Review - Bug]
    N --> O[Done - Bug]

    %% Allow re-opening bugs
    O --> P[Reopen Bug]
    P --> L
```

## Sprint Assignment Workflow

```mermaid
flowchart LR
    A[Task in QA - Pending Approval] --> B{QA Decision}
    B -->|Approve| C[Select Sprint]
    C --> D[Assign Task to Sprint]
    D --> E[Task Status: QA<br>Workflow: Approved]
    B -->|Reject| F[Specify Rejection Reason]
    F --> G[Convert Task to Bug]
    G --> H[Bug Task - Todo Status]

    %% Visual styling
    classDef decision fill:#f9f,stroke:#333;
    classDef process fill:#bbf,stroke:#333;
    class B,F decision;
    class C,D,E,G,H process;
```

## Notification Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Socket
    participant Database

    %% Task completion triggering QA notification
    User->>Client: Mark task as Done
    Client->>Server: PUT /api/tasks/{id} (status: done)
    Server->>Database: Update task status to done
    Server->>Database: Auto-transition to QA (pre-save hook)
    Server->>Socket: Emit task:qa-ready event
    Socket->>Client: Forward task:qa-ready event
    Client->>User: Show QA ready notification

    %% Bug creation notification
    User->>Client: Reject task in QA modal
    Client->>Server: POST /api/tasks/{id}/convert-to-bug
    Server->>Service: Convert task to bug
    Server->>Database: Save bug task
    Server->>Socket: Emit bug:created event
    Socket->>Client: Forward bug:created event
    Client->>User: Show bug created notification

    %% Task approval notification
    User->>Client: Approve task in QA modal
    Client->>Server: POST /api/tasks/{id}/approve-for-sprint
    Server->>Service: Approve task for sprint
    Server->>Database: Update task with sprintId and workflowState
    Server->>Socket: Emit task:approved event
    Socket->>Client: Forward task:approved event
    Client->>User: Show task approved notification

    %% Notification handling
    Client->>Client: Increment unread badge count
    User->>Client: Click notification bell
    Client->>Client: Mark all notifications as read
    Client->>Client: Reset unread count to 0
```

## Drag-and-Drop Task Reordering (Backlog)

```mermaid
flowchart TD
    A[User drags task] --> B[Frontend: Detect drag start]
    B --> C[Frontend: Show placeholder]
    C --> D[User drops task in new column]
    D --> E[Frontend: Calculate new status]
    E --> F[Frontend: Optimistically update UI]
    F --> G[Frontend: Call updateTask API]
    G --> H[Backend: Validate task exists]
    H --> I[Backend: Update task status]
    I --> J[Backend: Return updated task]
    J --> K[Frontend: Confirm update or rollback on error]

    %% Error handling
    K -->|Success| L[Show success state]
    K -->|Error| M[Revert UI change]
    M --> N[Show error message]
```

## Team Deletion Flow (Fixed)

```mermaid
flowchart LR
    A[User requests team deletion] --> B[Frontend: Show confirmation]
    B --> C[User confirms deletion]
    C --> D[Frontend: Call deleteTeam API]
    D --> E[Backend: Validate team exists]
    E --> F[Backend: Remove user references from team]
    F --> G[Backend: Delete team document]
    G --> H[Backend: Return 204 No Content]
    H --> I[Frontend: Remove team from UI]

    %% Error cases
    E -->|Team not found| J[Return 404 Not Found]
    F -->|Database error| K[Return 500 Internal Error]
    G -->|Database error| K
```

## Key Workflow Notes

1. **Automatic QA Transition**: When a task is moved to "done" status, it automatically transitions to "qa" status with workflowState "pending-approval" via Mongoose pre-save hook.

2. **Bug Conversion**: Only tasks (not bugs) can be converted to bugs. The conversion resets the task to "todo" status, changes type to "bug", and clears sprint assignment.

3. **Sprint Approval**: Only tasks in QA status with workflowState "pending-approval" can be approved for a sprint. Approval sets workflowState to "approved" and assigns sprintId.

4. **State Integrity**: The workflow prevents invalid state transitions through both backend validation and automatic hooks.

5. **Real-time Updates**: Socket.IO events notify clients of workflow changes for immediate UI updates without polling.

6. **Notifications**: Users receive real-time notifications for QA-ready tasks, bug creations, and sprint approvals via Socket.IO.

These flowcharts represent the core workflows implemented in the Mini ClickUp MVP as of the current development stage.
