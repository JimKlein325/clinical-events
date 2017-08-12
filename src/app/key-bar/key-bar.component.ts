import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MdList, MdCheckbox } from '@angular/material';
import { FormGroup, FormControl } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as _ from "lodash";
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { MonthViewmodel } from "../model/month-viewmodel";
import { TimelineService } from "../timeline.service";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
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
  public model: Observable<KeyBarViewmodel>;
  datesForm: FormGroup;
  private viewModel: KeyBarViewmodel;
  private selectedStartIndex: number;


  constructor(private service: TimelineService) { }
  // get reversedDates(): any {
  //   return this.months.reverse();
  // }
  ngOnInit() {
    this.model = this.service.getStartDateOptions();
    // this.service.getStartDateOptions()
    //   .subscribe(model => this.startSelectValues = model.startMonthOptions);
    // this.service.getStartDateOptions()
    //   .subscribe(model => this.selectedStartDate = model.selectedStartMonth.value);
    // this.service.getStartDateOptions()
    //   .subscribe(model => this.selectedEndDate = model.selectedEndMonth.value);
    // this.service.getStartDateOptions()
    //   .subscribe(model => this.viewModel = model);

    //let a = this.viewModel;

    
    // this.service.getStartDateOptions()
    // .take(1)
    //   .subscribe(model => {
    //     this.endSelectValues=model.endMonthOptions;
    //   })
    //   ;
    // this.service.getStartDateOptions()
    // .take(1)
    //   .subscribe(model => {
    //     this.startSelectValues=model.startMonthOptions;
    //   });
    // this.service.getStartDateOptions()
    //   .subscribe(model => {
    //     this.selectedStartDate=model.startMonthOptions[model.startMonthID].value
    //   });
    // this.service.getStartDateOptions()
    //   .subscribe(model => {
    //     //  the model.endMothID is not getting reset properly in the service after selection
    //     this.selectedEndDate=model.endMonthOptions[model.endMonthID].value;
    //   }
    //   );

    //this.startSelectValues = this.viewModel.startMonthOptions;
    // this.selectedStartDate = this.startSelectValues[this.viewModel.startMonthID].value;
    // this.endSelectValues = this.viewModel.endMonthOptions;
    // this.selectedEndDate = this.endSelectValues[this.viewModel.endMonthID].value;

    // .do(function (viewModel)  {
    //   this.startSelectValues = viewModel.startMonthOptions;
    //   const startItemIndex = _.findIndex
    //   (this.startSelectValues, item => item.id==viewModel.startMonthID );
    //   this.endSelectValues = viewModel.endMonthOptions;
    //   const endItemIndex = _.findIndex(this.endSelectValues, item => item.id==viewModel.endMonthID );
    //   this.selectedStartDate = this.startSelectValues[startItemIndex];
    //   this.selectedEndDate = this.endSelectValues[endItemIndex];

    //   //this.startSelectValues = dateItems;
    //   //this.selectedStartDate = this.startSelectValues[0].value;
    // })
    // .subscribe();
    // this.service.endDateSelect$
    //   .subscribe(dateItems => {
    //     this.endSelectValues = dateItems;
    //     this.selectedEndDate = this.endSelectValues[this.endSelectValues.length - 1].value;
    //   });
  }
  ngAfterViewInit(): void {
    //this.datesForm.patchValue({monthSelect_start: this.months[1].value}) 

  }

  onSelectChange_start(event) {
    // MD emits event.value
    //html select it's event.target.value
    // let endMonth = this.datesForm.get('monthSelect_end').value;
    // this.service.updateDateRange(event.value, endMonth);
    //let endDate = this.selectedEndDate;
    this.service.updateDate_Start(event.value);
  }
  onSelectChange_end(event) {
    //let startDate = this.selectedStartDate;
    this.service.updateDate_End( event.value);
  }
}
