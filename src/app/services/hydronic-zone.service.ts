import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HydronicZone, RMTMPState, TstatState } from '../zone-temps/HydronicZone';

@Injectable({
  providedIn: 'root'
})
export class HydronicZoneService {

  tStatData$?: Subscription;
  subs$?: any;
  tStatData: any;
  dateData: any;
  data: any;


  constructor(private firestore: AngularFirestore) { }

  async getTstatStates(daysAgo: number, hydronicZone?: HydronicZone) {
    const numberOfDays = this.getDaysAgo(new Date(), daysAgo);

    return this.firestore.collection('zones').doc('zone1').collection<any>('readings', (ref: any | undefined) => ref.where('timeStamp', '>', numberOfDays))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((items: any) => {
          if (typeof hydronicZone === 'undefined') {
            const hydronicZone = new HydronicZone()
            hydronicZone.tstatStates.push(items as TstatState)
          } else
            hydronicZone.tstatStates.push(items as TstatState)
          return hydronicZone;
        })
      )
  }
  async getTstatStatus(daysAgo: number) {
    const numberOfDays = this.getDaysAgo(new Date(), daysAgo);
    this.tStatData$ = this.firestore.collection('zones').doc('zone1').collection('readings', (ref: any | undefined) => ref.where('timeStamp', '>', numberOfDays))
      .stateChanges().pipe(map((res: any) => {
        res.forEach((change: any) => {
          const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore

          //console.log(change.type)
          switch (change.type) {
            case 'added':
              if (doc.systemOn)
                this.tStatData.push(doc)
              break;
            case 'modified':
              const index = this.tStatData.findIndex((item: any) => item.id == doc.id) // get the item from data []
              this.tStatData[index] = doc; // overwrite old element with the modified one
              break;
            case 'removed':
              this.tStatData = this.tStatData.filter((item: any) => item.id !== doc.id) // filter out the removed element as new array
              break;
            default: // default case required
              break;
          }
        });
        //this.updateTstatData(this.tStatData);
        //this.update(this.data)
      })
      ).subscribe()

  }

  getByDat2(daysAgo: number): Observable<any[]> {
    const numberOfDays = this.getDaysAgo(new Date(), daysAgo);

    return this.firestore.collection('datapipes', (ref: any | undefined) => ref.where('timeStamp', '>', numberOfDays)).snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map((a: any) => {
            const object = a.payload.doc.data();
            object.id = a.payload.doc.id;
            return object;
          });
        }))
  }

  // data and firestore
  getZoneById(id: string): Observable<any[]> {
    return this.firestore.collection('systems', (ref: any | undefined) => ref.where('__name__', '==', id)).snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map((a: any) => {
            const object = a.payload.doc.data();
            object.id = a.payload.doc.id;
            console.log('executing get')
            return object;
          })
        }));
  }

  getData() {
    // StateChanges allows use of added|modified|removed
    this.subs$ = this.firestore.collection('datapipes')
      .stateChanges().pipe(map((res: any) => {
        res.forEach((change: any) => {
          const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore

          //console.log(change.type)
          switch (change.type) {
            case 'added':
              this.data.push(doc)
              break;
            case 'modified':
              const index = this.data.findIndex((item: any) => item.id == doc.id) // get the item from data []
              this.data[index] = doc; // overwrite old element with the modified one
              break;
            case 'removed':
              this.data = this.data.filter((item: any) => item.id !== doc.id) // filter out the removed element as new array
              break;
            default: // default case required
              break;
          }
        });
      }))
  }

  getDaysAgo(date: Date, days: number) {
    var pastDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
    return pastDate;
  }
}
