import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationUser } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
  subs$ = new Subscription();
  @Input('users')users:NotificationUser[] = [];

  constructor(private notificationService: NotificationService){
        

  }

  onDelete(user: NotificationUser){
    this.users = this.users.filter((u:NotificationUser) => user.email != u.email)
    this.notificationService.deleteUser(this.users)
  }
}
