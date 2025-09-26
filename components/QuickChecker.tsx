import React, { useState } from 'react';
import { Lightbulb, Loader2, Bot, Book, BarChart, ChevronRight, AlertTriangle } from 'lucide-react';
import { classifyQuestion } from '../services/geminiService';
import type { QuestionClassification } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';

// A simple check for the API key presence at the module level.
// This doesn't expose the key, just its existence.
const isApiKeyConfigured = !!process.env.API_KEY;


const QuickChecker: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<QuestionClassification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !isApiKeyConfigured) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    const classification = await classifyQuestion(question);

    if (typeof classification === 'string') {
      setError(classification);
    } else {
      setResult(classification);
    }

    setIsLoading(false);
  };
  
  const DifficultyBadge = ({ difficulty }: { difficulty: 'Easy' | 'Medium' | 'Hard' }) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[difficulty]}`}>{difficulty}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto">
       {!isApiKeyConfigured && (
        <Card className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-500">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        API Key Not Configured
                    </p>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        The Quick Checker requires a Gemini API key to function. Please set the <code>API_KEY</code> environment variable to enable this feature.
                    </p>
                </div>
            </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full">
                <Lightbulb className="w-6 h-6 text-primary-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-white">Practice Quick-Checker</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                Enter a problem to get insights on the topic, difficulty, and how to approach it.
                </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g., A block of mass m is placed on a smooth inclined plane of inclination θ..."
            className="w-full h-32 p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-secondary-50 dark:bg-secondary-900 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
            disabled={isLoading || !isApiKeyConfigured}
          />
          <Button type="submit" disabled={isLoading || !question.trim() || !isApiKeyConfigured} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
                <>
                <Bot className="mr-2 h-5 w-5" />
                Analyze Question
              </>
            )}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="mt-6 p-4 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500">
          <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="mt-6 p-6">
          <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-4">Analysis Result</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Book className="w-5 h-5 mr-3 text-primary-500"/>
              <span className="font-semibold text-secondary-600 dark:text-secondary-300">Subject & Topic:</span>
              <span className="ml-2 text-secondary-800 dark:text-white">{result.subject} <ChevronRight className="inline w-4 h-4" /> {result.topic}</span>
            </div>
            <div className="flex items-center">
              <BarChart className="w-5 h-5 mr-3 text-primary-500"/>
              <span className="font-semibold text-secondary-600 dark:text-secondary-300">Difficulty:</span>
              <span className="ml-2"><DifficultyBadge difficulty={result.difficulty} /></span>
            </div>
            <div>
              <div className="flex items-start">
                <Lightbulb className="w-5 h-5 mr-3 text-primary-500 mt-1"/>
                <span className="font-semibold text-secondary-600 dark:text-secondary-300">Suggested Approach:</span>
              </div>
              <ul className="mt-2 ml-8 list-disc space-y-2 text-secondary-700 dark:text-secondary-200">
                {result.suggestions.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuickChecker;