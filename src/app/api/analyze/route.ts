import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { DailyTasks } from '../../../../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { taskDescription, model } = await request.json();

    if (!taskDescription) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    const modelMapping = {
      'claude-3-5-haiku': 'claude-3-5-haiku-latest',
      'claude-3-5-sonnet': 'claude-3-5-sonnet-latest',
      'claude-3-opus': 'claude-3-opus-latest'
    };

    const mappedModel = modelMapping[model as keyof typeof modelMapping] || model;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];
    const formattedToday = today.toISOString().split('T')[0];

    const message: any = await anthropic.messages.create({
      model: mappedModel,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Analyze these tasks and distribute timespent to each day from ${formattedFirstDay} to ${formattedToday} for every weekday with minimum 8 hours and current status. Data for analyze: ${taskDescription}. 
        Provide a detailed breakdown of tasks per day. For the taks with workTitle "Coffee Morning..." make default 30 minutes.
        Respond ONLY with a JSON array in this exact format, no other text: 
        [{ "day": "YYYY-MM-DD", "tasks": [{ "workTitle": "task name", "timeSpent": number, "status": "In Progress" or "Completed" }] }]`
      }]
    });

    const text = message.content[0].text;

    if (!text.includes('[') || !text.includes(']')) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          feedback: text.split('\n').filter((line: string) => line.trim()) // Clean up the feedback
        },
        { status: 422 }
      );
    }

    const jsonStart = text?.indexOf('[');
    const jsonEnd = text?.lastIndexOf(']');
    const jsonStr = text?.slice(jsonStart, jsonEnd + 1);
    const dailyTasks = JSON.parse(jsonStr!) as DailyTasks[];

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
