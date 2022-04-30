import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OutdoorTempService {

  private BASE_URL = 'http://dbs.aidatapipes.com:3200/api/tempreadings/';
  private response: any;
  constructor(private http: HttpClient) {

  }

  getCurrentOutdoorTemperature() {
    return this.http.get<any[]>(this.BASE_URL + '/getCurrentOudoorTemp')
  }
}
