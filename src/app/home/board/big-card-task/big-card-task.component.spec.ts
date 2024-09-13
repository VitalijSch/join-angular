import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigCardTaskComponent } from './big-card-task.component';

describe('BigCardTaskComponent', () => {
  let component: BigCardTaskComponent;
  let fixture: ComponentFixture<BigCardTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigCardTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BigCardTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
