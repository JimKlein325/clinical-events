import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { TimelineService } from "../timeline.service";
import { MdList } from '@angular/material';
import * as _ from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-events-input',
  templateUrl: './events-input.component.html',
  styleUrls: ['./events-input.component.css']
})
export class EventsInputComponent implements OnInit {

  private labels: string[];// = ["Taxotere", "Tarceva"];
  private form: FormGroup;
  private fArray: FormArray = new FormArray([]);

  users: FormArray = new FormArray([
  ]);

  userForm = new FormGroup({
    users: this.users
  });

  datesForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: TimelineService) { }

  ngOnInit() {

    this.service.clinicalEvents$
      .subscribe(val => {
        this.labels = val;
        this.labels.forEach(element => {
          this.users.push(new FormControl(true));
        });
      });

  }

  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    let idString = event.source.value;
    this.service.filterEvents(idString, event.checked);
    console.log(event.source.value);
  }
}

