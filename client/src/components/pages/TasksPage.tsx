import { useTasks } from "@/hooks/useTasks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui";
import { Plus, Filter } from "lucide-react";

export default function TasksPage() {
  const { tasks, loading, error, createTask } = useTasks();

  const handleCreateTask = async () => {
    // In a real app, this would open a modal to get task details
    // For now, we'll create a sample task to demonstrate the flow
    try {
      await createTask({
        title: "New Task",
        description: "A new task created via the UI",
        status: "todo",
        priority: "medium",
        // Note: In a real app, we would need to get the projectId, teamId, reporterId, etc.
        // For now, we are just demonstrating the API call. The backend will require these fields.
        // We'll leave them out for now and expect the backend to have default values or validation errors.
        // In a real implementation, we would get these from context or props.
      });
    } catch (err) {
      // Error is handled by the hook and shown in the UI
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Tasks</h1>
            <p className="text-neutral-500 mt-1">Track and manage your tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="default"
              onClick={handleCreateTask}
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Tasks</h1>
            <p className="text-neutral-500 mt-1">Track and manage your tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="default"
              onClick={handleCreateTask}
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tasks</h1>
          <p className="text-neutral-500 mt-1">Track and manage your tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button
            variant="default"
            onClick={handleCreateTask}
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">
            No tasks found. Create your first task!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task._id} className="glass hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {task.description && (
                  <p className="text-neutral-600">{task.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Status</span>
                  <span className="capitalize font-medium">
                    {task.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Priority</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeClass(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Assignee</span>
                  <span className="font-medium">
                    {task.assignee
                      ? typeof task.assignee === "object"
                        ? task.assignee.name
                        : task.assignee
                      : "Unassigned"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to get priority badge class (matching the design system)
const getPriorityBadgeClass = (priority: string): string => {
  switch (priority) {
    case "low":
      return "bg-neutral-100 text-neutral-600";
    case "medium":
      return "bg-blue-100 text-blue-600";
    case "high":
      return "bg-orange-100 text-orange-600";
    case "urgent":
      return "bg-red-100 text-red-600";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
};
