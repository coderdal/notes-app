'use client';

import { notesApi } from '@/lib/api';
import NotesPageLayout from '@/components/notes/NotesPageLayout';

export default function TrashNotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotesPageLayout
      queryKey="trash-notes"
      queryFn={() => notesApi.list({ status: 'deleted' })}
      basePath="/notes/trash"
    >
      {children}
    </NotesPageLayout>
  );
} 