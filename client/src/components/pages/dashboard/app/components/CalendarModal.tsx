import { useState } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const monthEvents = [
  { date: 1, events: [] },
  { date: 2, events: [] },
  { date: 3, events: [] },
  { date: 4, events: [] },
  { date: 5, events: [] },
  { date: 6, events: [] },
  { date: 7, events: [] },
  { date: 8, events: [] },
  { date: 9, events: [] },
  { date: 10, events: [] },
  { date: 11, events: [] },
  { date: 12, events: [] },
  { date: 13, events: [] },
  { date: 14, events: [{ title: "Meeting with CEO", time: "5:00 PM", type: "meeting" }] },
  { date: 15, events: [{ title: "Movie night (Tenet)", time: "5:00 PM", type: "event" }] },
  { date: 16, events: [{ title: "Presentation of the new department", time: "5:00 PM", type: "meeting" }, { title: "Anna's Birthday", time: "6:00 PM", type: "birthday" }] },
  { date: 17, events: [{ title: "Ray's Birthday", time: "2:00 PM", type: "birthday" }] },
  { date: 18, events: [] },
  { date: 19, events: [] },
  { date: 20, events: [] },
  { date: 21, events: [] },
  { date: 22, events: [] },
  { date: 23, events: [] },
  { date: 24, events: [] },
  { date: 25, events: [] },
  { date: 26, events: [] },
  { date: 27, events: [] },
  { date: 28, events: [] },
  { date: 29, events: [{ title: "Lucas's Birthday", time: "5:30 PM", type: "birthday" }] },
  { date: 30, events: [{ title: "Meeting with CTO", time: "12:00 PM", type: "meeting" }] }
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  if (!isOpen) return null;

  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-[#3f8cff]";
      case "birthday":
        return "bg-[#AB47BC]";
      case "event":
        return "bg-[#66BB6A]";
      default:
        return "bg-[#7d8592]";
    }
  };

  const selectedEvents = selectedDate ? monthEvents.find(d => d.date === selectedDate)?.events || [] : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[24px] shadow-[0px_12px_48px_0px_rgba(0,0,0,0.2)] overflow-hidden"
        style={{ width: '80vw', height: '90vh', maxWidth: '1200px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8EBF1]">
          <div>
            <h2 className="text-[28px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-1">
              Calendar Events
            </h2>
            <p className="text-[14px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
              November 2020
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F6FA] transition-colors text-[#7d8592] hover:text-[#0a1629]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-100px)] overflow-auto">
          <div className="flex gap-6 h-full">
            {/* Calendar Grid */}
            <div className="flex-1">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div 
                    key={day}
                    className="text-center text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#7d8592] py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {monthEvents.map((day) => (
                  <div 
                    key={day.date}
                    onClick={() => setSelectedDate(day.date === selectedDate ? null : day.date)}
                    className={`relative border border-[#E8EBF1] rounded-[12px] p-3 min-h-[100px] cursor-pointer transition-all hover:border-[#3f8cff] hover:shadow-md ${
                      selectedDate === day.date ? 'border-[#3f8cff] shadow-md bg-[#E3F2FD]/30' : 'bg-white'
                    } ${day.date === 16 ? 'border-[#3f8cff] border-2' : ''}`}
                  >
                    <div className={`text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold mb-2 ${
                      day.date === 16 ? 'text-[#3f8cff]' : 'text-[#0a1629]'
                    }`}>
                      {day.date}
                    </div>
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((event, idx) => (
                        <div 
                          key={idx}
                          className={`${getEventColor(event.type)} rounded-[6px] px-2 py-1 text-[10px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-white truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-[10px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592]">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Details Sidebar */}
            <div className="w-[300px] bg-[#F5F6FA] rounded-[16px] p-4">
              <h3 className="text-[18px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-4">
                Event Details
              </h3>
              
              {selectedDate ? (
                <div>
                  <div className="text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#7d8592] mb-3">
                    November {selectedDate}, 2020
                  </div>
                  {selectedEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEvents.map((event, idx) => (
                        <div 
                          key={idx}
                          className="bg-white rounded-[12px] p-4 border border-[#E8EBF1]"
                        >
                          <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)} mb-2`} />
                          <h4 className="text-[14px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-2">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[12px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-[14px] font-['Nunito_Sans',sans-serif] text-[#7d8592] py-8">
                      No events scheduled for this day
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-[14px] font-['Nunito_Sans',sans-serif] text-[#7d8592] py-8">
                  Select a date to view events
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-[#E8EBF1]">
                <div className="text-[12px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-3">
                  Event Types
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3f8cff]" />
                    <span className="text-[11px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                      Meetings
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#AB47BC]" />
                    <span className="text-[11px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                      Birthdays
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#66BB6A]" />
                    <span className="text-[11px] font-['Nunito_Sans',sans-serif] text-[#7d8592]">
                      Events
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
