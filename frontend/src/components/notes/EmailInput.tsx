import { useState, useRef, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface EmailInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
}

export default function EmailInput({ value, onChange, placeholder = 'Add more people...' }: EmailInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && isValidEmail(trimmedEmail) && !value.includes(trimmedEmail)) {
      onChange([...value, trimmedEmail]);
    }
    setInputValue('');
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value[value.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText.split(/[,\s]+/);
    const validEmails = emails
      .map(email => email.trim())
      .filter(email => email && isValidEmail(email) && !value.includes(email));
    
    if (validEmails.length > 0) {
      onChange([...value, ...validEmails]);
    }
  };

  return (
    <div 
      className="min-h-[80px] p-2 rounded-lg border-0 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap gap-2">
        {value.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700"
          >
            <span>{email}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(email);
              }}
              className="text-indigo-600 hover:text-indigo-800 rounded-full p-0.5 hover:bg-indigo-100 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (inputValue) {
              addEmail(inputValue);
            }
          }}
          className="flex-1 min-w-[200px] border-0 bg-transparent p-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  );
} 