import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import withoutLogo from '@/assets/withoutLogo.png';
import Loading from '../loading';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
  name: string;
  className: string;
}

export default function Image({ url, name, className, ...props }: ImageProps) {
  const ctx = useApp();
  const [imageLoading, setImageLoading] = useState(false);
  const src = url.startsWith('/')
    ? `${ctx.apiURL}${url}`
    : `${ctx.apiURL}/team/${url}`;
  return imageLoading ? (
    <Loading className='bg-transparent border-none' />
  ) : (
    <img
      src={src}
      alt={name}
      className={cn(className, imageLoading ? 'opacity-0' : 'opacity-100')}
      onLoad={() => setImageLoading(false)}
      onError={e => {
        e.currentTarget.src = withoutLogo;
        setImageLoading(false);
      }}
      {...props}
    />
  );
}
