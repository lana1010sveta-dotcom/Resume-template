import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Edit3, Eye, Sparkles, Wand2, PanelLeft, LayoutPanelTop, AlignLeft, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumeForm from './components/ResumeForm';
import ResumePreview, { ResumeVariant } from './components/ResumePreview';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { cn } from './lib/utils';

const STORAGE_KEY = 'resume-builder:data:v1';
const VARIANT_KEY = 'resume-builder:variant:v1';

// Checklist that drives the completeness meter
const COMPLETENESS_CHECKS: { label: string; test: (d: ResumeData) => boolean }[] = [
  { label: 'ФИО', test: (d) => !!d.contact.fullName.trim() },
  { label: 'должность', test: (d) => !!d.contact.jobTitle.trim() },
  { label: 'контакты', test: (d) => !!(d.contact.phone.trim() || d.contact.email.trim()) },
  { label: 'город', test: (d) => !!d.contact.city.trim() },
  { label: 'раздел «о себе»', test: (d) => !!d.summary.description.trim() },
  { label: 'опыт работы', test: (d) => d.workExperience.some((e) => e.position.trim() && e.company.trim()) },
  { label: 'образование', test: (d) => d.education.some((e) => e.institution.trim()) },
  { label: 'навыки', test: (d) => d.skills.hard.length > 0 },
  { label: 'языки', test: (d) => d.languages.some((l) => l.name.trim()) },
  { label: 'ссылку/портфолио', test: (d) => Object.values(d.contact.links).some((v) => v.trim()) },
];

