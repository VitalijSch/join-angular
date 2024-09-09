import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropHeaderComponent } from './drag-and-drop-header.component';

describe('DragAndDropHeaderComponent', () => {
  let component: DragAndDropHeaderComponent;
  let fixture: ComponentFixture<DragAndDropHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragAndDropHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
