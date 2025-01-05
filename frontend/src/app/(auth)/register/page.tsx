'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PasswordInput from '@/components/ui/PasswordInput';
import { EnvelopeIcon, UserIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { label: 'At least 8 characters long', regex: /.{8,}/, met: false },
    { label: 'Contains an uppercase letter', regex: /[A-Z]/, met: false },
    { label: 'Contains a lowercase letter', regex: /[a-z]/, met: false },
    { label: 'Contains a number', regex: /[0-9]/, met: false },
    { label: 'Contains a special character', regex: /[!@#$%^&*(),?":{}|<>]/, met: false },
  ]);
  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/notes');
    }
  }, [user]);

  useEffect(() => {
    setPasswordRequirements(prev =>
      prev.map(req => ({
        ...req,
        met: req.regex.test(password)
      }))
    );
  }, [password]);

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-stone-950">Notes App</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-stone-950 hover:text-indigo-500">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
              </div>
              <div className="mt-4 space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {req.met ? (
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isPasswordValid || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-950 hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By creating an account, you agree to our
                </span>
              </div>
            </div>
            <div className="mt-2 text-center text-sm">
              <Link href="/legal/terms" className="text-stone-950 hover:text-indigo-500 font-medium">
                Terms of Service
              </Link>
              <span className="text-gray-500">, </span>
              <Link href="/legal/privacy" className="text-stone-950 hover:text-indigo-500 font-medium">
                Privacy Policy
              </Link>
              <span className="text-gray-500">, </span>
              <Link href="/legal/cookies" className="text-stone-950 hover:text-indigo-500 font-medium">
                Cookie Policy
              </Link>
              <span className="text-gray-500">, and </span>
              <Link href="/legal/acceptable-use" className="text-stone-950 hover:text-indigo-500 font-medium">
                Acceptable Use Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 