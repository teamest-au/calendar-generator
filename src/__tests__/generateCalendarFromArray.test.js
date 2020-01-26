const sut = require('../../index');
const uuid = require('../helpers/uuid');
const sinon = require('sinon');

function stripIcalForTest(icalString) {
  return icalString.replace(/(DTSTAMP:.*\n|CREATED:.*\n)/g, '');
}

describe('generateCalendarFromArray', () => {
  beforeEach(() => {
    sinon.stub(uuid);
  });
  afterEach(() => sinon.restore());
  it('must generate an ics string from an array of matches', async () => {
    uuid.uuid.onCall(0).returns('fake-uuid0');
    uuid.uuid.onCall(1).returns('fake-uuid1');
    const options = {
      domain: 'vcalendars.demery.com.au',
      name: 'Volleyball SA Recreational',
      matchDuration: 1000 * 60 * 60,
      timezone: 'Australia/Adelaide',
    };
    const matches = [
      {
        home: { name: 'Dateko' },
        away: { name: 'Karasuno' },
        time: new Date('2020-01-06T08:00:00.000Z'),
        court: 'Court 3',
        venue: 'Thebarton Senior College',
        round: 'Round 1',
        duty: { name: 'Nekoma' },
      },
      {
        home: { name: 'Nekoma' },
        away: { name: 'Dateko' },
        time: new Date('2020-01-13T09:00:00.000Z'),
        court: 'Court 1',
        venue: 'Thebarton Senior College',
        round: 'Round 2',
        duty: { name: 'Karasuno' },
      },
    ];
    const expected = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
NAME:Volleyball SA Recreational
X-WR-CALNAME:Volleyball SA Recreational
TIMEZONE-ID:Australia/Adelaide
X-WR-TIMEZONE:Australia/Adelaide
BEGIN:VEVENT
UID:fake-uuid0@vcalendars.demery.com.au
SEQUENCE:0
DTSTART:20200106T080000Z
DTEND:20200106T090000Z
SUMMARY:Dateko vs Karasuno
LOCATION:Thebarton Senior College (Court 3)
END:VEVENT
BEGIN:VEVENT
UID:fake-uuid1@vcalendars.demery.com.au
SEQUENCE:0
DTSTART:20200113T090000Z
DTEND:20200113T100000Z
SUMMARY:Nekoma vs Dateko
LOCATION:Thebarton Senior College (Court 1)
END:VEVENT
END:VCALENDAR`;

    const actual = await sut.generateCalendarFromArray(matches, options);
    expect(stripIcalForTest(actual)).toEqual(expected);
  });
  it('must generate an ics string from an array of matches with duties', async () => {
    uuid.uuid.onCall(0).returns('fake-uuid0');
    uuid.uuid.onCall(1).returns('fake-uuid1');
    const options = {
      domain: 'vcalendars.demery.com.au',
      name: 'Volleyball SA Recreational',
      matchDuration: 1000 * 60 * 60,
      timezone: 'Australia/Adelaide',
    };
    const matches = [
      {
        home: { name: 'Dateko' },
        away: { name: 'Karasuno' },
        time: new Date('2020-01-06T08:00:00.000Z'),
        court: 'Court 3',
        venue: 'Thebarton Senior College',
        round: 'Round 1',
        duty: { name: 'Nekoma' },
      },
    ];
    const duties = [
      {
        home: { name: 'Nekoma' },
        away: { name: 'Dateko' },
        time: new Date('2020-01-13T09:00:00.000Z'),
        court: 'Court 1',
        venue: 'Thebarton Senior College',
        round: 'Round 2',
        duty: { name: 'Karasuno' },
      },
    ];

    const expected = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
NAME:Volleyball SA Recreational
X-WR-CALNAME:Volleyball SA Recreational
TIMEZONE-ID:Australia/Adelaide
X-WR-TIMEZONE:Australia/Adelaide
BEGIN:VEVENT
UID:fake-uuid0@vcalendars.demery.com.au
SEQUENCE:0
DTSTART:20200106T080000Z
DTEND:20200106T090000Z
SUMMARY:Dateko vs Karasuno
LOCATION:Thebarton Senior College (Court 3)
END:VEVENT
BEGIN:VEVENT
UID:fake-uuid1@vcalendars.demery.com.au
SEQUENCE:0
DTSTART:20200113T090000Z
DTEND:20200113T100000Z
SUMMARY:Karasuno Duty: Nekoma vs Dateko
LOCATION:Thebarton Senior College (Court 1)
END:VEVENT
END:VCALENDAR`;

    const actual = await sut.generateCalendarFromArray(
      matches,
      options,
      duties,
    );
    expect(stripIcalForTest(actual)).toEqual(expected);
  });
});
