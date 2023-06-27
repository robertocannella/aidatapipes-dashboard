import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationUser } from 'src/app/services/notification.service';
import { Scheduler, SchedulerGroup, SprinklerStatusService } from 'src/app/services/sprinkler-status.service';


@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  status: boolean = false;
  isButtonDisabled: boolean = false;
  subs$: Subscription = new Subscription()
  subs2$: Subscription = new Subscription();
  subs3$: Subscription = new Subscription();
  events: SchedulerGroup[] = [];
  users: NotificationUser[] = [];

  constructor(private sprinklerService: SprinklerStatusService,private notificationService: NotificationService ) { 
    
    this.subs$ = this.sprinklerService.getCurrentSprinklerStatus().subscribe((data: any)=>{
      this.status = data.isOn;
    });
    this.subs3$ = this.notificationService.getUserList().subscribe((data:any)=>{
      this.users = data.email;
    })
    

  }
  ngOnDestroy():void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
    if (this.subs2$) {
      this.subs2$.unsubscribe();
    }
  }
  ngOnInit() : void {
    this.subs2$ = this.sprinklerService.getSchedules().subscribe((events)=>{
      this.events = []
        events.forEach(event => {
          this.events.push(event as SchedulerGroup)
        })
    });
    this.subs3$ = this.notificationService.getUserList().subscribe((data:any)=>{
      this.users = []
      if (data.email){
        data.email.forEach((user:NotificationUser)=>{
            this.users.push(user)
        })
      }
    })
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

