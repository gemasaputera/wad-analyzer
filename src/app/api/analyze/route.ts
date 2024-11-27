import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { DailyTasks } from '../../../../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { taskDescription } = await request.json();

    if (!taskDescription) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    const message:any = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Analyze these tasks and distribute timespent to each day from November 1 to November 25 for every weekday with minimum 8 hours and current status. Data for analyze: ${taskDescription}. 
        Provide a detailed breakdown of tasks per day.
        Respond ONLY with a JSON array in this exact format, no other text: 
        [{ "day": "YYYY-MM-DD", "tasks": [{ "workTitle": "task name", "timeSpent": number, "status": "In Progress" or "Completed" }] }]`
      }]
    });

    // Extract JSON from the response text by finding the first [ and last ]
    const text = message.content[0].text;
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    
    const dailyTasks = JSON.parse(jsonStr) as DailyTasks[];
    
    // Calculate total time spent and overall status
    let totalTimeSpent = 0;
    let hasInProgress = false;
    
    dailyTasks.forEach(day => {
      day.tasks.forEach(task => {
        totalTimeSpent += task.timeSpent;
        if (task.status === 'In Progress') {
          hasInProgress = true;
        }
      });
    });

    return NextResponse.json({
      id: Date.now(),
      dailyTasks,
      updatedAt: new Date().toISOString(),
      totalTimeSpent,
      overallStatus: hasInProgress ? 'In Progress' : 'Completed'
    });
  } catch (error) {
    console.error('Error analyzing task:', error);
    return NextResponse.json(
      { error: 'Failed to analyze task' },
      { status: 500 }
    );
  }
}
