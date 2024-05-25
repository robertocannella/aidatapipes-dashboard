import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface NotificationUser {
  name: string
  email: string
}

@Injectable({
  providedIn: 'root'
})


export class NotificationService {

  constructor( public firestore: AngularFirestore) {
    
  }
  setUserList(users: NotificationUser[]){
    this.firestore.collection('mail').doc('to').set({email: users})
  }

  getUserList(){
    return this.firestore.collection('mail').doc('to').valueChanges();
  }
  deleteUser(users:NotificationUser[]){
      this.firestore.collection('mail').doc('to').set({email: users})
  }

}
