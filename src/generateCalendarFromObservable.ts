import { Observable, empty } from 'rxjs';
import { merge, map } from 'rxjs/operators';
import ical from 'ical-generator';
import { uuid } from './helpers/uuid';

import { Match } from '@vcalendars/models';

import ICalendarGenerationOptions from './ICalendarGeneratorOptions';

export default async function generateCalendarFromObservable(
  matches$: Observable<Match>,
  options: ICalendarGenerationOptions,
  duties$: Observable<Match> = empty(),
): Promise<string> {
  const {
    domain,
    name,
    timezone,
    matchDuration,
    created = new Date(),
  } = options;
  const cal = ical({
    domain,
    name,
    timezone,
  });
  return new Promise((resolve, reject) => {
    const wrappedDuties = duties$.pipe(map(match => ({ isDuty: true, match })));
    const wrappedMatches = matches$.pipe(
      map(match => ({ isDuty: false, match })),
    );
    wrappedMatches.pipe(merge(wrappedDuties)).subscribe(
      wrappedMatch => {
        const { isDuty, match } = wrappedMatch;
        const endDate = new Date(match.time.getTime() + matchDuration);
        cal.createEvent({
          summary: `${isDuty ? `${match.duty?.name} Duty: ` : ''}${
            match.home.name
          } vs ${match.away.name}`,
          location: `${match.venue} (${match.court})`,
          start: match.time,
          end: endDate,
          uid: uuid(),
          created,
        });
      },
      error => {
        reject(error);
      },
      () => {
        resolve(cal.toString().replace(/\r/g, ''));
      },
    );
  });
}
