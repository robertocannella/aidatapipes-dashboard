import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-outdoor-temp',
  templateUrl: './outdoor-temp.component.html',
  styleUrls: ['./outdoor-temp.component.scss']
})
export class OutdoorTempComponent implements OnInit {

  public margin = { top: 40, right: 10, bottom: 50, left: 75 };

  // graph attributes (not svg)
  public graphWidth = 400 - this.margin.left - this.margin.right; // svg container width
  public graphHeight = 100;

  ngOnInit(): void {
    this.buildSVG();
  }

  buildSVG() {
    let temperatureScale = d3.scaleLinear().domain([-20, 120]).range([0, this.graphWidth]);


    let axis1 = d3.axisBottom(temperatureScale)
      .ticks(5)
      .tickFormat(d => d + ' °F')
      .tickSizeOuter(25)
      .tickSizeInner(10)
      .tickPadding(35)


    let svg = d3.select('.app-outdoor-temp-canvas').append('svg')
      .attr('width', this.graphWidth + this.margin.left + this.margin.right)
      .attr('height', this.graphHeight + this.margin.top + this.margin.bottom)


    svg.append('g')
      .attr('id', 'app-outdoor-temp-x-axis')
      .attr('transform', 'translate(20,0)')
      .call(axis1)


  }

}
