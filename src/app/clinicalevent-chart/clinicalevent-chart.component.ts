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
    this.clinicalEventReport = new ClinicalEventReport(this.dataset, 20, this.verticalTextOffset);

    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.problemName = this.dataset[0].problem;


    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    // define domains
    let minDate = this.clinicalEventReport.wrappedItems[0].itemDate;
    let maxDate = this.clinicalEventReport.wrappedItems[this.clinicalEventReport.wrappedItems.length - 1].itemDate;

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
    this.createChart();
    this.testFn();
  }
  // generate the height above or below the unmarked axis based on item's index position
  genYValue(isTreatment: boolean,
    slots: number,
    offset: number,
    index: number
  ): number {
    let multiplier: number;
    let slotsAboveOrBelowAxis = slots / 2;

    if (isTreatment) {
      multiplier = 1;
    } else {
      multiplier = -1;
    }
    return multiplier * (slotsAboveOrBelowAxis - (index % (slots / 2))) * offset
  };
  getDate(s): Date {
    //  "eventtime": "2010-02-01",
    let strDate = new String(s);
    let year = +strDate.substr(0, 4);// unary operator converts string to number
    let month = +strDate.substr(5, 2) - 1;
    let day = +strDate.substr(8, 2);

    return new Date(year, month, day);
  }

  testFn() {
    let slots: number = 20;
    let offset: number = 5;

    let items: ClinicalEventItemWrapper[];


    const data$ = Observable.from(this.dataset);

    const treatment$ = data$.filter(item => item.eventtype == 1);
    // .subscribe(console.log);

    const palative$ = data$.filter(item => item.eventtype == 0);
    // .subscribe(console.log);

    let treetmentArray: ClinicalEventItemWrapper[];
    let palArray: ClinicalEventItemWrapper[];
    let mergeArray: ClinicalEventItemWrapper[];

    // transform event item array to wrapper array with yValue calculated
    let treatmentTransform$ = treatment$.reduce((acc, item, index) => {
      let yVal = this.genYValue(true, slots, offset, index);
      // array.push returns a number, so use concat here
      let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
      return acc.concat(ce);
    },
      new Array<ClinicalEventItemWrapper>()
    );


    // .map(ceiArray => treetmentArray = ceiArray);
    // .subscribe(console.log);

    let palativeTransform$ = palative$
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(false, slots, offset, index);
        // array.push returns a number, so use concat here
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        return acc.concat(ce);
      },
      new Array<ClinicalEventItemWrapper>()
      );
    // .map( val => palArray = val);
    // .subscribe(console.log);
    // console.log(palativeTransform$);
    // const fullListEvents$ = treatmentTransform$.concat(palativeTransform$)
    //   // .map(data => this.dataset);
    // //.flatMap(list =>Observable.combineLatest(list))
    // .reduce((acc, item, index) => {
    //   return item.map(ce => acc.concat(ce));

    // },
    //   new Array<ClinicalEventItemWrapper>()
    // )

    // .count()
    // .do(val => console.log(`Concats two arrays into one containing two: ${val}`))
    // .subscribe()
    // ;
    // const fList$ = Observable.merge( )


    // merge creates array of arrays, concatMap iterates over 
    // the arrays and concats array items to new array
    const mergeList$ = Observable.merge(treatmentTransform$, palativeTransform$)
      .concatMap(x => x)
      //.do(console.log) // prints out each item in new array
      .reduce((acc, item) =>
        acc.itemDate > item.itemDate ? acc : item
      );

    mergeList$.subscribe(console.log);//val => console.log("values",val));


    //  Calculating the latest date in a sequence of events
    let maxDay: Date;

    let lastItem = treatmentTransform$
      .map((vals: ClinicalEventItemWrapper[]) => vals
        .reduce((acc, item) =>
          acc.itemDate < item.itemDate ? acc : item
        )
      ).map(item => maxDay = item.itemDate);
    lastItem.subscribe();

    console.log(maxDay);

    // .map((vals: ClinicalEventItemWrapper[]) => vals.map(item => item.item.eventtime))
    // .scan((acc, item, i) => 
    //   acc.itemDate < item.itemDate ? acc: item
    //  )
    // .map( items => arr = items)
    // .do(console.log)
    // .map( items => items.reduce( (acc, item) => 
    //    acc.itemDate < item.itemDate ? acc: item
    //    ) )
    // .subscribe(console.log);

    //Math.max(items// items[items.length - 1].itemDate;

    //  let val = arr.scan((acc, item) => 
    //    item.itemDate > acc.itemDate ? item: acc
    //    ) ;

    //  console.log(val.item.eventtime);

    let vals = [1, 2, 3];
    let min = vals.reduce((acc, item) =>
      acc > item ? item : acc);
    console.log(min);
  }


}
