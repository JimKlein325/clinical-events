import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
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
  
  public labels: string[];
  private form: FormGroup;
  private fArray: FormArray = new FormArray([]);
  private singleUseFlag = false;
  private eventsList: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public eventItemGroups: Array<EventItemViewGroup>;
  events: FormArray = new FormArray([
  ]);

  eventForm = new FormGroup({
    events: this.events
  });
  eventSelectForm: FormGroup= new FormGroup({
    events: this.events
  });

  constructor(private fb: FormBuilder,
    private service: TimelineService) { }

  buildControls(eventLabels: string[]) {
    this.labels = eventLabels;

    this.labels.forEach(element => {
      this.events.push(new FormControl(true));
    });
  }
  buildEventGroup(events: Array<EventItemViewmodel>){

  }
  ngOnInit() {
    this.service.eventList$
      .takeUntil(this.ngUnsubscribe)
      .subscribe( val => {
        this.eventItemGroups = val;
        let formGroup: FormGroup;
        this.eventItemGroups.forEach((item, index) => {
          //Add Form Array
          let i = index.toString();
          item.events.forEach( (event, index) => {
            let j = index.toString();
            let name = i + "_" +j;
            this.events.push(new FormControl(event.text));
          });

        });

      });
    // this.eventsList = this.service.getEventList()
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(val => {
    //     // console.log(val);
    //     if (!this.singleUseFlag) {
    //       this.singleUseFlag = true;
    //       this.buildControls(val);
    //     }
    //   })
    //   ;
  }
  
  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    let idString = event.source.value;
    this.service.filterEvents(idString, event.checked);
  }
  // use of ngUnsubscribe ensures clean up of observable subscription
  //  Observables that complete() are automatically cleanup by ng:  http, router
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

