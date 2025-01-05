'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  PlusIcon, 
  HomeIcon, 
  ArchiveBoxIcon, 
  TrashIcon, 
  ShareIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const isCurrentPath = (path: string) => {
    return pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return `flex items-center ${isCollapsed ? 'justify-center' : 'px-2'} py-2 text-sm font-medium rounded-md group ${
      isCurrentPath(path)
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 pt-5 pb-4 flex flex-col relative transition-all duration-300`}>
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* App Logo/Name */}
        <div className={`${isCollapsed ? 'justify-center' : 'px-4'} flex items-center`}>
          <Link href="/notes" className="hover:text-stone-950 transition-colors">
            <h1 className={`text-xl font-semibold text-gray-900 ${isCollapsed ? 'hidden' : 'block'}`}>Notes</h1>
            {isCollapsed && <DocumentTextIcon className="h-6 w-6 text-gray-900 hover:text-stone-950" />}
          </Link>
        </div>

        {/* New Note Button */}
        <div className={`${isCollapsed ? 'px-2' : 'px-4'} mt-5`}>
          <Link
            href="/notes/new"
            className={`flex items-center justify-center ${isCollapsed ? 'p-2' : 'px-4 py-2'} text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800`}
          >
            {isCollapsed ? (
              <PlusIcon className="h-5 w-5" />
            ) : (
              'New note'
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1">
          <div className={`${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
            <Link
              href="/notes"
              className={getLinkClassName('/notes')}
            >
              <HomeIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!isCollapsed && 'All notes'}
            </Link>
            <Link
              href="/notes/shared"
              className={getLinkClassName('/notes/shared')}
            >
              <ShareIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!isCollapsed && 'Shared'}
            </Link>
            <Link
              href="/notes/archived"
              className={getLinkClassName('/notes/archived')}
            >
              <ArchiveBoxIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!isCollapsed && 'Archived'}
            </Link>
            <Link
              href="/notes/trash"
              className={getLinkClassName('/notes/trash')}
            >
              <TrashIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!isCollapsed && 'Trash'}
            </Link>
          </div>
        </nav>

        {/* Profile and Logout */}
        <div className={`${isCollapsed ? 'px-2' : 'px-3'} mt-auto space-y-1`}>
          <Link
            href="/profile"
            className={getLinkClassName('/profile')}
          >
            <UserIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
            {!isCollapsed && 'Profile'}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : ''} w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group`}
          >
            <ArrowLeftOnRectangleIcon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 