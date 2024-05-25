import { Component, Input } from '@angular/core';
import { Schedule } from 'firebase-functions/v1';
import { Scheduler, SchedulerGroup, SprinklerStatusService } from 'src/app/services/sprinkler-status.service';


@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})


export class ScheduleListComponent {
@Input()events!:SchedulerGroup[];

constructor(private sp: SprinklerStatusService){}
currentEvent!: SchedulerGroup;
showDialog = false;

  onDelete(event: SchedulerGroup){

    this.showDialog = false;

    this.events = this.events.filter((ev:SchedulerGroup) => ev.eventDetails.eventName != event.eventDetails.eventName)
    this.sp.deleteEvent(event)
  }

  closeModal(){
    this.showDialog = false;
  }
  onShowDialog(event: SchedulerGroup){
    this.showDialog = true;
    this.currentEvent = event;

 }
}

