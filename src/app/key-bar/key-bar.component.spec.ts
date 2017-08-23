import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { KeyBarComponent } from './key-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TimelineService } from "../timeline.service";
import { MonthViewmodel } from "../model/month-viewmodel";
import { KeyBarViewmodel } from "../model/key-bar-viewmodel";
import { of } from "rxjs/observable/of";
import { TimelineServiceStub } from "../../testing/timeline-service-stub";
import { By } from "@angular/platform-browser";

import { MdSelectModule } from "@angular/material";
import { MaterialModule } from "@angular/material";

describe('KeyBarComponent', () => {
  let component: KeyBarComponent;
  let fixture: ComponentFixture<KeyBarComponent>;
  let params: any;
  let viewModel: KeyBarViewmodel;
  let keyBarModel$: Observable<KeyBarViewmodel>;

  let vm: BehaviorSubject<KeyBarViewmodel>;

  beforeEach(async(() => {
   

    TestBed.configureTestingModule({
      // schemas: [NO_ERRORS_SCHEMA],
      declarations: [KeyBarComponent],
      imports: [ BrowserAnimationsModule, MaterialModule, MdSelectModule ],
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

  // it('should display Diagnosis header', () => {
  //   const options = fixture.debugElement.queryAll(By.css('input'));
  //   console.log((fixture.debugElement).nativeElement);
  //   let firstHeader = options[0];
  //   console.log(firstHeader.nativeElement);
  //   let el = firstHeader.nativeElement;

  //   expect(el.textContent).toContain('Jan');
  // });
});
