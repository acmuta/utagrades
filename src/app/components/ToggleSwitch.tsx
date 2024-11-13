import React from "react";

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      onClick={() => onToggle(!isEnabled)}
      className={`lg:mt-1 relative inline-flex items-center ${
        isEnabled ? "bg-green-500" : "bg-gray-300"
      } rounded-full w-11 h-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
    >
      <span className="sr-only">{label || "Toggle"}</span>
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
          isEnabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
  
