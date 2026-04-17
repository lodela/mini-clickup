import imgElmGeneralPhoto2 from "figma:asset/d6c3837ef00fc7178b99ff37baa91472399395c3.png";
import imgElmGeneralPhoto7 from "figma:asset/bdbffa97d0c1d2c1911abdf8db23c941efc65eab.png";

const activities = [
  {
    id: 1,
    user: {
      name: "Oscar Holloway",
      role: "UI/UX Designer",
      photo: imgElmGeneralPhoto7
    },
    action: "Updated the status of Mind Map task to In Progress",
    time: "2 hours ago",
    icon: "💬"
  },
  {
    id: 2,
    user: {
      name: "Oscar Holloway",
      role: "UI/UX Designer",
      photo: imgElmGeneralPhoto7
    },
    action: "Attached files to the task",
    time: "3 hours ago",
    icon: "📎"
  },
  {
    id: 3,
    user: {
      name: "Emily Tyler",
      role: "Copywriter",
      photo: imgElmGeneralPhoto2
    },
    action: "Updated the status of Mind Map task to In Progress",
    time: "5 hours ago",
    icon: "💬"
  }
];

export function ActivityStream() {
  return (
    <div className="bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] p-6 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
          Activity Stream
        </h2>
        <button className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#3f8cff] hover:text-[#3580e8] transition-colors">
          View more ↓
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <img 
              src={activity.user.photo} 
              alt={activity.user.name} 
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
                  {activity.user.name}
                </h3>
                <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                  {activity.user.role}
                </p>
              </div>
              <div className="bg-[#E3F2FD] rounded-[12px] p-3 flex items-start gap-2">
                <span className="text-[16px] flex-shrink-0">{activity.icon}</span>
                <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#0a1629] leading-relaxed">
                  {activity.action}
                </p>
              </div>
              <p className="text-[11px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mt-2">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
