import React, { useState } from 'react';
import { FileText, Plus, Filter, Search, Eye, Clock, AlertCircle, X, CheckSquare } from 'lucide-react';
import useStore from '../store';
import { Link, useNavigate } from 'react-router-dom';

interface ContentPageProps {
  type?: 'all' | 'Posted' | 'Scheduled for Publishing' | 'Review' | 'Approved for Publishing' | 'Reject';
}

// New component for content status navigation
const StatusNavigation: React.FC<{ currentType: string }> = ({ currentType }) => {
  const statusLinks = [
    { label: 'All Posts', path: '/content/all', type: 'all' },
    { label: 'Posted', path: '/content/posted', type: 'Posted' },
    { label: 'Scheduled', path: '/content/scheduled-for-publishing', type: 'Scheduled for Publishing' },
    { label: 'Review', path: '/content/review', type: 'Review' },
    { label: 'Approved', path: '/content/approved-for-publishing', type: 'Approved for Publishing' },
    { label: 'Rejected', path: '/content/reject', type: 'Reject' },
  ];

  return (
    <div className="flex overflow-x-auto mb-6 bg-surface rounded-lg border border-gray-700">
      {statusLinks.map((link) => (
        <Link 
          key={link.type} 
          to={link.path}
          className={`px-4 py-3 whitespace-nowrap ${
            currentType === link.type 
              ? 'text-primary border-b-2 border-primary font-medium' 
              : 'text-darkText hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

const ContentPage: React.FC<ContentPageProps> = ({ type = 'all' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getPostsByStatus, getAllPosts, tableData } = useStore.airtable();
  
  // Get posts from Airtable based on the page type
  const airtablePosts = type === 'all' ? getAllPosts() : getPostsByStatus(type);
  
  // Transform Airtable records to match the expected format
  const posts = airtablePosts.map(record => ({
    id: record.id,
    title: record.fields.Title || 'Untitled',
    status: record.fields.Status || 'Draft',
    author: record.fields.Author || 'Unknown',
    date: record.fields.Date || new Date().toISOString().split('T')[0],
    views: record.fields.Views || 0,
    content: record.fields.Content || ''
  }));

  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Posted': return <Eye className="w-4 h-4 text-green-400" />;
      case 'Scheduled for Publishing': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'Review': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'Approved for Publishing': return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'Reject': return <X className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Posted': return 'text-green-400 bg-green-400/20';
      case 'Scheduled for Publishing': return 'text-yellow-400 bg-yellow-400/20';
      case 'Review': return 'text-orange-400 bg-orange-400/20';
      case 'Approved for Publishing': return 'text-blue-400 bg-blue-400/20';
      case 'Reject': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'Posted': return 'Posted';
      case 'Scheduled for Publishing': return 'Scheduled for Publishing';
      case 'Review': return 'Review';
      case 'Approved for Publishing': return 'Approved for Publishing';
      case 'Reject': return 'Reject';
      default: return 'All Posts';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{getPageTitle()}</h1>
          <p className="text-darkText">
            {tableData.length > 0 
              ? `Showing ${filteredPosts.length} posts from Airtable` 
              : 'Connect to Airtable to view your content posts'
            }
          </p>
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

      {/* Status Navigation */}
      <StatusNavigation currentType={type} />

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
                        <span>{post.status}</span>
                      </span>
                      <span className="text-darkText text-sm">by {post.author}</span>
                      <span className="text-darkText text-sm">{post.date}</span>
                      {post.status === 'Posted' && (
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
            <h3 className="text-white font-medium mb-2">
              {tableData.length === 0 ? 'No Airtable data connected' : 'No posts found'}
            </h3>
            <p className="text-darkText">
              {tableData.length === 0 
                ? 'Connect to Airtable in the Data Management section to view your posts here.'
                : 'Try adjusting your search or create a new post.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;