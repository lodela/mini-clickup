import svgPaths from "./svg-ha1228pl1j";
import imgElmHeaderPhoto from "figma:asset/2be9569e282f3aa7d03c99c4ecc9abbe11271fae.png";

function Illustration() {
  return (
    <div className="absolute inset-[65.13%_13.5%_21.85%_17%]" data-name="illustration">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 139 124">
        <g id="illustration">
          <path clipRule="evenodd" d={svgPaths.p51aa500} fill="var(--fill-0, #B0D4FF)" fillRule="evenodd" id="Fill 130" />
          <path clipRule="evenodd" d={svgPaths.p1753e80} fill="var(--fill-0, #233862)" fillRule="evenodd" id="Fill 140" />
          <path clipRule="evenodd" d={svgPaths.p2ab87880} fill="var(--fill-0, #FFB27D)" fillRule="evenodd" id="Fill 141" />
          <path clipRule="evenodd" d={svgPaths.pe19e7c0} fill="var(--fill-0, #ED975D)" fillRule="evenodd" id="Fill 142" />
          <path clipRule="evenodd" d={svgPaths.pf8fa140} fill="var(--fill-0, #FFB27D)" fillRule="evenodd" id="Fill 143" />
          <path clipRule="evenodd" d={svgPaths.p37d7d080} fill="var(--fill-0, #233862)" fillRule="evenodd" id="Fill 144" />
          <path clipRule="evenodd" d={svgPaths.p2b4e82a0} fill="var(--fill-0, #233862)" fillRule="evenodd" id="Fill 145" />
          <path clipRule="evenodd" d={svgPaths.p987f440} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 146" />
          <path clipRule="evenodd" d={svgPaths.p34168100} fill="var(--fill-0, #EBF3FF)" fillRule="evenodd" id="Fill 149" />
          <path clipRule="evenodd" d={svgPaths.p231e7520} fill="var(--fill-0, #FFB27D)" fillRule="evenodd" id="Fill 150" />
          <path clipRule="evenodd" d={svgPaths.pb187bf0} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 151" />
          <path clipRule="evenodd" d={svgPaths.p2faf5000} fill="var(--fill-0, #FFB27D)" fillRule="evenodd" id="Fill 152" />
          <path clipRule="evenodd" d={svgPaths.p17dbc080} fill="var(--fill-0, #FFB27D)" fillRule="evenodd" id="Fill 153" />
          <path clipRule="evenodd" d={svgPaths.pca223c0} fill="var(--fill-0, #FDC748)" fillRule="evenodd" id="Fill 154" />
          <path clipRule="evenodd" d={svgPaths.p3acd4f00} fill="var(--fill-0, #E6B137)" fillRule="evenodd" id="Fill 155" />
          <path clipRule="evenodd" d={svgPaths.p33a1c240} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 156" />
        </g>
      </svg>
    </div>
  );
}

