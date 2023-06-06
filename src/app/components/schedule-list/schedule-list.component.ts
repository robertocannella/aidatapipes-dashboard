import { Component, Input } from '@angular/core';
import { Scheduler, SchedulerGroup, SprinklerStatusService } from 'src/app/services/sprinkler-status.service';


@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})

export class ScheduleListComponent {
@Input()events!:SchedulerGroup[];

constructor(private sp: SprinklerStatusService){}

  onDelete(event: SchedulerGroup){
    this.events = this.events.filter((ev:SchedulerGroup) => ev.eventDetails.eventName != event.eventDetails.eventName)
    this.sp.deleteEvent(event)
  }
}

