import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Data, TableCard } from './styled';
import { Center } from '../../style';
import withoutLogo from '../../assets/withoutLogo.png';
import Loading from '../loading';

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
  return (
    <TableCard>
      <div>
        {data.length > 0 ? (
          <Data>
            <thead>
              <tr>
                {config.map((conf: Config) => (
                  <th key={conf.key}>{conf.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d: any, index: number) => (
                <tr key={d.id || index}>
                  {config.map((conf: Config) => (
                    <td key={conf.key}>
                      {conf.key === 'position' ? (
                        (currentPage - 1) * itemsPerPage + index + 1
                      ) : conf.element === 'link' ? (
                        <b>
                          <Link
                            to={`/${conf.linkDirection}/${d[conf.linkContent || conf.key]}`}
                          >
                            {conf.content ? d[conf.key] : 'Acessar'}
                          </Link>
                        </b>
                      ) : conf.element === 'filter' ? (
                        <b>
                          <Link
                            to={`/${conf.linkDirection}?${d[conf.linkContent || conf.key]}`}
                          >
                            {conf.content ? d[conf.key] : 'Acessar'}
                          </Link>
                        </b>
                      ) : conf.key === 'logo' && isTeams ? (
                        <div
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                          }}
                        >
                          {(loadingImages[d.id] === undefined ||
                            loadingImages[d.id]) && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                              }}
                            >
                              <Loading size='sm' />
                            </div>
                          )}
                          <img
                            style={{
                              cursor: 'pointer',
                              objectFit: 'cover',
                              opacity: loadingImages[d.id] === false ? 1 : 0,
                              transition: 'opacity 0.3s',
                            }}
                            src={`http://localhost:3333/team/${d.id}/logo`}
                            alt={`${d.name} logo`}
                            onLoad={() => handleImageLoad(d.id)}
                            onError={e => {
                              e.currentTarget.src = withoutLogo;
                              handleImageLoad(d.id);
                            }}
                            onLoadStart={() => {
                              if (loadingImages[d.id] === undefined) {
                                handleImageStartLoad(d.id);
                              }
                            }}
                            onClick={() => handleClick(d.id)}
                          />
                        </div>
                      ) : (
                        d[conf.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Data>
        ) : (
          <Center>
            <h1 style={{ margin: '20px 0 20px 0' }}>Nenhum dado encontrado</h1>
          </Center>
        )}
      </div>
    </TableCard>
  );
};
