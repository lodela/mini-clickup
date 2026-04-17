import { useState } from 'react';
import svgPaths from "../../imports/svg-xzxs846axn";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [requestSubject, setRequestSubject] = useState("Technical difficulties");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ requestSubject, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] shadow-[0px_12px_48px_0px_rgba(0,0,0,0.2)] max-w-[600px] w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8EBF1]">
          <h2 className="text-[24px] font-['Nunito_Sans:Bold',sans-serif] font-bold text-[#0a1629]">
            Need some Help?
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F6FA] transition-colors text-[#7d8592] hover:text-[#0a1629]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[300px] h-[180px]">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 139 124">
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
          </div>

          <p className="text-center text-[14px] font-['Nunito_Sans',sans-serif] text-[#7d8592] mb-6">
            Describe your question and our specialists will answer you within 24 hours.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#0a1629] mb-2">
                Request Subject
              </label>
              <div className="relative">
                <select
                  value={requestSubject}
                  onChange={(e) => setRequestSubject(e.target.value)}
                  className="w-full bg-[#F5F6FA] border border-[#E8EBF1] rounded-[12px] px-4 py-3 text-[14px] font-['Nunito_Sans',sans-serif] text-[#0a1629] outline-none focus:border-[#3f8cff] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Technical difficulties">Technical difficulties</option>
                  <option value="Account issues">Account issues</option>
                  <option value="Billing questions">Billing questions</option>
                  <option value="Feature request">Feature request</option>
                  <option value="Other">Other</option>
                </select>
                <svg 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8592] pointer-events-none" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-['Nunito_Sans:SemiBold',sans-serif] font-semibold text-[#0a1629] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some description of the request"
                rows={5}
                className="w-full bg-[#F5F6FA] border border-[#E8EBF1] rounded-[12px] px-4 py-3 text-[14px] font-['Nunito_Sans',sans-serif] text-[#0a1629] placeholder:text-[#c4cbd6] outline-none focus:border-[#3f8cff] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3f8cff] hover:bg-[#3580e8] text-white rounded-[14px] py-3 px-6 text-[16px] font-['Nunito_Sans:Bold',sans-serif] font-bold shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)] transition-colors"
            >
              Send Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
