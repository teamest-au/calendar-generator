import { Event } from "@teamest/models/raw";
import { EventGuards } from '@teamest/models/helpers';

export default function getEventSummary(event: Event): string {
  if(EventGuards.isMatch(event)) {
    return `${event.home.name} vs ${event.away.name}`;
  } else if (EventGuards.isDuty(event)) {
    return `DUTY (${event.home?.name || 'unknown'} vs ${event.away?.name || 'unknown'})`;
  }
  return 'Other Event';
}
