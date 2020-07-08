import path from 'path';
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config/');

import 'reflect-metadata';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import helmet from 'helmet';
import cors from 'cors';
import favicon from 'serve-favicon';
import compress from 'compression';
import {logger, loggerFactory} from './logger';
import {GoogleSheetsClientFactory} from './repositories/GoogleSheetsClientFactory';
import socketio from '@feathersjs/socketio';
import swagger from 'feathers-swagger';
import * as fireorm from 'fireorm';
import {mailgunClientFactory} from './mailer/MailgunClient';
import {services} from './services';
import {smsClientFactory} from './twilioSMSClient/smsClientFactory';
import channels from './channels';
import {FirestoreClientFactory} from './repositories/FirestoreClient';
import * as appHooks from './app.hooks';

export class FeathersApplication {
  public app: any;

  constructor() {
    this.app = express(feathers());
  }

  private async boot() {
    this.app.configure(configuration());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compress());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(favicon(path.join(this.app.get('public'), 'favicon.ico')));
    this.app.use('/', express.static(this.app.get('public')));

    const client = await new GoogleSheetsClientFactory(
      this.app.get('googleSheetId'),
      this.app.get('iam_client_email'),
      this.app.get('iam_private_key_base64'),
    ).manufactureLegacyClient();

    this.app.set('sheetsClient', client);

    const firestore = new FirestoreClientFactory(loggerFactory).manufacture();
    fireorm.Initialize(firestore);

    this.app.configure(mailgunClientFactory);
    this.app.configure(smsClientFactory(logger));
    this.app.configure(express.rest());
    this.app.configure(socketio());
    this.app.configure(
      swagger({
        docsPath: '/swagger',
        uiIndex: path.join(__dirname, 'docs.html'),
        info: {
          title: 'SBK Scheduler',
          description: 'Terms, Shifts, StaffMembers, Notifcaitons',
        },
      }),
    );
    this.app.configure(services);
    this.app.configure(channels);
    this.app.use(express.notFound());
    this.app.use(
      express.errorHandler({
        html: false,
        logger,
      }),
    );
    this.app.hooks(appHooks);
  }

  async start() {
    await this.boot();

    const port = this.app.get('port');
    const server = this.app.listen(port);

    server.on('listening', () => {
      logger.info('Feathers application started on http://%s:%d', this.app.get('host'), port);
    });
  }

  stop() {
    throw new Error('stop not implemented');
  }
}
