# Chat Project - Integrated Application

This project combines two separate React applications (Data Management and Chat) into a single unified application with shared authentication and state management.

## Project Structure

```
src/
  components/
    common/        # Shared UI components
    chat/          # Chat-specific components
    data-management/ # Airtable data management components
  contexts/        # React contexts for state management
  hooks/           # Custom React hooks
  pages/           # Main page components
  routes/          # Routing configurations
  services/        # API and service integrations
  types/           # TypeScript type definitions
```

## Technologies Used

- **React**: Front-end library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Routing library
- **React Query**: Data fetching and caching
- **Zustand**: State management

## Features

1. **Authentication**
   - Login/logout functionality
   - Protected routes

2. **Chat Interface**
   - Message display
   - Message input
   - AI model selection

3. **Data Management**
   - Airtable connection
   - Data viewing and interaction

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
```

## Development Plan Progress

- [x] Project setup with Vite, TypeScript, and Tailwind CSS
- [x] Basic routing structure
- [x] Placeholder pages for all main sections
- [x] Type definitions for state
- [ ] Authentication context implementation
- [ ] Component migration from original apps
- [ ] State management with Zustand
- [ ] Data fetching with React Query
- [ ] Integration between chat and data management features
```
