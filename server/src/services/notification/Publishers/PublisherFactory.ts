import {Publisher, PublisherType, PublisherFactory} from './interfaces';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {EmailPublsiher} from './EmailPublisher';
import {SmsPublisher} from './SmsPublisher';
import {MailgunClient} from '../../../mailer/MailgunClient';

export class CompositePublisherFactory implements PublisherFactory {
  private readonly staffAdmin: StaffMember;

  constructor(
    private readonly emailClient: MailgunClient,
    private readonly smsClient: TwilioClient,
    staffEmail: string,
  ) {
    this.staffAdmin = {
      id: '_ADMIN_',
      name: 'admin',
      notifications: 1,
      textNotifications: 0,
      email: staffEmail,
    } as StaffMember;
  }

  manufactureAdminPublisher() {
    // there is only a single publisher for the admin (email)
    return this.getPublishersForStaff(this.staffAdmin)[0];
  }

  manufactureStaffPublisherMap(reciepients: StaffMember[], limitedPublishers?: PublisherType[]) {
    const staffPubs = reciepients.reduce((publisherMap: Map<string, Publisher[]>, reciepient: StaffMember) => {
      return publisherMap.set(reciepient.id, this.getPublishersForStaff(reciepient, limitedPublishers));
    }, new Map());

    return staffPubs;
  }

  /**
   *
   * @param reciepient staffMember
   * @param limitedPublishers further limit generated publishers to this array only
   */
  private getPublishersForStaff(reciepient: StaffMember, limitedPublishers?: PublisherType[]): Publisher[] {
    const publishers = [];
    const limited = Array.isArray(limitedPublishers) && limitedPublishers.length;

    if (reciepient.notifications) {
      if (!limited || (limited && limitedPublishers!.includes('email'))) {
        publishers.push(new EmailPublsiher(this.emailClient, reciepient.email));
      }
    }

    if (reciepient.textNotifications) {
      if (!limited || (limited && limitedPublishers!.includes('sms'))) {
        publishers.push(new SmsPublisher(this.smsClient, reciepient.phoneNumber));
      }
    }

    return publishers;
  }
}
