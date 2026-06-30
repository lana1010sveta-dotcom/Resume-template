import React, { forwardRef } from 'react';
import { ResumeData } from '../types';
import {
  Phone, Mail, MapPin, Github, Send, Linkedin, Globe, Award,
  Briefcase, GraduationCap, BookOpen, Heart, Sparkles, Plane
} from 'lucide-react';

export type ResumeVariant = 'sidebar' | 'header' | 'ats';

interface Props {
  data: ResumeData;
  variant?: ResumeVariant;
}

/* ---------- helpers ---------- */

const getLanguagePercentage = (level: string) => {
  const map: Record<string, number> = {
    A1: 20, A2: 40, B1: 60, B2: 80, C1: 95, C2: 100, Native: 100,
  };
  return map[level] || 50;
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || 'CV';

const hasContacts = (d: ResumeData) =>
  Boolean(d.contact.phone || d.contact.email || d.contact.city ||
    d.contact.links.telegram || d.contact.links.github || d.contact.links.linkedin || d.contact.links.portfolio);

/* ---------- infographic / shared pieces ---------- */

// Skill tags — honest, no invented percentages. onColor=white pills on the colored rail.
const SkillChips = ({ items, onColor, muted }: { items: string[]; onColor?: boolean; muted?: boolean }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((s, i) => (
      <span
        key={i}
        className={
          onColor
            ? 'text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/25'
            : muted
              ? 'text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600'
              : 'text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100'
        }
      >
        {s}
      </span>
    ))}
  </div>
);

// 5-segment language meter (level is real — chosen by the user)
const LangDots = ({ level, onColor }: { level: string; onColor?: boolean }) => {
  const pct = getLanguagePercentage(level);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((step) => {
        const active = pct >= (step / 5) * 100 - 10;
        const on = onColor
          ? active ? 'bg-white' : 'bg-white/25'
          : active ? 'resume-grad print-color' : 'bg-slate-200';
        return <div key={step} className={`h-1.5 flex-1 rounded-sm ${on}`} />;
      })}
    </div>
  );
};

const SocialItem = ({ icon, text, onColor }: { icon: React.ReactNode; text: string; onColor?: boolean }) => (
  <div className={`flex items-center gap-2.5 text-[11px] ${onColor ? 'text-white/90' : 'text-slate-500'}`}>
    <span className={`w-6 h-6 flex items-center justify-center rounded-md shrink-0 ${onColor ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
      {icon}
    </span>
    <span className="truncate">{text}</span>
  </div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-3 mb-5 break-after-avoid">
    <span className="w-7 h-7 flex items-center justify-center rounded-lg resume-grad print-color text-white shadow-sm">
      {icon}
    </span>
    <h2 className="text-[13px] font-bold uppercase tracking-[0.25em] text-slate-900">{title}</h2>
  </div>
);

const BlockTitle = ({ children, onColor }: { children: React.ReactNode; onColor?: boolean }) => (
  <h2 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${onColor ? 'text-white/70' : 'text-emerald-600'}`}>
    <span className={`h-px w-4 ${onColor ? 'bg-white/40' : 'resume-grad print-color'}`} />
    {children}
  </h2>
);

/* ---------- content sections (shared) ---------- */

const ProfileSection = ({ data }: { data: ResumeData }) =>
  (data.summary.description || data.summary.achievements || data.summary.goals) ? (
    <section className="break-inside-avoid">
      <SectionHeader icon={<Sparkles size={15} />} title="Профиль" />
      {data.summary.description && (
        <p className="text-[13px] leading-[1.7] text-slate-600 mb-3">{data.summary.description}</p>
      )}
      {data.summary.goals && (
        <p className="text-[12.5px] leading-[1.7] text-slate-600 mb-3">
          <span className="font-bold text-emerald-600">Цель: </span>{data.summary.goals}
        </p>
      )}
      {data.summary.achievements && (
        <div className="resume-grad print-color rounded-lg p-px">
          <div className="bg-white rounded-[7px] px-4 py-3">
            <p className="text-[12.5px] text-slate-700 font-medium">★ {data.summary.achievements}</p>
          </div>
        </div>
      )}
    </section>
  ) : null;

