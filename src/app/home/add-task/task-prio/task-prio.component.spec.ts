import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPrioComponent } from './task-prio.component';

describe('TaskPrioComponent', () => {
  let component: TaskPrioComponent;
  let fixture: ComponentFixture<TaskPrioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPrioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskPrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
