import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import withoutLogo from '@/assets/withoutLogo.png';
import Loading from '../loading';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isProfilePicture(url: string): boolean {
  return url.includes('/user/') && url.includes('profilePicture');
}

export default function Image({
  url,
  name,
  className,
  onError,
  ...props
}: ImageProps) {
  const ctx = useApp();
  const [imageLoading, setImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const profilePicture = isProfilePicture(url);
  const src = url.startsWith('/')
    ? `${ctx.apiURL}${url}`
    : `${ctx.apiURL}/team/${url}`;

  if (hasError && profilePicture) {
    return (
      <Avatar className={cn('size-8 shrink-0', className)}>
        <AvatarFallback className='bg-muted text-xs font-medium text-foreground'>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return imageLoading ? (
    <Loading className='bg-transparent border-none' />
  ) : (
    <img
      src={src}
      alt={name}
      className={cn(className, imageLoading ? 'opacity-0' : 'opacity-100')}
      onLoad={() => setImageLoading(false)}
      onError={e => {
        if (profilePicture) {
          setHasError(true);
          setImageLoading(false);
        } else {
          e.currentTarget.src = withoutLogo;
          setImageLoading(false);
        }
        onError?.(e);
      }}
      {...props}
    />
  );
}
