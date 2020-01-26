import { from } from 'rxjs';

import { Match } from '@vcalendars/models';

import generateCalendarFromObservable from './generateCalendarFromObservable';
import ICalendarGenerationOptions from './ICalendarGeneratorOptions';

export default async function generateCalendarFromArray(
  matches: Array<Match>,
  options: ICalendarGenerationOptions,
  duties: Array<Match> = [],
): Promise<string> {
  return generateCalendarFromObservable(from(matches), options, from(duties));
}
