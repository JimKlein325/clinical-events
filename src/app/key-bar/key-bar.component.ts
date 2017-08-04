import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MdList, MdCheckbox } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineService } from "../timeline.service";
import { } from "";
import { FormGroup, FormControl } from "@angular/forms";
import { MonthViewmodel } from "../model/month-viewmodel";
@Component({
  selector: 'app-key-bar',
  templateUrl: './key-bar.component.html',
  styleUrls: ['./key-bar.component.css']
})
export class KeyBarComponent implements OnInit, AfterViewInit {
  public selectedStartDate;
  public selectedEndDate;
  public startSelectValues: Array<MonthViewmodel>;
  public endSelectValues: Array<Date>;

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
      monthSelect_start: new FormControl(this.months[2].value),
      monthSelect_end: new FormControl()
    });

    this.service.startDateSelect$
      .subscribe(dateItems => {

        this.startSelectValues = dateItems;
        this.selectedStartDate = dateItems[0].value;

        console.log(this.startSelectValues);
      });
  }
  ngAfterViewInit(): void {
    //this.datesForm.patchValue({monthSelect_start: this.months[1].value}) 
  }

  onSelectChange_start(event) {
    // MD emits event.value
    //html select it's event.target.value
    let endMonth = this.datesForm.get('monthSelect_end').value;
    this.service.updateDateRange(event.target.value, endMonth);
  }
  onSelectChange_end(event) {
    let startDate = this.datesForm.get('monthSelect_start').value;
    this.service.updateDateRange(startDate, event.target.value);
  }
}
