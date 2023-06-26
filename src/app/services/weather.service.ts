import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Forecasts are divided into 2.5km grids. 
  // Each NWS office is responsible for a section of the grid. 
  // The API endpoint for the forecast at a specific grid is:
  // https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast


  // If you do not know the grid that correlates to your location, 
  // you can use the /points endpoint to retrieve the exact grid endpoint by coordinates:
  // https://api.weather.gov/points/{latitude},{longitude}


  // How to get latitude and longitude of an area
  private BASE_URL = 'https://api.weather.gov/';
  constructor(private httpClient: HttpClient) { }


}
