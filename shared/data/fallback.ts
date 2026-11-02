/**
 * Hardcoded backup content, sourced from the owner's CV.
 * The public API endpoints (server/api/*.get.ts) serve this whenever the
 * database is unreachable (e.g. free-tier connection limits), so the public
 * site never goes blank. Edit here to change what the backup shows.
 */

export const fallbackProfile: Profile = {
  id: 0,
  name: 'Fadhiel Ibnu Sina',
  headline: 'Fullstack Web Developer',
  bio: 'Fullstack Web Developer with over 6 years of experience in designing, developing, and maintaining web applications using Laravel, Vue.js, and modern web technologies. Proficient in both frontend and backend development, API integration, and server management. Passionate about clean code, continuous improvement, and user-centered design.',
  avatarUrl: '/avatar.png',
  resumeUrl: '',
  email: 'fadhielsina@gmail.com',
  phone: '+62 815-4681-0673',
  location: 'Bandung, Indonesia',
  socials: { github: 'https://github.com/fadhielsina' }
}

const skill = (id: number, name: string, category: string, level: number): Skill => ({
  id,
  name,
  category,
  level,
  sortOrder: id
})

export const fallbackSkills: Skill[] = [
  skill(1, 'Vue.js', 'Frontend', 5),
  skill(2, 'JavaScript (ES6+)', 'Frontend', 5),
  skill(3, 'HTML5 & CSS3', 'Frontend', 5),
  skill(4, 'TailwindCSS', 'Frontend', 5),
  skill(5, 'Bootstrap', 'Frontend', 4),
  skill(6, 'Laravel', 'Backend', 5),
  skill(7, 'PHP', 'Backend', 5),
  skill(8, 'RESTful API', 'Backend', 5),
  skill(9, 'Node.js', 'Backend', 2),
  skill(10, 'MySQL', 'Database', 5),
  skill(11, 'PostgreSQL', 'Database', 4),
  skill(12, 'Git', 'Tools & Others', 5),
  skill(13, 'Docker', 'Tools & Others', 4),
  skill(14, 'Linux Server Management', 'Tools & Others', 4),
  skill(15, 'Nginx', 'Tools & Others', 4),
  skill(16, 'CI/CD', 'Tools & Others', 3)
]

const exp = (
  id: number,
  company: string,
  role: string,
  startDate: string,
  endDate: string | null,
  description: string
): Experience => ({
  id,
  company,
  role,
  description,
  location: '',
  startDate,
  endDate,
  isCurrent: endDate === null,
  sortOrder: id
})

export const fallbackExperiences: Experience[] = [
  exp(
    1,
    'PT Tiketux',
    'Fullstack Developer',
    'May 2025',
    null,
    'Develop and maintain fullstack web applications using Laravel and Vue.js. Build and integrate RESTful APIs and database connections. Collaborate with product and design teams to deliver high-quality features.'
  ),
  exp(
    2,
    'PT Jagat Tirta Amarta',
    'Fullstack Developer',
    '2024',
    '2025',
    'Developed corporate website and internal applications. Maintained and optimized company servers and databases. Implemented frontend features with Vue.js and backend logic using Laravel.'
  ),
  exp(
    3,
    'PT Naturalva Herba Indonesia',
    'Fullstack Developer',
    'Jun 2023',
    'Oct 2023',
    'Created and maintained web applications for user and customer management. Monitored and optimized company server performance. Ensured database integrity and security during maintenance cycles.'
  ),
  exp(
    4,
    'PT Inovasi Cipta Digital',
    'Fullstack Developer',
    '2019',
    '2024',
    'Built web applications with fullstack architecture (Laravel + Vue.js). Designed and managed API connections across systems. Supported clients with system migration and troubleshooting.'
  ),
  exp(
    5,
    'PT 4848 Express',
    'IT Support Engineer',
    '2016',
    '2018',
    'Provided technical support for system software and hardware. Diagnosed and resolved system issues to ensure smooth operations. Supported IT infrastructure setup and maintenance.'
  )
]

export const fallbackEducation: Education[] = [
  {
    id: 1,
    school: 'Sekolah Tinggi Teknologi Bandung',
    degree: "Bachelor's Degree",
    field: 'Computer Science',
    startDate: '2017',
    endDate: '2018',
    description: '',
    sortOrder: 1
  },
  {
    id: 2,
    school: 'Makers Institute',
    degree: 'Course',
    field: 'Fullstack & Android Developer Training',
    startDate: '2018',
    endDate: '2018',
    description: '',
    sortOrder: 2
  },
  {
    id: 3,
    school: 'SMA Negeri 4 Bandung',
    degree: 'High School Diploma',
    field: '',
    startDate: '2012',
    endDate: '2015',
    description: '',
    sortOrder: 3
  }
]

export const fallbackProjects: Project[] = []
