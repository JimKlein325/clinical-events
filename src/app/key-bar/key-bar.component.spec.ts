import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { KeyBarComponent } from './key-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TimelineService } from "../timeline.service";
import { MonthViewmodel } from "../model/month-viewmodel";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
import { of } from "rxjs/observable/of";
describe('KeyBarComponent', () => {
  let component: KeyBarComponent;
  let fixture: ComponentFixture<KeyBarComponent>;
  let params: any;
  let viewModel: KeyBarViewmodel;
  let keyBarModel$: Observable<KeyBarViewmodel>;

  let vm: BehaviorSubject<KeyBarViewmodel>;

  beforeEach(async(() => {
    let data_start: Array<MonthViewmodel> = [
      { viewValue: "Jan, 2010", value: "2010-01-01", id: 0 },
      { viewValue: "Feb, 2010", value: "2010-02-01", id: 1 },
      { viewValue: "Mar, 2010", value: "2010-03-01", id: 2 },
      { viewValue: "Apr, 2010", value: "2010-04-01", id: 3 },
      { viewValue: "May, 2010", value: "2010-05-01", id: 4 },
      { viewValue: "Jun, 2010", value: "2010-06-01", id: 5 },
      { viewValue: "Jul, 2010", value: "2010-07-01", id: 6 },
      { viewValue: "Aug, 2010", value: "2010-08-01", id: 7 }
    ];
    let selected_start = null;//this.data_start[0];
    let data_end: Array<MonthViewmodel> = [
      { viewValue: "Jan, 2010", value: "2010-01-01", id: 0 },
      { viewValue: "Feb, 2010", value: "2010-02-01", id: 1 },
      { viewValue: "Mar, 2010", value: "2010-03-01", id: 2 },
      { viewValue: "Apr, 2010", value: "2010-04-01", id: 3 },
      { viewValue: "May, 2010", value: "2010-05-01", id: 4 },
      { viewValue: "Jun, 2010", value: "2010-06-01", id: 5 },
      { viewValue: "Jul, 2010", value: "2010-07-01", id: 6 },
      { viewValue: "Aug, 2010", value: "2010-08-01", id: 7 }
    ];
    let selected_end = null;//this.data_end[data_end.length - 1];

    viewModel = {
      selectedStartMonth: this.selected_start,
      startMonthOptions: this.data_start,
      selectedEndMonth: this.selected_end,
      endMonthOptions: this.data_end
    };
    let subject = new BehaviorSubject<KeyBarViewmodel>(viewModel);
    keyBarModel$ = subject.asObservable(); //Observable.of(subject);
    // vm = of({
    //   viewModel
    // });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KeyBarComponent],
      // providers: [{ provide: TimelineService,useValue: { params, keyBarModel$ } }]
      providers: [TimelineService]
    })
      .compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(KeyBarComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should be created', () => {
    const f = TestBed.createComponent(KeyBarComponent);
    f.detectChanges();
    expect(component).toBeTruthy();
  });
});
