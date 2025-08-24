import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'default', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizes[size],
        className
      )}
    />
  );
};

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'default', className, text }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <Loader size={size} />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export { Loader, Spinner };