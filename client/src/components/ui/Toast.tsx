import * as React from 'react';
import { cn } from '../../lib/utils';

function Toast({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-md bg-white p-4 shadow-lg border border-church-primary max-w-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ToastTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
  return <h4 className={cn('font-medium text-church-text', className)} {...props}>{children}</h4>;
}

function ToastDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) {
  return <p className={cn('text-sm text-gray-600', className)} {...props}>{children}</p>;
}

export { Toast, ToastTitle, ToastDescription };
