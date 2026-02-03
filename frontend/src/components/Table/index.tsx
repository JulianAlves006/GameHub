import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

import withoutLogo from '../../assets/withoutLogo.png';
import Loading from '../loading';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Config {
  key: string;
  label: string;
  element: string;
  content?: boolean;
  linkContent?: string;
  linkDirection?: string;
}

interface TableProps {
  data: Record<string, unknown>[];
  config: Config[];
  isTeams?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

export const Table = ({
  data,
  config,
  isTeams = false,
  currentPage = 1,
  itemsPerPage = 10,
}: TableProps) => {
  const navigate = useNavigate();
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>(
    {}
  );

  function handleClick(id: number) {
    navigate(`/team/${id}`);
  }

  function handleImageLoad(id: number) {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  }

  function handleImageStartLoad(id: number) {
    setLoadingImages(prev => {
      if (prev[id] === undefined) {
        return { ...prev, [id]: true };
      }
      return prev;
    });
  }

  const linkClassName = cn(
    'text-foreground no-underline font-semibold',
    'relative after:content-[""] after:absolute',
    'after:left-0 after:right-0 after:bottom-[-2px]',
    'after:h-px after:bg-current after:scale-x-0',
    'after:origin-left after:transition-transform',
    'hover:after:scale-x-100'
  );

  return (
    <section
      className={cn(
        'w-[90%] max-w-[92vw] bg-card border border-border rounded-2xl',
        'shadow-lg text-foreground mx-auto my-3 overflow-hidden'
      )}
    >
      {data.length > 0 ? (
        <ShadcnTable>
          <TableHeader>
            <TableRow className='border-b-2 border-border bg-background hover:bg-background'>
              {config.map((conf: Config) => (
                <TableHead key={conf.key}>{conf.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d: Record<string, unknown>, index: number) => (
              <TableRow
                key={(d.id as number) || index}
                className={cn(
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/30',
                  'hover:bg-primary/10'
                )}
              >
                {config.map((conf: Config) => (
                  <TableCell key={conf.key}>
                    {conf.key === 'position' ? (
                      (currentPage - 1) * itemsPerPage + index + 1
                    ) : conf.element === 'link' ? (
                      <b>
                        <Link
                          to={`/${conf.linkDirection}/${d[conf.linkContent || conf.key]}`}
                          className={linkClassName}
                        >
                          {conf.content ? (d[conf.key] as string) : 'Acessar'}
                        </Link>
                      </b>
                    ) : conf.element === 'filter' ? (
                      <b>
                        <Link
                          to={`/${conf.linkDirection}?${d[conf.linkContent || conf.key]}`}
                          className={linkClassName}
                        >
                          {conf.content ? (d[conf.key] as string) : 'Acessar'}
                        </Link>
                      </b>
                    ) : conf.key === 'logo' && isTeams ? (
                      <div className='relative inline-block'>
                        {(loadingImages[d.id as number] === undefined ||
                          loadingImages[d.id as number]) && (
                          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
                            <Loading size='sm' />
                          </div>
                        )}
                        <img
                          className={cn(
                            'w-20 h-20 object-cover rounded-lg cursor-pointer',
                            'transition-opacity duration-300',
                            loadingImages[d.id as number] === false
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                          src={`http://localhost:3333/team/${d.id}/logo`}
                          alt={`${d.name} logo`}
                          onLoad={() => handleImageLoad(d.id as number)}
                          onError={e => {
                            e.currentTarget.src = withoutLogo;
                            handleImageLoad(d.id as number);
                          }}
                          onLoadStart={() => {
                            if (loadingImages[d.id as number] === undefined) {
                              handleImageStartLoad(d.id as number);
                            }
                          }}
                          onClick={() => handleClick(d.id as number)}
                        />
                      </div>
                    ) : (
                      (d[conf.key] as React.ReactNode)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </ShadcnTable>
      ) : (
        <div className='flex-1 flex justify-center items-center py-10'>
          <h1 className='text-xl font-semibold text-muted-foreground'>
            Nenhum dado encontrado
          </h1>
        </div>
      )}
    </section>
  );
};
