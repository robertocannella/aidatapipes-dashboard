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
  currentUser!: NotificationUser;
  showDialog = false;
  @Input('users')users:NotificationUser[] = [];

  constructor(private notificationService: NotificationService){}

   onDelete(user: NotificationUser){
    this.showDialog = false;

    let users = this.users.filter((u:NotificationUser) => u.email != user.email)
    this.notificationService.deleteUser(users)

  }
   onShowDialog(user: NotificationUser){
      this.showDialog = true;
      this.currentUser = user;

   }
  closeModal(){
    this.showDialog = false;
  }
}
