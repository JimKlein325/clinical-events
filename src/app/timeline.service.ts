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

@Injectable()
export class TimelineService {
  constructor() { }

  public clinicalEventReport: ClinicalEventReport;
  private dataset = TestData.dataset;

  private subjectMonthRange: BehaviorSubject<MonthViewmodel[]>;
  private subjectStartMonth: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private subjectEndMonth: BehaviorSubject<string> = new BehaviorSubject<string>("");


  private subjectUncheckedEvent: BehaviorSubject<UserCheckEvent> = new BehaviorSubject<UserCheckEvent>({ event: "", isChecked: false });

  
  
  
  ////////////////////////
  action$ = new BehaviorSubject({ type: 'INITIAL_STATE', payload: null });
  
  testSubject = new BehaviorSubject(this.dataset)
  // .map(events => ({type: 'LOAD_EVENTS', payload: events}))
  .do(() => console.log('event: testSubject'))
  ;

  ///////////////////
  // Selectors:  computed properties on eventsSubject
  httpTest$ = this.testSubject
  .map(events => ({ type: 'LOAD_EVENTS', payload: events }))
  .do(() => (console.log('event: httpTest')))
  .subscribe(this.action$);
  
  initialMonths$ = this.testSubject
  .do(()=> console.log('initial Months'))
  .map(events => {
    const dates = this.getMinMaxDates(events);
    return ({ minDate: dates.minDate, maxDate: dates.maxDate })
  });

  monthRange$: Observable<MonthViewmodel[]> = this.testSubject
  .switchMap(events => {
    let datasetMinMaxDates = this.getMinMaxDates(events);
    return Observable.of(this.getMonthRange(datasetMinMaxDates.minDate, datasetMinMaxDates.maxDate))
      ;
  })
  .distinctUntilChanged();


 //////////////////
 // User Input Streams
  uncheckedEventsList$ = this.subjectUncheckedEvent
    .scan((acc, value) => {
      const list = value.isChecked ? acc.filter(s => s != value.event) : [...acc, value.event];
      return list;
    }
    , new Array<string>())
    .do(() => console.log('event: list'))
  ;

  newCheck$ = this.subjectUncheckedEvent
  .do(() => (console.log('event check')))
  .withLatestFrom(
    this.testSubject,
    this.uncheckedEventsList$,
    this.subjectStartMonth,
    this.subjectEndMonth,
    this.initialMonths$,
    (uncheckedEvent, events, list, start, end, initialMonths) => {
      return { type: 'CHECK_EVENT', payload: { event: uncheckedEvent, events: events, list: list, start: start === "" ? initialMonths.minDate : start, end: end === "" ? initialMonths.maxDate : end } };
    }
  )
  .do(action => console.log('unchecked subscribed', action.payload ))
  .subscribe(action => {
    if (action.payload.event.event != "") {
      this.action$.next(action);
    }
  });
  
  newStart$ = this.subjectStartMonth
    .do(() => (console.log('event start')))
    .withLatestFrom(
    this.testSubject,
    this.uncheckedEventsList$,
    this.subjectEndMonth,
    this.initialMonths$,
    (start, events, list, end, initialMonths) => {
      return { type: 'SELECT_START', payload: { start: start === "" ? initialMonths.minDate : start, events: events, list: list, end: end === "" ? initialMonths.maxDate : end } };
    })
    .subscribe(action => {
      if (action.payload.start != "") {
        this.action$.next(action);
      }
    });

  newEnd$ = this.subjectEndMonth
    .do(() => (console.log('event end')))
    .withLatestFrom(
    this.testSubject,
    this.uncheckedEventsList$,
    this.subjectStartMonth,
    this.initialMonths$,
    (end, events, list, start, initialMonths) => {
      return { type: 'SELECT_END', payload: { start: start === "" ? initialMonths.minDate : start, events: events, list: list, end: end } };
    })
    .do(() => console.log('end called'))
    .subscribe(action => {
      if (action.payload.end != "") {
        this.action$.next(action);
      }
    })
  ;
  
  ///////////////
  // State
  state$ = this.action$.scan((state, action) => {
    switch (action.type) {
      case 'INITIAL_STATE': {
        return ({ data: new Array<ClinicalEventItem>() });
      }
      case 'LOAD_EVENTS': {
        return ({ data: action.payload });
      }
      case 'CHECK_EVENT': {
        const viewData = this.buildViewEvents(action.payload.event, action.payload.events, action.payload.list, action.payload.start, action.payload.end);
        return ({ data: viewData });
      }
      case 'SELECT_START': {
        const { events, start, end, list } = action.payload;
        const newView = this.filterViewItems(events, start, end, list);
        return { data: newView };
      }
      case 'SELECT_END':
        const { events, start, end, list } = action.payload;
        const newView = this.filterViewItems(events, start, end, list);
        return { data: newView };
      default:
        return state;
    }
  }, { data: new Array<ClinicalEventItem>() })
  ;

  /////////////
  // Reducers
  buildViewEvents(event, events, list, start, end): Array<ClinicalEventItem> {
    const isInsideTimeFrame = this.eventInTimeFrame
      (event.event, start, end, events);
    if (event.isChecked &&
      !isInsideTimeFrame) {
      const occurences = events.filter((e) => e.clinicalevent === event.event);
      const minMaxDates = this.getMinMaxDates(occurences);
      start = start < minMaxDates.minDate ? start : minMaxDates.minDate;
      end = end > minMaxDates.maxDate ? end : minMaxDates.maxDate;
    }
    return this.filterViewItems(events, start, end, list);
  }
  filterViewItems(events, timeframeStart, timeframeEnd, list): Array<ClinicalEventItem> {
    let minDate = new Date(timeframeStart);
    let maxDate = new Date(timeframeEnd);

    const events_filteredByDate = events.filter((event) => {
      let date = new Date(event.eventtime);
      return (date >= minDate && date <= maxDate);
    });

    const events_filteredByDateAndEventSelection =
      events_filteredByDate.filter((event) => !_.includes(list, event.clinicalevent));

    return events_filteredByDateAndEventSelection;
  }

  /////////////
  //View Model Builder Observables
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

  eventList$: Observable<Array<EventItemViewGroup>> = this.state$
    .withLatestFrom(this.testSubject,
    this.uncheckedEventsList$,
    (list, allEvents, uncheckedEvents) => {
      const eventsOutsideTimeframe = this.getEventsNotInView(list.data, allEvents);
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
    })
    .share();

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
    this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
  }
  updateDate_Start(startDate: string) {
    this.subjectStartMonth.next(startDate);
  }
  updateDate_End(endDate: string) {
    this.subjectEndMonth.next(endDate);
  }
}

