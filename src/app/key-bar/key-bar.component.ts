import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MdList, MdCheckbox } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineService } from "../timeline.service";
import { } from "";
import { FormGroup, FormControl } from "@angular/forms";
@Component({
  selector: 'app-key-bar',
  templateUrl: './key-bar.component.html',
  styleUrls: ['./key-bar.component.css']
})
export class KeyBarComponent implements OnInit, AfterViewInit {
  public selectedValue;// = "Feb, 2010";
  months = [
    { value: '2010-02-01', viewValue: 'Feb, 2010' },
    { value: '2010-03-01', viewValue: 'Mar, 2010' },
    { value: '2010-04-01', viewValue: 'Apr, 2010' },
    { value: '2010-05-01', viewValue: 'May, 2010' },
    { value: '2010-06-01', viewValue: 'Jun, 2010' },
    { value: '2010-07-01', viewValue: 'Jul, 2010' },
    { value: '2010-08-01', viewValue: 'Aug, 2010' }
  ];
  datesForm: FormGroup;

  constructor(private service: TimelineService) { }
  get reversedDates(): any {
    return this.months.reverse();
  }
  ngOnInit() {
    this.datesForm = new FormGroup({
      monthSelect_start: new FormControl(),
      monthSelect_end: new FormControl()
      // this isn't working!
      // monthSelect_start: new FormControl(this.months[0].value),
      // monthSelect_end: new FormControl(this.months[2].value)
    });
    // this.selectedValue = this.months[0].value;
    // const textInput = this.datesForm.get('monthSelect_end');
    // textInput.valueChanges.subscribe(value => this.logChange(value));
  //this.datesForm.patchValue({foodSelect: this.months[1].value}) 

  }
  ngAfterViewInit(): void {
  }
  logChange(value) {
    console.log(value);
  }
  onSelectChange_start(event) {
    // MD emits event.value
    //html select it's event.target.value
    this.service.updateMinDateRange(event.target.value);
    this.logChange(event.target.value);
  }
  onSelectChange_end(event) {
    this.service.updateMaxDateRange(event.target.value);
    this.logChange(event.target.value);
  }
}
