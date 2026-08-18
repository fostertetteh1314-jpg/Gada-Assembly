import * as React from 'react';
import { cn } from '../../lib/utils';

function Dialog({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div {...props}>{children}</div>;
}

function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', className)} {...props}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">{children}</div>
    </div>
  );
}

function DialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}>{children}</div>;
}

function DialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props}>{children}</h2>;
}

function DialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props}>{children}</p>;
}

function DialogFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>{children}</div>;
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
