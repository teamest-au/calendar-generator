import { from } from 'rxjs';

import { TeamSeason } from '@vcalendars/models/processed';

import generateCalendarFromObservable from './generateCalendarFromObservable';
import ICalendarGenerationOptions from './ICalendarGeneratorOptions';

export default async function generateCalendarFromArray(
  teamSeasons: Array<TeamSeason>,
  options: ICalendarGenerationOptions,
): Promise<string> {
  return generateCalendarFromObservable(from(teamSeasons), options);
}
