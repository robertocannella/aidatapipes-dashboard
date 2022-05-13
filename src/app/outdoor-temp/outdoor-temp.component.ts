import { Component, OnInit } from '@angular/core';
import { OutdoorTempService } from '../services/outdoor-temp.service';
import { map } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { OutdoorTemp } from './OutdoorTemp';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-outdoor-temp',
  templateUrl: './outdoor-temp.component.html',
  styleUrls: ['./outdoor-temp.component.scss']
})
export class OutdoorTempComponent implements OnInit, OnDestroy {

  index = 'outdoor-temp-1'
  lineColor = '#17fddf'
  temps: any[] = [];
  title = 'Outdoor Sensor'
  yLabel = 'Outdoor shade temperature'
  selector = 'app-outdoor-temp';
  currentTemperature$?: Subscription;
  currentTemperature: any;
  readyToRender = false;

  constructor(public outdoor: OutdoorTempService) {
    this.updateGraphData();
  }

  //
  //  Populate temps array with historical data
  //
  async updateGraphData() {
    await this.outdoor.getLastXOutdoorTemps(3).then((res) => {
      res.forEach(entry => {
        this.temps.push({ degF: entry.degreesFahrenheit, timeStamp: entry.timeStamp } as OutdoorTemp)
      })
    });
    this.readyToRender = true;
  }

  //
  // Listener for current temperature reading.
  //
  async ngOnInit() {
    this.currentTemperature$ = this.outdoor.getCurrentOutdoorTemperatureFB()
      .pipe(map((res: any) => {
        res.forEach((change: any) => {
          console.log(change.type)
          const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore
          this.currentTemperature = doc.degreesFahrenheit;
          this.temps.unshift({ degF: doc.degreesFahrenheit, timeStamp: doc.timeStamp })  // 

        });
      })
      ).subscribe();
  }

  //
  // Clean up
  //
  ngOnDestroy() {
    this.currentTemperature$!.unsubscribe();
  }

}

