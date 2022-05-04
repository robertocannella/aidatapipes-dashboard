import { Component, OnInit } from '@angular/core';
import { OutdoorTempService } from '../services/outdoor-temp.service';
import * as d3 from 'd3';
import { map } from 'rxjs';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-outdoor-temp',
  templateUrl: './outdoor-temp.component.html',
  styleUrls: ['./outdoor-temp.component.scss']
})
export class OutdoorTempComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  selector = 'app-outdoor-temp';
  currentTemperature$: any;
  currentTemperature: any;
  innerWidth: any;

  // graph attributes (not svg)
  data: any;
  margin = { top: 10, right: 30, bottom: 30, left: 50 };
  graphWidth = 460 + this.margin.left + this.margin.right;
  graphHeight = 260 + this.margin.top + this.margin.bottom;
  firebaseError = false;
  xScale: any;
  axisX: any;
  axisY: any;
  xG: any;
  yG: any;
  line: any;
  svg: any;
  d3zoom: any;
  extent: any;
  public showChart: boolean = true;
  show = true;



  constructor(public outdoor: OutdoorTempService) {

  }

  buildSVG(data: any) {

    // set graph width based on current width of device
    const svgArea = (this.innerWidth - this.margin.right - this.margin.left) - (this.innerWidth * .25);
    this.graphWidth = svgArea + this.margin.left + this.margin.right;
    this.extent = [[0, 0], [this.graphWidth - (this.margin.right + this.margin.left), this.graphHeight]]; // [[topLeftCorner],[bottomRightCorner]]

    // handle zooming behavior here
    this.d3zoom = d3.zoom<SVGSVGElement, unknown>()
      .translateExtent(this.extent)
      .scaleExtent([1, 5])
      .extent(this.extent)
    // : (this.innerWidth - (this.margin.left + this.margin.right))

    // set the x-axis domain (timeStampEarliest ~ timeStampLatest)
    this.xScale = d3.scaleTime()
      .domain(d3.extent(data, (d: any) => {
        //console.log(new Date(d.timeStamp))
        return new Date(d.timeStamp)
      }
      ) as Iterable<number>)
      .range([-this.margin.left, this.graphWidth - this.margin.right - this.margin.left])

    // set the y-axis domain (-20F ~ 120F ) *!!! adjust during times of GLOBAL WARMING!!!
    let temperatureScale = d3.scaleLinear().domain([120, -20]).range([0, this.graphHeight]);


    // configure x-axis line
    this.axisX = d3.axisBottom(this.xScale)
      .ticks(3)
      .tickSizeOuter(5)
      .tickSizeInner(5)
      .tickPadding(5)

    // configure y-axis line
    this.axisY = d3.axisRight(temperatureScale)
      .ticks(5)
      .tickFormat(d => {
        //console.log(d)
        return d + ' °F'
      })
      .tickSizeOuter(5)
      .tickSizeInner(5)
      .tickPadding(5)


    // configure main SVG element
    this.svg = d3.select('.app-outdoor-temp-canvas')
      .append("svg")
      .attr("width", this.graphWidth + this.margin.left + this.margin.right)
      .attr("height", this.graphHeight + this.margin.top + this.margin.bottom)
      .call(this.d3zoom
        .on("zoom", (event: any) => this.zoomed(event, data)))


    // for clip-path attribute
    const clipPath = this.svg
      .append("defs")
      .append("clipPath").attr("id", "chart")
      .append("rect")
      .attr("width", this.graphWidth - this.margin.right)
      .attr("height", this.graphHeight)


    // chart portion of SVG element    
    const chart = this.svg.append('g')
      .append("g")
      .attr(`transform`, `translate(${this.margin.right},${this.margin.top})`)


    // Generate the line based on X=TIME, Y=TEMPERATURE
    this.line = d3.line()
      .x((d: any) => {
        return this.xScale(d.timeStamp);
      })
      .y((d: any) => {
        return temperatureScale(d.degreesFahrenheit)
      })

    chart
      .append('g')
      .attr("clip-path", "url(#chart)")
      .append('path')
      .datum(data)
      .attr("fill", "none")
      .attr('class', `line-${this.selector}`)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", this.line)
      .attr('transform', `translate(${this.margin.left},0)`)

    this.xG = chart.append('g')
      .attr('class', `x-axis-${this.selector}`)
      .attr('id', 'app-outdoor-temp-x-axis')
      .attr("transform", `translate(${this.margin.left},${this.graphHeight})`) // move to bottom * default is top
      .call(this.axisX)


    this.yG = chart.append('g')
      .attr('class', `y-axis-${this.selector}`)
      .attr('id', 'app-outdoor-temp-x-axis')
      .attr('transform', `translate(${this.graphWidth - this.margin.right}, 0)`)
      .call(this.axisY);


  }

  zoomed(event: any, data: any) {

    const t = event.transform;

    // set new scale
    const newScaleX = t.rescaleX(this.xScale)

    // handle x-axis semantic zoom
    this.axisX.scale(newScaleX);
    this.xG.call(this.axisX)

    // handle line semantic zoom
    const line = d3.select(`.line-${this.selector}`);
    this.line.x((d: any) => newScaleX(d3.isoParse(d.timeStamp)))
    line.datum(data).attr("d", this.line)
    //.attr("clip-path", "url(#chart)")
  }

  resetted() {
    this.svg.transition()
      .duration(750)
      .call(this.d3zoom.transform, d3.zoomIdentity);
  }

  async ngOnInit() {
    // set innerWidth poperty upon initialization
    this.innerWidth = window.innerWidth;

    this.currentTemperature$ = (await this.outdoor.getCurrentOutdoorTemperatureFB()).pipe(map((res: any) => {
      if (res)
        return res.degreesFahrenheit
      else
        return null;
    }));
    // set backup tempreading
    this.outdoor.getCurrentOutdoorTemperature().subscribe((data: any) => {
      this.currentTemperature = data.degreesFahrenheit;
    });
    this.outdoor.getLastXOutdoorTemps(4).subscribe((data: any) => {
      //  Store all JSON Data for local filtering.
      this.buildSVG(data)

    });

  }
  toggleChart() {
    this.showChart = !this.showChart;
    this.buildSVG(this.data);
    console.log(this.showChart)
  }
}


