import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Crown, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PriceAlert from '../components/Dashboard/PriceAlert';
import StatsCards from '../components/Dashboard/StatsCards';
import AIShopperCard from '../components/AIShopper/AIShopperCard';
import RecommendationsSection from '../components/Recommendations/RecommendationsSection';
import ProductsSection from '../components/Products/ProductsSection';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'GU';
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'Guest User';
  };

  const getUserPlan = () => {
    return user?.plan || 'Free Plan';
  };

  const getPlanColor = () => {
    if (theme === 'dark') {
      return user?.plan === 'Pro Plan' ? 'text-green-400' : 'text-gray-400';
    } else {
      return user?.plan === 'Pro Plan' ? 'text-green-600' : 'text-gray-500';
    }
  };

  const getAvatarColor = () => {
    if (user?.plan === 'Pro Plan') return 'bg-gradient-to-r from-indigo-600 to-purple-700';
    if (user?.picture) return 'bg-transparent';
    if (user?.name) return 'bg-blue-600';
    return 'bg-gray-700';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Theme-based classes
  const containerClasses = theme === 'dark'
    ? 'bg-[#0A0A0A]'
    : 'bg-gray-50';

  const profileCardClasses = theme === 'dark'
    ? 'bg-black border-gray-900'
    : 'bg-white border-gray-200';

  const textPrimaryClasses = theme === 'dark'
    ? 'text-white'
    : 'text-gray-900';

  const textSecondaryClasses = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500';

  const dividerClasses = theme === 'dark'
    ? 'border-gray-900'
    : 'border-gray-200';

  return (
    <div className={`p-8 space-y-8 min-h-screen transition-colors ${containerClasses}`}>
      {user ? (
        // Logged In State - Show User Profile
        <>
          <div className={`rounded-xl p-6 border shadow-xl transition-colors ${profileCardClasses}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${getAvatarColor()}`}>
                    {getUserInitials().charAt(0)}
                  </div>
                  {user?.plan === 'Pro Plan' && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 border-2 border-black">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className={`text-2xl font-bold ${textPrimaryClasses}`}>
                    {getGreeting()}, {getDisplayName()}!
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1 ${textSecondaryClasses}`}>
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user?.email || 'No email provided'}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${getPlanColor()}`}>
                      <Crown className="w-4 h-4" />
                      <span>{getUserPlan()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-4 mt-6 pt-6 border-t ${dividerClasses}`}>
              <div>
                <p className={`text-sm ${textSecondaryClasses}`}>Active Trackers</p>
                <p className={`text-xl font-semibold ${textPrimaryClasses}`}>124 <span className="text-green-500 text-sm font-normal">+12 this week</span></p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClasses}`}>Total Savings</p>
                <p className={`text-xl font-semibold ${textPrimaryClasses}`}>$2,200.50</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClasses}`}>Member Since</p>
                <p className={`text-xl font-semibold ${textPrimaryClasses}`}>Jan 2026</p>
              </div>
            </div>
          </div>

          <PriceAlert />
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <AIShopperCard />
            <RecommendationsSection />
          </div>

          <ProductsSection limit={4} />
        </>
      ) : (
        // Logged Out State - Show Please Login Message
        <>
          <div className={`rounded-xl p-12 text-center border shadow-xl ${profileCardClasses}`}>
            <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <User className={`w-10 h-10 ${textSecondaryClasses}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${textPrimaryClasses}`}>Please Login</h2>
            <p className={`mb-6 max-w-md mx-auto ${textSecondaryClasses}`}>
              You need to be logged in to access your personalized dashboard, track prices, and manage your watchlist.
            </p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Login to Your Account
            </button>
            <p className={`text-sm mt-4 ${textSecondaryClasses}`}>
              Don't have an account? <button onClick={() => navigate('/register')} className="text-indigo-600 hover:text-indigo-700">Register here</button>
            </p>
          </div>

          {/* Preview for logged out users - Grayed out */}
          <div className="space-y-8 opacity-30 pointer-events-none select-none">
            <PriceAlert />
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <AIShopperCard />
              <RecommendationsSection />
            </div>
            <ProductsSection limit={4} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;