//  ************ zone-temps.component.ts ****************************** //
//                                                                      //
//  Angular component which receives various inputs for SVG display.    //
//  SVG Graph to display current/historic readings of listed sensors    //
//  05-04-2022 - Roberto Cannella                                       //
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
import { HostListener } from '@angular/core';       // For window sizing
import { Component, OnInit } from '@angular/core';  // Angular Core
import { AnyForUntypedForms } from '@angular/forms';
import * as d3 from 'd3';                           // DJ.js


//  ************ DECORTATOR ******************************************* //
@Component({
  selector: 'app-zone-temps', // added to SELECTOR constant
  templateUrl: './zone-temps.component.html',
  styleUrls: ['./zone-temps.component.scss']
})


//  ************ CLASS  *********************************************** //
export class ZoneTempsComponent implements OnInit {


  //  ************ HOST EVENT LISTENER ******************************** //
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.INNER_WIDTH = window.innerWidth;
  }


  //  ************ CONSTANTS ****************************************** //
  private INNER_WIDTH: number = 0;                // For custom graph sizing
  public SELECTOR: string = 'app-zone-temps'      // For class-name distinction


  //  ************ SVG CONTAINER ************************************** //
  private MARGIN =
    { top: 10, right: 30, bottom: 30, left: 50 };      // Default margins 
  private WIDTH_REDUCE_PCT = .25;                      // For auto width sizing calcs      
  private VIEW_HEIGHT = 260;                           // Actual view height
  private VIEW_WIDTH =                                 // Actual view Width
    (this.INNER_WIDTH - this.MARGIN.left - this.MARGIN.right)
    - (this.INNER_WIDTH * this.WIDTH_REDUCE_PCT);

  private SVG_WIDTH = this.VIEW_WIDTH + this.MARGIN.left + this.MARGIN.right;
  private SVG_HEIGHT = this.VIEW_HEIGHT + this.MARGIN.top + this.MARGIN.bottom;
  private SVG_INNER_WIDTH = this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right;
  private SVG_INNER_HEIGHT = this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.bottom;

  //  ************ D3.js  ********************************************* //
  // SVG Declartaions
  private SVG: any;             // Main SVG Element

  // AXIS Declarations
  private xScale: any;          // X Domain (time scale)
  private xAxis: any;           // For x axis
  private yAxis: any;           // For y axis
  private xGroup: any;          // For x axis group
  private yGroup: any;          // For y axis group

  // D3 ZOOM Declarations
  private d3Zoom: any;
  private extent: any;

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


  //  ************ HTML Template Bindings  **************************** //

  constructor() { }


  ngOnInit(): void {
    this.INNER_WIDTH = window.innerWidth; // 
  }

}
