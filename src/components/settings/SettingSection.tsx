import React from "react";

interface SettingSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const SettingSection = ({ title, subtitle, children }: SettingSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
};

export default SettingSection;
