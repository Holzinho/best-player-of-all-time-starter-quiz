import { NextRequest, NextResponse } from "next/server";
import type { Lang, Sport, Difficulty } from "@/types/quiz";

const BASE_URL =
  process.env.QUIZ_API_BASE_URL || "https://bestplayerofalltime.com";
const FALLBACK_URL = "https://best-player-of-all-time.vercel.app";
const TOKEN = process.env.QUIZ_API_TOKEN;

const VALID_LANGS: Lang[] = ["en", "de", "fr"];
const VALID_SPORTS: Sport[] = ["football", "basketball", "padel"];
const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function validateConfig(): { ok: boolean; error?: string } {
  if (!TOKEN || TOKEN.trim() === "") {
    return { ok: false, error: "QUIZ_API_TOKEN is not configured" };
  }
  if (!BASE_URL || BASE_URL.trim() === "") {
    return { ok: false, error: "QUIZ_API_BASE_URL is not configured" };
  }
  return { ok: true };
}

export async function GET(request: NextRequest) {
  const config = validateConfig();
  if (!config.ok) {
    return NextResponse.json(
      { error: config.error, code: "CONFIG_ERROR" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "en") as Lang;
  const sport = searchParams.get("sport") as Sport | null;
  const difficulty = searchParams.get("difficulty") as Difficulty | null;
  const countParam = searchParams.get("count");
  const count = Math.min(
    50,
    Math.max(1, parseInt(countParam || "10", 10) || 10)
  );

  if (!VALID_LANGS.includes(lang)) {
    return NextResponse.json(
      { error: `Invalid lang. Must be one of: ${VALID_LANGS.join(", ")}` },
      { status: 400 }
    );
  }
  if (sport && !VALID_SPORTS.includes(sport)) {
    return NextResponse.json(
      { error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(", ")}` },
      { status: 400 }
    );
  }
  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json(
      {
        error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    lang,
    count: String(count),
  });
  if (sport) params.set("sport", sport);
  if (difficulty) params.set("difficulty", difficulty);

  const url = `${BASE_URL}/api/questions?${params.toString()}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (res.status === 401) {
      return NextResponse.json(
        { error: "Invalid or missing API token", code: "AUTH_ERROR" },
        { status: 401 }
      );
    }

    if (res.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later.", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: "Quiz API error",
          code: "API_ERROR",
          details: res.status >= 500 ? "Server error" : text.slice(0, 200),
        },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    if (BASE_URL.includes("vercel.app") === false) {
      try {
        const fallbackUrl = `${FALLBACK_URL}/api/questions?${params.toString()}`;
        const fallbackRes = await fetch(fallbackUrl, {
          method: "GET",
          headers,
          cache: "no-store",
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          return NextResponse.json(data);
        }
      } catch {
        // ignore fallback failure
      }
    }
    return NextResponse.json(
      {
        error: "Failed to fetch questions",
        code: "NETWORK_ERROR",
      },
      { status: 502 }
    );
  }
}
