import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

import icon from '../../assets/icon.png';
import logo from '../../assets/logo.png';
import withoutLogo from '../../assets/withoutLogo.png';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../../services/axios';
import Loading from '../../components/loading';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../contexts/AppContext';
import type { Team } from '../../types/types';
import { ThemeToggle } from '../ThemeToggle';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import DropDownMenu from './DropDownMenu';
import { Button } from '../ui/button';

export default function Header() {
  const ctx = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const user = ctx.user;
  const team = user?.gamers?.[0]?.team;
  const [loading, setLoading] = useState(false);
  const { getNotifications } = useNotifications({ setLoading });
  const [teamAdmin, setTeamAdmin] = useState<Team>();
  const gamerId = user?.gamers?.[0]?.id;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function getTeamAdmin() {
      if (!gamerId) {
        setTeamAdmin(undefined);
        return;
      }
      try {
        const { data } = await api.get(`/team?idAdmin=${gamerId}`);
        if (data.teams && data.teams.length > 0) {
          setTeamAdmin(data.teams[0]);
        } else {
          setTeamAdmin(undefined);
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          // Silenciosamente falha se não encontrar time
          setTeamAdmin(undefined);
        }
      }
    }
    getTeamAdmin();
  }, [gamerId]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <nav
        className={cn(
          'bg-card px-6 py-4 flex items-center justify-between w-full',
          'shadow-md border-b border-border',
          'sticky top-0 z-50',
          'max-md:px-4 max-md:py-3 max-md:flex-wrap max-md:gap-3'
        )}
      >
        {/* Logo Section */}
        <div
          onClick={() => navigate('/home')}
          className={cn(
            'flex items-center gap-3 cursor-pointer',
            'transition-opacity hover:opacity-80'
          )}
        >
          <img
            src={icon}
            className='w-10 h-10 object-contain transition-transform hover:scale-105 max-md:w-8 max-md:h-8'
            alt='GameHub Icon'
          />
          <img
            src={logo}
            className='h-8 object-contain transition-transform hover:scale-102 max-md:h-7'
            alt='GameHub Logo'
          />
        </div>

        {/* Navigation Links */}
        <div
          className={cn(
            'flex items-center gap-2 flex-1 justify-center',
            'max-md:order-3 max-md:w-full max-md:justify-around max-md:mt-2'
          )}
        >
          <NavLink to='/home' active={isActive('/home')}>
            Rankings de times
          </NavLink>
          <NavLink to='/gamers' active={isActive('/gamers')}>
            Rankings de jogadores
          </NavLink>
          <NavLink to='/matches' active={isActive('/matches')}>
            Partidas
          </NavLink>
          <NavLink to='/championships' active={isActive('/championships')}>
            Campeonatos
          </NavLink>
          {(user?.gamers?.[0]?.score ?? 0) >= 50000 && !team && !teamAdmin && (
            <NavLink to='/team' active={isActive('/team')}>
              Criar time
            </NavLink>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 ml-auto',
              'max-md:ml-0 max-md:order-2'
            )}
          >
            <ThemeToggle />
            {team && (
              <img
                onClick={() => navigate(`/team/${team.id}`)}
                src={`https://gamehub-mcq4.onrender.com/team/${(team as Team).id}/logo`}
                alt={`${(team as Team).name} logo`}
                onError={e => {
                  e.currentTarget.src = withoutLogo;
                }}
                className={cn(
                  'w-10 h-10 object-cover rounded-lg',
                  'border-2 border-secondary cursor-pointer',
                  'transition-all hover:scale-105 hover:border-primary',
                  'shadow-md max-md:w-8 max-md:h-8'
                )}
              />
            )}
            {teamAdmin && !team && (
              <img
                onClick={() => navigate(`/team/${teamAdmin.id}`)}
                src={`https://gamehub-mcq4.onrender.com/team/${teamAdmin.id}/logo`}
                alt={`${teamAdmin.name} logo`}
                onError={e => {
                  e.currentTarget.src = withoutLogo;
                }}
                className={cn(
                  'w-10 h-10 object-cover rounded-lg',
                  'border-2 border-secondary cursor-pointer',
                  'transition-all hover:scale-105 hover:border-primary',
                  'shadow-md max-md:w-8 max-md:h-8'
                )}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cn(
                    'flex items-center gap-2 text-foreground',
                    'px-3 py-2 rounded-lg transition-all font-medium',
                    'hover:bg-primary/10 hover:text-primary cursor-pointer',
                    'max-md:px-2 max-md:py-1.5 border-none bg-transparent'
                  )}
                >
                  <span className='text-sm flex items-center gap-2.5 max-md:text-xs'>
                    {user?.name}
                    <div className='relative w-8 h-8 rounded-full overflow-hidden border-2 border-border shrink-0 max-md:w-6 max-md:h-6'>
                      {imageLoading && !imageError && (
                        <div className='absolute inset-0 flex items-center justify-center bg-muted'>
                          <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin max-md:w-3 max-md:h-3' />
                        </div>
                      )}
                      {imageError ? (
                        <div className='w-full h-full flex items-center justify-center text-muted-foreground bg-muted'>
                          <FaUserAlt
                            size={12}
                            className='max-md:w-3 max-md:h-3'
                          />
                        </div>
                      ) : (
                        <img
                          src={`https://gamehub-mcq4.onrender.com/user/${user?.id}/profilePicture`}
                          alt={`Foto de perfil de ${user?.name}`}
                          className={cn(
                            'w-full h-full object-cover transition-opacity duration-300',
                            imageLoading ? 'opacity-0' : 'opacity-100'
                          )}
                          onClick={() => navigate(`/user/${user?.id}`)}
                          onLoad={() => {
                            setImageLoading(false);
                            setImageError(false);
                          }}
                          onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                          }}
                        />
                      )}
                    </div>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropDownMenu />
            </DropdownMenu>
          </div>
        )}
      </nav>
    </>
  );
}

// NavLink Component
interface NavLinkProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
}

function NavLink({ to, active, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'text-foreground no-underline px-4 py-2 rounded-lg',
        'font-medium text-sm transition-all whitespace-nowrap',
        'hover:bg-primary/40 hover:text-secondary',
        active && 'bg-primary/70 text-secondary',
        'max-md:px-3 max-md:py-1.5 max-md:text-xs'
      )}
    >
      {children}
    </Link>
  );
}
