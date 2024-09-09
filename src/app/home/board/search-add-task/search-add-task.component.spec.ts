import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAddTaskComponent } from './search-add-task.component';

describe('SearchAddTaskComponent', () => {
  let component: SearchAddTaskComponent;
  let fixture: ComponentFixture<SearchAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAddTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
