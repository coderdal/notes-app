import { useQuery } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import NotesList from '@/components/notes/NotesList';
import { useRouter, useParams } from 'next/navigation';

interface NotesPageLayoutProps {
  children: React.ReactNode;
  queryKey: string;
  queryFn: () => Promise<{ notes: any[] }>;
  basePath: string;
  onNoteSelect?: (note: any) => void;
}

export default function NotesPageLayout({ 
  children, 
  queryKey, 
  queryFn, 
  basePath,
  onNoteSelect 
}: NotesPageLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.noteId as string;

  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: [queryKey],
    queryFn: queryFn,
  });

  const handleNoteSelect = (id: string) => {
    const note = notesData?.notes.find(n => n.id === id);
    if (onNoteSelect && note) {
      onNoteSelect(note);
    } else {
      router.push(`${basePath}/${id}`);
    }
  };

  return (
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
  );
} 