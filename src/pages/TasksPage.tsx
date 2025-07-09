import React from 'react';
import { CheckSquare, Plus, Filter, Clock, User } from 'lucide-react';

const TasksPage = () => {
  const tasks = [
    { id: 1, title: 'Review blog post draft', status: 'pending', priority: 'high', assignee: 'John Doe', dueDate: '2024-01-15' },
    { id: 2, title: 'Create social media graphics', status: 'in-progress', priority: 'medium', assignee: 'Jane Smith', dueDate: '2024-01-16' },
    { id: 3, title: 'Schedule newsletter', status: 'completed', priority: 'low', assignee: 'Mike Johnson', dueDate: '2024-01-14' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-darkText">Manage your content creation tasks and deadlines.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-surface hover:bg-surface/80 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">All Tasks</h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-base/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckSquare className="w-5 h-5 text-darkText" />
                  <div>
                    <h3 className="text-white font-medium">{task.title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-darkText">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;