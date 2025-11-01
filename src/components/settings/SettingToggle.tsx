interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingToggle = ({
  label,
  description,
  checked,
  onChange,
}: SettingToggleProps) => {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="font-semibold text-gray-800">{label}</div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {/* toggle */}
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingToggle;
