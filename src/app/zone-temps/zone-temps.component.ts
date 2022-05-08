//  ************ zone-temps.component.ts ****************************** //
//                                                                      //
//  A.I. DataPipes  - 05-04-2022 - Roberto Cannella                     //
//  Angular component which receives various inputs for D3.js chart.    //
//  SVG Graph to display current/historic readings of listed sensors    //
//                                                                      //
//                                                                      //
//  System Type: Forced Hot Water (PUMP)                                //
//                                                                      //
//  Input types:                                                        //
//      -- Return temperature of zone                                   //
//      -- Supply temperature of zone                                   //
//      -- Primary room sensor (Temperature/Humidity)                   //
//      -- Call for heat                                                //
//      -- Pump active state                                            //
//      -- Temp HIGH/LOW Alarm                                          //
//                                                                      //
//  ******************************************************************* //


//  ************ IMPORTS ********************************************** //
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { AfterContentInit } from '@angular/core';
import { HostListener } from '@angular/core';         // For window sizing
import { Component, OnInit } from '@angular/core';    // Angular Core
import { pipe } from 'rxjs';
import { map, switchMap } from 'rxjs';                           // RXJS
import { HydronicZoneService } from '../services/hydronic-zone.service';
import { OutdoorTempService } from '../services/outdoor-temp.service';  //For data
import { SystemService } from '../services/system.service';
import { HydronicZone } from './HydronicZone';


//  ************ DECORTATOR ******************************************* //
@Component({
  selector: 'app-zone-temps', // added to SELECTOR constant
  templateUrl: './zone-temps.component.html',
  styleUrls: ['./zone-temps.component.scss']
})


//  ************ CLASS  *********************************************** //
export class ZoneTempsComponent implements OnInit, AfterContentInit {


  //  ************ HOST EVENT LISTENERS ******************************* //
  //  
  //    
  //  Note: To use 'window.innerWidth' porperty, set the 'minium-scale=1' 
  //  attribute in meta tag.  The default is 'initial-scale=1'.  This will
  //  prevent the default zoom out behavior when switching from landscape
  //  to portrait mode on devices.
  //
  //  index.html:
  //  <meta name="viewport" content="width=device-width, minimum-scale=1">
  //  
  //  **************************************************************** //
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    //console.log(event);
  }


  // SVG PATH (line) Declarations
  private lineRT: any;            // Return Temperature
  private lineSP: any;            // Supply Temperature
  private lineRMTMP: any;         // Room Temperture     
  private lineRMHUM: any;         // Room Humidiy

  // SVG SHAPE Declarations
  private pumpActive: any;        // Pump active state
  private heatCall: any;          // Call for heat
  private lowAlarm: any;          // Low temperature alarm
  private highAlarm: any;         // High temperature alarm
  private tstatStates: any;       //holds tstat

  //  ************ DATA **************************************** //
  public data: any[] = [];
  public shared: any;
  public fsData: any[] = [];
  hydronicZone: HydronicZone;
  zones: HydronicZone[] = [];
  system: any;
  dummyItems: any = []             // to add delay component generation
  timer: any = []                 // timer for delay
  //  ************ CONSTRUCTOR **************************************** //
  constructor(
    public outdoor: OutdoorTempService,
    private systemService: SystemService) {
    this.hydronicZone = new HydronicZone();

  }
  async ngAfterContentInit() {


    // const tstats = (await this.hydroZn.getTstatStates(0.5, this.hydronicZone)).pipe(map((res: any) => {

    // }))
    //const roomtemps = (await this.hydroZn.getByDate(0.5, this.hydronicZone)).subscribe((res: any) => {

    //  this.fsData.push(res.rmTmpStates)
    //})
    // GET ROOM TEMPERTURES AS ARRAY ONLY 
    // * this needs to change to object retrieval
    //this.hydroZn.getByDat2(3).pipe( map(readings => {this.fsData.push(readings)})).subscribe();

    this.shared = this.fsData;
  }

  async ngOnInit() {

    const id = 'MEeFIW6GwQtv1X3Lo7Z2';
    const regex = new RegExp('^zone')

    this.systemService.getSystemById(id).subscribe((res: any) => {
      this.zones = []; // zones array must be cleared during each update 
      Object.keys(res[0]).filter((key: any) => {
        if (regex.test(key)) {
          this.zones.push(res['0'][key])
        }
      })
    });



    //  this.outdoor.getLastXOutdoorTemps(4).pipe(map((resp: any) => {
    //    this.data.push(resp)
    //  })).subscribe();
  }

}
