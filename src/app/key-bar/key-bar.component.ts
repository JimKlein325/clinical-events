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
export class KeyBarComponent implements OnInit {
  public selectedStartDate;
  public selectedEndDate;
  public startSelectValues: Array<MonthViewmodel>;
  public endSelectValues: Array<MonthViewmodel>;
  public model: Observable<KeyBarViewmodel>;
  datesForm: FormGroup;
  private viewModel: KeyBarViewmodel;
  private selectedStartIndex: number;
  

  constructor(private service: TimelineService) { }

  ngOnInit() {
    this.model = this.service.getStartDateOptions();
  }

  onSelectChange_start(event) {
    this.service.updateDate_Start(event.value);
  }

  onSelectChange_end(event) {
    //let startDate = this.selectedStartDate;
    this.service.updateDate_End( event.value);
  }
}
