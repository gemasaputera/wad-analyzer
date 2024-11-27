'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import TaskTable from './components/TaskTable';
import { TaskAnalysis } from '../../types';
import { analyzeTask } from '../../utils/api';

export default function Home() {
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskDescription = formData.get('taskDescription') as string;
    const model = formData.get('model') as string;


    if (!taskDescription.trim()) {
      setError('Please enter a task description');
      return;
    }

    if(taskDescription.length < 500) {
      setError('Task description must be at least 500 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeTask(taskDescription, model);
      setAnalysis(result);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError('Failed to analyze task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Work Analysis Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
              Task Description
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              rows={3}
              className="mt-1 py-2 px-3 block w-full rounded-lg border-gray-300 text-sm font-semibold shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your task description here..."
              disabled={isLoading}
            />
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                id="model"
                name="model"
                className="mt-1 block w-full py-2 px-3 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              >
                <option value="claude-3-5-haiku" defaultChecked>Claude-3-5-Haiku</option>
                <option value="claude-3-5-sonnet">Claude-3-5-Sonnet</option>
                <option value="claude-3-opus">Claude-3-Opus</option>
              </select>
            </div>

          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Task'}
          </button>
        </form>

        <div className="mt-8">
          {analysis && <TaskTable analysis={analysis} />}
        </div>
      </motion.div>
    </main>
  );
}
