import type { PracticeMode } from "@/types/study";
import type { Locale } from "@/lib/preferences";

const practiceLabels = {
  en: {
    practiceModes: {
      GUESS_WORD: "Guess the word",
      FLASHCARD: "Flashcards",
      MULTIPLE_CHOICE: "Multiple choice",
      REVERSE_MULTIPLE_CHOICE: "Reverse multiple choice"
    }
  },
  vi: {
    practiceModes: {
      GUESS_WORD: "Đoán từ",
      FLASHCARD: "Thẻ lật",
      MULTIPLE_CHOICE: "Trắc nghiệm",
      REVERSE_MULTIPLE_CHOICE: "Trắc nghiệm đảo chiều"
    }
  }
} as const;

export function getModeLabel(mode: PracticeMode, locale: Locale = "vi") {
  return practiceLabels[locale].practiceModes[mode] ?? mode;
}
