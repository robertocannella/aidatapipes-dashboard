import { ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { collectionSnapshots } from '@angular/fire/firestore';
import * as d3 from 'd3';
import { select, stratify } from 'd3';
import { BehaviorSubject, map } from 'rxjs';
import { OutdoorTempService } from '../services/outdoor-temp.service';
import { HydronicZone, RMTMPState } from '../zone-temps/HydronicZone';


@Component({
  selector: 'app-svg-rescale',
  templateUrl: './svg-rescale.component.html',
  styleUrls: ['./svg-rescale.component.scss']
})
export class SvgRescaleComponent implements OnInit {

  @Input() inputData?: any;
  @Input() index?: any;
  @Input('line-color') lineColor!: string
  @Input() title?: string;
  @Input('y-label') yLabel?: string;


  MARGIN = { top: 30, right: 60, bottom: 50, left: 20 }
  Y_AXIS_OBJ = {
    label: 'Temperature  °F',
    orientationLeft: false,
    ticks: 5
  }
  SELECTOR = `app-svg-rescale`;
  X_AXIS_LABEL = 'Time'



  w = 500     // keep aspect ratio 2-1 
  h = 250
  m = 50;
  width = this.w - this.MARGIN.left - this.MARGIN.right;
  height = this.h - this.MARGIN.top - this.MARGIN.bottom;
  labelPadding = this.m - 5
  tickBleed = 5;
  svg: any;
  chart: any;
  view: any;
  line: any;
  scaleX: any;
  scaleY: any;
  axisX: any;
  axisY: any;
  xG: any;
  yG: any;
  extent: any;
  d3Zoom: any;
  data: any;


  constructor(public outdoorService: OutdoorTempService) {
  }


  buildSVG() {
    this.svg = d3.select(`.app-svg-rescale-${this.index}`)
      .append('div')
      .attr('class', 'svg-container')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${this.w} ${this.h}`)
      .classed('svg-content-responsive', true)

    // Clipping path to use in zoomable view
    this.svg.append("defs")
      .append("clipPath").attr("id", `${this.SELECTOR}-chart`)
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    // The chart in the SVG
    // All elements are added to this object
    this.chart = this.svg.append("g")
      .attr("transform", `translate(${[this.MARGIN.left, this.MARGIN.top]})`);

    // The zoomable view
    // All elements in this object will be zoomed
    this.view = this.chart.append("g")
      .attr("class", `${this.SELECTOR}-view`)
      .attr("clip-path", `url(#${this.SELECTOR}-chart)`)
      .append("g") // the clipped zoomable object

    this.line = d3.line();

    // Scales configuratoon
    this.scaleY = d3.scaleLinear().range([this.height, 0]);
    this.scaleX = d3.scaleTime().range([0, this.width]);

    // Axis configuration
    this.axisX = d3.axisBottom(this.scaleX) // this scale doesn't implement ticks!
      .tickPadding(5)
      .ticks(5)
    //.tickFormat(d3.timeFormat("%b %Y"))


    // Axis group rendering
    this.xG = this.chart.append("g").attr("class", `${this.SELECTOR}-x-axis`)
      .attr("transform", `translate(${[0, this.height]})`);

    // Y-AXIS Conditional Formating
    if (!this.Y_AXIS_OBJ.orientationLeft) {
      this.axisY = d3.axisRight(this.scaleY)
        .tickPadding(this.tickBleed)
        .tickSizeOuter(0)
        .ticks(this.Y_AXIS_OBJ.ticks)

      this.yG = this.chart.append("g")
        .attr("class", `${this.SELECTOR}-y-axis`)
        .attr("transform", `translate(${[this.width, 0]})`);

      this.yG.append("text")
        .attr("class", "label")
        .text(`${this.Y_AXIS_OBJ.label}`)
        .attr("transform", `translate(${[this.labelPadding, (this.height / 2)]}) rotate(90)`)
    } else {
      this.axisY = d3.axisLeft(this.scaleY)
        .tickPadding(this.tickBleed)
        .tickSizeOuter(0);

      this.yG = this.chart.append("g")
        .attr("class", `${this.SELECTOR}-y-axis`)

      this.yG.append("text")
        .attr("class", "label")
        .text(`${this.Y_AXIS_OBJ.label}`)
        .attr("transform", `translate(${[-this.labelPadding, (this.height / 2)]}) rotate(90)`)
    }


    this.xG.append("text")
      .attr("class", "label")
      .text(`${this.X_AXIS_LABEL}`)
      .attr("transform", `translate(${[(this.width / 2), this.labelPadding]})`)
      .style("font-size", "30px");


    // Zoom configuration
    this.extent = [[0, 0], [this.width, this.height]];
    this.d3Zoom = d3.zoom()
      .scaleExtent([1, 100])
      .extent(this.extent)
      .translateExtent(this.extent)

    this.svg
      .call(this.d3Zoom
        .on("zoom", (event: any) => this.zoomed(event)))
  }

  update(data: any) {
    //console.log(this.inputData[0])

    // ******************** AXES DOMAIN CONFIGURATIONS ***********//
    // Scales domain configuratoon
    // this.scaleY.domain([-20, 120])
    // this.scaleX.domain(d3.extent(data, (d: any) => d3.isoParse(d.timeStamp)))

    // set scale domains
    //this.scaleX.domain(d3.extent(data, (d: any) => new Date(d.timeStamp.seconds * 1000)) as Iterable<number>); // returns earliest and latest date
    //this.scaleY.domain(d3.extent(data, (d: any) => d.temperatureF) as Iterable<number>); // returns 0 and longest distance

    // get extents and range (no timestamp)
    //const xExtent: any = d3.extent(data, (d: any) => d.timeStamp.seconds * 1000) as Iterable<number>;
    // const yExtent: any = d3.extent(data, (d: any) => d.temperatureF) as Iterable<number>;



    const xExtent: any = d3.extent(data, (d: any) => d.timeStamp) as Iterable<number>;
    const yExtent: any = d3.extent(data, (d: any) => d.degF) as Iterable<number>;

    const xRange = xExtent[1] - xExtent[0]
    const yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.scaleX.domain([xExtent[0], xExtent[1]]);
    this.scaleY.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]); // Add padding for line

    // Line chart domains
    this.line
      .x((d: any) => this.scaleX(d.timeStamp) as Iterable<number>)
      .y((d: any) => this.scaleY(d.degF));

    // ************************ 

    this.axisX
    //.tickFormat((d: any) => d3.timeFormat(d.getMonth() == 0 ? "%Y" : "%b")(d));

    // Axis rendering
    this.xG.call(this.axisX);
    this.yG.call(this.axisY);


    //console.log(`${this.SELECTOR}-line${this.index}`)

    this.view.append("path")
      .attr("class", `${this.SELECTOR}-line${this.index}`)
      .join()
      .datum(data)
      .attr("d", this.line)
      .style("stroke", this.lineColor)
      .style("stroke-width", 2)
      .style("fill", "none");
  }
  zoomed(event: any) {
    const t = event.transform;

    // rescale scales and axes
    const newScaleX = t.rescaleX(this.scaleX)
    this.axisX.scale(newScaleX);
    this.axisX
      .ticks(5)
    //.tickFormat((d: any) => d3.timeFormat(d.getMonth() == 0 ? "%Y" : "%b")(d));
    this.xG.call(this.axisX);

    // rescale horizontal scale for line chart
    this.line.x((d: any) => newScaleX(d.timeStamp) as Iterable<number>)

    d3.select(`.${this.SELECTOR}-line${this.index}`)
      .datum(this.data)
      .attr("d", this.line)
  }
  fromChildChangeColor(newColor: any) {
    this.lineColor = newColor;
    const line = d3.select(`.${this.SELECTOR}-line${this.index}`)
    line.style('stroke', this.lineColor)
  }
  changeLineColor(newColor: any) {
    const line = d3.select(`.${this.SELECTOR}-line${this.index}`)
    line.style('stroke', this.lineColor)
  }

  ngOnInit() {
    // Set the local data variable from parent component
    this.data = this.inputData;

    // Uniquelly identify this child's svg components
    const canvas = d3.select('div.app-rescale-svg-canvas')
    canvas
      .attr('class', `app-svg-rescale-${this.index}`)

    const line = d3.select(`.${this.SELECTOR}-line`)
    line
      .attr('class', `${this.SELECTOR}-line${this.index}`)

    // Build the SVG and update
    this.buildSVG();
    this.update(this.inputData)
  }

}
