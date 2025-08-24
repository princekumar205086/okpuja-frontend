import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    const checkboxId = React.useId();

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id={checkboxId}
              type="checkbox"
              className={cn(
                'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
                error && 'border-red-300 focus:ring-red-500',
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label htmlFor={checkboxId} className="font-medium text-gray-700">
                  {label}
                </label>
              )}
              {description && (
                <p className="text-gray-500">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };