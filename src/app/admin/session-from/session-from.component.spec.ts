import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFromComponent } from './session-from.component';

describe('SessionFromComponent', () => {
  let component: SessionFromComponent;
  let fixture: ComponentFixture<SessionFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFromComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
