import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { QuerySnapshot } from 'firebase/firestore';
import { Observable, Subscription, map } from 'rxjs';

interface SprinklerOnDocument {
  isOn: boolean
}
export class Scheduler {
    eventName?: string | null
    onTime?: string | null
    frequency?: string | null
    hour?: string | null
    minute?: string | null
    ampm?: string | null
    duration?: string | null
  
}
export interface SchedulerGroup{
  eventDetails :{
    eventName?: string | null
    onTime?: string | null
    frequency?: string | null
    hour?: string | null
    minute?: string | null
    ampm?: string | null
    duration?: string | null
  }
}
@Injectable({
  providedIn: 'root'
})
export class SprinklerStatusService implements OnInit {


  private sprinklerStatusSubs$: Subscription = new Subscription();
  public currentState = false;

  constructor( public firestore: AngularFirestore) {
    
  }
  ngOnInit(){
   this.getValueOnce();

  }
  ngOnDestroy() {
    // Unsubscribe from the observable when the component is destroyed
    if (this.sprinklerStatusSubs$) {
      this.sprinklerStatusSubs$.unsubscribe();
    }
  }

  getCurrentSprinklerStatus():Observable<SprinklerOnDocument> {
    // Get the current value of the field
    let isOn = false;
    const currentValue$: Observable<any> = this.firestore
      .collection('sprinkler')
      .doc('main')
      .valueChanges();

    return currentValue$;

  }
  getValueOnce(): boolean {
    
    let isOn = false;
    this.firestore
      .collection<SprinklerOnDocument>('sprinkler')
      .doc('main')
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          // Document exists, retrieve the value
          isOn = doc.data()!.isOn
          console.log(isOn)

        } else {
          // Document does not exist
          console.log('Document does not exist.');
          throw new Error ('Document does not exist')
        }
      });
      return isOn;

  }
  setSprinklerStatus(isOn: boolean){
    this.firestore.collection('sprinkler').doc('main').set({isOn: isOn});
  }
  setSchedule(schedule: Scheduler){
    this.firestore.collection('sprinkler').doc('schedule').collection('events').doc(schedule.eventName as string).set({eventDetails: schedule})
  }
  getSchedules() {
    return this.firestore.collection('sprinkler').doc('schedule').collection('events').valueChanges();
  }
  deleteEvent(event: SchedulerGroup){
    return this.firestore.collection('sprinkler').doc('schedule').collection('events').doc(event.eventDetails.eventName as string).delete();
  }
}
