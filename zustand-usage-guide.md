# Zustand State Management - Code Examples Guide

This guide provides concrete examples of how to use our Zustand-based state management system in various components.

## Basic Usage Pattern

All stores are accessible through the `useStore` hook:

```tsx
import useStore from '../store';

// Access a specific store
const { user, login, logout } = useStore.auth();
const { messages, sendMessage } = useStore.chat();
const { tableData, refreshData } = useStore.airtable();
const { addNotification } = useStore.ui();
```

## Authentication Examples

### Login Page

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useStore.auth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      navigate('/chat');
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};
```

### Protected Routes

```tsx
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useStore.auth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
```

## Chat Examples

### Sending Messages

```tsx
import useStore from '../store';

const ChatComponent = () => {
  const { sendMessage, messages, isLoading } = useStore.chat();
  
  const handleSend = async (text) => {
    await sendMessage(text);
  };
  
  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      
      <button onClick={() => handleSend('Hello')} disabled={isLoading}>
        Send Message
      </button>
    </div>
  );
};
```

### Managing Models

```tsx
import useStore from '../store';

const ModelManager = () => {
  const { models, addModel, deleteModel, updateModelAvatar } = useStore.chat();
  
  return (
    <div>
      <h2>AI Models</h2>
      
      <ul>
        {models.map(model => (
          <li key={model.id}>
            {model.name}
            <button onClick={() => deleteModel(model.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <button onClick={() => addModel('New Model', 'https://api.example.com', 'avatar-url')}>
        Add Model
      </button>
    </div>
  );
};
```

## Airtable Examples

### Configuration Setup

```tsx
import { useState } from 'react';
import useStore from '../store';

const AirtableConfig = () => {
  const [accessToken, setAccessToken] = useState('');
  const [baseId, setBaseId] = useState('');
  const { setConfig, isLoading } = useStore.airtable();
  
  const handleSave = async () => {
    await setConfig({ accessToken, baseId });
  };
  
  return (
    <div>
      <input 
        value={accessToken}
        onChange={e => setAccessToken(e.target.value)}
        placeholder="Access Token"
      />
      <input 
        value={baseId}
        onChange={e => setBaseId(e.target.value)}
        placeholder="Base ID"
      />
      <button onClick={handleSave} disabled={isLoading}>
        Save Configuration
      </button>
    </div>
  );
};
```

### Table Selection and Data Display

```tsx
import useStore from '../store';

const TableViewer = () => {
  const { 
    tables, 
    selectedTable, 
    tableData, 
    selectTable, 
    isLoading 
  } = useStore.airtable();
  
  return (
    <div>
      <select 
        value={selectedTable || ''}
        onChange={e => selectTable(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Select a table</option>
        {tables.map(table => (
          <option key={table.id} value={table.id}>
            {table.name}
          </option>
        ))}
      </select>
      
      {tableData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(tableData[0].fields).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map(record => (
              <tr key={record.id}>
                {Object.values(record.fields).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
```

## UI Examples

### Notifications

```tsx
import useStore from '../store';

const NotificationExample = () => {
  const { addNotification, notifications, removeNotification } = useStore.ui();
  
  const showSuccess = () => {
    addNotification({ 
      type: 'success', 
      message: 'Operation completed successfully!' 
    });
  };
  
  const showError = () => {
    addNotification({ 
      type: 'error', 
      message: 'Something went wrong' 
    });
  };
  
  return (
    <div>
      <button onClick={showSuccess}>Show Success</button>
      <button onClick={showError}>Show Error</button>
      
      <div className="notifications">
        {notifications.map(note => (
          <div key={note.id} className={`notification ${note.type}`}>
            {note.message}
            <button onClick={() => removeNotification(note.id)}>
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Theme Toggle

```tsx
import useStore from '../store';

const ThemeToggle = () => {
  const { currentTheme, toggleTheme } = useStore.ui();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};
```

## Advanced Usage

### Cross-Store Interactions

```tsx
import useStore from '../store';

const DataToChatComponent = () => {
  const { tableData } = useStore.airtable();
  const { sendMessage } = useStore.chat();
  const { addNotification } = useStore.ui();
  
  const shareDataInChat = () => {
    if (!tableData.length) {
      addNotification({ 
        type: 'error', 
        message: 'No data available to share' 
      });
      return;
    }
    
    const dataString = JSON.stringify(tableData[0].fields, null, 2);
    sendMessage(`Here's the selected data:\n\`\`\`\n${dataString}\n\`\`\``);
    
    addNotification({ 
      type: 'success', 
      message: 'Data shared in chat' 
    });
  };
  
  return (
    <button onClick={shareDataInChat}>
      Share Current Record in Chat
    </button>
  );
};
```

## Best Practices

1. **Use Selectors**: When possible, select only the state you need to avoid unnecessary re-renders
2. **Action Boundaries**: Keep related actions in the same store, don't cross boundaries
3. **Component Organization**: Group components by feature, not by state usage
4. **Error Handling**: Handle errors at the store level when possible
5. **Status Tracking**: Use loading/error states from stores for UI feedback
