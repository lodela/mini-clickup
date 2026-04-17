import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Presentation of the new department",
    time: "Today | 5:00 PM",
    duration: "4h",
    type: "meeting",
    icon: "📄",
    color: "blue",
    borderColor: "border-l-[#3f8cff]",
    bgColor: "bg-[#E3F2FD]",
    description:
      "Join us for an important presentation introducing our new department structure and team members.",
  },
  {
    id: 2,
    title: "Anna's Birthday",
    time: "Today | 6:00 PM",
    duration: "4h",
    type: "birthday",
    icon: "🎂",
    color: "purple",
    borderColor: "border-l-[#AB47BC]",
    bgColor: "bg-[#F3E5F5]",
    description:
      "Celebrate Anna's birthday with the team! Cake and refreshments will be provided.",
  },
  {
    id: 3,
    title: "Ray's Birthday",
    time: "Tomorrow | 2:00 PM",
    duration: "4h",
    type: "birthday",
    icon: "🎂",
    color: "purple",
    borderColor: "border-l-[#AB47BC]",
    bgColor: "bg-[#F3E5F5]",
    description: "Join us in celebrating Ray's special day with the team.",
  },
];

interface NearestEventsProps {
  onViewAll: () => void;
}

export function NearestEvents({ onViewAll }: NearestEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] p-6 h-[400px] flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
          Nearest Events
        </h2>
        <button
          onClick={onViewAll}
          className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#3f8cff] hover:text-[#3580e8] transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <div
              onClick={() =>
                setSelectedEvent(selectedEvent === event.id ? null : event.id)
              }
              className={`border-l-4 ${event.borderColor} bg-[#F5F6FA] rounded-[12px] p-4 cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 ${event.bgColor} rounded-[8px] flex items-center justify-center text-[20px]`}
                >
                  {event.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M12 6V12L16 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{event.time}</span>
                    <span className="ml-2 bg-[#E8EBF1] px-2 py-0.5 rounded-full text-[11px]">
                      {event.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Persistent Tooltip - Positioned to the right */}
            {selectedEvent === event.id && (
              <div
                className="fixed z-[100]"
                style={{
                  left: "calc(100vw - 320px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  maxWidth: "280px",
                }}
              >
                <div className="bg-white rounded-[12px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.2)] p-4 border border-[#E8EBF1]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${event.bgColor} rounded-[8px] flex items-center justify-center text-[24px]`}
                      >
                        {event.icon}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
                          {event.title}
                        </h4>
                        <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                          {event.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(null);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F5F6FA] transition-colors text-[#7d8592] hover:text-[#0a1629] flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592] leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#E8EBF1]">
                    <div className="flex items-center justify-between text-[11px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold">
                      <span className="text-[#7d8592]">Duration:</span>
                      <span className="text-[#0a1629]">{event.duration}</span>
                    </div>
                  </div>
                  {/* Arrow pointing left */}
                  <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-l border-b border-[#E8EBF1]" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
