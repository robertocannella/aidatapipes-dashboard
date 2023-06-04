import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SprinklerStatusService } from 'src/app/services/sprinkler-status.service';


@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  status: boolean = false;
  isButtonDisabled: boolean = false;
  subs$: Subscription = new Subscription()
  
  constructor(private sprinklerService: SprinklerStatusService ) { 
    
    this.subs$ = this.sprinklerService.getCurrentSprinklerStatus().subscribe((data: any)=>{
      console.log(data)
      this.status = data.isOn;
    });

  }
  ngOnDestroy():void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
  }
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
function SprinklerOnDocument(error: any): void {
  throw new Error('Function not implemented.');
}

