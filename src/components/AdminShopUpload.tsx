import { useState } from 'react';
import { db, collection, addDoc } from '../firebase';
import { X, Save, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminShopUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminShopUpload({ onClose, onSuccess }: AdminShopUploadProps) {
  const [adminCode, setAdminCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    pages: '', // Comma separated URLs
    language: 'biblical',
    price: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthenticate = () => {
    if (adminCode === 'aryehadminupload') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const docData = {
        title: formData.title,
        description: formData.description,
        language: formData.language,
        price: formData.price,
        createdAt: Date.now(),
        boughtCount: 0
      } as any;

      if (formData.content.trim()) docData.content = formData.content;
      if (formData.pages.trim()) {
        docData.pages = formData.pages.split(',').map(url => url.trim());
      }

      await addDoc(collection(db, 'shopContent'), docData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error uploading document:", err);
      setError('Failed to upload document. Check permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Shop Management</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Restricted Access</h4>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto font-medium">Please enter the admin bypass code to manage the student shop content.</p>
            
            <div className="max-w-xs mx-auto space-y-4">
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code..."
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-red-500 outline-none transition-all font-mono"
              />
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button
                onClick={handleAuthenticate}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                Unlock Management
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Document Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="e.g. Spanish GCSE Cheat Sheet"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all dark:text-white"
                >
                  <option value="biblical">Biblical Hebrew</option>
                  <option value="modern">Modern Hebrew</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all dark:text-white resize-none"
                placeholder="Brief summary of the content..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Page Image URLs (Optional)</label>
              <textarea
                value={formData.pages}
                onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                rows={2}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all dark:text-white resize-none font-mono text-xs"
                placeholder="URL 1, URL 2, URL 3..."
              />
              <p className="text-[10px] text-slate-400 pl-1 italic">For PDF-style viewing. Provide high-res image URLs separated by commas.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Document Content (Markdown - Optional if using Pages)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all dark:text-white font-mono text-sm"
                placeholder="# Header\n\n- Point 1\n- Point 2..."
              />
            </div>

            <div className="flex items-center gap-4 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="px-6 py-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Uploading...' : (
                  <>
                    <Save className="w-5 h-5" />
                    Publish to Shop
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
