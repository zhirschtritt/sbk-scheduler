import axios from 'axios';
import rest from '@feathersjs/rest-client';
import feathers from '@feathersjs/feathers';

const app = feathers();
const restClient = rest();
app.configure(restClient.axios(axios));

module.exports = app;
