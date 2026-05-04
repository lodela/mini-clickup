import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, TaskStatus } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import {
  Bug,
  CheckSquare,
  Calendar,
  Clock,
  Tag,
  Send,
  ArrowUp,
} from 'lucide-react';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'qa', label: 'QA' },
  { value: 'approved', label: 'Approved' },
];

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    backlog: 'bg-gray-500',
    todo: 'bg-blue-500',
    'in-progress': 'bg-amber-500',
    review: 'bg-purple-500',
    done: 'bg-emerald-500',
    qa: 'bg-pink-500',
    approved: 'bg-emerald-600',
  };
  return map[status] || 'bg-gray-500';
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'medium': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
}

function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const { updateTask } = useTasks();
  const [newComment, setNewComment] = useState('');
  const [changingStatus, setChangingStatus] = useState(false);

  if (!task) return null;

  const assigneeName =
    task.assignee && typeof task.assignee === 'object'
      ? task.assignee.name
      : 'Unassigned';
  const assigneeAvatar =
    task.assignee && typeof task.assignee === 'object'
      ? task.assignee.avatar
      : undefined;
  const reporterName =
    task.reporter && typeof task.reporter === 'object'
      ? task.reporter.name
      : 'Unknown';
  const projectName =
    task.project && typeof task.project === 'object'
      ? task.project.name
      : typeof task.project === 'string'
        ? task.project
        : '—';
  const teamName =
    task.team && typeof task.team === 'object'
      ? task.team.name
      : typeof task.team === 'string'
        ? task.team
        : '—';

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status) return;
    setChangingStatus(true);
    try {
      await updateTask(task._id, { status: newStatus as TaskStatus });
      toast.success(`Task moved to ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`);
    } catch {
      toast.error('Failed to update task status');
    } finally {
      setChangingStatus(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const currentComments = task.comments || [];
    const newCommentObj = {
      id: crypto.randomUUID(),
      content: newComment.trim(),
      author: 'You',
      createdAt: new Date().toISOString(),
    };
    try {
      // We send the full comments array including the new one
      // because the backend uses findByIdAndUpdate which replaces the array
      await updateTask(task._id, {
        comments: [...currentComments, newCommentObj],
      } as Partial<Task>);
      setNewComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-2xl bg-white/[6%] border border-white/[10%] shadow-2xl shadow-black/40">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className={`${getStatusColor(task.status)} text-white text-xs`}
            >
              {task.status}
            </Badge>
            {task.type === 'bug' && (
              <Badge variant="destructive" className="text-xs flex items-center gap-1 bg-red-500/20 text-red-300 border-red-500/30">
                <Bug className="size-3" /> Bug
              </Badge>
            )}
            {task.type === 'task' && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <CheckSquare className="size-3" /> Task
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl text-white/90">
            <span className="text-white/40 font-mono text-sm mr-2">
              {task.taskNumber}
            </span>
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Description */}
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-white/50 mb-1">Description</h4>
                <p className="text-sm text-white/80 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            <div className="border-t border-white/[6%]" />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Status</h4>
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                  disabled={changingStatus}
                >
                  <SelectTrigger className="h-8 text-xs capitalize bg-white/[6%] border-white/10 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-2xl border border-white/10 text-white/80">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="capitalize text-xs focus:bg-white/10 focus:text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Priority</h4>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  <ArrowUp className="size-3 mr-1" />
                  {task.priority}
                </Badge>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Type</h4>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  {task.type === 'bug' ? (
                    <Bug className="size-4 text-red-400" />
                  ) : (
                    <CheckSquare className="size-4 text-emerald-400" />
                  )}
                  <span className="capitalize">{task.type}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Assignee</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 ring-1 ring-white/20">
                    {assigneeAvatar ? (
                      <img src={assigneeAvatar} alt={assigneeName} />
                    ) : null}
                    <AvatarFallback className="text-[10px] bg-white/10 text-white/70">
                      {assigneeName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/80 truncate">{assigneeName}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Reporter</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 ring-1 ring-white/20">
                    <AvatarFallback className="text-[10px] bg-white/10 text-white/70">
                      {reporterName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/80 truncate">{reporterName}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Project</h4>
                <span className="text-sm text-white/80">{projectName}</span>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Team</h4>
                <span className="text-sm text-white/80">{teamName}</span>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Due Date</h4>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className={`size-3.5 ${overdue ? 'text-red-400' : 'text-white/50'}`} />
                  <span className={overdue ? 'text-red-400 font-medium' : 'text-white/80'}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Estimated</h4>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Clock className="size-3.5 text-white/50" />
                  <span>{task.estimatedTime != null ? `${task.estimatedTime}h` : '—'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Spent</h4>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Clock className="size-3.5 text-white/50" />
                  <span>{task.spentTime != null ? `${task.spentTime}h` : '—'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-white/50 mb-1">Created</h4>
                <span className="text-sm text-white/50">
                  {formatDateTime(task.createdAt)}
                </span>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <>
                <div className="border-t border-white/[6%]" />
                <div>
                  <h4 className="text-xs font-medium text-white/50 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <Badge key={tag} className="text-xs bg-white/10 text-white/70 border-white/10">
                        <Tag className="size-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-white/[6%]" />

            {/* Comments */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">
                Comments ({task.comments?.length || 0})
              </h4>

              <div className="space-y-3 mb-4">
                {(!task.comments || task.comments.length === 0) && (
                  <p className="text-sm text-white/50">No comments yet.</p>
                )}
                {task.comments?.map((comment) => {
                  const commentAuthorName =
                    comment.author && typeof comment.author === 'object'
                      ? comment.author.name
                      : typeof comment.author === 'string'
                        ? comment.author
                        : 'Unknown';
                  return (
                    <div key={comment.id} className="backdrop-blur-lg bg-white/[4%] border border-white/[6%] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5 ring-1 ring-white/20">
                            <AvatarFallback className="text-[9px] bg-white/10 text-white/70">
                              {commentAuthorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-white/80">{commentAuthorName}</span>
                        </div>
                        <span className="text-[10px] text-white/40">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{comment.content}</p>
                    </div>
                  );
                })}
              </div>

              {/* Add Comment */}
              <div className="flex items-end gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1 min-h-[60px] rounded-xl backdrop-blur-lg bg-white/[4%] border border-white/10 px-3 py-2 text-sm text-white/80 placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
