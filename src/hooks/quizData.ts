import { useState, useEffect } from "react";

interface APIResponse {
  response_code: number;
  results: APIQuestion[];
}

interface APIQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
  difficulty: string;
  category: string;
}

export interface Question {
  question: string;
  correctAnswer: string;
  options: string[];
}

// Complete fallback quiz data (expanded from your original paste.txt)
const FALLBACK_DATA: APIQuestion[] = [
  {
    question: "What year was the RoboSapien toy robot released?",
    correct_answer: "2004",
    incorrect_answers: ["2000", "2001", "2006"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "Before the 19th Century, the \"Living Room\" was originally called the...",
    correct_answer: "Parlor",
    incorrect_answers: ["Open Room", "Sitting Room", "Loft"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "The word \"astasia\" means which of the following?",
    correct_answer: "The inability to stand up",
    incorrect_answers: ["The inability to make decisions", "The inability to concentrate on anything", "A feverish desire to rip one's clothes off"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "What is the romanized Korean word for \"heart\"?",
    correct_answer: "Simjang",
    incorrect_answers: ["Aejeong", "Jeongsin", "Segseu"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "Which of the following is an existing family in \"The Sims\"?",
    correct_answer: "The Goth Family",
    incorrect_answers: ["The Family", "The Simoleon Family", "The Proud Family"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "The word \"aprosexia\" means which of the following?",
    correct_answer: "The inability to concentrate on anything",
    incorrect_answers: ["The inability to make decisions", "A feverish desire to rip one's clothes off", "The inability to stand up"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "The Swedish word \"Grunka\" means what in English?",
    correct_answer: "Thing",
    incorrect_answers: ["People", "Place", "Pineapple"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "What type of dog is 'Handsome Dan', the mascot of Yale University?",
    correct_answer: "Bulldog",
    incorrect_answers: ["Yorkshire Terrier", "Boxer", "Pug"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "Sciophobia is the fear of what?",
    correct_answer: "Shadows",
    incorrect_answers: ["Eating", "Bright lights", "Transportation"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  },
  {
    question: "What does the Latin phrase \"Veni, vidi, vici\" translate into English?",
    correct_answer: "I came, I saw, I conquered",
    incorrect_answers: ["See no evil, hear no evil, speak no evil", "Life, liberty, and happiness", "Past, present, and future"],
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge"
  }
];

export const useQuizData = (apiUrl: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Function to decode HTML entities
  const decodeHTML = (html: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  // Function to shuffle array for randomizing option order
  const shuffleArray = (array: string[]): string[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Process questions from API or fallback data
  const processQuestions = (apiQuestions: APIQuestion[]): Question[] => {
    return apiQuestions.map((q: APIQuestion) => ({
      question: decodeHTML(q.question),
      correctAnswer: decodeHTML(q.correct_answer),
      options: shuffleArray([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
    }));
  };

  useEffect(() => {
    const loadFallbackData = () => {
      console.log("Using fallback quiz data");
      const fallbackQuestions = processQuestions(FALLBACK_DATA);
      setQuestions(fallbackQuestions);
      setUsingFallback(true);
      setError("Using local quiz data due to API rate limit or error. Try again later."); // More generic message
      setLoading(false);
    };

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(apiUrl);

        // Check specifically for rate limiting
        if (response.status === 429) {
          console.log("API rate limited (429)");
          loadFallbackData();
          return;
        }

        if (!response.ok) {
          // Include the status text in the error message
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data: APIResponse = await response.json();

        if (data.response_code !== 0 || !data.results || data.results.length === 0) {
          throw new Error(`No questions found or invalid response code: ${data.response_code}`); // Include the response code in the error message
        }

        const formattedQuestions = processQuestions(data.results);
        setQuestions(formattedQuestions);
        setLoading(false);
        setError(null);
      } catch (error) { // Explicitly type 'error' as 'any' or 'unknown'
        console.error("Fetch error:", error); // Log the entire error object
        setError(`Failed to fetch quiz data: ${error}`); // Use the error message
        loadFallbackData();
      }
      finally {
        setLoading(false); // Ensure loading is always set to false
      }
    };

    fetchData();
  }, [apiUrl]);

  return { questions, loading, error, usingFallback };
};