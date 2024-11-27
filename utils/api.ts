import { TaskAnalysis } from '../types';

export async function analyzeTask(taskDescription: string, model: string): Promise<TaskAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskDescription, model }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing task:', error);
    throw new Error('Failed to analyze task');
  }
}
