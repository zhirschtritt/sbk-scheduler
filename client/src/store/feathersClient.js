import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const feathersClient = feathers();

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/api`
    : 'http://localhost:3030';
const socket = io(baseUrl, {
  transports: ['websocket']
});

feathersClient.configure(socketio(socket));

export default feathersClient;
