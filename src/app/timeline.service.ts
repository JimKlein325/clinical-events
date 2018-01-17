import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/withLatestFrom";
import "rxjs/add/operator/shareReplay";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import * as _ from "lodash";
import * as moment from 'moment';

import { ClinicalEventItem } from "./clinicalevent-chart/models/clinical-event-item";
import { ClinicalEventReport } from "./clinicalevent-chart/models/clinical-event-report";
import { ClinicalEventItemWrapper } from "./clinicalevent-chart/models/clinical-event-item-wrapper";
import { EventItemViewmodel } from "./model/event-item-viewmodel";
import { EventItemViewGroup } from "./model/event-item-view-group";
import { MonthViewmodel } from "./model/month-viewmodel";
import { TestData } from "./model/test-data";
import { KeyBarViewmodel } from "./model/key-bar-viewmodel";
import { MinmaxDates } from "./model/minmax-dates";
import { ClinicaleventChartViewmodel } from "./model/clinicalevent-chart-viewmodel";

export interface UserCheckEvent {
  event: string;
  isChecked: boolean;
}

class State {
  constructor(data: Array<ClinicalEventItem>,
  start: Date,
  end: Date
  ){}
}

@Injectable()
export class TimelineService {
  constructor(private http: Http) { }

  public clinicalEventReport: ClinicalEventReport;
  private dataset = TestData.dataset;

  ////////////////
  // User Input Streams
  private subjectStartMonth: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  private subjectEndMonth: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  private subjectUncheckedEvent: BehaviorSubject<UserCheckEvent> = new BehaviorSubject<UserCheckEvent>({ event: "", isChecked: false });

  // User Data Stream
  private eventDataStream = new BehaviorSubject(new Array<ClinicalEventItem>());

  ////////////////
  // User Action combining inputs and data
  action$ = new BehaviorSubject({ type: 'INITIAL_STATE', payload: null });

  //////////////////
  // User Input Streams
  eventData$ = this.http.get('/assets/data.js')
  .map(response => {
    return response.json();
  })
  .map(data => {
    return ({ type: 'LOAD_DATA', payload: data })
  })
  .catch(this.handleError)
  .subscribe(action => {
    if (action.payload) {
      this.action$.next(action);
    }
  })
  ;

  uncheckedEventsList$ = this.subjectUncheckedEvent
    .scan((acc, value) => {
      const list = value.isChecked ? acc.filter(s => s != value.event) : [...acc, value.event];
      return list;
    }
    , new Array<string>())
  ;

  newCheck$ = this.uncheckedEventsList$
    .withLatestFrom(
      this.subjectUncheckedEvent,
    ( list, uncheckedEvent) => {
      return { type: 'CHECK_EVENT', payload: { event: uncheckedEvent, list: list } };
    })
    .subscribe(action => {
      if (action.payload.event.event != "") {
        this.action$.next(action);
      }
    })
  ;

  newStart$ = this.subjectStartMonth
    .withLatestFrom(
    this.uncheckedEventsList$,
    (start, list) => {
      return { type: 'SELECT_START', payload: { start: start, list: list } };
    })
    .subscribe(action => {
      if (action.payload.start != null) {
        this.action$.next(action);
      }
    })
  ;

  newEnd$ = this.subjectEndMonth
    // .do(() => (console.log('event end')))
    .withLatestFrom(
    this.uncheckedEventsList$,
    (end, list) => {
      return { type: 'SELECT_END', payload: { end: end, list: list } };
    })
    .subscribe(action => {
      if (action.payload.end != null) {
        this.action$.next(action);
      }
    })
  ;

  ///////////////
  // State
  state$ = this.action$.scan((state, action ) => {
    const events = this.eventDataStream.value;

    switch (action.type) {
      // case 'INITIAL_STATE': {
      //   return ({ data: new Array<ClinicalEventItem>() });
      // }
      case 'LOAD_DATA': {
        const initialDates = this.getMinMaxDates(action.payload);
        this.eventDataStream.next(action.payload);
        return ({ data: action.payload, start: initialDates.minDate, end: initialDates.maxDate });
      }
      case 'CHECK_EVENT': {
        const viewData = this.buildViewEvents(action.payload.event, events, action.payload.list, state.start, state.end);
        const newDates = this.getMinMaxDates(viewData);
        return ({ data: viewData, start: newDates.minDate, end: newDates.maxDate });
      }
      case 'SELECT_START': {
        const { start, list } = action.payload;
        const newView = this.filterViewItems(events, start, state.end, list);
        return { data: newView, start: start, end: state.end };
      }
      case 'SELECT_END':
        const { end, list } = action.payload;
        const newView = this.filterViewItems(events, state.start, end, list);
        return { data: newView, start: state.start, end: end };
      default:
        return state;
    }
  }, {data: new Array<ClinicalEventItem>(), start: this.subjectStartMonth.value, end: this.subjectEndMonth.value })
  .shareReplay()
  ;

