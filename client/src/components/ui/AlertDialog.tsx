import * as React from 'react';
import { cn } from '../../lib/utils';

function AlertDialog({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div {...props}>{children}</div>;
}

function AlertDialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', className)} {...props}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">{children}</div>
    </div>
  );
}

function AlertDialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div className={cn('flex flex-col space-y-2', className)} {...props}>{children}</div>;
}

function AlertDialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props}>{children}</h2>;
}

function AlertDialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props}>{children}</p>;
}

function AlertDialogFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div className={cn('flex justify-end space-x-2 mt-4', className)} {...props}>{children}</div>;
}

function AlertDialogAction({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={cn('inline-flex h-10 items-center justify-center rounded-md bg-church-primary px-4 py-2 text-sm font-medium text-white hover:bg-church-primary-light', className)}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogCancel({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={cn('inline-flex h-10 items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel };
