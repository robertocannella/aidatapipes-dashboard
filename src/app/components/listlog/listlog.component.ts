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
eventLog:any[] = [];

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


const reversedArray = this.fileAsArray.reverse();
// Convert the array of strings to an array of objects and calculate durations
this.fileAsArray.forEach((str, index) => {
  const previousEvent = index > 0 ? this.eventLog[this.eventLog.length - 1] : null;
  const convertedEvent = this.convertStringToObjectAndCalculateDuration(str, previousEvent);
  if (convertedEvent !== null) {
    this.eventLog.push(convertedEvent);
  }
});

console.log(this.eventLog)
  
 }
// Function to convert string to object and calculate duration
convertStringToObjectAndCalculateDuration(str:string, previousEvent:any) {
  // Extract time and status values from the string
  const regex = /Time: (\d+)\tStatus: (\w+)/;
  const match = str.match(regex);

  if (match) {
    const [, timeString, statusString] = match;

    // Convert the time string to a readable format
    const time = new Date(parseInt(timeString)).toLocaleString();

    // Calculate duration if there is a previous event
    let duration = null;
    if (!previousEvent){
      console.log(previousEvent)
    }
    if (previousEvent && previousEvent.Status === true && statusString == 'false') {
      console.log('inside duration caclu')
      const startTime = new Date(previousEvent.Time).getTime();
      const endTime = new Date(time).getTime();
      duration = endTime - startTime;
    }

    // Create and return the object
    return {
      Time: time,
      Status: statusString === 'true',
      Duration: duration ? this.formatDuration(duration) : null
    };
  }

  return null;
}

// Function to format duration in a human-readable format
formatDuration(duration:any) {
  const milliseconds = duration % 1000;
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}
}