export default function App() {
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...INITIAL_DATA, ...JSON.parse(raw) };
    } catch { /* ignore corrupt/blocked storage */ }
    return INITIAL_DATA;
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [variant, setVariant] = useState<ResumeVariant>(() => {
    try {
      const v = localStorage.getItem(VARIANT_KEY);
      if (v === 'sidebar' || v === 'header' || v === 'ats') return v;
    } catch { /* ignore */ }
    return 'sidebar';
  });
  const previewRef = useRef<HTMLDivElement>(null);

  // Autosave draft to the browser (per device + browser)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* quota/private mode */ }
  }, [data]);
  useEffect(() => {
    try { localStorage.setItem(VARIANT_KEY, variant); } catch { /* ignore */ }
  }, [variant]);

  const handleClear = () => {
    if (!window.confirm('Очистить все поля? Сохранённый черновик будет удалён без возможности восстановления.')) return;
    setData(INITIAL_DATA);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const completeness = useMemo(() => {
    const done = COMPLETENESS_CHECKS.filter((c) => c.test(data));
    const missing = COMPLETENESS_CHECKS.filter((c) => !c.test(data)).map((c) => c.label);
    return { percent: Math.round((done.length / COMPLETENESS_CHECKS.length) * 100), missing };
  }, [data]);

  // Fit the A4 preview to whatever width the panel has (split view or full-width tab)
  const panelRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; w: number; h: number }>({ scale: 1, w: 794, h: 1123 });

  useEffect(() => {
    const panel = panelRef.current;
    const paper = paperRef.current;
    if (!panel || !paper) return;
    const recalc = () => {
      const avail = panel.clientWidth - 24;
      const pw = paper.offsetWidth || 794;
      const scale = Math.min(1, avail / pw);
      setFit({ scale, w: pw * scale, h: paper.offsetHeight * scale });
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(panel);
    ro.observe(paper);
    return () => ro.disconnect();
  }, [variant, data, activeTab]);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `Резюме_${data.contact.fullName.replace(/\s+/g, '_') || 'CV'}`,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-3 flex justify-between items-center gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 resume-grad rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Wand2 className="text-white" size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif text-xl font-bold text-slate-900 tracking-tight leading-none">Конструктор резюме</h1>
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-[0.2em] leading-none mt-1">Live Designer</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-100">
          <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} icon={<Edit3 size={16} />} label="Конструктор" />
          <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Eye size={16} />} label="Предпросмотр" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Layout switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl border border-slate-100">
            <LayoutButton active={variant === 'sidebar'} onClick={() => setVariant('sidebar')} icon={<PanelLeft size={16} />} title="Боковой блок" />
            <LayoutButton active={variant === 'header'} onClick={() => setVariant('header')} icon={<LayoutPanelTop size={16} />} title="Цветная шапка" />
            <LayoutButton active={variant === 'ats'} onClick={() => setVariant('ats')} icon={<AlignLeft size={16} />} title="ATS — строгий макет для hh.ru и сайтов компаний" />
          </div>

          <button
            onClick={() => handlePrint()}
            title="Откроется окно печати. В поле «Принтер» выберите «Сохранить как PDF», чтобы получить файл (или обычный принтер для бумаги)."
            className="group flex items-center gap-2 resume-grad text-white px-4 lg:px-6 py-2.5 rounded-2xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-200"
          >
            <Printer size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline whitespace-nowrap">Сохранить PDF / Печать</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          {/* Edit Panel */}
          <div className={cn(
            'flex-1 overflow-y-auto p-5 md:p-12 transition-all duration-500',
            activeTab === 'edit' ? 'opacity-100' : 'hidden md:block opacity-40 grayscale-[0.5]'
          )}>
            <div className="max-w-2xl mx-auto">
              <header className="mb-10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles size={10} /> Редактор в реальном времени
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest" title="Черновик сохраняется в этом браузере автоматически">
                      <Check size={11} className="text-emerald-500" /> Автосохранение
                    </span>
                  </div>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={14} /> Очистить
                  </button>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 mb-3">Совершенство в деталях</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">Заполните поля — резюме справа обновляется на лету. Переключайте макет в шапке.</p>
                <div className="max-w-md mt-3 bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2.5">
                  <p className="flex items-center gap-2 text-[12px] font-bold text-emerald-700">
                    <Printer size={14} className="shrink-0" /> Как сохранить в PDF
                  </p>
                  <ol className="text-[12px] text-slate-500 leading-relaxed mt-1.5 space-y-0.5 list-decimal pl-5">
                    <li>Нажмите «Сохранить PDF / Печать».</li>
                    <li>В окне печати в поле <strong className="text-slate-700">«Принтер»</strong> выберите <strong className="text-slate-700">«Сохранить как PDF»</strong> (или «Microsoft Print to PDF»).</li>
                    <li>Нажмите «Сохранить» и выберите папку.</li>
                  </ol>
                  <p className="text-[11px] text-slate-400 mt-1.5">Для печати на бумаге выберите там обычный принтер.</p>
                </div>

                {/* Completeness meter */}
                <div className="max-w-md mt-4 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-slate-700">Готовность резюме</span>
                    <span className="text-[12px] font-extrabold text-emerald-600">{completeness.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full resume-grad rounded-full transition-all duration-500" style={{ width: `${completeness.percent}%` }} />
                  </div>
                  {completeness.missing.length > 0 ? (
                    <p className="text-[11px] text-slate-400 mt-2">
                      Добавьте: <span className="text-slate-500 font-medium">{completeness.missing.join(', ')}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                      <Check size={12} /> Резюме заполнено — готово к отправке
                    </p>
                  )}
                </div>

                {/* Layout hint (changes with the chosen layout) */}
                <p className="max-w-md mt-3 text-[11px] leading-relaxed text-slate-400">
                  {variant === 'ats'
                    ? 'Макет ATS: строгий, машиночитаемый. Отправляйте этот вариант через hh.ru и формы на сайтах компаний — его читают автоматические системы отбора.'
                    : 'Текущий макет — для людей (прямая отправка, Telegram, портфолио). Для откликов через hh.ru и сайты компаний переключитесь на макет ATS.'}
                </p>

                {/* Mobile layout switcher */}
                <div className="sm:hidden grid grid-cols-3 gap-2 mt-5">
                  <LayoutButton active={variant === 'sidebar'} onClick={() => setVariant('sidebar')} icon={<PanelLeft size={16} />} title="Боковой блок" wide />
                  <LayoutButton active={variant === 'header'} onClick={() => setVariant('header')} icon={<LayoutPanelTop size={16} />} title="Цветная шапка" wide />
                  <LayoutButton active={variant === 'ats'} onClick={() => setVariant('ats')} icon={<AlignLeft size={16} />} title="ATS" wide />
                </div>
              </header>
              <ResumeForm data={data} onChange={setData} />
            </div>
          </div>

          {/* Preview Panel */}
          <div
            ref={panelRef}
            className={cn(
              'flex-1 bg-slate-100/60 md:bg-white/40 md:backdrop-blur-sm overflow-auto p-4 md:p-8 flex justify-center transition-all duration-500',
              activeTab === 'preview' ? 'translate-x-0' : 'hidden lg:flex'
            )}
          >
            {/* Sized box = exact visual footprint of the scaled paper (no clip, no empty space) */}
            <div style={{ width: fit.w, height: fit.h }} className="shrink-0">
              <motion.div
                key={variant}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                ref={paperRef}
                style={{ transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}
              >
                <ResumePreview ref={previewRef} data={data} variant={variant} />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating tip — desktop only */}
      <AnimatePresence>
        {activeTab === 'edit' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="hidden lg:block fixed bottom-8 right-8 bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl max-w-xs z-50 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/20 p-2.5 rounded-2xl text-emerald-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Совет дизайнера</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                  Оставьте «воздух» в резюме. Чистое пространство читается как уверенность.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300',
      active ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const LayoutButton = ({ active, onClick, icon, title, wide }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; wide?: boolean }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'flex items-center justify-center gap-2 rounded-lg transition-all duration-300',
      wide ? 'flex-1 py-2 text-xs font-bold' : 'w-9 h-9',
      active ? 'resume-grad text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
    )}
  >
    {icon}
    {wide && <span>{title}</span>}
  </button>
);
