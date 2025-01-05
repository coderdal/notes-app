'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoteEditor from '@/components/notes/NoteEditor';
import { notesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function NewNotePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [noteId, setNoteId] = useState<string | null>(null);

  const handleSave = async (data: { title: string; content: string }) => {
    try {
      // Only create note when both title and content are provided
      if (!noteId && data.title.trim() && data.content.trim()) {
        // First save - create the note
        const note = await notesApi.create(data);
        setNoteId(note.id);
        
        // Invalidate notes query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['notes'] });
        
        // Navigate to the note page
        router.push(`/notes/${note.id}`);
      } else if (noteId) {
        // Subsequent saves - update the note
        await notesApi.update(noteId, data);
      }
    } catch (error) {
      toast.error('Failed to save note');
      throw error;
    }
  };

  return (
    <div className="h-full">
      <NoteEditor onSave={handleSave} />
    </div>
  );
} 