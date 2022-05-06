import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { map } from 'rxjs';
import { OutdoorTempService } from '../services/outdoor-temp.service';


@Component({
  selector: 'app-svg-rescale',
  templateUrl: './svg-rescale.component.html',
  styleUrls: ['./svg-rescale.component.scss']
})
export class SvgRescaleComponent implements OnInit {

  MARGIN = { top: 30, right: 90, bottom: 50, left: 90 }
  Y_AXIS_OBJ = {
    label: 'Temperature  °F',
    orientationLeft: false
  }
  SELECTOR = 'app-svg-rescale';
  X_AXIS_LABEL = 'Time'

  w = 600
  h = 300
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
  constructor(public outdoorService: OutdoorTempService) { }

  buildSVG() {
    this.svg = d3.select(`div.${this.SELECTOR}-canvas`)
      .append('div')
      .attr('class', 'svg-container')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 600 300')
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
    //.tickFormat(d3.timeFormat("%b %Y"))


    // Axis group rendering
    this.xG = this.chart.append("g").attr("class", `${this.SELECTOR}-x-axis`)
      .attr("transform", `translate(${[0, this.height]})`);

    // Y-AXIS Conditional Formating
    if (!this.Y_AXIS_OBJ.orientationLeft) {
      this.axisY = d3.axisRight(this.scaleY)
        .tickPadding(this.tickBleed)
        .tickSizeOuter(0);

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

    // Scales domain configuratoon
    this.scaleY.domain([-20, 120])
    this.scaleX.domain(d3.extent(data, (d: any) => d3.isoParse(d.timeStamp)))

    this.axisX
    //.tickFormat((d: any) => d3.timeFormat(d.getMonth() == 0 ? "%Y" : "%b")(d));

    // Axis rendering
    this.xG.call(this.axisX);
    this.yG.call(this.axisY);

    // Line chart
    this.line
      .x((d: any) => this.scaleX(d3.isoParse(d.timeStamp)))
      .y((d: any) => this.scaleY(d.degreesFahrenheit));

    this.view.append("path")
      .attr("class", `${this.SELECTOR}-line`)
      .datum(data)
      .attr("d", this.line)
      .style("stroke", "cornflowerblue")
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
    this.line.x((d: any) => newScaleX(d3.isoParse(d.timeStamp)))
    d3.select(`.${this.SELECTOR}-line`)
      .datum(this.data)
      .attr("d", this.line)


  }

  ngOnInit(): void {

    this.buildSVG();
    this.outdoorService.getLastXOutdoorTemps(4).pipe(map((data: any) => {
      this.data = data;
      this.update(data);

    })).subscribe();
  }
  switchYAxisOrientation() {
    this.Y_AXIS_OBJ.orientationLeft = !this.Y_AXIS_OBJ.orientationLeft;
  }


}
