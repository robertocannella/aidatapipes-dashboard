import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SprinklerStatusService {


  public sprinklerStatusSubs$: any


  constructor( public firestore: AngularFirestore) {

  }


  getCurrentSprinklerStatus() {
    return this.firestore.collection('sprinkler').snapshotChanges()
  }

  setSprinklerStatus(isOn: boolean){
    this.firestore.collection('sprinkler').doc('main').set({isOn: isOn}); // error is here
  }
}
