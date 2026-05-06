import { useState } from "react";
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
import { useStories } from "@/hooks/useStories";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Story title is required"),
  description: z.string().optional(),
  status: z.string().default("planning"),
  priority: z.string().default("medium"),
  sizing: z.string().default("md"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  epicId: string;
  projectId: string;
}

const STATUS_OPTIONS = [
  { key: "planning", label: "Planning" },
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "doing", label: "Doing" },
  { key: "qa", label: "QA" },
  { key: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "urgent", label: "Urgent" },
];

const SIZING_OPTIONS = [
  { key: "xs", label: "XS" },
  { key: "sm", label: "SM" },
  { key: "md", label: "MD" },
  { key: "lg", label: "LG" },
  { key: "xl", label: "XL" },
];

export default function CreateStoryModal({
  isOpen,
  onClose,
  onSuccess,
  epicId,
  projectId,
}: CreateStoryModalProps) {
  const { create } = useStories({ epicId });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      sizing: "md",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await create({
        title: values.title,
        description: values.description || "",
        epic: epicId,
        project: projectId,
        status: values.status as any,
        priority: values.priority as any,
        sizing: values.sizing as any,
      });
      toast.success(t('stories.createSuccess'));
      onSuccess();
      onClose();
      form.reset();
    } catch (err: any) {
      toast.error(err?.message || t('stories.createError'));
    } finally {
      setIsSubmitting(false);
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
            <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white/90">
                {t('stories.createNewStory')}
              </DialogTitle>
              <DialogDescription className="text-white/50 text-sm">
                {t('stories.createDescription')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 font-medium">{t('stories.title')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('stories.titlePlaceholder')}
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
                    {t('stories.description')}{" "}
                    <span className="text-white/40 font-normal">({t('common.optional')})</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('stories.descriptionPlaceholder')}
                      {...field}
                      className="glass-input rounded-xl"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">{t('stories.status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-10 rounded-xl">
                          <SelectValue placeholder={t('stories.status')} />
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
                    <FormLabel className="text-white/70 font-medium">{t('stories.priority')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-10 rounded-xl">
                          <SelectValue placeholder={t('stories.priority')} />
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

              <FormField
                control={form.control}
                name="sizing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">{t('stories.sizing')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input h-10 rounded-xl">
                          <SelectValue placeholder={t('stories.sizing')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SIZING_OPTIONS.map((sz) => (
                          <SelectItem key={sz.key} value={sz.key}>
                            {sz.label}
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
              <AppButton type="button" variant="cancel" onClick={handleClose}>
                {t('common.cancel')}
              </AppButton>
              <AppButton type="submit" variant="primary" loading={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('common.creating')}
                  </>
                ) : (
                  t('stories.createNewStory')
                )}
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
