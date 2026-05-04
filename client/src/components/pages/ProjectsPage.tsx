import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/components/ui";
import { FolderKanban, Plus, Pencil, Users } from "lucide-react";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import EditProjectModal from "@/components/modals/EditProjectModal";
import type { Project, Team } from "@/types";

function getTeamName(project: Project): string {
  const team = project.team;
  if (!team) return "No team";
  if (typeof team === "object" && "name" in team) {
    return (team as Team).name;
  }
  return "Unknown Team";
}

function isProjectOwner(project: Project, userId?: string): boolean {
  if (!userId) return false;
  const owner = project.owner;
  if (typeof owner === "string") return owner === userId;
  if (owner && typeof owner === "object" && "_id" in owner) {
    return (owner as { _id: string })._id === userId;
  }
  return false;
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const isGOD_MODE = user?.role === "GOD_MODE";

  const handleCardClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="p-6 min-h-full glass-bg rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Projects</h1>
          <p className="text-white/50 mt-1">
            Manage your projects and track progress
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">
            No projects found. Create your first project!
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="glass-card cursor-pointer relative group overflow-hidden"
              onClick={() => handleCardClick(project._id)}
            >
              <div className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: project.color || "#3B82F6" }}
                    />
                    <h3 className="text-base font-semibold text-white/90 truncate">
                      {project.name}
                    </h3>
                  </div>

                  {/* Edit button — visible only for owner or GOD_MODE */}
                  {(isProjectOwner(project, user?._id) || isGOD_MODE) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-2 text-white/40 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditProject(project);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-5 pt-3 space-y-3">
                {/* Team name */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Team</span>
                  <span className="text-white/80 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-white/40" />
                    {getTeamName(project)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Status</span>
                  <span className="text-white/80 font-medium capitalize">
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Tasks</span>
                  <span className="text-white/80 font-medium">
                    {(project as any).tasks?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Members</span>
                  <span className="text-white/80 font-medium">
                    {project.members?.length || 0} people
                  </span>
                </div>

                <button className="w-full mt-3 py-2 text-sm text-white/60 hover:text-white/90 glass-button text-center">
                  View Project
                </button>
              </div>
            </div>
          ))}

          {/* Add Project Card */}
          <div
            className="glass-card border-dashed border-2 border-white/10 hover:border-blue-400/50 cursor-pointer transition-colors flex flex-col items-center justify-center py-12"
            onClick={() => setCreateOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <FolderKanban className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/60">
              Create New Project
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          // Projects are auto-refreshed by the useProjects hook on mount
        }}
      />

      <EditProjectModal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        onSuccess={() => setEditProject(null)}
        project={editProject!}
      />
    </div>
  );
}
