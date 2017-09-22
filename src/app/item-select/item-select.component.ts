import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { MdList, MdCheckbox } from '@angular/material';
import { TimelineService } from "../timeline.service";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { EventItemViewmodel } from "../model/event-item-viewmodel";
import { EventItemViewGroup } from "../model/event-item-view-group";

  // function eventCountGreaterThanZero ( formGroup: FormGroup): {[key: string]: boolean} | null {
  //   //console.log(Object.keys((<FormGroup>formGroup.root).controls)) ;
  //   return null;
  // }

@Component({
  selector: 'item-select',
  templateUrl: './item-select.component.html',
  styleUrls: ['./item-select.component.css']
})
export class ItemSelectComponent implements OnInit, OnDestroy {
  public eventsItemGroup$: Observable<Array<EventItemViewGroup>>

  // private form: FormGroup;
  private fArray: FormArray = new FormArray([]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public eventItemGroups: Array<EventItemViewGroup>;
  events: FormArray = new FormArray([
  ]);

  eventForm = new FormGroup(
    {events: this.events}//,  eventCountGreaterThanZero
    // events: this.events, eventCountGreaterThanZero
  );
  // eventSelectForm: FormGroup = new FormGroup({
  //   events: this.events
  // });

  constructor(private fb: FormBuilder, private service: TimelineService) { }

  ngOnInit() {
    this.service.eventList_Reactive$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.eventItemGroups = val;
        if (this.events.length < 1) {
          this.eventItemGroups.forEach((item, index) => {
            item.events.forEach((event, index) => {
              // set initial value to clinicalevent name stored in text property
              this.events.push(new FormControl(event.isActive));
            });
          });
        }
        else {
          //loop over this.eventItemGroups and set value
          this.eventItemGroups.forEach((item, index) => {
            item.events.forEach((event, index) => {
              // set initial value to clinicalevent name stored in text property
              let checkBox = this.eventForm.get(['events', event.controlIndex]);
              checkBox.setValue(event.isActive);
            });
          });
        }
        let t = Object.keys((<FormGroup>this.eventForm.root).controls);
        // console.log((<FormGroup>this.eventForm.root).controls);
        // console.log( Object.keys((<FormGroup>this.eventForm.root).controls));
        // console.log(t[0]);
        // console.log(this.eventForm.get([t[0], 0]));
      });
  }

  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/

    this.service.filterEvents(event.source.id, event.checked);
    // const atLeastOneBoxChecked = this.events.controls.reduce(function(acc, item, index){ return  event.value? true:  acc}, false);

    // if (atLeastOneBoxChecked){
    // let idString = event.source.id;
    // this.service.filterEvents(idString, event.checked);
    // }
  }
  // use of ngUnsubscribe ensures clean up of observable subscription
  //  Observables that complete() are automatically cleanup by ng: for example, http, router
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

