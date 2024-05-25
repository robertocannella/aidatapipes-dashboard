import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class GeoService {
  private BASE_URL = 'https://us1.locationiq.com/v1'
  constructor(private httpClient: HttpClient) { }
}
