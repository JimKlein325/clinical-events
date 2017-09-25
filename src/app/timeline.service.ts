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

  public clinicalEventReport: ClinicalEventReport;

  private dataset = TestData.dataset;
  private eventsNotInTimeFrame: string[] = [];
  private uncheckedEvents: string[] = [];
  private clinicalEvents: string[];

  private selectedStartMonth: string;
  private selectedEndMonth: string;
  private datasetStartMonth: string;
  private datasetEndMonth: string;
  private datasetMonthValues: Array<MonthViewmodel>;
  private startSelectValues: Array<Date>;
  private endSelectValues: Array<Date>;
  private datasetMinMaxDates: MinmaxDates;
  private eventCheckboxViewItems: Array<EventItemViewmodel>;

  private subject = new BehaviorSubject<ClinicalEventItem[]>(this.initializeService_Reactive(this.dataset));
  clinicalEventItems$: Observable<ClinicalEventItem[]> = this.subject.asObservable();

  private subjectMonthRange: BehaviorSubject<MonthViewmodel[]>;
  private subjectStartMonth: BehaviorSubject<string>;
  startMonth$: Observable<string>;
  private subjectEndMonth: BehaviorSubject<string>;
  endMonth$: Observable<string>;
  private subjectUncheckedEvent: BehaviorSubject<UserCheckEvent> = new BehaviorSubject<UserCheckEvent>({ event: "", isChecked: false });
  uncheckedEvent$ = this.subjectUncheckedEvent.asObservable();

  uncheckedEventsList$ = this.uncheckedEvent$
    .scan((acc, value, index) => {
      const list = value.isChecked ? acc.filter((s) => s != value.event) : [...acc, value.event];
      return list;
    }
    , new Array<string>());

  constructor() { }


  wrappedEvents$: Observable<ClinicalEventItemWrapper[]> = this.clinicalEventItems$

    .switchMap(events => {
      return Observable.of(this.prepareData(events));
    });

  viewEvents$ = this.clinicalEventItems$
    .withLatestFrom(
    this.uncheckedEvent$,
    this.startMonth$,
    this.endMonth$,
    (events, uncheckedEvent, start, end) => {
      let timeframeStart;
      let timeframeEnd;
      if (uncheckedEvent.isChecked && !this.eventInTimeFrame(uncheckedEvent.event, start, end, events)) {
        // set start end dates to min max dates of event occurence
        const occurences = events.filter((event) => event.clinicalevent === uncheckedEvent.event);
        const minMaxDates = this.getMinMaxDates(occurences);
        timeframeStart = start < minMaxDates.minDate? start : minMaxDates.minDate;
        timeframeEnd = end > minMaxDates.maxDate? end: minMaxDates.maxDate;
        //this.uncheckedEventsList$
      }
      else {
        //then dates stay the same
        timeframeStart = start;
        timeframeEnd = end;
      }
      // filter results
      let minDate = new Date(timeframeStart);
      let maxDate = new Date(timeframeEnd);

      return events.filter((event) => {
        let date = new Date(event.eventtime);
        return (date >= minDate && date <= maxDate);
      });
    })
    .withLatestFrom(this.uncheckedEventsList$, (events, list) => {
      const ve = events.filter((event) => !_.includes(list, event.clinicalevent));
             return ve;
    })
    // .share()
  ;

  chartView$: Observable<ClinicaleventChartViewmodel> =
  // this.clinicalEventItems$
  this.viewEvents$
    .switchMap(events => {

      let minMaxMonths = this.getMinMaxDates(events);
      let monthRangeLength = this.getMonthRange(
        minMaxMonths.minDate,
        minMaxMonths.maxDate
      ).length;

      const viewModel: ClinicaleventChartViewmodel = {
        eventItems: this.prepareData(events),
        report: this.clinicalEventReport,
        monthsInCurrentTimeframe: monthRangeLength,
        minDate: new Date(minMaxMonths.minDate),
        maxDate: new Date(minMaxMonths.maxDate)
      }
      //console.log(viewModel);      
      return Observable.of(viewModel);
    })
    ;

  // keyBarModel$: Observable<KeyBarViewmodel> = this.clinicalEventItems$
  keyBarModel$: Observable<KeyBarViewmodel> = this.viewEvents$
    .switchMap(events => {
      return Observable.of(
        this.getKeyBarModel(events, null)
      );
    });

  initializeService(clinicalEvents: Array<ClinicalEventItem>): Array<ClinicalEventItem> {
    // initialize Key-Bar state items
    this.datasetMinMaxDates = this.getMinMaxDates(clinicalEvents);
    this.datasetMonthValues = this.getMonthRange(this.datasetMinMaxDates.minDate, this.datasetMinMaxDates.maxDate);
    this.selectedStartMonth = this.datasetMinMaxDates.minDate;
    this.selectedEndMonth = this.datasetMinMaxDates.maxDate;
    const v = this.getEventListViewModelItems
    //initialize event-list state items
    const viewItems = this.getEventListViewModelItems(clinicalEvents);

    const noDupes = _.uniqBy(viewItems, 'text');
    this.eventCheckboxViewItems = noDupes;
    return clinicalEvents;
  }
  monthRange$: Observable<MonthViewmodel[]> = this.clinicalEventItems$
    .switchMap(events => {
      let datasetMinMaxDates = this.getMinMaxDates(events);
      return Observable.of(this.getMonthRange(datasetMinMaxDates.minDate, datasetMinMaxDates.maxDate))
        ;
    })
    .distinctUntilChanged();

  keyBarModel_Reactive$: Observable<KeyBarViewmodel> = this.viewEvents$
  // .share()
    .withLatestFrom(this.monthRange$,
    (events, months) => {
      return this.getKeyBarModel(
        events,
        months
      );
    });

  initializeService_Reactive(clinicalEvents: Array<ClinicalEventItem>): Array<ClinicalEventItem> {
    this.subjectStartMonth = new BehaviorSubject<string>(clinicalEvents[0].eventtime);
    this.startMonth$ = this.subjectStartMonth.asObservable()

    this.subjectEndMonth = new BehaviorSubject<string>(clinicalEvents[clinicalEvents.length - 1].eventtime);
    this.endMonth$ = this.subjectEndMonth.asObservable()
    //initialize event-list state items
    const viewItems = this.getEventListViewModelItems(clinicalEvents);

    const noDupes = _.uniqBy(viewItems, 'text');
    this.eventCheckboxViewItems = noDupes;
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
      startMonthOptions: startOptions,//startOptions,
      selectedEndMonth: endOptions[selectedEndMonthIndex],
      endMonthOptions: endOptions
    }
    return viewModel;
  }
  getChartViewModel(
    items: Array<ClinicalEventItem>,
    selectedStartMonth: string,
    selectedEndMonth: string
  ): ClinicaleventChartViewmodel {
    let minMaxMonths = this.getMinMaxDates(items);
    let monthRangeLength = this.getMonthRange(
      minMaxMonths.minDate,
      minMaxMonths.maxDate
    ).length;

    const viewModel: ClinicaleventChartViewmodel = {
      eventItems: this.prepareData(items),
      report: this.clinicalEventReport,
      monthsInCurrentTimeframe: monthRangeLength,
      minDate: new Date(minMaxMonths.minDate),
      maxDate: new Date(minMaxMonths.maxDate)
    }
    return viewModel;
  }

  initializeMonthViewModel(clinicalEventItems: Array<ClinicalEventItem>): Array<MonthViewmodel> {
    const minMaxDates = this.getMinMaxDates(clinicalEventItems);
    return this.getMonthRange(minMaxDates.minDate, minMaxDates.maxDate);
  }

  getStartDateOptions(): Observable<KeyBarViewmodel> {
    //initialize Month view item list -- hack
    this.clinicalEventItems$
      .do(items => {
        if (this.datasetMonthValues === undefined) {
          this.datasetMonthValues = this.initializeMonthViewModel(items);
        }
      }).subscribe();

    let initialSetofMonths = this.datasetMonthValues;

    return this.clinicalEventItems$
      .switchMap((items) => {
        let minMaxMonths = this.getMinMaxDates(items);

        const startIndex = _.findIndex(initialSetofMonths, (item) => moment(minMaxMonths.minDate).month() === moment(item.value).month());
        const endIndex = _.findIndex(initialSetofMonths, (item) => moment(minMaxMonths.maxDate).month() === moment(item.value).month());

        const startOptions = _.takeWhile(initialSetofMonths, (element) => (element.id <= endIndex));
        const endOptions = _.slice(initialSetofMonths, startIndex, initialSetofMonths.length);

        const selectedStartMonthIndex = _.findIndex(startOptions, item => item.id === initialSetofMonths[startIndex].id);
        const selectedEndMonthIndex = _.findIndex(endOptions, item => item.id === initialSetofMonths[endIndex].id);


        // adding one month to the selected end month, then using < comparison will capture any month before the selected month
        let endSelection = moment(this.datasetEndMonth);
        let subsequentMonth = endSelection.add(1, 'M');
        const viewModel: KeyBarViewmodel = {
          selectedStartMonth: startOptions[selectedStartMonthIndex],
          startMonthOptions: startOptions,
          selectedEndMonth: endOptions[selectedEndMonthIndex],
          endMonthOptions: endOptions
        }
        return Observable.of(viewModel);

      });
  }

  inDateRange(dateString: string): boolean {
    let date = new Date(dateString);

    let dates = this.dataset.map(item => new Date(item.eventtime));
    let minD: Date = _.min(dates);
    let maxD: Date = _.max(dates);
    let inRange = minD <= date && date <= maxD;
    return inRange
      ;
  }

  eventInTimeFrame(event: string, start: string, end: string, events: ClinicalEventItem[]): boolean {
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
  eventList_Reactive$: Observable<Array<EventItemViewGroup>> = this.viewEvents$ // this.clinicalEventItems$
    .withLatestFrom(this.clinicalEventItems$, this.uncheckedEventsList$, (list, allEvents, uncheckedEvents) => {
      const eventsOutsideTimeframe = this.getEventsNotInView_Reactive(list, allEvents);
      const eventList: ClinicalEventItem[] = _.uniqBy(allEvents, 'clinicalevent');

      eventList.map(item => {

      });
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

  eventList$: Observable<Array<EventItemViewGroup>> = this.clinicalEventItems$
    .map(items => {
      this.eventsNotInTimeFrame = this.getEventsNotInView(items);

      const eventSections: Array<EventItemViewGroup> = [
        { title: "Diagnosis", events: new Array<EventItemViewmodel>() },
        { title: "Treatment", events: new Array<EventItemViewmodel>() },
        { title: "Quality of Life", events: new Array<EventItemViewmodel>() }
      ];
      const viewItemsClone = this.eventCheckboxViewItems
        .map(eventItem => Object.assign({}, eventItem))
        .map(item => {
          let checkboxState = !_.includes(this.uncheckedEvents, item.text) && !_.includes(this.eventsNotInTimeFrame, item.text);
          const event: EventItemViewmodel =
            {
              text: item.text,
              isActive: checkboxState,
              eventType: item.eventType,
              controlIndex: item.controlIndex
            };
          return event;
        })
        //use reduce here to sort items into section array, additionally, set control index value
        .reduce(function (acc, item, index) {
          item.controlIndex = index;
          switch (item.eventType) {
            case 0: {
              //Treatments
              acc[2].events.push(item);
              break;
            }
            case 1: {
              //Quality of Life
              acc[1].events.push(item);
              break;
            }
            case 2: {
              // Diagnosis section
              acc[0].events.push(item);
              break;
            }
            default: { break; }
          }
          return acc;
        }, eventSections)
        ;
      //console.log(eventSections);
      return eventSections;
    }
    );

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
  getEventsNotInView(events: ClinicalEventItem[]): Array<string> {
    //map ce's to viewItems
    let items = this.eventCheckboxViewItems;
    const eventsInView = events.map(item => {
      let event: EventItemViewmodel =
        _.find(items, ['text', item.clinicalevent]);
      return event;
    });

    const fullListOfEventsStrings = _.map(this.eventCheckboxViewItems, (event) => event.text);
    const fullListOfEvents = _.uniq(fullListOfEventsStrings);
    //de-dupe
    const eventsInViewStrings = _.map(eventsInView, (event) => event.text);
    const currentEvents = _.uniq(eventsInViewStrings);
    //compare to full list of items in dataset: eventCheckboxViewItems
    const eventsNotInCurrentView = _.difference(fullListOfEvents, currentEvents);
    //return a difference between full list and current view
    return eventsNotInCurrentView;
  }
  getEventsNotInView_Reactive(events: Array<ClinicalEventItem>, allEvents: Array<ClinicalEventItem>): Array<string> {
    const eventStringList = events.map((event) => event.clinicalevent);
    const eventStringList_NoDupes = _.uniq(eventStringList);

    const allEventsStringList = allEvents.map((event) => event.clinicalevent);
    const allEventsStringList_NoDupes = _.uniq(allEventsStringList);
    let x = _.difference(allEventsStringList_NoDupes, eventStringList_NoDupes)
    return x;
  }

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
        //console.log(ce);
        return [...acc, ...ce];
        // return acc.concat(ce);// refactor using spread operator ...
      },
      new Array<ClinicalEventItemWrapper>()
      );

    let palativeItems = dataset.filter(item => item.eventtype == 0)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        // array.push returns a number, so use concat here
        return [...acc, ...ce];
        // return acc.concat(ce);
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

  // Filter events using array of unchecked events stored in this.uncheckedEvents.  This method manages the list when items are manually selected.
  filterEvents(item: string, checked: boolean) {
    this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
    this.subject.next(this.dataset);
    // if (checked) {
    //   this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
    //   this.uncheckedEvents = this.uncheckedEvents.filter(element => element !== item);
    //   if (_.includes(this.eventsNotInTimeFrame, item)) {
    //     // if the selected event occurs outside of the current date range, update
    //     // start or end date so that range contains all occurrences of seleted event
    //     const datasetClone = this.dataset.map(a => Object.assign({}, a));
    //     const filteredList = datasetClone.filter(x => x.clinicalevent === item);
    //     let localMinMaxDate = this.getMinMaxDates(filteredList);

    //     if (localMinMaxDate.minDate < this.selectedStartMonth) {
    //       this.selectedStartMonth = localMinMaxDate.minDate;
    //     }
    //     if (localMinMaxDate.maxDate > this.selectedEndMonth) {
    //       this.selectedEndMonth = localMinMaxDate.maxDate;
    //     }
    //   }
    // }
    // else {
    //   this.subjectUncheckedEvent.next({ event: item, isChecked: checked });
    //   this.uncheckedEvents.push(item);
    // }
    // this.emitNewClinicalEventsSet();
  }

  updateDate_Start(startDate: string) {
    this.subjectStartMonth.next(startDate);
    this.subject.next(this.dataset);
    
    // If changing the start date eliminates some items from the view entirely,
    // update the list of eventsNotInTimeFrame

    //this.emitNewClinicalEventsSet();
  }

  updateDate_End(endDate: string) {
    this.selectedEndMonth = endDate;
    // this.emitNewClinicalEventsSet();
  }

  emitNewClinicalEventsSet() {
    const datasetClone = this.dataset.map(a => Object.assign({}, a));

    const filteredList = datasetClone.filter(x => {
      let d = moment(x.eventtime);
      let isLater = d > moment(this.selectedStartMonth) && d < moment(this.selectedEndMonth);
      return isLater;
    });

    const filteredList_checkedItems = filteredList
      .filter(x => !_.includes(this.uncheckedEvents, x.clinicalevent));
    console.log(filteredList_checkedItems);

    const newSet = this.prepareData(filteredList_checkedItems);

    this.subject.next(filteredList_checkedItems);
    // this.wrappedSubject.next(newSet);
  }

  // key Bar helper functions
  getMonthRange(minDate: string, maxDate: string): Array<MonthViewmodel> {
    let min = moment(minDate).month();
    let max = moment(maxDate).month();
    let year = moment(minDate).year();

    let range = _.range(min, max + 1);

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

    let initialMonth = moment(minDate).month();
    let viewMonth = moment(minDate).format("MMM, YYYY");

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
}

