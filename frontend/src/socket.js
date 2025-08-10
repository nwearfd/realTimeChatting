import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
    socket = io('http://localhost:5000', {
        auth: { token }
    });
    return socket;
}

export const getSocket = () => socket;
