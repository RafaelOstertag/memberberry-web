import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstBerryComponent } from './first-berry.component';

describe('FirstBerryComponent', () => {
  let component: FirstBerryComponent;
  let fixture: ComponentFixture<FirstBerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstBerryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstBerryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
