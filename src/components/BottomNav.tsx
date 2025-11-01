import React from "react";

import { NavLink } from "react-router-dom";

import HomeIcon from "../assets/home-icons/home.svg?react";
import RewardIcon from "../assets/home-icons/reward.svg?react";
import UserIcon from "../assets/home-icons/user.svg?react";
import SupportIcon from "../assets/home-icons/support.svg?react";

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { name: "Home", icon: HomeIcon, path: "/dashboard" },
  { name: "Rewards", icon: RewardIcon, path: "/rewards" },
  { name: "Profile", icon: UserIcon, path: "/profile" },
  { name: "Support", icon: SupportIcon, path: "/support" },
];

export default function BottomNav() {
  return (
    // Fixed container for bottom navigation
    <nav className="max-w-md mx-auto fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white px-2 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            // Dynamic class based on active route
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? "text-green-600" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center space-y-1">
                {/* Icon wrapper with green background when active */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-pri/20 text-pri" : "bg-transparent text-grey"
                  }`}
                >
                  {/* Inline SVG icon that reacts to color state */}
                  <Icon className={`w-5 h-5 transition-colors duration-300 `} />
                </div>

                {/* Label text */}
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
