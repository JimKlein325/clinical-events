import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as _ from "lodash";
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { MonthViewmodel } from "../model/month-viewmodel";
import { TimelineService } from "../timeline.service";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
import { MaterialModule, MdSelectModule } from "@angular/material";
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

  monthViewItems: Observable<Array<MonthViewmodel>>;

  constructor(public service: TimelineService) { }

  ngOnInit() {
    this.model = this.service.keyBarModel$;
  }

  onSelectChange_start(event) {
    this.service.updateDate_Start(event.value);
  }

  onSelectChange_end(event) {
    this.service.updateDate_End( event.value);
  }
}
