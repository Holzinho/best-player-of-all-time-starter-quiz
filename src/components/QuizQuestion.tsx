"use client";

import { useState, useEffect } from "react";
import { shuffleAnswers } from "@/lib/shuffle";
import type { QuestionItem } from "@/types/quiz";

interface ShuffledQuestion {
  question: QuestionItem;
  shuffledAnswers: string[];
  correctShuffledIndex: number;
}

interface QuizQuestionProps {
  question: QuestionItem;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizQuestionProps) {
  const [shuffled, setShuffled] = useState<ShuffledQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const { shuffledAnswers, correctShuffledIndex } = shuffleAnswers(
      question.answers,
      question.correctAnswerIndex
    );
    setShuffled({
      question,
      shuffledAnswers,
      correctShuffledIndex,
    });
    setSelectedIndex(null);
    setShowExplanation(false);
  }, [question]);

  if (!shuffled) return null;

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setShowExplanation(true);
    const correct = index === shuffled.correctShuffledIndex;
    onAnswer(correct);
  };

  const getAnswerState = (index: number) => {
    if (selectedIndex === null) return "";
    if (index === shuffled.correctShuffledIndex) return "correct";
    if (index === selectedIndex && index !== shuffled.correctShuffledIndex)
      return "incorrect";
    return "neutral";
  };

  return (
    <div className="quiz-question">
      <div className="quiz-question__progress">
        <span>
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="quiz-question__progress-bar">
          <div
            className="quiz-question__progress-fill"
            style={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="quiz-question__meta">
        {question.meta?.sport && (
          <span className="quiz-question__badge">{question.meta.sport}</span>
        )}
        {question.meta?.difficulty && (
          <span className="quiz-question__badge quiz-question__badge--muted">
            {question.meta.difficulty}
          </span>
        )}
      </div>

      <h2 className="quiz-question__text">{question.question}</h2>

      <div className="quiz-question__answers">
        {shuffled.shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            className={`quiz-answer quiz-answer--${getAnswerState(index)}`}
            onClick={() => handleSelect(index)}
            disabled={selectedIndex !== null}
          >
            {answer}
          </button>
        ))}
      </div>

      {showExplanation && (
        <>
          <div className="quiz-question__explanation">
            <h3>Explanation</h3>
            <p>{question.explanation}</p>
            {question.meta?.contentAsOf && (
              <p className="quiz-question__content-as-of">
                Content as of {question.meta.contentAsOf}
              </p>
            )}
          </div>
          <div className="quiz-question__nav">
            <button
              className="quiz-cta quiz-cta--primary"
              onClick={onNext}
            >
              {questionIndex + 1 >= totalQuestions ? "See Results" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
