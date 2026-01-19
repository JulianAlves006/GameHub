import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';

import icon from '../../assets/icon.png';
import logo from '../../assets/logo.png';

import {
  Nav,
  UserInfo,
  Links,
  LogoSection,
  NavLink,
  TeamLogo,
  UserLink,
} from './styled';
import { useEffect, useState } from 'react';
import Loading from '../../components/loading';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../contexts/AppContext';
import type { Team } from '../../types/types';

export default function Header() {
  const ctx = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const user = ctx.user;
  const team = user?.gamers?.[0]?.team;
  const [loading, setLoading] = useState(false);
  const { getNotifications } = useNotifications({ setLoading });
  useEffect(() => {
    getNotifications();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Nav>
        <LogoSection onClick={() => navigate('/home')}>
          <img src={icon} className='icon' alt='GameHub Icon' />
          <img src={logo} className='logo' alt='GameHub Logo' />
        </LogoSection>

        <Links>
          <NavLink to='/home' className={isActive('/home') ? 'active' : ''}>
            Rankings de times
          </NavLink>
          <NavLink to='/gamers' className={isActive('/gamers') ? 'active' : ''}>
            Rankings de jogadores
          </NavLink>
          <NavLink
            to='/matches'
            className={isActive('/matches') ? 'active' : ''}
          >
            Partidas
          </NavLink>
          <NavLink
            to='/championships'
            className={isActive('/championships') ? 'active' : ''}
          >
            Campeonatos
          </NavLink>
          {(user?.gamers?.[0]?.score ?? 0) >= 50000 && !team && (
            <NavLink to='/team' className={isActive('/team') ? 'active' : ''}>
              Criar time
            </NavLink>
          )}
        </Links>

        {user && (
          <UserInfo>
            {team && (team as Team).logo && (
              <TeamLogo
                onClick={() => navigate(`/team/${team.id}`)}
                src={`http://localhost:3333/team/${(team as Team).id}/logo`}
                alt={`${(team as Team).name} logo`}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <UserLink to='/user'>
              <h3>
                {user?.name}
                <FaUserAlt size={16} />
              </h3>
            </UserLink>
          </UserInfo>
        )}
      </Nav>
    </>
  );
}
