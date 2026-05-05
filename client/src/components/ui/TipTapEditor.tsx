import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onChange, placeholder = 'Escribe algo...', className = '' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-blue-500/30 text-blue-200 shadow-sm'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-white/5">
        <button type="button" className={btnClass(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" className={btnClass(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" className={btnClass(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button type="button" className={btnClass(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 size={16} />
        </button>
        <button type="button" className={btnClass(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 size={16} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button type="button" className={btnClass(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" className={btnClass(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
          <ListOrdered size={16} />
        </button>
        <button type="button" className={btnClass(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          <Quote size={16} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={16} />
        </button>
        <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={16} />
        </button>
      </div>
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} className="prose prose-invert max-w-none focus:outline-none" />
      </div>
    </div>
  );
};

export default TipTapEditor;
