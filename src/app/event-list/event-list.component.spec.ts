import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineService  } from "../timeline.service";
import { EventListComponent } from './event-list.component';
import { MdList, MdCheckbox } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TimelineServiceStub } from "../../testing/timeline-service-stub";

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ EventListComponent ], 
      providers: [{ provide:TimelineService, useClass: TimelineServiceStub} ]
      // providers: [TimelineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    //add a comment
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