  /////////////
  // Reducers
  buildViewEvents(event, events, list, start: Date, end: Date): Array<ClinicalEventItem> {
    const isInsideTimeFrame = this.eventInTimeFrame
      (event.event, start, end, events);
      let startDate: Date = start;
      let endDate: Date = end;
    if (event.isChecked &&
      !isInsideTimeFrame) {
      const occurences = events.filter((e) => e.clinicalevent === event.event);
      const minMaxDates = this.getMinMaxDates(occurences);
      startDate = start <= minMaxDates.minDate ? start : minMaxDates.minDate;
      endDate = end > minMaxDates.maxDate ? end : minMaxDates.maxDate;
    }
    return this.filterViewItems(events, startDate, endDate, list);
  }
  filterViewItems(events, minDate, maxDate, list): Array<ClinicalEventItem> {
    // let minDate = new Date(timeframeStart);
    // let maxDate = new Date(timeframeEnd);

    const events_filteredByDate = events.filter((event) => {
      let date = new Date(event.eventtime);
      // if (!(date >= minDate && date <= maxDate)) console.log(event.clinicalevent + " " + event.eventtime);
      return (date >= minDate && date <= maxDate);
    });

    const events_filteredByDateAndEventSelection =
      events_filteredByDate.filter((event) => !_.includes(list, event.clinicalevent));

    return events_filteredByDateAndEventSelection;
  }

  ///////////////////
  // Selectors:  computed properties on eventsSubject

  initialMonths$ = this.eventDataStream
    .map(events => {
      const dates = this.getMinMaxDates(events);
      return ({ minDate: dates.minDate, maxDate: dates.maxDate })
    });

  monthRange$: Observable<MonthViewmodel[]> = this.eventDataStream
    .switchMap(events => {
      let datasetMinMaxDates = this.getMinMaxDates(events);
      return Observable.of(this.getMonthRange(datasetMinMaxDates.minDate, datasetMinMaxDates.maxDate))
        ;
    });

  /////////////
  //View Model Builder Observables
  chartView$: Observable<ClinicaleventChartViewmodel> =
  this.state$
    .map(events => {
      if (events.data.length === 0 ) {
        return null;
      }

      let monthRangeLength = this.getMonthRange(
        events.start,
        events.end
      ).length;

      const viewModel: ClinicaleventChartViewmodel = {
        eventItems:  this.prepareData(events.data),
        report: this.clinicalEventReport,
        monthsInCurrentTimeframe: monthRangeLength,
        minDate: events.start,
        maxDate: events.end
      }
      return viewModel;
    })

  ;

  eventList$: Observable<Array<EventItemViewGroup>> = this.state$
    .withLatestFrom(this.eventDataStream,
    this.uncheckedEventsList$,
    (state, allEvents, uncheckedEvents) => {

      const eventsOutsideTimeframe = this.getEventsNotInView(state.data, allEvents);
      const eventList: ClinicalEventItem[] = _.uniqBy(allEvents, 'clinicalevent');

      const eventSections: Array<EventItemViewGroup> = [
        { title: "Diagnosis", events: new Array<EventItemViewmodel>() },
        { title: "Treatment", events: new Array<EventItemViewmodel>() },
        { title: "Quality of Life", events: new Array<EventItemViewmodel>() }
      ];
      const eventViewModels = eventList
        .reduce(function (acc, item, index) {
          let checkboxState =  !_.includes(eventsOutsideTimeframe, item.clinicalevent);
          let eventViewItem: EventItemViewmodel =
            {
              text: item.clinicalevent,
              isActive: checkboxState,
              eventType: item.eventtype,
              controlIndex: index
            };
          switch (item.eventtype) {
            case 0: {
              //Treatments
              acc[2].events.push(eventViewItem);
              break;
            }
            case 1: {
              //Quality of Life
              acc[1].events.push(eventViewItem);
              break;
            }
            case 2: {
              // Diagnosis section
              acc[0].events.push(eventViewItem);
              break;
            }
            default: { break; }
          }
          return acc;
        }, eventSections);

      return eventSections;
    })
    ;

