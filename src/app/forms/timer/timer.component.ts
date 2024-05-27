import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {SprinklerStatusService} from 'src/app/services/sprinkler-status.service';
import {TimerService} from 'src/app/services/timer.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {StorageService} from 'src/app/services/storage.service';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})

export class TimerComponent {


  step: number = 0;
  duration: number = 0;
  timerRunning: boolean = false;
  offTime: any;
  subs$: Subscription = new Subscription();

  constructor(
    private timerService: TimerService,
    private sprinklerService: SprinklerStatusService,
    private storageService: StorageService
  ) {

    this.subs$ = this.sprinklerService.getCurrentSprinklerStatus().subscribe((data: any) => {
      this.timerRunning = data.durationInMins ? true : false;
      this.offTime = data.offTime ? data.offTime.toDate().toLocaleTimeString() : '';
    });


  }
  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
  }

  onSubmit(time: number): void {
    this.duration = time;
    console.log(`User selected ${this.duration} minutes`)
    this.timerService.setTimer(this.duration)
    this.appendFile('Time: ' + Date.now() + '\t' + 'Status: ' + true + '\n');
    this.step = 2;
  }
  appendFile(content: string) {
    this.storageService.appendFile(content);
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
