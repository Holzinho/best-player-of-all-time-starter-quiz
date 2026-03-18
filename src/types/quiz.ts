export type Lang = "en" | "de" | "fr";
export type Sport = "football" | "basketball" | "padel";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionMeta {
  sport: string;
  category: string;
  difficulty: string;
  status: string;
  sourceType: string;
  contentAsOf: string;
  createdAt: string;
  updatedAt: string;
  lang: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl: string | null;
  meta: QuestionMeta;
}

export interface QuestionsResponse {
  items: QuestionItem[];
  total: number;
  meta: {
    requestedLang: string;
    resolvedLang: string;
    fallbackUsed: boolean;
  };
}

export interface QuizConfig {
  sport: Sport;
  lang: Lang;
  difficulty?: Difficulty;
  count: number;
}
