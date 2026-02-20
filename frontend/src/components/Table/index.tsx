import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

import Image from '../Image';
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

  function handleClick(id: number) {
    navigate(`/team/${id}`);
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
                      <Image
                        url={`${d.id}/logo`}
                        name={(d.name as string) ?? 'Time'}
                        className={cn(
                          'w-20 h-20 object-cover rounded-lg cursor-pointer',
                          'transition-opacity duration-300'
                        )}
                        onClick={() => handleClick(d.id as number)}
                      />
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
