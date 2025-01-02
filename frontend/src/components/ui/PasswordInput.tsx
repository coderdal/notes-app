'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  autoComplete = 'current-password',
  required = true,
  className = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        )}
      </button>
    </div>
  );
} 