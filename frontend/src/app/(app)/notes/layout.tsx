'use client';

import { notesApi } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import NotesPageLayout from '@/components/notes/NotesPageLayout';
import { usePathname } from 'next/navigation';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Show notes list for /notes, /notes/[id], and /notes/new but not for other special routes
  const isMainNotesRoute = pathname === '/notes' || pathname === '/notes/new' || (
    pathname.startsWith('/notes/') && 
    !pathname.startsWith('/notes/shared') && 
    !pathname.startsWith('/notes/archived') && 
    !pathname.startsWith('/notes/trash')
  );

  return (
    <AppLayout>
      {isMainNotesRoute ? (
        <NotesPageLayout
          queryKey="notes"
          queryFn={notesApi.list}
          basePath="/notes"
        >
          {children}
        </NotesPageLayout>
      ) : (
        children
      )}
    </AppLayout>
  );
} 