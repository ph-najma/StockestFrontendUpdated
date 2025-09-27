import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDiaryComponent } from './trade-diary.component';

describe('TradeDiaryComponent', () => {
  let component: TradeDiaryComponent;
  let fixture: ComponentFixture<TradeDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeDiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
