import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Add this import
import MainLayout from './components/Layout/MainLayout';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import CompareProducts from './pages/CompareProducts';
import AIShopper from './pages/AIShopper';
import Recommendations from './pages/Recommendations';
import Watchlist from './pages/Watchlist';
import Alerts from './pages/Alerts';
import Preferences from './pages/Preferences';
import Cart   from './pages/Cart';
import Orders from './pages/Orders';
import Products from './pages/Products';
import SearchResults from './pages/SearchResults'; 

function App() {
  // For demo purposes - replace with actual auth logic
  const isAuthenticated = true; // Set to true temporarily to test

  return (
    <GoogleOAuthProvider clientId="456375997142-16vs1sp1hfate2apnps3v10jjluj370p.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <ThemeProvider> {/* Add ThemeProvider here */}
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Redirect root to dashboard if authenticated, otherwise to login */}
                <Route 
                  path="/" 
                  element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
                />
                
                {/* Protected routes with MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/compare" element={<CompareProducts />} />
                  <Route path="/ai-shopper" element={<AIShopper />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/preferences" element={<Preferences />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<Products />} />
                  <Route path="/search" element={<SearchResults />} />
                </Route>
                
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;