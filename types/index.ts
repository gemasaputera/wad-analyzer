export interface Task {
  workTitle: string;
  timeSpent: number;
  status: 'Completed' | 'In Progress';
}

export interface DailyTasks {
  day: string;
  tasks: Task[];
}

export interface TaskAnalysis {
  id: number;
  dailyTasks: DailyTasks[];
  workTitle: string;
  updatedAt: string;
  timeSpent: number;
  totalTimeSpent: number;
  overallStatus: 'Completed' | 'In Progress';
  status: 'Completed' | 'In Progress';
}

export interface AnalysisFormData {
  taskDescription: string;
}
