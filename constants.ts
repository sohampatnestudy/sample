import { NewsArticle, Chapter, Subject, InstituteSyllabus } from './types';

export const NEWS_ARTICLES: NewsArticle[] = [
  { id: 1, title: "NTA Releases JEE Main 2025 Syllabus, Key Changes Noted", source: "The Times of India", date: "2024-07-20T10:30:00Z", timestamp: 1721471400, category: "JEE", credibility: 5, content: "The National Testing Agency (NTA) has officially released the syllabus for the JEE Main 2025 examination. Key changes include minor adjustments in the Chemistry section, with a focus on environmental chemistry.", imageUrl: "https://images.unsplash.com/photo-1581092921462-20526a43889b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
  { id: 2, title: "Top 5 Mistakes to Avoid While Preparing for JEE Advanced", source: "Careers360", date: "2024-07-19T14:30:00Z", timestamp: 1721399400, category: "JEE", credibility: 4, content: "Experts highlight common pitfalls for JEE Advanced aspirants. These include neglecting NCERT textbooks, ignoring mock tests, and poor time management.", imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
  { id: 3, title: "New Education Policy to be Implemented from Next Academic Year", source: "Hindustan Times", date: "2024-07-20T09:15:00Z", timestamp: 1721466900, category: "Education Policy", credibility: 5, content: "The second phase of the National Education Policy (NEP) implementation focuses on digital infrastructure in universities and skill-based curriculum changes.", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
  { id: 4, title: "ISRO's Chandrayaan-4 Mission Gets Green Light", source: "The Hindu", date: "2024-07-18T18:00:00Z", timestamp: 1721325600, category: "Current Affairs", credibility: 4, content: "The Indian Space Research Organisation's next lunar mission, Chandrayaan-4, has been approved and aims for a soft landing on the far side of the moon.", imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256ec346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1327&q=80" }
];


export const SUBJECT_CHAPTERS: { [key in Subject]: Chapter[] } = {
  [Subject.Physics]: [
    { name: 'Kinematics', topics: ['Motion in 1D', 'Projectile Motion'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Laws of Motion', topics: ['Newton\'s Laws', 'Friction'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Work, Energy, Power', topics: ['Work-Energy Theorem', 'Collisions'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Rotational Motion', topics: ['Moment of Inertia', 'Torque'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Electrostatics', topics: ['Coulomb\'s Law', 'Gauss\'s Law'], notesUrl: '#', practiceUrl: '#' },
  ],
  [Subject.Chemistry]: [
    { name: 'Chemical Bonding', topics: ['VSEPR Theory', 'Hybridization'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Thermodynamics', topics: ['Laws of Thermodynamics', 'Enthalpy'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Equilibrium', topics: ['Chemical Equilibrium', 'Ionic Equilibrium'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Organic Chemistry - Basics', topics: ['Nomenclature', 'Isomerism'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Coordination Compounds', topics: ['Crystal Field Theory', 'Werner\'s Theory'], notesUrl: '#', practiceUrl: '#' },
  ],
  [Subject.Mathematics]: [
    { name: 'Calculus', topics: ['Limits, Continuity', 'Differentiation', 'Integration'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Coordinate Geometry', topics: ['Straight Lines', 'Circles', 'Conic Sections'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Vectors & 3D Geometry', topics: ['Dot & Cross Product', 'Lines & Planes'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Algebra', topics: ['Quadratic Equations', 'Complex Numbers', 'Matrices'], notesUrl: '#', practiceUrl: '#' },
    { name: 'Probability & Statistics', topics: ['Conditional Probability', 'Binomial Theorem'], notesUrl: '#', practiceUrl: '#' },
  ]
};

export const HISTORICAL_WEIGHTAGE_DATA: { [key in Subject]: { [year: string]: { [chapter: string]: number } } } = {
    [Subject.Physics]: {
        '2023': { 'Kinematics': 8, 'Laws of Motion': 7, 'Work, Energy, Power': 6, 'Rotational Motion': 9, 'Electrostatics': 10 },
        '2022': { 'Kinematics': 7, 'Laws of Motion': 8, 'Work, Energy, Power': 7, 'Rotational Motion': 8, 'Electrostatics': 11 },
        '2021': { 'Kinematics': 9, 'Laws of Motion': 6, 'Work, Energy, Power': 8, 'Rotational Motion': 7, 'Electrostatics': 9 },
    },
    [Subject.Chemistry]: {
        '2023': { 'Chemical Bonding': 12, 'Thermodynamics': 8, 'Equilibrium': 7, 'Organic Chemistry - Basics': 10, 'Coordination Compounds': 9 },
        '2022': { 'Chemical Bonding': 11, 'Thermodynamics': 9, 'Equilibrium': 8, 'Organic Chemistry - Basics': 11, 'Coordination Compounds': 8 },
        '2021': { 'Chemical Bonding': 13, 'Thermodynamics': 7, 'Equilibrium': 9, 'Organic Chemistry - Basics': 9, 'Coordination Compounds': 10 },
    },
    [Subject.Mathematics]: {
        '2023': { 'Calculus': 30, 'Coordinate Geometry': 20, 'Vectors & 3D Geometry': 15, 'Algebra': 25, 'Probability & Statistics': 10 },
        '2022': { 'Calculus': 32, 'Coordinate Geometry': 18, 'Vectors & 3D Geometry': 16, 'Algebra': 24, 'Probability & Statistics': 10 },
        '2021': { 'Calculus': 28, 'Coordinate Geometry': 22, 'Vectors & 3D Geometry': 14, 'Algebra': 26, 'Probability & Statistics': 10 },
    }
};

const allChapters = Array.from(new Set(Object.values(SUBJECT_CHAPTERS).flat().map(c => c.name)));

export const COACHING_SYLLABI: InstituteSyllabus[] = [
    {
        name: "Allen Kota",
        chapters: ['Kinematics', 'Laws of Motion', 'Chemical Bonding', 'Calculus', 'Coordinate Geometry', 'Organic Chemistry - Basics', 'Work, Energy, Power', 'Thermodynamics', 'Equilibrium', 'Algebra', 'Rotational Motion', 'Electrostatics'],
        timeline: [
            { week: 1, chapters: ['Kinematics'] },
            { week: 2, chapters: ['Laws of Motion', 'Chemical Bonding'] },
            { week: 3, chapters: ['Calculus'] },
            { week: 4, chapters: ['Coordinate Geometry', 'Organic Chemistry - Basics'] },
        ]
    },
    {
        name: "Aakash Institute",
        chapters: ['Chemical Bonding', 'Kinematics', 'Calculus', 'Laws of Motion', 'Organic Chemistry - Basics', 'Coordinate Geometry', 'Vectors & 3D Geometry', 'Thermodynamics', 'Rotational Motion'],
        timeline: [
            { week: 1, chapters: ['Chemical Bonding'] },
            { week: 2, chapters: ['Kinematics', 'Calculus'] },
            { week: 3, chapters: ['Laws of Motion'] },
            { week: 4, chapters: ['Organic Chemistry - Basics', 'Coordinate Geometry'] },
        ]
    },
    {
        name: "FIITJEE",
        chapters: ['Calculus', 'Electrostatics', 'Chemical Bonding', 'Kinematics', 'Coordinate Geometry', 'Algebra', 'Thermodynamics', 'Laws of Motion', 'Work, Energy, Power', 'Probability & Statistics'],
        timeline: [
            { week: 1, chapters: ['Calculus'] },
            { week: 2, chapters: ['Electrostatics', 'Chemical Bonding'] },
            { week: 3, chapters: ['Kinematics'] },
            { week: 4, chapters: ['Coordinate Geometry', 'Algebra'] },
        ]
    },
    {
        name: "Physics Wallah",
        chapters: allChapters,
        timeline: [
            { week: 1, chapters: ['Kinematics', 'Chemical Bonding'] },
            { week: 2, chapters: ['Calculus'] },
            { week: 3, chapters: ['Laws of Motion', 'Organic Chemistry - Basics'] },
            { week: 4, chapters: ['Work, Energy, Power'] },
        ]
    },
    {
        name: "Bakliwal Tutorials",
        chapters: allChapters,
        timeline: [
            { week: 1, chapters: ['Calculus'] },
            { week: 2, chapters: ['Coordinate Geometry'] },
            { week: 3, chapters: ['Kinematics', 'Chemical Bonding'] },
            { week: 4, chapters: ['Laws of Motion', 'Algebra'] },
        ]
    }
];


export const MOCK_ANALYTICS_DATA = {
    weeklyHours: [
        { name: 'Week 1', Physics: 10, Chemistry: 8, Mathematics: 12 },
        { name: 'Week 2', Physics: 12, Chemistry: 10, Mathematics: 11 },
        { name: 'Week 3', Physics: 11, Chemistry: 9, Mathematics: 13 },
        { name: 'Week 4', Physics: 13, Chemistry: 11, Mathematics: 14 },
    ],
    topicCoverage: [
        { name: 'Physics', covered: 65, total: 100 },
        { name: 'Chemistry', covered: 80, total: 100 },
        { name: 'Mathematics', covered: 72, total: 100 },
    ],
    mockTestAccuracy: [
        { name: 'Test 1', accuracy: 60 },
        { name: 'Test 2', accuracy: 65 },
        { name: 'Test 3', accuracy: 72 },
        { name: 'Test 4', accuracy: 75 },
    ],
};