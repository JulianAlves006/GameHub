import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';
import api from '../../services/axios';
import { toast } from 'sonner';
import { Table } from '../../components/Table';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading';
import { FaCheck, FaTimesCircle, FaUserAlt } from 'react-icons/fa';
import { isEmail } from 'validator';
import { formatMetricsForChart } from '../../services/utils';
import RadarChart from '../../components/RadarChart';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../contexts/AppContext';
import { type Team, type Championship, type Match } from '../../types/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import FileInput from '../../components/FileInput';
import {
  ChevronRight,
  Crown,
  Edit,
  LayoutGrid,
  Mail,
  Trophy,
  Users,
  Star,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from '@/components/Image';

type ChampionshipResponse = {
  championships: Championship[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
};

export default function User() {
  const navigate = useNavigate();
  const ctx = useApp();
  const { id } = useParams();
  const accessUser = ctx.user;
  const [user, setUser] = useState(ctx.user);
  const [matches, setMatches] = useState<
    {
      link: number | undefined;
      championship: string | undefined;
      championshipId: number | undefined;
      team1: string | undefined;
      team2: string | undefined;
      winner: string;
      status: string;
    }[]
  >([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { createNotifications } = useNotifications({ setLoading });

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [metrics, setMetrics] = useState<
    { type: string; quantity: number }[] | undefined
  >();
  const [canInviteToTeam, setCanInviteToTeam] = useState<{
    show: boolean;
    teamInfo: Team | null;
  }>({ show: false, teamInfo: null });
  const [openImage, setOpenImage] = useState(false);

  const chartData = useMemo(() => {
    if (!metrics) {
      return formatMetricsForChart({
        metrics: {},
        label: user?.name || 'Meu Perfil',
      });
    }

    const result = formatMetricsForChart({
      metrics: metrics,
      label: user?.name || 'Meu Perfil',
    });

    return result;
  }, [metrics, user?.name]);

  const statusFront = {
    playing: 'Jogando',
    pending: 'Pendente',
    finished: 'Finalizada',
  };

  const configMatches = [
    {
      key: 'link',
      label: 'Partida',
      element: 'link',
      linkDirection: 'match',
    },
    {
      key: 'championship',
      label: 'Campeonato',
      element: 'link',
      content: true,
      linkContent: 'championshipId',
      linkDirection: 'championship',
    },
    {
      key: 'team1',
      label: 'Time 1',
      element: 'tr',
    },
    {
      key: 'team2',
      label: 'Time 2',
      element: 'tr',
    },
    {
      key: 'winner',
      label: 'Vencedor',
      element: 'tr',
    },
    {
      key: 'status',
      label: 'Status',
      element: 'tr',
    },
  ];

  //Verifica se é pra trazer os dados de um usuário aleatório ou do usuário que acessou o sistema
  useEffect(() => {
    if (id) {
      getUserData(Number(id));
    }
  }, [id]);

  // Atualiza name e email automaticamente quando user mudar
  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (user?.profile === 'admin') {
      getChampionships();
    } else {
      const gamerMetrics = user?.gamers?.[0]?.metrics;
      setMetrics(gamerMetrics);
      getMatches();
    }
  }, [user]);

  useEffect(() => {
    async function checkCanInvite() {
      const result = await verifyInviteTeamButtom();
      if (result.show) {
        setCanInviteToTeam(result);
      }
    }
    checkCanInvite();
  }, [user]);

  async function verifyInviteTeamButtom() {
    try {
      let userTeam;
      if (!user?.gamers?.[0]?.team) {
        userTeam = await api.get(`/team?idAdmin=${user?.gamers?.[0]?.id}`);
      }
      const accesUserTeam = await api.get(
        `/team?idAdmin=${accessUser?.gamers?.[0]?.id}`
      );

      if (
        userTeam?.data.teams.length > 0 &&
        accesUserTeam.data.teams.length > 0 &&
        accessUser?.profile === 'gamer'
      )
        return { show: true, teamInfo: accesUserTeam.data.teams[0] };

      return { show: false, teamInfo: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao verificar convite');
      } else {
        toast.error('Erro ao verificar convite');
      }
      return { show: false, teamInfo: null };
    }
  }

  async function getUserData(userId: number) {
    try {
      setLoading(true);
      const { data } = await api.get(`/user?id=${userId}`);
      setUser(data[0]);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao buscar usuário');
      } else {
        toast.error('Erro ao buscar usuário');
      }
    } finally {
      setLoading(false);
    }
  }

  async function getChampionships() {
    setLoading(true);
    try {
      const { data } = await api.get<ChampionshipResponse>(
        `/championship?idAdmin=${id ? id : user?.id}`
      );
      setChampionships(data.championships);
      const dataFormated = data.championships.map(d => d.matches).flat();
      const frontData = dataFormated
        ?.filter(d => d?.status !== 'finished')
        .map(d => ({
          link: d?.id,
          championship: d?.championship?.name,
          championshipId: d?.championship?.id,
          team1: d?.team1?.name,
          team2: d?.team2?.name,
          winner: d?.winner?.name ?? 'Indefinido',
          status: statusFront[d?.status as keyof typeof statusFront],
        }));
      setMatches(frontData);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || 'Erro ao buscar campeonatos'
        );
      } else {
        toast.error('Erro ao buscar campeonatos');
      }
    } finally {
      setLoading(false);
    }
  }

  async function getMatches() {
    setLoading(true);
    try {
      // Verifica se o gamer tem um time antes de buscar partidas
      if (!user?.gamers?.[0]?.team) {
        setMatches([]);
        return;
      }

      const teamId = user?.gamers?.[0]?.team?.id;
      if (!teamId) {
        setMatches([]);
        return;
      }

      const { data } = await api.get<{ count: number; matches: Match[] }>(
        `match?page=1&limit=100&idTeam=${teamId}`
      );

      if (!data.matches || data.matches.length === 0) {
        setMatches([]);
        return;
      }

      const frontData = data.matches.map(d => ({
        link: d.id,
        championship: d.championship?.name,
        championshipId: d.championship?.id,
        team1: d.team1?.name,
        team2: d.team2?.name,
        winner: d?.winner?.name ?? 'Indefinido',
        status: statusFront[d.status as keyof typeof statusFront],
      }));
      setMatches(frontData);
      addUniqueChampionshipsFromTeam(data.matches);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao buscar partidas');
      } else {
        toast.error('Erro ao buscar partidas');
      }
    } finally {
      setLoading(false);
    }
  }

  function addUniqueChampionshipsFromTeam(matchList: Match[]) {
    setChampionships(prev => {
      const seen = new Set(prev.map(c => c.id));
      const next = [...prev];

      for (const match of matchList) {
        if (!seen.has(match.championship.id)) {
          seen.add(match.championship.id);
          next.push(match.championship);
        }
      }
      return next;
    });
  }

  async function handleEdit() {
    if (!isEmail(email) || !name) {
      toast.error('Nome ou email inválidos! Preencha tudo corretamente');
      return;
    }
    try {
      await api.put('/user', {
        id: user?.id,
        name,
        email,
      });
      toast.success('Usuário editado com sucesso!');
      setIsEditing(false);
      if (user) {
        ctx.setUser({
          ...user,
          name,
          email,
        });
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao editar usuário');
      } else {
        toast.error('Erro ao editar usuário');
      }
    }
  }

  async function handleNotification() {
    if (
      !user?.id ||
      !accessUser?.gamers?.[0]?.id ||
      !canInviteToTeam.teamInfo?.id
    )
      return;
    await createNotifications(
      'team_invite',
      user.id,
      accessUser.gamers[0].id,
      ``,
      canInviteToTeam.teamInfo.id
    );
  }

  async function handleEditImage() {
    if (!selectedImage) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    // Validar tamanho (5MB)
    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Validar tipo
    if (!selectedImage.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('profilePicture', selectedImage as File);
      fd.append('id', String(user?.id));
      fd.append('name', name);
      fd.append('email', email);

      await api.put('/user', fd);
      toast.success('Foto de perfil atualizada com sucesso!');
      setOpenImage(false);
      setSelectedImage(null);

      // Resetar estados para recarregar a imagem
      setImageLoading(true);
      setImageError(false);

      // Recarregar dados do usuário
      if (user?.id) {
        const { data } = await api.get(`/user?id=${user.id}`);
        setUser(data[0]);
        ctx.setUser(data[0]);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.erro || 'Erro ao atualizar foto de perfil'
        );
      } else {
        toast.error('Erro ao atualizar foto de perfil');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4'>
      {canInviteToTeam.show && (
        <div className='w-[90%] m-5 flex justify-end gap-2'>
          <Button onClick={handleNotification}>
            Solicitar para jogador entrar no time
          </Button>
        </div>
      )}

      {loading && <Loading fullscreen message='Carregando dados...' />}
      <div className='w-full relative rounded-[32px] overflow-hidden bg-card border border-border mb-10'>
        <div className='h-40 bg-linear-to-r from-purple-600 via-blue-600 to-card dark:from-purple-900 dark:via-blue-900'></div>
        <div className='px-8 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-12'>
          <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>
            <div className='w-32 h-32 rounded-3xl bg-muted border-4 border-card shadow-2xl overflow-hidden flex items-center justify-center group relative cursor-pointer hover:opacity-90 transition-opacity'>
              {imageLoading && !imageError && (
                <div className='h-full w-full absolute inset-0 flex items-center justify-center z-10 bg-background/50'>
                  <Loading className='bg-transparent border-none' />
                </div>
              )}
              {/* Ícone de edição no canto superior direito */}
              <div className='absolute top-1 right-1 z-20 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'>
                <Edit onClick={() => setOpenImage(true)} size={14} />
              </div>
              {imageError ? (
                <div
                  className='h-full w-full flex items-center justify-center text-muted-foreground'
                  onClick={() => setOpenImage(true)}
                >
                  <FaUserAlt size={48} />
                </div>
              ) : (
                <Image
                  url={`/user/${id ? id : user?.id}/profilePicture`}
                  name={name}
                  className={cn(
                    'h-full w-full object-cover rounded-3xl transition-opacity duration-300'
                  )}
                  onClick={() => setOpenImage(true)}
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
            <div className='text-center md:text-left mb-2'>
              {isEditing ? (
                <>
                  <Input
                    type='text'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='text-3xl! font-black text-card-foreground mb-1 bg-transparent w-fit border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                  <div className='flex gap-3'>
                    <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                      <Mail size={14} />
                      <Input
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='bg-transparent border-none p-0 h-auto text-muted-foreground text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 w-fit min-w-[200px]'
                      />
                    </div>
                    {user?.profile === 'gamer' && user?.gamers?.[0]?.team && (
                      <>
                        <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                          <Users size={14} />
                          <span>Time: {user.gamers?.[0]?.team?.name}</span>
                        </div>
                        <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                          <Star size={14} />
                          <span>
                            Score:{' '}
                            {user.gamers?.[0]?.score.toLocaleString('pt-br')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h1 className='text-3xl font-black text-card-foreground mb-1'>
                    {name}
                  </h1>

                  <div className='flex gap-3'>
                    <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                      <Mail size={14} />
                      <span>{email}</span>
                    </div>
                    {user?.profile === 'gamer' && user?.gamers?.[0]?.team && (
                      <>
                        <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                          <Users size={14} />
                          <span>Time: {user.gamers?.[0]?.team?.name}</span>
                        </div>
                        <div className='flex items-center gap-2 justify-center md:justify-start text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg border border-border w-fit'>
                          <Star size={14} />
                          <span>
                            Score:{' '}
                            {user.gamers?.[0]?.score.toLocaleString('pt-br')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='flex items-center gap-3 w-full md:w-auto'>
            {championships.length > 0 && user?.profile === 'admin' && (
              <button
                onClick={() => navigate('/awards')}
                className='flex-1 md:flex-none py-3 px-6 bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2'
              >
                <Trophy size={18} />
                Criar Prêmios
              </button>
            )}
            {isEditing ? (
              <div className='p-3 flex gap-4 bg-muted text-muted-foreground hover:text-foreground rounded-xl border border-border transition-colors'>
                <button
                  className='cursor-pointer text-destructive hover:text-destructive/80'
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimesCircle size={20} />
                </button>
                <button
                  className='cursor-pointer text-green-500 hover:text-green-600'
                  onClick={handleEdit}
                >
                  <FaCheck size={20} />
                </button>
              </div>
            ) : (
              <>
                {user?.id === accessUser?.id && (
                  <button className='p-3 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-xl border border-border transition-colors'>
                    <Edit onClick={() => setIsEditing(true)} size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className='w-full mx-auto'>
        {user?.profile === 'admin' ? (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-1'>
            {/* Admin Info Card */}
            <div className='lg:col-span-1 flex flex-col gap-3'>
              <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 text-foreground'>
                <Crown
                  className='text-yellow-500 dark:text-yellow-400'
                  size={24}
                />
                Campeonatos
              </h2>
              {championships.map(c => (
                <Button
                  key={c.id}
                  onClick={() => navigate(`/championship/${c.id}`)}
                  className={cn(
                    'group px-6 py-3 bg-primary/10 rounded-lg',
                    'border border-primary/30 transition-all',
                    'hover:bg-primary/20 hover:border-purple-400 w-full',
                    'flex items-center justify-between p-8 pl-2 cursor-pointer'
                  )}
                >
                  <div className='flex items-center gap-2'>
                    <div className='bg-muted w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors'>
                      <Trophy size={18} />
                    </div>
                    <h3 className='text-primary'>{c.name}</h3>
                  </div>
                  <ChevronRight
                    size={16}
                    className='text-muted-foreground group-hover:text-purple-500'
                  />
                </Button>
              ))}
            </div>
            <div className='lg:col-span-3'>
              <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 ml-13 text-foreground'>
                <LayoutGrid
                  className='text-blue-500 dark:text-blue-400'
                  size={24}
                />
                Partidas
              </h2>
              <Table config={configMatches} data={matches} />
            </div>
          </div>
        ) : (
          <>
            {/* Gamer Info Card */}

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-1'>
              {/* Admin Info Card */}
              <div className='lg:col-span-1 flex flex-col gap-3'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 text-foreground'>
                  <Crown
                    className='text-yellow-500 dark:text-yellow-400'
                    size={24}
                  />
                  Campeonatos inscritos
                </h2>
                {championships.map(c => (
                  <Button
                    key={c.id}
                    onClick={() => navigate(`/championship/${c.id}`)}
                    className={cn(
                      'group px-6 py-3 bg-primary/10 rounded-lg',
                      'border border-primary/30 transition-all',
                      'hover:bg-primary/20 hover:border-purple-400 w-full',
                      'flex items-center justify-between p-8 pl-2 cursor-pointer'
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='bg-muted w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors'>
                        <Trophy size={18} />
                      </div>
                      <h3 className='text-primary'>{c.name}</h3>
                    </div>
                    <ChevronRight
                      size={16}
                      className='text-muted-foreground group-hover:text-purple-500'
                    />
                  </Button>
                ))}
              </div>
              <div className='lg:col-span-3'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 ml-13 text-foreground'>
                  <LayoutGrid
                    className='text-blue-500 dark:text-blue-400'
                    size={24}
                  />
                  Partidas
                </h2>
                <Table config={configMatches} data={matches} />
              </div>
            </div>
          </>
        )}
        <div className='w-full mt-10 flex justify-center items-center'>
          {user?.profile !== 'admin' && metrics && (
            <div className='w-[60%] h-[60%]'>
              <RadarChart
                config={{
                  type: 'radar',
                  data: chartData,
                  options: {
                    elements: {
                      line: {
                        borderWidth: 3,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={openImage} onOpenChange={setOpenImage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Quer alterar sua foto de perfil?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selecione uma nova foto de perfil para substituir a atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex flex-col gap-4 py-4'>
            <FileInput
              id='profilePictureDialog'
              name='profilePictureDialog'
              accept='image/*'
              value={selectedImage}
              onChange={setSelectedImage}
              label='Foto de perfil'
              placeholder='Selecionar foto de perfil'
              maxSize={5}
            />
            {selectedImage && (
              <div className='flex justify-center'>
                <div className='relative w-48 h-48 rounded-lg overflow-hidden border border-border'>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt='Preview da foto selecionada'
                    className='w-full h-full object-cover'
                    onLoad={e => {
                      URL.revokeObjectURL((e.target as HTMLImageElement).src);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenImage(false);
                setSelectedImage(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleEditImage}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
