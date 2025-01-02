'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import NotesList from '@/components/notes/NotesList';
import NoteEditor from '@/components/notes/NoteEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NotesPage() {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome to Notes</h2>
        <p>Select a note to view or edit, or create a new one</p>
      </div>
    </div>
  );
} 