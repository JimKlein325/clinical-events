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
        // console.log(val);
        if (!this.singleUseFlag) {
          this.singleUseFlag = true;
          this.labels = val;
          this.labels.forEach(element => {
            this.users.push(new FormControl(true));
          });
        }
      });
  }

  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    let idString = event.source.value;
    this.service.filterFromForm(idString, event.checked);
    // console.log(event.source);
    // console.log(event.source.value);
    // console.log(<MdCheckbox>event.source.id);
  }
}

