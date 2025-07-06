// Airtable-related types
export interface AirtableConfig {
  accessToken: string;
  baseId: string;
  tableName?: string;
}

export interface AirtableTable {
  id: string;
  name: string;
  description?: string;
  fields: AirtableField[];
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: any;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableState {
  config: AirtableConfig | null;
  tables: AirtableTable[];
  selectedTable: string | null;
  tableData: AirtableRecord[];
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
}

export interface AirtableContextType extends AirtableState {
  setConfig: (config: AirtableConfig) => Promise<void>;
  fetchTables: () => Promise<void>;
  selectTable: (tableId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}
