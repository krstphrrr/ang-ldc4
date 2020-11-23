import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoSearchComponent } from './eco-search.component';

describe('EcoSearchComponent', () => {
  let component: EcoSearchComponent;
  let fixture: ComponentFixture<EcoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
