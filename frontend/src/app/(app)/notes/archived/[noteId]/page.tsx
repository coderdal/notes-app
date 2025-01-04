'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import NoteEditor from '@/components/notes/NoteEditor';
import NoteActions from '@/components/notes/NoteActions';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ArchivedNoteDetailPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => notesApi.get(noteId),
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      return notesApi.update(noteId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      queryClient.invalidateQueries({ queryKey: ['archived-notes'] });
    },
    onError: () => {
      toast.error('Failed to save note');
    },
  });

  const handleSave = async (data: { title: string; content: string }) => {
    await updateNoteMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-950" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-gray-200">
        <NoteActions note={note} view="archived" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NoteEditor
          initialNote={note}
          onSave={handleSave}
          isLoading={updateNoteMutation.isPending}
        />
      </div>
    </div>
  );
} 