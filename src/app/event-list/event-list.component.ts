import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MdList, MdCheckbox } from '@angular/material';
import { TimelineService } from "../timeline.service";
import { Observable } from "rxjs/Observable";
import { EventItemViewmodel } from "../model/event-item-viewmodel";
import { EventItemViewGroup } from "../model/event-item-view-group";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  public events$: Observable<Array<EventItemViewGroup>>
  constructor(private timelineService: TimelineService) { }

  ngOnInit() {
    this.events$ = this.timelineService.eventList$;
  }
  
  onCheckChange(event) {
    let idString = event.source.value;
    this.timelineService.filterEvents(idString, event.checked);
  }
}
