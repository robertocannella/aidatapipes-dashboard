import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  step: number = 0;
  time: number = 0;

  onSubmit(time: number): void {
    this.time = time;
    console.log(`User selected ${time} minutes`)
    this.step = 2;
  }
  onInitTimer() {
    this.step = 1;
    // console.log(this.users)
  }
  onOkay(): void {
    this.step = 0;
  }
  closeForm(): void {
    this.step = 0;
  }
}
