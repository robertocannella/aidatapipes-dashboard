import { Component } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {
  scheduleData = {
    eventName: 'Event Name',
    onTime: '2023-06-04T10:00:00',
    offTime: '2023-06-04T12:00:00',
    // Include any other relevant fields
  };

  updateSchedule() {
    // Perform any necessary logic with the updated schedule data
    console.log('Updated schedule:', this.scheduleData);
  }
}
