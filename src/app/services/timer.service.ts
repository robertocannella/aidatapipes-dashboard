import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';


interface TimerDocument {
  timeInMinutes: number
}

@Injectable({
  providedIn: 'root'
})


export class TimerService {

  private timerSub$: Subscription = new Subscription();

  constructor(public firestore: AngularFirestore) { }

  ngOnDestroy() {
    // Unsubscribe from the observable when the component is destroyed
    if (this.timerSub$) {
      this.timerSub$.unsubscribe();
    }
  }
  setTimer(time: number) {
    this.firestore.collection('sprinkler').doc('timer').set({ time });
  }
}
