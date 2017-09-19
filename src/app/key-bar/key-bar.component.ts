import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { TimelineService } from "../timeline.service";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
import { MaterialModule, MdSelectModule } from "@angular/material";

@Component({
  selector: 'app-key-bar',
  templateUrl: './key-bar.component.html',
  styleUrls: ['./key-bar.component.css']
})
export class KeyBarComponent implements OnInit {
  model: Observable<KeyBarViewmodel>;

  constructor(public service: TimelineService) { }

  ngOnInit() {
    this.model = this.service.keyBarModel_Reactive$;
  }

  onSelectChange_start(event) {
    this.service.updateDate_Start(event.value);
  }

  onSelectChange_end(event) {
    this.service.updateDate_End( event.value);
  }
}
