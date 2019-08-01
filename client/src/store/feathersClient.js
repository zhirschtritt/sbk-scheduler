import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const feathersClient = feathers();

const baseUrl = 'http://localhost:3030';
// process.env.NODE_ENV === 'production' ? '' :
const socket = io(window.location.origin, {
  transports: ['websocket']
});

feathersClient.configure(socketio(socket));

export default feathersClient;
