import { useState, useRef } from "react";
import imgElmGeneralPhoto from "figma:asset/33f7475c65d29cf7beb7ff3765a21b81c70b3521.png";
import imgElmGeneralPhoto1 from "figma:asset/aeb89bc1c41a7c005c2732340fad0a00c21a8294.png";
import imgElmGeneralPhoto2 from "figma:asset/d6c3837ef00fc7178b99ff37baa91472399395c3.png";
import imgElmGeneralPhoto3 from "figma:asset/4c2955acea10dd5dbf1be61903eae27615528890.png";
import imgElmGeneralPhoto4 from "figma:asset/99cb7769883928c70094dd4bbf3964bcd6f41417.png";
import imgElmGeneralPhoto5 from "figma:asset/2ab9a3ebc7c56535f93af75e56632bc0eec5e62b.png";
import imgElmGeneralPhoto6 from "figma:asset/09908d7911527eb46d5fd353642a4e4425c730fd.png";
import imgElmGeneralPhoto7 from "figma:asset/bdbffa97d0c1d2c1911abdf8db23c941efc65eab.png";

const employees = [
  {
    id: 1,
    name: "Shawn Stone",
    role: "UI/UX Designer",
    level: "Middle",
    photo: imgElmGeneralPhoto,
    extension: "x2345",
    email: "shawn.stone@company.com",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "Randy Delgado",
    role: "UI/UX Designer",
    level: "Junior",
    photo: imgElmGeneralPhoto1,
    extension: "x3456",
    email: "randy.delgado@company.com",
    phone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    name: "Emily Tyler",
    role: "Copywriter",
    level: "Middle",
    photo: imgElmGeneralPhoto2,
    extension: "x4567",
    email: "emily.tyler@company.com",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 4,
    name: "Louis Castro",
    role: "Copywriter",
    level: "Senior",
    photo: imgElmGeneralPhoto3,
    extension: "x5678",
    email: "louis.castro@company.com",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 5,
    name: "Blake Silva",
    role: "iOS Developer",
    level: "Senior",
    photo: imgElmGeneralPhoto4,
    extension: "x6789",
    email: "blake.silva@company.com",
    phone: "+1 (555) 567-8901",
  },
  {
    id: 6,
    name: "Joel Phillips",
    role: "UI/UX Designer",
    level: "Middle",
    photo: imgElmGeneralPhoto5,
    extension: "x7890",
    email: "joel.phillips@company.com",
    phone: "+1 (555) 678-9012",
  },
  {
    id: 7,
    name: "Wayne Marsh",
    role: "Copywriter",
    level: "Junior",
    photo: imgElmGeneralPhoto6,
    extension: "x8901",
    email: "wayne.marsh@company.com",
    phone: "+1 (555) 789-0123",
  },
  {
    id: 8,
    name: "Oscar Holloway",
    role: "UI/UX Designer",
    level: "Middle",
    photo: imgElmGeneralPhoto7,
    extension: "x9012",
    email: "oscar.holloway@company.com",
    phone: "+1 (555) 890-1234",
  },
];

export function Workload() {
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    [key: number]: "top" | "bottom";
  }>({});
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleMouseEnter = (employeeId: number) => {
    setHoveredEmployee(employeeId);

    const element = cardRefs.current[employeeId];
    if (element) {
      const rect = element.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Tooltip height is approximately 180px
      const tooltipHeight = 180;

      // If there's more space above or not enough space below, show tooltip on top
      if (spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
        setTooltipPosition((prev) => ({ ...prev, [employeeId]: "top" }));
      } else {
        setTooltipPosition((prev) => ({ ...prev, [employeeId]: "bottom" }));
      }
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
          Workload
        </h2>
        <button className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#3f8cff] hover:text-[#3580e8] transition-colors">
          View all →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {employees.map((employee) => {
          const isTop = tooltipPosition[employee.id] === "top";

          return (
            <div
              key={employee.id}
              ref={(el) => {
                cardRefs.current[employee.id] = el;
              }}
              className="relative"
              onMouseEnter={() => handleMouseEnter(employee.id)}
              onMouseLeave={() => setHoveredEmployee(null)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-1">
                  {employee.name}
                </h3>
                <p className="text-[14px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mb-2">
                  {employee.role}
                </p>
                <span
                  className={`text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold px-3 py-1 rounded-full ${
                    employee.level === "Senior"
                      ? "bg-[#FFF4E6] text-[#FFA726]"
                      : employee.level === "Middle"
                        ? "bg-[#E3F2FD] text-[#3F8CFF]"
                        : "bg-[#F3E5F5] text-[#AB47BC]"
                  }`}
                >
                  {employee.level}
                </span>
              </div>

              {/* Dynamic Tooltip */}
              {hoveredEmployee === employee.id && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 ${isTop ? "bottom-full mb-2" : "top-full mt-2"} z-50 pointer-events-none`}
                >
                  <div className="bg-white rounded-[12px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] p-4 min-w-[240px]">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
                          {employee.name}
                        </h4>
                        <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                          {employee.role}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
                          Ext:
                        </span>
                        <span className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#0a1629]">
                          {employee.extension}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
                          Email:
                        </span>
                        <span className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#0a1629]">
                          {employee.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
                          Phone:
                        </span>
                        <span className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#0a1629]">
                          {employee.phone}
                        </span>
                      </div>
                    </div>
                    {/* Dynamic Arrow */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] ${
                        isTop ? "-bottom-2" : "-top-2"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
