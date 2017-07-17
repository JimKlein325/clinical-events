import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MdList, MdCheckbox } from '@angular/material';
import { TimelineService } from "../timeline.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  private events$: Observable<string[]>;
  constructor(private timelineService: TimelineService) { }

  ngOnInit() {
    this.events$ = this.timelineService.getEventList().take(1);
    
  }
  onCheckChange(event) {
    /* Checked.  Pass the label value stored in the 
    id property to the service filter method.*/
    let idString = event.source.value;
    this.timelineService.filterEvents(idString, event.checked);
  }
}
