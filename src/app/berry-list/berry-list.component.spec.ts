import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerryListComponent } from './berry-list.component';

describe('BerryListComponent', () => {
  let component: BerryListComponent;
  let fixture: ComponentFixture<BerryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BerryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BerryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
