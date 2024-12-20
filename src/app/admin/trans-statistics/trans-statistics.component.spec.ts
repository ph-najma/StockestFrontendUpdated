import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransStatisticsComponent } from './trans-statistics.component';

describe('TransStatisticsComponent', () => {
  let component: TransStatisticsComponent;
  let fixture: ComponentFixture<TransStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
