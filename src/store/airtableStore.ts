import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AirtableConfig, AirtableTable, AirtableRecord, AirtableState } from '../types/airtable';

interface AirtableStore extends AirtableState {
  setConfig: (config: AirtableConfig) => Promise<void>;
  fetchTables: () => Promise<void>;
  selectTable: (tableId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearData: () => void;
}

// Mock API functions - in a real app, these would call the Airtable API
const mockFetchTables = async (_config: AirtableConfig): Promise<AirtableTable[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { 
      id: 'tbl1', 
      name: 'Products', 
      fields: [
        { id: 'fld1', name: 'Name', type: 'text' },
        { id: 'fld2', name: 'Description', type: 'text' },
        { id: 'fld3', name: 'Price', type: 'number' },
        { id: 'fld4', name: 'InStock', type: 'checkbox' }
      ]
    },
    { 
      id: 'tbl2', 
      name: 'Customers', 
      fields: [
        { id: 'fld5', name: 'Name', type: 'text' },
        { id: 'fld6', name: 'Email', type: 'email' },
        { id: 'fld7', name: 'Address', type: 'text' },
        { id: 'fld8', name: 'Phone', type: 'phone' }
      ]
    },
    { 
      id: 'tbl3', 
      name: 'Orders', 
      fields: [
        { id: 'fld9', name: 'OrderID', type: 'text' },
        { id: 'fld10', name: 'Customer', type: 'link' },
        { id: 'fld11', name: 'Products', type: 'multilink' },
        { id: 'fld12', name: 'Total', type: 'currency' },
        { id: 'fld13', name: 'Date', type: 'date' }
      ]
    }
  ];
};

const mockFetchTableData = async (tableId: string): Promise<AirtableRecord[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock data based on table ID
  if (tableId === 'tbl1') {
    return Array(15).fill(0).map((_, index) => ({
      id: `rec${index}`,
      fields: {
        Name: `Product ${index + 1}`,
        Description: `This is a description for product ${index + 1}`,
        Price: (Math.random() * 100).toFixed(2),
        InStock: Math.random() > 0.3
      },
      createdTime: new Date().toISOString()
    }));
  } else if (tableId === 'tbl2') {
    return Array(10).fill(0).map((_, index) => ({
      id: `rec${index + 100}`,
      fields: {
        Name: `Customer ${index + 1}`,
        Email: `customer${index + 1}@example.com`,
        Address: `${Math.floor(Math.random() * 1000)} Main St, City ${index + 1}`,
        Phone: `+1 555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      },
      createdTime: new Date().toISOString()
    }));
  } else {
    return Array(8).fill(0).map((_, index) => ({
      id: `rec${index + 200}`,
      fields: {
        OrderID: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        Customer: `Customer ${Math.floor(Math.random() * 10) + 1}`,
        Products: `Product ${Math.floor(Math.random() * 15) + 1}, Product ${Math.floor(Math.random() * 15) + 1}`,
        Total: (Math.random() * 500).toFixed(2),
        Date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0]
      },
      createdTime: new Date().toISOString()
    }));
  }
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
