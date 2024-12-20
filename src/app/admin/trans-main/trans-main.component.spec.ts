import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransMainComponent } from './trans-main.component';

describe('TransMainComponent', () => {
  let component: TransMainComponent;
  let fixture: ComponentFixture<TransMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
