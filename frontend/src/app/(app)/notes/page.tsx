'use client';

import { useQuery } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NotesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.list(),
  });

  const notes = data?.notes;

  return (
    <AppLayout>
      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No notes found</p>
            <Link href="/notes/new" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
              Create your first note
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notes?.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <h2 className="text-lg font-medium text-gray-900">
                  {note.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {note.content.replace(/[#*`]/g, '')}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Last updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 