import { Component, Injectable, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
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
import { TimelineService } from "../timeline.service";


@Component({
  selector: 'clinicalevent-chart',
  templateUrl: './clinicalevent-chart.component.html',
  styleUrls: ['./clinicalevent-chart.component.css'],
  providers: [ClinicalEventDataService]

})
@Injectable()
export class ClinicaleventChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  // w: number = 300;
  // h: number = 300;
  scalePadding: number = 15;

  public clinicalEventReport: ClinicalEventReport;

  private wrappedItems: ClinicalEventItemWrapper[];

  private margin: any = { top: 20, bottom: 20, left: 20, right: 80 };
  private chart: any;
  maxDate: Date;
  minDate: Date;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private xBottomAxis: any;
  private yAxis: any;
  // private readonly verticalTextOffset: number = 4;
  private barColor: string = "gray";
  private dotColor: string = "black";
  private labelColor: string = "darkblue";
  // private numberOfVerticalEntrySlots: number = 10;
  private dateTicks: number = 5;
  // public testDataset: Observable<ClinicalEventItem[]>;
  public problemName: string;


  constructor(private tlService: TimelineService, public dataService: ClinicalEventDataService) { }

  ngAfterViewInit(): void {
    this.tlService.maxMinDates$
      .map(val => {
        this.minDate = val.minDate;
        //console.log(this.minDate);
        this.maxDate = val.maxDate;
        // console.log("what");
        // console.log(this.maxDate);
      })
      .subscribe();

    this.tlService.wrappedEvents$
      // .do(val => console.log(val))
      .do(val => {
        this.wrappedItems = val;
        this.clinicalEventReport = this.tlService.clinicalEventReport;
        console.log("wrapped items");
        console.log(val);
        if (!this.chart) {
          this.createChart();
          this.updateChart()
        }
        else {
          this.updateChart();
        }
      })
      .subscribe()
      ;
  }

  createChart() {
    // this.chart = true;
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    // console.log("width: " + this.width);
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.problemName = this.clinicalEventReport.problemName;

    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'labels')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define domains
    // let minDate = this.minDate;// this.clinicalEventReport.minDate;
    // let maxDate = this.clinicalEventReport.maxDate;

    let xDomain = [this.minDate, this.maxDate];
    let yDomain = [-40, 40];

    // create scales
    let xBottomScale = d3.scaleTime()
      .domain(xDomain)
      .range([this.margin.left, this.width - this.margin.right]);

    this.xScale = d3.scaleTime()
      .domain(xDomain)
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.height]);

    // Date axix
    let xDateAxisGen = d3.axisBottom(xBottomScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));
    let xAxisGen = d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0);

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-yZero')
      .attr('transform', `translate(0, ${this.yScale(0)})`)//place an axis at y=0
      .call(xAxisGen)//style the axis
      ;
    this.xBottomAxis = svg.append('g')
      .call(xDateAxisGen)
      .attr('class', 'axis bottomAxis')
      .attr('transform', `translate(0, ${this.height - this.margin['bottom']})`)
      ;
  }

  updateChart() {
    console.log("update");
    // update scales and axes
    // define domains
    // let minDate = this.clinicalEventReport.minDate;
    // let maxDate = this.clinicalEventReport.maxDate;

    // let xDomain = [minDate, maxDate];
    // let yDomain = [-50, 50];

    // // create scales
    // let xBottomScale = d3.scaleTime()
    //   .domain([minDate, maxDate])
    //   .range([this.margin.left, this.width - this.margin.right]);

    // this.xScale = d3.scaleTime()
    //   .domain([minDate, maxDate])
    //   .range([this.margin.left, this.width - this.margin.right]);

    // this.yScale = d3.scaleLinear()
    //   .domain(yDomain)
    //   .range([0, this.height]);

    // // Date axix
    // let xDateAxisGen = d3.axisTop(xBottomScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));


    // x & y axis
    // this.xAxis = svg.append('g')
    //   .attr('class', 'axis axis-yZero')
    //   .attr('transform', `translate(0, ${this.yScale(0)})`)//place an axis at y=0
    //   .call(d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0))//style the axis
    //   ;
    // let xBottomAxis = svg.append('g')
    //   .call(xDateAxisGen)
    //   .attr('class', 'axis bottomAxis')
    //   .attr('transform', `translate(0, ${this.height - this.margin['bottom']})`)
    //   ;

    // update scales & axis
    let xDomain = [this.minDate, this.maxDate];

    this.xScale = d3.scaleTime()
      .domain(xDomain)
      .range([this.margin.left, this.width - this.margin.right]);
    // yAxis is not dynamic
    // this.yScale.domain([0, d3.max(this.data, d => d[1])]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0));

    let xDateAxisGen = d3.axisBottom(this.xScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));
    this.xBottomAxis.transition().call(xDateAxisGen);

    // .call(d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0))//style the axis

    // this.yAxis.transition().call(d3.axisLeft(this.yScale));


    // let updateRect = this.chart.selectAll("rect")
    //   .data(this.wrappedItems);
    let updateText = this.chart.selectAll(".label")
      .data(this.wrappedItems, (d: ClinicalEventItemWrapper) => d.item.clinicalevent + d.item.eventtime);
    // let updateCircles = this.chart.selectAll("circle")
    //   .data(this.wrappedItems);

    // remove existing items no longer part of dataset
    //  updateRect.exit().remove();
    updateText.exit().remove();
    //  updateCircles.exit().remove();

    // update existing
    //add bars
    // let bars = this.chart.selectAll("rect")
    //   .data(this.wrappedItems)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d, i) => this.xScale(d.itemDate))
    //   .attr("y", (d, i) => d.item.eventtype == 1 ? this.height - this.yScale((d.yValue)) : this.yScale(0))
    //   .attr("width", 2)
    //   .attr("height", (d, i) => Math.abs(this.yScale(d.yValue) - this.yScale(0)))
    //   .attr("fill", this.barColor);
    //labels
    //this.chart.selectAll("label")//.transition()
    // .do(console.log(this.chart.selectAll("label")))
    updateText
      .transition()
      .duration(750)
      .attr("x", (d, i) => this.xScale(d.itemDate) + 4)
      .attr("y", (d, i) => this.height + 4 - this.yScale(d.yValue));


    let enter = updateText
      // .data(this.wrappedItems, (d) => <ClinicalEventItemWrapper>d.item.clinicalevent+d.item.eventtime)
      .enter()
      .append("text")
      .attr('class', 'label')
      .text((d) => d.item.clinicalevent)
      .attr("x", (d, i) => this.xScale(d.itemDate) + 4)
      .attr("y", (d, i) => this.height + 4 - this.yScale(d.yValue))
      .attr("font-size", "14px")
      .attr("font-family", "sans-serif")
      .attr("fill", this.labelColor)
      .attr("text-anchor", "right")
      .transition()
      .duration(1000)
      ;
    // updateText
    // .enter();
    //add circles
    // let dots = this.chart.selectAll("circle")
    //   .data(this.wrappedItems)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", (d, i) => this.xScale(d.itemDate))
    //   .attr("cy", (d, i) => this.height - this.yScale(d.yValue))
    //   .attr("r", 3)
    //   .attr("fill", this.dotColor);
    //add new items

    // this.chartContainer.nativeElement = null;
    // JOIN new data with old elements.
    // let update = this.chart.select("this.chart").selectAll("text");

    // EXIT old elements not present in new data.
    // update.exit().remove();


    // UPDATE old elements present in new data.

    // ENTER new elements present in new data.

  }
  updateChart2() {
    console.log("update");
    // update scales and axes
    // define domains
    let minDate = this.clinicalEventReport.minDate;
    let maxDate = this.clinicalEventReport.maxDate;

    let xDomain = [minDate, maxDate];
    let yDomain = [-50, 50];

    // create scales
    let xBottomScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin.right]);

    this.xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.height]);

    // Date axix
    let xDateAxisGen = d3.axisTop(xBottomScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));



    let updateText = this.chart.selectAll("label")
      .data(this.wrappedItems, (d) => <ClinicalEventItemWrapper>d.item.clinicalevent + d.item.eventtime);

    updateText.exit().remove();

    // this.chart.selectAll('label').transition()
    //   .attr("x", (d, i) => this.xScale(d.itemDate) + 4)
    //   .attr("y", (d, i) => this.height + 4 - this.yScale(d.yValue))


    let enter = updateText
      // .data(this.wrappedItems, (d) => <ClinicalEventItemWrapper>d.item.clinicalevent+d.item.eventtime)
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
    // console.log("onInit chart component");

    // this.tlService.wrappedEvents$
    //   // .do(val => console.log(val))
    //   .do(val => {
    //     this.wrappedItems = val;
    //     this.clinicalEventReport = this.tlService.clinicalEventReport;
    //     console.log("wrapped items");
    //     console.log(val);
    //     if (!this.chart) {
    //       this.createChart();
    //       this.updateChart()
    //     }
    //     else {
    //       this.updateChart2();
    //     }
    //   })
    //   .subscribe()
    //   ;
  }




}
