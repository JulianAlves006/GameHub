import { Link, useNavigate } from 'react-router-dom';

import { Data, TableCard } from './styled';
import { Center } from '../../style';

interface Config {
  key: string;
  label: string;
  element: string;
  content?: boolean;
  linkContent?: string;
  linkDirection?: string;
}

interface TableProps {
  data: Array<[]>;
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
                        <img
                          style={{ cursor: 'pointer' }}
                          src={`http://localhost:3333/team/${d.id}/logo`}
                          alt={`${d.name} logo`}
                          onError={e =>
                            (e.currentTarget.style.display = 'none')
                          }
                          onClick={() => handleClick(d.id)}
                        />
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
