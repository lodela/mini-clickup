import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppButton } from "@/components/ui/app-button";
import { useProjects } from "@/hooks/useProjects";
import { useTeams } from "@/hooks/useTeams";
import { PROJECT_COLORS, DEFAULT_PROJECT_COLOR } from "@/utils/colors";
import { FolderKanban, CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";
import type { Project, Team } from "@/types";
import { useAppCatalog } from '@/contexts/AppCatalogContext';

const formSchema= z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  team: z.string().min(1, "Team is required"),
  priority: z.string().default("medium"),
  status: z.string(),
  color: z.string().default(DEFAULT_PROJECT_COLOR),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project;
}

function getTeamId(team: string | Team | undefined): string {
  if (!team) return "";
  if (typeof team === "string") return team;
  return team._id;
}

function parseDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project,
}: EditProjectModalProps) {
  const { updateProject } = useProjects();
  const { teams } = useTeams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { byType } = useAppCatalog();
  const statuses = byType('project_status');
  const priorities = byType('task_priority');

  const form= useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: project.name || "",
      description: project.description || "",
      team: getTeamId(project.team),
      priority: "medium",
      status: project.status || "planning",
      color: project.color || DEFAULT_PROJECT_COLOR,
      startDate: parseDate(project.startDate),
      endDate: parseDate(project.endDate),
    },
  });

  // Reset form when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        team: getTeamId(project.team),
        priority: "medium",
        status: project.status || "planning",
        color: project.color || DEFAULT_PROJECT_COLOR,
        startDate: parseDate(project.startDate),
        endDate: parseDate(project.endDate),
      });
    }
  }, [isOpen, project, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await updateProject(project._id, {
        name: values.name,
        description: values.description || "",
        team: values.team,
        status: values.status,
        color: values.color,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      });
      toast.success("Project updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update project");
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
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto glass-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-white/10 rounded-xl text-indigo-400 shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white/90">
                Edit Project
              </DialogTitle>
              <DialogDescription className="text-white/50 text-sm">
                Update project details and settings.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 font-medium">Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Marketing Website Redesign"
                      {...field}
                      className="h-10 rounded-xl glass-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 font-medium">
                    Description{" "}
                    <span className="text-white/40 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project goals and scope..."
                      {...field}
                      className="rounded-xl glass-input"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team + Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">Team *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl glass-input">
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.length === 0 && (
                          <SelectItem value="__none__" disabled>
                            No teams available
                          </SelectItem>
                        )}
                        {teams.map((team) => (
                          <SelectItem key={team._id} value={team._id}>
                            {team.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl glass-input">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((s) => (
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
            </div>

            {/* Priority + Color Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl glass-input">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((p) => (
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">
                      Color{" "}
                      <span className="text-white/40 font-normal">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-wrap gap-1 flex-1">
                          {PROJECT_COLORS.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              title={c.label}
                              onClick={() => field.onChange(c.value)}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 transition-all",
                                field.value === c.value
                                  ? "border-neutral-900 scale-110 ring-2 ring-offset-1 ring-white/30"
                                  : "border-transparent hover:scale-110",
                              )}
                              style={{ backgroundColor: c.value }}
                            />
                          ))}
                        </div>
                        <Input
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={DEFAULT_PROJECT_COLOR}
                          className="w-20 h-9 text-xs font-mono uppercase rounded-xl glass-input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Start Date + End Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">
                      Start Date{" "}
                      <span className="text-white/40 font-normal">(Optional)</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 rounded-xl glass-input justify-start text-left font-normal",
                              !field.value && "text-white/40",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? field.value.toLocaleDateString("en-US", {
                                  dateStyle: "medium",
                                })
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-medium">
                      End Date{" "}
                      <span className="text-white/40 font-normal">(Optional)</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 rounded-xl glass-input justify-start text-left font-normal",
                              !field.value && "text-white/40",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? field.value.toLocaleDateString("en-US", {
                                  dateStyle: "medium",
                                })
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <AppButton
                type="button"
                variant="cancel"
                onClick={handleClose}
              >
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                variant="primary"
                loading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
