import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineService  } from "../timeline.service";
import { EventListComponent } from './event-list.component';
import { MdList, MdCheckbox } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ EventListComponent ], 
      providers: [TimelineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
