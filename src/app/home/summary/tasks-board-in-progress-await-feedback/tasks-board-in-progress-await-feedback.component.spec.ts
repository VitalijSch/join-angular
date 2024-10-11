import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksBoardInProgressAwaitFeedbackComponent } from './tasks-board-in-progress-await-feedback.component';

describe('TasksBoardInProgressAwaitFeedbackComponent', () => {
  let component: TasksBoardInProgressAwaitFeedbackComponent;
  let fixture: ComponentFixture<TasksBoardInProgressAwaitFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksBoardInProgressAwaitFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksBoardInProgressAwaitFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
