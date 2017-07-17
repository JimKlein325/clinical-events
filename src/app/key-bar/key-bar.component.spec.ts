import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyBarComponent } from './key-bar.component';

describe('KeyBarComponent', () => {
  let component: KeyBarComponent;
  let fixture: ComponentFixture<KeyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyBarComponent ]
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
