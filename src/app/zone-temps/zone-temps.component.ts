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
import { HostListener } from '@angular/core';         // For window sizing
import { Component, OnInit } from '@angular/core';    // Angular Core
import * as d3 from 'd3';                             // DJ.js
import { map } from 'rxjs';                           // RXJS
import { OutdoorTempService } from '../services/outdoor-temp.service';  //For data


//  ************ DECORTATOR ******************************************* //
@Component({
  selector: 'app-zone-temps', // added to SELECTOR constant
  templateUrl: './zone-temps.component.html',
  styleUrls: ['./zone-temps.component.scss']
})


//  ************ CLASS  *********************************************** //
export class ZoneTempsComponent implements OnInit {


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
    this.resizeGraph(event);
  }


  //  ************ CONSTANTS ****************************************** //
  private INNER_WIDTH;                // For custom graph sizing
  public SELECTOR;      // For class-name distinction
  public SVG_SELECTOR;

  //  ************ SVG CONTAINER ************************************** //
  private MARGIN =
    { top: 10, right: 50, bottom: 30, left: 30 };      // Default margins 
  private SVG_PADDING;                                 // For auto width sizing calcs 
  private VIEW_HEIGHT;                                 // Actual view height
  private VIEW_WIDTH;                                  // Actual view Width
  private SVG_WIDTH;                                   // View width plus margins
  private SVG_HEIGHT;                                  // View height plus margins

  //  ************ D3.js  ********************************************* //
  // SVG Declartaions
  private SVG: any;             // Main SVG Element

  // AXIS Declarations
  private xScale: any;          // X Domain (time scale)
  private xAxis: any;           // For x axis
  private yScale: any;          // Y Domain (temperature scale)
  private yAxis: any;           // For y axis
  private xGroup: any;          // For x axis group
  private yGroup: any;          // For y axis group

  // D3 ZOOM Declarations
  private d3Zoom: any;
  private extent: any;
  private tExtent: any;

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


  //  ************ DATA **************************************** //
  public data;

  //  ************ CONSTRUCTOR **************************************** //
  constructor(public outdoor: OutdoorTempService) {
    this.INNER_WIDTH = window.innerWidth;
    this.SVG_PADDING = (this.INNER_WIDTH < 400) ? .10 : .25;
    this.VIEW_HEIGHT = 260;
    this.VIEW_WIDTH = (innerWidth - this.MARGIN.left - this.MARGIN.right) -
      (this.INNER_WIDTH * this.SVG_PADDING);
    this.SVG_WIDTH = this.VIEW_WIDTH + this.MARGIN.left + this.MARGIN.right;
    this.SVG_HEIGHT = this.VIEW_HEIGHT + this.MARGIN.top + this.MARGIN.bottom;
    this.SELECTOR = 'app-zone-temps';                 // For class-name distinction
    this.SVG_SELECTOR = `${this.SELECTOR}-canvas`;
    this.data = this.outdoor.getLastXOutdoorTemps(4);
    this.extent = [[0, 0], [600, 300]]; // [[topLeftCorner],[bottomRightCorner]]
    this.tExtent = [[0, 0], [583, 300]]; // [[topLeftCorner],[bottomRightCorner]]

  }

  //  ************ Build SVG HERE ************************************* //

  buildSVG(data: any) {

    // handle zooming behavior here
    this.d3Zoom = d3.zoom<SVGSVGElement, unknown>()
      .translateExtent(this.tExtent)
      .scaleExtent([1, 5])
      .extent(this.extent)

    // set the x-axis domain (timeStampEarliest ~ timeStampLatest)
    this.xScale = d3.scaleTime()
      .domain(d3.extent(data, (d: any) => d3.isoParse(d.timeStamp)) as Iterable<number>)
      .range([0, 500])

    // set the y-axis domain (-20F ~ 120F ) *!!! adjust during times of GLOBAL WARMING!!!
    this.yScale = d3.scaleLinear().domain([120, -20]).range([0, this.SVG_HEIGHT]);
    this.SVG = d3.select('#chartId')
      .append('div')
      .attr('class', 'svg-container')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 600 300')
      .classed('svg-content-responsive', true)
      .call(this.d3Zoom
        .on("zoom", (event: any) => this.zoomed(event, data)))


    this.SVG.append("defs")
      .append("clipPath").attr("id", "chart2")
      .append("rect")
      .attr("width", 500)
      .attr("height", 300)
    //.attr('transform', `translate(${this.MARGIN.left},0)`)


    const chart2 = this.SVG.append("g")
      .attr("class", "zone-chart")

    //.attr("transform", `translate(${[this.MARGIN.left, this.MARGIN.top]})`);
    // Generate the line based on X=TIME, Y=TEMPERATURE
    this.lineRMTMP = d3.line()
      .x((d: any) => this.xScale(d3.isoParse(d.timeStamp)))
      .y((d: any) => this.yScale(d.degreesFahrenheit));

    // The zoomable view
    // All elements in this object will be zoomed
    const view2 = this.SVG
      .append('g')
      .attr("clip-path", "url(#chart2)")
      .append('path')

      .datum(data)
      .attr("fill", "none")
      .attr('class', `line-${this.SELECTOR}`)
      .attr("stroke", "teal")
      .attr("stroke-width", 2)
      .attr("d", this.lineRMTMP)
    //.attr('transform', `translate(${this.MARGIN.left},0)`)


    this.xAxis = d3.axisBottom(this.xScale).ticks(5);
    this.yAxis = d3.axisRight(this.yScale);

    this.xGroup = this.SVG.append('g')
      .attr('class', `${this.SELECTOR}-x-axis`)
      .attr('transform', `translate(0,${this.SVG_HEIGHT - this.MARGIN.bottom - this.MARGIN.top})`)
      .call(this.xAxis)

    this.yGroup = this.SVG.append('g').call(this.yAxis)
      .attr('class', `${this.SELECTOR}-y-axis`)
      .attr('transform', `translate(550,0)`)
      .call(this.yAxis)

  }
  zoomed(event: any, data: any) {

    const t = event.transform;

    // set new scale
    const newScaleX = t.rescaleX(this.xScale)

    // handle x-axis semantic zoom
    this.xAxis.scale(newScaleX);
    this.xGroup.call(this.xAxis)

    // handle line semantic zoom
    const line = d3.select(`.line-${this.SELECTOR}`);
    this.lineRMTMP.x((d: any) => newScaleX(d3.isoParse(d.timeStamp)))
    line.datum(data).attr("d", this.lineRMTMP)

    // const graphBox = this.SVG.node().getBBox();
    // const margin = 17;

    // const worldTopLeft = [graphBox.x - margin, graphBox.y - margin];
    // const worldBottomRight = [
    //   graphBox.x + graphBox.width + margin,
    //   graphBox.y + graphBox.height + margin
    // ];

    // console.log('x: ', graphBox.x)
    // console.log('w: ', graphBox.width)
    // console.log('x+w: ', parseInt(graphBox.x) + parseInt(graphBox.width))
    // this.d3Zoom.translateExtent([[0, 0], [worldBottomRight[0], 0]]);
    // this.d3Zoom.extent([[0, 0], [worldBottomRight[0], 0]]);

  }
  resizeGraph(event: any) {

  }
  ngOnInit(): void {
    this.outdoor.getLastXOutdoorTemps(4).pipe(map((data: any) => {
      this.buildSVG(data);
    })).subscribe();
  }

}
