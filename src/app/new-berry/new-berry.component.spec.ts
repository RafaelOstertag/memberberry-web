import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBerryComponent } from './new-berry.component';

describe('NewBerryComponent', () => {
  let component: NewBerryComponent;
  let fixture: ComponentFixture<NewBerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBerryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBerryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
