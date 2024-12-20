import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransTableComponent } from './trans-table.component';

describe('TransTableComponent', () => {
  let component: TransTableComponent;
  let fixture: ComponentFixture<TransTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
