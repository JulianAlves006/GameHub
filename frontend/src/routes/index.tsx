import { Routes, Route } from 'react-router-dom';

import Login from '../pages/login';
import Register from '../pages/register';
import Home from '../pages/home';
import Matches from '../pages/matches';
import Championships from '../pages/championships';
import Championship from '../pages/detailsPages/championship';
import CreateChampionship from '../pages/creates/championship';
import CreateMatch from '../pages/creates/match';
import Match from '../pages/detailsPages/match';
import Team from '../pages/detailsPages/team';
import TeamRegister from '../pages/creates/team';
import User from '../pages/user';
import Gamer from '../pages/creates/gamer';
import NotFound from '../pages/404';
import EditChampionship from '../pages/edits/championship';
import Awards from '../pages/creates/award';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/gamer' element={<Gamer />} />
      <Route path='/home' element={<Home />} />
      <Route path='/matches' element={<Matches />} />
      <Route path='/match/:id' element={<Match />} />
      <Route path='/createMatch/:id' element={<CreateMatch />} />
      <Route path='/championships' element={<Championships />} />
      <Route path='/championship/:id' element={<Championship />} />
      <Route path='/createChampionship' element={<CreateChampionship />} />
      <Route path='/editChampionship/:id' element={<EditChampionship />} />
      <Route path='/awards' element={<Awards />} />
      <Route path='/team/:id' element={<Team />} />
      <Route path='/team' element={<TeamRegister />} />
      <Route path='/user' element={<User />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
