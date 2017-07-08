import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ItemSelectComponent } from './item-select.component';
import { MaterialModule } from "../material/material.module";
import { MdList, MdCheckbox } from '@angular/material';
import { Observable } from "rxjs";
import { TimelineService } from "../timeline.service";


describe('ItemSelectComponent', () => {
  let component: ItemSelectComponent;
  let fixture: ComponentFixture<ItemSelectComponent>;

  beforeEach(async(() => {
    component = new ItemSelectComponent(new FormBuilder(), new TimelineService());
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [ItemSelectComponent],
      providers: [TimelineService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectComponent);
    component = fixture.componentInstance;
  });

  it('should load event items from server', () => {
    let items = [1, 2, 3];
    let service = TestBed.get(TimelineService);
    spyOn(service, 'clinicalEvents$').and.returnValue(Observable.from(items));

    // spec generation places this code in the beforeEach() block
    // need to move it down here so that ngOnInt is called after we set up the test
    // otherwise, ngOnInit is called after the component is initialized in beforeEach()
    fixture.detectChanges();
    // get lenth of form group controls array
    expect(component.events.controls.length).toBe(13);

    //this doesn't work because you don't give dynamically generated controls a name attribute.  just the forms module controls.
    //expect(component.eventForm.contains('0')).toBeTruthy();
  });

  it('should be created', () => {
    // fixture.detectChanges();
    expect(component).toBeTruthy();

  });
  // it('should create a form with number correct number of checkbox controls', () => {
  //   //Arrange
  //   let eventLabels = ["Diagnosis", "Staging", "Asprin"];

  //   component.buildControls(eventLabels);

  //   expect(component.eventForm.contains('Diagnosis')).toBeTruthy();
  //   expect(component.eventForm.contains('Staging')).toBeTruthy();
  //   expect(component.eventForm.contains('Asprin')).toBeTruthy();
  // });
});
