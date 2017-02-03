import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'text-test',
  templateUrl: './text-test.component.html',
  styleUrls: ['./text-test.component.css']
})
export class TextTestComponent implements OnInit {

  @ViewChild('chart') private chartContainer: ElementRef;
  w: number = 800;
  h: number = 300;
  lollipopTextOffset = 5;
  scalePadding = 15;
  events: [any] = [
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
    }
  ];
  createChart() {
    let element = this.chartContainer.nativeElement;
    let svg = d3.select(element).append("svg")
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

      

    //add circles
    let dots = svg.selectAll("circle")
      .data(this.events)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * 30 + 4)
      .attr("cy", (d, i) => this.h - ((this.events.length - i) * 20))
      .attr("r", 4)
      .attr("fill", "#666665");

    //add labels
    let labels = svg.selectAll("text")
      .data(this.events)
      .enter()
      .append("text")
      .text((d) => d.clinicalevent)
      .attr("x", (d, i) => i * 30 + 10)
      .attr("y", (d, i) => this.h - ((this.events.length - i) * 20) + 5)
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "blue")
      .attr("text-anchor", "right")
      ;

    //add bars
    let bars = svg.selectAll("rect")
      .data(this.events)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30 + 2)
      .attr("y", (d, i) => this.h - ((this.events.length - i) * 20))
      .attr("width", 2)
      .attr("height", (d, i) => ((this.events.length - i) * 20))
      .attr("fill", "green");
  }
  constructor() { }

  ngOnInit() {
    this.createChart();
  }

}
