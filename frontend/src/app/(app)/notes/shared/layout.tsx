'use client';

import { notesApi, SharedNote } from '@/lib/api';
import NotesPageLayout from '@/components/notes/NotesPageLayout';
import { useRouter } from 'next/navigation';

export default function SharedNotesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleNoteSelect = (note: SharedNote) => {
    router.push(`/share/${note.public_id}`);
  };

  return (
    <NotesPageLayout
      queryKey="shared-notes"
      queryFn={async () => {
        const notes = await notesApi.getSharedWithMe();
        return { notes };
      }}
      basePath="/share"
      onNoteSelect={handleNoteSelect}
    >
      {children}
    </NotesPageLayout>
  );
} 