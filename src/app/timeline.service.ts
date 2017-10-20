import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
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
const enum LatestEvent {
  Initial,
  Check,
  DateSelect
}
const INITIAL_STATE = new Array<ClinicalEventItem>();

@Injectable()
export class TimelineService {
  constructor() { }

  public clinicalEventReport: ClinicalEventReport;
  private dataset = TestData.dataset;

  private clinicalEventItems$ = new BehaviorSubject<ClinicalEventItem[]>(this.initializeService(this.dataset));
  // private subject = new BehaviorSubject<ClinicalEventItem[]>(this.dataset);
  // clinicalEventItems$: Observable<ClinicalEventItem[]> = Observable.of(this.dataset);
  //this.subject.asObservable();

  // private subject = new BehaviorSubject<ClinicalEventItem[]>(this.initializeService(this.dataset));
  // clinicalEventItems$: Observable<ClinicalEventItem[]> = Observable.of(this.dataset);
  private lastEvent: LatestEvent = LatestEvent.Initial;
  private subjectMonthRange: BehaviorSubject<MonthViewmodel[]>;
  private subjectStartMonth: BehaviorSubject<string>;
  startMonth$: Observable<string>;
  private subjectEndMonth: BehaviorSubject<string>;
  endMonth$: Observable<string>;


  private subjectUncheckedEvent: BehaviorSubject<UserCheckEvent> = new BehaviorSubject<UserCheckEvent>({ event: "", isChecked: false });
  uncheckedEvent$ = this.subjectUncheckedEvent.asObservable();

  uncheckedEventsList$ = this.uncheckedEvent$
    .scan((acc, value) => {
      const list = value.isChecked ? acc.filter(s => s != value.event) : [...acc, value.event];
      return list;
    }
    , new Array<string>());



  ////////////////////////
  action$ = new BehaviorSubject({ type: 'INITIAL_STATE', payload: null });

  initalizeData$ = Observable.of(this.dataset)
    .map(events => ({ type: 'LOAD_EVENTS', events: events }));//
  //.subscribe(this.action$);
  testSubject = new BehaviorSubject(this.dataset);

  newCheck$ = this.uncheckedEvent$
    .withLatestFrom(
    this.testSubject,
    this.uncheckedEventsList$,
    this.startMonth$,
    this.endMonth$,
    (uncheckedEvent, events, list, start, end) => {
      return { type: 'CHECK_EVENT', payload: { event: uncheckedEvent, events: events, list: list, start: start, end: end } };
    }
    )
    .subscribe(action => {
      if (action.payload.event.event != "") {
        this.action$.next(action);
      }
    });

  state$ = this.action$.scan((state, action) => {
    switch (action.type) {
      case 'INITIAL_STATE': {
        return ({ data: this.dataset });
      }
      case 'LOAD_EVENTS':
        return ({ data: this.dataset });
      case 'CHECK_EVENT': {
        const payload = action.payload;
        const viewData = this.buildViewEvents(
          payload.event,
          payload.events,
          payload.list,
          payload.start,
          payload.end);
        return ({ data: viewData });

        //  return ({data: this.dataset, viewData: this.dataset});
      }
      // case 'SELECT_START':
      //   return state;;
      // case 'SELECT_END':
      //   return state;;
      default:
        return state;
    }
  }, { data: new Array<ClinicalEventItem>() });
  // event: uncheckedEvent, events: events, userUncheckedEvents: list, startDate: start, EndDate: end 
  buildViewEvents(event, events, list, start, end): Array<ClinicalEventItem> {
    let timeframeStart;
    let timeframeEnd;
    // test whether latest event is unchecked event and unchecked event is outside current timeframe and checked = true 
    const isInsideTimeFrame = this.eventInTimeFrame
      (event.event, start, end, events);
    if (this.lastEvent == LatestEvent.Check &&
      event.isChecked &&
      !isInsideTimeFrame) {
      const occurences = events.filter((event) => event.clinicalevent === event.event);
      const minMaxDates = this.getMinMaxDates(occurences);
      timeframeStart = start < minMaxDates.minDate ? start : minMaxDates.minDate;
      timeframeEnd = end > minMaxDates.maxDate ? end : minMaxDates.maxDate;
    }
    else {
      timeframeStart = start;
      timeframeEnd = end;
    }
    let minDate = new Date(timeframeStart);
    let maxDate = new Date(timeframeEnd);
    return this.filterViewItems(events, minDate, maxDate, list);
    // const events_filteredByDate = events.filter((event) => {
    //   let date = new Date(event.eventtime);
    //   return (date >= minDate && date <= maxDate);
    // });

    // const events_filteredByDateAndEventSelection =
    //   events_filteredByDate.filter((event) => !_.includes(list, event.clinicalevent));

    // return events_filteredByDateAndEventSelection;
  }
  filterViewItems(events, minDate, maxDate, list): Array<ClinicalEventItem> {
    const events_filteredByDate = events.filter((event) => {
      let date = new Date(event.eventtime);
      return (date >= minDate && date <= maxDate);
    });

    const events_filteredByDateAndEventSelection =
      events_filteredByDate.filter((event) => !_.includes(list, event.clinicalevent));

    return events_filteredByDateAndEventSelection;
  }
  // initalizeData$ = Observable.of(this.dataset)
  //   .map(events => ({ type: 'LOAD_EVENTS', events: events }))
  //   .subscribe(this.action$);
  ////////////////  


