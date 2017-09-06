/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MdList, MdCheckbox } from '@angular/material';
import { TimelineService } from "../timeline.service";
import { ClinicaleventChartComponent } from './clinicalevent-chart.component';
import { TimelineServiceStub } from "../../testing/timeline-service-stub";


describe('ClinicaleventChartComponent', () => {
  let component: ClinicaleventChartComponent;
  let fixture: ComponentFixture<ClinicaleventChartComponent>;
  let timelineServiceStub = new TimelineServiceStub();
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicaleventChartComponent ],
      providers: [{ provide: TimelineService, useValue: timelineServiceStub }]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicaleventChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create chart', () => {
    expect(component.chart).toBeTruthy();
  });
});
