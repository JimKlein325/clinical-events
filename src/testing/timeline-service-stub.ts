import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from "@angular/core";
import { EventItemViewGroup } from "../app/model/event-item-view-group";
import { EventItemViewmodel } from "../app/model/event-item-viewmodel";


@Injectable()
export class TimelineServiceStub {
    eventSections: Array<EventItemViewGroup> = [
        { title: "Diagnosis", events: new Array<EventItemViewmodel>(
                new EventItemViewmodel("test", true, 0),
                new EventItemViewmodel("test1", true, 0),
        ) },
        { title: "Treatment", events: new Array<EventItemViewmodel>(
                new EventItemViewmodel("test2", true, 0),
                new EventItemViewmodel("test3", true, 0),
        ) },
        { title: "Quality of Life", events: new Array<EventItemViewmodel>() }
    ];

    // ActivatedRoute.paramMap is Observable
    private subject = new BehaviorSubject(this.eventSections);
    eventList$ = this.subject.asObservable();

    // Test parameters
    //   private _testParamMap: ParamMap;
    //   get testParamMap() { return this._testParamMap; }
    //   set testParamMap(params: {}) {
    //     this._testParamMap = convertToParamMap(params);
    //     this.subject.next(this._testParamMap);
    //   }
}