import { motion } from 'motion/react';
import { TaskAnalysis } from '../../../types';
import { format } from 'date-fns';

interface TaskTableProps {
  analysis: TaskAnalysis | null;
}

export default function TaskTable({ analysis }: TaskTableProps) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Analysis Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Time Spent</p>
            <p className="text-lg font-medium">{analysis.totalTimeSpent} hours</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Status</p>
            <span className={`px-2 py-1 text-sm font-semibold rounded-full 
              ${analysis.overallStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {analysis.overallStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {analysis.dailyTasks.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-3">
              <h3 className="text-lg font-medium text-gray-900">
                {format(new Date(day.day), 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent (hours)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {day.tasks.map((task, taskIndex) => (
                    <motion.tr
                      key={`${day.day}-${taskIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.workTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.timeSpent}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {task.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
