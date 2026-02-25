import React from 'react';
import { Search, X, LogOut, LogIn, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { searchQuery, setSearchQuery, clearSearch } = useAppContext();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() !== '' && window.location.pathname !== '/search') {
      navigate('/search');
    } else if (query.trim() === '' && window.location.pathname === '/search') {
      navigate('/dashboard');
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    if (window.location.pathname === '/search') {
      navigate('/dashboard');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate('/search');
    }
  };

  const handleImport = () => {
    console.log('Import list clicked');
  };

  const handleLogout = () => {
    logout(); // This clears user from context and localStorage
    // Stay on dashboard - don't navigate to login
    // The dashboard will automatically show the login message
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'G';
  };

  // Theme-based classes
  const headerClasses = theme === 'dark' 
    ? 'bg-black border-gray-900' 
    : 'bg-white border-gray-200';
  
  const titleClasses = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-900';
  
  const searchInputClasses = theme === 'dark'
    ? 'bg-gray-900 text-white border-gray-800 focus:ring-indigo-500'
    : 'bg-gray-100 text-gray-900 border-gray-200 focus:ring-black';
  
  const searchTextClasses = theme === 'dark'
    ? 'text-gray-500'
    : 'text-gray-400';
  
  const buttonClasses = theme === 'dark'
    ? 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800'
    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';
  
  const borderClasses = theme === 'dark'
    ? 'border-gray-800'
    : 'border-gray-200';

  return (
    <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 sticky top-0 z-50 transition-colors ${headerClasses}`}>
      <div className="flex flex-col">
        <h1 className={`text-xl font-bold transition-colors ${titleClasses}`}>Comparison Dashboard</h1>
        {searchQuery && window.location.pathname !== '/search' && (
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Searching: "{searchQuery}" 
            <button 
              onClick={() => navigate('/search')}
              className={`ml-2 ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              View all results →
            </button>
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${searchTextClasses}`} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            className={`w-full text-sm rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 transition-shadow border ${searchInputClasses}`}
            placeholder="Search products by name, category or store..."
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className={`h-4 w-4 ${searchTextClasses} hover:${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          )}
        </div>
        
        <button
          onClick={handleImport}
          className={`border font-medium py-2.5 px-4 rounded-full text-sm transition-colors shadow-sm flex items-center gap-2 ${buttonClasses}`}
        >
          Import List
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Menu */}
        <div className={`flex items-center gap-3 pl-2 border-l ${borderClasses}`}>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-indigo-400 shadow-lg">
                <span className="text-white font-bold text-lg">
                  {getUserInitial()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors group border ${
                  theme === 'dark'
                    ? 'bg-gray-900 hover:bg-red-600/20 text-gray-300 hover:text-red-400 border-gray-800'
                    : 'bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-200'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;