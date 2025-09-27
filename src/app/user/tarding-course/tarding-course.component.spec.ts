import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TardingCourseComponent } from './tarding-course.component';

describe('TardingCourseComponent', () => {
  let component: TardingCourseComponent;
  let fixture: ComponentFixture<TardingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TardingCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TardingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
