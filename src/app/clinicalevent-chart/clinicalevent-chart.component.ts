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
import { TimelineService } from "../timeline.service";

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


  constructor(private tlService: TimelineService, public dataService: ClinicalEventDataService) { }
  createChart() {

    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.problemName = this.clinicalEventReport.problemName;

    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    // define domains
    let minDate = this.clinicalEventReport.minDate;
    let maxDate = this.clinicalEventReport.maxDate;

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
    
    this.clinicalEventReport = this.tlService.clinicalEventReport;

    this.createChart();
  }


}
