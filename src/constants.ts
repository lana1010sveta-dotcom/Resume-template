import { ResumeData } from './types';

// Пустой бланк — клиент заполняет поля сам, затем скачивает PDF.
export const INITIAL_DATA: ResumeData = {
  contact: {
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    city: '',
    relocation: 'Обсуждаемо',
    links: {
      linkedin: '',
      github: '',
      behance: '',
      telegram: '',
      portfolio: ''
    }
  },
  summary: {
    description: '',
    achievements: '',
    goals: ''
  },
  workExperience: [],
  education: [],
  skills: {
    hard: [],
    soft: []
  },
  courses: [],
  languages: [],
  additional: {
    portfolioLink: '',
    recommendations: '',
    hobbies: ''
  }
};
