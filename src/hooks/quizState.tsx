import { useState } from "react";
import { Question } from "./quizData";

export const useQuizState = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || null;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  const handleOptionClick = (option: string) => {
    if (answered || !currentQuestion) return;
    
    setSelectedOption(option);
    setAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Reset to first question when completed
      setCurrentQuestionIndex(0);
      setScore(0); // Reset score when restarting quiz
    }
    setSelectedOption(null);
    setAnswered(false);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setAnswered(false);
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    score,
    selectedOption,
    answered,
    isLastQuestion,
    totalQuestions,
    handleOptionClick,
    handleNextQuestion,
    restartQuiz
  };
};

