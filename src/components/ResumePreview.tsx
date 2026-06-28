import React, { forwardRef } from 'react';
import { ResumeData } from '../types';
import { Phone, Mail, MapPin, Github, Send, Linkedin, Globe, Award, Briefcase, GraduationCap, Languages, Sparkles } from 'lucide-react';

interface Props {
  data: ResumeData;
}

const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  // Helper to determine skill level (mock logic based on index for variety in preview)
  const getSkillLevel = (index: number) => {
    const levels = [100, 90, 85, 95, 80];
    return levels[index % levels.length];
  };

  const getLanguagePercentage = (level: string) => {
    const map: Record<string, number> = {
      'A1': 20, 'A2': 40, 'B1': 60, 'B2': 80, 'C1': 95, 'C2': 100, 'Native': 100
    };
    return map[level] || 50;
  };

  return (
    <div ref={ref} className="print-container font-sans text-slate-800 selection:bg-indigo-100">
      {/* Header - Elegant Layout */}
      <header className="grid grid-cols-12 gap-8 items-end mb-12 relative">
        <div className="col-span-8">
          <h1 className="text-5xl font-serif font-light text-slate-900 mb-2 leading-tight">
            {data.contact.fullName || 'Ваше Имя'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-indigo-600"></span>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-[0.2em]">
              {data.contact.jobTitle || 'Желаемая должность'}
            </p>
          </div>
        </div>
        
        <div className="col-span-4 text-right space-y-2">
          {data.contact.phone && (
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-medium">
              <span>{data.contact.phone}</span>
              <Phone size={12} className="text-slate-300" />
            </div>
          )}
          {data.contact.email && (
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-medium">
              <span>{data.contact.email}</span>
              <Mail size={12} className="text-slate-300" />
            </div>
          )}
          {data.contact.city && (
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-medium">
              <span>{data.contact.city}</span>
              <MapPin size={12} className="text-slate-300" />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="col-span-8 space-y-12">
          
          {/* Summary */}
          {(data.summary.description || data.summary.achievements) && (
            <section>
              <SectionHeader icon={<Sparkles size={16} />} title="Профиль" />
              <div className="pl-7">
                <p className="text-[13px] leading-[1.7] text-slate-600 mb-4 font-light tracking-wide">
                  {data.summary.description}
                </p>
                {data.summary.achievements && (
                  <div className="bg-slate-50 border-l-2 border-indigo-500 p-4 rounded-r-md">
                    <p className="text-[13px] text-slate-700 font-medium italic">
                      "{data.summary.achievements}"
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.workExperience.length > 0 && (
            <section>
              <SectionHeader icon={<Briefcase size={16} />} title="Опыт работы" />
              <div className="space-y-10 pl-7">
                {data.workExperience.map((exp) => (
                  <div key={exp.id} className="relative">
                    {/* Vertical line connector */}
                    <div className="absolute -left-7 top-2 bottom-[-40px] w-px bg-slate-100"></div>
                    <div className="absolute -left-[31px] top-2 w-2 h-2 rounded-full border-2 border-indigo-500 bg-white"></div>
                    
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">{exp.position}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.period}</span>
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 mb-3">{exp.company}</p>
                    <div className="text-[13px] text-slate-600 leading-relaxed space-y-2">
                      {exp.duties.split('\n').map((duty, i) => (
                        <p key={i}>{duty}</p>
                      ))}
                    </div>
                    {exp.achievements && (
                      <div className="mt-3 flex gap-3 items-start text-[12px] text-slate-500">
                        <Award size={14} className="mt-0.5 text-amber-500 shrink-0" />
                        <p className="font-medium italic">{exp.achievements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <SectionHeader icon={<GraduationCap size={16} />} title="Образование" />
              <div className="space-y-6 pl-7">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-slate-800">{edu.institution}</h3>
                      <span className="text-[11px] font-mono text-slate-400">{edu.graduationYear}</span>
                    </div>
                    <p className="text-[13px] text-slate-500">{edu.degree} — {edu.faculty}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-10">
          
          {/* Social Icons Infographic */}
          <section>
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Контакты</h2>
             <div className="space-y-4">
                {data.contact.links.linkedin && <SocialItem icon={<Linkedin size={14} />} text={data.contact.links.linkedin} />}
                {data.contact.links.github && <SocialItem icon={<Github size={14} />} text={data.contact.links.github} />}
                {data.contact.links.telegram && <SocialItem icon={<Send size={14} />} text={data.contact.links.telegram} />}
                {data.contact.links.portfolio && <SocialItem icon={<Globe size={14} />} text={data.contact.links.portfolio} />}
             </div>
          </section>

          {/* Hard Skills - Dots Infographic */}
          {data.skills.hard.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Навыки</h2>
              <div className="space-y-4">
                {data.skills.hard.slice(0, 8).map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5 uppercase">
                      <span>{skill}</span>
                      <span className="text-slate-400">{getSkillLevel(idx)}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${getSkillLevel(idx)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages - Progress Infographic */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Языки</h2>
              <div className="space-y-5">
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1 uppercase">
                      <span>{lang.name}</span>
                      <span className="text-indigo-500">{lang.level}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((step) => {
                        const threshold = (step / 5) * 100;
                        const active = getLanguagePercentage(lang.level) >= (threshold - 10);
                        return (
                          <div 
                            key={step} 
                            className={`h-1.5 flex-1 rounded-sm transition-colors duration-500 ${active ? 'bg-indigo-500' : 'bg-slate-100'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Courses */}
          {data.courses.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Курсы</h2>
              <div className="space-y-4">
                {data.courses.map((course) => (
                  <div key={course.id} className="border-l-2 border-slate-100 pl-3">
                    <p className="text-[11px] font-bold text-slate-700">{course.name}</p>
                    <p className="text-[10px] text-slate-500">{course.platform}, {course.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {data.additional.hobbies && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Хобби</h2>
              <p className="text-[12px] text-slate-500 italic leading-relaxed font-light">
                {data.additional.hobbies}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
      {icon}
    </div>
    <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">{title}</h2>
  </div>
);

const SocialItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">
    <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 group-hover:text-indigo-500">
      {icon}
    </div>
    <span className="truncate max-w-[150px]">{text}</span>
  </div>
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
