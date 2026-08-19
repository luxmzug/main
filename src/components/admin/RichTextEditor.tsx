'use client';

import type React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkMark from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

const ToolbarButton = (props: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className={`rounded px-2 py-1 text-xs font-semibold ${
        props.active ? 'bg-gold text-navy' : 'bg-navy/5 text-navy hover:bg-navy/10'
      }`}
      onClick={props.onClick}
      type="button"
    >
      {props.children}
    </button>
  );
};

export const RichTextEditor = (props: {
  initialHtml: string;
  onChange: (html: string) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkMark.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Beitragstext schreiben…',
      }),
    ],
    content: props.initialHtml,
    onUpdate: (update) => {
      props.onChange(update.editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        <ToolbarButton
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Fett
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Kursiv
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('heading', { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('heading', { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Liste
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          Nummeriert
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          Zitat
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const href = window.prompt('Link-URL');
            if (!href) {
              editor?.chain().focus().unsetLink().run();
              return;
            }
            editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
          }}
        >
          Link
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
