import 'mocha';
import chaiAsPromised from 'chai-as-promised';
import Chai from 'chai';
Chai.use(chaiAsPromised);
const {assert} = Chai;
import sinon from 'sinon';
import {StaffMember} from '../../../../src/services/staffMember/staffMember.interfaces';
import {MinimalLogger} from '../../../../src/logger';
import {IShiftService} from '../../../../src/services/shift/ShiftService';
import {
  NotificationHandler,
  PublisherFactory,
  Publisher,
  DayOfUpdateHandler,
} from '../../../../src/services/notification';

describe(DayOfUpdateHandler.name, function() {
  let handler: NotificationHandler;
  let shiftService: IShiftService;
  let publisherFactory: PublisherFactory;
  let staffMembers: StaffMember[];
  let smsPublisher: Publisher;
  let emailPublisher: Publisher;

  const staffMember = {
    id: 'someMemberId',
    email: 'some@email.com',
    name: 'primaryStaffer',
    notifications: 1,
    phoneNumber: '23423423423',
    textNotifications: 1,
  };

  const mockLogger: MinimalLogger = {
    debug: () => undefined,
    info: () => undefined,
    error: () => undefined,
    warn: () => undefined,
  };

  beforeEach(function() {
    staffMembers = [staffMember];

    shiftService = {
      findByDateRange() {
        throw new Error('unexpected call to mock shift service');
      },
    } as any;

    smsPublisher = {
      publish() {
        throw new Error('unexpected call to mock sms publisher');
      },
    };
    emailPublisher = {
      publish() {
        throw new Error('unexpected call to mock email publisher');
      },
    };

    publisherFactory = {
      manufactureStaffPublisherMap() {
        throw new Error('unexpected call to publisher factory #manufactureStaffPublisherMap');
      },
      manufactureAdminPublisher() {
        throw new Error('unexpected call to publisher factory #manufactureAdminPublisher');
      },
    };
  });

  it('does not send any updates if no open shifts found for day', async function() {
    sinon
      .stub(publisherFactory, 'manufactureStaffPublisherMap')
      .returns(new Map([[staffMember.name, [smsPublisher, emailPublisher]]]));
    sinon.stub(publisherFactory, 'manufactureAdminPublisher').resolves(emailPublisher);
    sinon.stub(shiftService, 'findByDateRange').resolves([]);

    const smsPublisherStub = sinon.stub(smsPublisher, 'publish');
    const emialPublisherStub = sinon.stub(emailPublisher, 'publish');

    handler = new DayOfUpdateHandler(mockLogger, shiftService, publisherFactory, staffMembers);

    assert.isFulfilled(handler.handle({} as any));
    sinon.assert.notCalled(smsPublisherStub);
    sinon.assert.notCalled(emialPublisherStub);
  });
});
