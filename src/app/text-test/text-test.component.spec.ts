/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextTestComponent } from './text-test.component';

describe('TextTestComponent', () => {
  let component: TextTestComponent;
  let fixture: ComponentFixture<TextTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
