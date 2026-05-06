import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEpics } from "@/hooks/useEpics";
import { useAuth } from "@/contexts/AuthContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/components/ui";
import { BookOpen, Plus, Pencil, ArrowLeft } from "lucide-react";
import CreateEpicModal from "@/components/modals/CreateEpicModal";
import EditEpicModal from "@/components/modals/EditEpicModal";
import type { Epic } from "@/types";

export default function EpicsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { epics, loading, error } = useEpics(projectId || "");
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editEpic, setEditEpic] = useState<Epic | null>(null);

  const isGOD_MODE = user?.role === "GOD_MODE";

  const handleCardClick = (epicId: string) => {
    navigate(`/projects/${projectId}/epics/${epicId}/stories`);
  };

  return (
    <div className="p-6 min-h-full glass-bg rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-white/90"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white/90">{t('epics.title')}</h1>
            <p className="text-white/50 mt-1">
              {t('epics.manageEpics')}
            </p>
          </div>
        </div>
        <Button variant="default" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          {t('epics.newEpic')}
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

      {!loading && !error && epics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">
            {t('epics.noEpics')}
          </p>
        </div>
      )}

      {!loading && !error && epics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epics.map((epic) => (
            <div
              key={epic._id}
              className="glass-card cursor-pointer relative group overflow-hidden"
              onClick={() => handleCardClick(epic._id)}
            >
              <div className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0 bg-blue-400" />
                    <h3 className="text-base font-semibold text-white/90 truncate">
                      {epic.name}
                    </h3>
                  </div>
                  {isGOD_MODE && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-2 text-white/40 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditEpic(epic);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-5 pt-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{t('epics.status')}</span>
                  <span className="text-white/80 font-medium capitalize">
                    {epic.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{t('epics.priority')}</span>
                  <span className="text-white/80 font-medium capitalize">
                    {epic.priority}
                  </span>
                </div>
                <button className="w-full mt-3 py-2 text-sm text-white/60 hover:text-white/90 glass-button text-center">
                  {t('epics.viewStories')}
                </button>
              </div>
            </div>
          ))}

          <div
            className="glass-card border-dashed border-2 border-white/10 hover:border-blue-400/50 cursor-pointer transition-colors flex flex-col items-center justify-center py-12"
            onClick={() => setCreateOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/60">{t('epics.createNewEpic')}</p>
          </div>
        </div>
      )}

      <CreateEpicModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {}}
        projectId={projectId || ""}
      />

      <EditEpicModal
        isOpen={!!editEpic}
        onClose={() => setEditEpic(null)}
        onSuccess={() => setEditEpic(null)}
        epic={editEpic!}
      />
    </div>
  );
}
