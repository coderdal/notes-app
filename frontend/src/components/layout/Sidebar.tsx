'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DocumentTextIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Active Notes', href: '/notes', icon: DocumentTextIcon },
  { name: 'Archived', href: '/notes/archived', icon: ArchiveBoxIcon },
  { name: 'Trash', href: '/notes/trash', icon: TrashIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/notes" className="text-lg font-semibold text-indigo-600">
              My Notes
            </Link>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 