import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ai-datapipes';
  //items: Observable<any[]>;
  constructor(public firestore: AngularFirestore) {
    //this.items = firestore.collection('datapipes').valueChanges();
  }
  ngOnInit() {
    this.getData();
  }


  // data and firestore

  public data: any[] = [];

  update(data: any) {
    console.log("data", data)
  }

  getData() {
    this.firestore.collection('datapipes').snapshotChanges().subscribe((res: any) => {
      res.forEach((change: any) => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id } // create new object with ID field from firestore

        switch (change.type) {
          case 'added':
            this.data.push(doc)
            break;
          case 'modified':
            const index = this.data.findIndex((item) => item.id == doc.id) // get the item from data []
            this.data[index] = doc; // overwrite old element with the modified one
            break;
          case 'removed':
            this.data = this.data.filter((item) => item.id !== doc.id) // filter out the removed element as new array
            break;
          default: // default case required
            break;
        }
      });
      this.update(this.data);
    });
  }
}
