import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
import * as _ from "lodash";
import * as moment from 'moment';

import { ClinicalEventItem } from "./clinicalevent-chart/models/clinical-event-item";
import { ClinicalEventReport } from "./clinicalevent-chart/models/clinical-event-report";
import { ClinicalEventItemWrapper } from "./clinicalevent-chart/models/clinical-event-item-wrapper";
import { EventItemViewmodel } from "./model/event-item-viewmodel";
import { MonthViewmodel } from "./model/month-viewmodel";
import { TestData } from "./model/test-data";
import { KeyBarViewmodel } from "./model/key-bar-viewmodel";

@Injectable()
export class TimelineService {

  public clinicalEventReport: ClinicalEventReport;

  private dataset = TestData.dataset;

  private subject = new BehaviorSubject<ClinicalEventItem[]>(this.dataset);

  private wrappedSubject = new BehaviorSubject<ClinicalEventItemWrapper[]>(this.prepareData(this.dataset));



  private eventsNotInTimeFrame: string[] = [];
  private uncheckedEvents: string[] = [];
  private clinicalEvents: string[];

  clinicalEventItems$: Observable<ClinicalEventItem[]> = this.subject.asObservable();

  // wrappedEvents$ = this.wrappedSubject.asObservable();
  wrappedEvents$: Observable<ClinicalEventItemWrapper[]> = this.clinicalEventItems$
    .switchMap(events => {
      return Observable.of(this.prepareData(events));
    }
    );

  private datasetStartMonth: string;
  private datasetEndMonth: string;

  private datasetMonthValues: Array<MonthViewmodel>;
  private startSelectValues: Array<Date>;
  private endSelectValues: Array<Date>;

  // date selection
  // startMonth$ = this.wrappedEvents$
  //   // .switchMap((value, index) => value.reduce((acc, item) =>
  //   //     acc.itemDate < item.itemDate ? acc : item
  //   .map(events => events.reduce((acc, item) =>
  //     acc.itemDate < item.itemDate ? acc : item)
  //   )
  //   .map(event => ({ value: event.item.eventtime, viewValue: moment(event.item.eventtime).format("MMM, YYYY") }));

  // testDate(dateString): boolean {
  //   let eventDate = new Date(dateString);

  //   let allDates = this.dataset.map(item => new Date(item.eventtime));
  //   let minD = _.min(allDates.map(date => date.getTime()));
  //   let maxD = _.max(allDates.map(date => date.getTime()));

  //   return minD >= eventDate <= maxD;
  // }

  maxMinDates$ = this.clinicalEventItems$
    .map(event => event.map(item => new Date(item.eventtime)))
    .switchMap(dates => {
      let minD = _.min(dates.map(date => date.getTime()));
      let maxD = _.max(dates.map(date => date.getTime()));
      let min = moment(minD).format('YYYY-MM-DD');
      let max = moment(maxD).format('YYYY-MM-DD');

      return [{
        minDate: minD,
        maxDate: maxD,
        minDateString: min,
        maxDateString: max
      }];
    });


  monthViewItems$: Observable<Array<MonthViewmodel>> = this.wrappedEvents$
    .map(event => event.map(wrapper => new Date(wrapper.item.eventtime)))
    .switchMap(dates => {

      let minD = _.min(dates.map(date => date.getTime()));
      let maxD = _.max(dates.map(date => date.getTime()));
      let min = moment(minD).format('YYYY-MM-DD');
      let max = moment(maxD).format('YYYY-MM-DD');

      if (!this.datasetStartMonth) {
        // values set to dataset min and max dates
        this.datasetStartMonth = min;
        this.datasetEndMonth = max;
      }

      //emit min and max dates for current data set 
      return [{
        minDate: min,
        maxDate: max
      }];
    })
    // build array of MonthViewmodel items
    .map(minMaxDates => {
      return this.getMonthRange(minMaxDates)
    })

  ;
  getMinMaxClinicalEvents(clinicalEventItems: Array<ClinicalEventItem>) {
    const dates = clinicalEventItems
      .map(item => new Date(item.eventtime));
    // .switchMap(dates => {

    let minD = _.min(dates.map(date => date.getTime()));
    let maxD = _.max(dates.map(date => date.getTime()));
    let min = moment(minD).format('YYYY-MM-DD');
    let max = moment(maxD).format('YYYY-MM-DD');

    if (!this.datasetStartMonth) {
      // values set to dataset min and max dates
      this.datasetStartMonth = min;
      this.datasetEndMonth = max;
    }
    const minMaxDates =
      //emit min and max dates for current data set 
      {
        minDate: min,
        maxDate: max
      };
    return minMaxDates;
  }

