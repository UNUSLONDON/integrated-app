# Integrated Chat App Launch Guide

## Starting the Application

### Method 1: Using Terminal
1. Open a terminal window
2. Navigate to the app directory:
   ```powershell
   cd "c:\Users\meshach\Desktop\Chat Project\integrated-app"
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal output (typically http://localhost:5178)

### Method 2: Using VS Code Tasks
1. Open the project in VS Code
2. Press `Ctrl+Shift+P` to open the command palette
3. Type "Tasks: Run Task" and select it
4. Choose "Start Integrated App" from the list
5. The application will start and the URL will be displayed in the terminal panel
6. Open your browser and navigate to the displayed URL

## Default Login Credentials
For demo purposes, use:
- Email: `demo@chatapp.com`
- Password: `demo123`

## Common Operations
- **Building for Production**: `npm run build`
- **Previewing Production Build**: `npm run preview`
- **Running Linter**: `npm run lint`

## Troubleshooting
- If the app fails to start, try:
  - Ensuring all dependencies are installed: `npm install`
  - Checking for TypeScript errors: `npm run lint`
  - Verifying there are no port conflicts by checking the terminal output

## Additional Resources
For more information, refer to:
- `launch-checklist.md`: A detailed list of features to test
- `step5-completion-report.md`: Details of the state management implementation
- `zustand-usage-guide.md`: Guide to the Zustand state management pattern used in the app
- `integration-status.md`: Current status of the integration project
