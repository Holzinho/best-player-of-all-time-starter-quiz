"use client";

import { useState, useCallback } from "react";
import { QuizStart } from "./QuizStart";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";
import type { QuizConfig, QuestionItem, QuestionsResponse } from "@/types/quiz";
import {
  DEFAULT_SPORT,
  DEFAULT_LANG,
  DEFAULT_COUNT,
} from "@/lib/quiz-config";

type QuizPhase = "start" | "questions" | "summary" | "config_error";

export function QuizFlow() {
  const [phase, setPhase] = useState<QuizPhase>("start");
  const [config, setConfig] = useState<QuizConfig>({
    sport: DEFAULT_SPORT,
    lang: DEFAULT_LANG,
    count: DEFAULT_COUNT,
  });
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiMeta, setApiMeta] = useState<QuestionsResponse["meta"] | undefined>();

  const fetchQuestions = useCallback(async () => {
    setError(null);
    setIsStarting(true);
    const params = new URLSearchParams({
      lang: config.lang,
      sport: config.sport,
      count: String(config.count),
    });
    if (config.difficulty) params.set("difficulty", config.difficulty);

    try {
      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "CONFIG_ERROR") {
          setError(data.error || "Server configuration error");
          setPhase("config_error");
          return;
        }
        if (data.code === "AUTH_ERROR") {
          setError("Invalid API token. Please check server configuration.");
          return;
        }
        if (data.code === "RATE_LIMIT") {
          setError(data.error || "Rate limit exceeded. Try again later.");
          return;
        }
        setError(data.error || "Failed to load questions");
        return;
      }

      const items = data.items ?? [];
      if (items.length === 0) {
        setError("No questions available for this configuration.");
        return;
      }

      setQuestions(items);
      setCurrentIndex(0);
      setScore(0);
      setApiMeta(data.meta);
      setPhase("questions");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }, [config]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) setScore((s) => s + 1);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("summary");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setPhase("start");
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setError(null);
  }, []);

  if (phase === "config_error") {
    return (
      <div className="quiz-container">
        <div className="quiz-error quiz-error--block">
          <h2>Configuration Error</h2>
          <p>{error}</p>
          <p className="quiz-error__hint">
            Set QUIZ_API_BASE_URL and QUIZ_API_TOKEN in your environment. See
            README for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "start") {
    return (
      <div className="quiz-container">
        <QuizStart
          config={config}
          onConfigChange={setConfig}
          onStart={fetchQuestions}
          isStarting={isStarting}
          error={error}
        />
      </div>
    );
  }

  if (phase === "questions" && questions[currentIndex]) {
    return (
      <div className="quiz-container">
        <QuizQuestion
          question={questions[currentIndex]}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </div>
    );
  }

  if (phase === "summary") {
    return (
      <div className="quiz-container">
        <QuizSummary
          score={score}
          total={questions.length}
          apiMeta={apiMeta}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return null;
}
