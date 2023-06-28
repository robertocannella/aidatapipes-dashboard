import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-listlog',
  templateUrl: './listlog.component.html',
  styleUrls: ['./listlog.component.scss']
})

export class ListlogComponent {
subs$: Subscription = new Subscription();
fileContents: any;
fileAsArray = [];

 constructor(private storage: StorageService){
    // Which file contains the info? Path is to oot of storage bucket
    this.storage.setRef('sprinkler_event.txt');
 }

 ngOnInit() : void {
  this.getFileContents();
 }
 appendFile(content: string){
  this.storage.appendFile(content);
 }
 async getFileContents(){
  this.fileContents = await this.storage.getContents();
  this.fileAsArray = this.fileContents.split("\n");
  
 }
}
