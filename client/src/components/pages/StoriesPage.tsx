import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStories } from "@/hooks/useStories";
import { useAuth } from "@/contexts/AuthContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/components/ui";
import { FileText, Plus, Pencil, ArrowLeft } from "lucide-react";
import CreateStoryModal from "@/components/modals/CreateStoryModal";
import EditStoryModal from "@/components/modals/EditStoryModal";
import type { Story } from "@/types";

export default function StoriesPage() {
  const { id: projectId, epicId } = useParams<{ id: string; epicId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { stories, loading, error } = useStories({ epicId: epicId || "" });
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editStory, setEditStory] = useState<Story | null>(null);

  const isGOD_MODE = user?.role === "GOD_MODE";

  return (
    <div className="p-6 min-h-full glass-bg rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-white/90"
            onClick={() => navigate(`/projects/${projectId}/epics`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white/90">{t('stories.title')}</h1>
            <p className="text-white/50 mt-1">
              {t('stories.manageStories')}
            </p>
          </div>
        </div>
        <Button variant="default" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          {t('stories.newStory')}
        </Button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">
            {t('stories.noStories')}
          </p>
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              className="glass-card cursor-pointer relative group overflow-hidden"
            >
              <div className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0 bg-emerald-400" />
                    <h3 className="text-base font-semibold text-white/90 truncate">
                      {story.title}
                    </h3>
                  </div>
                  {isGOD_MODE && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-2 text-white/40 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditStory(story);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-5 pt-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{t('stories.status')}</span>
                  <span className="text-white/80 font-medium capitalize">
                    {story.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{t('stories.priority')}</span>
                  <span className="text-white/80 font-medium capitalize">
                    {story.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{t('stories.sizing')}</span>
                  <span className="text-white/80 font-medium uppercase">
                    {story.sizing}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div
            className="glass-card border-dashed border-2 border-white/10 hover:border-blue-400/50 cursor-pointer transition-colors flex flex-col items-center justify-center py-12"
            onClick={() => setCreateOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/60">{t('stories.createNewStory')}</p>
          </div>
        </div>
      )}

      <CreateStoryModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {}}
        epicId={epicId || ""}
        projectId={projectId || ""}
      />

      <EditStoryModal
        isOpen={!!editStory}
        onClose={() => setEditStory(null)}
        onSuccess={() => setEditStory(null)}
        story={editStory!}
      />
    </div>
  );
}
