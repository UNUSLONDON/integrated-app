import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Table, List, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AirtableRecord } from '../../types/airtable';
import useStore from '../../store';

interface AirtableTableProps {
  onTableSelect: (tableId: string) => void;
}

export const AirtableTable: React.FC<AirtableTableProps> = ({
  onTableSelect
}) => {
  const { tables, selectedTable, tableData, isLoading, lastSync } = useStore.airtable();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

  const selectedTableData = tables.find(table => table.id === selectedTable);
  
  const filteredData = tableData.filter(record => {
    if (!searchTerm) return true;
    
    return Object.values(record.fields).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const getFieldKeys = () => {
    if (!tableData.length) return [];
    return Object.keys(tableData[0].fields);
  };

  const formatFieldValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getRecordIcon = (record: AirtableRecord) => {
    const fields = record.fields;
    const firstField = Object.values(fields)[0];
    
    if (typeof firstField === 'string') {
      if (firstField.includes('image') || firstField.includes('photo')) return '🖼️';
      if (firstField.includes('video')) return '🎥';
      if (firstField.includes('document') || firstField.includes('pdf')) return '📄';
    }
    
    return '📄';
  };

  return (
    <div className="flex">
      {/* Table Navigator */}
      <div className="w-64 bg-[#1E2A3A] rounded-lg border border-gray-700 overflow-hidden mr-6">
        <div className="p-3 border-b border-gray-700 bg-[#121A24]/50">
          <h4 className="font-medium">Tables</h4>
        </div>
        <ul className="py-2">
          {tables.map((table) => (
            <li key={table.id}>
              <button
                onClick={() => onTableSelect(table.id)}
                className={`w-full text-left px-4 py-2 flex items-center transition-colors ${
                  selectedTable === table.id
                    ? 'text-[#FF6B2B] bg-[#FF6B2B]/10'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#121A24]/50'
                }`}
              >
                <Table className="w-4 h-4 mr-2" />
                <span className="truncate">{table.name}</span>
                {selectedTable === table.id && (
                  <span className="ml-auto text-xs bg-[#1E2A3A] px-2 py-0.5 rounded">
                    {tableData.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Table View */}
      <div className="flex-1">
        {selectedTableData && (
          <>
            {/* Search and Filter Bar */}
            <div className="flex items-center mb-4 space-x-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search in ${selectedTableData.name} table...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1E2A3A] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/50 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
              <button className="bg-[#1E2A3A] hover:bg-[#1E2A3A]/80 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#94A3B8]">View:</span>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#FF6B2B]/20 text-[#FF6B2B]'
                      : 'bg-[#1E2A3A] text-[#94A3B8]'
                  }`}
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#FF6B2B]/20 text-[#FF6B2B]'
                      : 'bg-[#1E2A3A] text-[#94A3B8]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="bg-[#1E2A3A] rounded-lg border border-gray-700 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#FF6B2B] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-[#94A3B8]">Loading table data...</p>
                </div>
              ) : paginatedData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-[#121A24]/50 border-b border-gray-700">
                        <th className="w-10 px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            className="rounded bg-[#121A24] border-gray-700 text-[#FF6B2B] focus:ring-[#FF6B2B]/50"
                          />
                        </th>
                        {getFieldKeys().map((fieldKey) => (
                          <th key={fieldKey} className="px-4 py-3 text-left text-sm font-medium">
                            {fieldKey}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((record) => (
                        <tr key={record.id} className="border-b border-gray-700 hover:bg-[#121A24]/30 transition-colors">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="rounded bg-[#121A24] border-gray-700 text-[#FF6B2B] focus:ring-[#FF6B2B]/50"
                            />
                          </td>
                          {getFieldKeys().map((fieldKey) => (
                            <td key={fieldKey} className="px-4 py-3 text-sm">
                              <div className="flex items-center">
                                {fieldKey === getFieldKeys()[0] && (
                                  <div className="w-8 h-8 rounded bg-[#FF6B2B]/20 flex items-center justify-center mr-3">
                                    <span className="text-[#FF6B2B]">{getRecordIcon(record)}</span>
                                  </div>
                                )}
                                <span className="truncate max-w-xs">
                                  {formatFieldValue(record.fields[fieldKey])}
                                </span>
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="p-1 text-[#94A3B8] hover:text-white transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-[#94A3B8] hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-[#94A3B8] hover:text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Table className="w-12 h-12 mx-auto mb-4 text-[#94A3B8]" />
                  <p className="text-[#94A3B8]">No records found in this table</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700">
                  <div className="flex items-center text-sm text-[#94A3B8]">
                    <span>
                      Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredData.length)} of {filteredData.length} records
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-[#121A24] text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded transition-colors ${
                          currentPage === i + 1
                            ? 'bg-[#FF6B2B]/20 text-[#FF6B2B]'
                            : 'bg-[#121A24] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-[#121A24] text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Operations */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button className="bg-[#1E2A3A] hover:bg-[#1E2A3A]/80 text-white px-3 py-1.5 rounded-lg border border-gray-700 flex items-center text-sm transition-colors">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </button>
                <button className="bg-[#1E2A3A] hover:bg-[#1E2A3A]/80 text-white px-3 py-1.5 rounded-lg border border-gray-700 flex items-center text-sm transition-colors">
                  <Eye className="w-4 h-4 mr-2" />
                  Export Selected
                </button>
              </div>
              <div className="text-sm text-[#94A3B8]">
                Last synchronized: {lastSync ? (
                  <span className="text-white">
                    {lastSync.toLocaleString()}
                  </span>
                ) : (
                  <span>Never</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
