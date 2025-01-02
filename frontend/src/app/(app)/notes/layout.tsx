'use client';

import { useQuery } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import NotesList from '@/components/notes/NotesList';
import { useRouter, useParams } from 'next/navigation';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.noteId as string;

  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.list(),
  });

  const handleNoteSelect = (id: string) => {
    router.push(`/notes/${id}`);
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Notes List Sidebar */}
        <div className="w-80 border-r border-gray-200 h-full overflow-y-auto">
          <NotesList
            notes={notesData?.notes || []}
            selectedNoteId={noteId}
            onNoteSelect={handleNoteSelect}
            isLoading={isLoadingNotes}
          />
        </div>

        {/* Note Content Area */}
        <div className="flex-1 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </AppLayout>
  );
} 