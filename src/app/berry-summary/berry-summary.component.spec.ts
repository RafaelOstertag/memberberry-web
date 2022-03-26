import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerrySummaryComponent } from './berry-summary.component';

describe('BerrySummaryComponent', () => {
  let component: BerrySummaryComponent;
  let fixture: ComponentFixture<BerrySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BerrySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BerrySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
