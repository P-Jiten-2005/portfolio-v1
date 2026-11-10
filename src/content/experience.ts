export type Role = { org: string; title: string; when: string; points: string[] };
export type School = { org: string; course: string; when: string; note: string };

export const work: Role[] = [
  {
    org: "Centre for Extended Reality (CXR)",
    title: "AI / Software Engineering Intern",
    when: "Jun 2026 – Present",
    points: [
      "Improved target verification throughput by 25% and cut false positives on TARIS, an AI-powered multi-lane shooting range scoring system, by building statistical validation pipelines for localization accuracy and confidence.",
      "Designed a multi-stage verification pipeline with weighted confidence fusion and audit trails for high-throughput video streams.",
      "Built FastAPI services and real-time validation workflows with dashboard components for low-latency scoring and telemetry.",
      "Instrumented the vision pipeline to log registration, homography and alignment metrics for benchmarking.",
    ],
  },
  {
    org: "Centre for Extended Reality (CXR)",
    title: "VR Developer Intern & Team Lead, VR Chemistry Laboratory",
    when: "May 2026 – Jun 2026",
    points: [
      "Led a team building an immersive chemistry lab in Unity (C#) for Meta Quest 2/3.",
      "Built the lab environment, every interactive object and the liquid shaders used in the experiments.",
      "Implemented five experiments: a flame test, three NaOH experiments and VIBGYOR.",
    ],
  },
];

export const leadership: Role[] = [
  {
    org: "ACM Student Chapter",
    title: "Vice President",
    when: "Jun 2026 – Present",
    points: [
      "Led workshops and coding sessions on data structures, algorithms and system design for 200+ students, working with industry speakers and academic bodies.",
    ],
  },
];

export const education: School[] = [
  { org: "GITAM University", course: "B.Tech, Computer Science Engineering (AI & ML)", when: "2023 – 2027", note: "CGPA 8.7" },
  { org: "Indian Institute of Technology Madras", course: "Diploma in Data Science and Programming", when: "2023 – Present", note: "CGPA 6.3" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "SQL", "Java", "C++", "C", "C#"] },
  { group: "AI & ML", items: ["LLM pipelines", "RAG", "LangGraph", "Multi-agent systems", "Scikit-learn", "Pandas", "NumPy", "OpenCV", "YOLOv8", "SAHI", "Kalman filtering"] },
  { group: "Backend", items: ["FastAPI", "REST APIs", "Celery", "Async programming", "PostgreSQL", "MySQL"] },
  { group: "Tools", items: ["Docker", "Git", "Linux", "Unity", "Meta Quest VR"] },
];
