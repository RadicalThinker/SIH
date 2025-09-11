import React, { useState } from 'react';
import { LudoQuestion } from './types';

interface LudoQuestionModalProps {
  question: LudoQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

const LudoQuestionModal: React.FC<LudoQuestionModalProps> = ({ question, onAnswer, onClose }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 2000);
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Mathematics':
        return '🧮';
      case 'Science':
        return '🔬';
      case 'Social Science':
        return '🌍';
      case 'English':
        return '📚';
      case 'General Knowledge':
        return '💡';
      default:
        return '❓';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Science':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Social Science':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'English':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'General Knowledge':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl ${getSubjectColor(question.subject)}`}>
                {getSubjectIcon(question.subject)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{question.subject}</h2>
                <p className="text-sm text-gray-500">Answer correctly to reroll the dice!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          {!showResult ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {question.question}
                </h3>
              </div>
              
              <div className="space-y-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                  Your Answer:
                </label>
                <input
                  id="answer"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Type your answer here..."
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Submit Answer
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isCorrect ? (
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className={`text-3xl font-bold mb-2 ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                
                <p className="text-lg text-gray-600 mb-4">
                  {isCorrect 
                    ? 'Great job! You can reroll the dice!' 
                    : 'Better luck next time!'
                  }
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Correct Answer:</p>
                  <p className="text-lg font-semibold text-gray-900">{question.answer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LudoQuestionModal;


