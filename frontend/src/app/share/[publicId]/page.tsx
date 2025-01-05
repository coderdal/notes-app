'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notesApi, SharedNote } from '@/lib/api';
import { MDXEditor } from '@mdxeditor/editor';
import { auth } from '@/lib/auth';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  AdmonitionDirectiveDescriptor,
  directivesPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface ApiError {
  response?: {
    status: number;
  };
}

const SharedNotePage: React.FC = () => {
  const { publicId } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<SharedNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = auth.getAccessToken() !== null;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await notesApi.getSharedNote(publicId as string);
        setNote(data);
      } catch (err: unknown) {
        const error = err as ApiError;
        if ('response' in error && error.response?.status === 404) {
          setError('This note does not exist or you don\'t have access to it.');
        } else {
          setError('An error occurred while loading the note.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [publicId]);

  const handleNavigate = () => {
    if (isLoggedIn) {
      router.push('/notes');
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleNavigate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoggedIn ? 'Go to App' : 'Sign in'}
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-lg w-full mx-auto">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleNavigate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoggedIn ? 'Go to App' : 'Sign in'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            Shared by {note.owner_username} • 
            {note.share_type === 'private' ? ' Private share' : ' Public share'}
            {note.expires_at && ` • Expires ${new Date(note.expires_at).toLocaleDateString()}`}
          </p>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <MDXEditor
            markdown={note.content}
            readOnly
            contentEditableClassName="prose prose-slate max-w-none !bg-white focus:outline-none"
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),
              codeBlockPlugin({
                defaultCodeBlockLanguage: 'javascript'
              }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: 'JavaScript',
                  ts: 'TypeScript',
                  python: 'Python',
                  jsx: 'React JSX',
                  tsx: 'React TSX',
                  css: 'CSS',
                  html: 'HTML',
                  json: 'JSON',
                  markdown: 'Markdown',
                  sql: 'SQL',
                  bash: 'Bash'
                }
              }),
              directivesPlugin({
                directiveDescriptors: [AdmonitionDirectiveDescriptor]
              })
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedNotePage; 