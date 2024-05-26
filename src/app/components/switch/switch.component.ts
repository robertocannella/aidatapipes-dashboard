import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationUser } from 'src/app/services/notification.service';
import { Scheduler, SchedulerGroup, SprinklerStatusService } from 'src/app/services/sprinkler-status.service';
import { StorageService } from 'src/app/services/storage.service';


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
  fileContents = '';

  constructor(
    private sprinklerService: SprinklerStatusService,
    private notificationService: NotificationService,
    private storageService: StorageService) {

    // Which file contains the info? Path is to oot of storage bucket
    this.storageService.setRef('sprinkler_event.txt');

    this.subs$ = this.sprinklerService.getCurrentSprinklerStatus().subscribe((data: any) => {
      this.status = data.isOn;
    });
    this.subs3$ = this.notificationService.getUserList().subscribe((data: any) => {
      this.users = data.email;
    })


  }


  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
    if (this.subs2$) {
      this.subs2$.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getFileContents();

    this.subs2$ = this.sprinklerService.getSchedules().subscribe((events) => {
      this.events = []
      events.forEach(event => {
        this.events.push(event as SchedulerGroup)
      })
    });
    this.subs3$ = this.notificationService.getUserList().subscribe((data: any) => {
      this.users = []
      if (data.email) {
        data.email.forEach((user: NotificationUser) => {
          this.users.push(user)
        })
      }
    })
  }

  appendFile(content: string) {
    this.storageService.appendFile(content);
  }
  async getFileContents() {
    this.fileContents = await this.storageService.getContents();

  }
  onToggle(): void {
    this.disableButton();

    this.status = !this.status;
    this.sprinklerService.setSprinklerStatus(this.status)
    this.appendFile('Time: ' + Date.now() + '\t' + 'Status: ' + this.status.toString() + '\n');

  }
  disableButton(): void {
    this.isButtonDisabled = true;
    setTimeout(() => {
      this.isButtonDisabled = false;
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  showTimer(): void {
    console.log("SHOWING TIMER")
  }

}
function SprinklerOnDocument(error: any): void {
  throw new Error('Function not implemented.');
}

