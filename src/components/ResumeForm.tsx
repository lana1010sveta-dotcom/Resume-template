import React from 'react';
import { ResumeData, WorkExperience, Education, Course, Language } from '../types';
import { Plus, Trash2, User, FileText, Briefcase, GraduationCap, Award, Languages, BookOpen, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<Props> = ({ data, onChange }) => {
  const updateContact = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const updateLinks = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, links: { ...data.contact.links, [field]: value } } });
  };

  const updateSummary = (field: string, value: string) => {
    onChange({ ...data, summary: { ...data.summary, [field]: value } });
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      period: '',
      duties: '',
      achievements: ''
    };
    onChange({ ...data, workExperience: [newExp, ...data.workExperience] });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    const updated = data.workExperience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    onChange({ ...data, workExperience: updated });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      faculty: '',
      degree: '',
      graduationYear: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: crypto.randomUUID(),
      name: '',
      level: ''
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: '',
      platform: '',
      year: ''
    };
    onChange({ ...data, courses: [...data.courses, newCourse] });
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    const updated = data.courses.map(c => c.id === id ? { ...c, [field]: value } : c);
    onChange({ ...data, courses: updated });
  };

  const updateAdditional = (field: string, value: string) => {
    onChange({ ...data, additional: { ...data.additional, [field]: value } });
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Contact Section */}
      <FormSection icon={<User size={18} />} title="Персональные данные">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="ФИО" value={data.contact.fullName} onChange={(v) => updateContact('fullName', v)} placeholder="Иван Иванов" />
          <Input label="Должность" value={data.contact.jobTitle} onChange={(v) => updateContact('jobTitle', v)} placeholder="Senior Product Designer" />
          <Input label="Телефон" value={data.contact.phone} onChange={(v) => updateContact('phone', v)} placeholder="+7 (900) 123-45-67" />
          <Input label="Email" value={data.contact.email} onChange={(v) => updateContact('email', v)} placeholder="hello@studio.com" />
          <Input label="Локация" value={data.contact.city} onChange={(v) => updateContact('city', v)} placeholder="Москва, Россия" />
          <Select label="Переезд" value={data.contact.relocation} options={['Да', 'Нет', 'Обсуждаемо']} onChange={(v) => updateContact('relocation', v)} />
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input label="LinkedIn Username" value={data.contact.links.linkedin} onChange={(v) => updateLinks('linkedin', v)} />
          <Input label="GitHub Username" value={data.contact.links.github} onChange={(v) => updateLinks('github', v)} />
          <Input label="Telegram Username" value={data.contact.links.telegram} onChange={(v) => updateLinks('telegram', v)} />
          <Input label="Портфолио URL" value={data.contact.links.portfolio} onChange={(v) => updateLinks('portfolio', v)} />
        </div>
      </FormSection>

      {/* Summary Section */}
      <FormSection icon={<FileText size={18} />} title="О себе & Профиль">
        <TextArea label="Профессиональный саммари" value={data.summary.description} onChange={(v) => updateSummary('description', v)} rows={4} placeholder="Опишите ваш опыт и специализацию..." />
        <Input label="Ваше главное достижение за карьеру" value={data.summary.achievements} onChange={(v) => updateSummary('achievements', v)} placeholder="Например: Разработал дизайн-систему для 100+ проектов" />
        <TextArea label="Карьерные цели" value={data.summary.goals} onChange={(v) => updateSummary('goals', v)} placeholder="Что вы ищете в новом вызове?" />
      </FormSection>

      {/* Experience Section */}
      <FormSection 
        icon={<Briefcase size={18} />} 
        title="Опыт работы" 
        action={<button onClick={addExperience} className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"><Plus size={14} /> Добавить</button>}
      >
        <div className="space-y-6">
          {data.workExperience.map((exp) => (
            <div key={exp.id} className="group relative bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <button 
                onClick={() => onChange({ ...data, workExperience: data.workExperience.filter(e => e.id !== exp.id) })}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Компания / Проект" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                <Input label="Роль" value={exp.position} onChange={(v) => updateExperience(exp.id, 'position', v)} />
                <Input label="Период" value={exp.period} onChange={(v) => updateExperience(exp.id, 'period', v)} placeholder="2021 — 2024" />
              </div>
              <TextArea label="Обязанности" value={exp.duties} onChange={(v) => updateExperience(exp.id, 'duties', v)} />
              <Input label="Ключевой результат на этой роли" value={exp.achievements} onChange={(v) => updateExperience(exp.id, 'achievements', v)} />
            </div>
          ))}
          {data.workExperience.length === 0 && <EmptyState message="Добавьте ваше первое место работы" onClick={addExperience} />}
        </div>
      </FormSection>

      {/* Education Section */}
      <FormSection 
        icon={<GraduationCap size={18} />} 
        title="Образование"
        action={<button onClick={addEducation} className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"><Plus size={14} /> Добавить</button>}
      >
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="group border border-slate-200 bg-white p-5 rounded-xl relative hover:border-emerald-200">
               <button onClick={() => onChange({ ...data, education: data.education.filter(e => e.id !== edu.id) })} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
               <Input label="Вуз / Учреждение" value={edu.institution} onChange={(v) => {
                 const updated = data.education.map(e => e.id === edu.id ? { ...e, institution: v } : e);
                 onChange({ ...data, education: updated });
               }} />
               <div className="grid grid-cols-3 gap-4 mt-3">
                 <div className="col-span-2">
                   <Input label="Специальность / Степень" value={edu.faculty} onChange={(v) => {
                     const updated = data.education.map(e => e.id === edu.id ? { ...e, faculty: v } : e);
                     onChange({ ...data, education: updated });
                   }} />
                 </div>
                 <Input label="Год" value={edu.graduationYear} onChange={(v) => {
                   const updated = data.education.map(e => e.id === edu.id ? { ...e, graduationYear: v } : e);
                   onChange({ ...data, education: updated });
                 }} />
               </div>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Skills Section */}
      <FormSection icon={<Award size={18} />} title="Компетенции">
        <div className="space-y-6">
          <TextArea 
            label="Профессиональные навыки (Hard Skills)" 
            value={data.skills.hard.join(', ')} 
            onChange={(v) => onChange({ ...data, skills: { ...data.skills, hard: v.split(',').map(s => s.trim()).filter(Boolean) } })}
            placeholder="React, UI/UX Design, Typography, English C1..."
          />
          <TextArea 
            label="Личные качества (Soft Skills)" 
            value={data.skills.soft.join(', ')} 
            onChange={(v) => onChange({ ...data, skills: { ...data.skills, soft: v.split(',').map(s => s.trim()).filter(Boolean) } })}
            placeholder="Leadership, Problem Solving, Communication..."
          />
        </div>
      </FormSection>

      {/* Languages Section */}
      <FormSection 
        icon={<Languages size={18} />} 
        title="Языки"
        action={<button onClick={addLanguage} className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"><Plus size={14} /> Добавить</button>}
      >
        <div className="space-y-3">
          {data.languages.map(lang => (
            <div key={lang.id} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Input className="flex-1" label="Язык" value={lang.name} onChange={(v) => {
                const updated = data.languages.map(l => l.id === lang.id ? { ...l, name: v } : l);
                onChange({ ...data, languages: updated });
              }} />
              <div className="flex-1">
                <Select label="Уровень" value={lang.level} options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']} onChange={(v) => {
                  const updated = data.languages.map(l => l.id === lang.id ? { ...l, level: v } : l);
                  onChange({ ...data, languages: updated });
                }} />
              </div>
              <button 
                onClick={() => onChange({ ...data, languages: data.languages.filter(l => l.id !== lang.id) })} 
                className="mb-2 w-10 h-10 flex items-center justify-center text-slate-300 hover:bg-white hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Courses Section */}
      <FormSection
        icon={<BookOpen size={18} />}
        title="Курсы и сертификаты"
        action={<button onClick={addCourse} className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"><Plus size={14} /> Добавить</button>}
      >
        <div className="space-y-3">
          {data.courses.map((course) => (
            <div key={course.id} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Input className="flex-[2]" label="Название курса" value={course.name} onChange={(v) => updateCourse(course.id, 'name', v)} />
              <Input className="flex-1" label="Платформа" value={course.platform} onChange={(v) => updateCourse(course.id, 'platform', v)} placeholder="Stepik" />
              <Input className="w-24" label="Год" value={course.year} onChange={(v) => updateCourse(course.id, 'year', v)} placeholder="2024" />
              <button
                onClick={() => onChange({ ...data, courses: data.courses.filter(c => c.id !== course.id) })}
                className="mb-2 w-10 h-10 flex items-center justify-center text-slate-300 hover:bg-white hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {data.courses.length === 0 && <EmptyState message="Добавьте курс или сертификат" onClick={addCourse} />}
        </div>
      </FormSection>

      {/* Additional Section */}
      <FormSection icon={<Heart size={18} />} title="Дополнительно">
        <TextArea label="Хобби и интересы" value={data.additional.hobbies} onChange={(v) => updateAdditional('hobbies', v)} placeholder="Например: фотография, бег, настольные игры..." />
      </FormSection>
    </div>
  );
};

// Components for internal use
const FormSection = ({ icon, title, children, action }: { icon: React.ReactNode, title: string, children: React.ReactNode, action?: React.ReactNode }) => (
  <div className="relative">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-slate-100 rounded-xl text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      </div>
      {action}
    </div>
    <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-8 rounded-3xl shadow-sm">
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, placeholder, className }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) => (
  <div className={cn("space-y-1.5", className)}>
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
    <input 
      type="text"
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, rows?: number }) => (
  <div className="space-y-1.5 mb-4">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
    <textarea 
      rows={rows}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const Select = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
    <select 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all appearance-none cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const EmptyState = ({ message, onClick }: { message: string, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-emerald-200 transition-all group"
  >
    <div className="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors">
      <Plus size={20} className="text-slate-400 group-hover:text-emerald-500" />
    </div>
    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600">{message}</span>
  </div>
);

export default ResumeForm;
