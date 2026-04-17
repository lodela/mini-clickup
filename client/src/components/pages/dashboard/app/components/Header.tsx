import svgPaths from "../../imports/svg-us2yd9dv5f";
import imgElmHeaderPhoto from "figma:asset/2be9569e282f3aa7d03c99c4ecc9abbe11271fae.png";

export function Header() {
  return (
    <div className="flex items-center gap-5">
      {/* Search */}
      <div className="flex-1 max-w-[412px] bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] h-[48px] px-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-[#c4cbd6]" fill="none" viewBox="0 0 24 24">
          <path d={svgPaths.p3b6ba6c0} fill="currentColor" />
        </svg>
        <input 
          type="text" 
          placeholder="Search" 
          className="flex-1 text-[16px] font-['Nunito_Sans',sans-serif] text-[#0a1629] placeholder:text-[#c4cbd6] outline-none bg-transparent"
        />
      </div>

      {/* Date Range */}
      <div className="flex-1 max-w-[250px] bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] h-[48px] px-4 flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path d={svgPaths.p3bbcfa30} fill="#7D8592" />
        </svg>
        <span className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#0a1629]">
          Nov 16, 2020 - Dec 16, 2020
        </span>
      </div>

      {/* Notifications */}
      <button className="w-[48px] h-[48px] bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] flex items-center justify-center hover:bg-[#f5f6fa] transition-colors relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path d={svgPaths.p253fe300} fill="#0A1629" />
        </svg>
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full" />
      </button>

      {/* Account */}
      <div className="bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] h-[48px] px-4 flex items-center gap-3 cursor-pointer hover:bg-[#f5f6fa] transition-colors">
        <img 
          src={imgElmHeaderPhoto} 
          alt="Evan Yates" 
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
          Evan Yates
        </span>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path d={svgPaths.p11f8c980} fill="#0A1629" />
        </svg>
      </div>
    </div>
  );
}
