import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/components/ui";
import TipTapEditor from "@/components/ui/TipTapEditor";
import { ArrowLeft, Save, FileText, Plus, Trash2, Pencil } from "lucide-react";
import {
  createDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "@/services/projectDocumentService";
import type { ProjectDocument } from "@/types";

export default function ProjectDocumentPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDocuments = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const docs = await getDocuments(projectId);
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError(t("documents.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const handleNew = () => {
    setSelectedDoc(null);
    setTitle("");
    setContent("<p></p>");
    setIsEditing(true);
  };

  const handleEdit = (doc: ProjectDocument) => {
    setSelectedDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!projectId || !title.trim()) return;
    try {
      setSaving(true);
      if (selectedDoc) {
        await updateDocument(selectedDoc._id, { title, content });
      } else {
        await createDocument({ title, content, project: projectId });
      }
      setIsEditing(false);
      setSelectedDoc(null);
      setTitle("");
      setContent("");
      await fetchDocuments();
    } catch (err) {
      setError(t("documents.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("documents.deleteConfirm"))) return;
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (err) {
      setError(t("documents.deleteError"));
    }
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
            <h1 className="text-2xl font-bold text-white/90">{t("documents.title")}</h1>
            <p className="text-white/50 mt-1">{t("documents.subtitle")}</p>
          </div>
        </div>
        <Button variant="default" onClick={handleNew}>
          <Plus className="w-4 h-4" />
          {t("documents.newDocument")}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document list */}
          <div className="lg:col-span-1 space-y-3">
            {documents.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-white/30 mb-3" />
                <p className="text-white/50">{t("documents.empty")}</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc._id}
                  className={`glass-card p-4 cursor-pointer transition-all hover:bg-white/10 ${
                    selectedDoc?._id === doc._id ? "ring-2 ring-blue-400/50" : ""
                  }`}
                  onClick={() => handleEdit(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white/90 truncate">{doc.title}</h3>
                      <p className="text-sm text-white/40 mt-1">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(doc);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("documents.titlePlaceholder")}
                  className="glass-input text-lg font-semibold"
                />
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                  placeholder={t("documents.contentPlaceholder")}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedDoc(null);
                    }}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleSave} disabled={saving || !title.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? t("common.saving") : t("common.save")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-white/20 mb-4" />
                <p className="text-white/40">{t("documents.selectOrCreate")}</p>
                <Button className="mt-4" onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("documents.newDocument")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
