import { Note } from '@/lib/api';
import { format } from 'date-fns';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  isLoading?: boolean;
}

export default function NotesList({ notes, selectedNoteId, onNoteSelect, isLoading }: NotesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No notes found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onNoteSelect(note.id)}
          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
            selectedNoteId === note.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {note.title || 'Untitled'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {note.content.replace(/[#*`]/g, '')}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {format(new Date(note.updated_at), 'MMM d, yyyy')}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
} 