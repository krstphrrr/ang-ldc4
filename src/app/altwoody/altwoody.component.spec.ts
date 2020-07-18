import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltwoodyComponent } from './altwoody.component';

describe('AltwoodyComponent', () => {
  let component: AltwoodyComponent;
  let fixture: ComponentFixture<AltwoodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltwoodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltwoodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
