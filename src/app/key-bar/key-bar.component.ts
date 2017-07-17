import { Component, OnInit } from '@angular/core';
// import { MdDatepicker } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@Component({
  selector: 'app-key-bar',
  templateUrl: './key-bar.component.html',
  styleUrls: ['./key-bar.component.css']
})
export class KeyBarComponent implements OnInit {
  selectedValue: string;

  foods = [
    { value: 'steak-0', viewValue: 'Feb, 2012' },
    { value: 'pizza-1', viewValue: 'Mar, 2012' },
    { value: 'tacos-2', viewValue: 'Apr, 2012' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
