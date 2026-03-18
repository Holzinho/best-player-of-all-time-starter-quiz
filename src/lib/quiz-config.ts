import type { Lang, Sport, Difficulty } from "@/types/quiz";

export const SPORTS: { value: Sport; label: string }[] = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "padel", label: "Padel" },
];

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 50] as const;

export const DEFAULT_SPORT: Sport =
  (process.env.NEXT_PUBLIC_DEFAULT_SPORT as Sport) || "football";
export const DEFAULT_LANG: Lang =
  (process.env.NEXT_PUBLIC_DEFAULT_LANG as Lang) || "en";
const rawCount = Number(process.env.NEXT_PUBLIC_DEFAULT_COUNT || "10");
const validCounts = COUNT_OPTIONS as readonly number[];
export const DEFAULT_COUNT: number = validCounts.includes(rawCount)
  ? rawCount
  : 10;
