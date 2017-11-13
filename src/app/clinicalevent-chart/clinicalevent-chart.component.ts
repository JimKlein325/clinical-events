import { Component, Injectable, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import * as d3TimeFormat from 'd3-time-format';
import * as moment from 'moment';

//import { Observable } from 'rxjs/Observable';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { ClinicalEventItem } from './models/clinical-event-item';
import { ClinicalEventItemWrapper } from './models/clinical-event-item-wrapper';
import { ClinicaleventChartViewmodel } from "../model/clinicalevent-chart-viewmodel";
import { ClinicalEventReport } from './models/clinical-event-report';
import { TimelineService } from "../timeline.service";

@Component({
  selector: 'clinicalevent-chart',
  templateUrl: './clinicalevent-chart.component.html',
  styleUrls: ['./clinicalevent-chart.component.css']
})

@Injectable()
export class ClinicaleventChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('chart') private chartContainer: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  scalePadding: number = 15;

  public clinicalEventReport: ClinicalEventReport;

  private wrappedItems: ClinicalEventItemWrapper[];

  private margin: any = { top: 20, bottom: 20, left: 20, right: 80 };
  chart: any;
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
  private barColor: string = "darkorange";
  private dotColor: string = "black";
  private labelColor: string = "black";
  private dateTicks: number = 5;
  public problemName: string;


  constructor(private tlService: TimelineService) { }

  ngAfterViewInit(): void {
    this.tlService.chartView$
      .takeUntil(this.ngUnsubscribe)
      .do(vm => {
        if(vm){
        this.wrappedItems = vm.eventItems;
        this.clinicalEventReport = vm.report;
        this.dateTicks = vm.monthsInCurrentTimeframe;
        this.minDate = vm.minDate;
        this.maxDate = vm.maxDate;
        
        if(!this.chart) this.createChart();
        
        this.updateChart();
      }
      })
      .subscribe();
  }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;

    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.problemName = this.clinicalEventReport ? this.clinicalEventReport.problemName : "";

    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'labels')
      .attr('transform', `translate(${this.margin.left}, 0)`);

    // define domains
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

    // Date axis
    let xDateAxisGen = d3.axisBottom(xBottomScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));
    let xAxisGen = d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0);

    // x & y axis
    let fudgeLeft = this.margin.left + 6;
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-yZero')
      .attr('transform', `translate(${fudgeLeft}, ${this.yScale(0)})`)//place an axis at y=0
      .call(xAxisGen)//style the axis
      ;
    this.xBottomAxis = svg.append('g')
      .call(xDateAxisGen)
      .attr('class', 'axis bottomAxis')
      .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin['bottom']})`)
      ;
  }

  updateChart() {
    // update scales & axis
    let xDomain = [this.minDate, this.maxDate];

    this.xScale = d3.scaleTime()
      .domain(xDomain)
      .range([this.margin.left, this.width - this.margin.right]);

    let xAxisGen = d3.axisBottom(this.xScale).tickFormat((d) => "").tickSize(0);
    this.xAxis.transition().call(xAxisGen);

    let xDateAxisGen = d3.axisBottom(this.xScale).ticks(this.dateTicks).tickFormat(d3.timeFormat("%b"));
    this.xBottomAxis.transition().call(xDateAxisGen);

    // JOIN: join elements and dataset
    // pass key function as argument to second parameter in data function to ensure 
    let updateRect = this.chart.selectAll("rect")
      .data(this.wrappedItems, (d: ClinicalEventItemWrapper) => d.item.clinicalevent + d.item.eventtime);
    let updateText = this.chart.selectAll(".label")
      .data(this.wrappedItems, (d: ClinicalEventItemWrapper) => d.item.clinicalevent + d.item.eventtime);
    let updateCircles = this.chart.selectAll("circle")
      .data(this.wrappedItems, (d: ClinicalEventItemWrapper) => d.item.clinicalevent + d.item.eventtime);

    // EXIT: remove existing items no longer part of dataset
    updateRect.exit().remove();
    updateText.exit().remove();
    updateCircles.exit().remove();
    //tooltip
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // UPDATE existing items, applying a transition
    updateText
      .transition()
      .duration(750)
      .attr("x", (d, i) => this.xScale(d.itemDate) + 8)
      .attr("y", (d, i) => this.height + 4 - this.yScale(d.yValue))
      ;

    updateCircles
      .transition()
      .duration(750)
      .attr("cx", (d, i) => this.xScale(d.itemDate) +1 )
      .attr("cy", (d, i) => this.height - this.yScale(d.yValue))

    updateRect
      .transition()
      .duration(750)
      .attr("x", (d, i) => this.xScale(d.itemDate))
      .attr("y", (d, i) => d.item.eventtype == 1 || d.item.eventtype == 2 ? this.height - this.yScale((d.yValue)) : this.yScale(0))
      .attr("height", (d, i) => Math.abs(this.yScale(d.yValue) - this.yScale(0)));

    // ENTER existing items, applying a transition
    let enterRect = updateRect
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.xScale(d.itemDate))
      .attr("y", (d, i) => d.item.eventtype == 1 || d.item.eventtype == 2 ? this.height - this.yScale((d.yValue)) : this.yScale(0))
      .attr("width", 2)
      .attr("height", (d, i) => Math.abs(this.yScale(d.yValue) - this.yScale(0)))
      .attr("fill", this.barColor)
      ;
    //Include onMouseover/Mouseout events for enabling tool tips when user hovers over text
    let enterText = updateText
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
      .on("mouseover", function (d) {
        let toolTipText = moment(d.item.eventtime).format('MMM D, YYYY');
        tooltip.transition()
          .duration(500)
          .style("opacity", .9);
        tooltip.html(toolTipText)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    let enterCircles = updateCircles
      .enter()
      .append("circle")
      .attr("cx", (d, i) => this.xScale(d.itemDate) + 1)
      .attr("cy", (d, i) => this.height - this.yScale(d.yValue))
      .attr("r", 3)
      .attr("fill", this.dotColor);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
