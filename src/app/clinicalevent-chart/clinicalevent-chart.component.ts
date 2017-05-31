import { Component, Injectable, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3TimeFormat from 'd3-time-format';

//import { Observable } from 'rxjs/Observable';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/scan';



import { ClinicalEventReport } from './models/clinical-event-report'
import { ClinicalEventItem } from './models/clinical-event-item'
import { ClinicalEventDataService } from './models/clinical-event-data-service'
import { ClinicalEventItemWrapper } from './models/clinical-event-item-wrapper'

@Component({
  selector: 'clinicalevent-chart',
  templateUrl: './clinicalevent-chart.component.html',
  styleUrls: ['./clinicalevent-chart.component.css'],
  providers: [ClinicalEventDataService]

})
@Injectable()
export class ClinicaleventChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  // w: number = 300;
  // h: number = 300;
  scalePadding: number = 15;
  dataset2 = [0, 5, 15, 10, 8, 16, 25, 0, -10, -15];
  // private dataSerice: ClinicalEventDataService;
  public clinicalEventReport: ClinicalEventReport;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 80 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private readonly verticalTextOffset: number = 4;
  private barColor: string = "lightgray";
  private dotColor: string = "black";
  private labelColor: string = "darkblue";
  private numberOfVerticalEntrySlots: number = 10;
  private dateTicks: number = 5;
  public testDataset: Observable<ClinicalEventItem[]>;
  public problemName: string;


  public dataset: ClinicalEventItem[] = [
    {
      "patientid": 1,
      "sourceid": 1000000000,
      "semantictype": "DiagnosticProcedure",
      "clinicalevent": "Diagnosis",
      "eventtime": "2010-02-01",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000001,
      "semantictype": "DiagnosticProcedure",
      "clinicalevent": "Staging",
      "eventtime": "2010-02-01",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000003,
      "semantictype": "Medication",
      "clinicalevent": "Aloxi",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000002,
      "semantictype": "Medication",
      "clinicalevent": "Taxotere",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000006,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-05-20",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000007,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-06-16",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000008,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-06-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000009,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-06-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000010,
      "semantictype": "Medication",
      "clinicalevent": "Aloxi",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000011,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000012,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000015,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000016,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000017,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000019,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000020,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000021,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000023,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000024,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000025,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000027,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000028,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000029,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000031,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000032,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000033,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000004,
      "semantictype": "Medication",
      "clinicalevent": "Dexamethasone p.o.",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000005,
      "semantictype": "Medication",
      "clinicalevent": "Neulasta",
      "eventtime": "2010-03-19",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000013,
      "semantictype": "Medication",
      "clinicalevent": "Dexamethasone i.v.",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000014,
      "semantictype": "Medication",
      "clinicalevent": "Neupogen",
      "eventtime": "2010-07-04",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000018,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000022,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    }
    ,
    {
      "patientid": 1,
      "sourceid": 1000000026,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000030,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000034,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    }
  ]
  ;

  constructor(public dataService: ClinicalEventDataService) { }
  createChart() {
    //this.clinicalEventReport = new ClinicalEventReport(this.dataset, 20, this.verticalTextOffset);

    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.problemName = this.dataset[0].problem;


    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    // define domains
    let minDate = this.clinicalEventReport.minDate;// this.clinicalEventReport.wrappedItems[0].itemDate;
    let maxDate = this.clinicalEventReport.maxDate;//.wrappedItems[this.clinicalEventReport.wrappedItems.length - 1].itemDate;

    let xDomain = [minDate, maxDate];
    let yDomain = [-50, 50];

    let xBottomScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin.right]);

    this.xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.height]);


    let xDateAxisGen = d3.axisTop(xBottomScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));

    //add bars
    let bars = svg.selectAll("rect")
      .data(this.clinicalEventReport.wrappedItems)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.xScale(d.itemDate))
      .attr("y", (d, i) => d.item.eventtype == 1 ? this.height - this.yScale((d.yValue)) : this.yScale(0))
      .attr("width", 2)
      .attr("height", (d, i) => Math.abs(this.yScale(d.yValue) - this.yScale(0)))
      .attr("fill", this.barColor);
    //labels
    let labels = svg.selectAll("text")
      .data(this.clinicalEventReport.wrappedItems)
      .enter()
      .append("text")
      .text((d) => d.item.clinicalevent)
      .attr("x", (d, i) => this.xScale(d.itemDate) + 4)
      .attr("y", (d, i) => this.height + 4 - this.yScale(d.yValue))
      .attr("font-size", "14px")
      .attr("font-family", "sans-serif")
      .attr("fill", this.labelColor)
      .attr("text-anchor", "right")
      ;

    //add circles
    let dots = svg.selectAll("circle")
      .data(this.clinicalEventReport.wrappedItems)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => this.xScale(d.itemDate))
      .attr("cy", (d, i) => this.height - this.yScale(d.yValue))
      .attr("r", 3)
      .attr("fill", this.dotColor);



    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-yZero')
      .attr('transform', `translate(0, ${this.yScale(0)})`)//place an axis at y=0
      .call(d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0))//style the axis
      ;
    let xBottomAxis = svg.append('g')
      .call(xDateAxisGen)
      .attr('class', 'axis bottomAxis')
      .attr('transform', `translate(0, ${this.height - this.margin['bottom']})`)
      ;


  }

  ngOnChanges() {
    //this.createChart();
  }

  ngOnInit() {
    // data service works.  Uncomment to use.
    //   this.dataService.getClinicalEventData()
    //   .subscribe(
    //     data => this.dataset,
    //     error => console.log("data access error"),
    //     () => this.createChart()
    //  );
    //this.createChart();
    this.testFn();
    this.createChart();
  }
  // generate the height above or below the unmarked axis based on item's index position
  genYValue(eventType: number,
    slots: number,
    offset: number,
    index: number
  ): number {
    let multiplier: number;
    let slotsAboveOrBelowAxis = slots / 2;
    // multiplier used to position item above or below axis
    if (eventType == 1) {
      multiplier = 1;
    } else {
      multiplier = -1;
    }
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

  testFn() {
    let slots: number = 20;
    let offset: number = 3;
    this.clinicalEventReport = new ClinicalEventReport(slots, offset, null);

    let items: ClinicalEventItemWrapper[];
    const data$ = Observable.from(this.dataset);
   // data$.subscibe(items=> report.wrappedItems = items);
    const treatment$ = data$.filter(item => item.eventtype == 1);
    // .subscribe(console.log);()
    //items = treatment$

    let treatmentItems = this.dataset
      .filter(item => item.eventtype ==1)
      .reduce((acc, item, index) => {
      let yVal = this.genYValue(item.eventtype, slots, offset, index);
      // array.push returns a number, so use concat here
      let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
      return acc.concat(ce);
    },
      new Array<ClinicalEventItemWrapper>()
    )
      ;
      
    console.log(treatmentItems.length);
    
    let palativeItems = this.dataset.filter(item => item.eventtype ==0)
    .reduce((acc, item, index) => {
      let yVal = this.genYValue(item.eventtype, slots, offset, index);
      // array.push returns a number, so use concat here
      let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
      return acc.concat(ce);
    },
      new Array<ClinicalEventItemWrapper>()
    )
    ;

    let fullList = treatmentItems.concat(palativeItems);

    this.clinicalEventReport.wrappedItems = fullList;
    
    // set properties for timeline start and finish
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
      
    // const palative$ = data$.filter(item => item.eventtype == 0);


    // // transform event item array to wrapper array with yValue calculated: Treatment events, eventType = 1
    // let treatmentTransform$ = treatment$.reduce((acc, item, index) => {
    //   let yVal = this.genYValue(item.eventtype, slots, offset, index);
    //   // array.push returns a number, so use concat here
    //   let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
    //   return acc.concat(ce);
    // },
    //   new Array<ClinicalEventItemWrapper>()
    // );

    // // transform event item array to wrapper array with yValue calculated: Palative events, , eventType = 0
    // let palativeTransform$ = palative$
    //   .reduce((acc, item, index) => {
    //     let yVal = this.genYValue(item.eventtype, slots, offset, index);
    //     // array.push returns a number, so use concat here
    //     let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
    //     return acc.concat(ce);
    //   },
    //   new Array<ClinicalEventItemWrapper>()
    //   );


    // let maxDay: Date;
    // let minDay: Date;
    // // merge creates array of arrays, concatMap iterates over 
    // // the arrays and concats array items to new array
    // const mergeList$ = Observable.merge(treatmentTransform$, palativeTransform$)
    //   .concatMap(x => x);

    // // const mergeList2$ = Observable.merge(treatmentTransform$, palativeTransform$)
    // //   //.concatMap(x => x)
    // //   .flatMap(x => x )
    // //   .map(x => )
    // //   .subscribe(console.log)
    // //   ; // prints out each item in new array
    // const setMaxDate$ = mergeList$
    //   .reduce((acc, item) =>
    //     acc.itemDate > item.itemDate ? acc : item
    //   )
    //   .map(item => clinicalEventReport.maxDate=this.getDate(item.item.eventtime))// this.getDate(item.item.eventtime))
    //   .subscribe((val) => console.log("max date", val))
    //   ;

    // const setMinDate$ = mergeList$
    //   .reduce((acc, item) =>
    //     acc.itemDate < item.itemDate ? acc : item
    //   )
    //   .map(item => minDay=this.getDate(item.item.eventtime))
    //   .subscribe((val) => console.log("min date", val))
    //   ;
    
    // //let treatmentArray: ClinicalEventItemWrapper[] = treatment$;

    // let palArray: ClinicalEventItemWrapper[];
    // let mergeArray: ClinicalEventItemWrapper[];

    // // const mergeList3$ =  Observable.merge(treatmentTransform$, palativeTransform$)
    // // .subscribe(console.log);
    // // const m4$ = treatmentTransform$.concat(palativeTransform$)
    // //   .flatMap(x => x)
    // //   //   .concatMap(x => x.reduce((acc, item, index) => {
    // //   //  // let yVal = this.genYValue(item.eventtype, slots, offset, index);
    // //   //   // array.push returns a number, so use concat here
    // //   //   //let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
    // //   //   return acc.concat(item);
    // //   // },
    // //   // new Array<ClinicalEventItemWrapper>()
    // //   //   ));
    // // m4$.subscribe(console.log);

    // // m4$.count().subscribe(val => console.log( "what", val));
    // // const mergeList2$ =  Observable.merge(treatmentTransform$, palativeTransform$)
    // // .subscribe(val=> report.wrappedItems = val);
    // // console.log(report.wrappedItems);
    // // .mergeMap(()
    // // .map(wrapperItems => report.wrappedItems = wrapperItems)
    // // .subscribe(console.log);//val => console.log("values",val));

    // const mergeListMaxDate$ = Observable.merge(treatmentTransform$, palativeTransform$)
    //   .concatMap(x => x)
    //   //.do(console.log) // prints out each item in new array
    //   .reduce((acc, item) =>
    //     acc.itemDate > item.itemDate ? acc : item
    //   );

    // //  Calculating the latest date in a sequence of events

    // let lastItem$ = treatmentTransform$
    //   .map((vals: ClinicalEventItemWrapper[]) => vals
    //     .reduce((acc, item) =>
    //       acc.itemDate > item.itemDate ? acc : item
    //     )
    //   ).map(item => maxDay = item.itemDate);
    // // lastItem$.subscribe((val) => console.log("max date", val));

    // // let vals = [1, 2, 3];
    // // let min = vals.reduce((acc, item) =>
    // //   acc > item ? item : acc);
    // // console.log(min);
  }


}
