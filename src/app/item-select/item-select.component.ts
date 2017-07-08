import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MdList, MdCheckbox } from '@angular/material';
import { TimelineService } from "../timeline.service";


@Component({
  selector: 'item-select',
  templateUrl: './item-select.component.html',
  styleUrls: ['./item-select.component.css']
})
export class ItemSelectComponent implements OnInit {
  private labels: string[];
  private form: FormGroup;
  private fArray: FormArray = new FormArray([]);
  private singleUseFlag = false;

  events: FormArray = new FormArray([
  ]);

  eventForm = new FormGroup({
    events: this.events
  });

  datesForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: TimelineService) { }

  buildControls (eventLabels: string[]){
          this.labels = eventLabels;
          this.labels.forEach(element => {
            this.events.push(new FormControl(true));
          });
    
  }

  ngOnInit() {

    this.service.clinicalEvents$
      //.publishLast()//.refCount()
      .subscribe(val => {
        // console.log(val);
        if (!this.singleUseFlag) {
          this.singleUseFlag = true;
          this.buildControls(val);
        }
      })
      ;
  }

  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    let idString = event.source.value;
    this.service.filterFromForm(idString, event.checked);
  }
}