const ExperienceSection = ({ data }: { data: ResumeData }) =>
  data.workExperience.length > 0 ? (
    <section>
      <SectionHeader icon={<Briefcase size={15} />} title="Опыт работы" />
      <div className="space-y-7 pl-6">
        {data.workExperience.map((exp, i) => (
          <div key={exp.id} className="relative break-inside-avoid">
            {i < data.workExperience.length - 1 && (
              <div className="absolute -left-[18px] top-4 bottom-[-28px] w-px bg-gradient-to-b from-emerald-400 to-cyan-400" />
            )}
            <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full resume-grad print-color ring-4 ring-white" />
            <div className="flex justify-between items-baseline gap-3 mb-0.5">
              <h3 className="text-[15px] font-bold text-slate-900">{exp.position || 'Должность'}</h3>
              {exp.period && <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider whitespace-nowrap">{exp.period}</span>}
            </div>
            {exp.company && <p className="text-[13px] font-semibold text-emerald-600 mb-2">{exp.company}</p>}
            {exp.projectDescription && (
              <p className="text-[12px] text-slate-500 leading-relaxed mb-2 italic">{exp.projectDescription}</p>
            )}
            {exp.duties && (
              <div className="text-[12.5px] text-slate-600 leading-relaxed space-y-1">
                {exp.duties.split('\n').filter(Boolean).map((d, k) => (
                  <p key={k} className="flex gap-2"><span className="text-emerald-400 mt-px">›</span><span>{d}</span></p>
                ))}
              </div>
            )}
            {exp.technologies && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exp.technologies.split(',').map((t) => t.trim()).filter(Boolean).map((t, k) => (
                  <span key={k} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>
                ))}
              </div>
            )}
            {exp.achievements && (
              <div className="mt-2 flex gap-2 items-start text-[12px] text-slate-500">
                <Award size={14} className="mt-0.5 text-amber-500 shrink-0" />
                <p className="font-medium italic">{exp.achievements}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  ) : null;

const EducationSection = ({ data }: { data: ResumeData }) =>
  data.education.length > 0 ? (
    <section>
      <SectionHeader icon={<GraduationCap size={15} />} title="Образование" />
      <div className="space-y-4">
        {data.education.map((edu) => (
          <div key={edu.id} className="border-l-2 border-emerald-200 pl-4 break-inside-avoid">
            <div className="flex justify-between items-baseline gap-3">
              <h3 className="text-[14px] font-bold text-slate-800">{edu.institution}</h3>
              {edu.graduationYear && <span className="text-[11px] font-mono text-cyan-600">{edu.graduationYear}</span>}
            </div>
            <p className="text-[12.5px] text-slate-500">{[edu.degree, edu.faculty].filter(Boolean).join(' — ')}</p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

/* ---------- layout 1: colored sidebar ---------- */

const SidebarLayout = ({ data }: { data: ResumeData }) => (
  <div className="flex min-h-[297mm]">
    <aside className="w-[34%] resume-grad print-color text-white p-7 space-y-8">
      <div className="flex flex-col items-center text-center pb-2">
        <div className="w-24 h-24 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-3xl font-serif font-bold mb-4">
          {initials(data.contact.fullName)}
        </div>
        <h1 className="text-2xl font-serif font-semibold leading-tight">{data.contact.fullName || 'Ваше Имя'}</h1>
        <p className="text-[12px] uppercase tracking-[0.18em] text-white/80 mt-1">{data.contact.jobTitle || 'Должность'}</p>
      </div>

      {hasContacts(data) && (
        <section className="space-y-2.5">
          <BlockTitle onColor>Контакты</BlockTitle>
          {data.contact.phone && <SocialItem onColor icon={<Phone size={13} />} text={data.contact.phone} />}
          {data.contact.email && <SocialItem onColor icon={<Mail size={13} />} text={data.contact.email} />}
          {data.contact.city && <SocialItem onColor icon={<MapPin size={13} />} text={data.contact.city} />}
          {data.contact.relocation && <SocialItem onColor icon={<Plane size={13} />} text={`Переезд: ${data.contact.relocation}`} />}
          {data.contact.links.telegram && <SocialItem onColor icon={<Send size={13} />} text={data.contact.links.telegram} />}
          {data.contact.links.github && <SocialItem onColor icon={<Github size={13} />} text={data.contact.links.github} />}
          {data.contact.links.linkedin && <SocialItem onColor icon={<Linkedin size={13} />} text={data.contact.links.linkedin} />}
          {data.contact.links.portfolio && <SocialItem onColor icon={<Globe size={13} />} text={data.contact.links.portfolio} />}
        </section>
      )}

      {data.skills.hard.length > 0 && (
        <section>
          <BlockTitle onColor>Навыки</BlockTitle>
          <SkillChips items={data.skills.hard} onColor />
        </section>
      )}

      {data.skills.soft.length > 0 && (
        <section>
          <BlockTitle onColor>Личные качества</BlockTitle>
          <SkillChips items={data.skills.soft} onColor />
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="space-y-3">
          <BlockTitle onColor>Языки</BlockTitle>
          {data.languages.map((l) => (
            <div key={l.id}>
              <div className="flex justify-between text-[11px] font-bold text-white mb-1">
                <span>{l.name}</span>{l.level && <span className="text-white/70">{l.level}</span>}
              </div>
              <LangDots onColor level={l.level} />
            </div>
          ))}
        </section>
      )}

      {data.additional.hobbies && (
        <section>
          <BlockTitle onColor>Хобби</BlockTitle>
          <p className="text-[12px] text-white/85 leading-relaxed">{data.additional.hobbies}</p>
        </section>
      )}
    </aside>

    <main className="flex-1 p-9 space-y-8">
      <ProfileSection data={data} />
      <ExperienceSection data={data} />
      <EducationSection data={data} />
      {data.courses.length > 0 && (
        <section>
          <SectionHeader icon={<BookOpen size={15} />} title="Курсы" />
          <div className="grid grid-cols-2 gap-3">
            {data.courses.map((c) => (
              <div key={c.id} className="bg-slate-50 rounded-lg px-3 py-2 break-inside-avoid">
                <p className="text-[12px] font-bold text-slate-700">{c.name}</p>
                <p className="text-[11px] text-slate-500">{[c.platform, c.year].filter(Boolean).join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </div>
);

/* ---------- layout 2: colored header band ---------- */

const HeaderLayout = ({ data }: { data: ResumeData }) => (
  <div className="min-h-[297mm]">
    <header className="resume-grad print-color text-white px-10 py-8 flex items-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl font-serif font-bold shrink-0">
        {initials(data.contact.fullName)}
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-serif font-semibold leading-none">{data.contact.fullName || 'Ваше Имя'}</h1>
        <p className="text-[13px] uppercase tracking-[0.22em] text-white/85 mt-2">{data.contact.jobTitle || 'Должность'}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[11px] text-white/90">
          {data.contact.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{data.contact.phone}</span>}
          {data.contact.email && <span className="flex items-center gap-1.5"><Mail size={12} />{data.contact.email}</span>}
          {data.contact.city && <span className="flex items-center gap-1.5"><MapPin size={12} />{data.contact.city}</span>}
          {data.contact.relocation && <span className="flex items-center gap-1.5"><Plane size={12} />Переезд: {data.contact.relocation}</span>}
          {data.contact.links.telegram && <span className="flex items-center gap-1.5"><Send size={12} />{data.contact.links.telegram}</span>}
          {data.contact.links.portfolio && <span className="flex items-center gap-1.5"><Globe size={12} />{data.contact.links.portfolio}</span>}
        </div>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8 px-10 py-8">
      <div className="col-span-7 space-y-8">
        <ProfileSection data={data} />
        <ExperienceSection data={data} />
        <EducationSection data={data} />
      </div>

      <div className="col-span-5 space-y-8">
        {data.skills.hard.length > 0 && (
          <section>
            <BlockTitle>Навыки</BlockTitle>
            <SkillChips items={data.skills.hard} />
          </section>
        )}

        {data.skills.soft.length > 0 && (
          <section>
            <BlockTitle>Личные качества</BlockTitle>
            <SkillChips items={data.skills.soft} muted />
          </section>
        )}

        {data.languages.length > 0 && (
          <section>
            <BlockTitle>Языки</BlockTitle>
            <div className="space-y-3">
              {data.languages.map((l) => (
                <div key={l.id}>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>{l.name}</span>{l.level && <span className="text-cyan-600">{l.level}</span>}
                  </div>
                  <LangDots level={l.level} />
                </div>
              ))}
            </div>
          </section>
        )}

        {data.courses.length > 0 && (
          <section>
            <BlockTitle>Курсы</BlockTitle>
            <div className="space-y-2.5">
              {data.courses.map((c) => (
                <div key={c.id} className="flex gap-2.5 break-inside-avoid">
                  <BookOpen size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-slate-700 leading-tight">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{[c.platform, c.year].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.additional.hobbies && (
          <section>
            <BlockTitle>Хобби</BlockTitle>
            <div className="flex gap-2.5 text-[12px] text-slate-500 leading-relaxed">
              <Heart size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              <p>{data.additional.hobbies}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

/* ---------- layout 3: ATS-friendly (single column, plain text, machine-readable) ---------- */

const AtsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-5">
    <h2 className="text-[13px] font-bold uppercase tracking-wide border-b border-slate-300 pb-1 mb-2 break-after-avoid">{title}</h2>
    {children}
  </section>
);

const AtsLayout = ({ data }: { data: ResumeData }) => {
  const c = data.contact;
  const langWord = (lvl: string) => (lvl === 'Native' ? 'родной' : lvl);
  const contactLine = [
    c.phone && `Телефон: ${c.phone}`,
    c.email && `Email: ${c.email}`,
    c.city && `Город: ${c.city}`,
    c.relocation && `Переезд: ${c.relocation}`,
    c.links.telegram && `Telegram: ${c.links.telegram}`,
    c.links.github && `GitHub: ${c.links.github}`,
    c.links.linkedin && `LinkedIn: ${c.links.linkedin}`,
    c.links.portfolio && `Портфолио: ${c.links.portfolio}`,
  ].filter(Boolean);

  return (
    <div className="p-12 text-slate-900 text-[12.5px] leading-relaxed">
      <h1 className="text-[24px] font-bold leading-tight">{c.fullName || 'Ваше Имя'}</h1>
      {c.jobTitle && <p className="text-[14px] font-semibold mt-0.5">{c.jobTitle}</p>}
      {contactLine.length > 0 && <p className="mt-2 text-[12px] text-slate-700">{contactLine.join('  •  ')}</p>}

      {(data.summary.description || data.summary.goals || data.summary.achievements) && (
        <AtsSection title="О себе">
          {data.summary.description && <p>{data.summary.description}</p>}
          {data.summary.goals && <p className="mt-1">Цель: {data.summary.goals}</p>}
          {data.summary.achievements && <p className="mt-1">Ключевое достижение: {data.summary.achievements}</p>}
        </AtsSection>
      )}

      {data.workExperience.length > 0 && (
        <AtsSection title="Опыт работы">
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <p className="font-bold">
                  {[exp.position, exp.company].filter(Boolean).join(' — ')}
                  {exp.period && <span className="font-normal"> ({exp.period})</span>}
                </p>
                {exp.projectDescription && <p className="text-slate-700">{exp.projectDescription}</p>}
                {exp.duties && exp.duties.split('\n').filter(Boolean).map((d, k) => <p key={k}>– {d}</p>)}
                {exp.technologies && <p>Технологии: {exp.technologies}</p>}
                {exp.achievements && <p>Результат: {exp.achievements}</p>}
              </div>
            ))}
          </div>
        </AtsSection>
      )}

      {data.education.length > 0 && (
        <AtsSection title="Образование">
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <p className="font-bold">
                  {edu.institution}
                  {edu.graduationYear && <span className="font-normal"> ({edu.graduationYear})</span>}
                </p>
                {(edu.degree || edu.faculty) && <p>{[edu.degree, edu.faculty].filter(Boolean).join(' — ')}</p>}
              </div>
            ))}
          </div>
        </AtsSection>
      )}

      {data.skills.hard.length > 0 && (
        <AtsSection title="Профессиональные навыки">
          <p>{data.skills.hard.join(', ')}</p>
        </AtsSection>
      )}

      {data.skills.soft.length > 0 && (
        <AtsSection title="Личные качества">
          <p>{data.skills.soft.join(', ')}</p>
        </AtsSection>
      )}

      {data.languages.length > 0 && (
        <AtsSection title="Языки">
          <p>{data.languages.filter((l) => l.name).map((l) => `${l.name}${l.level ? ` — ${langWord(l.level)}` : ''}`).join(', ')}</p>
        </AtsSection>
      )}

      {data.courses.length > 0 && (
        <AtsSection title="Курсы и сертификаты">
          <div className="space-y-1">
            {data.courses.map((course) => (
              <p key={course.id} className="break-inside-avoid">
                {[course.name, [course.platform, course.year].filter(Boolean).join(', ')].filter(Boolean).join(' — ')}
              </p>
            ))}
          </div>
        </AtsSection>
      )}

      {data.additional.hobbies && (
        <AtsSection title="Дополнительно">
          <p>{data.additional.hobbies}</p>
        </AtsSection>
      )}
    </div>
  );
};

/* ---------- entry ---------- */

const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, variant = 'sidebar' }, ref) => (
  <div ref={ref} className="print-container print-color font-sans text-slate-800">
    {variant === 'sidebar' ? <SidebarLayout data={data} />
      : variant === 'header' ? <HeaderLayout data={data} />
      : <AtsLayout data={data} />}
  </div>
));

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
