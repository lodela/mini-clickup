import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui";
import { Plus, CheckSquare, FolderKanban } from "lucide-react";

interface BacklogTask {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "review" | "done" | "qa";
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  reporter: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  workflowState?: "pending-approval" | "approved";
}

interface BacklogTasks {
  todo: BacklogTask[];
  "in-progress": BacklogTask[];
  review: BacklogTask[];
  done: BacklogTask[];
  qa: BacklogTask[];
}

export default function BacklogPage() {
  const { tasks: allTasks, loading, error, updateTask } = useTasks();
  const [tasks, setTasks] = useState<BacklogTasks>({
    todo: [],
    "in-progress": [],
    review: [],
    done: [],
    qa: [],
  });

  // Organize tasks by status
  useEffect(() => {
    if (!loading && allTasks.length > 0) {
      const organized: BacklogTasks = {
        todo: [],
        "in-progress": [],
        review: [],
        done: [],
        qa: [],
      };

      allTasks.forEach((task) => {
        switch (task.status) {
          case "todo":
            organized.todo.push(task as BacklogTask);
            break;
          case "in-progress":
            organized["in-progress"].push(task as BacklogTask);
            break;
          case "review":
            organized.review.push(task as BacklogTask);
            break;
          case "done":
            organized.done.push(task as BacklogTask);
            break;
          case "qa":
            organized.qa.push(task as BacklogTask);
            break;
        }
      });

      setTasks(organized);
    }
  }, [allTasks, loading]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
          <p className="mt-4 text-neutral-500">Loading backlog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const columnConfig = [
    { id: "todo", title: "To Do", icon: null },
    { id: "in-progress", title: "In Progress", icon: FolderKanban },
    { id: "review", title: "Review", icon: null },
    { id: "done", title: "Done", icon: CheckSquare },
    { id: "qa", title: "QA Review", icon: null },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Sprint Backlog
          </h1>
          <p className="text-neutral-500 mt-1">
            Prioritize and manage tasks for the current sprint
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnConfig.map((column) => (
          <div
            key={column.id}
            data-droppable-id={column.id}
            className={`border rounded-lg p-4 min-h-[200px] ${column.id === "in-progress" || column.id === "done" ? "bg-white" : "bg-blue-50"}`}
          >
            <div className="mb-4 flex items-center">
              {column.icon && <div className="mr-2">{column.icon}</div>}
              <h2 className="text-lg font-medium flex-1">{column.title}</h2>
            </div>
            {tasks[column.id as keyof BacklogTasks]?.map((task, index) => (
              <div
                key={task._id}
                className="flex items-center p-2 rounded-lg border border-neutral-200"
              >
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
