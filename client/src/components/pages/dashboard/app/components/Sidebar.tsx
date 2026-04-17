import svgPaths from "../../imports/svg-us2yd9dv5f";

interface SidebarProps {
  onSupportClick: () => void;
}

export function Sidebar({ onSupportClick }: SidebarProps) {
  return (
    <div className="w-[200px] h-[calc(100vh-40px)] bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] relative flex flex-col">
      {/* Logo */}
      <div className="mt-10 ml-6 mb-10">
        <div className="w-[50px] h-[50px] bg-[#3f8cff] rounded-[12px] relative">
          <svg className="absolute left-[15%] top-[15%] w-[70%] h-[70%]" fill="none" viewBox="0 0 24 24">
            <path clipRule="evenodd" d={svgPaths.pef3bdc0} fill="white" fillRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-4">
          <div className="bg-[#3f8cff]/10 rounded-[10px] p-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#3f8cff] rounded-[2px]" />
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <path d={svgPaths.p2a1df500} fill="#3F8CFF" />
              </svg>
              <span className="text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#3f8cff]">
                Dashboard
              </span>
            </div>
          </div>

          <MenuItem icon={svgPaths.p252eb380} label="Projects" />
          <MenuItem icon={svgPaths.p3bbcfa30} label="Calendar" />
          <MenuItem icon={svgPaths.p1f574800} label="Vacations" />
          <MenuItem icon={svgPaths.p3efa9580} label="Employees" />
          <MenuItem icon={svgPaths.p2e3504f0} label="Messenger" />
          <MenuItem icon={svgPaths.p2fd8c000} label="Info Portal" />
        </div>
      </nav>

      {/* Support Section */}
      <div className="px-4 pb-8 mt-auto">
        <div className="bg-[#3f8cff]/10 rounded-[24px] p-4 relative overflow-hidden">
          {/* Illustration */}
          <div className="relative h-[120px] mb-4">
            <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 139 124">
              <path clipRule="evenodd" d={svgPaths.p51aa500} fill="#B0D4FF" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p1753e80} fill="#233862" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2ab87880} fill="#FFB27D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pe19e7c0} fill="#ED975D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pf8fa140} fill="#FFB27D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p37d7d080} fill="#233862" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2b4e82a0} fill="#233862" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p987f440} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p34168100} fill="#EBF3FF" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p231e7520} fill="#FFB27D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pb187bf0} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2faf5000} fill="#FFB27D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p17dbc080} fill="#FFB27D" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pca223c0} fill="#FDC748" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3acd4f00} fill="#E6B137" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p33a1c240} fill="white" fillRule="evenodd" />
            </svg>
          </div>

          {/* Support Button */}
          <button 
            onClick={onSupportClick}
            className="w-full bg-[#3f8cff] rounded-[14px] shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)] py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#3580e8] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path clipRule="evenodd" d={svgPaths.p1270f700} fill="white" fillRule="evenodd" />
            </svg>
            <span className="text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-white">
              Support
            </span>
          </button>
        </div>

        {/* Logout */}
        <button className="w-full mt-6 flex items-center justify-center gap-2 text-[#7d8592] hover:text-[#0a1629] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path clipRule="evenodd" d={svgPaths.p72bc840} fill="currentColor" fillRule="evenodd" />
          </svg>
          <span className="text-[16px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: string;
  label: string;
}

function MenuItem({ icon, label }: MenuItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#f5f6fa] rounded-[10px] transition-colors">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d={icon} fill="#7D8592" />
      </svg>
      <span className="text-[16px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
        {label}
      </span>
    </div>
  );
}
