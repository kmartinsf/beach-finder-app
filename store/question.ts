import { create } from "zustand";

type QuestionState = {
  questions: { question: string; options: string[] }[];
  selectedAnswers: string[];
  setQuestions: (questions: { question: string; options: string[] }[]) => void;
  setSelectedAnswers: (answers: string[]) => void;
};

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  selectedAnswers: [],
  setQuestions: (questions) => set({ questions }),
  setSelectedAnswers: (answers) => set({ selectedAnswers: answers }),
}));
