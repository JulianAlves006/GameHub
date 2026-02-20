// ============================================
// Tipagens baseadas nas entidades do backend
// ============================================

// Metric
export type Metric = {
  id: number;
  quantity: number;
  type: string;
  description: string | null;
  match?: Match;
  gamer?: Gamer | null;
  createdAt: string;
};

// Team
export type Team = {
  id: number;
  name: string;
  logo: string | null;
  gamer?: Gamer;
  gamers?: Gamer[];
  notifications?: Notification[];
  matchesAsTeam1?: Match[];
  matchesAsTeam2?: Match[];
  matchesWon?: Match[];
  createdAt: string;
  updatedAt: string;
};

// Gamer
export type Gamer = {
  id: number;
  team: Team | null;
  shirtNumber: number;
  score: number;
  user?: User;
  notifications?: Notification[];
  metrics?: Metric[];
  createdAt: string;
  updatedAt: string;
};

// User
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  profile: string;
  isActive: number;
  gamers?: Gamer[];
  logs?: Log[];
  notifications?: Notification[];
  championships?: Championship[];
  createdAt?: string;
  updatedAt?: string;
};

// Log
export type Log = {
  id: number;
  user?: User;
  action: string;
  description: string | null;
  createdAt: string;
};

// Notification
export type Notification = {
  id: number;
  user?: User;
  gamer?: Gamer;
  team?: Team | null;
  type: string;
  description: string | null;
  read: number;
  createdAt: string;
};

// Award
export type Award = {
  id: number;
  description: string;
  value: number;
  medal: number;
  trophy: number;
  others: string | null;
  admin?: User;
  awardsChampionships?: AwardChampionship[];
  createdAt: string;
  updatedAt: string;
};

// AwardChampionship (tabela de relacionamento)
export type AwardChampionship = {
  id: number;
  award?: Award;
  championship?: Championship;
};

// Championship
export type Championship = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  admin?: User;
  matches?: Match[];
  awardsChampionships?: AwardChampionship[];
  createdAt: string;
  updatedAt: string;
};

// Match
export type Match = {
  id: number;
  team1: Team;
  team2: Team;
  winner?: Team | null;
  championship: Championship;
  status: string;
  scoreTeam1: number | null;
  scoreTeam2: number | null;
  matchDate: string | null;
  metrics?: Metric[];
  createdAt: string;
  updatedAt: string;
};

// ============================================
// Tipos auxiliares para responses da API
// ============================================

export type LoginResponse = {
  message: string;
  token: string;
  user: User;
};
