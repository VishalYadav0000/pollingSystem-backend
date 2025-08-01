import { Server } from 'socket.io';

let io;

const setUpSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('newVote', (data) => {
      io.emit('voteUpdate', data);
    });

    socket.on('newComment', (comment) => {
      io.emit('commentUpdate', comment);
    });

    socket.on('notification', (data) => {
      io.emit('notifyUser', data);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

export { setUpSocket, getIO };
