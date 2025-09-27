import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsideLoginComponent } from './rightside-login.component';

describe('RightsideLoginComponent', () => {
  let component: RightsideLoginComponent;
  let fixture: ComponentFixture<RightsideLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightsideLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightsideLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
