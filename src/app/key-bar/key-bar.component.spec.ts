import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyBarComponent } from './key-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimelineService } from "../timeline.service";
describe('KeyBarComponent', () => {
  let component: KeyBarComponent;
  let fixture: ComponentFixture<KeyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [KeyBarComponent],
      providers: [TimelineService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
