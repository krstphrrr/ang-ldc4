import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupForTableComponent } from './popup-for-table.component';

describe('PopupForTableComponent', () => {
  let component: PopupForTableComponent;
  let fixture: ComponentFixture<PopupForTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupForTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupForTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
