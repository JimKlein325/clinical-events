import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3TimeFormat from 'd3-time-format';


@Component({
  selector: 'simple-barchart',
  templateUrl: './simple-barchart.component.html',
  styleUrls: ['./simple-barchart.component.css']
})
export class SimpleBarchartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  // w: number = 300;
  // h: number = 300;
  scalePadding: number = 15;
  dataset2 = [0, 5, 15, 10, 8, 16, 25, 0, -10, -15];

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
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
  private dotColor: string = "green";

  private dataset = [
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
      "eventtype": 0
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
      "eventtype": 0
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
    }
    ,
    {
      "patientid": 1,
      "sourceid": 1000000015,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000006,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-07-20",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000007,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-08-16",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000008,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000009,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000010,
      "semantictype": "Medication",
      "clinicalevent": "Aloxi",
      "eventtime": "2010-08-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000011,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000012,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    }
    ,
    {
      "patientid": 1,
      "sourceid": 1000000015,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-09-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    }
  ];

  constructor() { }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;


    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    //chart plot area
    // this.chart = svg.append('g')
    //   .attr('class', 'bars')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    // define domains
    let xDomain = [0, 100];
    let yDomain = [-50, 50];

    let minDate = this.getDate(this.dataset[0].eventtime);
    let maxDate = this.getDate(this.dataset[this.dataset.length - 1].eventtime);

console.log(minDate);
console.log(maxDate);

    let xBottomScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin['right']]);

    this.xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin.right]);
    // this.xScale = d3.scaleLinear()
    //   .domain(xDomain)
    //   .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.height]);


    // console.log(element.offsetHeight);
    // console.log(this.height);
    // console.log(this.width);

    let xDateAxisGen = d3.axisTop(xBottomScale).ticks(5).tickFormat(d3.timeFormat("%b"));

    let labels = svg.selectAll("text")
      .data(this.dataset)
      .enter()
      .append("text")
      .text((d) => d.clinicalevent)
      .attr("x", (d, i) => this.xScale(this.getDate(d.eventtime))+4)
      .attr("y", (d, i) => this.height + 4 - this.yScale(d.eventtype != 1 ? -1 * (this.barHeight(i)) : (this.barHeight(i) ) ) )//(d, i) => d.eventtype == 1 ? this.height - this.yScale((this.barHeight(i))) : this.yScale(0))
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "blue")
      .attr("text-anchor", "right")
      ;

    //add bars
    let bars = svg.selectAll("rect")
      .data(this.dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.xScale(this.getDate(d.eventtime)))
      .attr("y", (d, i) => d.eventtype == 1 ? this.height - this.yScale((this.barHeight(i))) : this.yScale(0))
      // .attr("y",  (d, i) =>  this.height - this.yScale(d.eventtype!=1 ? -1*(this.barHeight(i)) + 29: (this.barHeight(i))))
      .attr("width", 2)
      .attr("height", (d, i) => this.yScale(this.barHeight(i)) - this.yScale(0))
      .attr("fill", this.barColor);

    //add circles
    let dots = svg.selectAll("circle")
      .data(this.dataset)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => this.xScale(this.getDate(d.eventtime)))
      .attr("cy", (d, i) => this.height - this.yScale(d.eventtype != 1 ? -1 * (this.barHeight(i)) : (this.barHeight(i))))
      .attr("r", 4)
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
      .attr('transform', `translate(0, ${this.height-this.margin['bottom']})`)//place
      
      //style the axis
      ;


  }
  // barHeight( i : number, dataPoints: number ): number{
  //   return (dataPoints - i) * this.verticalTextOffset;
  // }
  barHeight(i: number): number {
    let barHeight = (this.dataset.length - i) % 10;
    barHeight = (barHeight > 0) ? barHeight : 10;
    return barHeight * this.verticalTextOffset;
  }

  getDate(d): Date {
    //  "eventtime": "2010-02-01",
    let strDate = new String(d);
    let year = +strDate.substr(0, 4);// unary operator converts string to number
    let month = +strDate.substr(5, 2) - 1;
    let day = +strDate.substr(8, 2);

    return new Date(year, month, day);

  }
  ngOnInit() {
    this.createChart();
  }

}
