import React, { useState } from 'react';
import { FileText, Plus, Filter, Search, Eye, Clock, AlertCircle, X } from 'lucide-react';

interface ContentPageProps {
  type?: 'all' | 'published' | 'scheduled' | 'pending' | 'rejected';
}

const ContentPage: React.FC<ContentPageProps> = ({ type = 'all' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const posts = [
    { id: 1, title: 'Getting Started with React', status: 'published', author: 'John Doe', date: '2024-01-10', views: 1250 },
    { id: 2, title: 'Advanced TypeScript Tips', status: 'scheduled', author: 'Jane Smith', date: '2024-01-15', views: 0 },
    { id: 3, title: 'Building Modern UIs', status: 'pending', author: 'Mike Johnson', date: '2024-01-12', views: 0 },
    { id: 4, title: 'State Management Guide', status: 'rejected', author: 'Sarah Wilson', date: '2024-01-08', views: 0 },
    { id: 5, title: 'CSS Grid Mastery', status: 'published', author: 'Tom Brown', date: '2024-01-05', views: 890 },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = type === 'all' || post.status === type;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Eye className="w-4 h-4 text-green-400" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'rejected': return <X className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'published': return 'Published Posts';
      case 'scheduled': return 'Scheduled Posts';
      case 'pending': return 'Pending Posts';
      case 'rejected': return 'Rejected Posts';
      default: return 'All Posts';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{getPageTitle()}</h1>
          <p className="text-darkText">Manage your content across all stages of publication.</p>
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-darkText w-5 h-5" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-darkText focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-700">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-base/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span className="capitalize">{post.status}</span>
                      </span>
                      <span className="text-darkText text-sm">by {post.author}</span>
                      <span className="text-darkText text-sm">{post.date}</span>
                      {post.status === 'published' && (
                        <span className="text-darkText text-sm">{post.views} views</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-darkText hover:text-white transition-colors p-2">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-darkText hover:text-white transition-colors p-2">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-darkText mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No posts found</h3>
            <p className="text-darkText">Try adjusting your search or create a new post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;