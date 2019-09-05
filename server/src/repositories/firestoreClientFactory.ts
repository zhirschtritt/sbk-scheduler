import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import {LoggerFactory, MinimalLogger} from '../logger';

export class FirestoreClientFactory {
  private readonly log: MinimalLogger;
  constructor(logFactory: LoggerFactory) {
    this.log = logFactory(this.constructor.name);
  }
  manufacture() {
    try {
      const serviceAccount = require('/Users/zacharyhirschtritt/.google/sbk-app-214521-firebase-adminsdk-kh9px-06677f5170.json');

      const app = admin.initializeApp(
        {
          credential: admin.credential.cert(serviceAccount),
          databaseURL: 'https://sbk-app-214521.firebaseio.com',
        },
        'default-app',
      );

      const firestore = admin.firestore(app);

      firestore.settings({
        timestampsInSnapshots: true,
      });

      fireorm.Initialize(firestore);

      return fireorm;
    } catch (err) {
      this.log.error({err}, 'Error intializing fireorm client');
      throw new Error('Error intializing fireorm client');
    }
  }
}
