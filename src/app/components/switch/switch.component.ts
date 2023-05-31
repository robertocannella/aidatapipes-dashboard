import { Component, OnInit } from '@angular/core';
import { SprinklerStatusService } from 'src/app/services/sprinkler-status.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  status= false;
  constructor(private sprinklerService: SprinklerStatusService ) { }

  ngOnInit(): void {
  }
  onToggle(): void {
    this.status = !this.status;
    this.sprinklerService.setSprinklerStatus(this.status)

  }

}
