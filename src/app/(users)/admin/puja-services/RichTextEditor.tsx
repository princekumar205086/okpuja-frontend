import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  ButtonGroup,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Undo,
  Redo,
  Code,
} from '@mui/icons-material';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Enter description...',
  error = false,
  helperText,
  maxLength = 1000,
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    icon: React.ReactNode;
    tooltip: string;
    disabled?: boolean;
  }> = ({ onClick, isActive, icon, tooltip, disabled }) => (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          backgroundColor: isActive ? 'primary.50' : 'transparent',
          '&:hover': {
            backgroundColor: isActive ? 'primary.100' : 'action.hover',
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  const characterCount = editor.storage.characterCount.characters();
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <Paper
      variant="outlined"
      sx={{
        border: error ? '2px solid' : '1px solid',
        borderColor: error ? 'error.main' : 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: error ? 'error.main' : 'primary.main',
          boxShadow: error 
            ? '0 0 0 2px rgba(211, 47, 47, 0.2)' 
            : '0 0 0 2px rgba(25, 118, 210, 0.2)',
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          p: 1,
          backgroundColor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          flexWrap: 'wrap',
        }}
      >
        {/* Text Formatting */}
        <ButtonGroup size="small" variant="outlined">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<FormatBold fontSize="small" />}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<FormatItalic fontSize="small" />}
            tooltip="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            icon={<Code fontSize="small" />}
            tooltip="Code"
          />
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Lists */}
        <ButtonGroup size="small" variant="outlined">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<FormatListBulleted fontSize="small" />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<FormatListNumbered fontSize="small" />}
            tooltip="Numbered List"
          />
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Block Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<FormatQuote fontSize="small" />}
          tooltip="Quote"
        />

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* History */}
        <ButtonGroup size="small" variant="outlined">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={<Undo fontSize="small" />}
            tooltip="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={<Redo fontSize="small" />}
            tooltip="Redo"
          />
        </ButtonGroup>

        {/* Character Count */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary',
              fontWeight: isNearLimit ? 'medium' : 'normal',
            }}
          >
            {characterCount}/{maxLength}
          </Typography>
        </Box>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          minHeight: 120,
          maxHeight: 300,
          overflow: 'auto',
          p: 2,
          '& .ProseMirror': {
            outline: 'none',
            '& p': {
              margin: '0.5em 0',
              '&:first-of-type': {
                marginTop: 0,
              },
              '&:last-of-type': {
                marginBottom: 0,
              },
            },
            '& ul, & ol': {
              paddingLeft: '1.5em',
              margin: '0.5em 0',
            },
            '& blockquote': {
              paddingLeft: '1em',
              borderLeft: '3px solid',
              borderColor: 'divider',
              margin: '1em 0',
              fontStyle: 'italic',
            },
            '& code': {
              backgroundColor: 'grey.100',
              borderRadius: '0.25em',
              padding: '0.125em 0.25em',
              fontSize: '0.875em',
              fontFamily: 'monospace',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              margin: '1em 0 0.5em 0',
              '&:first-of-type': {
                marginTop: 0,
              },
            },
            '& h1': { fontSize: '1.5em' },
            '& h2': { fontSize: '1.25em' },
            '& h3': { fontSize: '1.125em' },
          },
          '& .ProseMirror p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            float: 'left',
            color: 'text.secondary',
            pointerEvents: 'none',
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Helper Text */}
      {helperText && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: error ? 'error.main' : 'text.secondary',
            }}
          >
            {helperText}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RichTextEditor;
