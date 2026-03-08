import {
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessagesSquare,
  NotebookTabs
} from "lucide-react";

export const dashboardFeatures = [
  {
    id: "roadmap-generator",
    title: "Roadmap Generator",
    description: "Beginner, role-based, and AI-custom learning roadmaps.",
    path: "/learning-roadmap",
    icon: NotebookTabs,
    highlights: ["Beginner Roadmaps", "Role-based Roadmaps", "AI Custom Roadmaps"],
    references: [
      { label: "roadmap.sh", url: "https://roadmap.sh" },
      { label: "Coursera Learning Paths", url: "https://www.coursera.org" },
      { label: "edX Programs", url: "https://www.edx.org" },
      { label: "YouTube Playlists", url: "https://www.youtube.com" }
    ]
  },
  {
    id: "resume-analyzer",
    title: "Resume Analyzer",
    description: "Upload resume, get ATS score and skill-gap insights.",
    path: "/resume-analyzer",
    icon: ClipboardCheck,
    highlights: ["Resume Upload", "ATS Score Checker", "Skill Gap Detection"],
    references: [
      { label: "Jobscan", url: "https://www.jobscan.co" },
      { label: "ResumeWorded", url: "https://resumeworded.com" },
      { label: "Zety Resume Checker", url: "https://zety.com" },
      { label: "LinkedIn Resume Tips", url: "https://www.linkedin.com" }
    ]
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    description: "Templates, section editor, and ATS formatting help.",
    path: "/resume-builder",
    icon: FileText,
    highlights: ["Resume Templates", "Section-wise Editor", "ATS Formatting Tips"],
    references: [
      { label: "Overleaf Templates", url: "https://www.overleaf.com" },
      { label: "Canva Resume Designs", url: "https://www.canva.com" },
      { label: "Harvard Resume Guide", url: "https://careerservices.fas.harvard.edu" },
      { label: "Novoresume Blog", url: "https://novoresume.com" }
    ]
  },
  {
    id: "ai-mock-interview",
    title: "AI Mock Interview",
    description: "Technical/HR practice and voice simulation support.",
    path: "/mock-interview",
    icon: MessagesSquare,
    highlights: [
      "Technical Interview Practice",
      "HR Interview Questions",
      "Voice-based Simulation"
    ],
    references: [
      { label: "Pramp", url: "https://www.pramp.com" },
      { label: "InterviewBit", url: "https://www.interviewbit.com" },
      { label: "LeetCode Mock", url: "https://leetcode.com" },
      { label: "Glassdoor Interview Q&A", url: "https://www.glassdoor.com" }
    ]
  },
  {
    id: "aptitude-prep",
    title: "Aptitude Prep",
    description: "Quant, reasoning, and verbal practice tracks.",
    path: "/aptitude-prep",
    icon: GraduationCap,
    highlights: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"],
    references: [
      { label: "IndiaBix", url: "https://www.indiabix.com" },
      { label: "PrepInsta", url: "https://prepinsta.com" },
      { label: "RS Aggarwal Books", url: "https://www.amazon.in" },
      { label: "Testbook Practice", url: "https://testbook.com" }
    ]
  },
  {
    id: "learning-resources",
    title: "Learning Resources",
    description: "Curated free/paid learning paths and project ideas.",
    path: "/learning-roadmap#resources",
    icon: BookOpenCheck,
    highlights: ["Free Courses", "Paid Certifications", "Project Ideas"],
    references: [
      { label: "Coursera", url: "https://www.coursera.org" },
      { label: "Udemy", url: "https://www.udemy.com" },
      { label: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org" },
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
    ]
  }
];

export const profileReferences = [
  { label: "LinkedIn", url: "https://www.linkedin.com" },
  { label: "GitHub", url: "https://github.com" },
  { label: "LeetCode", url: "https://leetcode.com" },
  { label: "roadmap.sh", url: "https://roadmap.sh" },
  { label: "Coursera", url: "https://www.coursera.org" },
  { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
  { label: "freeCodeCamp", url: "https://www.freecodecamp.org" }
];
