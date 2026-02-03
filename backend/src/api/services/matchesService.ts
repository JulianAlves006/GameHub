import { io } from '../../server.ts';

export function updateMatchesService(data: {
  playing: number;
  finished: number;
}) {
  io.emit('matchesUpdated', data);
}
