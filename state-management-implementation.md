# State Management Implementation

This document outlines the state management approach used in our integrated Chat and Data Management application.

## Overview

We've implemented a global state management solution using Zustand to replace the previous Context API and local state approach. This provides several benefits:

1. **Simplified Access**: Any component can access state without prop drilling
2. **Persistence**: Built-in persistence for relevant state
3. **Performance**: Better performance than Context API with less re-renders
4. **Modularity**: Stores are separated by feature but accessible through a unified API

## Store Structure

### 1. Auth Store (`authStore.ts`)

Manages authentication state including:

- User information
- Authentication status
- Login/logout functionality

**Key features:**
- Persistent storage of authentication state
- Mock authentication implementation
- User profile management

**Sample usage:**
```tsx
const { user, login, logout, isAuthenticated } = useStore.auth();

// Login with credentials
await login({ email: "user@example.com", password: "password" });

// Access user info
console.log(user?.name);

// Check authentication status
if (isAuthenticated) {
  // Perform authenticated action
}
```

### 2. Chat Store (`chatStore.ts`)

Manages all chat-related state:

- Messages
- AI models configuration
- Current model selection
- File attachments

**Key features:**
- Message sending functionality
- Model management (add, delete, update)
- File attachment handling
- Persistent chat history

**Sample usage:**
```tsx
const { 
  messages, 
  models, 
  currentModelId, 
  sendMessage, 
  addModel 
} = useStore.chat();

// Send a new message
await sendMessage("Hello, how can I help you?");

// Add a new AI model
addModel("Claude", "https://api.example.com/claude", "avatar-url");
```

### 3. Airtable Store (`airtableStore.ts`)

Manages Airtable integration state:

- Configuration (access token, base ID)
- Table lists and data
- Selected table
- Loading states

**Key features:**
- Configuration management
- Table and record fetching
- Mock API implementation
- Persistent configuration

**Sample usage:**
```tsx
const { 
  config, 
  tables, 
  tableData, 
  setConfig, 
  selectTable 
} = useStore.airtable();

// Set Airtable configuration
await setConfig({ 
  accessToken: "token", 
  baseId: "appXXXXXXXXX" 
});

// Select a table to view
await selectTable("tblXXXXXXXXX");
```

### 4. UI Store (`uiStore.ts`)

Manages global UI state:

- Notifications
- Theme preferences
- Sidebar visibility
- Responsive layout detection

**Key features:**
- Notification system
- Theme toggling
- Mobile detection
- Sidebar management

**Sample usage:**
```tsx
const { 
  addNotification, 
  toggleTheme, 
  currentTheme,
  isMobile 
} = useStore.ui();

// Show a notification
addNotification({ 
  type: "success", 
  message: "Operation successful" 
});

// Toggle theme
toggleTheme();

// Check device type
if (isMobile) {
  // Use mobile layout
}
```

## Store Integration

All stores are accessible through a unified API via `useStore`:

```tsx
import useStore from './store';

function Component() {
  const { user } = useStore.auth();
  const { messages } = useStore.chat();
  const { tableData } = useStore.airtable();
  const { addNotification } = useStore.ui();
  
  // Component logic using state from multiple stores
}
```

## Persistence

We've implemented persistence for key user data:

- Authentication state (user, tokens)
- Chat history and model configurations
- Airtable configuration

This ensures that user sessions and data are preserved between page refreshes and browser sessions.

## Migration from Context API

The migration from Context API to Zustand involved:

1. Creating store implementations for each domain (auth, chat, etc.)
2. Adding persistence middleware where needed
3. Updating components to use `useStore` instead of Context hooks
4. Removing Context Providers from the application tree
5. Ensuring proper typing throughout the application

## Next Steps

1. Implement optimistic updates for better UX
2. Add more robust error handling in stores
3. Implement cross-store actions for complex workflows
4. Add real API integrations to replace mock implementations
