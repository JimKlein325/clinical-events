import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { KeyBarComponent } from './key-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TimelineService } from "../timeline.service";
import { MonthViewmodel } from "../model/month-viewmodel";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
import { of } from "rxjs/observable/of";
import { TimelineServiceStub } from "../../testing/timeline-service-stub";
import { MaterialModule } from "@angular/material";
import { By } from "@angular/platform-browser";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('KeyBarComponent', () => {
  let component: KeyBarComponent;
  let fixture: ComponentFixture<KeyBarComponent>;
  let params: any;
  let viewModel: KeyBarViewmodel;
  let keyBarModel$: Observable<KeyBarViewmodel>;

  let vm: BehaviorSubject<KeyBarViewmodel>;

  beforeEach(async(() => {
   

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KeyBarComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [{ provide: TimelineService, useClass: TimelineServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    fixture = TestBed.createComponent(KeyBarComponent);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
