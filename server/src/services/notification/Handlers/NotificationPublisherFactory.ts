import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';

export class NotificationPublisherFactory {
  constructor(private readonly emailPublisher: any, private readonly smsPublisher: TwilioClient) {}

  manufacture(staffMember: StaffMember) {}
}
