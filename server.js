// // Fichier principal (par ex. server.ts ou app.ts)
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// export const io = new Server(server, {
//     cors: {
//         origin: '*', // Permet l'accès depuis n'importe quel domaine
//         methods: ['GET', 'POST']
//     }
// });

// const users = {};

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('register', (userId) => {
//         users[userId] = socket.id;
//         console.log(`User ${userId} connected with socket ID: ${socket.id}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//         for (const userId in users) {
//             if (users[userId] === socket.id) {
//                 delete users[userId];
//                 break;
//             }
//         }
//     });
// });

// server.listen(5000, () => {
//     console.log('Server running on port 5000');
// });