  viewEvents$ = this.clinicalEventItems$
    .combineLatest(
    this.uncheckedEvent$,
    this.uncheckedEventsList$,
    this.startMonth$,
    this.endMonth$,
    (events, uncheckedEvent, list, start, end) => {
      let timeframeStart;
      let timeframeEnd;
      // test whether latest event is unchecked event and unchecked event is outside current timeframe and checked = true 
      const isInsideTimeFrame = this.eventInTimeFrame
        (uncheckedEvent.event, start, end, events);
      if (this.lastEvent == LatestEvent.Check &&
        uncheckedEvent.isChecked &&
        !isInsideTimeFrame) {
        const occurences = events.filter((event) => event.clinicalevent === uncheckedEvent.event);
        const minMaxDates = this.getMinMaxDates(occurences);
        timeframeStart = start < minMaxDates.minDate ? start : minMaxDates.minDate;
        timeframeEnd = end > minMaxDates.maxDate ? end : minMaxDates.maxDate;
      }
      else {
        timeframeStart = start;
        timeframeEnd = end;
      }
      let minDate = new Date(timeframeStart);
      let maxDate = new Date(timeframeEnd);

      const events_filteredByDate = events.filter((event) => {
        let date = new Date(event.eventtime);
        return (date >= minDate && date <= maxDate);
      });

      const events_filteredByDateAndEventSelection =
        events_filteredByDate.filter((event) => !_.includes(list, event.clinicalevent));

      return events_filteredByDateAndEventSelection;
    })

  ;
  sharedEvents$ = new Subject();

  // const newSubject = this.viewEvents$.subscribe(this.sharedEvents$);
  // ;
  // sharedEvents$ = this.viewEvents$.share();

  chartView$: Observable<ClinicaleventChartViewmodel> =
  this.state$
    .map(events => {

      let minMaxMonths = this.getMinMaxDates(events.data);
      let monthRangeLength = this.getMonthRange(
        minMaxMonths.minDate,
        minMaxMonths.maxDate
      ).length;

      const viewModel: ClinicaleventChartViewmodel = {
        eventItems: this.prepareData(events.data),
        report: this.clinicalEventReport,
        monthsInCurrentTimeframe: monthRangeLength,
        minDate: new Date(minMaxMonths.minDate),
        maxDate: new Date(minMaxMonths.maxDate)
      }
      return viewModel;
    })

  ;

