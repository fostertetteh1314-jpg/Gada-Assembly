import * as React from 'react';

const Slot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
Slot.displayName = 'Slot';

export { Slot };
