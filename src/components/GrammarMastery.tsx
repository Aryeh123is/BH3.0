import React, { useState, useMemo } from 'react';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, ChevronRight, Info, Book, SpellCheck, Zap, FileText, Sparkles, Brain, Send, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GRAMMAR_CURRICULUM, GrammarContent, GrammarSection } from '../data/grammarData';

interface GrammarMasteryProps {
  onBack: () => void;
  language: string;
  devMode?: boolean;
}

type TabType = 'overview' | string;

export function GrammarMastery({ onBack, language, devMode }: GrammarMasteryProps) {
  const [activeSection, setActiveSection] = useState<TabType>('overview');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const curriculum = useMemo(() => {
    return GRAMMAR_CURRICULUM[language] || GRAMMAR_CURRICULUM['Spanish'] || [];
  }, [language]);

  const activeSectionData = useMemo(() => {
    if (activeSection === 'overview') return null;
    return curriculum.find(s => s.id === activeSection);
  }, [activeSection, curriculum]);

  const allTopics = useMemo(() => {
    const topics: (GrammarContent & { sectionId: string; sectionLabel: string })[] = [];
    curriculum.forEach(section => {
      section.items.forEach(item => {
        topics.push({ ...item, sectionId: section.id, sectionLabel: section.label });
      });
    });
    return topics;
  }, [curriculum]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return allTopics.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) || 
      item.content?.toLowerCase().includes(query)
    );
  }, [searchQuery, allTopics]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              {language} Grammar
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${language} grammar...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-6">
        {/* Mobile Search */}
        <div className="sm:hidden mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search grammar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 mb-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                OFFICIAL SPECIFICATION ALIGNED
              </div>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Master {language} <br/> Language Patterns</h2>
            <p className="text-indigo-50 font-bold opacity-90 max-w-xl text-lg leading-relaxed">
              Every verb, noun, and syntax rule for {language}, decoded and organized for rapid mastery.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4">
            <Zap className="w-64 h-64 -rotate-12" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide px-1">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all border ${
              activeSection === 'overview' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-500 scale-105' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600'
            }`}
          >
            <Book className="w-4 h-4" />
            Home
          </button>
          
          {curriculum.map((section) => {
            const icons: Record<string, any> = { Zap, Layers, SpellCheck, Info, FileText, Book };
            const Icon = icons[section.icon] || Info;
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setSelectedTopic(null);
                }}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all border ${
                  activeSection === section.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-500 scale-105' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {searchQuery.trim() ? (
            <motion.div 
              key="search-results"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                Search Results for "{searchQuery}"
              </h2>
              {filteredData && filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredData.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(item.sectionId);
                        setSearchQuery('');
                        setSelectedTopic(item.id);
                      }}
                      className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-left hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-tighter bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                          {item.sectionLabel}
                        </span>
                        <h3 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold line-clamp-2">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No concepts found</h3>
                  <p className="text-slate-500 font-bold">Try searching for keywords related to {language} grammar.</p>
                </div>
              )}
            </motion.div>
          ) : activeSection === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {curriculum.map((section, i) => {
                const icons: Record<string, any> = { Zap, Layers, SpellCheck, Info, FileText, Book };
                const Icon = icons[section.icon] || Info;
                return (
                  <button 
                    key={i}
                    onClick={() => setActiveSection(section.id)}
                    className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-left hover:shadow-2xl hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{section.label}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">Explore {section.items.length} modules on {section.label.toLowerCase()}.</p>
                  </button>
                );
              })}
            </motion.div>
          ) : (
             <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight capitalize">
                {activeSectionData?.label}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {activeSectionData?.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTopic(selectedTopic === item.id ? null : item.id)}
                    className={`p-8 rounded-[2rem] border text-left transition-all ${
                      selectedTopic === item.id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-lg' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{item.title}</h4>
                        <p className={`text-sm font-bold transition-colors ${selectedTopic === item.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                      {language === 'Biblical Hebrew' && item.details?.example && (
                        <div className="text-3xl font-hebrew text-indigo-600 dark:text-indigo-400 font-black">
                          {item.details.example.split(' ')[0]}
                        </div>
                      )}
                    </div>

                    {selectedTopic === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-indigo-500/20 space-y-6"
                      >
                        {item.content && (
                           <div>
                            <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-widest">Guide & Explanation</h5>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <Markdown>{item.content}</Markdown>
                            </div>
                          </div>
                        )}

                        {item.details?.description && (
                          <div>
                            <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-widest">Structure</h5>
                            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{item.details.description}</p>
                          </div>
                        )}

                        {item.details?.recognize && (
                          <div className="p-4 bg-indigo-600/5 dark:bg-indigo-400/5 rounded-2xl border border-indigo-500/20">
                            <h5 className="font-black text-indigo-900 dark:text-indigo-100 mb-2 uppercase text-[10px] tracking-widest flex items-center gap-2">
                              <Info className="w-3 h-3" /> Diagnostics (Identification)
                            </h5>
                            <p className="text-indigo-800 dark:text-indigo-200 font-bold text-sm">{item.details.recognize}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