  keyBarViewModel$: Observable<KeyBarViewmodel> = this.state$
    .withLatestFrom(this.monthRange$,
    (events, months) => {
      return this.getKeyBarModel(
        events.data,
        months
      );
    });

  //////////////
  // View Model Helper Fns
  getKeyBarModel(
    items: Array<ClinicalEventItem>,
    months: MonthViewmodel[]
  ): KeyBarViewmodel {
    // start month range:  first month in dataset overall timeframe to selected end month
    // end month range: selected start month to end month in dataset overall timeframe
    if (items.length === 0 || months.length === 0) {
      return null;
    }
    let minMaxMonths = this.getMinMaxDates(items);;

    const viewModelClone_Start = months.map(item => Object.assign({}, item));
    const viewModelClone = months.map(item => Object.assign({}, item));

    const startIndex = _.findIndex(viewModelClone_Start, (item) => moment(minMaxMonths.minDate).month() === moment(item.value).month());
    const endIndex = _.findIndex(viewModelClone, (item) => moment(minMaxMonths.maxDate).month() === moment(item.value).month());

    const startOptions = _.takeWhile(viewModelClone_Start, (element) => (element.id <= endIndex));
    const endOptions = _.slice(viewModelClone, startIndex, viewModelClone.length);

    const selectedStartMonthIndex = _.findIndex(startOptions, item => item.id === viewModelClone_Start[startIndex].id);
    const selectedEndMonthIndex = _.findIndex(endOptions, item => item.id === viewModelClone[endIndex].id);

    const viewModel: KeyBarViewmodel = {
      selectedStartMonth: startOptions[selectedStartMonthIndex],
      startMonthOptions: startOptions,
      selectedEndMonth: endOptions[selectedEndMonthIndex],
      endMonthOptions: endOptions
    }
    return viewModel;
  }
  eventInTimeFrame(event: string, start: Date, end: Date, events: ClinicalEventItem[]): boolean {

    return events.reduce((acc, item, index) => {
      const itemDate = new Date(item.eventtime);
      if (item.clinicalevent == event
        && itemDate >= start
        && itemDate <= end
      ) {
        return true
      }
      return acc;
    }, false);
  }
  getEventListViewModelItems(events: Array<ClinicalEventItem>): Array<EventItemViewmodel> {
    const eventSections: Array<EventItemViewGroup> = [
      { title: "Diagnosis", events: new Array<EventItemViewmodel>() },
      { title: "Treatment", events: new Array<EventItemViewmodel>() },
      { title: "Quality of Life", events: new Array<EventItemViewmodel>() }
    ];

    // const viewItemsClone = this.eventCheckboxViewItems
    //use reduce (fold) here to sort items into section array, additionally, set control index value  
    const eventViewModels = events
      .reduce(function (acc, item, index) {
        // let checkboxState = !_.includes(this.uncheckedEvents, item.clinicalevent) && !_.includes(this.eventsNotInTimeFrame, item.clinicalevent);
        let eventViewItem: EventItemViewmodel =
          {
            text: item.clinicalevent,
            isActive: true,
            eventType: item.eventtype,
            controlIndex: index
          };
        acc.push(eventViewItem);
        return acc;
      }, [])
      ;
    return eventViewModels;
  }
  getEventsNotInView(events: Array<ClinicalEventItem>, allEvents: Array<ClinicalEventItem>): Array<string> {
    const eventStringList = events.map((event) => event.clinicalevent);
    const eventStringList_NoDupes = _.uniq(eventStringList);

    const allEventsStringList = allEvents.map((event) => event.clinicalevent);
    const allEventsStringList_NoDupes = _.uniq(allEventsStringList);
    let x = _.difference(allEventsStringList_NoDupes, eventStringList_NoDupes)
    return x;
  }

