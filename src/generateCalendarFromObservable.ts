import { Observable, empty } from 'rxjs';
import ical from 'ical-generator';
import { uuid } from './helpers/uuid';

import { TeamSeason } from '@teamest/models/processed';

import ICalendarGenerationOptions from './ICalendarGeneratorOptions';
import { Event } from '@teamest/models/raw';
import getEventSummary from './helpers/getEventSummary';

const DEFAULT_DURATION_MINUTES = 60;

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
      (teamSeason) => {
        const { events } = teamSeason;
        events.forEach((event: Event) => {
          if (event.timezone && event.timezone !== timezone) {
            reject(
              `Event timezone ${event.timezone} does not match calendar timezone ${timezone} and conversion has not yet been implemented!`,
            );
          }
          const endDate = new Date(
            event.time.getTime() +
              minutesToMillis(event.duration || DEFAULT_DURATION_MINUTES),
          );
          cal.createEvent({
            summary: getEventSummary(event),
            location: `${event.venue} (${event.court})`,
            start: event.time,
            end: endDate,
            uid: uuid(),
            created,
          });
        });
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(cal.toString().replace(/\r/g, ''));
      },
    );
  });
}
