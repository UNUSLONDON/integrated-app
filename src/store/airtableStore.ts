import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AirtableConfig, AirtableTable, AirtableRecord, AirtableState } from '../types/airtable';

interface AirtableStore extends AirtableState {
  setConfig: (config: AirtableConfig) => Promise<void>;
  fetchTables: () => Promise<void>;
  selectTable: (tableId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearData: () => void;
  getPostsByStatus: (status: string) => AirtableRecord[];
  getAllPosts: () => AirtableRecord[];
}

// Mock API functions - in a real app, these would call the Airtable API
const mockFetchTables = async (_config: AirtableConfig): Promise<AirtableTable[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { 
      id: 'tbl1',
      name: 'Content Posts',
      fields: [
        { id: 'fld1', name: 'Title', type: 'text' },
        { id: 'fld2', name: 'Content', type: 'text' },
        { id: 'fld3', name: 'Status', type: 'select' },
        { id: 'fld4', name: 'Author', type: 'text' },
        { id: 'fld5', name: 'Date', type: 'date' },
        { id: 'fld6', name: 'Views', type: 'number' }
      ]
    },
  ];
};

const mockFetchTableData = async (tableId: string): Promise<AirtableRecord[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock content posts data
  if (tableId === 'tbl1') {
    const statuses = ['Review', 'Reject', 'Approved for Publishing', 'Posted', 'Scheduled for Publishing'];
    const authors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];
    const titles = [
      'Getting Started with React',
      'Advanced TypeScript Tips',
      'Building Modern UIs',
      'State Management Guide',
      'CSS Grid Mastery',
      'JavaScript Best Practices',
      'Web Performance Optimization',
      'Responsive Design Patterns',
      'API Integration Strategies',
      'Testing React Applications',
      'Modern CSS Techniques',
      'Database Design Principles',
      'Security Best Practices',
      'DevOps for Frontend',
      'Mobile-First Development'
    ];
    
    return Array(15).fill(0).map((_, index) => ({
      id: `rec${index}`,
      fields: {
        Title: titles[index] || `Blog Post ${index + 1}`,
        Content: `This is the content for ${titles[index] || `Blog Post ${index + 1}`}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        Status: statuses[Math.floor(Math.random() * statuses.length)],
        Author: authors[Math.floor(Math.random() * authors.length)],
        Date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
        Views: Math.floor(Math.random() * 2000)
      },
      createdTime: new Date().toISOString()
    }));
  }
  
  return [];
};

const useAirtableStore = create<AirtableStore>()(
  persist(
    (set, get) => ({
      config: null,
      tables: [],
      selectedTable: null,
      tableData: [],
      isLoading: false,
      error: null,
      lastSync: null,
      
      setConfig: async (config: AirtableConfig) => {
        set({ isLoading: true, error: null });
        
        try {
          const tables = await mockFetchTables(config);
          
          set({
            config,
            tables,
            isLoading: false,
            lastSync: new Date()
          });
        } catch (error) {
          console.error('Failed to connect to Airtable:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to connect to Airtable. Please check your access token and base ID.'
          });
          throw error;
        }
      },
      
      fetchTables: async () => {
        const { config } = get();
        if (!config) {
          set({ error: 'No Airtable configuration provided' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const tables = await mockFetchTables(config);
          
          set({
            tables,
            isLoading: false,
            lastSync: new Date()
          });
        } catch (error) {
          console.error('Failed to fetch tables:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to fetch tables. Please try again.'
          });
        }
      },
      
      selectTable: async (tableId: string) => {
        set({ isLoading: true, error: null, selectedTable: tableId });
        
        try {
          const tableData = await mockFetchTableData(tableId);
          
          set({
            tableData,
            isLoading: false,
            lastSync: new Date()
          });
        } catch (error) {
          console.error('Failed to fetch table data:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to fetch table data. Please try again.'
          });
        }
      },
      
      refreshData: async () => {
        const { selectedTable } = get();
        if (!selectedTable) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const tableData = await mockFetchTableData(selectedTable);
          
          set({
            tableData,
            isLoading: false,
            lastSync: new Date()
          });
        } catch (error) {
          console.error('Failed to refresh data:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to refresh data. Please try again.'
          });
        }
      },
      
      clearData: () => {
        set({
          config: null,
          tables: [],
          selectedTable: null,
          tableData: [],
          lastSync: null
        });
      },
      
      getPostsByStatus: (status: string) => {
        const { tableData } = get();
        return tableData.filter(record => 
          record.fields.Status === status
        );
      },
      
      getAllPosts: () => {
        const { tableData } = get();
        return tableData;
      }
    }),
    {
      name: 'airtable-storage',
      partialize: (state) => ({
        config: state.config,
        selectedTable: state.selectedTable
      })
    }
  )
);

export default useAirtableStore;
