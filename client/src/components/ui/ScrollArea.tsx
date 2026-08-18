import * as React from 'react';
import { cn } from '../../lib/utils';

function ScrollArea({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div className="h-full w-full rounded-md border">
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export { ScrollArea };
