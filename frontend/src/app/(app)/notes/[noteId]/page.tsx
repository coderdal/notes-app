'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import NoteEditor from '@/components/notes/NoteEditor';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NoteDetailPage() {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
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
    <NoteEditor
      initialNote={note}
      onSave={handleSave}
      isLoading={updateNoteMutation.isPending}
    />
  );
} 