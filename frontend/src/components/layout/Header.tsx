'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const { user, logout } = useAuth();

  const getUserInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-semibold">Notes App</h1>
            </div>
          </div>
          <div className="flex items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {getUserInitial()}
                    </span>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    Signed in as <span className="font-medium">{user?.username}</span>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => logout()}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block w-full px-4 py-2 text-sm text-gray-700 text-left'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
} 