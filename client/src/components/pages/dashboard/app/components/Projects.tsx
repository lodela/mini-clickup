import svgPaths from "../../imports/svg-us2yd9dv5f";
import imgElmGeneralPhoto from "figma:asset/33f7475c65d29cf7beb7ff3765a21b81c70b3521.png";
import imgElmGeneralPhoto1 from "figma:asset/aeb89bc1c41a7c005c2732340fad0a00c21a8294.png";
import imgElmGeneralPhoto2 from "figma:asset/d6c3837ef00fc7178b99ff37baa91472399395c3.png";
import imgElmGeneralPhoto3 from "figma:asset/4c2955acea10dd5dbf1be61903eae27615528890.png";

const projects = [
  {
    id: "PN0001265",
    name: "Medical App (iOS native)",
    created: "Created Sep 12, 2020",
    status: "Medio",
    statusColor: "text-[#FFA726]",
    icon: "🏥",
    iconBg: "bg-gradient-to-br from-[#FFB74D] to-[#F06292]",
    allTasks: 34,
    activeTasks: 13,
    assignees: [imgElmGeneralPhoto, imgElmGeneralPhoto1, imgElmGeneralPhoto2, imgElmGeneralPhoto3]
  },
  {
    id: "PN0001221",
    name: "Food Delivery Service",
    created: "Created Sep 10, 2020",
    status: "Medio",
    statusColor: "text-[#FFA726]",
    icon: "🍔",
    iconBg: "bg-gradient-to-br from-[#4CAF50] to-[#FDD835]",
    allTasks: 50,
    activeTasks: 24,
    assignees: [imgElmGeneralPhoto, imgElmGeneralPhoto1, imgElmGeneralPhoto2]
  },
  {
    id: "PN0001290",
    name: "Food Delivery Service",
    created: "Created May 28, 2020",
    status: "Baja",
    statusColor: "text-[#66BB6A]",
    icon: "🚚",
    iconBg: "bg-gradient-to-br from-[#AB47BC] to-[#7E57C2]",
    allTasks: 23,
    activeTasks: 20,
    assignees: [imgElmGeneralPhoto, imgElmGeneralPhoto1, imgElmGeneralPhoto2, imgElmGeneralPhoto3]
  }
];

export function Projects() {
  return (
    <div className="bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
          Projects
        </h2>
        <button className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#3f8cff] hover:text-[#3580e8] transition-colors">
          View all →
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="flex items-center gap-4 p-4 rounded-[16px] border border-[#E8EBF1] hover:border-[#3f8cff]/30 hover:shadow-md transition-all"
          >
            {/* Project Icon */}
            <div className={`w-[48px] h-[48px] ${project.iconBg} rounded-[12px] flex items-center justify-center text-[24px] shadow-sm`}>
              {project.icon}
            </div>

            {/* Project Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
                  {project.id}
                </span>
              </div>
              <h3 className="text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-1">
                {project.name}
              </h3>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#7d8592]" fill="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p3bbcfa30} fill="currentColor" />
                </svg>
                <span className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                  {project.created}
                </span>
                <span className="mx-2 text-[#7d8592]">•</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill={project.statusColor.replace('text-', '')} />
                </svg>
                <span className={`text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold ${project.statusColor}`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Project Data */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mb-1">
                  All tasks
                </p>
                <p className="text-[20px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
                  {project.allTasks}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mb-1">
                  Active tasks
                </p>
                <p className="text-[20px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
                  {project.activeTasks}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mb-1">
                  Assignees
                </p>
                <div className="flex -space-x-2">
                  {project.assignees.map((assignee, index) => (
                    <img 
                      key={index}
                      src={assignee} 
                      alt="Assignee" 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
