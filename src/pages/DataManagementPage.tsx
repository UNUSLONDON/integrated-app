import Page from '../components/common/Page';
import { AirtableSetup } from '../components/data-management/AirtableSetup';
import { AirtableTable } from '../components/data-management/AirtableTable';
import useStore from '../store';

const DataManagementPage = () => {
  const {
    config,
    setConfig,
    fetchTables,
    selectTable,
    refreshData
  } = useStore.airtable();

  const handleConfigSave = async (newConfig: any) => {
    await setConfig(newConfig);
    fetchTables();
  };

  const handleTableSelect = async (tableId: string) => {
    await selectTable(tableId);
  };

  return (
    <Page title="Data Management">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
        {!config ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Connect to Airtable</h2>
            <AirtableSetup onConfigSave={handleConfigSave} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-1 border-r border-gray-200 dark:border-slate-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Data Sources</h3>
              <ul className="space-y-1">
                <li className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-md font-medium">
                  Airtable
                </li>
                <li className="text-gray-500 dark:text-gray-400 px-3 py-2 cursor-not-allowed">
                  Google Sheets (Coming Soon)
                </li>
              </ul>
              <button 
                onClick={() => refreshData()}
                className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Refresh Data
              </button>
            </div>
            <div className="md:col-span-4 p-4">
              <AirtableTable onTableSelect={handleTableSelect} />
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default DataManagementPage;
