import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private firestore: AngularFirestore) { }

  // data and firestore
  getSystemById(id: string): Observable<any[]> {
    return this.firestore.collection('systems', (ref: any | undefined) => ref.where('__name__', '==', id)).snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map((a: any) => {
            const object = a.payload.doc.data();
            object.id = a.payload.doc.id;
            return object;
          })
        }));
  }
}
