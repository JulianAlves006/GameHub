import 'dotenv/config';
import express from 'express';
import { routes } from './routes.ts';
import cors from 'cors';
import { AppDataSource } from './data-source.ts';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const PORT = 3333;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.emit('ready');
  })
  .catch(error => {
    console.log('Error connecting to database', error);
  });

// Middlewares
app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // URL do Vite
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Routes
app.use(routes);

// Start server
app.on('ready', () => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

export { io };
