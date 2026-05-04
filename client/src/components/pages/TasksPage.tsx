import { useState, useMemo, useCallback } from 'react';
import { useTasks } from '@/hooks/useTasks';
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskStatus } from '@/types';
import {
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  Bug,
  CheckSquare,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import TaskDetailDialog from '@/components/modals/TaskDetailDialog';

/* ─── Column Definitions ─────────────────────────────────────── */

const COLUMNS: { id: TaskStatus; title: string; color: string; glow: string }[] = [
  { id: 'backlog', title: 'Backlog', color: '#6B7280', glow: 'shadow-gray-500/20' },
  { id: 'todo', title: 'To Do', color: '#3B82F6', glow: 'shadow-blue-500/20' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B', glow: 'shadow-amber-500/20' },
  { id: 'review', title: 'Review', color: '#8B5CF6', glow: 'shadow-purple-500/20' },
  { id: 'done', title: 'Done', color: '#10B981', glow: 'shadow-emerald-500/20' },
  { id: 'qa', title: 'QA', color: '#EC4899', glow: 'shadow-pink-500/20' },
  { id: 'approved', title: 'Approved', color: '#059669', glow: 'shadow-emerald-600/20' },
];

const PRIORITY_BORDER: Record<string, string> = {
  low: 'border-l-gray-400/60',
  medium: 'border-l-blue-400/60',
  high: 'border-l-orange-400/60',
  urgent: 'border-l-red-400/60',
};

const PRIORITY_TEXT: Record<string, string> = {
  low: 'text-gray-300',
  medium: 'text-blue-300',
  high: 'text-orange-300',
  urgent: 'text-red-300',
};

const PRIORITY_BG: Record<string, string> = {
  low: 'bg-gray-500/20',
  medium: 'bg-blue-500/20',
  high: 'bg-orange-500/20',
  urgent: 'bg-red-500/20',
};

/* ─── Helpers ────────────────────────────────────────────────── */

function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function getAssigneeName(task: Task): string {
  if (!task.assignee) return 'Unassigned';
  if (typeof task.assignee === 'object') return task.assignee.name;
  return String(task.assignee);
}

function getAssigneeAvatar(task: Task): string | undefined {
  if (task.assignee && typeof task.assignee === 'object') {
    return task.assignee.avatar;
  }
  return undefined;
}

/* ─── Sortable Task Card ─────────────────────────────────────── */

interface KanbanCardProps {
  task: Task;
  isDragOverlay?: boolean;
  onClick?: () => void;
}

function KanbanCard({ task, isDragOverlay = false, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: 'task', task },
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.dueDate);
  const borderColor = PRIORITY_BORDER[task.priority] || 'border-l-gray-400/60';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        ${borderColor} border-l-4 rounded-xl
        backdrop-blur-lg bg-white/[8%] border border-white/10
        shadow-lg shadow-black/10
        hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-30 scale-95 shadow-none' : ''}
        ${isDragOverlay ? 'shadow-2xl shadow-black/30 rotate-[2deg] scale-105 bg-white/15' : ''}
        group
      `}
    >
      <div className="p-3 space-y-2">
        {/* Top row: type icon + taskNumber */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {task.type === 'bug' ? (
              <Bug className="size-3.5 shrink-0 text-red-400" />
            ) : (
              <CheckSquare className="size-3.5 shrink-0 text-emerald-400" />
            )}
            <span className="text-[11px] font-mono text-white/50 truncate">
              {task.taskNumber}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-4 ${PRIORITY_BG[task.priority] || 'bg-gray-500/20'} ${PRIORITY_TEXT[task.priority] || 'text-gray-300'} border-white/10 shrink-0`}
          >
            {task.priority}
          </Badge>
        </div>

        {/* Title */}
        <p className="text-sm font-medium leading-snug text-white/90 line-clamp-2">
          {task.title}
        </p>

        {/* Bottom row: assignee + due date */}
        <div className="flex items-center justify-between pt-0.5">
          <Avatar className="size-5 ring-1 ring-white/20">
            {getAssigneeAvatar(task) ? (
              <img src={getAssigneeAvatar(task)} alt={getAssigneeName(task)} className="size-full object-cover" />
            ) : null}
            <AvatarFallback className="text-[8px] bg-white/10 text-white/70">
              {getAssigneeName(task).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {task.dueDate && (
            <div className={`flex items-center gap-0.5 text-[10px] ${overdue ? 'text-red-400 font-medium' : 'text-white/50'}`}>
              <Calendar className="size-3" />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Kanban Column ──────────────────────────────────────────── */

interface KanbanColumnProps {
  column: typeof COLUMNS[number];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isOver?: boolean;
}

function KanbanColumnHeader({ column, count }: { column: typeof COLUMNS[number]; count: number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[6%]">
      <div className="flex items-center gap-2">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: column.color, boxShadow: `0 0 8px ${column.color}80` }}
        />
        <h3 className="text-xs font-semibold tracking-wider uppercase text-white/70">
          {column.title}
        </h3>
      </div>
      <span className="inline-flex items-center justify-center size-5 rounded-md text-[11px] font-mono font-medium bg-white/10 text-white/50 border border-white/10">
        {count}
      </span>
    </div>
  );
}

function KanbanColumnContent({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks]);

  return (
    <div className="flex flex-col h-full">
      <KanbanColumnHeader column={column} count={tasks.length} />
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-white/30 italic">
              No tasks
            </div>
          )}
          {tasks.map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ───────────────────────────────────────── */

function KanbanSkeleton() {
  return (
    <div className="h-full p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2 bg-white/10" />
          <Skeleton className="h-4 w-48 bg-white/10" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md bg-white/10" />
      </div>
      <div className="flex gap-4 min-h-[calc(100vh-220px)]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64 backdrop-blur-xl bg-white/[6%] border border-white/[8%] rounded-xl overflow-hidden shadow-lg shadow-black/10">
            <div className="px-3 py-2.5 border-b border-white/[6%]">
              <Skeleton className="h-4 w-20 bg-white/10" />
            </div>
            <div className="p-2 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/[6%]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────── */

function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-xs">
        <div className="size-16 mx-auto mb-4 rounded-2xl backdrop-blur-xl bg-white/[8%] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/10">
          <CheckSquare className="size-8 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white/90 mb-1">Create your first task</h2>
        <p className="text-sm text-white/50 mb-4">
          Get started by creating a task and dragging it across the kanban board.
        </p>
        <Button
          onClick={onCreateTask}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/10"
        >
          <Plus className="size-4 mr-1.5" />
          New Task
        </Button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

export default function TasksPage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    for (const col of COLUMNS) {
      grouped[col.id] = [];
    }
    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }
    return grouped;
  }, [tasks]);

  const allEmpty = useMemo(
    () => COLUMNS.every((col) => (tasksByStatus[col.id]?.length || 0) === 0),
    [tasksByStatus],
  );

  // ── DnD handlers ──

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t._id === event.active.id.toString());
      setActiveTask(task || null);
    },
    [tasks],
  );

  const findColumnByTaskId = useCallback(
    (id: string): TaskStatus | null => {
      for (const col of COLUMNS) {
        if (tasksByStatus[col.id]?.some((t) => t._id === id)) {
          return col.id;
        }
      }
      return null;
    },
    [tasksByStatus],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id.toString();
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      // Determine target column
      let targetColumn: TaskStatus | null = null;
      const overId = over.id.toString();

      if (overId.startsWith('column-')) {
        targetColumn = overId.replace('column-', '') as TaskStatus;
      } else {
        targetColumn = findColumnByTaskId(overId);
      }

      if (!targetColumn || targetColumn === task.status) return;

      try {
        await updateTask(taskId, { status: targetColumn });
        toast.success(`Moved to ${COLUMNS.find((c) => c.id === targetColumn)?.title}`);
      } catch {
        toast.error('Failed to move task. Please try again.');
      }
    },
    [tasks, updateTask, findColumnByTaskId],
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  // ── Handlers ──

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  }, []);

  const handleCreateTask = useCallback(async () => {
    try {
      await createTask({
        title: 'New Task',
        description: 'A new task created via the UI',
        status: 'todo',
        priority: 'medium',
      } as Partial<Task>);
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  }, [createTask]);

  // ── Loading ──

  if (loading && tasks.length === 0) {
    return <KanbanSkeleton />;
  }

  // ── Error ──

  if (error && tasks.length === 0) {
    return (
      <div
        className="h-full p-6 overflow-x-auto"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white/90">Tasks</h1>
            <p className="text-white/50 mt-1">Track and manage your tasks</p>
          </div>
        </div>
        <Alert variant="destructive" className="bg-red-950/40 backdrop-blur-xl border border-red-500/30 text-red-200 shadow-xl shadow-red-900/10">
          <AlertTitle>Error loading tasks</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              className="w-fit bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
              onClick={fetchTasks}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ── Empty ──

  if (allEmpty && !loading) {
    return (
      <div
        className="h-full p-6 overflow-x-auto"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white/90">Tasks</h1>
            <p className="text-white/50 mt-1">Track and manage your tasks</p>
          </div>
          <Button
            onClick={handleCreateTask}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/10"
          >
            <Plus className="size-4 mr-1.5" />
            New Task
          </Button>
        </div>
        <EmptyState onCreateTask={handleCreateTask} />
      </div>
    );
  }

  // ── Kanban Board ──

  return (
    <div
      className="h-full p-6 overflow-x-auto"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Tasks</h1>
          <p className="text-white/50 mt-1">Track and manage your tasks</p>
        </div>
        <Button
          onClick={handleCreateTask}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/10"
        >
          <Plus className="size-4 mr-1.5" />
          New Task
        </Button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 min-h-[calc(100vh-220px)] pb-4">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-64 backdrop-blur-xl bg-white/[6%] border border-white/[8%] rounded-xl shadow-lg shadow-black/10 flex flex-col overflow-hidden"
            >
              <KanbanColumnContent
                column={column}
                tasks={tasksByStatus[column.id] || []}
                onTaskClick={handleTaskClick}
              />
            </div>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="w-64">
              <KanbanCard task={activeTask} isDragOverlay onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedTask(null);
        }}
      />
    </div>
  );
}
