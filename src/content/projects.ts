export type Project = {
  slug: string;
  name: string;
  expanded?: string; // what the name stands for
  tagline: string;
  year: string;
  category: string;
  featured: boolean;
  repo: string | null; // null until there is a public link
  stack: string[];
  summary: string;
  points: string[];
  numbers?: { value: string; label: string }[];
  note?: string; // an honest caveat shown on the case study
};

// Order matters: featured projects appear in this order on Home and Work.
export const projects: Project[] = [
  {
    slug: "taris",
    name: "TARIS",
    expanded: "Target Alignment, Registration & Impact Scoring",
    tagline: "A camera watches a shooting target and scores every new bullet hole.",
    year: "2026",
    category: "Computer vision",
    featured: true,
    repo: "https://github.com/P-Jiten-2005/CXR-AIM",
    stack: ["Python", "FastAPI", "OpenCV", "YOLOv8", "Next.js", "PostgreSQL", "Docker"],
    summary:
      "A marksmanship platform for multi-lane shooting ranges. It finds new bullet holes in a camera feed, scores them against the printed target, and streams results to a dashboard for admins, trainers and shooters.",
    points: [
      "An OpenCV difference engine proposes candidate holes; a custom YOLOv8s model verifies each one.",
      "Scores in whole points and ISSF decimals, aligned to the target's printed zones, with boundary shots flagged for review.",
      "A multi-stage verification pipeline fuses weighted confidences and keeps an audit trail for every shot.",
      "Registration, homography and alignment metrics are logged so accuracy can be measured, not guessed.",
    ],
    numbers: [{ value: "25%", label: "higher verification throughput" }],
  },
  {
    slug: "crisis-command-centre",
    name: "Crisis Command Centre",
    tagline: "Four AI agents turn a raw crisis report into a grounded response plan.",
    year: "2026",
    category: "Multi-agent AI",
    featured: true,
    repo: "https://github.com/P-Jiten-2005/crisis-command-centre",
    stack: ["Python", "LangGraph", "RAG", "ChromaDB", "FastAPI", "Groq", "PostgreSQL", "Docker"],
    summary:
      "A multi-agent platform for cyber attacks, natural disasters, infrastructure failures and public safety events. It classifies each incident, retrieves similar past cases and protocols, and writes a phased response strategy.",
    points: [
      "Intake, Analysis, RAG and Response agents run as a LangGraph state machine under a coordinator.",
      "Every answer is grounded in retrieved incidents and protocols, identified by source ID.",
      "Safeguards detect prompt injection, isolate untrusted text and validate every tool output against a schema.",
      "Critical incidents always escalate to leadership; each agent run logs latency, tokens and confidence.",
    ],
    numbers: [
      { value: "4", label: "agents plus a coordinator" },
      { value: "~7 s", label: "typical end-to-end run" },
    ],
    note: "Confidence scores are heuristic, not statistically calibrated.",
  },
  {
    slug: "meeting-to-action-agent",
    name: "Meeting-to-Action Agent",
    tagline: "Turns a meeting into tasks, decisions and draft emails, and never acts without approval.",
    year: "2026",
    category: "Agentic AI",
    featured: true,
    repo: "https://github.com/P-Jiten-2005/meeting-to-action-agent",
    stack: ["Python", "LangGraph", "FastAPI", "Streamlit", "Groq", "SQLite"],
    summary:
      "Give it a transcript, a YouTube link or a recording. It extracts tasks with owners and deadlines, backs each one with an exact quote, plans the follow-ups, and waits for a human to approve before doing anything.",
    points: [
      "Every extracted item must quote one speaker turn word for word, or it is sent back for correction.",
      "Code, not the model, decides the owner and resolves the deadline, so the model cannot guess them.",
      "Memory across meetings flags a task that was already assigned earlier.",
      "Evaluated on eight labelled transcripts; 456 automated tests run without a network.",
    ],
    numbers: [
      { value: "0.94", label: "task precision" },
      { value: "0.97", label: "deadline accuracy" },
      { value: "1.00", label: "decision recall" },
      { value: "0.69", label: "task recall" },
      { value: "0.79", label: "owner accuracy" },
    ],
    note: "Measured on a live run over 8 hand-labelled transcripts (48 tasks). The agent is strong on what it does extract: it almost never invents a task, a decision or a deadline. It is weaker on coverage: it found 33 of the 48 tasks, and about half of the misses were unowned \"someone should…\" requests. It also left the owner blank on 5 tasks that named a person, asking for clarification instead. Recall and owner accuracy are below my targets of 0.85 and 0.90.",
  },
  {
    slug: "cross-modal-retrieval",
    name: "Cross-Modal Retrieval",
    tagline: "Two small encoders, trained from scratch, put COCO images and captions in one space.",
    year: "2026",
    category: "ML research",
    featured: false,
    repo: null,
    stack: ["Python", "Transformers", "ResNet-18", "COCO"],
    summary:
      "Compares three ways to align images and text: contrastive (CLIP-style), predictive (JEPA-style, no negatives) and a hybrid. Evaluated by recall@k under a fixed protocol with bootstrap confidence intervals, several seeds and paired significance tests.",
    points: [
      "About 8M trainable parameters on top of a frozen ResNet-18 image grid.",
      "Found that collapse in the predictive objective hides on the sphere, and fixed it by regularising the normalised embeddings.",
      "The held-out protocol caught a real bug: validation looked fine while test recall was near zero.",
      "Includes a probe that asks how much retrieval a rotation alone can recover between two unimodal spaces.",
    ],
    note: "Full COCO results are still to run. Numbers so far come from a synthetic smoke test that checks the pipeline, not model quality.",
  },
  {
    slug: "ptz-aircraft-tracking",
    name: "Autonomous PTZ Aircraft Tracking",
    tagline: "A camera that finds an aircraft and keeps it in frame on its own.",
    year: "2026",
    category: "Computer vision",
    featured: false,
    repo: null,
    stack: ["Python", "FastAPI", "OpenCV", "YOLOv8", "SAHI", "Kalman filter", "ONVIF", "PostgreSQL", "Docker"],
    summary:
      "A real-time perception pipeline that holds a stable trajectory on noisy camera feeds with sub-second response, and steers a pan-tilt-zoom camera to follow.",
    points: [
      "YOLOv8 with SAHI slicing detects small, distant aircraft; a Kalman filter smooths the track.",
      "FastAPI microservices handle ONVIF camera control, telemetry streaming and asynchronous PTZ commands.",
    ],
  },
  {
    slug: "vr-chemistry-lab",
    name: "VR Chemistry Laboratory",
    tagline: "A chemistry lab you can stand inside, on Meta Quest.",
    year: "2026",
    category: "VR",
    featured: false,
    repo: "https://github.com/P-Jiten-2005/Chem-Lab",
    stack: ["Unity", "C#", "XR Interaction Toolkit", "Meta Quest 2/3"],
    summary: "An immersive virtual lab built as team lead at the Centre for Extended Reality.",
    points: [
      "Built the environment, all interactive objects and the liquid shaders.",
      "Five experiments: a flame test, three NaOH experiments and VIBGYOR.",
    ],
  },
  {
    slug: "id3-c45-decision-trees",
    name: "ID3 & C4.5 Decision Trees",
    tagline: "Two classic tree algorithms written from scratch and compared side by side.",
    year: "2026",
    category: "Machine learning",
    featured: false,
    repo: "https://github.com/P-Jiten-2005/id3-c45-decision-trees",
    stack: ["Python", "NumPy", "Pandas", "Streamlit", "Graphviz"],
    summary:
      "A Streamlit app that trains ID3 and C4.5 on any uploaded CSV, draws the trees and compares them with scikit-learn's CART.",
    points: [
      "C4.5's pruning gave a tree about five times smaller than ID3's (38 nodes against 189) with higher test accuracy.",
      "42 tests run on every push.",
    ],
  },
];

export const featured = projects.filter((p) => p.featured);
export const findProject = (slug: string | undefined) => projects.find((p) => p.slug === slug);
