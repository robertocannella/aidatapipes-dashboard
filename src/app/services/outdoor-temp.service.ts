import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OutdoorTempService {

  private BASE_URL = 'https://dbs.aidatapipes.com/api/tempreadings/';
  public lastOutdoorTempSubs$: any


  constructor(private http: HttpClient, public firestore: AngularFirestore) {

  }

  async getCurrentOutdoorTemperatureFB() {
    return this.firestore.collection('outdoortemps').doc('Stienhart_OUTDOOR').valueChanges();
  }
  getCurrentOutdoorTemperature() {
    return this.http.get<any[]>(this.BASE_URL + 'getCurrentOutdoorTemp/');
  }
  getLastXOutdoorTemps(value: number) {
    return this.http.get<any[]>(this.BASE_URL + 'getLastXOutdoorTemps/' + value);
  }
}
