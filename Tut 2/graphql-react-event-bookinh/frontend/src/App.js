import './App.css';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token: token,
          userId: userId,
          login: login,
          logout: logout
        }}
      >
        <MainNavigation />
        <main className="main-content">
          <Routes>

            {!token && <Route path="/bookings" element={<Navigate replace to="/auth" />} />}
            {token && <Route path="/" element={<Navigate replace to="/events" />} />}
            {token && <Route path="/auth" element={<Navigate replace to="/events" />} />}
            {!token && <Route path="/auth" element={<AuthPage />} />}
            <Route path="/events" element={<EventsPage />} />
            {token && <Route path="/bookings" element={<BookingsPage />} />}
            <Route path="*" element={<Navigate replace to={token ? "/events" : "/auth"} />} />
            {!token && <Route path="*" element={<Navigate replace to="/auth" />} />}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
