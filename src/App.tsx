import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import './App.css';

const DashboardLayout = lazy(
  () => import('@/components/layouts/DashboardLayout'),
);
const SignInPage = lazy(() => import('@/features/auth/components/SignInPage'));
const TasksPage = lazy(() => import('@/features/tasks/components/TasksPage'));
const TaskDetailPage = lazy(
  () => import('@/features/tasks/components/TaskDetailPage'),
);
const CalculatorPage = lazy(
  () => import('@/features/calculator/components/CalculatorPage'),
);
const EchoPage = lazy(() => import('@/features/echo/components/EchoPage'));
const StreamingPage = lazy(
  () => import('@/features/streaming/components/StreamingPage'),
);

function App() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />
      <Route index element={<Navigate to="/tasks" />} />
      <Route element={<DashboardLayout />}>
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="echo" element={<EchoPage />} />
        <Route path="streaming" element={<StreamingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
