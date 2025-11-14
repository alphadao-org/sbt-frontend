import {
  Award,
  CheckSquare,
  Grid3X3,
  Home as HomeIcon,
  Settings,
} from "lucide-react";

interface TabBarProps {
  isDarkMode: boolean;
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

export function TabBar({
  isDarkMode,
  activeTab,
  handleTabChange,
}: TabBarProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-300 safe-area-inset-bottom ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-700 backdrop-blur-xl"
          : "bg-white/95 border-gray-200 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {/* Home Tab */}
          <button
            onClick={() => handleTabChange("home")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] relative ${
              activeTab === "home"
                ? `transform scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg"
                      : "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                  }`
                : `${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                  } transition-all duration-300`
            }`}
          >
            <HomeIcon
              className={`w-6 h-6 mb-1 transition-all duration-300 ${
                activeTab === "home" ? "scale-110" : ""
              }`}
            />
            <span className={`text-xs font-medium ${activeTab === "home" ? "font-semibold" : ""}`}>Home</span>
            {activeTab === "home" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Tasks Tab */}
          <button
            onClick={() => handleTabChange("tasks")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] relative ${
              activeTab === "tasks"
                ? `transform scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg"
                      : "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                  }`
                : `${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                  } transition-all duration-300`
            }`}
          >
            <CheckSquare
              className={`w-6 h-6 mb-1 transition-all duration-300 ${
                activeTab === "tasks" ? "scale-110" : ""
              }`}
            />
            <span className={`text-xs font-medium ${activeTab === "tasks" ? "font-semibold" : ""}`}>Tasks</span>
            {activeTab === "tasks" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Gallery Tab */}
          <button
            onClick={() => handleTabChange("gallery")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] relative ${
              activeTab === "gallery"
                ? `transform scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg"
                      : "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                  }`
                : `${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                  } transition-all duration-300`
            }`}
          >
            <Grid3X3
              className={`w-6 h-6 mb-1 transition-all duration-300 ${
                activeTab === "gallery" ? "scale-110" : ""
              }`}
            />
            <span className={`text-xs font-medium ${activeTab === "gallery" ? "font-semibold" : ""}`}>Gallery</span>
            {activeTab === "gallery" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Admin Tab */}
          <button
            onClick={() => handleTabChange("admin")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] relative ${
              activeTab === "admin"
                ? `transform scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg"
                      : "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                  }`
                : `${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                  } transition-all duration-300`
            }`}
          >
            <Settings
              className={`w-6 h-6 mb-1 transition-all duration-300 ${
                activeTab === "admin" ? "scale-110" : ""
              }`}
            />
            <span className={`text-xs font-medium ${activeTab === "admin" ? "font-semibold" : ""}`}>Admin</span>
            {activeTab === "admin" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
          {/* Rewards Tab */}
          <button
            onClick={() => handleTabChange("rewards")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] relative ${
              activeTab === "rewards"
                ? `transform scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg"
                      : "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                  }`
                : `${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                  } transition-all duration-300`
            }`}
          >
            <Award
              className={`w-6 h-6 mb-1 transition-all duration-300 ${
                activeTab === "rewards" ? "scale-110" : ""
              }`}
            />
            <span className={`text-xs font-medium ${activeTab === "rewards" ? "font-semibold" : ""}`}>Rewards</span>
            {activeTab === "rewards" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
