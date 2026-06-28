import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Download, Layout, Edit3, Eye, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `Resume_${data.contact.fullName.replace(/\s+/g, '_') || 'Builder'}`,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      {/* Navigation Bar - Studio Style */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Wand2 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-slate-900 tracking-tight">Curriculum</h1>
            <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-[0.2em] leading-none mt-0.5">Studio Designer</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
          <TabButton 
            active={activeTab === 'edit'} 
            onClick={() => setActiveTab('edit')} 
            icon={<Edit3 size={16} />} 
            label="Конструктор" 
          />
          <TabButton 
            active={activeTab === 'preview'} 
            onClick={() => setActiveTab('preview')} 
            icon={<Eye size={16} />} 
            label="Предпросмотр" 
          />
        </div>

        <button 
          onClick={() => handlePrint()}
          className="group flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
          <span>Скачать PDF</span>
        </button>
      </nav>

      <main className="flex-1 overflow-hidden relative">
        {/* Subtle Background Grain/Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
        
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          
          {/* Edit Panel */}
          <div className={cn(
            "flex-1 overflow-y-auto p-6 md:p-12 transition-all duration-500",
            activeTab === 'edit' ? "opacity-100" : "hidden md:block opacity-40 grayscale-[0.5]"
          )}>
            <div className="max-w-2xl mx-auto">
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={10} /> Live Editor
                </div>
                <h2 className="text-4xl font-serif font-medium text-slate-900 mb-3">Совершенство в деталях</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">Создайте профессиональный профиль, который выделит вас среди конкурентов.</p>
              </header>
              <ResumeForm data={data} onChange={setData} />
            </div>
          </div>

          {/* Preview Panel - Fixed on Right */}
          <div className={cn(
            "flex-1 bg-slate-50 md:bg-white/40 md:backdrop-blur-sm overflow-y-auto p-6 md:p-12 flex justify-center transition-all duration-500",
            activeTab === 'preview' ? "translate-x-0" : "hidden lg:flex translate-x-4 opacity-70"
          )}>
            <div className="sticky top-0 w-full flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="origin-top scale-[0.55] sm:scale-[0.75] md:scale-[0.85] lg:scale-90 xl:scale-100"
              >
                <ResumePreview ref={previewRef} data={data} />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating help / Tips */}
      <AnimatePresence>
        {activeTab === 'edit' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 right-10 bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl max-w-xs z-50 cursor-default border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500/20 p-2.5 rounded-2xl text-indigo-400">
                <Layout size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  Совет дизайнера <Sparkles size={12} className="text-indigo-400" />
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                  Оставьте "воздух" в резюме. Не старайтесь заполнить каждый миллиметр — чистое пространство говорит о вашей организованности.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
      active ? "bg-white text-indigo-600 shadow-xl shadow-indigo-500/5 ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);
