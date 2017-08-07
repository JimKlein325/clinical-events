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
  public endSelectValues: Array<MonthViewmodel>;

  datesForm: FormGroup;

  constructor(private service: TimelineService) { }
  // get reversedDates(): any {
  //   return this.months.reverse();
  // }
  ngOnInit() {

    this.service.startDateSelect$
      .subscribe(dateItems => {
        this.startSelectValues = dateItems;
        this.selectedStartDate = this.startSelectValues[0].value;
      });
    this.service.endDateSelect$
      .subscribe(dateItems => {
        this.endSelectValues = dateItems;
        this.selectedEndDate = this.endSelectValues[this.endSelectValues.length-1].value;
      });
  }
  ngAfterViewInit(): void {
    //this.datesForm.patchValue({monthSelect_start: this.months[1].value}) 
  }

  onSelectChange_start(event) {
    // MD emits event.value
    //html select it's event.target.value
    // let endMonth = this.datesForm.get('monthSelect_end').value;
    // this.service.updateDateRange(event.value, endMonth);
    let endDate = this.selectedEndDate;
    this.service.updateDateRange(event.value, endDate);
  }
  onSelectChange_end(event) {
    let startDate = this.selectedStartDate;
    this.service.updateDateRange(startDate, event.value);
  }
}