  eventList$: Observable<Array<EventItemViewGroup>> = this.viewEvents$
    .withLatestFrom(this.clinicalEventItems$,
    this.uncheckedEventsList$,
    (list, allEvents, uncheckedEvents) => {
      const eventsOutsideTimeframe = this.getEventsNotInView(list, allEvents);
      const eventList: ClinicalEventItem[] = _.uniqBy(allEvents, 'clinicalevent');

      const eventSections: Array<EventItemViewGroup> = [
        { title: "Diagnosis", events: new Array<EventItemViewmodel>() },
        { title: "Treatment", events: new Array<EventItemViewmodel>() },
        { title: "Quality of Life", events: new Array<EventItemViewmodel>() }
      ];
      const eventViewModels = eventList
        .reduce(function (acc, item, index) {
          let checkboxState = !_.includes(uncheckedEvents, item.clinicalevent) && !_.includes(eventsOutsideTimeframe, item.clinicalevent);
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
    });

  monthRange$: Observable<MonthViewmodel[]> = this.clinicalEventItems$
    .switchMap(events => {
      let datasetMinMaxDates = this.getMinMaxDates(events);
      return Observable.of(this.getMonthRange(datasetMinMaxDates.minDate, datasetMinMaxDates.maxDate))
        ;
    })
    .distinctUntilChanged();

  keyBarViewModel$: Observable<KeyBarViewmodel> = this.viewEvents$
    .withLatestFrom(this.monthRange$,
    (events, months) => {
      return this.getKeyBarModel(
        events,
        months
      );
    });


  // Helper Fns
  initializeService(clinicalEvents: Array<ClinicalEventItem>): Array<ClinicalEventItem> {
    this.subjectStartMonth = new BehaviorSubject<string>(clinicalEvents[0].eventtime);
    this.startMonth$ = this.subjectStartMonth.asObservable();
    this.subjectEndMonth = new BehaviorSubject<string>(clinicalEvents[clinicalEvents.length - 1].eventtime);
    this.endMonth$ = this.subjectEndMonth.asObservable();

    this.subjectEndMonth = new BehaviorSubject<string>(clinicalEvents[clinicalEvents.length - 1].eventtime);
    this.endMonth$ = this.subjectEndMonth.asObservable()
    //initialize event-list state items
    const viewItems = this.getEventListViewModelItems(clinicalEvents);

    const noDupes = _.uniqBy(viewItems, 'text');
    // this.eventCheckboxViewItems = noDupes;
    return clinicalEvents;
  }
  getKeyBarModel(
    items: Array<ClinicalEventItem>,
    months: MonthViewmodel[]
  ): KeyBarViewmodel {
    // start month range:  first month in dataset overall timeframe to selected end month
    // end month range: selected start month to end month in dataset overall timeframe
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
  initializeMonthViewModel(clinicalEventItems: Array<ClinicalEventItem>): Array<MonthViewmodel> {
    const minMaxDates = this.getMinMaxDates(clinicalEventItems);
    return this.getMonthRange(minMaxDates.minDate, minMaxDates.maxDate);
  }
  eventInTimeFrame(event: string, start: string, end: string, events: ClinicalEventItem[]): boolean {
    // const dates = this.getMinMaxDates
    const startDate = new Date(start);
    const endDate = new Date(end);

    return events.reduce((acc, item, index) => {
      const itemDate = new Date(item.eventtime);
      if (item.clinicalevent == event
        && itemDate >= startDate
        && itemDate <= endDate
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
    //TODO: add regex test of date format
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
  getMonthRange(minDate: string, maxDate: string): Array<MonthViewmodel> {
    let min = moment(minDate).month();
    let max = moment(maxDate).month();
    let year = moment(minDate).year();
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
    let dates = clinicalEvents
      .map(event => new Date(event.eventtime));
    let minD = _.min(dates.map(date => date.getTime()));
    let maxD = _.max(dates.map(date => date.getTime()));
    let min = moment(minD).format('YYYY-MM-DD');
    let max = moment(maxD).format('YYYY-MM-DD');

    //emit min and max dates for current data set 
    return new MinmaxDates(
      min,
      max
    );
  }

  // Event Handlers
  // This method manages the list when items are manually selected.
  filterEvents(item: string, checked: boolean) {
    this.lastEvent = LatestEvent.Check;
    this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
    //this.action$.next({type: 'CHECK_EVENT', payload: null});
  }
  updateDate_Start(startDate: string) {
    this.lastEvent = LatestEvent.DateSelect;
    this.subjectStartMonth.next(startDate);
  }
  updateDate_End(endDate: string) {
    this.lastEvent = LatestEvent.DateSelect;
    this.subjectEndMonth.next(endDate);
  }
}

