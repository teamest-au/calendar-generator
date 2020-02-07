import { Observable, empty } from 'rxjs';
import ical from 'ical-generator';
import { uuid } from './helpers/uuid';

import { TeamSeason } from '@vcalendars/models/processed';

import ICalendarGenerationOptions from './ICalendarGeneratorOptions';
import { Match } from '@vcalendars/models/raw';

function minutesToMillis(minutes: number) {
  return minutes * 1000 * 60;
}

export default async function generateCalendarFromObservable(
  teamSeasons$: Observable<TeamSeason>,
  options: ICalendarGenerationOptions,
): Promise<string> {
  const { domain, name, timezone, created = new Date() } = options;
  const cal = ical({
    domain,
    name,
    timezone,
  });
  return new Promise((resolve, reject) => {
    teamSeasons$.subscribe(
      teamSeason => {
        const { matches, matchDuration, timezone: seasonTimezone } = teamSeason;
        if (seasonTimezone !== timezone) {
          reject(
            'Season timezone does not match calendar timezone and conversion has not yet been implemented!',
          );
        }
        matches.forEach((match: Match) => {
          const endDate = new Date(
            match.time.getTime() + minutesToMillis(matchDuration),
          );
          cal.createEvent({
            summary: `${match.home.name} vs ${match.away.name}`,
            location: `${match.venue} (${match.court})`,
            start: match.time,
            end: endDate,
            uid: uuid(),
            created,
          });
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
