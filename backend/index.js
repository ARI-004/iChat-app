const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "https://i-chat-app-xi.vercel.app",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 8000;

const users = {};

io.on('connection', socket => {
    console.log('CONNECTED:', socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;

        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log('MESSAGE:', message);

        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        console.log('DISCONNECTED:', socket.id);

        socket.broadcast.emit('left', users[socket.id]);

        delete users[socket.id];
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
