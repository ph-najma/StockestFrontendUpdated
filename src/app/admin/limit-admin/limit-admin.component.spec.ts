import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitAdminComponent } from './limit-admin.component';

describe('LimitAdminComponent', () => {
  let component: LimitAdminComponent;
  let fixture: ComponentFixture<LimitAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
