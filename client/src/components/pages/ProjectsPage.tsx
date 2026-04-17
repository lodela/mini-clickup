import { useProjects } from "@/hooks/useProjects";
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
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
  const { projects, loading, error, createProject } = useProjects();

  const handleCreateProject = async () => {
    // In a real app, this would open a modal to get project details
    // For now, we'll create a sample project to demonstrate the flow
    try {
      await createProject({
        name: "New Project",
        description: "A new project created via the UI",
        status: "planning",
        color: "bg-electric-blue",
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
            <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
            <p className="text-neutral-500 mt-1">
              Manage your projects and track progress
            </p>
          </div>
          <Button
            variant="default"
            onClick={handleCreateProject}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
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
            <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
            <p className="text-neutral-500 mt-1">
              Manage your projects and track progress
            </p>
          </div>
          <Button
            variant="default"
            onClick={handleCreateProject}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
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
          <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="text-neutral-500 mt-1">
            Manage your projects and track progress
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleCreateProject}
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">
            No projects found. Create your first project!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="glass hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${project.color}`} />
                <CardTitle>{project.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Status</span>
                  <span className="capitalize font-medium">
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Tasks</span>
                  <span className="font-medium">
                    {(project as any).tasks?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Members</span>
                  <span className="font-medium">
                    {project.members?.length || 0} people
                  </span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View Project
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Project Card */}
        <Card
          className="border-dashed border-2 hover:border-electric-blue cursor-pointer transition-colors"
          onClick={handleCreateProject}
        >
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <FolderKanban className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600">
              Create New Project
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
