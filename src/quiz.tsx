// Quiz.tsx - Complete component with all features
import { useQuizData } from "../src/hooks/quizData";
import { useQuizState } from "../src/hooks/quizState";
import { useState } from "react";

// Using a constant to make it easy to toggle between API and direct fallback
const USE_API = false; // Set to false to always use fallback data
const API_URL = "https://opentdb.com/api.php?amount=50&category=9&difficulty=hard&type=multiple";

function Quiz() {
  const { questions, loading, usingFallback } = useQuizData(USE_API ? API_URL : "");
  const [quizComplete, setQuizComplete] = useState(false);
  
  const {
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
  } = useQuizState(questions);

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      handleNextQuestion();
    }
  };

  const handleRestart = () => {
    restartQuiz();
    setQuizComplete(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center bg-black min-h-screen">
      <div className="bg-[#a2d2ff] w-96 p-8 rounded-md text-center">
        <div className="animate-pulse">
          <p className="text-lg font-bold">Loading quiz questions...</p>
          <div className="h-2 bg-blue-300 rounded mt-4"></div>
          <div className="h-2 bg-blue-300 rounded mt-2 w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="flex items-center justify-center bg-black min-h-screen">
      <div className="bg-[#a2d2ff] w-96 p-8 rounded-md text-center">
        <p className="text-lg font-bold text-red-600">No questions available</p>
        <p className="mt-2">Please try again later or refresh the page.</p>
      </div>
    </div>
  );

  if (!currentQuestion) return (
    <div className="flex items-center justify-center bg-black min-h-screen">
      <div className="bg-[#a2d2ff] w-96 p-8 rounded-md text-center">
        <p className="text-lg font-bold text-red-600">Question not found</p>
        <p className="mt-2">Please try again later or refresh the page.</p>
      </div>
    </div>
  );

  // Results screen when quiz is complete
  if (quizComplete) {
    return (
      <div className="flex items-center justify-center bg-black min-h-screen">
        <div className="bg-[#a2d2ff] w-96 h-auto min-h-[20rem] m-10 border flex flex-col justify-between p-8 rounded-md text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Complete!</h1>
          
          <div className="my-6">
            <p className="text-xl">Your Score:</p>
            <p className="text-3xl font-bold my-4">{score} / {totalQuestions}</p>
            <p className="text-lg">
              {score === totalQuestions 
                ? "Perfect score! Amazing job!" 
                : score > totalQuestions / 2 
                  ? "Great job!" 
                  : "Good effort!"}
            </p>
          </div>
          
          <button
            className="bg-blue-500 text-white p-4 rounded-md mt-8 hover:bg-blue-600 transition"
            onClick={handleRestart}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-black min-h-screen">
      <div className="bg-[#a2d2ff] w-96 h-auto min-h-[40rem] m-10 border flex flex-col justify-between p-5 rounded-md">
        {/* Fallback notice */}
        {usingFallback && (
          <div className="bg-yellow-100 border-yellow-400 border-2 text-yellow-800 px-3 py-2 rounded mb-4 text-sm">
            Using local quiz data due to API rate limit. Try refreshing later.
          </div>
        )}
        
        {/* Progress */}
        <div className="mb-4">
          <p className="text-gray-800 font-semibold">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <p className="text-gray-800 font-semibold">Score: {score}</p>
        </div>
        
        {/* Question */}
        <div className="bg-[#cdb4db] w-full p-5 rounded-md text-center mb-6">
          <h1 className="text-lg font-bold">
            {currentQuestion.question}
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`text-white w-full p-4 rounded-md transition
                ${selectedOption === option 
                  ? option === currentQuestion.correctAnswer 
                    ? "bg-green-600" 
                    : "bg-red-600" 
                  : answered && option === currentQuestion.correctAnswer 
                    ? "bg-green-600" 
                    : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => handleOptionClick(option)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <button
          className={`text-white p-3 rounded-md mt-auto transition
            ${answered ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500"}`}
          onClick={handleNext}
          disabled={!answered}
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;