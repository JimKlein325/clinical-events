import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineService } from "../timeline.service";
import { EventListComponent } from './event-list.component';
import { MaterialModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { TimelineServiceStub } from "../../testing/timeline-service-stub";
import { By } from "@angular/platform-browser";

////// Testing Vars //////
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let de: DebugElement;
  let el: HTMLElement;


////// Tests  ////////////

describe('EventListComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // schemas: [NO_ERRORS_SCHEMA],
      declarations: [EventListComponent],
      imports: [MaterialModule],
      providers: [{ provide: TimelineService, useClass: TimelineServiceStub }]
      // providers: [TimelineService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    // 1st change detection triggers ngOnInit
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should display Diagnosis header', () => {
    const subHeads = fixture.debugElement.queryAll(By.css('strong'));
    // console.log(subHeads);
    let firstHeader = subHeads[0];
    // console.log(firstHeader.nativeElement);
    let el = firstHeader.nativeElement;
    expect(el.textContent).toContain('Diagnosis');
  });
  it('should display checkbox for each view item', () => {
    const cBoxes = fixture.debugElement.queryAll(By.css('md-checkbox'));
    // console.log(cBoxes);
    let firstHeader = cBoxes[0];
    console.log(firstHeader.nativeElement);
    let el: HTMLElement = firstHeader.nativeElement;
    console.log(el.outerHTML);
    expect(el.textContent).toContain('test');
    expect(cBoxes.length).toBe(6);
  });
});
/////////// Helpers /////

class Page {
  saveBtn: DebugElement;
  cancelBtn: DebugElement;
  firstHeader: HTMLElement;
  nameInput: HTMLInputElement;
  // gotoSpy:      jasmine.Spy;
  // navSpy:       jasmine.Spy;

  // saveBtn:      DebugElement;
  // cancelBtn:    DebugElement;
  // nameDisplay:  HTMLElement;
  // nameInput:    HTMLInputElement;

  constructor() {

  }

  /** Add page elements after hero arrives */
  // addPageElements() {
  //   if (comp.hero) {
  //     // have a hero so these elements are now in the DOM
  //     const buttons    = fixture.debugElement.queryAll(By.css('button'));
  //     this.saveBtn     = buttons[0];
  //     this.cancelBtn   = buttons[1];
  //     // this.nameDisplay = fixture.debugElement.query(By.css('span')).nativeElement;
  //     // this.nameInput   = fixture.debugElement.query(By.css('input')).nativeElement;
  //   }
  // }
}
