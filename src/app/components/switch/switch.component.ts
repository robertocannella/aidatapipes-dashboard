import { Component, OnInit } from '@angular/core';
import { SprinklerStatusService } from 'src/app/services/sprinkler-status.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  status: boolean = false;
  isButtonDisabled: boolean = false;
  constructor(private sprinklerService: SprinklerStatusService ) { }

  ngOnInit(): void {
  }
  onToggle(): void {
    this.disableButton();
    this.status = !this.status;
    this.sprinklerService.setSprinklerStatus(this.status)

  }
  disableButton(): void {
    this.isButtonDisabled = true;
    setTimeout(() => {
      this.isButtonDisabled = false;
    }, 5000); // 5000 milliseconds = 5 seconds
  }

}
