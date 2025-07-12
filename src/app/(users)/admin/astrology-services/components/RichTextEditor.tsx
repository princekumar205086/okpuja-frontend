'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  FormatQuote as BlockquoteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  error,
  disabled = false,
  maxLength = 2000,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  const MenuButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, disabled, children, title }) => (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size="small"
        className={`${
          isActive
            ? 'bg-purple-100 text-purple-600'
            : 'text-gray-600 hover:bg-gray-100'
        } transition-colors duration-200`}
      >
        {children}
      </IconButton>
    </Tooltip>
  );

  const characterCount = editor.storage.characterCount.characters();
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <Box>
      <Paper
        variant="outlined"
        className={`${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50' : 'bg-white'} overflow-hidden`}
      >
        {/* Toolbar */}
        {!disabled && (
          <Toolbar className="bg-gray-50 border-b border-gray-200 min-h-0 px-2 py-1">
            <Box className="flex items-center gap-1">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <BoldIcon fontSize="small" />
              </MenuButton>

              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <ItalicIcon fontSize="small" />
              </MenuButton>

              <Divider orientation="vertical" flexItem className="mx-1" />

              <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <BulletListIcon fontSize="small" />
              </MenuButton>

              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <NumberListIcon fontSize="small" />
              </MenuButton>

              <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
              >
                <BlockquoteIcon fontSize="small" />
              </MenuButton>

              <Divider orientation="vertical" flexItem className="mx-1" />

              <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
              >
                <UndoIcon fontSize="small" />
              </MenuButton>

              <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
              >
                <RedoIcon fontSize="small" />
              </MenuButton>
            </Box>
          </Toolbar>
        )}

        {/* Editor Content */}
        <Box className="relative">
          <EditorContent
            editor={editor}
            className={`prose prose-sm max-w-none p-4 min-h-[120px] focus-within:outline-none ${
              disabled ? 'prose-gray' : ''
            }`}
            // Remove the invalid style prop and use a class instead
          />
        </Box>

        {/* Footer */}
        {!disabled && (
          <Box className="flex justify-between items-center px-3 py-2 bg-gray-50 border-t border-gray-200">
            <Box>
              {error && (
                <Typography variant="caption" className="text-red-600">
                  {error}
                </Typography>
              )}
            </Box>
            <Typography
              variant="caption"
              className={`${
                isOverLimit
                  ? 'text-red-600'
                  : isNearLimit
                  ? 'text-orange-500'
                  : 'text-gray-500'
              }`}
            >
              {characterCount} / {maxLength}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RichTextEditor;
