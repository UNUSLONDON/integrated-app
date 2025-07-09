import { AirtableSetup } from '../components/data-management/AirtableSetup';
import useStore from '../store';

const DataManagementPage = () => {
  const {
    config,
    setConfig,
    fetchTables,
    refreshData,
    tables,
    tableData,
    isLoading
  } = useStore.airtable();

  const handleConfigSave = async (newConfig: any) => {
    await setConfig(newConfig);
    fetchTables();
    // Auto-select the first table (Content Posts) and fetch its data
    if (tables.length > 0) {
      const contentTable = tables.find(table => table.name === 'Content Posts') || tables[0];
      await useStore.airtable.getState().selectTable(contentTable.id);
    }
  };

  const handleRefreshData = async () => {
    await refreshData();
  };

  return (
    <div className="p-6">
      <div className="bg-surface shadow-lg rounded-lg overflow-hidden">
        {!config ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Connect to Airtable</h2>
            <AirtableSetup onConfigSave={handleConfigSave} />
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Airtable Connected</h2>
                <p className="text-darkText">
                  Your content data is now synced and available across all content pages.
                </p>
              </div>
              <button 
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-base rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Connected Tables</h3>
                <p className="text-2xl font-bold text-primary">{tables.length}</p>
                <p className="text-darkText text-sm mt-1">Active tables</p>
              </div>
              
              <div className="bg-base rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Total Records</h3>
                <p className="text-2xl font-bold text-primary">{tableData.length}</p>
                <p className="text-darkText text-sm mt-1">Content posts</p>
              </div>
              
              <div className="bg-base rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                <p className="text-2xl font-bold text-green-400">Active</p>
                <p className="text-darkText text-sm mt-1">Connection status</p>
              </div>
            </div>
            
            <div className="mt-8 bg-base rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">📊 Data Sync</h4>
                  <p className="text-darkText text-sm">
                    Your Airtable content is automatically synced and filtered by status across different content pages.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">🔄 Real-time Updates</h4>
                  <p className="text-darkText text-sm">
                    Changes in your Airtable base are reflected in the content pages when you refresh the data.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">📝 Status Filtering</h4>
                  <p className="text-darkText text-sm">
                    Posts are automatically organized by their status: Published, Scheduled, Pending, and Rejected.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">🎯 Easy Management</h4>
                  <p className="text-darkText text-sm">
                    Navigate to any content page to view posts filtered by their current status in Airtable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagementPage;