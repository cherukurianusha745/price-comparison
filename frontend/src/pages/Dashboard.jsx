import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Mail, User, LogIn, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PriceAlert from "../components/Dashboard/PriceAlert";
import StatsCards from "../components/Dashboard/StatsCards";
import AIShopperCard from "../components/AIShopper/AIShopperCard";
import RecommendationsSection from "../components/Recommendations/RecommendationsSection";
import ProfileImage from "../components/Upload/ProfileImage";

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const container =
    theme === "dark" ? "bg-[#0A0A0A]" : "bg-gray-50";

  const card =
    theme === "dark"
      ? "bg-black border-gray-900"
      : "bg-white border-gray-200";

  const text =
    theme === "dark" ? "text-white" : "text-gray-900";

  const subText =
    theme === "dark"
      ? "text-gray-400"
      : "text-gray-500";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div
      className={`p-8 space-y-8 min-h-screen ${container}`}
    >
      {user ? (
        <>
          {/* PROFILE */}
          <div
            className={`rounded-xl p-6 border shadow-xl ${card}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <ProfileImage user={user} editable />

                <div>
                  <h1
                    className={`text-2xl font-bold ${text}`}
                  >
                    {greeting()}, {user.name} 👋
                  </h1>

                  <div
                    className={`flex gap-2 mt-2 ${subText}`}
                  >
                    <Mail size={16} />
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/settings")}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Settings />
              </button>
            </div>
          </div>

          <PriceAlert />
          <StatsCards />

          {/* ✅ EQUAL SIZE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <div className="lg:col-span-6 flex">
              <AIShopperCard />
            </div>

            <div className="lg:col-span-6 flex">
              <RecommendationsSection />
            </div>

          </div>
        </>
      ) : (
        <>
          {/* LOGIN */}
          <div
            className={`rounded-xl p-12 text-center border shadow-xl ${card}`}
          >
            <User
              className={`mx-auto mb-4 ${subText}`}
              size={40}
            />

            <h2
              className={`text-2xl font-bold ${text}`}
            >
              Please Login
            </h2>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg"
            >
              <LogIn className="inline mr-2" />
              Login
            </button>
          </div>

          <div className="opacity-30 pointer-events-none space-y-8">
            <PriceAlert />
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

              <div className="lg:col-span-6 flex">
                <AIShopperCard />
              </div>

              <div className="lg:col-span-6 flex">
                <RecommendationsSection />
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;