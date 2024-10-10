import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoAndDoneComponent } from './to-do-and-done.component';

describe('ToDoAndDoneComponent', () => {
  let component: ToDoAndDoneComponent;
  let fixture: ComponentFixture<ToDoAndDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoAndDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToDoAndDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
