import axios from 'axios';
import rest from '@feathersjs/rest-client';
import feathers from '@feathersjs/feathers';

const app = feathers();
const restClient = rest('http://localhost:3030');
app.configure(restClient.axios(axios));

export default app;
