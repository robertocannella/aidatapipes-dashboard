import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService, NotificationUser } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss']
})
export class NotifierComponent {
  isValid= true;
  step: number = 0;
  @Input('users')users!:NotificationUser[];

constructor(private fb: FormBuilder, private notificationService: NotificationService){

}
  // FormBuilder
  notificationBuilder = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  })
  onAddNotification (){
    this.step = 1
    // console.log(this.users)
  }
  onSubmit(){
    let notificationData = {
      name: this.name?.value,
      email: this.email?.value,

    };
    this.users.push(notificationData as NotificationUser)
    this.notificationService.setUserList(this.users)

   this.step = 0;
   this.notificationBuilder.reset();
  }
  resetForm(){
    this.step = 0;
    this.notificationBuilder.reset();
  }
  get name () { return this.notificationBuilder.get('name')}
  get email () { return this.notificationBuilder.get('email')}
}