  initializeMonthViewModel(clinicalEventItems: Array<ClinicalEventItem>): Array<MonthViewmodel> {

    const minMaxDates = this.getMinMaxDates(clinicalEventItems);

    // this.datasetMonthValues = this.getMonthRange(minMaxDates);
    return this.getMonthRange(minMaxDates);
    // console.log(this.datasetMonthValues);
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
        let minMaxMonths = this.getMinMaxDates(items);// = this.initializeMonthViewModel(items);

        const startIndex = _.findIndex(initialSetofMonths, (item) => moment(minMaxMonths.minDate).month() === moment(item.value).month());
        const endIndex = _.findIndex(initialSetofMonths, (item) => moment(minMaxMonths.maxDate).month() === moment(item.value).month());

        const startOptions = _.takeWhile(initialSetofMonths, (element) => (element.id <= endIndex));
        const endOptions = _.slice(initialSetofMonths, startIndex, initialSetofMonths.length);

        const selectedStartMonthIndex = _.findIndex(startOptions, item => item.id === initialSetofMonths[startIndex].id);
        const selectedEndMonthIndex = _.findIndex(endOptions, item => item.id === initialSetofMonths[endIndex].id);


        //let current = moment(item.value);
        // adding one month to the selected end month, then using < comparison will capture any month before the selected month
        let endSelection = moment(this.datasetEndMonth);
        let subsequentMonth = endSelection.add(1, 'M');
        const viewModel: KeyBarViewmodel = {
          selectedStartMonth: startOptions[selectedStartMonthIndex],
          startMonthOptions: startOptions,//startOptions,
          selectedEndMonth: endOptions[selectedEndMonthIndex],
          endMonthOptions: endOptions
        }
        return Observable.of(viewModel);

      });
  }


  intermediateStep$: Observable<ClinicalEventItem[]> = this.clinicalEventItems$
    .do(items => {
      if (this.datasetMonthValues === undefined) {
        this.datasetMonthValues = this.initializeMonthViewModel(items);
      }
    })


  // startDateSelect$: Observable<KeyBarViewmodel> = this.intermediateStep$
  //   // filter if the user has selected a different end date
  //   .switchMap((items) => {
  //     let monthValues;// = this.initializeMonthViewModel(items);
  //     if (this.datasetMonthValues === undefined) {
  //       monthValues = this.initializeMonthViewModel(items);


  //     } else {

  //       //monthValues = this.datasetMonthValues;// = this.initializeMonthViewModel(items);
  //     }
  //     //gets the min and max selected dates
  //     const dates = this.getMinMaxDates(items);
  //     const monthVMID_start = this.datasetMonthValues.filter(item => moment(item.value) <= moment(dates.minDate))[0].id;
  //     const monthVMID_end = this.datasetMonthValues.filter(item => moment(item.value).month() === moment(dates.maxDate).month())[0].id;

  //     //let current = moment(item.value);
  //     // adding one month to the selected end month, then using < comparison will capture any month before the selected month
  //     let endSelection = moment(this.datasetEndMonth);
  //     let subsequentMonth = endSelection.add(1, 'M');
  //     const viewModel: KeyBarViewmodel = {
  //       selectedStartMonth: monthVMID_start,
  //       startMonthOptions: _.takeWhile(this.datasetMonthValues, (element) => !(element.id === monthVMID_end)),
  //       endMontselectedEndMonthhID: monthVMID_end,
  //       endMonthOptions: _.skipWhile(this.datasetMonthValues, (element) => !(element.id === monthVMID_start))
  //     }
  //     return Observable.of(viewModel);

  //   });

  endDateSelect$: Observable<Array<MonthViewmodel>> = this.monthViewItems$
    // filter if the user has selected a different end date
    .map(items => items.filter(item => {
      let current = moment(item.value);
      let minDate = this.getMinMaxDates(this.dataset);
      let startSelection = moment(minDate.minDate);
      let keepItem = current > startSelection;
      return keepItem;
    }))
  ;

  constructor() {
    //this.prepareData();
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
  private eventCheckboxViewItems: Array<EventItemViewmodel>;

  getEventList(): Observable<EventItemViewmodel[]> {

    return this.clinicalEventItems$
      .switchMap(items => {
        //first access initialize eventCheckboxViewItems
        if (this.eventCheckboxViewItems === undefined) {
          const viewItems = this.dataset.map(item => {
            const event: EventItemViewmodel =
              {
                text: item.clinicalevent,
                isActive: true,
                eventType: item.eventtype
              };
            return event;
          });
          const noDupes = _.uniqBy(viewItems, 'text');
          this.eventCheckboxViewItems = noDupes;
          return Observable.of(noDupes.map(a => Object.assign({}, a)));//this.clinicalEvents.map(a => Object.assign({}, a)));
        }
        //subsequent filtering of dataset in view:  update state of eventCheckboxViewItems list
        let eventsNotInCurrentView = this.getEventsNotInView(items);
        const viewItemsClone = this.eventCheckboxViewItems
          .map(a => Object.assign({}, a))
          .map(item => {
            let checkboxState = !_.includes(this.uncheckedEvents, item.text) && !_.includes(eventsNotInCurrentView, item.text);
            const event: EventItemViewmodel =
              {
                text: item.text,
                isActive: checkboxState,
                eventType: item.eventType
              };
            return event;
          });
        return Observable.of(viewItemsClone);

      });
  }

  getEventsNotInView(events: ClinicalEventItem[]): Array<string> {
    //map ce's to viewItems
    const eventsInView = events.map(item => {
            const event: EventItemViewmodel =
              {
                text: item.clinicalevent,
                isActive: true,
                eventType: item.eventtype
              };
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

  // generate the height above or below the unmarked axis based on item's index position
  genYValue(
    eventType: number,
    slots: number,
    offset: number,
    index: number
  ): number {
    let slotsAboveOrBelowAxis = slots / 2;

    let multiplier = (eventType == 1 || eventType == 2) ? 1 : -1; // multiplier used to position item above or below axis

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
        // array.push returns a number, so use concat here
        return acc.concat(ce);
      },
      new Array<ClinicalEventItemWrapper>()
      );

    let palativeItems = dataset.filter(item => item.eventtype == 0)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        // array.push returns a number, so use concat here
        return acc.concat(ce);
      },
      new Array<ClinicalEventItemWrapper>()
      );
    // this is the list of all clinical event items to display  
    let fullList = treatmentItems.concat(palativeItems);

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
    if (checked) {
      this.uncheckedEvents = this.uncheckedEvents.filter(element => element !== item);
    }
    else {
      this.uncheckedEvents.push(item);
    }
    // this.filterBySelectedItems();
    this.emitNewClinicalEventsSet();
  }

  // always filter and emit clone of dataset
  // filter operation performed on raw event items
  // prepareData then builds d3 chart out the list with the correct offset.
  filterBySelectedItems() {
    const datasetClone = this.dataset.map(a => Object.assign({}, a));

    const filteredList = datasetClone.filter(x => !_.includes(this.uncheckedEvents, x.clinicalevent));

    //const newClinicalEventList = this.prepareData(filteredList);

    this.subject.next(filteredList);
    // this.wrappedSubject.next(newClinicalEventList);
    // const newClinicalEventList = this.prepareData(newEvents);
    // console.log("set filtered:  " + newClinicalEventList.length);
    // this.subject.next(newEvents);
    // this.wrappedSubject.next(newClinicalEventList);
  }

  updateDate_Start(startDate: string) {
    this.updateDateRange(startDate, this.datasetMonthValues[this.datasetMonthValues.length -1].value);
  }

  updateDate_End(endDate: string) {
    this.updateDateRange(this.datasetMonthValues[0].value, endDate );
  }

  // 
  updateDateRange(startDate: string, endDate: string) {
    // clone dataset and filter
    const newArray = this.dataset.map(a => Object.assign({}, a));
    const filteredList = newArray.filter(x => {
      let d = moment(x.eventtime);
      let isLater = d > moment(startDate) && d < moment(endDate);
      return isLater;
    });

    // update the filter list before emitting new value
    this.addEventsNotInTimeframeToList(newArray);

    // emit new list of clinical events
    this.emitNewClinicalEventsSet();
  }

  emitNewClinicalEventsSet(){
    const datasetClone = this.dataset.map(a => Object.assign({}, a));

    const filteredList_checkedItems = datasetClone
    .filter(x => !_.includes(this.uncheckedEvents, x.clinicalevent));
console.log(filteredList_checkedItems);
    const filteredList_checkItems_dateRange =  filteredList_checkedItems.filter(x => !_.includes(this.eventsNotInTimeFrame, x.clinicalevent));
console.log(filteredList_checkItems_dateRange);

    const newSet = this.prepareData(filteredList_checkItems_dateRange);
    this.subject.next(filteredList_checkItems_dateRange);
    this.wrappedSubject.next(newSet);
  }

  addEventsNotInTimeframeToList(items: ClinicalEventItem[]) {
    const fullListOfEvents = _.uniqBy(this.dataset, 'clinicalevent')
      .map(ce => ce.clinicalevent);
    const noDupes = _.uniqBy(items, 'clinicalevent');
    let filterResult = noDupes.map(ce => ce.clinicalevent);
    // the new values are the difference between existing filterEvents and current event items
    this.eventsNotInTimeFrame = _.difference(fullListOfEvents, filterResult);
  }

  // key Bar helper functions
  getMonthRange({ minDate, maxDate }): Array<MonthViewmodel> {
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
        return _.concat(acc, [viewItem]);
      }, new Array<MonthViewmodel>());

    let initialMonth = moment(minDate).month();
    let viewMonth = moment(minDate).format("MMM, YYYY");

    return viewItems;
  }
  getMinMaxDates(clinicalEvents: Array<ClinicalEventItem>) {
    let dates = clinicalEvents
      .map(event => new Date(event.eventtime));
    let minD = _.min(dates.map(date => date.getTime()));
    let maxD = _.max(dates.map(date => date.getTime()));
    let min = moment(minD).format('YYYY-MM-DD');
    let max = moment(maxD).format('YYYY-MM-DD');

    //emit min and max dates for current data set 
    return {
      minDate: min,
      maxDate: max
    };
  }
}

