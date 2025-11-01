import Libary from "../../assets/profile-icons/libarylist.svg?react";
import Rides from "../../assets/profile-icons/ridegolf.svg?react";
import SettingsIcon from "../../assets/profile-icons/settings.svg?react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "library", label: "Library", icon: Libary },
  { id: "rides", label: "Rides", icon: Rides },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  return (
    <div className="flex justify-around bg-white max-w-md mx-auto p-2 -mt-4 rounded-full border border-pri/70 ">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex gap-2 items-center justify-center w-full rounded-full py-2 transition ${
              isActive
                ? "bg-pri text-white text-sm font-bold"
                : "text-black/60 text-sm"
            }`}
          >
            <Icon />
            <span className=" align-middle">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
