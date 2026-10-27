import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

const DashboardLayout = lazy(
  () => import('@/components/layouts/DashboardLayout'),
);
const SignInPage = lazy(() => import('@/features/auth/components/SignInPage'));
const TasksPage = lazy(() => import('@/features/tasks/components/TasksPage'));
const TaskDetailPage = lazy(
  () => import('@/features/tasks/components/TaskDetailPage'),
);

function App() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
