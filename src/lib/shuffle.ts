/**
 * Fisher-Yates shuffle. Returns a new shuffled array.
 * Used for answer order - keeps correct-answer logic intact via mapping.
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle answers for display and return the new index of the correct answer.
 * Original correctAnswerIndex refers to the original answers array.
 */
export function shuffleAnswers(
  answers: string[],
  correctAnswerIndex: number
): { shuffledAnswers: string[]; correctShuffledIndex: number } {
  const correctAnswer = answers[correctAnswerIndex];
  const shuffledAnswers = shuffle(answers);
  const correctShuffledIndex = shuffledAnswers.indexOf(correctAnswer);
  return { shuffledAnswers, correctShuffledIndex };
}
