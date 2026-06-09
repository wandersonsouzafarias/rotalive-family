'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? (label ? `${label.toLowerCase().replace(/\s/g, '-')}-${generatedId}` : generatedId);
  const errorId = `${inputId}-error`;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'input-field transition-colors duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
