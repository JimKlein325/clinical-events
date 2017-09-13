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
import { FormsModule } from "@angular/forms";

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
      imports: [ BrowserAnimationsModule, MaterialModule, MdSelectModule, FormsModule ],
      providers: [{ provide: TimelineService, useClass: TimelineServiceStub }]
    });
    //don't need to call compileComponents if you use WebPack
      //.compileComponents();
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

  it('should display Date Select drop down lists', () => {
    const dateSelect = fixture.debugElement.queryAll(By.css('md-select'));
    // console.log((fixture.debugElement).nativeElement);
    let firstDropDownList = dateSelect[0];
    let secondDropDownList = dateSelect[1];
    console.log(firstDropDownList.nativeElement);
    let el = firstDropDownList.nativeElement;
    let el_secondDDL = secondDropDownList.nativeElement;
    expect(el).toBeDefined();
    expect(el_secondDDL).toBeDefined();
  });
  it('should call service when new value is selected', () => {
    // this tests integration of component and service
    //get the stub service instance
    let userService = fixture.debugElement.injector.get(TimelineService);
    let spy = spyOn(userService, 'updateDate_Start').and.callFake(t => {
      return Observable.empty();
    });
    let eventStub = { viewValue: "Feb, 2010", value: "2010-02-01", id: 1 };

    let dropDown = fixture.debugElement.query(By.css('md-select'));
    //trigger the call to the service by triggering event
    dropDown.triggerEventHandler('change', eventStub);

    expect(spy).toHaveBeenCalledWith("2010-02-01");
  });
});
