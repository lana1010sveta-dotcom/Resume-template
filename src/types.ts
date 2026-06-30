export interface ContactInfo {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  city: string;
  relocation: string;
  links: {
    linkedin: string;
    github: string;
    behance: string;
    telegram: string;
    portfolio: string;
  };
}

export interface Summary {
  description: string;
  achievements: string;
  goals: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  projectDescription: string;
  duties: string;
  technologies: string;
  achievements: string;
}

export interface Education {
  id: string;
  institution: string;
  faculty: string;
  degree: string;
  graduationYear: string;
}

export interface Skills {
  hard: string[];
  soft: string[];
}

export interface Course {
  id: string;
  name: string;
  platform: string;
  year: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface AdditionalInfo {
  portfolioLink: string;
  recommendations: string;
  hobbies: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: Summary;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
  courses: Course[];
  languages: Language[];
  additional: AdditionalInfo;
}
