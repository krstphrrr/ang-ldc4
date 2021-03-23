import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaselayersComponent } from './baselayers.component';

describe('BaselayersComponent', () => {
  let component: BaselayersComponent;
  let fixture: ComponentFixture<BaselayersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
