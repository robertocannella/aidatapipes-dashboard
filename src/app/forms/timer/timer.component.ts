import { Component } from '@angular/core';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  constructor(private timerService: TimerService) { }

  step: number = 0;
  time: number = 0;

  onSubmit(time: number): void {
    this.time = time;
    console.log(`User selected ${time} minutes`)
    this.timerService.setTimer(this.time)
    this.step = 2;
  }
  onInitTimer() {
    this.step = 1;
  }
  onOkay(): void {
    this.step = 0;
  }
  closeForm(): void {
    this.step = 0;
  }
}
