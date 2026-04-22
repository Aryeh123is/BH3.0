import { useState, useEffect } from 'react';
import { ShoppingCart, FileText, CheckCircle2, ChevronLeft, Shield, Eye, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query } from '../firebase';
import { User } from 'firebase/auth';
import { ShopDocument } from '../types';
import { AdminShopUpload } from './AdminShopUpload';
import { DocumentViewer } from './DocumentViewer';

interface ShopProps {
  onBack: () => void;
  language: string;
  user?: User | null;
}

export function Shop({ onBack, language, user }: ShopProps) {
  const [documents, setDocuments] = useState<ShopDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ShopDocument | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'shopContent'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs: ShopDocument[] = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() } as ShopDocument);
        });
        // Sort by creation date (newest first)
        setDocuments(docs.sort((a, b) => b.createdAt - a.createdAt));
        setIsLoading(false);
      },
      (error) => {
        console.error("Shop listener failed:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-6">
          <button 
            onClick={onBack}
            className="text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">Student Shop</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
                Access premium study documents. All items are currently free during our early development phase. 
                <span className="text-indigo-500 dark:text-indigo-400 block sm:inline ml-1">Viewer only: Downloads disabled to protect creator content.</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAdmin(true)}
          className="flex items-center gap-2 px-6 py-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <Shield className="w-4 h-4" />
          Admin
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Loading the Catalog...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold leading-relaxed">
            No premium documents are available for this category yet.<br/>
            Check back later for expert study guides and cheat sheets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map(doc => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 p-8 flex flex-col group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 outline-none" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                  {doc.language}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {doc.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 line-clamp-3">
                {doc.description}
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Online
                </button>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Free during preview
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdmin && (
          <AdminShopUpload 
            onClose={() => setShowAdmin(false)}
            onSuccess={() => {
              // Successfully added a document
            }}
          />
        )}
      </AnimatePresence>

      {/* Document Viewer */}
      <AnimatePresence>
        {selectedDoc && (
          <DocumentViewer 
            document={selectedDoc}
            onClose={() => setSelectedDoc(null)}
            userEmail={user?.email || 'Guest User'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
