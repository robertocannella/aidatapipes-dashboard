import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class OutdoorTempService {

  private BASE_URL = 'https://dbs.aidatapipes.com/api/tempreadings/';
  public lastOutdoorTempSubs$: any


  constructor(private http: HttpClient, public firestore: AngularFirestore) {

  }

  // async getCurrentOutdoorTemperatureFB() {
  //   return this.firestore.collection('outdoortemps').doc('Stienhart_OUTDOOR').snapshotChanges();
  // }

  getCurrentOutdoorTemperatureFB() {
    return this.firestore.collection('outdoortemps').snapshotChanges()
  }
  getCurrentOutdoorTemperature() {
    return this.http.get<any[]>(this.BASE_URL + 'getCurrentOutdoorTemp/');
  }

  async getLastXOutdoorTemps(value: number) {
    const $source = this.http.get<any[]>(this.BASE_URL + 'getLastXOutdoorTemps/' + value);
    const firstResult = await firstValueFrom($source);

    return firstResult;
  }
}
