import {Publisher} from './interfaces';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {EmailPublsiher} from './emailPublisher';
import {SmsPublisher} from './smsPublisher';
import {Application} from '@feathersjs/express';
import * as app from './../../../app';

export class CompositePublisherFactory {
  private readonly publisherFactory: PublisherFactory;
  constructor(emailClient: any, smsClient: TwilioClient) {
    this.publisherFactory = new PublisherFactory(emailClient, smsClient);
  }

  manufacture(reciepients: StaffMember[]): Publisher[] {
    return reciepients.reduce((publishers: Publisher[], reciepient: StaffMember) => {
      return publishers.concat(this.publisherFactory.manufacture(reciepient));
    }, []);
  }
}

export class PublisherFactory {
  constructor(private readonly emailClient: any, private readonly smsClient: TwilioClient) {}

  manufacture(reciepient: StaffMember): Publisher[] {
    let publishers = [];

    if (reciepient.notifications) {
      publishers.push(new EmailPublsiher(this.emailClient, reciepient.email));
    }
    if (reciepient.textNotifications) {
      publishers.push(new SmsPublisher(this.smsClient, reciepient.phoneNumber));
    }

    return publishers;
  }
}

export async function getAllStaffPublishers(
  allStaffMembers: StaffMember[],
  app: Application<any>,
): Promise<Publisher[]> {
  const publisherFactory = new CompositePublisherFactory(app.get('mailer'), app.get('smsClient'));

  const staffAdmin = {
    name: 'admin',
    notifications: 1,
    textNotifications: 0,
    email: app.get('staffEmail'),
  } as StaffMember;

  return publisherFactory.manufacture([...allStaffMembers, staffAdmin]);
}
