import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';

interface SprinklerOnDocument {
  isOn: boolean
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
}
