import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBerryComponent } from './update-berry.component';

describe('UpdateBerryComponent', () => {
  let component: UpdateBerryComponent;
  let fixture: ComponentFixture<UpdateBerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBerryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBerryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
