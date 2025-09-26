
import React from 'react';

interface ToggleProps {
  isChecked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ isChecked, onToggle, disabled = false }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 ${
        isChecked ? 'bg-primary-600' : 'bg-secondary-200 dark:bg-secondary-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      role="switch"
      aria-checked={isChecked}
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default Toggle;
