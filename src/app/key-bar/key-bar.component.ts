import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MdList, MdCheckbox } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TimelineService } from "../timeline.service";
import {  } from "";
@Component({
  selector: 'app-key-bar',
  templateUrl: './key-bar.component.html',
  styleUrls: ['./key-bar.component.css']
})
export class KeyBarComponent implements OnInit, AfterViewInit {
  selectedValue = "Feb, 2010";

  months = [
    { value: '2010-02-01', viewValue: 'Feb, 2010' },
    { value: '2010-03-01', viewValue: 'Mar, 2010' },
    { value: '2010-04-01', viewValue: 'Apr, 2010' },
    { value: '2010-05-01', viewValue: 'May, 2010' },
    { value: '2010-06-01', viewValue: 'Jun, 2010' },
    { value: '2010-07-01', viewValue: 'Jul, 2010' },
    { value: '2010-08-01', viewValue: 'Aug, 2010' }
  ];
  constructor(private service: TimelineService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
onSelectChange(){
    this.service.updateMinDateRange("2010-07-01");
  }
}
