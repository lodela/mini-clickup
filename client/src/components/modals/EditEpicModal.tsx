import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppButton } from "@/components/ui/app-button";
import { useEpics } from "@/hooks/useEpics";
import { BookOpen, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Epic } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Epic name is required"),
  description: z.string().optional(),
  status: z.string().default("open"),
  priority: z.string().default("medium"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  epic: Epic;
}

const STATUS_OPTIONS = [
  { key: "open", label: "Open" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "urgent", label: "Urgent" },
];

export default function EditEpicModal({
  isOpen,
  onClose,
  onSuccess,
  epic,
}: EditEpicModalProps) {
  const { update, remove } = useEpics(epic?.project as string);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: epic?.name || "",
      description: epic?.description || "",
      status: epic?.status || "open",
      priority: epic?.priority || "medium",
    },
  });

  useEffect(() => {
    if (epic) {
      form.reset({
        name: epic.name,
        description: epic.description || "",
        status: epic.status,
        priority: epic.priority,
      });
    }
  }, [epic, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await update(epic._id, {
        name: values.name,
        description: values.description || "",
        status: values.status as any,
        priority: values.priority as any,
      });
      toast.success(t('epics.updateSuccess'));
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || t('epics.updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('epics.deleteConfirm'))) return;
    try {
      setIsDeleting(true);
      await remove(epic._id);
      toast.success(t('epics.deleteSuccess'));
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || t('epics.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto glass-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-white/10 rounded-xl text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white/90">
                {t('epics.editEpic')}
              </DialogTitle>
              <DialogDescription className="text-white/50 text-sm">
                {t('epics.editDescription')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 font-medium">{t('epics.name')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('epics.namePlaceholder')}
                      {...field}
                      className="glass-input h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 font-medium">
                    {t('epics.description')}{" "}
                    <span className="text-white/40 font-normal">({t('common.optional')})</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('epics.descriptionPlaceholder')}
                      {...field}
                      className="glass-input rounded-xl"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-10 rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-10 rounded-xl">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p.key} value={p.key}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <AppButton type="button" variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="w-4 h-4" />
              </AppButton>
              <AppButton type="button" variant="cancel" onClick={handleClose}>
                {t('common.cancel')}
              </AppButton>
              <AppButton type="submit" variant="primary" loading={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  t('common.save')
                )}
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
