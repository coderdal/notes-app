import { format } from 'date-fns';

interface NotesListProps<T extends { id: string; title: string; updated_at: string }> {
  notes: T[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  isLoading?: boolean;
}

export default function NotesList<T extends { id: string; title: string; updated_at: string }>({ 
  notes, 
  selectedNoteId, 
  onNoteSelect, 
  isLoading 
}: NotesListProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-950" />
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No notes found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onNoteSelect(note.id)}
          className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
            selectedNoteId === note.id ? 'bg-gray-50' : ''
          }`}
        >
          <h3 className="text-sm font-medium text-gray-900 truncate">{note.title || 'Untitled'}</h3>
          <p className="mt-1 text-xs text-gray-500">
            Last updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
          </p>
        </button>
      ))}
    </div>
  );
} 