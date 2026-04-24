export interface QuestionOption {
  label: string;
  desc?: string;
}

export interface Question {
  id: string;
  text: string;
  sub?: string;
  type: 'single' | 'multi';
  options: QuestionOption[];
}

export interface Answers {
  skills?: string[];
  interests?: string[];
  time?: string;
  budget?: string;
  audience?: string;
  goal?: string;
  style?: string;
}

export interface Idea {
  title: string;
  category: string;
  blurb: string;
  incomeMin: number;
  incomeMax: number;
  incomeUnit: string;
  timeToFirstDollar: string;
  startupCost: string;
  hoursPerWeek: string;
  feasibilityScore: number;
  earningScore: number;
  revenueModel: string;
  requiredSkills: string;
  firstSteps: string[];
  pitfall: string;
  example: string;
}

export interface GenerateResult {
  resultId: string;
  summary: string;
  ideas: Idea[];
}
