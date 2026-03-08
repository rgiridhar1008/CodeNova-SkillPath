export const careerExplorerData = [
  {
    name: "Data Scientist",
    domain: "Tech",
    salary: "$118k avg",
    demand: "Very High",
    difficulty: 8,
    learningMonths: 9,
    growthPath: "Junior DS -> ML Scientist -> Lead Data Scientist",
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Deep Learning"]
  },
  {
    name: "Web Developer",
    domain: "Tech",
    salary: "$95k avg",
    demand: "High",
    difficulty: 6,
    learningMonths: 6,
    growthPath: "Frontend Dev -> Full Stack Dev -> Engineering Manager",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "APIs"]
  },
  {
    name: "AI Engineer",
    domain: "Tech",
    salary: "$132k avg",
    demand: "Explosive",
    difficulty: 9,
    learningMonths: 10,
    growthPath: "ML Engineer -> AI Engineer -> Applied AI Architect",
    requiredSkills: ["Python", "PyTorch", "LLMs", "MLOps", "RAG", "Vector DBs"]
  },
  {
    name: "Cloud Engineer",
    domain: "Core",
    salary: "$124k avg",
    demand: "Very High",
    difficulty: 7,
    learningMonths: 8,
    growthPath: "Cloud Associate -> DevOps Engineer -> Cloud Architect",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"]
  },
  {
    name: "Product Manager",
    domain: "Management",
    salary: "$128k avg",
    demand: "High",
    difficulty: 7,
    learningMonths: 7,
    growthPath: "APM -> PM -> Senior PM -> Director Product",
    requiredSkills: ["Roadmapping", "Analytics", "User Research", "Stakeholder Mgmt", "Prioritization", "Agile"]
  },
  {
    name: "UX Designer",
    domain: "Design",
    salary: "$102k avg",
    demand: "High",
    difficulty: 6,
    learningMonths: 6,
    growthPath: "UX Designer -> Senior UX -> Product Designer Lead",
    requiredSkills: ["Figma", "Wireframing", "Usability Testing", "Design Systems", "Prototyping", "UX Research"]
  }
];

export const quizQuestions = [
  {
    question: "Which Python library is commonly used for tabular data manipulation?",
    options: ["Pandas", "Express", "Terraform", "Nmap"],
    answer: "Pandas",
    skill: "Data"
  },
  {
    question: "What does CI/CD stand for?",
    options: ["Continuous Integration / Continuous Delivery", "Cloud Interface / Cloud Deployment", "Code Inspect / Code Debug", "None"],
    answer: "Continuous Integration / Continuous Delivery",
    skill: "Cloud"
  },
  {
    question: "Which is essential for frontend component-based UIs?",
    options: ["React", "Wireshark", "Postman", "NumPy"],
    answer: "React",
    skill: "Web"
  },
  {
    question: "Which concept is core to securing web applications?",
    options: ["OWASP Top 10", "Binary Search", "Gradient Descent", "B-tree"],
    answer: "OWASP Top 10",
    skill: "Security"
  },
  {
    question: "RAG in AI systems combines LLMs with:",
    options: ["External retrieval", "Compiler optimization", "Blockchain", "DNS"],
    answer: "External retrieval",
    skill: "AI"
  }
];

export const learningResources = [
  { title: "DeepLearning.AI LLM Courses", platform: "DeepLearning.AI", type: "Free", domain: "Tech" },
  { title: "AWS Cloud Practitioner", platform: "AWS", type: "Free", domain: "Core" },
  { title: "Full Stack Open", platform: "Helsinki", type: "Free", domain: "Tech" },
  { title: "System Design Interview", platform: "Educative", type: "Paid", domain: "Management" },
  { title: "Google UX Certificate", platform: "Coursera", type: "Paid", domain: "Design" },
  { title: "TryHackMe SOC Path", platform: "TryHackMe", type: "Paid", domain: "Core" }
];

export const mockInterviewQuestions = {
  "AI Engineer": [
    "Explain the difference between fine-tuning and prompt engineering.",
    "How would you evaluate an LLM-powered RAG system?"
  ],
  "Web Developer": [
    "How does React reconciliation work?",
    "How would you optimize frontend performance in a large SPA?"
  ],
  "Data Scientist": [
    "When would you choose precision over recall?",
    "How do you detect and handle data leakage?"
  ]
};
