'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CopyableTextProps {
  text: string;
  label?: string;
  className?: string;
  showLabel?: boolean;
}

const CopyableText: React.FC<CopyableTextProps> = ({ 
  text, 
  label, 
  className = '',
  showLabel = true 
}) => {
  const [copied, setCopied] = React.useState(false);
  const isInline = className.includes('inline');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label || 'Text'} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  if (isInline) {
    return (
      <span className={`inline-flex items-center gap-1 ${className.replace('inline', '')}`}>
        <span className="bg-gray-100 rounded px-2 py-0.5 text-sm font-mono text-gray-800 select-all">
          {text}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex p-0.5 hover:bg-gray-200 rounded transition-colors duration-200"
          title={`Copy ${label || 'text'}`}
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && label && (
        <span className="text-gray-600 font-medium">{label}:</span>
      )}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border">
        <span className="text-sm font-mono text-gray-800 select-all">{text}</span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
          title={`Copy ${label || 'text'}`}
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyableText;
