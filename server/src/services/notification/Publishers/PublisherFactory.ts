import {Publisher} from './interfaces';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {EmailPublsiher} from './emailPublisher';
import {SmsPublisher} from './smsPublisher';
import {MailgunClient} from '../../../mailer/mailgunClient';

export function getAdminPublisher(publishers: Map<number, Publisher[]>): Publisher {
  return publishers.get(0)![0];
}

export class CompositePublisherFactory {
  private readonly publisherFactory: PublisherFactory;
  private readonly staffAdmin: StaffMember;

  constructor(emailClient: MailgunClient, smsClient: TwilioClient, staffEmail: string) {
    this.publisherFactory = new PublisherFactory(emailClient, smsClient);
    this.staffAdmin = {
      id: 0,
      name: 'admin',
      notifications: 1,
      textNotifications: 0,
      email: staffEmail,
    } as StaffMember;
  }

  manufacture(reciepients: StaffMember[]): Map<number, Publisher[]> {
    const staffPubs = reciepients.reduce((publisherMap: Map<number, Publisher[]>, reciepient: StaffMember) => {
      return publisherMap.set(reciepient.id, this.publisherFactory.manufacture(reciepient));
    }, new Map());

    staffPubs.set(this.staffAdmin.id, this.publisherFactory.manufacture(this.staffAdmin));

    return staffPubs;
  }
}

export class PublisherFactory {
  constructor(private readonly emailClient: MailgunClient, private readonly smsClient: TwilioClient) {}

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
