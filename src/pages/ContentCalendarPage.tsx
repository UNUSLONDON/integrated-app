import React from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';

const ContentCalendarPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Calendar</h1>
          <p className="text-darkText">Plan and schedule your content across all platforms.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-surface hover:bg-surface/80 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-darkText mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Calendar View Coming Soon</h3>
            <p className="text-darkText">We're working on an interactive calendar to help you manage your content schedule.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendarPage;