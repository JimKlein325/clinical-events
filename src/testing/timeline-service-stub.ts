import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from "@angular/core";
import { EventItemViewGroup } from "../app/model/event-item-view-group";
import { EventItemViewmodel } from "../app/model/event-item-viewmodel";
import { MonthViewmodel } from "../app/model/month-viewmodel";
import { KeyBarViewmodel } from "../app/model/key-bar-viewmodel";
import { ClinicalEventItem } from "../app/clinicalevent-chart/models/clinical-event-item";
import { ClinicalEventReport } from "../app/clinicalevent-chart/models/clinical-event-report";
import { ClinicalEventItemWrapper } from "../app/clinicalevent-chart/models/clinical-event-item-wrapper";
import { ClinicaleventChartViewmodel } from "../app/model/clinicalevent-chart-viewmodel";



@Injectable()
export class TimelineServiceStub {

  public eventSections: Array<EventItemViewGroup> = [
    {
      title: "Diagnosis", events: new Array<EventItemViewmodel>(
        new EventItemViewmodel("test", true, 2, 0),
        new EventItemViewmodel("test1", true, 2, 1)
      )
    },
    {
      title: "Treatment", events: new Array<EventItemViewmodel>(
        new EventItemViewmodel("test2", true, 0, 2),
        new EventItemViewmodel("test3", true, 0, 3)
      )
    },
    {
      title: "Quality of Life", events: new Array<EventItemViewmodel>(
        new EventItemViewmodel("test4", true, 1, 4),
        new EventItemViewmodel("test5", true, 1, 5)
      )
    }
  ];

  public checkChangedStateEventSections: Array<EventItemViewGroup> = [
    {
      title: "Diagnosis", events: new Array<EventItemViewmodel>(
        //change isActive value to false for test
        new EventItemViewmodel("test", false, 2, 0),
        new EventItemViewmodel("test1", true, 2, 1)
      )
    },
    {
      title: "Treatment", events: new Array<EventItemViewmodel>(
        new EventItemViewmodel("test2", true, 0, 2),
        new EventItemViewmodel("test3", true, 0, 3)
      )
    },
    {
      title: "Quality of Life", events: new Array<EventItemViewmodel>(
        new EventItemViewmodel("test4", true, 1, 4),
        new EventItemViewmodel("test5", true, 1, 5)
      )
    }
  ];
  eventItemWrappers: Array<ClinicalEventItemWrapper> = [
      {
        item: {
          patientid: 1, sourceid: 1000000000, semantictype: "DiagnosticProcedure",
          clinicalevent: "Diagnosis", eventtime: "2010-02-01",
          problem: "Non-Small-Cell Lung Cancer, EGFR Mutation Positive, Stage IIIb", eventtype: 2
        },
        yValue: 21,
        itemDate: new Date("Thu Feb 1 2010 00:00:00 GMT-0700 (Pacific Daylight Time)")
      },
      {
        item: {
          patientid: 1, sourceid: 1000000000, semantictype: "DiagnosticProcedure",
          clinicalevent: "Staging", eventtime: "2010-02-01",
          problem: "Non-Small-Cell Lung Cancer, EGFR Mutation Positive, Stage IIIb", eventtype: 2
        },
        yValue: 31,
        itemDate: new Date("Thu Feb 1 2010 00:00:00 GMT-0700 (Pacific Daylight Time)")
      },
  ];
  clinicalEventVM = new ClinicaleventChartViewmodel(this.eventItemWrappers, 
    new ClinicalEventReport(5, 5, 
      [{
        patientid: 1, sourceid: 1000000000, semantictype: "DiagnosticProcedure",
        clinicalevent: "Diagnosis", eventtime: "2010-02-01",
        problem: "Non-Small-Cell Lung Cancer, EGFR Mutation Positive, Stage IIIb", eventtype: 2
      },
      {
        patientid: 1, sourceid: 1000000000, semantictype: "DiagnosticProcedure",
        clinicalevent: "Diagnosis", eventtime: "2010-02-01",
        problem: "Non-Small-Cell Lung Cancer, EGFR Mutation Positive, Stage IIIb", eventtype: 2
      }]),
    5, 
    new Date("2010-02-01"), 
    new Date("2010-02-01"));
  subjectChartView = new BehaviorSubject<ClinicaleventChartViewmodel>(this.clinicalEventVM);
  chartView$ = this.subjectChartView.asObservable(); 

  

  // ActivatedRoute.paramMap is Observable
  private _eventList$: Array<EventItemViewGroup>;
  //set subject initial value
  private subject = new BehaviorSubject(this.eventSections);
  public get eventList$() { return this.subject.asObservable(); }
  public set eventList$(list: {}) {
    this._eventList$ = list as Array<EventItemViewGroup>;
    this.subject.next(this._eventList$);
  }

  // Test parameters
  //   private _testParamMap: ParamMap;
  //   get testParamMap() { return this._testParamMap; }
  //   set testParamMap(params: {}) {
  //     this._testParamMap = convertToParamMap(params);
  //     this.subject.next(this._testParamMap);
  //   }

  /////KEY BAR COMPONENT 
  data_start: Array<MonthViewmodel> = [
    { viewValue: "Jan, 2010", value: "2010-01-01", id: 0 },
    { viewValue: "Feb, 2010", value: "2010-02-01", id: 1 },
    { viewValue: "Mar, 2010", value: "2010-03-01", id: 2 },
    { viewValue: "Apr, 2010", value: "2010-04-01", id: 3 },
    { viewValue: "May, 2010", value: "2010-05-01", id: 4 },
    { viewValue: "Jun, 2010", value: "2010-06-01", id: 5 },
    { viewValue: "Jul, 2010", value: "2010-07-01", id: 6 },
    { viewValue: "Aug, 2010", value: "2010-08-01", id: 7 }
  ];
  selected_start: MonthViewmodel;// = null;//this.data_start[0];
  data_end: Array<MonthViewmodel> = [
    { viewValue: "Jan, 2010", value: "2010-01-01", id: 0 },
    { viewValue: "Feb, 2010", value: "2010-02-01", id: 1 },
    { viewValue: "Mar, 2010", value: "2010-03-01", id: 2 },
    { viewValue: "Apr, 2010", value: "2010-04-01", id: 3 },
    { viewValue: "May, 2010", value: "2010-05-01", id: 4 },
    { viewValue: "Jun, 2010", value: "2010-06-01", id: 5 },
    { viewValue: "Jul, 2010", value: "2010-07-01", id: 6 },
    { viewValue: "Aug, 2010", value: "2010-08-01", id: 7 }
  ];
  selected_end: MonthViewmodel;

  viewModel: KeyBarViewmodel = {
    selectedStartMonth: this.data_start[0],
    startMonthOptions: this.data_start,
    selectedEndMonth: this.data_end[1],
    endMonthOptions: this.data_end
  };
  getModel(): KeyBarViewmodel {
    //   console.log(this.viewModel);
    return this.viewModel;
  }
  subjectKeyBar = new BehaviorSubject<KeyBarViewmodel>(this.getModel());
  keyBarModel$ = this.subjectKeyBar.asObservable(); //Observable.of(subject);

  filterEvents(item: string, checked: boolean) { }

}