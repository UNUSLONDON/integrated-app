import React from 'react';
import { LayoutDashboard, TrendingUp, Users, FileText, Calendar, CheckSquare, Plus, Edit, Eye, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getPostsByStatus, getAllPosts } = useStore.airtable();
  
  // Get real data from Airtable
  const allPosts = getAllPosts();
  const postedPosts = getPostsByStatus('Posted');
  const scheduledPosts = getPostsByStatus('Scheduled for Publishing');
  const reviewPosts = getPostsByStatus('Review');
  const approvedPosts = getPostsByStatus('Approved for Publishing');
  const rejectedPosts = getPostsByStatus('Reject');

  const stats = [
    { label: 'Total Posts', value: allPosts.length.toString(), icon: FileText, color: 'text-blue-400' },
    { label: 'Posted', value: postedPosts.length.toString(), icon: Eye, color: 'text-green-400' },
    { label: 'Scheduled', value: scheduledPosts.length.toString(), icon: Calendar, color: 'text-yellow-400' },
    { label: 'In Review', value: reviewPosts.length.toString(), icon: AlertCircle, color: 'text-orange-400' },
    { label: 'Approved', value: approvedPosts.length.toString(), icon: CheckSquare, color: 'text-blue-400' },
    { label: 'Rejected', value: rejectedPosts.length.toString(), icon: X, color: 'text-red-400' }
  ];

  const handleCreateNewPost = () => {
    // Navigate to create post page or open modal
    navigate('/content/all');
  };

  const handleCreateNewTask = () => {
    // Navigate to create task page or open modal
    navigate('/tasks');
  };

  const handleViewCalendar = () => {
    // Navigate to calendar page
    navigate('/calendar');
  };
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateNewPost}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
          
          <button
            onClick={handleCreateNewTask}
            className="bg-surface hover:bg-surface/80 text-white px-4 py-2.5 rounded-lg border border-gray-700 flex items-center space-x-2 transition-colors font-medium"
          >
            <Edit className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
          
          <button
            onClick={handleViewCalendar}
            className="bg-surface hover:bg-surface/80 text-white px-4 py-2.5 rounded-lg border border-gray-700 flex items-center space-x-2 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>View Calendar</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-surface rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-darkText text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {allPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center space-x-3 p-3 bg-base rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{post.fields.Title || 'Untitled'}</p>
                  <p className="text-darkText text-sm">
                    {post.fields.Status || 'Draft'} • {post.fields.Author || 'Unknown'}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-darkText">Connect to Airtable to see your posts</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-3 bg-base rounded-lg">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Review content draft {item}</p>
                  <p className="text-darkText text-sm">Due tomorrow</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;