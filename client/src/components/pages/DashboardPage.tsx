import {
  Calendar,
  Clock,
  Paperclip,
  Plus,
  ArrowUp,
} from "lucide-react";

/**
 * Dashboard Page Component
 * Refactored to remove redundant layout elements and follow ProtectedLayout structure.
 */
export default function DashboardPage() {
  return (
    <div className="flex gap-6 min-h-full">
      {/* ── Left Column ── */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* 1. Workload Card */}
        <WorkloadCard />

        {/* 2. Project Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.pn} project={project} />
          ))}
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-6">
        {/* 3. Nearest Events */}
        <NearestEventsCard />

        {/* 4. Activity Stream */}
        <ActivityStreamCard />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data & Sub-components (Kept for content rendering)
// ─────────────────────────────────────────────────────────────────────────────

const EMPLOYEES = [
  { name: "Shawn Stone",     role: "UI/UX Designer", level: "Middle", progress: 75, color: "bg-blue-400"   },
  { name: "Randy Delgado",   role: "UI/UX Designer", level: "Junior", progress: 45, color: "bg-green-400"  },
  { name: "Emily Tyler",     role: "Copywriter",     level: "Senior", progress: 90, color: "bg-purple-400" },
  { name: "Louis Castro",    role: "Copywriter",     level: "Senior", progress: 60, color: "bg-yellow-400" },
  { name: "Blake Silva",     role: "iOS Developer",  level: "Senior", progress: 80, color: "bg-red-400"    },
  { name: "Joel Phillips",   role: "UI/UX Designer", level: "Middle", progress: 55, color: "bg-indigo-400" },
  { name: "Wayne Marsh",     role: "Copywriter",     level: "Junior", progress: 35, color: "bg-pink-400"   },
  { name: "Oscar Holloway",  role: "UI/UX Designer", level: "Middle", progress: 70, color: "bg-teal-400"   },
] as const;

const PROJECTS = [
  {
    name: "Medical App (iOS native)",
    pn: "PN0001265",
    created: "Sep 12, 2020",
    priority: "Medium",
    allTasks: 34,
    activeTasks: 13,
    assignees: ["bg-purple-400", "bg-blue-400", "bg-green-400"],
  },
  {
    name: "E-Commerce Platform",
    pn: "PN0001266",
    created: "Sep 10, 2020",
    priority: "Medium",
    allTasks: 50,
    activeTasks: 24,
    assignees: ["bg-purple-400", "bg-yellow-400", "bg-pink-400"],
  },
] as const;

const EVENTS = [
  { title: "Presentation of the new department", time: "Today | 5:00 PM", duration: "4h", priority: "medium" },
  { title: "Anna's Birthday",                    time: "Today | 6:00 PM", duration: "1h", priority: "low"    },
] as const;

const ACTIVITIES = [
  {
    user: "Oscar Holloway",
    avatar: "bg-teal-400",
    actions: [
      { text: "Updated the status of Mind Map task to In Progress", icon: "ArrowUp"   as const },
      { text: "Attached files to the task",                         icon: "Paperclip" as const },
    ],
  },
  {
    user: "Emily Tyler",
    avatar: "bg-purple-400",
    actions: [
      { text: "Created a new task: Homepage Redesign", icon: "Plus" as const },
    ],
  },
] as const;

/** Shared avatar with initials */
function Avatar({
  name,
  colorClass,
  size = "md",
}: {
  name: string;
  colorClass: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-9 h-9 text-xs";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

function WorkloadCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-neutral-900">Workload</h2>
        <a href="#" className="text-sm text-electric-blue hover:underline">
          View all
        </a>
      </div>

      <div className="space-y-3">
        {EMPLOYEES.map((emp) => (
          <div key={emp.name} className="flex items-center gap-3">
            <Avatar name={emp.name} colorClass={emp.color} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{emp.name}</p>
              <p className="text-xs text-neutral-400 truncate">{emp.role}</p>
            </div>
            <span className="text-xs border border-electric-blue text-electric-blue px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {emp.level}
            </span>
            <div className="w-32 h-2 bg-neutral-100 rounded-full flex-shrink-0">
              <div
                className="h-full bg-electric-blue rounded-full"
                style={{ width: `${emp.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ProjectData = (typeof PROJECTS)[number];

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
        <Calendar className="w-3.5 h-3.5" />
        <span>Created {project.created}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex items-center gap-1 border border-neutral-200 text-neutral-600 text-xs px-2 py-0.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          {project.priority}
        </span>
      </div>
      <div className="border-t border-neutral-100" />
      <div className="flex gap-6">
        <div>
          <p className="text-xl font-bold text-neutral-900">{project.allTasks}</p>
          <p className="text-xs text-neutral-400">All tasks</p>
        </div>
        <div>
          <p className="text-xl font-bold text-neutral-900">{project.activeTasks}</p>
          <p className="text-xs text-neutral-400">Active tasks</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">Assignees</span>
        <div className="flex items-center">
          {project.assignees.map((c, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full ${c} border-2 border-white flex-shrink-0 ${i > 0 ? "-ml-2" : ""}`}
            />
          ))}
          <div className="-ml-2 w-7 h-7 rounded-full bg-electric-blue border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white font-semibold">+2</span>
          </div>
        </div>
      </div>
      <div>
        <p className="font-semibold text-neutral-900 text-sm">{project.name}</p>
        <p className="text-xs text-neutral-400">{project.pn}</p>
      </div>
    </div>
  );
}

function NearestEventsCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-base font-semibold text-neutral-900 mb-4">Nearest Events</h2>
      <div className="space-y-4">
        {EVENTS.map((event) => (
          <div key={event.title} className="flex gap-3">
            <div className="w-1 rounded-full bg-electric-blue self-stretch flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 leading-snug">{event.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{event.time}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex items-center gap-1 bg-neutral-100 rounded-lg px-2 py-1 text-xs text-neutral-600">
                  <Clock className="w-3 h-3" />
                  {event.duration}
                </span>
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    event.priority === "medium" ? "bg-orange-400" : "bg-green-400"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ACTION_ICONS = {
  ArrowUp:   ArrowUp,
  Paperclip: Paperclip,
  Plus:      Plus,
} as const;

function ActivityStreamCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-neutral-900">Activity Stream</h2>
      </div>
      <div className="space-y-5">
        {ACTIVITIES.map((activity) => (
          <div key={activity.user} className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              <Avatar name={activity.user} colorClass={activity.avatar} size="lg" />
              <span className="text-[10px] text-neutral-400 text-center leading-tight max-w-[44px]">
                {activity.user.split(" ")[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              {activity.actions.map((action, i) => {
                const Icon = ACTION_ICONS[action.icon];
                return (
                  <div key={i} className="bg-neutral-100 rounded-xl p-3 flex items-start gap-2">
                    <Icon className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-700 leading-snug">{action.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
