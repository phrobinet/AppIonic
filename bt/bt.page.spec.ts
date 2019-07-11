import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtPage } from './bt.page';

describe('BtPage', () => {
  let component: BtPage;
  let fixture: ComponentFixture<BtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
