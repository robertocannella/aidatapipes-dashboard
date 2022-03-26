import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import * as d3 from 'd3';
import { map, Subscription } from 'rxjs';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ai-datapipes';
  public data: any[] = [];
  public activity = 'sensor1';
  public svg: any;
  public graph: any;
  public xAxisGroup: any;
  public yAxisGroup: any;
  public path: any;
  public xLine: any;
  public yLine: any;
  public dottedLines: any;
  public subs$: any;
  public dateData: any;
  public currentLookBack: any;
  //items: Observable<any[]>;
  constructor(public firestore: AngularFirestore) {
    //this.items = firestore.collection('datapipes').valueChanges();
  }
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(event?: any) {
  //   console.log(event)
  //   if (window.scrollX == 0) {
  //     //this.graph.nodes()[0].setAttribute("transform", "translate(200, " + 10 + ")")
  //   }
  //   if (window.scrollX > 0) {
  //     console.log(window.scrollX)
  //     this.path.attr(`transform, translate(${window.scrollX},0)`)
  //   }
  // }
  // @HostListener('window:touchmove', ['$event'])
  // onTouchMove(event?: any) {
  //   console.log(event)
  //   if (window.scrollX == 0) {
  //     //this.graph.nodes()[0].setAttribute("transform", "translate(200, " + 10 + ")")
  //   }
  //   if (window.scrollX > 0) {
  //     console.log(window.scrollX)
  //     this.path.attr(`transform, translate(${window.scrollX},0)`)
  //   }
  // }
  ngOnInit() {
    this.buildSVG();
    // this.getData();
    this.getByDate(7);
  }

  // Margins + Dimensions
  public margin = { top: 40, right: 20, bottom: 50, left: 100 };

  // graph attributes (not svg)
  public graphWidth = 560 - this.margin.left - this.margin.right; // svg container width
  public graphHeight = 400 - this.margin.top - this.margin.bottom;

  // Time & Linear Scales & Axes
  // X coordinates based on time scale. DOMAIN: earliest date, latest data / RANGE 0, graphWidth 
  // Y coordinates based on linear scale. DOMAIN:  0, maxDistance / RANGE  graphHeight, 0

  public xScale = d3.scaleTime().range([0, this.graphWidth]); // Range Takes An Array!
  public yScale = d3.scaleLinear().range([this.graphHeight, 0]); //domains are setup in the update function

  // d3 linepath generator
  public line = d3.line()
    .x((d: any) => { return this.xScale(new Date(d.timeStamp.seconds)) }) // use function for 'this'
    .y((d: any) => { return this.yScale(d.temperatureF) });


  buildSVG() {
    this.svg = d3.select('.canvas')
      .append('svg')
      .attr('width', this.graphWidth + this.margin.left + this.margin.right)
      .attr('height', this.graphHeight + this.margin.left + this.margin.right)
    this.graph = this.svg.append('g')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)

    this.xAxisGroup = this.graph.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.graphHeight})`) // origin of axis is on top, translate to bottom
    this.yAxisGroup = this.graph.append('g')
      .attr('class', 'y-axis')

    // line path element
    this.path = this.graph.append('path');
    // create dotted line group and append to the graph
    this.dottedLines = this.graph.append('g')
      .attr('class', 'dotted-lines')
      .style('opacity', 0);
    // create x dotted line and append to dotted line group
    this.xLine = this.dottedLines
      .append('line')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke', '#AAA')
      .attr('stroke-width', 1)
    // create y dotted line and append to dotted line group
    this.yLine = this.dottedLines
      .append('line')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke', '#AAA')
      .attr('stroke-width', 1)
  }
  update = (data: any) => {
    // filter out irrelevant data
    //data = data.filter((item: any) => item.activity == this.activity)  // keep true

    // sort by date
    data.sort((a: any, b: any) => (a.timeStamp.seconds > b.timeStamp.seconds) ? 1 : -1)
    // set scale domains
    this.xScale.domain(d3.extent(data, (d: any) => new Date(d.timeStamp.seconds)) as Iterable<number>); // returns earliest and latest date
    this.yScale.domain(d3.extent(data, (d: any) => d.temperatureF) as Iterable<number>); // returns 0 and longest distance

    // update path data
    this.path.data([data]) // pass in array into path generator
      .attr('fill', 'none')
      .attr('stroke', '#00bfa5') // teal
      .attr('stroke-width', 2)
      .attr('d', this.line)

    // create points for
    const circles = this.graph.selectAll('circle')
      .data(data)

    // address existing points
    circles
      .attr('cx', (d: any) => this.xScale(new Date(d.timeStamp.seconds))) // use date a X coord
      .attr('cy', (d: any) => this.yScale(d.temperatureF))  // use distance

    // add new points 
    circles.enter()
      .append('circle')
      .attr('r', 4)
      .attr('cx', (d: any) => this.xScale(new Date(d.timeStamp.seconds))) // use date a X coord
      .attr('cy', (d: any) => this.yScale(d.temperatureF))  // use distance
      .attr('fill', '#CCC')
      .attr('opacity', 0)


    // handle mouse events
    this.graph.selectAll('circle')
      .each((d: any, i: any, n: any) => {
        const node = d3.select(n[i])
          .on('mouseover', () => {
            node
              .attr('cursor', 'pointer')
              .attr('r', 5)
              .attr('opacity', .8)

            this.dottedLines.style('opacity', .8)
            this.xLine
              .attr('x1', () => this.xScale(new Date(d.timeStamp.seconds)))
              .attr('x2', () => this.xScale(new Date(d.timeStamp.seconds)))
              .attr('y1', this.graphHeight)
              .attr('y2', this.yScale(d.temperatureF))
            //set x dotted line coords 
            this.yLine
              .attr('x1', 0)
              .attr('x2', () => this.xScale(new Date(d.timeStamp.seconds)))
              .attr('y1', this.yScale(d.temperatureF))
              .attr('y2', this.yScale(d.temperatureF))
            //set y dotted line coords
          })
          .on('mouseleave', () => {
            node
              .attr('opacity', 0)
            // hide the dotted line group
            this.dottedLines.style('opacity', 0)
          })
          .on('click', () => {
            console.log(new Date(d.timeStamp.seconds * 1000))
          })

      })
    // remove 
    circles.exit().remove();

    // create the axes
    const xAxis = d3.axisBottom(this.xScale)
      .ticks(10)
      .tickFormat((d: any) => (new Date(d * 1000).getMonth() + 1) + '/' + new Date(d * 1000).getDate().toString());
    const yAxis = d3.axisLeft(this.yScale)
      .ticks(10)
      .tickFormat(d => d + ' °F');


    // call the axes
    this.xAxisGroup.call(xAxis);
    this.yAxisGroup.call(yAxis);


    //rotate X axis group
    this.xAxisGroup.selectAll('text')
      .attr('transform', `rotate(-40)`)
      .attr('text-anchor', 'end');
  }
  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  // data and firestore
  async getByDate(daysAgo: number) {
    //Get today's date using the JavaScript Date object.
    const numberOfDays = this.getDaysAgo(new Date(), daysAgo);
    this.currentLookBack = numberOfDays;
    this.dateData = this.firestore.collection('datapipes', (ref: any | undefined) => ref.where('timeStamp', '>', numberOfDays))
      .stateChanges().pipe(map((res: any) => {
        res.forEach((change: any) => {
          const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore

          console.log(change.type)
          switch (change.type) {
            case 'added':
              this.data.push(doc)
              break;
            case 'modified':
              const index = this.data.findIndex((item) => item.id == doc.id) // get the item from data []
              this.data[index] = doc; // overwrite old element with the modified one
              break;
            case 'removed':
              this.data = this.data.filter((item) => item.id !== doc.id) // filter out the removed element as new array
              break;
            default: // default case required
              break;
          }
        });
        this.update(this.data);
      })
      ).subscribe()

    //   .get()
    //   .then((snapshot: any) => {
    //     console.log(snapshot)
    //     var jsonvalue: any[] = [];
    //     snapshot.forEach((docs: any) => {
    //       jsonvalue.push(docs.data())
    //     })
    //     console.log(jsonvalue);
    //     return;
    //   }).catch((error: any) => {
    //     console.log(error)
    //   })
    // );
  }
  getData() {
    // StateChanges allows use of added|modified|removed
    this.subs$ = this.firestore.collection('datapipes')
      .stateChanges().pipe(map((res: any) => {
        res.forEach((change: any) => {
          const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore

          console.log(change.type)
          switch (change.type) {
            case 'added':
              this.data.push(doc)
              break;
            case 'modified':
              const index = this.data.findIndex((item) => item.id == doc.id) // get the item from data []
              this.data[index] = doc; // overwrite old element with the modified one
              break;
            case 'removed':
              this.data = this.data.filter((item) => item.id !== doc.id) // filter out the removed element as new array
              break;
            default: // default case required
              break;
          }
        });
        this.update(this.data);
      })
      ).subscribe()
  }



  getDaysAgo(date: Date, days: number) {
    var pastDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
    return pastDate;
  }

}
