import { ContentChild, Inject, Injectable, inject } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { readFile } from 'fs';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class StorageService {
  fileUrl = '';
  fileRef!:AngularFireStorageReference;
  fileContents = '';

  subs$ = new Subscription();
  constructor(private storage: AngularFireStorage,private http: HttpClient) {
    
   }
   setRef (path:any) {
      this.fileRef = this.storage.ref(path)
   }

   overWriteFile(content: string){
    this.fileRef.putString(content)
   }
   getContents(): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      // Set up the subscription to the url
      this.subs$ = this.getUrl().subscribe((url) => {
        // Make an HTTP request to the endpoint
        this.http.get(url, { responseType: 'blob' })
          .subscribe(async (response) => {
            try {
              // Process the file contents
              const fileContents = await this.processFileBlob(response);
              resolve(fileContents);
            } catch (error) {
              reject(error);
            }
          }, (error) => {
            reject(error);
          });
      });
    });
  }
  
   appendFile(content: string){
      // Set up the subscription to the url
      this.subs$ = this.getUrl().subscribe((url)=>{
        // make an http request to the endpoint
        this.http.get(url, { responseType: 'blob' })
        .subscribe(async response => {
          // Process the file contents
          this.fileContents = await  this.processFileBlob(response);
          // add the new contents to the object
          this.fileContents +=  content;
          // TODO: rename the existing file 
    
          // put the new file
          this.overWriteFile(this.fileContents)
        });
      });
   }

   getUrl ():Observable<any> {
    return this.fileRef.getDownloadURL()
   }

   getMetaData (){
    return this.fileRef.getMetadata()
   }

   processFileBlob(fileBlob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const fileContent = fileReader.result as string;
        resolve(fileContent);
      };
      fileReader.onerror = (event) => {
        reject(fileReader.error);
      };
      fileReader.readAsText(fileBlob);
    });
  }
  
   processFileBlob2(fileBlob: Blob): void {
    
    // Parse and process the file contents here
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileContent = fileReader.result as string;
      this.processFileContents(fileContent);
    };

   fileReader.readAsText(fileBlob)
    // ...
  }

  processFileContents(fileContents: string){
    this.fileContents = fileContents;
  }

   ngOnDestroy(){
    this.subs$.unsubscribe();
   }

}


