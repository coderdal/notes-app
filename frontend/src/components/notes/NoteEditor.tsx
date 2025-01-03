'use client';

import { useState, useEffect, useCallback } from 'react';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { Note } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import {
  imagePlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  ListsToggle,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  InsertTable,
  InsertThematicBreak,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  CodeToggle,
  CodeMirrorEditor,
  linkPlugin,
  linkDialogPlugin
} from '@mdxeditor/editor';

interface Action {
  label: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  className?: string;
}

interface NoteEditorProps {
  initialNote?: Note;
  onSave: (data: { title: string; content: string }) => Promise<void>;
  isLoading?: boolean;
  actions?: Action[];
}

export default function NoteEditor({ initialNote, onSave, isLoading, actions }: NoteEditorProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveNote = useCallback(
    async (newTitle: string, newContent: string) => {
      try {
        setIsSaving(true);
        await onSave({ title: newTitle, content: newContent });
        setLastSavedAt(new Date());
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave]
  );

  const debouncedSave = useDebounce(saveNote, 1000);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setLastSavedAt(new Date(initialNote.updated_at));
    }
  }, [initialNote]);

  // Handle title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave(title, newContent);
  };

  // Format the last saved time
  const getLastSavedText = () => {
    if (isSaving) return 'Saving...';
    if (!lastSavedAt) return 'Not saved yet';
    
    const now = new Date();
    const diff = now.getTime() - lastSavedAt.getTime();
    
    if (diff < 1000) return 'Saved just now';
    if (diff < 60000) return 'Saved a few seconds ago';
    if (diff < 3600000) return `Saved ${Math.floor(diff / 60000)} minutes ago`;
    
    return 'Saved';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {actions?.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ${action.className}`}
            >
              <action.icon className="h-5 w-5" aria-hidden="true" />
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {getLastSavedText()}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto max-w-3xl mx-auto w-full px-4">
        <input
          type="text"
          name="title"
          id="title"
          required
          placeholder="Untitled"
          className="block w-full border-0 py-5 text-3xl font-bold text-gray-900 placeholder:text-gray-300 focus:ring-0"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          disabled={isLoading}
        />
        <MDXEditor
          markdown={content}
          onChange={handleContentChange}
          placeholder="Type '/' for commands"
          contentEditableClassName="min-h-full prose prose-slate max-w-none !bg-white focus:outline-none"
          plugins={[
            imagePlugin({
              disableImageResize: true
            }),
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
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
              },
              autoLoadLanguageSupport: true
            }),
            codeBlockPlugin({
              defaultCodeBlockLanguage: 'javascript',
              codeBlockEditorDescriptors: [
                {
                  match: () => true,
                  priority: 0,
                  Editor: CodeMirrorEditor
                }
              ]
            }),
            tablePlugin(),
            directivesPlugin({
              directiveDescriptors: [AdmonitionDirectiveDescriptor],
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <BlockTypeSelect />
                  <CreateLink />
                  <InsertImage />
                  <ListsToggle />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                  <ConditionalContents
                    options={[
                      {
                        when: (editor) => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />
                      },
                    ]}
                  />
                </>
              ),
              toolbarClassName: "!rounded-none border-b border-gray-100 !bg-white"
            }),
          ]}
        />
      </div>
    </div>
  );
} 