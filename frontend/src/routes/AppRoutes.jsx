import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import AddTaskPage from '../pages/AddTaskPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';
import CalendarPage from '../pages/CalendarPage.jsx';
import CompletedTasksPage from '../pages/CompletedTasksPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ImportantTasksPage from '../pages/ImportantTasksPage.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import PendingTasksPage from '../pages/PendingTasksPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import TaskDetailsPage from '../pages/TaskDetailsPage.jsx';
import TaskListPage from '../pages/TaskListPage.jsx';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="tasks/new" element={<AddTaskPage />} />
        <Route path="tasks/:id" element={<TaskDetailsPage />} />
        <Route path="completed" element={<CompletedTasksPage />} />
        <Route path="pending" element={<PendingTasksPage />} />
        <Route path="important" element={<ImportantTasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
