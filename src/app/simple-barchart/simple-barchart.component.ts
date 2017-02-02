import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

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
  dataset = [0, 5, 15, 10, 8, 16, 25, 0, 0, -15, -10];

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any ;
  private yAxis: any;

  constructor() { }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = 360;//element.offsetHeight - this.margin.top - this.margin.bottom;


    let svg = d3.select(element).append("svg")
      .attr('width', this.width)
      .attr('height', this.height);

    //chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    // define domains
    let xDomain = [0, 100];
    let yDomain = [-50, 50];

    // define scales
    this.xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, this.width])

    this.yScale = d3.scaleLinear()
      .domain([-50, 50])
      .range([0, this.height]);


    console.log(element.offsetHeight);
    console.log(this.height);
    console.log(this.width);

    // console.log(d3.extent(this.dataset));
    console.log(this.yScale(-15));
    console.log(this.yScale(0));
    console.log(this.yScale(15));

    // x & y axis
    this.xAxis = svg.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', `translate(0, ${this.yScale(0)})`)
    .call(d3.axisBottom(this.xScale).tickFormat((d)=>"").tickSize(0))
    ;


    // let g = svg.select('g');
    // g.select('.x.axis.zero')
    // .attr("tranform", `"translate(0, ${this.yScale(0)})"`)
    // .call(this.xAxis.tic)

    //add bars
    // let bars = svg.selectAll("rect")
    //   .data(this.dataset)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d, i) => i * 30 + 2)
    //   .attr("y", (d) => this.yScale(d))
    //   .attr("width", 2)
    //   .attr("height", (d, i) => ((this.dataset.length - i) * 20))
    //   .attr("fill", "green");

    //add circles
    let dots = svg.selectAll("circle")
      .data(this.dataset)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => this.xScale(i*9))
      .attr("cy", (d) => this.height - this.yScale(d))
      .attr("r", 4)
      .attr("fill", "#666665");

    // let g = svg.select('g')
    // let xAxisGen = d3.svg.axis().scale(this.yScale).orient("bottom").ticks(5);

    // var xAxis = svg.append("g").call(xAxisGen)
    // .attr("class", "axis")
    // .attr("transform", "translate(0,"+ (h-scalePadding-25) + ")");

  }


  ngOnInit() {
    this.createChart();
  }

}
