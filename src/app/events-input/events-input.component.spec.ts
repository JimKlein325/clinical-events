import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsInputComponent } from './events-input.component';

describe('EventsInputComponent', () => {
  let component: EventsInputComponent;
  let fixture: ComponentFixture<EventsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
});
