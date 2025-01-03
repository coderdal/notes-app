import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi, Note } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  ShareIcon,
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ShareModal from './ShareModal';
import toast from 'react-hot-toast';

interface NoteActionsProps {
  note: Note;
  view: 'default' | 'archived' | 'trash';
}

export default function NoteActions({ note, view }: NoteActionsProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (status: Note['status']) => notesApi.updateStatus(note.id, status),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['archived-notes'] });
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] });
      
      // Show success message and navigate to list view
      if (view === 'default' && status === 'archived') {
        toast.success('Note archived');
        router.push('/notes');
      } else if (view === 'archived' && status === 'active') {
        toast.success('Note unarchived');
        router.push('/notes/archived');
      } else if (view === 'default' && status === 'deleted') {
        toast.success('Note moved to trash');
        router.push('/notes');
      } else if (view === 'trash' && status === 'active') {
        toast.success('Note recovered');
        router.push('/notes/trash');
      } else if (status === 'deleted') {
        // When deleting from archived view
        toast.success('Note moved to trash');
        router.push('/notes/archived');
      }
    },
    onError: () => {
      toast.error('Failed to update note status');
    },
  });

  const handleArchive = () => updateStatusMutation.mutate('archived');
  const handleUnarchive = () => updateStatusMutation.mutate('active');
  const handleDelete = () => updateStatusMutation.mutate('deleted');
  const handleRecover = () => updateStatusMutation.mutate('active');

  const deletePermanentlyMutation = useMutation({
    mutationFn: () => notesApi.delete(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] });
      router.push('/notes/trash');
      toast.success('Note permanently deleted');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  return (
    <div className="flex items-center gap-2">
      {/* Share button - only visible in default view */}
      {view === 'default' && (
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
        >
          <ShareIcon className="h-5 w-5" />
          Share
        </button>
      )}

      {/* View-specific actions */}
      {view === 'default' && (
        <>
          <button
            onClick={handleArchive}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
          >
            <ArchiveBoxIcon className="h-5 w-5" />
            Archive
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 ring-1 ring-inset ring-red-300"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </>
      )}

      {view === 'archived' && (
        <>
          <button
            onClick={handleUnarchive}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
          >
            <ArchiveBoxXMarkIcon className="h-5 w-5" />
            Unarchive
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 ring-1 ring-inset ring-red-300"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </>
      )}

      {view === 'trash' && (
        <>
          <button
            onClick={handleRecover}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
            Recover
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
                deletePermanentlyMutation.mutate();
              }
            }}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 ring-1 ring-inset ring-red-300"
          >
            <TrashIcon className="h-5 w-5" />
            Delete Permanently
          </button>
        </>
      )}

      {view === 'default' && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          noteId={note.id}
        />
      )}
    </div>
  );
} 