import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ItemSelectComponent } from './item-select.component';
import { MaterialModule } from "../material/material.module";
import { MdList, MdCheckbox, MdCheckboxChange } from '@angular/material';
import { Observable } from "rxjs";
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { TimelineService } from "../timeline.service";
import { TimelineServiceStub } from "../../testing/timeline-service-stub";
import { By } from "@angular/platform-browser";

////// Testing Vars //////
let component: ItemSelectComponent;
let fixture: ComponentFixture<ItemSelectComponent>;
let de: DebugElement;
let el: HTMLElement;
let service: TimelineService;


////// Tests  ////////////

describe('ItemSelectComponent', () => {
  let component: ItemSelectComponent;
  let fixture: ComponentFixture<ItemSelectComponent>;

  beforeEach(async(() => {
    component = new ItemSelectComponent(new FormBuilder(), new TimelineService());
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [ItemSelectComponent],
      providers: [{ provide: TimelineService, useClass: TimelineServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should display Diagnosis header', () => {
    const subHeads = fixture.debugElement.queryAll(By.css('h3'));
    console.log(subHeads);
    let firstHeader = subHeads[0];
    // console.log(firstHeader.nativeElement);
    let el = firstHeader.nativeElement;
    expect(el.textContent).toContain('Diagnosis');
  });
  it('should display checkbox for each view item', () => {
    const cBoxes = fixture.debugElement.queryAll(By.css('md-checkbox'));
    // console.log(cBoxes);
    let firstHeader = cBoxes[0];
    let el: HTMLElement = firstHeader.nativeElement;
    expect(el.textContent).toContain('test');
    // expect(el.textContent).toContain('test1');
    // expect(el.textContent).toContain('test2');
    // expect(el.textContent).toContain('test3');
    // expect(el.textContent).toContain('test4');
    let lastHeader = cBoxes[5];
    let lastEl: HTMLElement = lastHeader.nativeElement;
    expect(lastEl.textContent).toContain('test5');
    // 6 view items in test data
    expect(cBoxes.length).toBe(6);
  });

  it('should be call service when checkbox is checked/unchecked', () => {
    //get the stub service from the 
    let userService = fixture.debugElement.injector.get(TimelineService);
    let spy = spyOn(userService, 'filterEvents').and.callFake(t => {
      return Observable.empty();
    });
    let eventStub = {checked: true , source: {id: "1"}};
    component.onCheckChange(eventStub);

    expect(spy).toHaveBeenCalled();
  });


});
