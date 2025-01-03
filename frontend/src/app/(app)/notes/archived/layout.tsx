'use client';

import { notesApi } from '@/lib/api';
import NotesPageLayout from '@/components/notes/NotesPageLayout';

export default function ArchivedNotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotesPageLayout
      queryKey="archived-notes"
      queryFn={() => notesApi.list({ status: 'archived' })}
      basePath="/notes/archived"
    >
      {children}
    </NotesPageLayout>
  );
} 