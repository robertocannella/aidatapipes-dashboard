import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Scheduler, SchedulerGroup, SprinklerStatusService } from '../../services/sprinkler-status.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent{
  // FormBuilder
  scheduleBuilder = this.fb.group({
    eventName: ['Sprinkler Event 2', [Validators.required, Validators.minLength(4), this.isUnique()]],
    frequency: ['', [Validators.required]],
    hour: ['', [Validators.required]],
    minute: ['', [Validators.required]],
    amPm: ['', [Validators.required]],
    dateTime: ['', [Validators.required, this.allowedValue(/^(0[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i)]],
    duration: ['', [Validators.required]]
  })

  isValid= true;
  hours: string[] = this.convertToTwoDigits(Array.from({ length: 12 }, (_, index) => index + 1));
  minutes: string[] = this.convertToTwoDigits(Array.from({ length: 60 }, (_, index) => index + 1));

  addEvent = false;
  amPm: 'AM' | 'PM' | null  = null
  step: number = 0;
  @Input('eventType')eventType:string = ''
  @Input('events')events!:SchedulerGroup[]
  constructor(private fb: FormBuilder, private sprinklerService: SprinklerStatusService){}

  addSchedule() {
    let scheduleData = {
      eventName: this.eventName?.value,
      onTime: this.dateTime?.value,
      frequency: this.frequency?.value,
      hour: this.hour?.value,
      minute: this.minute?.value,
      ampm: this.ampm?.value,
      duration: this.duration?.value,
    };
    // Perform any necessary logic with the updated schedule data

    // ('Updated schedule:', scheduleData);
    this.sprinklerService.setSchedule(scheduleData)
    this.step = 0;
    this.scheduleBuilder.reset();
  }

  onAddEvent (){
    this.addEvent = true;
    this.step = 1;

  }
  onDateTimeChange(dateControl: AbstractControl<string | null, string | null> | null){
    if (dateControl){
      dateControl.setValue(this.hour?.value + ":" + this.minute?.value + " " + this.ampm?.value)
    }
  }
  nextStep(formControl: AbstractControl<string | null, string | null> | null){
    if (formControl){ 
      if (!formControl.touched){
          // The user is trying to progress without entering data
          formControl?.markAllAsTouched();
      }      
      // The form is valid, increment the step
      if (!formControl.invalid) this.step++;
    }
  }
  prevStep(formControl: AbstractControl<string | null, string | null> | null){
    if (formControl){ 
      if (!formControl.touched){
          // The user is trying to progress without entering data
          formControl?.markAllAsTouched();
      }      
      // The form is valid, increment the step
      if (!formControl.invalid) this.step--;
    }
  }

 // Custom Validator 
 allowedValue(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const allowed = nameRe.test(control.value);
      return allowed ? null : {allowedValue: {value: control.value}};
    };
  }
  isUnique(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
     
      let isUnique = true;
      if (this.events){
        this.events.map(event => {
         if(event.eventDetails.eventName === control.value){
          isUnique = false
         }
   
        })
      }
      // console.log(control)
      return isUnique ? null : {isUnique: { value: control.value}}
    }
  }
  // Utility function
  convertToTwoDigits(numbers: number[]) {
    return numbers.map((num) => num.toString().padStart(2, '0'));
  }
  resetForm(){
    this.step=0;
    this.scheduleBuilder.reset();
  }
  // Getters for form validation
  get eventName () { return this.scheduleBuilder.get('eventName')}
  get frequency () { return this.scheduleBuilder.get('frequency')}
  get hour () { return this.scheduleBuilder.get('hour')}
  get minute () { return this.scheduleBuilder.get('minute')}
  get ampm () { return this.scheduleBuilder.get('amPm')}
  get dateTime () { return this.scheduleBuilder.get('dateTime')}
  get duration () { return this.scheduleBuilder.get('duration')}
}
