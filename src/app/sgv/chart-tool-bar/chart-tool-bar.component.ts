import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chart-tool-bar',
  templateUrl: './chart-tool-bar.component.html',
  styleUrls: ['./chart-tool-bar.component.scss']
})
export class ChartToolBarComponent implements OnInit {
  @Output() lineColorChangeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {

  }
  changeLineColor(value: string) {
    let newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    console.log('Color change from child. New color: ', newColor)
    this.lineColorChangeEvent.emit(newColor);
  }

}
