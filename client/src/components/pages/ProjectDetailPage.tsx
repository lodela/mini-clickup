import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Button, Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { ArrowLeft, FolderKanban } from "lucide-react";
import type { Team } from "@/types";

function getTeamName(project: { team: string | Team | undefined }): string {
  const team = project.team;
  if (!team) return "No team";
  if (typeof team === "object" && "name" in team) {
    return (team as Team).name;
  }
  return "Unknown Team";
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  const project = projects.find((p) => p._id === id);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto glass-bg rounded-3xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto glass-bg rounded-3xl">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 max-w-5xl mx-auto glass-bg rounded-3xl">
        <Alert>
          <AlertTitle>Project not found</AlertTitle>
          <AlertDescription>
            The project you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button className="glass-button mt-4" onClick={() => navigate("/projects")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto glass-bg rounded-3xl">
      {/* Back button */}
      <Button
        className="mb-6 -ml-3 text-white/50 hover:text-white/90 glass-button"
        onClick={() => navigate("/projects")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Button>

      {/* Project header */}
      <div className="glass rounded-2xl p-6 flex items-start gap-4 mb-8">
        <div
          className="w-4 h-4 rounded-full mt-2 shrink-0"
          style={{ backgroundColor: project.color || "#3B82F6" }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white/90">{project.name}</h1>
          <p className="text-white/50 mt-1">
            {project.description || "No description provided."}
          </p>
          <div className="flex items-center gap-6 mt-3 text-sm text-white/50">
            <span>
              Status:{" "}
              <span className="font-medium text-white/80 capitalize">
                {project.status.replace("-", " ")}
              </span>
            </span>
            <span>
              Team:{" "}
              <span className="font-medium text-white/80">
                <FolderKanban className="w-3.5 h-3.5 inline mr-1" />
                {getTeamName(project)}
              </span>
            </span>
            <span>
              Members:{" "}
              <span className="font-medium text-white/80">
                {project.members?.length || 0}
              </span>
            </span>
            <span>
              Tasks:{" "}
              <span className="font-medium text-white/80">
                {(project as any).tasks?.length || 0}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 mt-1 text-sm text-white/50">
            {project.startDate && (
              <span>
                Start:{" "}
                <span className="font-medium text-white/80">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </span>
            )}
            {project.endDate && (
              <span>
                End:{" "}
                <span className="font-medium text-white/80">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Epics section (placeholder) */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Epics</h2>
            <p className="text-sm text-white/40 text-center py-8">
              Epics will be displayed here. Start by creating an epic for this project.
            </p>
          </div>

          {/* Tasks section (placeholder) */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Tasks</h2>
            <p className="text-sm text-white/40 text-center py-8">
              Tasks will be displayed here. Start by creating a task for this project.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project details card */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/50">Status</dt>
                <dd className="font-medium text-white/80 capitalize">{project.status.replace("-", " ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Team</dt>
                <dd className="font-medium text-white/80">{getTeamName(project)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Members</dt>
                <dd className="font-medium text-white/80">{project.members?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Tasks</dt>
                <dd className="font-medium text-white/80">{(project as any).tasks?.length || 0}</dd>
              </div>
            </dl>
          </div>

          {/* Dates card */}
          {(project.startDate || project.endDate) && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                Dates
              </h3>
              <dl className="space-y-3 text-sm">
                {project.startDate && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Start</dt>
                    <dd className="font-medium text-white/80">
                      {new Date(project.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">End</dt>
                    <dd className="font-medium text-white/80">
                      {new Date(project.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
