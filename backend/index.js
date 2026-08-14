const io = require('socket.io')(process.env.PORT || 8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {

    console.log("Connected:", socket.id);

    socket.on('new-user-joined', name => {
        console.log("New user:", name);

        users[socket.id] = name;

        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log("Message:", message);
        console.log("From:", users[socket.id]);

        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        console.log("Disconnected:", socket.id);

        socket.broadcast.emit('left', users[socket.id]);

        delete users[socket.id];
    });
});
