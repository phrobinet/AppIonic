import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeScanPage } from './home-scan.page';

describe('HomeScanPage', () => {
  let component: HomeScanPage;
  let fixture: ComponentFixture<HomeScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeScanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