function MainButton() {
  return (
    <div className="absolute inset-[79.83%_18%_15.13%_17.5%]" data-name="Main button">
      <div className="absolute bg-[#3f8cff] inset-0 rounded-[14px] shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)]" data-name="elm/button/mainbutton" />
      <div className="absolute inset-[22.92%_68.99%_27.08%_12.4%]" data-name="icn/general/support/white">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/support/white">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p1270f700} fill="var(--fill-0, white)" fillRule="evenodd" id="support" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[37.21%] right-[15.5%] text-[16px] text-white top-[calc(50%-11px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function Support() {
  return (
    <div className="absolute contents inset-[65.13%_8%_12.39%_8%]" data-name="Support">
      <div className="absolute bg-[#3f8cff] inset-[69.96%_8%_12.39%_8%] opacity-10 rounded-[24px]" data-name="elm/card/lightblue" />
      <Illustration />
      <MainButton />
    </div>
  );
}

function IcnSidebarProjectsInactive() {
  return (
    <div className="absolute inset-[0_0_0_4.17%]" data-name="icn/sidebar/projects/inactive">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 24">
        <g id="icn/sidebar/projects/inactive">
          <g id="container" />
          <path d={svgPaths.p252eb380} fill="var(--fill-0, #7D8592)" id="projects" />
        </g>
      </svg>
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute inset-[13.87%_0_48.53%_8%] overflow-clip" data-name="Menu">
      <div className="absolute bg-[#3f8cff] inset-[0_6.52%_87.71%_0] opacity-10 rounded-[10px]" data-name="elm/sidebar/activesection" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[26.09%] right-[29.89%] text-[#3f8cff] text-[16px] top-[calc(50%-168px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Dashboard
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[41.85%] text-[#7d8592] text-[16px] top-[calc(50%-114px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Projects
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[38.59%] text-[#7d8592] text-[16px] top-[calc(50%-60px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Calendar
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[35.33%] text-[#7d8592] text-[16px] top-[calc(50%-6px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Vacations
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[30.98%] text-[#7d8592] text-[16px] top-[calc(50%+48px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Employees
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[32.61%] text-[#7d8592] text-[16px] top-[calc(50%+156px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Info Portal
      </p>
      <div className="absolute inset-[93.3%_82.61%_0_4.35%]" data-name="icn/sidebar/infoportal/inactive">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/infoportal/inactive">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p2fd8c000} fill="var(--fill-0, #7D8592)" fillRule="evenodd" id="Shape" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.09%] right-[30.98%] text-[#7d8592] text-[16px] top-[calc(50%+102px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Messenger
      </p>
      <div className="absolute inset-[78.21%_82.61%_15.08%_4.35%]" data-name="icn/sidebar/messenger/active">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/messenger/inactive">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p2e3504f0} fill="var(--fill-0, #7D8592)" fillRule="evenodd" id="Shape" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[2.79%_82.61%_90.5%_4.35%]" data-name="icn/sidebar/dashboard/active">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/dashboard/active">
            <g id="container" />
            <path d={svgPaths.p2a1df500} fill="var(--fill-0, #3F8CFF)" id="dashboard" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#3f8cff] inset-[0_0_87.71%_97.83%] rounded-[2px]" data-name="elm/sidebar/indicator/activesection" />
      <div className="absolute inset-[17.88%_82.61%_75.42%_4.35%]" data-name="icn/sidebar/projects/inactive">
        <IcnSidebarProjectsInactive />
      </div>
      <div className="absolute inset-[32.96%_82.61%_60.34%_4.35%]" data-name="icn/sidebar/calendar/inactive">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/calendar/inactive">
            <g id="container" />
            <path d={svgPaths.p3bbcfa30} fill="var(--fill-0, #7D8592)" id="calendar" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[48.04%_82.61%_45.25%_4.35%]" data-name="icn/sidebar/vacations/inactive">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/vacations/inactive">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p1f574800} fill="var(--fill-0, #7D8592)" fillRule="evenodd" id="vacations" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[63.13%_82.61%_30.17%_4.35%]" data-name="icn/sidebar/employees/inactive">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/employees/inactive">
            <g id="container" />
            <path d={svgPaths.p3efa9580} fill="var(--fill-0, #7D8592)" id="users" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[4.2%_63%_90.55%_12%]">
      <div className="absolute bg-[#3f8cff] inset-[4.2%_63%_90.55%_12%] rounded-[12px]" data-name="Rectangle Copy" />
    </div>
  );
}

function CompanysLogo() {
  return (
    <div className="absolute contents inset-[4.2%_63%_90.55%_12%]" data-name="Company's logo">
      <Group />
      <div className="absolute inset-[6.2%_77.5%_93.17%_19.5%]" data-name="Fill 2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <path clipRule="evenodd" d={svgPaths.pef3bdc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 2" />
        </svg>
      </div>
      <div className="absolute inset-[5.15%_66.5%_92.44%_24%]" data-name="Fill 3">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 23">
          <path clipRule="evenodd" d={svgPaths.p18d2d8c0} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 3" />
        </svg>
      </div>
      <div className="absolute inset-[6.93%_77.5%_91.39%_15.5%]" data-name="Fill 4">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
          <path clipRule="evenodd" d={svgPaths.p1186a640} fill="var(--fill-0, white)" fillRule="evenodd" id="Fill 4" />
        </svg>
      </div>
    </div>
  );
}

function SideBar() {
  return (
    <div className="absolute h-[952px] left-[20px] top-[20px] w-[200px]" data-name="Side Bar">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <Support />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32%] right-[42%] text-[#7d8592] text-[16px] top-[calc(50%+409px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Logout
      </p>
      <div className="absolute inset-[92.86%_76%_4.62%_12%]" data-name="icn/sidebar/logout">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/sidebar/logout">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p72bc840} fill="var(--fill-0, #7D8592)" fillRule="evenodd" id="logout" />
          </g>
        </svg>
      </div>
      <Menu />
      <CompanysLogo />
    </div>
  );
}

function Account() {
  return (
    <div className="absolute h-[48px] left-[1218px] top-[20px] w-[182px]" data-name="Account">
      <div className="absolute bg-white inset-0 rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <div className="absolute bottom-1/4 left-[80.77%] right-[6.04%] top-1/4" data-name="icn/general/arrow/dark/right">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/arrow/dark/right">
            <g id="container" />
            <path d={svgPaths.p11f8c980} fill="var(--fill-0, #0A1629)" id="arrow" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[18.75%_75.82%_18.75%_7.69%]" data-name="elm/header/photo">
        <div className="absolute inset-[-6.67%]">
          <img alt="" className="block max-w-none size-full" height="34" src={imgElmHeaderPhoto} width="34" />
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[29.67%] right-[26.37%] text-[#0a1629] text-[16px] top-[calc(50%-12px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Evan Yates
      </p>
    </div>
  );
}

function Notifications() {
  return (
    <div className="absolute contents left-[1146px] top-[20px]" data-name="Notifications">
      <div className="absolute bg-white left-[1146px] rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] size-[48px] top-[20px]" data-name="elm/card/main" />
      <div className="absolute left-[1158px] size-[24px] top-[32px]" data-name="icn/general/notifications">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/notifications">
            <g id="container" />
            <path d={svgPaths.p1e9db100} fill="var(--fill-0, #0A1629)" id="notifications" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TextButton() {
  return (
    <div className="absolute h-[24px] left-[259px] overflow-clip top-[118px] w-[171px]" data-name="Text button">
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[18.71%] right-0 text-[#3f8cff] text-[16px] top-[calc(50%-10px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Back to Dashboard
      </p>
      <div className="absolute inset-[0_85.96%_0_0]" data-name="icn/general/arrow/left">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/arrow/left/blue">
            <g id="container" />
            <path clipRule="evenodd" d={svgPaths.p35eae400} fill="var(--fill-0, #3F8CFF)" fillRule="evenodd" id="arrow" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ElmGeneralDuration() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        4h
      </p>
    </div>
  );
}

function Event() {
  return (
    <div className="absolute h-[129px] left-[250px] top-[227px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Presentation of the new department
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/settings/mycompany/active">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/settings/mycompany/active">
            <g id="container" />
            <path d={svgPaths.p2888c280} fill="var(--fill-0, #3F8CFF)" id="company" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[73.57%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Today | 6:00 PM
      </p>
      <ElmGeneralDuration />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/medium">
            <g id="container" />
            <path d={svgPaths.pc40a600} fill="var(--fill-0, #FFBD21)" id="priority" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#3f8cff] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration1() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        2h
      </p>
    </div>
  );
}

function Event1() {
  return (
    <div className="absolute h-[129px] left-[840px] top-[227px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Anna’s Birthday
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/events/birthday">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/events/birthday">
            <g id="container" />
            <path d={svgPaths.p3bc0f880} fill="var(--fill-0, #DE92EB)" id="Combined Shape" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[73.57%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Today | 5:00 PM
      </p>
      <ElmGeneralDuration1 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/low">
            <g id="container" />
            <path d={svgPaths.pdd51e00} fill="var(--fill-0, #0AC947)" id="Path" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#de92eb] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration2() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        1h
      </p>
    </div>
  );
}

function Event2() {
  return (
    <div className="absolute h-[129px] left-[840px] top-[704px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Meeting with CTO
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/settings/mycompany/active">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/settings/mycompany/active">
            <g id="container" />
            <path d={svgPaths.p2888c280} fill="var(--fill-0, #3F8CFF)" id="company" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[75.18%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Sep 30 | 12:00
      </p>
      <ElmGeneralDuration2 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/medium">
            <g id="container" />
            <path d={svgPaths.pc40a600} fill="var(--fill-0, #FFBD21)" id="priority" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#3f8cff] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration3() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        2h
      </p>
    </div>
  );
}

function Event3() {
  return (
    <div className="absolute h-[129px] left-[250px] top-[704px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Lucas’s Birthday
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/events/birthday">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/events/birthday">
            <g id="container" />
            <path d={svgPaths.p3bc0f880} fill="var(--fill-0, #DE92EB)" id="Combined Shape" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[72.32%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Sep 29 | 5:30 PM
      </p>
      <ElmGeneralDuration3 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/low">
            <g id="container" />
            <path d={svgPaths.pdd51e00} fill="var(--fill-0, #0AC947)" id="Path" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#de92eb] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration4() {
  return (
    <div className="absolute inset-[53.49%_4.65%_18.6%_84.08%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        4h
      </p>
    </div>
  );
}

function Event4() {
  return (
    <div className="absolute h-[129px] left-[250px] top-[386px] w-[559px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.31%] right-[35.24%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Meeting with Development Team
      </p>
      <div className="absolute inset-[21.71%_87.48%_59.69%_8.23%]" data-name="icn/events/meeting">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/events/meeting">
            <g id="container" />
            <path d={svgPaths.p27d53f00} fill="var(--fill-0, #FDC748)" id="Combined Shape" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.23%] right-[68.87%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Tomorrow | 5:00 PM
      </p>
      <ElmGeneralDuration4 />
      <div className="absolute inset-[21.71%_4.29%_59.69%_91.41%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/medium">
            <g id="container" />
            <path d={svgPaths.pc40a600} fill="var(--fill-0, #FFBD21)" id="priority" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#fdc748] inset-[18.6%_94.99%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration5() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_78.75%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_65.22%_16.67%_8.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[41.3%] right-[11.96%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        1h 30m
      </p>
    </div>
  );
}

function Event5() {
  return (
    <div className="absolute h-[129px] left-[840px] top-[386px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Ray’s Birthday
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/events/birthday">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/events/birthday">
            <g id="container" />
            <path d={svgPaths.p3bc0f880} fill="var(--fill-0, #DE92EB)" id="Combined Shape" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[68.93%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Tomorrow | 2:00 PM
      </p>
      <ElmGeneralDuration5 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/low">
            <g id="container" />
            <path d={svgPaths.pdd51e00} fill="var(--fill-0, #0AC947)" id="Path" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#de92eb] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function ElmGeneralDuration6() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        1h
      </p>
    </div>
  );
}

function Event6() {
  return (
    <div className="absolute h-[129px] left-[250px] top-[545px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Meeting with CEO
      </p>
      <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/settings/mycompany/active">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/settings/mycompany/active">
            <g id="container" />
            <path d={svgPaths.p2888c280} fill="var(--fill-0, #3F8CFF)" id="company" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[72.32%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Sep 14 | 5:00 PM
      </p>
      <ElmGeneralDuration6 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/medium">
            <g id="container" />
            <path d={svgPaths.pc40a600} fill="var(--fill-0, #FFBD21)" id="priority" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#3f8cff] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function IcnEventsBirthday() {
  return (
    <div className="absolute inset-[21.71%_87.5%_59.69%_8.21%]" data-name="icn/events/birthday">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icn/events/birthday">
          <g id="container" />
          <path d={svgPaths.p9634980} fill="var(--fill-0, #6D5DD3)" id="Combined Shape" />
        </g>
      </svg>
    </div>
  );
}

function ElmGeneralDuration7() {
  return (
    <div className="absolute inset-[53.49%_4.82%_18.6%_83.93%] overflow-clip" data-name="elm/general/duration">
      <div className="absolute bg-[#f4f9fd] inset-0 rounded-[8px]" data-name="elm/general/field/gray" />
      <div className="absolute inset-[16.67%_49.21%_16.67%_12.7%]" data-name="icn/general/time/filled">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/time/filled">
            <g id="container" />
            <path d={svgPaths.p17748d00} fill="var(--fill-0, #7D8592)" id="time" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[16px] left-[60.32%] right-[15.87%] text-[#7d8592] text-[12px] top-[calc(50%-8px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        3h
      </p>
    </div>
  );
}

function Event7() {
  return (
    <div className="absolute h-[129px] left-[840px] top-[545px] w-[560px]" data-name="Event">
      <div className="absolute bg-white inset-0 rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[24px] left-[14.29%] right-[35.36%] text-[#0a1629] text-[16px] top-[calc(50%-35.5px)]" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Movie night (Tenet)
      </p>
      <IcnEventsBirthday />
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[8.21%] right-[72.32%] text-[#91929e] text-[14px] top-[calc(50%+13.5px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Sep 15 | 5:00 PM
      </p>
      <ElmGeneralDuration7 />
      <div className="absolute inset-[21.71%_4.46%_59.69%_91.25%]" data-name="icn/general/priority/medium">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/priority/low">
            <g id="container" />
            <path d={svgPaths.pdd51e00} fill="var(--fill-0, #0AC947)" id="Path" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-[#6d5dd3] inset-[18.6%_95%_18.6%_4.29%] rounded-[2px]" data-name="elm/events/indicator" />
    </div>
  );
}

function MainButton1() {
  return (
    <div className="absolute h-[48px] left-[1252px] top-[149px] w-[148px]" data-name="Main Button">
      <div className="absolute bg-[#3f8cff] inset-0 rounded-[14px] shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)]" data-name="elm/mainbutton" />
      <div className="absolute inset-[22.92%_72.97%_27.08%_10.81%]" data-name="icn/general/add/white">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/add/white">
            <g id="container" />
            <path d={svgPaths.p2de1fc80} fill="var(--fill-0, white)" id="add" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[32.43%] right-[15.54%] text-[16px] text-white top-[calc(50%-11px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Add Event
      </p>
    </div>
  );
}

function Search() {
  return (
    <div className="absolute h-[48px] left-[250px] top-[20px] w-[412px]" data-name="Search">
      <div className="absolute bg-white inset-0 rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]" data-name="elm/card/main" />
      <div className="absolute bottom-1/4 left-[4.61%] right-[89.56%] top-1/4" data-name="icn/general/search">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="icn/general/search">
            <g id="container" />
            <path d={svgPaths.p23f94380} fill="var(--fill-0, #0A1629)" id="search" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[13.11%] right-[74.76%] text-[#7d8592] text-[16px] top-[calc(50%-11px)] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Search
      </p>
    </div>
  );
}

export default function DashboardNearestEvents() {
  return (
    <div className="bg-[#f4f9fd] relative size-full" data-name="Dashboard - Nearest events">
      <SideBar />
      <Account />
      <Notifications />
      <TextButton />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[260px] text-[#0a1629] text-[36px] top-[150px] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Nearest Events
      </p>
      <Event />
      <Event1 />
      <Event2 />
      <Event3 />
      <Event4 />
      <Event5 />
      <Event6 />
      <Event7 />
      <MainButton1 />
      <Search />
    </div>
  );
}