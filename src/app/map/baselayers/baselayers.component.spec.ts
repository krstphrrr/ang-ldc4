import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselayersComponent } from './baselayers.component';

describe('BaselayersComponent', () => {
  let component: BaselayersComponent;
  let fixture: ComponentFixture<BaselayersComponent>;

  beforeEach(async(() => {
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
