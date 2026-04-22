import { useState, useEffect } from 'react';
import { X, Printer, ChevronLeft, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ShopDocument } from '../types';

interface DocumentViewerProps {
  document: ShopDocument; // keeping the prop name same for external usage
  onClose: () => void;
  isUnlocked?: boolean;
  userEmail?: string;
}

export function DocumentViewer({ document: shopDoc, onClose, isUnlocked = true, userEmail = 'Protected Content' }: DocumentViewerProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handlePrint = () => {
    if (!isUnlocked) return;
    window.print();
  };

  // Anti-piracy listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common screenshot shortcuts (PrintScreen, Cmd+Shift+4, Cmd+Shift+3)
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === '4' || e.key === '3'))) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    const handleVisibilityChange = () => {
      if (window.document.visibilityState === 'hidden') {
        setIsBlurred(true);
      }
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-slate-950/98 flex flex-col pt-safe select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header - Hidden during print */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md print:hidden shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            SECURE VIEW
          </div>
          {isUnlocked && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[130] bg-red-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-2xl"
          >
            <AlertCircle className="w-5 h-5" />
            Screenshots are prohibited
          </motion.div>
        )}
      </AnimatePresence>

      {!isUnlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-500">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Content Locked</h2>
          <p className="text-slate-400 max-w-sm font-medium">Please purchase this document in the shop to view the full content and print it.</p>
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${isBlurred ? 'blur-2xl scale-[0.98] grayscale' : ''}`}>
          <div className="max-w-[21cm] mx-auto my-8 sm:my-12 flex flex-col gap-8 print:gap-0 print:m-0 print:max-w-none relative">
            {/* If document is image-based (PDF style) */}
            {shopDoc.pages && shopDoc.pages.length > 0 ? (
              shopDoc.pages.map((pageUrl, index) => (
                <div 
                  key={`doc-page-${shopDoc.id}-${index}`} 
                  className="bg-white shadow-2xl relative overflow-hidden group print:shadow-none print:m-0 print:bg-white"
                  style={{ aspectRatio: '210/297' }} // A4 Ratio
                >
                  <img 
                    src={pageUrl} 
                    alt={`Page ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain pointer-events-none print:w-full print:h-auto"
                    onDragStart={(e) => e.preventDefault()}
                  />
                  {/* Dynamic Watermark Overlay (Not in print) */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-3 gap-8 p-12 rotate-12 print:hidden overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <span key={`wm-${index}-${i}`} className="text-slate-900 text-sm font-black whitespace-nowrap uppercase tracking-tighter">
                        {userEmail} • BH KEYWORDS
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Fallback to Markdown Viewer */
              <div className="bg-white p-[2cm] shadow-2xl min-h-[29.7cm] rounded-sm relative print:shadow-none print:p-0 print:bg-white">
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-4 gap-4 p-8 rotate-12 print:hidden overflow-hidden">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span key={`wm-md-${i}`} className="text-slate-900 text-[10px] font-black whitespace-nowrap uppercase tracking-tighter shrink-0">
                      {userEmail}
                    </span>
                  ))}
                </div>
                <div className="relative z-10 markdown-body prose prose-slate max-w-none print:prose-xl">
                  <div className="mb-12 border-b-2 border-slate-100 pb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">{shopDoc.title}</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      {shopDoc.language} Keywords • {new Date(shopDoc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-slate-800 leading-relaxed printable-content">
                    <ReactMarkdown>{shopDoc.content || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print & Protection Styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          .print\\:hidden, header, nav, footer, button, .blur-2xl { display: none !important; }
          
          /* Force page break behavior */
          .bg-white {
            page-break-after: always !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
          }

          /* Ensure images fill width and don't overflow pages */
          img { 
            width: 100% !important; 
            height: auto !important; 
            max-height: 29.7cm !important;
            object-fit: contain !important;
            display: block !important;
          }

          /* Markdown Printing */
          .printable-content {
            display: block !important;
            color: black !important;
          }
          .markdown-body {
            padding: 2cm !important;
            background: white !important;
          }
        }

        /* Prevent Selection and Dragging */
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }

        /* Custom Scrollbar for better UX while keeping no-scrollbar look on pages */
        .no-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Markdown Styling */
        .markdown-body h1 { font-weight: 900; margin-bottom: 2rem; color: #0f172a; }
        .markdown-body h2 { font-weight: 800; margin-top: 3rem; margin-bottom: 1.5rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
        .markdown-body p { margin-bottom: 1.25rem; font-size: 1.1rem; line-height: 1.75; color: #334155; }
        .markdown-body ul { list-style-type: disc; margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .markdown-body li { margin-bottom: 0.5rem; }
      `}</style>
    </motion.div>
  );
}
