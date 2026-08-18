import * as React from 'react';
import { cn } from '../../lib/utils';

function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block text-left">{children}</div>;
}

function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function DropdownMenuContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'absolute right-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-church-text shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      className={cn('flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-church-background', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
