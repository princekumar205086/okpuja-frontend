"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, Paper, Typography } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Code,
  FormatQuote,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = 300,
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        executeCommand('insertImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const toolbarButtons: Array<{
    command?: string;
    value?: string;
    icon?: React.ComponentType<any>;
    tooltip?: string;
    custom?: string;
    divider?: boolean;
  }> = [
    { command: 'bold', icon: FormatBold, tooltip: 'Bold' },
    { command: 'italic', icon: FormatItalic, tooltip: 'Italic' },
    { command: 'underline', icon: FormatUnderlined, tooltip: 'Underline' },
    { divider: true },
    { command: 'justifyLeft', icon: FormatAlignLeft, tooltip: 'Align Left' },
    { command: 'justifyCenter', icon: FormatAlignCenter, tooltip: 'Align Center' },
    { command: 'justifyRight', icon: FormatAlignRight, tooltip: 'Align Right' },
    { divider: true },
    { command: 'insertUnorderedList', icon: FormatListBulleted, tooltip: 'Bullet List' },
    { command: 'insertOrderedList', icon: FormatListNumbered, tooltip: 'Numbered List' },
    { divider: true },
    { command: 'formatBlock', value: 'blockquote', icon: FormatQuote, tooltip: 'Quote' },
    { command: 'formatBlock', value: 'pre', icon: Code, tooltip: 'Code Block' },
    { divider: true },
    { custom: 'link', icon: Link, tooltip: 'Insert Link' },
    { custom: 'image', icon: Image, tooltip: 'Insert Image' },
    { divider: true },
    { command: 'undo', icon: Undo, tooltip: 'Undo' },
    { command: 'redo', icon: Redo, tooltip: 'Redo' },
  ];

  return (
    <Paper elevation={1} className="border">
      {/* Toolbar */}
      <Box className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((button, index) => {
          if (button.divider) {
            return (
              <Box
                key={index}
                className="w-px h-6 bg-gray-300 mx-1"
              />
            );
          }

          const IconComponent = button.icon;

          return (
            <Tooltip key={index} title={button.tooltip || ''}>
              <IconButton
                size="small"
                disabled={disabled}
                onClick={() => {
                  if (button.custom === 'link') {
                    insertLink();
                  } else if (button.custom === 'image') {
                    fileInputRef.current?.click();
                  } else {
                    executeCommand(button.command!, button.value);
                  }
                }}
                className="hover:bg-orange-100"
              >
                {IconComponent && <IconComponent fontSize="small" />}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning={true}
        onInput={updateContent}
        onBlur={updateContent}
        className={`p-4 outline-none ${disabled ? 'bg-gray-100' : 'bg-white'}`}
        sx={{
          minHeight: `${minHeight}px`,
          '&:empty::before': {
            content: `"${placeholder}"`,
            color: 'text.secondary',
            fontStyle: 'italic',
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
          },
          '& blockquote': {
            borderLeft: '4px solid #ff6b35',
            paddingLeft: 2,
            margin: '16px 0',
            fontStyle: 'italic',
            backgroundColor: '#fff5f2',
            padding: '8px 16px',
            borderRadius: '0 4px 4px 0',
          },
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontFamily: 'monospace',
          },
          '& h1': {
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '16px 0 8px 0',
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '16px 0 8px 0',
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            margin: '16px 0 8px 0',
          },
          '& p': {
            margin: '8px 0',
          },
          '& ul, & ol': {
            paddingLeft: 3,
            margin: '8px 0',
          },
          '& a': {
            color: '#ff6b35',
            textDecoration: 'underline',
          },
        }}
      />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </Paper>
  );
};

export default RichTextEditor;
