"use client";

import type { QuestionsResponse } from "@/types/quiz";

interface QuizSummaryProps {
  score: number;
  total: number;
  apiMeta?: QuestionsResponse["meta"];
  onRestart: () => void;
}

export function QuizSummary({
  score,
  total,
  apiMeta,
  onRestart,
}: QuizSummaryProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="quiz-summary">
      <h1 className="quiz-summary__title">Quiz Complete</h1>
      <div className="quiz-summary__score">
        <span className="quiz-summary__score-value">{score}</span>
        <span className="quiz-summary__score-sep">/</span>
        <span className="quiz-summary__score-total">{total}</span>
      </div>
      <p className="quiz-summary__percentage">{percentage}% correct</p>

      {apiMeta?.fallbackUsed && (
        <p className="quiz-summary__meta quiz-summary__meta--fallback">
          Some content was served in fallback language.
        </p>
      )}

      <button
        className="quiz-cta quiz-cta--primary"
        onClick={onRestart}
      >
        Try Again
      </button>
    </div>
  );
}
