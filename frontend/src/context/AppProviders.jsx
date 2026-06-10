import { TaskProvider } from './TaskContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import { ToastProvider } from './ToastContext.jsx';
import { UserProvider } from './UserContext.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <TaskProvider>{children}</TaskProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
