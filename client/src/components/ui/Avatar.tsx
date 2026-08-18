import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const avatarVariants = cva('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      default: 'h-10 w-10',
      sm: 'h-8 w-8',
      lg: 'h-16 w-16',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {src && !imgError ? (
        <img src={src} alt={alt || 'Avatar'} className="aspect-square h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-church-primary text-white text-sm font-medium">
          {fallback || alt?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </div>
  );
}

export { Avatar };