  // clinicalevent-chart helper fns
  // generate the height above or below the unmarked axis based on item's index position
  genYValue(
    eventType: number,
    slots: number,
    offset: number,
    index: number
  ): number {
    let slotsAboveOrBelowAxis = slots / 2;

    let multiplier = (eventType === 1 || eventType == 2) ? 1 : -1; // multiplier used to position item above or below axis

    return multiplier * (slotsAboveOrBelowAxis - (index % (slots / 2))) * offset
  };
  getDate(s): Date {
    // input format: "eventtime": "2010-02-01",
    let strDate = new String(s);
    let year = +strDate.substr(0, 4);// unary operator converts string to number
    let month = +strDate.substr(5, 2) - 1;
    let day = +strDate.substr(8, 2);

    return new Date(year, month, day);
  }
  prepareData(dataset: ClinicalEventItem[]): ClinicalEventItemWrapper[] {
    let slots: number = 20;
    let offset: number = 3;
    this.clinicalEventReport = new ClinicalEventReport(slots, offset, null);

    let items: ClinicalEventItemWrapper[];

    // use reduce(fold) to build new list of wrapper items containing the yValue for chart elements
    let treatmentItems = dataset
      .filter(item => item.eventtype == 1 || item.eventtype == 2)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        return [...acc, ...ce];
      },
      new Array<ClinicalEventItemWrapper>()
      );

    let palativeItems = dataset.filter(item => item.eventtype == 0)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        return [...acc, ...ce];
      },
      new Array<ClinicalEventItemWrapper>()
      );
    // this is the list of all clinical event items to display  
    let fullList = [...treatmentItems, ...palativeItems];

    this.clinicalEventReport.wrappedItems = fullList;

    // set MaxDate/MinDate properties for timeline start and finish
    let FirstItem = fullList
      .reduce((acc, item) =>
        acc.itemDate < item.itemDate ? acc : item
      );
    this.clinicalEventReport.minDate = this.getDate(FirstItem.item.eventtime);

    let lastItem = fullList
      .reduce((acc, item) =>
        acc.itemDate > item.itemDate ? acc : item
      );
    this.clinicalEventReport.maxDate = this.getDate(lastItem.item.eventtime);

    return fullList;
  }

  // key Bar helper functions
  getMonthRange(minDate: Date, maxDate: Date): Array<MonthViewmodel> {
    if (minDate === null || maxDate === null) return new Array<MonthViewmodel> ();
    let min = minDate.getMonth();
    let max = maxDate.getMonth();
    let year = minDate.getFullYear();
    // naive implementation for demo only
    let range = _.range(min, max + 2);

    let viewItems = range.reduce(
      function (acc, item, index, array) {
        let monthIndex = item + 1;
        let monthValue = monthIndex < 10 ? "0" + monthIndex : monthIndex;
        let viewItem: MonthViewmodel = {
          viewValue: moment(`${year}-${monthValue}-01`).format("MMM, YYYY"),
          value: `${year}-${monthValue}-01`,
          id: index
        }
        return [...acc, viewItem];//_.concat(acc, [viewItem]);
      }, new Array<MonthViewmodel>());

    return viewItems;
  }
  getMinMaxDates(clinicalEvents: Array<ClinicalEventItem>): MinmaxDates {
    if (clinicalEvents.length === 0){
      return {minDate: null, maxDate: null}
    }
    let dates = clinicalEvents
      .map(event => new Date(event.eventtime));
    let minDate: Date = dates.reduce((acc, date) => {
      return date < acc ? date : acc;
    });
    let maxDate: Date = dates.reduce((acc, date) => {
      return date > acc ? date : acc;
    });
    // console.log('minDate UTC: ', minDate.toUTCString());
    return new MinmaxDates(
      minDate,
      maxDate
    );
  }

  ///////////////
  // Helper functions
  // getUTCDate(string): Date {
  //   return new Date(Date.UTC())
  // }

  // Event Handlers
  // This method manages the list when items are manually selected.
  filterEvents(item: string, checked: boolean) {
    this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
  }
  updateDate_Start(startDate: string) {
    this.subjectStartMonth.next(new Date(startDate));
  }
  updateDate_End(endDate: string) {
    this.subjectEndMonth.next(new Date(endDate));
  }

  ///////////
  // Load data
  loadEvents() {//Observable<{type: string, payload: Array<ClinicalEventItem> }> {
    this.http.get('/assets/data.js')
      .map(response => {
        return response.json();
      })
      .map(data => {
        return ({ type: 'LOAD_DATA', payload: data })
      })
      .catch(this.handleError)
      .subscribe(action => {
        if (action.payload) {
          this.action$.next(action);
        }
      })
      ;
  }
  handleError(res: Response | any) : Observable<any> {
    //TODO: create error object rather than string.
    let errorMessage = 'error';

    if (res instanceof Response) {
      const body = res.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMessage = `
        ${res.status} -
        ${res.statusText} - 
        ${err}
      `;
    }
    return Observable.throw(errorMessage);
  }
}