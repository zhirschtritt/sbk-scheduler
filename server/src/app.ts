global.Promise = require('bluebird');
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import configuration from '@feathersjs/configuration';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import favicon from 'serve-favicon';
import compress from 'compression';

const swagger = require('feathers-swagger');
const logger = require('./logger');
const services = require('./services');
const channels = require('./channels');
const appHooks = require('./app.hooks');
const sheetsAdapter = require('./sheetsAdapter');
const mailer = require('./mailer');

import {smsClientFactory} from './twilioSMSClient/smsClientFactory';
import {NotificationCronSchedulerFactory} from './services/notification/notifcation-scheduler';

const app = express(feathers());

app.configure(configuration());
app.configure(smsClientFactory(logger));
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
app.use('/', express.static(app.get('public')));
app.configure(sheetsAdapter);
app.configure(mailer);
app.configure(express.rest());
app.configure(socketio());
app.configure(
  swagger({
    docsPath: '/swagger',
    uiIndex: path.join(__dirname, 'docs.html'),
    info: {
      title: 'SBK Scheduler',
      description: 'Terms, Shifts, StaffMembers, Notifcaitons',
    },
  }),
);
app.configure(services);
app.configure(channels);
app.use(express.notFound());
app.use(express.errorHandler({logger}));
app.hooks(appHooks);

const scheduledTasks = new NotificationCronSchedulerFactory(app.service('notifications'), logger);
scheduledTasks.start();

module.exports = app;
