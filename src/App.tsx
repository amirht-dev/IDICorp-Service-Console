import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

const SignInPage = lazy(() => import('@/features/auth/components/SignInPage'));

function App() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />
    </Routes>
  );
}

export default App;
