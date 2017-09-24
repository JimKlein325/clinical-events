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

@Component({
  selector: 'item-select',
  templateUrl: './item-select.component.html',
  styleUrls: ['./item-select.component.css']
})
export class ItemSelectComponent implements OnInit, OnDestroy {
  public eventsItemGroup$: Observable<Array<EventItemViewGroup>>

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public eventItemGroups: Array<EventItemViewGroup>;
  events: FormArray = new FormArray([
  ]);

  eventForm = new FormGroup(
    {events: this.events}
  );

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
      });
  }

  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    this.service.filterEvents(event.source.id, event.checked);
  }
  // use of ngUnsubscribe ensures clean up of observable subscription
  //  Observables that complete() are automatically cleanup by ng: for example, http, router
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

