'use client';

import { useQuery } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TrashPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['notes', 'deleted'],
    queryFn: () => notesApi.list({ status: 'deleted' }),
  });

  const notes = data?.notes || [];

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Trash</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your deleted notes.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <LoadingSpinner />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center text-gray-500">
                  <p>No deleted notes found</p>
                  <Link href="/notes" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
                    View all notes
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      className="block p-6 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <h2 className="text-lg font-medium text-gray-900 truncate">
                        {note.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {note.content.replace(/[#*`]/g, '')}
                      </p>
                      <div className="mt-4 text-xs text-gray-400">
                        Last updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 