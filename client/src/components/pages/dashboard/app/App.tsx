import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Workload } from './components/Workload';
import { Projects } from './components/Projects';
import { NearestEvents } from './components/NearestEvents';
import { ActivityStream } from './components/ActivityStream';
import { SupportModal } from './components/SupportModal';
import { CalendarModal } from './components/CalendarModal';

export default function App() {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-5">
      <div className="flex gap-5 max-w-[1440px] mx-auto">
        <Sidebar onSupportClick={() => setShowSupportModal(true)} />
        
        <div className="flex-1 flex flex-col gap-5">
          <Header />
          
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-5">
              <div>
                <p className="text-[14px] text-[#7d8592] mb-4 font-['Nunito_Sans',sans-serif]">
                  Welcome back, Evan!
                </p>
                <h1 className="text-[32px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629] mb-6">
                  Dashboard
                </h1>
              </div>

              <Workload />
              <Projects />
            </div>

            <div className="w-[340px] flex flex-col gap-5">
              <NearestEvents onViewAll={() => setShowCalendarModal(true)} />
              <ActivityStream />
            </div>
          </div>
        </div>
      </div>

      <SupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)} 
      />
      
      <CalendarModal 
        isOpen={showCalendarModal} 
        onClose={() => setShowCalendarModal(false)} 
      />
    </div>
  );
}
