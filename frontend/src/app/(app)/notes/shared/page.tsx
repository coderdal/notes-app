'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notesApi, SharedNote } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AppLayout from '@/components/layout/AppLayout';

export default function SharedNotesPage() {
  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const sharedNotes = await notesApi.getSharedWithMe();
        setNotes(sharedNotes);
      } catch (err) {
        setError('Failed to load shared notes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNotes();
  }, []);

  return (
    <AppLayout>
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
            <p className="text-xl">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
            <p className="text-xl">No notes have been shared with you yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Link 
                key={note.id} 
                href={`/share/${note.public_id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold truncate flex-1">{note.title}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Shared by: {note.owner_username}</span>
                  <span>{note.share_type === 'public' ? 'Public' : 'Private'}</span>
                </div>
                {note.expires_at && (
                  <div className="mt-2 text-sm text-orange-600">
                    Expires: {new Date(note.expires_at).toLocaleDateString()}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 