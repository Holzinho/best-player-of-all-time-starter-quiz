"use client";

import {
  SPORTS,
  LANGUAGES,
  DIFFICULTIES,
  COUNT_OPTIONS,
  DEFAULT_SPORT,
  DEFAULT_LANG,
  DEFAULT_COUNT,
} from "@/lib/quiz-config";
import type { QuizConfig, Sport, Lang, Difficulty } from "@/types/quiz";

const APP_NAME =
  typeof process.env.NEXT_PUBLIC_APP_NAME === "string"
    ? process.env.NEXT_PUBLIC_APP_NAME
    : "Best Player of All Time Quiz";

interface QuizStartProps {
  config: QuizConfig;
  onConfigChange: (config: QuizConfig) => void;
  onStart: () => void;
  isStarting: boolean;
  error: string | null;
}

export function QuizStart({
  config,
  onConfigChange,
  onStart,
  isStarting,
  error,
}: QuizStartProps) {
  return (
    <div className="quiz-start">
      <div className="quiz-start__hero">
        <h1 className="quiz-start__title">{APP_NAME}</h1>
        <p className="quiz-start__subtitle">
          Test your knowledge. Choose your options and start.
        </p>
      </div>

      <div className="quiz-start__config">
        <div className="quiz-config-group">
          <label className="quiz-config-label">Sport</label>
          <select
            className="quiz-select"
            value={config.sport}
            onChange={(e) =>
              onConfigChange({ ...config, sport: e.target.value as Sport })
            }
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="quiz-config-group">
          <label className="quiz-config-label">Language</label>
          <select
            className="quiz-select"
            value={config.lang}
            onChange={(e) =>
              onConfigChange({ ...config, lang: e.target.value as Lang })
            }
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="quiz-config-group">
          <label className="quiz-config-label">Difficulty (optional)</label>
          <select
            className="quiz-select"
            value={config.difficulty ?? ""}
            onChange={(e) =>
              onConfigChange({
                ...config,
                difficulty: (e.target.value || undefined) as Difficulty | undefined,
              })
            }
          >
            <option value="">Any</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="quiz-config-group">
          <label className="quiz-config-label">Number of questions</label>
          <select
            className="quiz-select"
            value={config.count}
            onChange={(e) =>
              onConfigChange({
                ...config,
                count: Number(e.target.value),
              })
            }
          >
            {COUNT_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="quiz-error" role="alert">
          {error}
        </div>
      )}

      <button
        className="quiz-cta quiz-cta--primary"
        onClick={onStart}
        disabled={isStarting}
      >
        {isStarting ? "Loading…" : "Start Quiz"}
      </button>
    </div>
  );
}
