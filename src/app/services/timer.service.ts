import {Injectable} from '@angular/core';
import {AngularFirestore, } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import {Subscription} from 'rxjs';


interface TimerDocument {
  timeInMinutes: number
}

@Injectable({
  providedIn: 'root'
})


export class TimerService {

  private timerSub$: Subscription = new Subscription();

  constructor(public firestore: AngularFirestore) {


  }

  ngOnDestroy() {
    // Unsubscribe from the observable when the component is destroyed
    if (this.timerSub$) {
      this.timerSub$.unsubscribe();
    }
  }
  setTimer(duration: number) {
    const currentTimestamp = firebase.firestore.Timestamp.now();

    // Convert the Timestamp to a JavaScript Date object
    const currentDate = currentTimestamp.toDate();

    // Add 20 minutes (20 * 60 * 1000 milliseconds)
    const futureDate = new Date(currentDate.getTime() + duration * 60 * 1000);

    // Convert the Date object back to a Firebase Timestamp
    const futureTimestamp = firebase.firestore.Timestamp.fromDate(futureDate);

    this.firestore.collection('sprinkler').doc('timer').set({duration});

    // Uncomment for full functionality.
    this.firestore.collection('sprinkler').doc('main').set({offTime: futureTimestamp, isOn: true, durationInMins: duration})
    // Log the future timestamp
    console.log("Current Timestamp:", currentTimestamp.toDate());
    console.log("Future Timestamp:", futureTimestamp.toDate());
  }
}
