export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const TOPICS = [
  "JavaScript Fundamentals",
  "React Concepts",
  "Data Structures",
  "Algorithms",
  "System Design",
  "Web Development",
  "Database Concepts",
  "Network Fundamentals",
];

export const DIFFICULTY_LEVELS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
]; 