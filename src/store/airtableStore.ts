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

// Real Airtable API functions
const fetchTables = async (config: AirtableConfig): Promise<AirtableTable[]> => {
  try {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${config.baseId}/tables`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.tables.map((table: any) => ({
      id: table.id,
      name: table.name,
      fields: table.fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.type
      }))
    }));
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};

const fetchTableData = async (config: AirtableConfig, tableId: string): Promise<AirtableRecord[]> => {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${tableId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
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
          const tables = await fetchTables(config);
          
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
          const tables = await fetchTables(config);
          
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
        const { config } = get();
        if (!config) return;
        
        set({ isLoading: true, error: null, selectedTable: tableId });
        
        try {
          const tableData = await fetchTableData(config, tableId);
          
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
        const { selectedTable, config } = get();
        if (!selectedTable || !config) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const tableData = await fetchTableData(config, selectedTable);
          
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
