import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragpopComponent } from './dragpop.component';

describe('DragpopComponent', () => {
  let component: DragpopComponent;
  let fixture: ComponentFixture<DragpopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragpopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
